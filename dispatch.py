#!/usr/bin/env python3
"""Dispatch a round's stage prompt to every agent configured for that stage.

A *round* is a JSON file describing one pass of work:

    {
      "round": "preflight-stratumC-BUILD2",
      "outdir": "raw",
      "stages": {
        "verify": {
          "prompt_file": "Paste_P3_StratumC_Verifier_FILLED.txt",
          "prompt_sha256_16": "be945235478ff135",
          "agents": [
            {"name": "pfV1", "provider": "anthropic", "model": "claude-sonnet-4-6", "web": true},
            {"name": "pfV2", "provider": "openai",    "model": "gpt-5.1",           "web": true}
          ]
        }
      }
    }

Usage:

    python3 dispatch.py round.json --stage verify --dry-run   # prints, sends nothing
    python3 dispatch.py round.json --stage verify             # sends

Each agent receives the *same* prompt file verbatim as a single user message.
Responses land in <outdir>/ as one .txt (the text) plus one .meta.json
(model, usage, timing, web-search citations) per agent, alongside a manifest
for the whole stage run.

Credentials come from the environment: ANTHROPIC_API_KEY for provider
"anthropic", OPENAI_API_KEY for provider "openai". Missing keys are reported
up front, before anything is sent.

If the stage declares "prompt_sha256_16" (the first 16 hex characters of the
prompt file's SHA-256), the file is checked against it and the run aborts on a
mismatch — so a half-edited prompt can never go out mid-round.

Optional keys, settable on the stage (as a default for its agents) or on an
individual agent:

    web         bool   attach the provider's web search tool (default false)
    max_tokens  int    output cap (default 32000)
    system      str    system prompt / instructions
    effort      str    low|medium|high|xhigh|max — reasoning effort
    thinking    bool   Anthropic only; defaults to on for 4.6-and-later models

Requires: pip install anthropic openai
"""

from __future__ import annotations

import argparse
import concurrent.futures
import hashlib
import json
import os
import re
import sys
import time
import traceback
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

PROVIDERS = ("anthropic", "openai")
DEFAULT_OUTDIR = "raw"
DEFAULT_MAX_TOKENS = 32000
DEFAULT_TIMEOUT = 900.0
DEFAULT_CONCURRENCY = 4

# Models that take `thinking: {"type": "adaptive"}` and the dynamic-filtering
# web search tool. Anything else falls back to no thinking parameter and the
# basic `web_search_20250305` tool, which every web-search model accepts.
ANTHROPIC_MODERN = (
    "claude-fable-5",
    "claude-mythos-5",
    "claude-opus-5",
    "claude-opus-4-8",
    "claude-opus-4-7",
    "claude-opus-4-6",
    "claude-sonnet-5",
    "claude-sonnet-4-6",
)

ENV_KEY = {"anthropic": "ANTHROPIC_API_KEY", "openai": "OPENAI_API_KEY"}

MAX_PAUSE_RESUMES = 5  # server-tool loops can stop with stop_reason "pause_turn"


class ConfigError(Exception):
    """Round file is unusable — bad shape, missing prompt, sha mismatch."""


# ---------------------------------------------------------------- round file


@dataclass
class Agent:
    name: str
    provider: str
    model: str
    web: bool = False
    system: str | None = None
    max_tokens: int = DEFAULT_MAX_TOKENS
    effort: str | None = None
    thinking: bool | None = None  # None = decide from the model id
    extra: dict[str, Any] = field(default_factory=dict)


@dataclass
class Plan:
    round_name: str
    stage: str
    round_path: Path
    prompt_path: Path
    prompt: str
    prompt_sha256: str
    declared_sha16: str | None
    outdir: Path
    agents: list[Agent]


def _slug(value: str) -> str:
    """Filesystem-safe stem. Round and agent names come from JSON — never
    let them walk out of the output directory."""
    cleaned = re.sub(r"[^A-Za-z0-9._-]+", "-", value).strip("-._")
    return cleaned or "unnamed"


def _require(cond: bool, message: str) -> None:
    if not cond:
        raise ConfigError(message)


def _parse_agent(raw: Any, index: int, stage: str, defaults: dict[str, Any]) -> Agent:
    where = f"stages.{stage}.agents[{index}]"
    _require(isinstance(raw, dict), f"{where} must be an object")
    name = raw.get("name")
    _require(isinstance(name, str) and name.strip(), f"{where}.name must be a non-empty string")
    provider = raw.get("provider")
    _require(
        provider in PROVIDERS,
        f"{where}.provider must be one of {', '.join(PROVIDERS)} (got {provider!r})",
    )
    model = raw.get("model")
    _require(isinstance(model, str) and model.strip(), f"{where}.model must be a non-empty string")

    web = raw.get("web", defaults.get("web", False))
    _require(isinstance(web, bool), f"{where}.web must be true or false")

    max_tokens = raw.get("max_tokens", defaults.get("max_tokens", DEFAULT_MAX_TOKENS))
    _require(
        isinstance(max_tokens, int) and max_tokens > 0,
        f"{where}.max_tokens must be a positive integer",
    )

    system = raw.get("system", defaults.get("system"))
    _require(system is None or isinstance(system, str), f"{where}.system must be a string")

    effort = raw.get("effort", defaults.get("effort"))
    _require(
        effort is None or effort in ("low", "medium", "high", "xhigh", "max"),
        f"{where}.effort must be low|medium|high|xhigh|max",
    )

    thinking = raw.get("thinking", defaults.get("thinking"))
    _require(thinking is None or isinstance(thinking, bool), f"{where}.thinking must be true or false")

    known = {"name", "provider", "model", "web", "max_tokens", "system", "effort", "thinking"}
    return Agent(
        name=name,
        provider=provider,
        model=model,
        web=web,
        system=system,
        max_tokens=max_tokens,
        effort=effort,
        thinking=thinking,
        extra={k: v for k, v in raw.items() if k not in known},
    )


def load_plan(round_path: Path, stage: str, outdir_override: str | None) -> Plan:
    try:
        doc = json.loads(round_path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise ConfigError(f"round file not found: {round_path}") from None
    except json.JSONDecodeError as exc:
        raise ConfigError(f"{round_path}: invalid JSON — {exc}") from None

    _require(isinstance(doc, dict), f"{round_path}: top level must be a JSON object")
    round_name = doc.get("round")
    _require(
        isinstance(round_name, str) and round_name.strip(),
        f"{round_path}: \"round\" must be a non-empty string",
    )

    stages = doc.get("stages")
    _require(isinstance(stages, dict) and stages, f"{round_path}: \"stages\" must be a non-empty object")
    if stage not in stages:
        known = ", ".join(sorted(stages)) or "(none)"
        raise ConfigError(f"{round_path}: no stage named {stage!r}. Stages defined: {known}")

    cfg = stages[stage]
    _require(isinstance(cfg, dict), f"stages.{stage} must be an object")

    prompt_file = cfg.get("prompt_file")
    _require(
        isinstance(prompt_file, str) and prompt_file.strip(),
        f"stages.{stage}.prompt_file must be a non-empty string",
    )
    prompt_path = (round_path.parent / prompt_file).resolve()
    if not prompt_path.is_file():
        raise ConfigError(f"stages.{stage}.prompt_file not found: {prompt_path}")

    raw_bytes = prompt_path.read_bytes()
    _require(raw_bytes.strip() != b"", f"prompt file is empty: {prompt_path}")
    prompt_sha256 = hashlib.sha256(raw_bytes).hexdigest()

    declared = cfg.get("prompt_sha256_16")
    if declared is not None:
        _require(
            isinstance(declared, str) and re.fullmatch(r"[0-9a-fA-F]{16}", declared),
            f"stages.{stage}.prompt_sha256_16 must be 16 hex characters",
        )
        if declared.lower() != prompt_sha256[:16]:
            raise ConfigError(
                f"prompt integrity check failed for stages.{stage}\n"
                f"  file     : {prompt_path}\n"
                f"  declared : {declared.lower()}\n"
                f"  actual   : {prompt_sha256[:16]}\n"
                f"If the prompt was edited on purpose, update prompt_sha256_16 to the actual value."
            )

    agents_raw = cfg.get("agents")
    _require(
        isinstance(agents_raw, list) and agents_raw,
        f"stages.{stage}.agents must be a non-empty array",
    )
    defaults = {k: cfg[k] for k in ("web", "max_tokens", "system", "effort", "thinking") if k in cfg}
    agents = [_parse_agent(a, i, stage, defaults) for i, a in enumerate(agents_raw)]

    seen: set[str] = set()
    for agent in agents:
        if agent.name in seen:
            raise ConfigError(f"stages.{stage}: duplicate agent name {agent.name!r}")
        seen.add(agent.name)

    outdir_value = outdir_override or doc.get("outdir") or DEFAULT_OUTDIR
    _require(isinstance(outdir_value, str), f"{round_path}: \"outdir\" must be a string")
    outdir = (round_path.parent / outdir_value).resolve()

    prompt = raw_bytes.decode("utf-8", errors="replace")
    return Plan(
        round_name=round_name,
        stage=stage,
        round_path=round_path,
        prompt_path=prompt_path,
        prompt=prompt,
        prompt_sha256=prompt_sha256,
        declared_sha16=declared.lower() if isinstance(declared, str) else None,
        outdir=outdir,
        agents=agents,
    )


def stem_for(plan: Plan, agent: Agent) -> str:
    return f"{_slug(plan.round_name)}__{_slug(plan.stage)}__{_slug(agent.name)}"


def text_path(plan: Plan, agent: Agent) -> Path:
    return plan.outdir / f"{stem_for(plan, agent)}.txt"


def meta_path(plan: Plan, agent: Agent) -> Path:
    return plan.outdir / f"{stem_for(plan, agent)}.meta.json"


# ------------------------------------------------------------------ sending


@dataclass
class Result:
    agent: str
    status: str  # sent | skipped | error
    text: str = ""
    meta: dict[str, Any] = field(default_factory=dict)
    error: str = ""


def _is_modern_anthropic(model: str) -> bool:
    return any(model.startswith(prefix) for prefix in ANTHROPIC_MODERN)


def _anthropic_tools(agent: Agent) -> list[dict[str, str]]:
    if not agent.web:
        return []
    tool_type = agent.extra.get("web_tool_type") or (
        "web_search_20260209" if _is_modern_anthropic(agent.model) else "web_search_20250305"
    )
    return [{"type": tool_type, "name": "web_search"}]


def send_anthropic(agent: Agent, prompt: str, timeout: float) -> tuple[str, dict[str, Any]]:
    import anthropic

    client = anthropic.Anthropic(timeout=timeout, max_retries=3)
    tools = _anthropic_tools(agent)

    kwargs: dict[str, Any] = {
        "model": agent.model,
        "max_tokens": agent.max_tokens,
        "messages": [{"role": "user", "content": prompt}],
    }
    if agent.system:
        kwargs["system"] = agent.system
    if tools:
        kwargs["tools"] = tools
    use_thinking = agent.thinking if agent.thinking is not None else _is_modern_anthropic(agent.model)
    if use_thinking:
        kwargs["thinking"] = {"type": "adaptive"}
    if agent.effort:
        kwargs["output_config"] = {"effort": agent.effort}

    messages = list(kwargs["messages"])
    searches = 0
    citations: list[dict[str, str]] = []
    resumes = 0

    while True:
        # Stream so a long verifier answer can't trip the HTTP timeout.
        with client.messages.stream(**{**kwargs, "messages": messages}) as stream:
            message = stream.get_final_message()

        for block in message.content:
            btype = getattr(block, "type", "")
            if btype == "server_tool_use" and getattr(block, "name", "") == "web_search":
                searches += 1
            elif btype == "web_search_tool_result":
                content = getattr(block, "content", None)
                # A server-tool error returns a single object here, not a list.
                if isinstance(content, list):
                    for item in content:
                        url = getattr(item, "url", None)
                        if url:
                            citations.append({"url": url, "title": getattr(item, "title", "") or ""})

        if message.stop_reason != "pause_turn":
            break
        resumes += 1
        if resumes > MAX_PAUSE_RESUMES:
            raise RuntimeError(
                f"turn still paused after {MAX_PAUSE_RESUMES} resumes (server tool loop did not finish)"
            )
        # Re-send the paused assistant turn verbatim; the server resumes it.
        messages = messages[:1] + [{"role": "assistant", "content": message.content}]

    text = "\n".join(b.text for b in message.content if getattr(b, "type", "") == "text")
    meta = {
        "response_id": message.id,
        "model": message.model,
        "stop_reason": message.stop_reason,
        "usage": message.usage.model_dump() if hasattr(message.usage, "model_dump") else None,
        "tools": tools,
        "thinking": kwargs.get("thinking"),
        "effort": agent.effort,
        "web_searches": searches,
        "pause_turn_resumes": resumes,
        "citations": citations,
    }
    return text, meta


def send_openai(agent: Agent, prompt: str, timeout: float) -> tuple[str, dict[str, Any]]:
    import openai

    client = openai.OpenAI(timeout=timeout, max_retries=3)
    tools = [{"type": "web_search"}] if agent.web else []

    kwargs: dict[str, Any] = {
        "model": agent.model,
        "input": [{"role": "user", "content": prompt}],
        "max_output_tokens": agent.max_tokens,
    }
    if agent.system:
        kwargs["instructions"] = agent.system
    if tools:
        kwargs["tools"] = tools
    if agent.effort:
        kwargs["reasoning"] = {"effort": agent.effort}

    response = client.responses.create(**kwargs)

    searches = 0
    citations: list[dict[str, str]] = []
    for item in getattr(response, "output", []) or []:
        if getattr(item, "type", "") == "web_search_call":
            searches += 1
        for block in getattr(item, "content", None) or []:
            for note in getattr(block, "annotations", None) or []:
                url = getattr(note, "url", None)
                if url:
                    citations.append({"url": url, "title": getattr(note, "title", "") or ""})

    meta = {
        "response_id": response.id,
        "model": response.model,
        "status": response.status,
        "usage": response.usage.model_dump() if getattr(response, "usage", None) else None,
        "tools": tools,
        "effort": agent.effort,
        "web_searches": searches,
        "citations": citations,
    }
    return response.output_text or "", meta


SENDERS = {"anthropic": send_anthropic, "openai": send_openai}


def run_agent(plan: Plan, agent: Agent, timeout: float, force: bool) -> Result:
    out_txt = text_path(plan, agent)
    if out_txt.exists() and not force:
        # Carry the earlier run's metadata forward so a resumed round's
        # manifest still describes what this agent actually returned.
        try:
            previous = json.loads(meta_path(plan, agent).read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            previous = {"text_file": out_txt.name}
        return Result(
            agent.name,
            "skipped",
            meta=previous,
            error=f"{out_txt.name} already exists (use --force to resend)",
        )

    started = time.time()
    started_at = datetime.now(timezone.utc).isoformat(timespec="seconds")
    try:
        text, meta = SENDERS[agent.provider](agent, plan.prompt, timeout)
    except Exception as exc:  # noqa: BLE001 — one agent's failure must not sink the round
        return Result(agent.name, "error", error=f"{type(exc).__name__}: {exc}")

    elapsed = round(time.time() - started, 2)
    meta.update(
        {
            "round": plan.round_name,
            "stage": plan.stage,
            "agent": agent.name,
            "provider": agent.provider,
            "requested_model": agent.model,
            "max_tokens": agent.max_tokens,
            "web": agent.web,
            "prompt_file": str(plan.prompt_path),
            "prompt_sha256": plan.prompt_sha256,
            "prompt_sha256_16": plan.prompt_sha256[:16],
            "started_at": started_at,
            "elapsed_seconds": elapsed,
            "text_file": text_path(plan, agent).name,
            "chars": len(text),
        }
    )

    plan.outdir.mkdir(parents=True, exist_ok=True)
    out_txt.write_text(text, encoding="utf-8")
    meta_path(plan, agent).write_text(json.dumps(meta, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return Result(agent.name, "sent", text=text, meta=meta)


# -------------------------------------------------------------------- report


def print_dry_run(plan: Plan, timeout: float, force: bool, show_prompt: bool) -> None:
    print("DRY RUN — nothing will be sent.\n")
    print(f"round      : {plan.round_name}")
    print(f"stage      : {plan.stage}")
    print(f"round file : {plan.round_path}")
    print(f"prompt     : {plan.prompt_path}")
    print(f"             {len(plan.prompt):,} chars, {plan.prompt.count(chr(10)) + 1:,} lines")
    if plan.declared_sha16:
        print(f"sha256[:16]: {plan.prompt_sha256[:16]}  (matches round file)")
    else:
        print(f"sha256[:16]: {plan.prompt_sha256[:16]}  (not declared in round file)")
    print(f"outdir     : {plan.outdir}{'' if plan.outdir.is_dir() else '  (will be created)'}")
    print(f"timeout    : {timeout:g}s per agent")
    print()

    for agent in plan.agents:
        tools = _anthropic_tools(agent) if agent.provider == "anthropic" else (
            [{"type": "web_search"}] if agent.web else []
        )
        endpoint = "messages.create (streamed)" if agent.provider == "anthropic" else "responses.create"
        key = ENV_KEY[agent.provider]
        key_state = "set" if os.environ.get(key) else "MISSING"
        out_txt = text_path(plan, agent)
        exists = out_txt.exists()
        action = "resend (--force)" if exists and force else ("skip — output exists" if exists else "send")

        print(f"  {agent.name}")
        print(f"    provider  : {agent.provider}  [{key}: {key_state}]")
        print(f"    model     : {agent.model}")
        print(f"    endpoint  : {endpoint}")
        print(f"    tools     : {json.dumps(tools) if tools else '(none)'}")
        if agent.provider == "anthropic":
            use_thinking = agent.thinking if agent.thinking is not None else _is_modern_anthropic(agent.model)
            print(f"    thinking  : {'adaptive' if use_thinking else 'off'}")
        print(f"    max_tokens: {agent.max_tokens}")
        if agent.effort:
            print(f"    effort    : {agent.effort}")
        if agent.system:
            print(f"    system    : {agent.system[:70]}{'…' if len(agent.system) > 70 else ''}")
        if agent.extra:
            print(f"    extra     : {json.dumps(agent.extra)}")
        print(f"    writes    : {out_txt.name}")
        print(f"                {meta_path(plan, agent).name}")
        print(f"    action    : {action}")
        print()

    missing = sorted({ENV_KEY[a.provider] for a in plan.agents if not os.environ.get(ENV_KEY[a.provider])})
    if missing:
        print(f"NOTE: a real run would fail — unset credentials: {', '.join(missing)}")
    if show_prompt:
        print("-" * 72)
        print(plan.prompt)
        print("-" * 72)


def write_manifest(plan: Plan, results: list[Result], elapsed: float) -> Path:
    path = plan.outdir / f"{_slug(plan.round_name)}__{_slug(plan.stage)}__manifest.json"
    manifest = {
        "round": plan.round_name,
        "stage": plan.stage,
        "finished_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "elapsed_seconds": round(elapsed, 2),
        "prompt_file": str(plan.prompt_path),
        "prompt_sha256": plan.prompt_sha256,
        "prompt_sha256_16": plan.prompt_sha256[:16],
        "agents": [
            {
                "agent": r.agent,
                "status": r.status,
                "error": r.error or None,
                "text_file": r.meta.get("text_file"),
                "chars": r.meta.get("chars"),
                "model": r.meta.get("model"),
                "web_searches": r.meta.get("web_searches"),
                "elapsed_seconds": r.meta.get("elapsed_seconds"),
            }
            for r in results
        ],
    }
    plan.outdir.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return path


# ---------------------------------------------------------------------- main


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="dispatch.py",
        description="Send a round's stage prompt to every agent configured for that stage.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "examples:\n"
            "  python3 dispatch.py round.json --stage verify --dry-run\n"
            "  python3 dispatch.py round.json --stage verify\n"
            "  python3 dispatch.py round.json --stage verify --agent pfV2 --force\n"
        ),
    )
    parser.add_argument("round_file", help="path to the round JSON file")
    parser.add_argument("--stage", help="stage name to dispatch (key under \"stages\")")
    parser.add_argument("--list-stages", action="store_true", help="list stages and agents, then exit")
    parser.add_argument("--dry-run", action="store_true", help="print the plan; send nothing")
    parser.add_argument(
        "--agent", action="append", default=[], metavar="NAME",
        help="only dispatch this agent (repeatable)",
    )
    parser.add_argument("--outdir", help="override the round file's outdir")
    parser.add_argument("--force", action="store_true", help="resend agents whose output already exists")
    parser.add_argument(
        "--concurrency", type=int, default=DEFAULT_CONCURRENCY, metavar="N",
        help=f"agents to run in parallel (default {DEFAULT_CONCURRENCY})",
    )
    parser.add_argument(
        "--timeout", type=float, default=DEFAULT_TIMEOUT, metavar="SECONDS",
        help=f"per-agent request timeout (default {DEFAULT_TIMEOUT:g})",
    )
    parser.add_argument("--show-prompt", action="store_true", help="print the prompt text in --dry-run")
    return parser


def list_stages(round_path: Path) -> int:
    try:
        doc = json.loads(round_path.read_text(encoding="utf-8"))
        stages = doc["stages"]
    except (OSError, json.JSONDecodeError, KeyError, TypeError) as exc:
        print(f"error: cannot read stages from {round_path}: {exc}", file=sys.stderr)
        return 2
    print(f"round: {doc.get('round', '(unnamed)')}")
    for name, cfg in stages.items():
        agents = cfg.get("agents", []) if isinstance(cfg, dict) else []
        print(f"  {name}  ({len(agents)} agent{'s' if len(agents) != 1 else ''})")
        for agent in agents:
            web = " +web" if agent.get("web") else ""
            print(f"    - {agent.get('name')}: {agent.get('provider')}/{agent.get('model')}{web}")
    return 0


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    round_path = Path(args.round_file).expanduser().resolve()

    if args.list_stages:
        return list_stages(round_path)
    if not args.stage:
        print("error: --stage is required (or use --list-stages)", file=sys.stderr)
        return 2

    try:
        plan = load_plan(round_path, args.stage, args.outdir)
    except ConfigError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2

    if args.agent:
        wanted = set(args.agent)
        unknown = wanted - {a.name for a in plan.agents}
        if unknown:
            print(f"error: no such agent in stage {plan.stage!r}: {', '.join(sorted(unknown))}", file=sys.stderr)
            return 2
        plan.agents = [a for a in plan.agents if a.name in wanted]

    if args.dry_run:
        print_dry_run(plan, args.timeout, args.force, args.show_prompt)
        return 0

    missing = sorted({ENV_KEY[a.provider] for a in plan.agents if not os.environ.get(ENV_KEY[a.provider])})
    if missing:
        print(f"error: missing credentials: {', '.join(missing)}", file=sys.stderr)
        print("       nothing was sent.", file=sys.stderr)
        return 2

    print(f"round {plan.round_name} · stage {plan.stage} · {len(plan.agents)} agent(s)")
    print(f"prompt {plan.prompt_path.name} · sha256[:16] {plan.prompt_sha256[:16]}")
    print(f"outdir {plan.outdir}\n")

    started = time.time()
    workers = max(1, min(args.concurrency, len(plan.agents)))
    results: list[Result] = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=workers) as pool:
        futures = {
            pool.submit(run_agent, plan, agent, args.timeout, args.force): agent
            for agent in plan.agents
        }
        for future in concurrent.futures.as_completed(futures):
            agent = futures[future]
            try:
                result = future.result()
            except Exception:  # noqa: BLE001 — defensive; run_agent already catches
                result = Result(agent.name, "error", error=traceback.format_exc(limit=3))
            results.append(result)
            if result.status == "sent":
                print(
                    f"  [ok]   {result.agent}: {result.meta['chars']:,} chars in "
                    f"{result.meta['elapsed_seconds']:g}s → {result.meta['text_file']}"
                )
            elif result.status == "skipped":
                print(f"  [skip] {result.agent}: {result.error}")
            else:
                print(f"  [FAIL] {result.agent}: {result.error}", file=sys.stderr)

    order = {a.name: i for i, a in enumerate(plan.agents)}
    results.sort(key=lambda r: order[r.agent])
    manifest = write_manifest(plan, results, time.time() - started)

    sent = sum(r.status == "sent" for r in results)
    skipped = sum(r.status == "skipped" for r in results)
    failed = sum(r.status == "error" for r in results)
    print(f"\n{sent} sent, {skipped} skipped, {failed} failed · manifest {manifest.name}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
