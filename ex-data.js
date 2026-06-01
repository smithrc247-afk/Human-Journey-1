/* ============================================================
   ex-data.js — The Excluded, the Cracks & the Counter-Cases
   Part IV of "Archy: A Natural History of Power Over Others".
   ------------------------------------------------------------
   This part cuts ACROSS the eras. Four chapters, each a theme
   you pick and trace along the arc:
     1. The sorted — who was pushed below (5 axes), through the
        whole institutional stack.
     2. Resistance without revolt — the quiet counter-current.
     3. The counter-cases — societies that refused kings.
     4. The material drivers — technology & ecology.

   Each theme carries beats (era- or form-anchored), and where
   relevant the institutional stack a hierarchy ran through.
   Certainty degrades as the beats reach back in time.
   ============================================================ */

/* the institutional stack a hierarchy is built through */
window.EX_STACK = ["Household", "Religion", "School", "State", "Profession", "Corporation", "Society"];

window.EX_GROUPS = [
  { id: "sorted",  kicker: "Chapter 1", label: "The sorted",        sub: "who was pushed below" },
  { id: "cracks",  kicker: "Chapter 2", label: "The cracks",        sub: "resistance without revolt" },
  { id: "cases",   kicker: "Chapter 3", label: "The counter-cases", sub: "societies that refused kings" },
  { id: "matter",  kicker: "Chapter 4", label: "The material",      sub: "technology & ecology" },
];

window.EX_THEMES = [
  /* ---------- Chapter 1 — the sorted (axes of exclusion) ---------- */
  {
    id: "gender", group: "sorted", title: "Gender",
    tagline: "The oldest archy, nested in every structure",
    framing: "Patriarchy is the oldest hierarchy and the most thoroughly distributed across the institutional stack — which is why it has been the hardest to dislodge: there is no single fortress to storm. Gerda Lerner argued that male control of women's reproductive and productive labour was not a by-product of inequality but one of its sources — perhaps rehearsed on women and captives within the household before it was generalised into class and slavery.",
    stack: true,
    beats: [
      { mark: "Forager", sub: "the baseline", text: "A gendered division of labour exists, but in mobile bands it confers little power difference — women's gathering often supplies the dietary staple, and nothing can be hoarded." },
      { mark: "Neolithic → first states", sub: "the household forms", text: "The household becomes the unit of property and inheritance — and controlling that inheritance means controlling women's reproduction. Bride-price, dowry, the policing of female sexuality and the legal subordination of wife to husband appear." },
      { mark: "Classical", sub: "codified", text: "The Roman paterfamilias holds the legal power of life and death; coverage of women under their husbands' legal person begins its long run. Athenian democracy is built on their exclusion." },
      { mark: "Industrial", sub: "separate spheres", text: "Industry hardens a gendered divide — the waged 'public' man, the unpaid domestic woman — even as it pulls women and children onto the factory floor; the 'marriage bar' fires women on marriage." },
      { mark: "The present", sub: "uneven liberation", text: "Formal state rights are won — the vote, property, legal personhood — while subordination persists in the household, the workplace and the social sphere. 'The personal is political' names exactly this." },
    ],
    lesson: "Women won formal rights from the state while remaining subordinated everywhere else — which is why the movement had to fight on so many fronts. You cannot legislate the household free.",
  },
  {
    id: "race", group: "sorted", title: "Race",
    tagline: "The hierarchy that was manufactured, then naturalized",
    framing: "Race is the youngest of the great axes, and the one whose manufacture we can almost date. Premodern slavery and ethnic prejudice existed everywhere, but the idea that humanity divides into biologically ranked races was substantially built to justify Atlantic chattel slavery — an ideology produced to resolve the contradiction between Enlightenment universalism and the brute fact of holding humans as property.",
    stack: true,
    beats: [
      { mark: "Before E6", sub: "prejudice, not race", text: "Slavery and ethnic hostility are ancient and ubiquitous — but there is not yet a doctrine of fixed, biological racial rank ordering all of humanity." },
      { mark: "Mercantile / Atlantic", sub: "manufactured", text: "Race is built as an ideology to justify Atlantic chattel slavery — defining the enslaved as a permanent, heritable, 'sub-human' category, made uncrossable by colour." },
      { mark: "Industrial", sub: "codified & enforced", text: "Slave codes give way to segregation laws, citizenship and immigration restriction by origin, then apartheid — the legal architecture of racial subordination, with redlining and the colour bar converting it into durable economic inequality." },
      { mark: "The present", sub: "law ahead of structure", text: "Legal abolition of racial hierarchy runs far ahead of its abolition in the corporate, professional and social structures, where it persists as inherited wealth gaps, occupational sorting and informal exclusion." },
    ],
    lesson: "Striking down the law is necessary and nowhere near sufficient — the hierarchy had been built into every other structure too.",
  },
  {
    id: "age", group: "sorted", title: "Age",
    tagline: "The one hierarchy everyone passes through",
    framing: "Age is the strangest axis because, uniquely, everyone occupies every position in turn — we are all once young, and most of us become old. This makes it the least 'us versus them' of the hierarchies, and yet a real structure of power. Age status tracks the technology of knowledge and the structure of work.",
    stack: false,
    beats: [
      { mark: "Forager", sub: "the elder as library", text: "In a non-literate world the old ARE the library — the repository of survival knowledge, genealogy and precedent — so elders hold high status precisely for what they carry." },
      { mark: "First states onward", sub: "memory externalised", text: "The written word, then print and the database, progressively displace the elder's monopoly on knowledge. The young are the near-property of the household; child labour is the norm, not the exception." },
      { mark: "Industrial", sub: "childhood invented", text: "Reform makes childhood a protected category and compulsory schooling redefines the child as a student rather than a worker. Pensions answer the way industry stripped the old of their former household role." },
      { mark: "The present", sub: "novelty over memory", text: "Economies organised around rapid skill turnover push the old out — mandatory retirement, 'obsolete' skills. Children remain among the least enfranchised people, represented only indirectly." },
    ],
    lesson: "Where memory and continuity are valuable, the old rise; where novelty and physical output dominate, they fall.",
  },
  {
    id: "disability", group: "sorted", title: "Disability",
    tagline: "The axis defined by the structure itself",
    framing: "Disability reveals something the other axes obscure: that exclusion is often produced by the structure, not the body. An impairment is disabling only relative to how a society organises work, space and worth — the same body excluded by a staircase is included by a ramp. This is the core insight of the 'social model': the disability is in the built environment, not only the person.",
    stack: false,
    beats: [
      { mark: "Forager → Neolithic", sub: "care and its limit", text: "Survival of people with significant impairments depends on the group's surplus and ethos — the archaeological record shows both deep care (individuals who survived years needing support) and, under scarcity, abandonment." },
      { mark: "Feudal", sub: "the charity model", text: "Religion frames disability as divine punishment, test, or object of charity — producing the almshouse and the hospital: structures of care that are also structures of control and segregation." },
      { mark: "Industrial", sub: "legibility's dark turn", text: "The same legibility-drive that lets the modern state serve its population also lets it classify, institutionalise, sterilise — and, in the Nazi case, murder. Eugenics is one of the scientific Legitimator's darkest products." },
      { mark: "The present", sub: "the structure must change", text: "The disability rights movement reframes the issue from individual medical deficit to societal exclusion, winning accessibility mandates and anti-discrimination law — a genuinely new emancipation claim." },
    ],
    lesson: "A new kind of claim: not that the person must be fixed to fit the world, but that the world must be changed to fit the person.",
  },
  {
    id: "sexuality", group: "sorted", title: "Sexuality",
    tagline: "Gender nonconformity & the axis of visibility",
    framing: "LGBTQ people present a distinct pattern: an axis where the degree of recognition itself — whether the category was even named, criminalized, pathologized, or accepted — swung dramatically across eras and cultures, sometimes more than the underlying acceptance. The record genuinely resists a simple progress narrative.",
    stack: false,
    beats: [
      { mark: "Classical & before", sub: "woven in, or punished", text: "Some societies incorporated same-sex relationships and third-gender roles into their accepted structures within specific norms; others criminalised and persecuted them severely." },
      { mark: "Feudal", sub: "sin", text: "The religious institution becomes the principal definer and persecutor, framing same-sex behaviour and gender nonconformity as sin." },
      { mark: "Industrial", sub: "pathologised", text: "The state takes up criminal persecution (sodomy laws); medicine adds a pathologising layer, reclassifying 'sin' as 'mental illness' — sometimes reducing penalty while imposing a new structure of medical control." },
      { mark: "The present", sub: "the fastest swing", text: "Among the most rapid transformations in this whole analysis — decriminalisation, depathologisation, anti-discrimination, same-sex marriage — though deeply uneven across the world and subject to backlash." },
    ],
    lesson: "The clearest live demonstration that hierarchies are constructed and contingent: a category's position can shift dramatically within a single generation.",
  },

  /* ---------- Chapter 2 — the quiet counter-current ---------- */
  {
    id: "resistance", group: "cracks", title: "Resistance without revolt",
    tagline: "The quiet counter-current",
    framing: "The dramatic counter-currents — the jubilee, Spartacus, the peasant risings, abolition, the unions — are only the visible part. Open revolt is rare, dangerous, and usually crushed; for most people in most eras, rising up was simply suicidal. So they resisted in quieter, slower, survivable ways. James C. Scott called these the 'weapons of the weak' — not failures to resist, but resistance in the form it takes when open defiance means death.",
    stack: false,
    beats: [
      { mark: "Flight & exit", sub: "the oldest weapon", text: "Inherited from the forager's right to walk away. The maroon communities of escaped slaves (Palmares sheltered thousands for most of a century); serfs fleeing to towns, where 'town air makes free.' Every archy works to abolish exit — which is exactly why, where it survives, the powerful are checked." },
      { mark: "Sabotage & the slowdown", sub: "revolt's survivable cousin", text: "The enslaved person who 'accidentally' breaks the plough; the worker who throws a shoe in the machine; the work-to-rule that follows every rule so literally that production grinds to a halt. None can be punished as mutiny, because nothing was openly refused." },
      { mark: "The hidden transcript", sub: "satire, gossip, the safe space", text: "The critique of power shared among the subordinate, out of the master's hearing, while performing deference to his face — spirituals with double meanings, folktales where the clever weak outwit the strong. The seedbank of the counter-current." },
      { mark: "Building the alternative", sub: "resistance as construction", text: "The mutual-aid society, the cooperative, the underground school, the dissident church — pockets inside the shell of the hierarchical society that run on different principles, and double as the base from which open movements later grow." },
      { mark: "Using the master's tools", sub: "law, literacy, the appeal upward", text: "Turning the powerful's own instruments against them — litigating for freedom in the colonizer's courts, holding nations to the promises in their own founding documents. The jubilee logic inverted: relief demanded, not granted." },
    ],
    lesson: "It is always available, cumulatively decisive, and it preserves the alternative. The leveling consciousness of the foragers was never extinguished — the powerless carried it underground in their jokes, their songs and their refusals, ready to surface whenever a crack appeared.",
  },

  /* ---------- Chapter 3 — the counter-cases ---------- */
  {
    id: "countercases", group: "cases", title: "Societies that refused kings",
    tagline: "The counter-cases",
    framing: "The inevitability thesis lives or dies on the exceptions. If every complex society became a hierarchy, then archy is destiny and the rest is decoration. But complex societies that stayed flat, or built genuine scale without permanent rulers, are scattered across the whole record — the strongest evidence in the entire work that hierarchy is a choice repeatedly made and repeatedly refused, not a law of social physics.",
    stack: false,
    beats: [
      { mark: "Çatalhöyük", sub: "Neolithic Anatolia", text: "Thousands of fully agricultural people, for roughly a thousand years, in near-identical houses with no palace and no elite quarter. Surplus and density without rank — the single hardest case for strong inevitability." },
      { mark: "The Indus Valley", sub: "c. 2600–1900 BCE", text: "Some of the largest, most sophisticated planned cities of the ancient world, run for centuries with no convincing palaces, royal tombs, or god-king iconography — complexity without the king." },
      { mark: "Trypillia mega-sites", sub: "Neolithic Ukraine", text: "Thousands gathered into large planned settlements arranged in egalitarian concentric circles, apparently governed without a dominating centre." },
      { mark: "The Haudenosaunee", sub: "Indigenous North America", text: "Nations united under the Great Law of Peace and governed by consensus, with chiefs chosen and removable by clan mothers — accountable, gendered toward women's political authority, and explicitly designed to prevent domination." },
      { mark: "African 'acephalous' orders", sub: "the Igbo, Tiv, Nuer & others", text: "Substantial populations organised without centralised rulers — through age-sets, councils and heterarchy. Colonial powers often could not even recognise it as governance, and imposed 'warrant chiefs' where none had existed." },
      { mark: "The pirate articles", sub: "early 18th century", text: "Crews largely of the violently excluded signed written articles: an elected, deposable captain, plunder shared on a flat scale, compensation for the injured. A floating democracy designed by people who had known hierarchy at its worst." },
    ],
    lesson: "Complex society does not require kings; accountable power is an achievement, reached independently many times — and, repeatedly, archy had to be actively imposed and the flatter alternatives actively destroyed.",
  },

  /* ---------- Chapter 4 — the material drivers ---------- */
  {
    id: "material", group: "matter", title: "The material drivers",
    tagline: "Technology & ecology, beneath the social story",
    framing: "Underneath the social story of mechanisms and roles runs a material one: specific technologies and ecological conditions that opened or closed the doors to power, often decisively. They explain why the mechanisms switched on when and where they did. A caution, though: the same tool empowers domination in one setting and resistance in another — technology shifts the odds, it does not dictate the outcome.",
    stack: false,
    beats: [
      { mark: "Grain & the plough", sub: "the storable-surplus complex", text: "Domesticated cereals create wealth that can be hoarded, counted, taxed and inherited. Eurasia's large draft animals let a wealthy household work far more land than its own muscles could — much of why Old World inequality climbed toward ~0.59 while the New World plateaued lower. A single ecological accident shaped two hemispheres." },
      { mark: "Metals & the mounted warrior", sub: "bronze, iron, the horse", text: "Iron democratised tools and weapons; but bronze arms, the chariot and the armoured cavalryman built a military aristocracy. The feudal knight is, materially, a man who can afford a warhorse and armour." },
      { mark: "The technologies of legibility", sub: "writing → print → the database", text: "Writing gave power its memory; the printing press both served the state and shattered its monopoly on legitimation (it powered the Reformation and every later revolution's pamphlets); the database gives power not just memory but prediction." },
      { mark: "The energy revolutions", sub: "fossil fuels", text: "Steam, then the internal-combustion engine and electrification, multiplied society's available power by orders of magnitude — the material foundation of industrial capitalism, and a new resource to hold power over: the coal seam, the oil field." },
      { mark: "Ecology as constraint & shock", sub: "across the whole arc", text: "Climate shifts toppled regimes; the Black Death killed enough people to invert the land–labour ratio and dissolve western serfdom; defensible mountains and swamps gave maroons and rebels somewhere to flee, preserving exit." },
    ],
    lesson: "Technology and ecology load the dice; the social mechanisms and human choices throw them. Çatalhöyük had the grain and stayed flat; the Indus had the cities and seemingly no kings. Neither the purely material nor the purely social account is complete.",
  },
];

window.exThemesByGroup = function (gid) { return window.EX_THEMES.filter(function (t) { return t.group === gid; }); };
window.exTheme = function (id) { return window.EX_THEMES.find(function (t) { return t.id === id; }); };
