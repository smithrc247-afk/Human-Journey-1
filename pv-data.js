/* ============================================================
   pv-data.js — The Case Against This Analysis  (Part V)
   ------------------------------------------------------------
   The honest objections. Five steelmanned arguments against the
   whole project — each given its full force — with the work's
   replies and its concessions. Then: what actually survives.
   `dent` (0–1) = how much the objection dents the thesis.
   ============================================================ */

window.PV_INTRO = "A work that argues a position should be able to make the strongest possible case against itself. This inquiry leans toward one reading: that archy is a contingent deviation from a human capacity for equality — built rather than natural, and therefore able to be unbuilt. That reading is contestable. Here are the five strongest objections, each owed its full force — not as straw men to be knocked down, but as arguments a thoughtful reader might find more convincing than the thesis.";

window.PV_OBJECTIONS = [
  {
    id: "natural", num: "01", title: "Hierarchy is natural, not a deviation",
    strength: "Unsettling", dent: 0.5,
    objection: {
      lead: "We are primates, and primates build dominance hierarchies. Our closest relatives live in steep, often violent status orders; the drive to rise is deeply rooted in us.",
      points: [
        "Forager equality is not our natural state but a hard-won, fragile suppression of a natural tendency to dominate.",
        "You don't need elaborate machinery to enforce a tendency that comes naturally — you need it to suppress one that doesn't. The very existence of the leveling toolkit proves the dominance drive was always straining against the leash.",
        "The moment conditions allowed — surplus, sedentism — hierarchy reasserted itself everywhere, because it was the default all along.",
      ],
    },
    reply: {
      lead: "The capacity for both is real — and the leveling machinery is exactly the proof that humans can, and did, choose equality for the vast majority of our existence.",
      points: [
        "That foragers had to work at equality doesn't make it unnatural; it makes it a choice, repeatedly and successfully made.",
        "Domination and its suppression are both ancient and co-present — which one prevails is a matter of institutions and conditions, not biology.",
      ],
    },
    concession: "But the objection has force: it should unsettle anyone too confident that equality is our 'true' nature, merely waiting to be liberated.",
  },
  {
    id: "efficient", num: "02", title: "Hierarchy is efficient — it funded everything good",
    strength: "Serious", dent: 0.55,
    objection: {
      lead: "Coordination at scale requires coordinators. The surplus elites extracted also funded the specialists — metallurgists, astronomers, scribes, artists — whose work built our science, technology and art.",
      points: [
        "Division of labour, the engine of all progress, requires that some people not farm — and is inseparable from some people directing others.",
        "Forager equality came bundled with permanent poverty, no writing, no medicine, no accumulated knowledge — flat precisely because there was almost nothing to be unequal about.",
        "The god-king was monstrous, but his granary kept people alive through the lean years, and the civilisation he taxed into being eventually produced the very ideas of rights and equality this work champions. You may not get the Enlightenment without first having the pharaohs.",
      ],
    },
    reply: {
      lead: "The counter-cases show much of this coordination was achievable without permanent rulers — and the 'hierarchy funded progress' story conveniently credits the elite for the work of the many.",
      points: [
        "Çatalhöyük, the Indus cities and the headless societies of Africa built scale, surplus and complexity without kings.",
        "Still, the burden is on the egalitarian to show that complex coordination and accumulated knowledge can be sustained at scale without some concentration of authority — a thing more often asserted than demonstrated.",
      ],
    },
    concession: "The functionalist case is not absurd, and it is the egalitarian who is left owing the harder proof.",
  },
  {
    id: "innovation", num: "03", title: "Inequality is the price of innovation and freedom",
    strength: "Cuts deep", dent: 0.55,
    objection: {
      lead: "If people are free to work, create and trade, they will produce unequal results — because talents and efforts are unequal. The alternative, enforced equality of outcome, requires exactly the coercive central power this work otherwise deplores.",
      points: [
        "The 20th century's attempts to abolish inequality by force produced not equality but new and often murderous hierarchies of party and state.",
        "The incentive to rise — to get rich by building something people want — drives the innovation that has lifted billions out of the absolute poverty that was the real condition of the egalitarian past.",
        "A society that lets no one rise far above the rest may be equal, but it may also be stagnant and poor, and its equality may require a boot on every neck to maintain.",
      ],
    },
    reply: {
      lead: "There is a vast space between 'some inequality from genuine free contribution' and the present concentration, where a few thousand people hold more than half of humanity.",
      points: [
        "The question is not equality versus inequality but how much, from what, and with what mobility.",
        "This objection turns the work's own value — its fear of coercion — against it, which is exactly why it cuts deep.",
      ],
    },
    concession: "'Abolish inequality' is a dangerous slogan if it is not disciplined by the question of what replaces it.",
  },
  {
    id: "romantic", num: "04", title: "The egalitarian past is romanticized",
    strength: "Fair", dent: 0.45,
    objection: {
      lead: "The societies held up as proof that things can be otherwise were, by most measures we care about, grim.",
      points: [
        "Forager and stateless life often meant short lifespans, high child mortality, chronic vulnerability to famine — and rates of violent death from raiding and feud that, as a share of population, often exceeded the modern states this work criticises.",
        "The 'equality' was partly the equality of shared poverty and shared danger; the admired leveling included, at the extreme, killing people who got too big — egalitarianism enforced by homicide.",
        "The stateless societies offered as alternatives had their own slaveries, patriarchies and cruelties. Selecting the flat, accountable cases while passing over the violent ones is cherry-picking in service of a thesis.",
      ],
    },
    reply: {
      lead: "The work has tried to flag these — the forager execution of upstarts, the repeated 'don't romanticise' cautions.",
      points: [
        "The thesis never required that the past was a paradise, only that sustained political equality was possible and real.",
        "But the objection is correct that the selection of cases tilts hopeful.",
      ],
    },
    concession: "An honest account must weigh the brutal stateless societies as heavily as the admirable ones.",
  },
  {
    id: "scheidel", num: "05", title: "Inequality never falls without catastrophe",
    strength: "The gravest", dent: 0.8, attribution: "after Walter Scheidel, The Great Leveler",
    objection: {
      lead: "Since humans began to farm, herd and pass on assets, only violent events have ever significantly lessened inequality.",
      points: [
        "Scheidel's 'Four Horsemen' — mass-mobilisation warfare, transformative revolution, state collapse, and catastrophic plague — are the only forces that have reliably flattened the pyramid.",
        "The peaceful reforms this work celebrates — unions, the franchise, the welfare state — were largely products of the upheaval of the two World Wars; once that shock faded, after 1945 top tax rates fell and inequality resumed its climb.",
        "The Black Death levelled by killing enough people to invert the land–labour ratio — and was slowly reversed as populations rebounded. That the Horsemen have now 'dismounted' is also the bad news: the only force that ever flattened the pyramid is gone.",
      ],
    },
    reply: {
      lead: "This deserves the most serious engagement, because it is built on the same evidence. Three replies are available — and none is a knockout.",
      points: [
        "Measurement: Scheidel tracks material wealth; archy is broader. The abolition of slavery, coverture, legal caste and segregation, and the enfranchisement of women, are real, durable, largely peaceful reductions in the power of one human over another.",
        "Causation is contested: other scholars argue he underweights organised politics, ideas and institutions — and that the violence and the reform were intertwined, not one the sole cause of the other.",
        "The future is not the past: new energy systems, information technologies and ecological limits may not be bound by the agrarian iron law — for better or worse.",
      ],
    },
    concession: "But intellectual honesty requires the concession: Scheidel may simply be right, and the hopeful reading wrong. The comfortable stability of the present may itself be the trap.",
  },
];

window.PV_SURVIVES = {
  title: "What survives the objections",
  lead: "Held together, what survives is not the strongest version of the thesis — not 'equality is our true nature and archy is a removable error.' It is the weaker, more defensible claim the work actually built toward:",
  claims: [
    "Archy is conditional, not inevitable.",
    "Humans demonstrably carry both the capacity to dominate and the capacity to level.",
    "Which one prevails depends on mechanisms, roles, material conditions, and choices — arranged many different ways across history.",
    "The arrangement is therefore contestable — open now, as it has always been.",
  ],
  close: "We are the animal that builds both hierarchy and its undoing. The evidence of the whole long record is not that one is bound to win, but that the contest is permanent.",
};
