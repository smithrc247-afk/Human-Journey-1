/* ============================================================
   pf-i18n.js — runtime translation layer for "Power and Freedom"
   ------------------------------------------------------------
   The page is a self-contained essay-app whose text is rewritten
   every animation frame. Rather than refactor it, this module
   translates the DOM at runtime, with ENGLISH FALLBACK: any
   string without a translation simply stays in English, so the
   page can never break at any stage or language.

   Languages match the rest of The Human Journey:
     English · Català · Español · Français · Nederlands · Norsk

   COVERAGE — Pass 1 (this file): the interface & controls —
   top bar, gauges, the five verdict states, all 12 moves, group
   headers, presets, compare cards, buttons, era titles, dates.
   The long-form reading prose (hover tooltips, the timeline beat
   write-ups, and the two pop-ups incl. the theory essay) is left
   in English for a later pass.
   ============================================================ */
(function () {
  var NAMES = { en: "English", ca: "Català", es: "Español", fr: "Français", nl: "Nederlands", no: "Norsk" };
  var ORD = ["ca", "es", "fr", "nl", "no"];   // column order in the table below

  // English source  ->  [ca, es, fr, nl, no]
  var TR = {
    // ---- top bar ----
    "A toolkit of moves — apply them in any order, partly, and undo them": [
      "Una caixa d'eines de moviments — aplica'ls en qualsevol ordre, en part, i desfés-los",
      "Una caja de herramientas de movimientos — aplícalos en cualquier orden, en parte, y deshazlos",
      "Une boîte à outils de mouvements — appliquez-les dans n'importe quel ordre, partiellement, et annulez-les",
      "Een gereedschapskist van zetten — pas ze in elke volgorde toe, deels, en maak ze ongedaan",
      "En verktøykasse av trekk — bruk dem i hvilken som helst rekkefølge, delvis, og angre dem"],
    "One common road": [
      "Un camí comú", "Un camino común", "Un chemin commun", "Eén gemeenschappelijke weg", "Én vanlig vei"],
    "illustrative, not inevitable": [
      "il·lustratiu, no inevitable", "ilustrativo, no inevitable", "illustratif, non inévitable",
      "illustratief, niet onvermijdelijk", "illustrerende, ikke uunngåelig"],
    "Many societies took these moves in other orders, partly, or refused them; monuments were torn down and rule un-made.": [
      "Moltes societats van fer aquests moviments en altres ordres, en part, o els van rebutjar; es van enderrocar monuments i es va desfer el poder.",
      "Muchas sociedades hicieron estos movimientos en otros órdenes, en parte, o los rechazaron; se derribaron monumentos y se deshizo el poder.",
      "Beaucoup de sociétés ont fait ces mouvements dans d'autres ordres, partiellement, ou les ont refusés ; des monuments ont été abattus et le pouvoir défait.",
      "Veel samenlevingen deden deze zetten in andere volgordes, deels, of weigerden ze; monumenten werden neergehaald en heerschappij ongedaan gemaakt.",
      "Mange samfunn gjorde disse trekkene i annen rekkefølge, delvis, eller avviste dem; monumenter ble revet ned og makt opphevet."],
    "Timeline of history": [
      "Línia del temps de la història", "Línea del tiempo de la historia", "Frise chronologique de l'histoire",
      "Tijdlijn van de geschiedenis", "Historiens tidslinje"],
    "Read this first": [
      "Llegeix això primer", "Lee esto primero", "Lisez ceci d'abord", "Lees dit eerst", "Les dette først"],
    "Explore": ["Explora", "Explorar", "Explorer", "Verkennen", "Utforsk"],
    "Sandbox": ["Espai lliure", "Entorno libre", "Bac à sable", "Zandbak", "Sandkasse"],

    // ---- gauges ----
    "The power to take back": [
      "El poder de recuperar", "El poder de recuperar", "Le pouvoir de reprendre",
      "De macht om terug te nemen", "Makten til å ta tilbake"],
    "Can power be taken back?": [
      "Es pot recuperar el poder?", "¿Se puede recuperar el poder?", "Le pouvoir peut-il être repris ?",
      "Kan macht teruggenomen worden?", "Kan makt tas tilbake?"],
    "What decides it": [
      "Què ho decideix", "Qué lo decide", "Ce qui le décide", "Wat het bepaalt", "Hva som avgjør det"],
    "Ability to leave": [
      "Capacitat de marxar", "Capacidad de irse", "Capacité de partir", "Mogelijkheid om te vertrekken", "Evne til å dra"],
    "Saying no is safe": [
      "Dir que no és segur", "Decir que no es seguro", "Dire non est sans risque", "Nee zeggen is veilig", "Å si nei er trygt"],
    "Access to means of living": [
      "Accés als mitjans de vida", "Acceso a los medios de vida", "Accès aux moyens de subsistance",
      "Toegang tot bestaansmiddelen", "Tilgang til livsgrunnlag"],
    "Access to knowledge": [
      "Accés al coneixement", "Acceso al conocimiento", "Accès au savoir", "Toegang tot kennis", "Tilgang til kunnskap"],
    "Influence circulates": [
      "La influència circula", "La influencia circula", "L'influence circule", "Invloed circuleert", "Innflytelse sirkulerer"],
    "Verticality": ["Verticalitat", "Verticalidad", "Verticalité", "Verticaliteit", "Vertikalitet"],

    // ---- verdict states (STLAB) ----
    "Freedom — alive": ["Llibertat — viva", "Libertad — viva", "Liberté — vivante", "Vrijheid — levend", "Frihet — levende"],
    "Legitimate inequality": [
      "Desigualtat legítima", "Desigualdad legítima", "Inégalité légitime", "Legitieme ongelijkheid", "Legitim ulikhet"],
    "The blurry zone": ["La zona difusa", "La zona difusa", "La zone floue", "De vage zone", "Den uklare sonen"],
    "Domination": ["Dominació", "Dominación", "Domination", "Overheersing", "Dominans"],
    "Decay — rusted shut": ["Decadència — rovellat", "Decadencia — oxidado", "Déclin — rouillé", "Verval — vastgeroest", "Forfall — rustet fast"],

    // ---- live caption heading (cfg) ----
    "A flat band": ["Una banda plana", "Una banda plana", "Une bande plate", "Een platte groep", "En flat gruppe"],

    // ---- palette group headers ----
    "keystone": ["clau de volta", "piedra angular", "clé de voûte", "sluitsteen", "bærebjelke"],
    "The price of saying no": [
      "El preu de dir que no", "El precio de decir que no", "Le prix de dire non", "De prijs van nee zeggen", "Prisen for å si nei"],
    "Means of living": ["Mitjans de vida", "Medios de vida", "Moyens de subsistance", "Bestaansmiddelen", "Livsgrunnlag"],
    "Upkeep": ["Manteniment", "Mantenimiento", "Entretien", "Onderhoud", "Vedlikehold"],
    "Where influence settles": [
      "On s'assenta la influència", "Dónde se asienta la influencia", "Où l'influence se fixe",
      "Waar invloed neerslaat", "Hvor innflytelsen legger seg"],
    "opening": ["obertura", "apertura", "ouverture", "opening", "åpning"],

    // ---- move names ----
    "Sedentism & circumscription": [
      "Sedentisme i circumscripció", "Sedentarismo y circunscripción", "Sédentarité et circonscription",
      "Sedentarisme en omsluiting", "Bofasthet og innesperring"],
    "War-leader & warriors": [
      "Cap de guerra i guerrers", "Jefe de guerra y guerreros", "Chef de guerre et guerriers",
      "Oorlogsleider en krijgers", "Krigshøvding og krigere"],
    "Sacralize the order": [
      "Sacralitzar l'ordre", "Sacralizar el orden", "Sacraliser l'ordre", "De orde sacraliseren", "Hellige ordenen"],
    "Tribute": ["Tribut", "Tributo", "Tribut", "Schatting", "Tributt"],
    "Private property": ["Propietat privada", "Propiedad privada", "Propriété privée", "Privé-eigendom", "Privat eiendom"],
    "Sacred specialist": [
      "Especialista sagrat", "Especialista sagrado", "Spécialiste du sacré", "Heilige specialist", "Hellig spesialist"],
    "Records & writing": [
      "Registres i escriptura", "Registros y escritura", "Archives et écriture", "Administratie en schrift", "Opptegnelser og skrift"],
    "Aggrandizer (feasts, debt)": [
      "Engrandidor (festins, deute)", "Engrandecedor (festines, deuda)", "Magnificateur (festins, dette)",
      "Grootmaker (feesten, schuld)", "Storgjører (gjestebud, gjeld)"],
    "Lifelong office": ["Càrrec vitalici", "Cargo vitalicio", "Charge à vie", "Levenslang ambt", "Livsvarig embete"],
    "Hereditary office": ["Càrrec hereditari", "Cargo hereditario", "Charge héréditaire", "Erfelijk ambt", "Arvelig embete"],
    "Monument": ["Monument", "Monumento", "Monument", "Monument", "Monument"],
    "Disuse (leveling abandoned)": [
      "Desús (anivellament abandonat)", "Desuso (nivelación abandonada)", "Désuétude (nivellement abandonné)",
      "Onbruik (nivellering opgegeven)", "Bruksopphør (utjevning forlatt)"],

    // ---- locked reasons (dep) ----
    "Locked — ": ["Bloquejat — ", "Bloqueado — ", "Verrouillé — ", "Vergrendeld — ", "Låst — "],
    "needs both a priest and a ruler": [
      "cal un sacerdot i un governant", "requiere un sacerdote y un gobernante", "exige un prêtre et un dirigeant",
      "vereist een priester en een heerser", "krever både en prest og en hersker"],
    "needs an authority (priest or leader)": [
      "cal una autoritat (sacerdot o líder)", "requiere una autoridad (sacerdote o líder)", "exige une autorité (prêtre ou chef)",
      "vereist een gezag (priester of leider)", "krever en autoritet (prest eller leder)"],
    "needs enforcement, wealth, or the sacred": [
      "cal coacció, riquesa o el sagrat", "requiere coacción, riqueza o lo sagrado", "exige la contrainte, la richesse ou le sacré",
      "vereist handhaving, rijkdom of het heilige", "krever tvang, rikdom eller det hellige"],
    "needs the sacred or tribute": [
      "cal el sagrat o el tribut", "requiere lo sagrado o el tributo", "exige le sacré ou le tribut",
      "vereist het heilige of schatting", "krever det hellige eller tributt"],
    "needs a leader": ["cal un líder", "requiere un líder", "exige un chef", "vereist een leider", "krever en leder"],
    "needs a lifelong office and property": [
      "cal un càrrec vitalici i propietat", "requiere un cargo vitalicio y propiedad", "exige une charge à vie et la propriété",
      "vereist een levenslang ambt en eigendom", "krever et livsvarig embete og eiendom"],
    "needs authority and mobilised labour": [
      "cal autoritat i mà d'obra mobilitzada", "requiere autoridad y mano de obra movilizada", "exige l'autorité et une main-d'œuvre mobilisée",
      "vereist gezag en gemobiliseerde arbeid", "krever autoritet og mobilisert arbeidskraft"],

    // ---- presets ----
    "Sacred first": ["Primer el sagrat", "Primero lo sagrado", "Le sacré d'abord", "Eerst het heilige", "Det hellige først"],
    "temple-state (Uruk)": ["estat-temple (Uruk)", "estado-templo (Uruk)", "État-temple (Uruk)", "tempelstaat (Uruk)", "tempelstat (Uruk)"],
    "Force first": ["Primer la força", "Primero la fuerza", "La force d'abord", "Eerst geweld", "Makt først"],
    "conquest / steppe": ["conquesta / estepa", "conquista / estepa", "conquête / steppe", "verovering / steppe", "erobring / steppe"],
    "Wealth first": ["Primer la riquesa", "Primero la riqueza", "La richesse d'abord", "Eerst rijkdom", "Rikdom først"],
    "big-man / potlatch rank": [
      "big-man / rang de potlatch", "big-man / rango de potlatch", "big-man / rang potlatch",
      "big-man / potlatch-rang", "stormann / potlatch-rang"],
    "Refuses": ["Rebutja", "Rechaza", "Refuse", "Weigert", "Avviser"],
    "society against the state": [
      "societat contra l'estat", "sociedad contra el estado", "société contre l'État",
      "samenleving tegen de staat", "samfunn mot staten"],

    // ---- compare verdict words (lower-case) + prefix ----
    "take-back": ["recuperació", "recuperación", "reprise", "terugname", "tilbaketaking"],
    "freedom": ["llibertat", "libertad", "liberté", "vrijheid", "frihet"],
    "legitimate inequality": [
      "desigualtat legítima", "desigualdad legítima", "inégalité légitime", "legitieme ongelijkheid", "legitim ulikhet"],
    "the blurry zone": ["la zona difusa", "la zona difusa", "la zone floue", "de vage zone", "den uklare sonen"],
    "domination": ["dominació", "dominación", "domination", "overheersing", "dominans"],
    "decay": ["decadència", "decadencia", "déclin", "verval", "forfall"],

    // ---- buttons ----
    "Reset": ["Reinicia", "Reiniciar", "Réinitialiser", "Herstellen", "Nullstill"],
    "Pause": ["Pausa", "Pausa", "Pause", "Pauze", "Pause"],
    "Play": ["Reprodueix", "Reproducir", "Lecture", "Afspelen", "Spill"],
    "Replay": ["Repeteix", "Repetir", "Rejouer", "Opnieuw", "Spill igjen"],

    // ---- timeline era titles ----
    "The flat band": ["La banda plana", "La banda plana", "La bande plate", "De platte groep", "Den flate gruppen"],
    "The sacred sets apart": [
      "El sagrat separa", "Lo sagrado aparta", "Le sacré met à part", "Het heilige zondert af", "Det hellige skiller ut"],
    "Leaders & warriors rise": [
      "Sorgeixen líders i guerrers", "Surgen líderes y guerreros", "Chefs et guerriers s'élèvent",
      "Leiders en krijgers komen op", "Ledere og krigere stiger"],
    "Tribute, property, permanence": [
      "Tribut, propietat, permanència", "Tributo, propiedad, permanencia", "Tribut, propriété, permanence",
      "Schatting, eigendom, bestendigheid", "Tributt, eiendom, varighet"],
    "Monument & inheritance": [
      "Monument i herència", "Monumento y herencia", "Monument et héritage", "Monument en erfenis", "Monument og arv"],
    "Divine kingship & empire": [
      "Reialesa divina i imperi", "Realeza divina e imperio", "Royauté divine et empire",
      "Goddelijk koningschap en rijk", "Guddommelig kongedømme og imperium"],

    // ---- date suffixes / inline ----
    " BCE": [" aEC", " a.C.", " av. J.-C.", " v.Chr.", " f.Kr."],
    " CE": [" dEC", " d.C.", " apr. J.-C.", " n.Chr.", " e.Kr."],
    "world pop": ["pob. mundial", "pobl. mundial", "pop. mondiale", "wereldbev.", "verdensbef."],

    // ============================================================
    //  PASS 2A — live captions, timeline era subtitles, beat headlines
    // ============================================================
    "Power is shared among equals — the take-back power alive, kept in working order by daily use: teasing the boastful, ignoring the bossy. Apply moves in any order; each can be partial, and any can be undone.": [
      "El poder es comparteix entre iguals — el poder de recuperar és viu, mantingut en funcionament per l'ús diari: burlar-se del fanfarró, ignorar el manaire. Aplica els moviments en qualsevol ordre; cada un pot ser parcial, i qualsevol es pot desfer.",
      "El poder se comparte entre iguales — el poder de recuperar está vivo, mantenido en funcionamiento por el uso diario: burlarse del fanfarrón, ignorar al mandón. Aplica los movimientos en cualquier orden; cada uno puede ser parcial, y cualquiera puede deshacerse.",
      "Le pouvoir est partagé entre égaux — le pouvoir de reprendre est vivant, entretenu par l'usage quotidien : se moquer du vantard, ignorer l'autoritaire. Appliquez les mouvements dans n'importe quel ordre ; chacun peut être partiel, et tous peuvent être annulés.",
      "Macht wordt gedeeld onder gelijken — de macht om terug te nemen leeft, in werking gehouden door dagelijks gebruik: de opschepper plagen, de bazige negeren. Pas zetten in elke volgorde toe; elke kan gedeeltelijk zijn, en alle kunnen ongedaan worden gemaakt.",
      "Makt deles blant likemenn — makten til å ta tilbake er levende, holdt i orden ved daglig bruk: å gjøre narr av skrytepaven, å overse den bossete. Bruk trekk i hvilken som helst rekkefølge; hvert kan være delvis, og alle kan angres."],
    "Taking power back would work if tried, whether or not anyone is trying. No oppressor in sight, nothing to fight — just a power kept in working order.": [
      "Recuperar el poder funcionaria si s'intentés, tant si algú ho intenta com si no. Cap opressor a la vista, res a combatre — només un poder mantingut en funcionament.",
      "Recuperar el poder funcionaría si se intentara, lo intente alguien o no. Ningún opresor a la vista, nada que combatir — solo un poder mantenido en funcionamiento.",
      "Reprendre le pouvoir fonctionnerait si on essayait, que quelqu'un essaie ou non. Aucun oppresseur en vue, rien à combattre — juste un pouvoir entretenu.",
      "Macht terugnemen zou werken als je het probeerde, of iemand het nu probeert of niet. Geen onderdrukker in zicht, niets om te bestrijden — slechts een macht die in werking wordt gehouden.",
      "Å ta makten tilbake ville virke om man prøvde, enten noen prøver eller ikke. Ingen undertrykker i sikte, ingenting å kjempe mot — bare en makt holdt i orden."],
    "Real inequality that is not domination: power has been handed over, but it can still be recalled — a leader people follow but could ignore or remove.": [
      "Desigualtat real que no és dominació: el poder s'ha cedit, però encara es pot revocar — un líder que la gent segueix però podria ignorar o destituir.",
      "Desigualdad real que no es dominación: el poder se ha cedido, pero aún se puede revocar — un líder al que la gente sigue pero podría ignorar o destituir.",
      "Une inégalité réelle qui n'est pas domination : le pouvoir a été cédé, mais il peut encore être repris — un chef que les gens suivent mais pourraient ignorer ou révoquer.",
      "Echte ongelijkheid die geen overheersing is: macht is overgedragen, maar kan nog worden teruggeroepen — een leider die mensen volgen maar zouden kunnen negeren of afzetten.",
      "Virkelig ulikhet som ikke er dominans: makten er overlatt, men kan fortsatt kalles tilbake — en leder folk følger, men kunne ignorere eller avsette."],
    "Taking power back is getting expensive, or rusty. The line between free and unfree is a zone, not a sharp edge — and this is it.": [
      "Recuperar el poder s'està tornant car, o rovellat. La línia entre lliure i no lliure és una zona, no una vora nítida — i això n'és una.",
      "Recuperar el poder se está volviendo caro, u oxidado. La línea entre libre y no libre es una zona, no un borde nítido — y esto lo es.",
      "Reprendre le pouvoir devient coûteux, ou rouillé. La ligne entre libre et non libre est une zone, non un bord net — et c'est ici.",
      "Macht terugnemen wordt duur, of roestig. De grens tussen vrij en onvrij is een zone, geen scherpe rand — en dit is die.",
      "Å ta makten tilbake blir dyrt, eller rustent. Grensen mellom fri og ufri er en sone, ikke en skarp kant — og dette er den."],
    "No one hoards, no one commands — yet taking power back would fail if tried, because it was never used. The door, never opened, rusted shut on its own: unfreedom with no villain.": [
      "Ningú no acapara, ningú no mana — però recuperar el poder fracassaria si s'intentés, perquè mai no es va usar. La porta, mai oberta, es va rovellar sola: manca de llibertat sense cap dolent.",
      "Nadie acapara, nadie manda — pero recuperar el poder fracasaría si se intentara, porque nunca se usó. La puerta, nunca abierta, se oxidó sola: falta de libertad sin villano.",
      "Personne n'accapare, personne ne commande — mais reprendre le pouvoir échouerait si on essayait, car il n'a jamais servi. La porte, jamais ouverte, a rouillé d'elle-même : une non-liberté sans méchant.",
      "Niemand hamstert, niemand beveelt — toch zou macht terugnemen mislukken als je het probeerde, want het is nooit gebruikt. De deur, nooit geopend, roestte vanzelf vast: onvrijheid zonder schurk.",
      "Ingen hamstrer, ingen befaler — likevel ville det å ta makten tilbake mislykkes om man prøvde, fordi den aldri ble brukt. Døren, aldri åpnet, rustet igjen av seg selv: ufrihet uten skurk."],
    "Someone has shut the door: taking power back is no longer survivable. Yet nothing was seized at the founding — the power was lent, and what force now blocks is its return.": [
      "Algú ha tancat la porta: recuperar el poder ja no és viable. Però res no es va prendre a l'origen — el poder es va prestar, i el que la força bloqueja ara és el seu retorn.",
      "Alguien ha cerrado la puerta: recuperar el poder ya no es viable. Pero nada se tomó en el origen — el poder se prestó, y lo que la fuerza bloquea ahora es su retorno.",
      "Quelqu'un a fermé la porte : reprendre le pouvoir n'est plus survivable. Pourtant rien n'a été saisi à l'origine — le pouvoir a été prêté, et ce que la force bloque désormais, c'est son retour.",
      "Iemand heeft de deur gesloten: macht terugnemen is niet langer overleefbaar. Toch werd er bij de stichting niets gegrepen — de macht werd geleend, en wat geweld nu blokkeert, is haar terugkeer.",
      "Noen har lukket døren: å ta makten tilbake er ikke lenger overlevbart. Likevel ble ingenting grepet ved grunnleggelsen — makten ble lånt, og det makten nå blokkerer, er dens retur."],
    " The door stands open — but no one remembers how to walk through it.": [
      " La porta és oberta — però ningú no recorda com travessar-la.",
      " La puerta está abierta — pero nadie recuerda cómo atravesarla.",
      " La porte est ouverte — mais personne ne se souvient comment la franchir.",
      " De deur staat open — maar niemand weet nog hoe erdoorheen te gaan.",
      " Døren står åpen — men ingen husker hvordan man går gjennom den."],
    " The door is open — and while it is, the other holds stay loose.": [
      " La porta és oberta — i mentre ho sigui, les altres subjeccions queden fluixes.",
      " La puerta está abierta — y mientras lo esté, los demás controles quedan flojos.",
      " La porte est ouverte — et tant qu'elle l'est, les autres emprises restent lâches.",
      " De deur is open — en zolang dat zo is, blijven de andere grepen los.",
      " Døren er åpen — og så lenge den er det, holder de andre grepene seg løse."],
    " The door is shut — the keystone; freedom returns by reopening the way out first, never the other way around.": [
      " La porta és tancada — la clau de volta; la llibertat torna reobrint primer la sortida, mai a l'inrevés.",
      " La puerta está cerrada — la piedra angular; la libertad regresa reabriendo primero la salida, nunca al revés.",
      " La porte est fermée — la clé de voûte ; la liberté revient en rouvrant d'abord l'issue, jamais l'inverse.",
      " De deur is dicht — de sluitsteen; vrijheid keert terug door eerst de uitweg te heropenen, nooit andersom.",
      " Døren er lukket — bærebjelken; friheten vender tilbake ved å gjenåpne utveien først, aldri omvendt."],
    "Equals held flat by active leveling — ridicule, ostracism, exile for upstarts. Many societies also assembled and dissolved hierarchy with the seasons.": [
      "Iguals mantinguts plans per un anivellament actiu — burla, ostracisme, exili per als arribistes. Moltes societats també muntaven i dissolien la jerarquia amb les estacions.",
      "Iguales mantenidos planos por una nivelación activa — burla, ostracismo, exilio para los arribistas. Muchas sociedades también armaban y disolvían la jerarquía con las estaciones.",
      "Des égaux maintenus à plat par un nivellement actif — moquerie, ostracisme, exil pour les arrivistes. Beaucoup de sociétés montaient et dissolvaient aussi la hiérarchie au fil des saisons.",
      "Gelijken vlak gehouden door actieve nivellering — spot, uitsluiting, verbanning voor parvenu's. Veel samenlevingen bouwden hiërarchie ook op en ontbonden die met de seizoenen.",
      "Likemenn holdt flate ved aktiv utjevning — hån, utstøting, eksil for oppkomlinger. Mange samfunn bygde også opp og oppløste hierarki med årstidene."],
    "A charismatic specialist begins to mediate the spirits. Shamanism — old as the ice ages — hardens into an office.": [
      "Un especialista carismàtic comença a mediar amb els esperits. El xamanisme — vell com les glaciacions — s'endureix en un càrrec.",
      "Un especialista carismático empieza a mediar con los espíritus. El chamanismo — viejo como las glaciaciones — se endurece en un cargo.",
      "Un spécialiste charismatique commence à intercéder auprès des esprits. Le chamanisme — vieux comme les glaciations — se durcit en une charge.",
      "Een charismatische specialist begint tussen de geesten te bemiddelen. Sjamanisme — zo oud als de ijstijden — verhardt tot een ambt.",
      "En karismatisk spesialist begynner å megle med åndene. Sjamanisme — gammelt som istidene — størkner til et embete."],
    "Authority is lent to a big-man; a war-band gathers behind it — and as fields fix people in place, the door begins to close.": [
      "L'autoritat es presta a un big-man; una banda guerrera s'aplega al darrere — i, a mesura que els camps fixen la gent, la porta comença a tancar-se.",
      "La autoridad se presta a un big-man; una banda guerrera se reúne tras ella — y, a medida que los campos fijan a la gente, la puerta empieza a cerrarse.",
      "L'autorité est prêtée à un big-man ; une bande guerrière se rassemble derrière lui — et, à mesure que les champs fixent les gens, la porte commence à se fermer.",
      "Gezag wordt geleend aan een big-man; een krijgsbende schaart zich erachter — en terwijl akkers mensen vastleggen, begint de deur te sluiten.",
      "Autoritet lånes til en stormann; en krigerflokk samler seg bak den — og etter hvert som åkrene binder folk fast, begynner døren å lukkes."],
    "With the way out closed, every other hold tightens: surplus flows up, hoarding becomes a right, office is made to last.": [
      "Amb la sortida tancada, totes les altres subjeccions s'estrenyen: l'excedent puja, l'acaparament esdevé un dret, el càrrec es fa durador.",
      "Con la salida cerrada, todos los demás controles se aprietan: el excedente sube, el acaparamiento se vuelve un derecho, el cargo se hace duradero.",
      "L'issue fermée, toutes les autres emprises se resserrent : le surplus monte, l'accaparement devient un droit, la charge est rendue durable.",
      "Met de uitweg gesloten verstrakken alle andere grepen: het surplus stroomt omhoog, hamsteren wordt een recht, het ambt wordt blijvend gemaakt.",
      "Med utveien lukket strammes alle de andre grepene: overskuddet flyter opp, hamstring blir en rett, embetet gjøres varig."],
    "The order is built in stone and passed to heirs.": [
      "L'ordre es construeix en pedra i es transmet als hereus.",
      "El orden se construye en piedra y se transmite a los herederos.",
      "L'ordre est bâti dans la pierre et transmis aux héritiers.",
      "De orde wordt in steen gebouwd en doorgegeven aan erfgenamen.",
      "Ordenen bygges i stein og gis videre til arvinger."],
    "The order is declared eternal and grows — the take-back power seized, yet never quite beyond undoing.": [
      "L'ordre es declara etern i creix — el poder de recuperar pres, però mai del tot impossible de desfer.",
      "El orden se declara eterno y crece — el poder de recuperar arrebatado, pero nunca del todo imposible de deshacer.",
      "L'ordre est déclaré éternel et grandit — le pouvoir de reprendre saisi, mais jamais tout à fait impossible à défaire.",
      "De orde wordt eeuwig verklaard en groeit — de macht om terug te nemen gegrepen, maar nooit helemaal onomkeerbaar.",
      "Ordenen erklæres evig og vokser — makten til å ta tilbake er grepet, men aldri helt umulig å oppheve."],
    "Saying no grows costly": ["Dir que no es torna car", "Decir que no se vuelve caro", "Dire non devient coûteux", "Nee zeggen wordt duur", "Å si nei blir dyrt"],
    "The door is closing": ["La porta s'està tancant", "La puerta se está cerrando", "La porte se ferme", "De deur sluit", "Døren lukkes"],
    "The means of living enclosed": ["Els mitjans de vida tancats", "Los medios de vida cercados", "Les moyens de subsistance enclos", "De bestaansmiddelen omheind", "Livsgrunnlaget innhegnet"],
    "Knowledge narrows": ["El coneixement s'estreny", "El conocimiento se estrecha", "Le savoir se restreint", "Kennis versmalt", "Kunnskapen innsnevres"],
    "Influence settles on one person": ["La influència s'assenta en una persona", "La influencia se asienta en una persona", "L'influence se fixe sur une personne", "Invloed slaat neer op één persoon", "Innflytelsen legger seg på én person"],
    "Influence settles in one person": ["La influència s'assenta en una persona", "La influencia se asienta en una persona", "L'influence se fixe sur une personne", "Invloed slaat neer op één persoon", "Innflytelsen legger seg på én person"],
    "Force appears": ["Apareix la força", "Aparece la fuerza", "La force apparaît", "Geweld verschijnt", "Makt dukker opp"],
    "The door closes": ["La porta es tanca", "La puerta se cierra", "La porte se ferme", "De deur sluit", "Døren lukkes"],
    "Refusal becomes heresy": ["La negativa esdevé heretgia", "La negativa se vuelve herejía", "Le refus devient hérésie", "Weigering wordt ketterij", "Avvisning blir kjetteri"],
    "Knowledge sealed": ["Coneixement segellat", "Conocimiento sellado", "Savoir scellé", "Kennis verzegeld", "Kunnskap forseglet"],
    "The sacred narrows": ["El sagrat s'estreny", "Lo sagrado se estrecha", "Le sacré se restreint", "Het heilige versmalt", "Det hellige innsnevres"],
    "Power is lent upward": ["El poder es presta cap amunt", "El poder se presta hacia arriba", "Le pouvoir est prêté vers le haut", "Macht wordt naar boven geleend", "Makt lånes oppover"],
    "Hoarding becomes a right": ["L'acaparament esdevé un dret", "El acaparamiento se vuelve un derecho", "L'accaparement devient un droit", "Hamsteren wordt een recht", "Hamstring blir en rett"],
    "Office made to last": ["El càrrec fet durador", "El cargo hecho duradero", "La charge rendue durable", "Het ambt blijvend gemaakt", "Embetet gjort varig"],
    "Built in stone, passed to heirs": ["Construït en pedra, transmès als hereus", "Construido en piedra, transmitido a los herederos", "Bâti dans la pierre, transmis aux héritiers", "In steen gebouwd, doorgegeven aan erfgenamen", "Bygd i stein, gitt videre til arvinger"],
    "Throne fused with altar": ["Tron fusionat amb l'altar", "Trono fusionado con el altar", "Le trône fusionné à l'autel", "Troon versmolten met altaar", "Tronen smeltet sammen med alteret"],
    "It grows — and yet it was lent": ["Creix — i tanmateix es va prestar", "Crece — y sin embargo fue prestado", "Il grandit — et pourtant il fut prêté", "Het groeit — en toch was het geleend", "Den vokser — og likevel ble den lånt"],

    // ---- timeline beat paragraphs (plain-text lines) ----
    "Animism was open to everyone; now a charismatic specialist claims to be the one who can reach the spirits.": [
      "L'animisme era obert a tothom; ara un especialista carismàtic afirma ser l'únic que pot arribar als esperits.",
      "El animismo estaba abierto a todos; ahora un especialista carismático afirma ser el único que puede alcanzar a los espíritus.",
      "L'animisme était ouvert à tous ; désormais un spécialiste charismatique prétend être le seul à pouvoir atteindre les esprits.",
      "Animisme stond open voor iedereen; nu beweert een charismatische specialist de enige te zijn die de geesten kan bereiken.",
      "Animismen var åpen for alle; nå hevder en karismatisk spesialist å være den eneste som kan nå åndene."],
    "(One attested opening, not a universal first step.)": [
      "(Una obertura documentada, no un primer pas universal.)", "(Una apertura atestiguada, no un primer paso universal.)",
      "(Une ouverture attestée, non un premier pas universel.)", "(Eén gedocumenteerde opening, geen universele eerste stap.)",
      "(Én dokumentert åpning, ikke et universelt første steg.)"],
    "A generous, capable figure — a feast-giver, a protector in a world of raids — is handed authority by the group.": [
      "Una figura generosa i capaç — un donador de festins, un protector en un món d'incursions — rep l'autoritat del grup.",
      "Una figura generosa y capaz — un dador de festines, un protector en un mundo de incursiones — recibe la autoridad del grupo.",
      "Une figure généreuse et capable — un donneur de festins, un protecteur dans un monde de razzias — reçoit l'autorité du groupe.",
      "Een gulle, bekwame figuur — een feestgever, een beschermer in een wereld van rooftochten — krijgt gezag van de groep.",
      "En raus, dyktig skikkelse — en gjestebudsgiver, en beskytter i en verden av røvertokter — får myndighet av gruppen."],
    "For now the door is still open — and while leaving is survivable, all of this remains cheap to recall.": [
      "De moment la porta encara és oberta — i mentre marxar sigui viable, tot això continua sent fàcil de revocar.",
      "Por ahora la puerta sigue abierta — y mientras irse sea viable, todo esto sigue siendo fácil de revocar.",
      "Pour l'instant la porte est encore ouverte — et tant que partir reste survivable, tout cela demeure facile à révoquer.",
      "Voorlopig staat de deur nog open — en zolang vertrekken overleefbaar is, blijft dit alles makkelijk terug te draaien.",
      "Foreløpig står døren fortsatt åpen — og så lenge det å dra er overlevbart, er alt dette lett å kalle tilbake."],
    "Keeping the group’s surplus was once shameful and leveled away.": [
      "Quedar-se l'excedent del grup havia estat vergonyós i s'anivellava.",
      "Quedarse con el excedente del grupo era antes vergonzoso y se nivelaba.",
      "Garder le surplus du groupe était autrefois honteux et nivelé.",
      "Het overschot van de groep houden was ooit beschamend en werd weggenivelleerd.",
      "Å beholde gruppens overskudd var en gang skammelig og ble utjevnet bort."],
    "But fixed fields and bounded land have made walking away unsurvivable — and once exit shuts, every other hold tightens.": [
      "Però els camps fixos i la terra delimitada han fet que marxar sigui inviable — i, un cop tancada la sortida, totes les altres subjeccions s'estrenyen.",
      "Pero los campos fijos y la tierra delimitada han hecho que irse sea inviable — y, una vez cerrada la salida, todos los demás controles se aprietan.",
      "Mais les champs fixes et la terre délimitée ont rendu le départ insurvivable — et, une fois l'issue fermée, toutes les autres emprises se resserrent.",
      "Maar vaste akkers en begrensd land hebben weggaan onoverleefbaar gemaakt — en zodra de uitweg sluit, verstrakt elke andere greep.",
      "Men faste åkrer og avgrenset land har gjort det ulevelig å dra — og når utgangen lukkes, strammes hvert annet grep."],
    "The leader, now backed by warriors, convinces the group to reclassify the act: “ours” becomes “mine,” and the hoarding that once was a crime is now permitted by the group as a right — an enforceable one.": [
      "El líder, ara amb el suport dels guerrers, convenç el grup de reclassificar l'acte: «nostre» esdevé «meu», i l'acaparament que abans era un crim ara el grup el permet com un dret — i exigible.",
      "El líder, ahora respaldado por guerreros, convence al grupo de reclasificar el acto: «nuestro» se vuelve «mío», y el acaparamiento que antes era un crimen ahora el grupo lo permite como un derecho — y exigible.",
      "Le chef, désormais soutenu par des guerriers, convainc le groupe de requalifier l'acte : « le nôtre » devient « le mien », et l'accaparement qui était un crime est désormais permis par le groupe comme un droit — et opposable.",
      "De leider, nu gesteund door krijgers, overtuigt de groep de daad te herclassificeren: «van ons» wordt «van mij», en het hamsteren dat ooit een misdaad was, wordt nu door de groep toegestaan als een recht — een afdwingbaar recht.",
      "Lederen, nå støttet av krigere, overbeviser gruppen om å omklassifisere handlingen: «vårt» blir «mitt», og hamstringen som en gang var en forbrytelse, tillates nå av gruppen som en rett — en håndhevbar en."],
    "Those resources leave the commons, and the new claim can no longer be revised.": [
      "Aquests recursos surten del comú, i la nova reivindicació ja no es pot revisar.",
      "Esos recursos salen del común, y la nueva reivindicación ya no puede revisarse.",
      "Ces ressources quittent les communaux, et la nouvelle revendication ne peut plus être révisée.",
      "Die hulpbronnen verlaten de meent, en de nieuwe aanspraak kan niet meer worden herzien.",
      "Disse ressursene forlater allmenningen, og det nye kravet kan ikke lenger revideres."],
    "(A threshold crossed over centuries, not a day — personal possessions are far older; what is new is the enforceable claim over fields and stores.)": [
      "(Un llindar travessat al llarg de segles, no en un dia — les possessions personals són molt més antigues; el que és nou és la reivindicació exigible sobre camps i magatzems.)",
      "(Un umbral cruzado a lo largo de siglos, no en un día — las posesiones personales son mucho más antiguas; lo nuevo es la reivindicación exigible sobre campos y almacenes.)",
      "(Un seuil franchi sur des siècles, non en un jour — les possessions personnelles sont bien plus anciennes ; ce qui est nouveau, c'est la revendication opposable sur les champs et les réserves.)",
      "(Een drempel die over eeuwen werd overschreden, niet op één dag — persoonlijke bezittingen zijn veel ouder; nieuw is de afdwingbare aanspraak op akkers en voorraden.)",
      "(En terskel krysset over århundrer, ikke på en dag — personlige eiendeler er langt eldre; det nye er det håndhevbare kravet over åkrer og lagre.)"],
    "What was granted for a moment is made to last a lifetime, and tribute and the keeping of accounts — tokens, tallies and seals — institutionalize it.": [
      "El que es va concedir per un moment es fa durar tota una vida, i el tribut i la comptabilitat — fitxes, osques i segells — l'institucionalitzen.",
      "Lo que se concedió por un momento se hace durar toda una vida, y el tributo y la contabilidad — fichas, muescas y sellos — lo institucionalizan.",
      "Ce qui fut accordé pour un instant est rendu durable une vie entière, et le tribut et la tenue des comptes — jetons, encoches et sceaux — l'institutionnalisent.",
      "Wat voor een ogenblik werd verleend, wordt een leven lang gemaakt, en schatting en boekhouding — fiches, kerfstokken en zegels — institutionaliseren het.",
      "Det som ble gitt for et øyeblikk, gjøres varig livet ut, og tributt og regnskapsføring — sjetonger, karvestokker og segl — institusjonaliserer det."],
    "Influence stops passing from person to person — it settles permanently on someone, and the price of taking it back climbs.": [
      "La influència deixa de passar de persona a persona — s'assenta permanentment en algú, i el preu de recuperar-la puja.",
      "La influencia deja de pasar de persona a persona — se asienta permanentemente en alguien, y el precio de recuperarla sube.",
      "L'influence cesse de passer de personne à personne — elle se fixe à demeure sur quelqu'un, et le prix pour la reprendre grimpe.",
      "Invloed gaat niet langer van persoon tot persoon — hij slaat blijvend neer op iemand, en de prijs om hem terug te nemen stijgt.",
      "Innflytelse slutter å gå fra person til person — den legger seg permanent på noen, og prisen for å ta den tilbake stiger."],
    "Monuments make the order look permanent and beyond question, and the office is inherited like property.": [
      "Els monuments fan que l'ordre sembli permanent i indiscutible, i el càrrec s'hereta com una propietat.",
      "Los monumentos hacen que el orden parezca permanente e incuestionable, y el cargo se hereda como una propiedad.",
      "Les monuments font paraître l'ordre permanent et incontestable, et la charge s'hérite comme une propriété.",
      "Monumenten doen de orde permanent en onbetwistbaar lijken, en het ambt wordt geërfd als eigendom.",
      "Monumenter får ordenen til å virke permanent og hevet over tvil, og embetet arves som eiendom."],
    "The deal is no longer up for revision — it is simply “how things are.”": [
      "L'acord ja no es pot revisar — és simplement «com són les coses».",
      "El trato ya no está sujeto a revisión — es simplemente «cómo son las cosas».",
      "L'accord n'est plus révisable — c'est simplement « comment sont les choses ».",
      "De afspraak staat niet meer ter discussie — het is gewoon «hoe het is».",
      "Avtalen er ikke lenger til revisjon — det er rett og slett «slik tingene er»."],
    "The political order itself is declared eternal and divine.": [
      "El mateix ordre polític es declara etern i diví.", "El propio orden político se declara eterno y divino.",
      "L'ordre politique lui-même est déclaré éternel et divin.", "De politieke orde zelf wordt eeuwig en goddelijk verklaard.",
      "Selve den politiske ordenen erklæres evig og guddommelig."],
    "This is the power of the state: taking power back is no longer survivable.": [
      "Aquest és el poder de l'estat: recuperar el poder ja no és viable.", "Este es el poder del estado: recuperar el poder ya no es viable.",
      "C'est le pouvoir de l'État : reprendre le pouvoir n'est plus survivable.", "Dit is de macht van de staat: macht terugnemen is niet langer overleefbaar.",
      "Dette er statens makt: å ta makten tilbake er ikke lenger overlevbart."],
    "From here come empires, codified law and bureaucracy, down to the present.": [
      "D'aquí surten els imperis, el dret codificat i la burocràcia, fins al present.",
      "De aquí surgen los imperios, el derecho codificado y la burocracia, hasta el presente.",
      "De là viennent les empires, le droit codifié et la bureaucratie, jusqu'au présent.",
      "Hieruit komen rijken, gecodificeerd recht en bureaucratie, tot aan het heden.",
      "Herfra kommer imperier, kodifisert lov og byråkrati, helt til i dag."],
    "Private property is born.": [
      "Neix la propietat privada.", "Nace la propiedad privada.", "La propriété privée est née.",
      "Privé-eigendom is geboren.", "Privat eiendom er født."]
  };

  // English innerHTML (with inline <b>/<i>) -> translated innerHTML, for rich blocks
  // (timeline beat lines now; tooltips & pop-ups later). Swapped whole, preserving emphasis.
  var TRH = {
    "The group <b>yields</b> that monopoly — and accepts the first sacred rules, enforced by fear of the gods rather than by force.": [
      "El grup <b>cedeix</b> aquell monopoli — i accepta les primeres regles sagrades, imposades per la por als déus més que per la força.",
      "El grupo <b>cede</b> ese monopolio — y acepta las primeras reglas sagradas, impuestas por el miedo a los dioses más que por la fuerza.",
      "Le groupe <b>cède</b> ce monopole — et accepte les premières règles sacrées, imposées par la peur des dieux plutôt que par la force.",
      "De groep <b>geeft</b> dat monopolie op — en aanvaardt de eerste heilige regels, afgedwongen door angst voor de goden in plaats van door geweld.",
      "Gruppen <b>gir fra seg</b> det monopolet — og godtar de første hellige reglene, håndhevet av frykt for gudene snarere enn av makt."],
    "It is <b>lent, not seized</b>; but a war-band raised from the young men now puts force behind it.": [
      "És <b>prestat, no pres</b>; però una banda guerrera reclutada entre els joves ara hi posa força al darrere.",
      "Es <b>prestado, no arrebatado</b>; pero una banda guerrera reclutada entre los jóvenes ahora pone fuerza detrás.",
      "Il est <b>prêté, non saisi</b> ; mais une bande guerrière levée parmi les jeunes hommes met désormais la force derrière.",
      "Het is <b>geleend, niet gegrepen</b>; maar een krijgsbende uit de jonge mannen zet er nu kracht achter.",
      "Den er <b>lånt, ikke grepet</b>; men en krigerflokk reist blant de unge mennene setter nå makt bak den."],
    "<b>Temple and palace merge</b> into one apparatus — the ruler absorbs the priest’s legitimacy, and sacred authority no longer checks power but <b>sanctifies</b> it.": [
      "<b>El temple i el palau es fusionen</b> en un sol aparell — el governant absorbeix la legitimitat del sacerdot, i l'autoritat sagrada ja no controla el poder sinó que el <b>santifica</b>.",
      "<b>El templo y el palacio se fusionan</b> en un solo aparato — el gobernante absorbe la legitimidad del sacerdote, y la autoridad sagrada ya no controla el poder sino que lo <b>santifica</b>.",
      "<b>Temple et palais fusionnent</b> en un seul appareil — le dirigeant absorbe la légitimité du prêtre, et l'autorité sacrée ne limite plus le pouvoir mais le <b>sanctifie</b>.",
      "<b>Tempel en paleis versmelten</b> tot één apparaat — de heerser absorbeert de legitimiteit van de priester, en het heilige gezag beteugelt de macht niet langer maar <b>heiligt</b> haar.",
      "<b>Tempel og palass smelter sammen</b> til ett apparat — herskeren absorberer prestens legitimitet, og den hellige autoriteten begrenser ikke lenger makten, men <b>helliger</b> den."],
    "Yet nothing was ever <i>seized</i>: the founding power was lent.": [
      "Tanmateix, mai no es va <i>arrabassar</i> res: el poder fundacional es va prestar.",
      "Sin embargo, nunca se <i>arrebató</i> nada: el poder fundacional se prestó.",
      "Pourtant rien ne fut jamais <i>saisi</i> : le pouvoir fondateur fut prêté.",
      "Toch werd er nooit iets <i>gegrepen</i>: de stichtende macht werd geleend.",
      "Likevel ble ingenting noensinne <i>grepet</i>: den grunnleggende makten ble lånt."],
    "What got seized is the <b>ability to take it back</b> — which is why the pyramid is costly to hold up, and never quite beyond undoing; and any undoing begins at the door.": [
      "El que es va arrabassar és la <b>capacitat de recuperar-lo</b> — per això la piràmide és costosa de mantenir dreta, i mai del tot impossible de desfer; i qualsevol desfeta comença a la porta.",
      "Lo que se arrebató es la <b>capacidad de recuperarlo</b> — por eso la pirámide es costosa de mantener en pie, y nunca del todo imposible de deshacer; y cualquier deshacer empieza en la puerta.",
      "Ce qui fut saisi, c'est la <b>capacité de le reprendre</b> — voilà pourquoi la pyramide est coûteuse à maintenir debout, et jamais tout à fait impossible à défaire ; et tout défaire commence à la porte.",
      "Wat gegrepen werd, is het <b>vermogen om het terug te nemen</b> — daarom is de piramide kostbaar om overeind te houden, en nooit helemaal onomkeerbaar; en elk ongedaan maken begint bij de deur.",
      "Det som ble grepet, er <b>evnen til å ta den tilbake</b> — derfor er pyramiden kostbar å holde oppe, og aldri helt umulig å oppheve; og enhver oppheving begynner ved døren."],
    "<b>The power to take back</b> — the one variable beneath every move: could the people who handed power over still take it back, really and survivably? Freedom is this power kept <b>alive</b> — it would work if used, whether or not anyone is using it. Using it now and then is what keeps it in working order; a power never used eventually stops working.": [
      "<b>El poder de recuperar</b> — l'única variable sota cada moviment: podria la gent que va cedir el poder tornar-lo a prendre, de debò i de manera viable? La llibertat és aquest poder mantingut <b>viu</b> — funcionaria si s'usés, tant si algú l'usa com si no. Usar-lo de tant en tant és el que el manté en funcionament; un poder que mai no s'usa acaba deixant de funcionar.",
      "<b>El poder de recuperar</b> — la única variable bajo cada movimiento: ¿podría la gente que cedió el poder volver a tomarlo, de verdad y de forma viable? La libertad es ese poder mantenido <b>vivo</b> — funcionaría si se usara, lo use alguien o no. Usarlo de vez en cuando es lo que lo mantiene en funcionamiento; un poder que nunca se usa acaba dejando de funcionar.",
      "<b>Le pouvoir de reprendre</b> — la seule variable sous chaque mouvement : ceux qui ont cédé le pouvoir pourraient-ils encore le reprendre, vraiment et de façon survivable ? La liberté est ce pouvoir maintenu <b>vivant</b> — il fonctionnerait si on l'employait, qu'on l'emploie ou non. L'employer de temps en temps, c'est ce qui l'entretient ; un pouvoir jamais employé finit par ne plus fonctionner.",
      "<b>De macht om terug te nemen</b> — de ene variabele onder elke zet: zouden de mensen die de macht overdroegen haar nog kunnen terugnemen, echt en overleefbaar? Vrijheid is die macht <b>levend</b> gehouden — ze zou werken als ze gebruikt werd, of iemand haar nu gebruikt of niet. Haar af en toe gebruiken houdt haar in werking; een macht die nooit gebruikt wordt, stopt uiteindelijk met werken.",
      "<b>Makten til å ta tilbake</b> — den ene variabelen under hvert trekk: kunne de som overlot makten, fortsatt ta den tilbake, virkelig og overlevbart? Frihet er denne makten holdt <b>levende</b> — den ville virke om den ble brukt, enten noen bruker den eller ikke. Å bruke den nå og da er det som holder den i orden; en makt som aldri brukes, slutter til slutt å virke."],
    "<b>The verdict</b> — a threshold, not a dial: <b>Freedom</b> (the take-back power is alive, used or not), <b>Legitimate inequality</b> (power handed over but still recallable — a leader people could ignore or remove), a <b>blurry zone</b>, and two kinds of unfreedom: <b>Domination</b> (someone shut the door on you) and <b>Decay</b> (the door, never opened, rusted shut on its own). Both are unfreedom; only the first has a villain.": [
      "<b>El veredicte</b> — un llindar, no un dial: <b>Llibertat</b> (el poder de recuperar és viu, s'usi o no), <b>Desigualtat legítima</b> (el poder cedit però encara revocable — un líder que la gent podria ignorar o destituir), una <b>zona difusa</b>, i dues menes de manca de llibertat: <b>Dominació</b> (algú t'ha tancat la porta) i <b>Decadència</b> (la porta, mai oberta, es va rovellar sola). Totes dues són manca de llibertat; només la primera té un dolent.",
      "<b>El veredicto</b> — un umbral, no un dial: <b>Libertad</b> (el poder de recuperar está vivo, se use o no), <b>Desigualdad legítima</b> (el poder cedido pero aún revocable — un líder al que la gente podría ignorar o destituir), una <b>zona difusa</b>, y dos clases de falta de libertad: <b>Dominación</b> (alguien te cerró la puerta) y <b>Decadencia</b> (la puerta, nunca abierta, se oxidó sola). Ambas son falta de libertad; solo la primera tiene un villano.",
      "<b>Le verdict</b> — un seuil, non un cadran : <b>Liberté</b> (le pouvoir de reprendre est vivant, employé ou non), <b>Inégalité légitime</b> (pouvoir cédé mais encore révocable — un chef que les gens pourraient ignorer ou révoquer), une <b>zone floue</b>, et deux sortes de non-liberté : <b>Domination</b> (quelqu'un vous a fermé la porte) et <b>Déclin</b> (la porte, jamais ouverte, a rouillé d'elle-même). Les deux sont non-liberté ; seule la première a un méchant.",
      "<b>Het oordeel</b> — een drempel, geen schuifregelaar: <b>Vrijheid</b> (de macht om terug te nemen leeft, gebruikt of niet), <b>Legitieme ongelijkheid</b> (macht overgedragen maar nog terug te roepen — een leider die mensen zouden kunnen negeren of afzetten), een <b>vage zone</b>, en twee soorten onvrijheid: <b>Overheersing</b> (iemand sloot de deur voor je) en <b>Verval</b> (de deur, nooit geopend, roestte vanzelf vast). Beide zijn onvrijheid; alleen de eerste heeft een schurk.",
      "<b>Dommen</b> — en terskel, ikke en skala: <b>Frihet</b> (makten til å ta tilbake er levende, brukt eller ei), <b>Legitim ulikhet</b> (makt overlatt, men fortsatt mulig å kalle tilbake — en leder folk kunne ignorere eller avsette), en <b>uklar sone</b>, og to slags ufrihet: <b>Dominans</b> (noen lukket døren for deg) og <b>Forfall</b> (døren, aldri åpnet, rustet igjen av seg selv). Begge er ufrihet; bare den første har en skurk."],
    "<b>The ability to leave — the keystone.</b> Could you walk away and survive, with somewhere to be received? Power only becomes permanent and inheritable after leaving is closed off; freedom returns by reopening the way out first — never the other way around.": [
      "<b>La capacitat de marxar — la clau de volta.</b> Podries anar-te'n i sobreviure, amb algun lloc on ser acollit? El poder només esdevé permanent i hereditari un cop tancada la sortida; la llibertat torna reobrint primer la sortida — mai a l'inrevés.",
      "<b>La capacidad de irse — la piedra angular.</b> ¿Podrías marcharte y sobrevivir, con algún lugar donde ser acogido? El poder solo se vuelve permanente y hereditario una vez cerrada la salida; la libertad regresa reabriendo primero la salida — nunca al revés.",
      "<b>La capacité de partir — la clé de voûte.</b> Pourriez-vous partir et survivre, avec un endroit pour vous accueillir ? Le pouvoir ne devient permanent et héréditaire qu'une fois l'issue fermée ; la liberté revient en rouvrant d'abord l'issue — jamais l'inverse.",
      "<b>De mogelijkheid om te vertrekken — de sluitsteen.</b> Zou je kunnen weglopen en overleven, met ergens om opgevangen te worden? Macht wordt pas permanent en erfelijk nadat vertrekken is afgesloten; vrijheid keert terug door eerst de uitweg te heropenen — nooit andersom.",
      "<b>Evnen til å dra — bærebjelken.</b> Kunne du gå din vei og overleve, med et sted å bli tatt imot? Makt blir først permanent og arvelig etter at det å dra er stengt; friheten vender tilbake ved å gjenåpne utveien først — aldri omvendt."],
    "<b>The price of saying no</b> — what happens if you refuse? Threats barely matter while the door is open; the same threats become total once the door shuts.": [
      "<b>El preu de dir que no</b> — què passa si et negues? Les amenaces gairebé no compten mentre la porta és oberta; les mateixes amenaces esdevenen totals un cop la porta es tanca.",
      "<b>El precio de decir que no</b> — ¿qué pasa si te niegas? Las amenazas apenas cuentan mientras la puerta está abierta; las mismas amenazas se vuelven totales una vez que la puerta se cierra.",
      "<b>Le prix de dire non</b> — que se passe-t-il si vous refusez ? Les menaces comptent à peine tant que la porte est ouverte ; les mêmes menaces deviennent totales une fois la porte fermée.",
      "<b>De prijs van nee zeggen</b> — wat gebeurt er als je weigert? Dreigingen doen er nauwelijks toe zolang de deur open is; dezelfde dreigingen worden totaal zodra de deur sluit.",
      "<b>Prisen for å si nei</b> — hva skjer om du nekter? Trusler betyr knapt noe mens døren er åpen; de samme truslene blir totale når døren lukkes."],
    "<b>The means of living</b> — food, land, tools: could you feed yourself, or is it all owned? Locks together with knowledge only when the controlled knowledge is <i>about</i> the resources — the priest’s right to declare the harvest.": [
      "<b>Els mitjans de vida</b> — menjar, terra, eines: et podries alimentar, o tot és propietat d'algú? Es lliga amb el coneixement només quan el coneixement controlat és <i>sobre</i> els recursos — el dret del sacerdot a declarar la collita.",
      "<b>Los medios de vida</b> — comida, tierra, herramientas: ¿podrías alimentarte, o todo tiene dueño? Se traba con el conocimiento solo cuando el conocimiento controlado es <i>sobre</i> los recursos — el derecho del sacerdote a declarar la cosecha.",
      "<b>Les moyens de subsistance</b> — nourriture, terre, outils : pourriez-vous vous nourrir, ou tout appartient-il à quelqu'un ? Ne se verrouille avec le savoir que lorsque le savoir contrôlé porte <i>sur</i> les ressources — le droit du prêtre de déclarer la récolte.",
      "<b>De bestaansmiddelen</b> — voedsel, land, gereedschap: zou je jezelf kunnen voeden, of is alles eigendom? Vergrendelt pas samen met kennis wanneer de gecontroleerde kennis <i>over</i> de hulpbronnen gaat — het recht van de priester om de oogst af te kondigen.",
      "<b>Livsgrunnlaget</b> — mat, jord, redskaper: kunne du brødfø deg selv, eller eies alt? Låses sammen med kunnskap bare når den kontrollerte kunnskapen er <i>om</i> ressursene — prestens rett til å erklære avlingen."],
    "<b>Access to knowledge</b> — can you learn what you’d need to live on your own, and to judge the claims made over you? Or is it monopolized?": [
      "<b>Accés al coneixement</b> — pots aprendre el que necessitaries per viure pel teu compte, i per jutjar les pretensions que es fan sobre tu? O està monopolitzat?",
      "<b>Acceso al conocimiento</b> — ¿puedes aprender lo que necesitarías para vivir por tu cuenta, y para juzgar las pretensiones que se hacen sobre ti? ¿O está monopolizado?",
      "<b>Accès au savoir</b> — pouvez-vous apprendre ce qu'il vous faudrait pour vivre par vous-même, et pour juger les prétentions exercées sur vous ? Ou est-il monopolisé ?",
      "<b>Toegang tot kennis</b> — kun je leren wat je nodig zou hebben om op jezelf te leven, en om de aanspraken over jou te beoordelen? Of is het gemonopoliseerd?",
      "<b>Tilgang til kunnskap</b> — kan du lære det du trenger for å leve på egen hånd, og for å bedømme kravene som stilles over deg? Eller er den monopolisert?"],
    "<b>Whether influence circulates</b> — does sway pass from person to person, or has it settled permanently on someone and their line?": [
      "<b>Si la influència circula</b> — l'ascendent passa de persona a persona, o s'ha assentat permanentment en algú i el seu llinatge?",
      "<b>Si la influencia circula</b> — ¿el ascendiente pasa de persona a persona, o se ha asentado permanentemente en alguien y su linaje?",
      "<b>Si l'influence circule</b> — l'ascendant passe-t-il de personne à personne, ou s'est-il fixé à demeure sur quelqu'un et sa lignée ?",
      "<b>Of invloed circuleert</b> — gaat de zeggenschap van persoon tot persoon, of is ze blijvend neergeslagen op iemand en zijn geslacht?",
      "<b>Om innflytelse sirkulerer</b> — går makten fra person til person, eller har den lagt seg permanent på noen og deres slekt?"],
    "<b>Verticality</b> — how far the composition has risen out of the flat band; the inverse of the power to take back.": [
      "<b>Verticalitat</b> — fins on s'ha enlairat la composició per sobre de la banda plana; l'invers del poder de recuperar.",
      "<b>Verticalidad</b> — cuánto se ha elevado la composición por encima de la banda plana; el inverso del poder de recuperar.",
      "<b>Verticalité</b> — à quel point la composition s'est élevée au-dessus de la bande plate ; l'inverse du pouvoir de reprendre.",
      "<b>Verticaliteit</b> — hoe ver de compositie boven de platte groep is uitgestegen; het omgekeerde van de macht om terug te nemen.",
      "<b>Vertikalitet</b> — hvor langt sammensetningen har reist seg ut av den flate gruppen; det motsatte av makten til å ta tilbake."],
    "<b>The temple</b> — the priest’s monopoly made into an institution: storehouse, ledger and altar. It rises with the sacred, tribute and records.": [
      "<b>El temple</b> — el monopoli del sacerdot convertit en institució: magatzem, llibre de comptes i altar. S'enlaira amb el sagrat, el tribut i els registres.",
      "<b>El templo</b> — el monopolio del sacerdote convertido en institución: almacén, libro de cuentas y altar. Se eleva con lo sagrado, el tributo y los registros.",
      "<b>Le temple</b> — le monopole du prêtre fait institution : entrepôt, registre et autel. Il s'élève avec le sacré, le tribut et les archives.",
      "<b>De tempel</b> — het monopolie van de priester tot instelling gemaakt: voorraadschuur, grootboek en altaar. Hij rijst met het heilige, schatting en administratie.",
      "<b>Tempelet</b> — prestens monopol gjort til en institusjon: lagerhus, regnskapsbok og alter. Det stiger med det hellige, tributt og opptegnelser."],
    "<b>The palace</b> (Sumerian é-gal, “big house”) — patron of the war-band, enforcer of property, holder of the inherited office. It rises with force, property and inheritance.": [
      "<b>El palau</b> (sumeri é-gal, «casa gran») — patró de la banda guerrera, garant de la propietat, titular del càrrec hereditari. S'enlaira amb la força, la propietat i l'herència.",
      "<b>El palacio</b> (sumerio é-gal, «casa grande») — patrón de la banda guerrera, garante de la propiedad, titular del cargo hereditario. Se eleva con la fuerza, la propiedad y la herencia.",
      "<b>Le palais</b> (sumérien é-gal, « grande maison ») — patron de la bande guerrière, garant de la propriété, détenteur de la charge héréditaire. Il s'élève avec la force, la propriété et l'héritage.",
      "<b>Het paleis</b> (Sumerisch é-gal, «groot huis») — beschermheer van de krijgsbende, handhaver van eigendom, houder van het erfelijke ambt. Het rijst met geweld, eigendom en erfenis.",
      "<b>Palasset</b> (sumerisk é-gal, «stort hus») — krigerflokkens beskytter, eiendommens håndhever, innehaver av det arvelige embetet. Det stiger med makt, eiendom og arv."],
    "<b>Big man / ruler</b> — rises by charisma and protection; the group lends him power. With force he can compel the priest and is sanctified above him.": [
      "<b>Gran home / governant</b> — s'enlaira pel carisma i la protecció; el grup li presta el poder. Amb la força pot obligar el sacerdot i és santificat per damunt d'ell.",
      "<b>Gran hombre / gobernante</b> — se eleva por el carisma y la protección; el grupo le presta el poder. Con la fuerza puede obligar al sacerdote y es santificado por encima de él.",
      "<b>Grand homme / dirigeant</b> — s'élève par le charisme et la protection ; le groupe lui prête le pouvoir. Par la force, il peut contraindre le prêtre et est sanctifié au-dessus de lui.",
      "<b>Grote man / heerser</b> — stijgt door charisma en bescherming; de groep leent hem de macht. Met geweld kan hij de priester dwingen en wordt boven hem geheiligd.",
      "<b>Stormann / hersker</b> — stiger ved karisma og beskyttelse; gruppen låner ham makten. Med makt kan han tvinge presten og helliges over ham."],
    "<b>Priest / shaman</b> — a charismatic mediator the group believes; his is the sacred monopoly and the first rules.": [
      "<b>Sacerdot / xaman</b> — un mediador carismàtic que el grup creu; seu és el monopoli sagrat i les primeres regles.",
      "<b>Sacerdote / chamán</b> — un mediador carismático al que el grupo cree; suyo es el monopolio sagrado y las primeras reglas.",
      "<b>Prêtre / chaman</b> — un médiateur charismatique que le groupe croit ; à lui le monopole sacré et les premières règles.",
      "<b>Priester / sjamaan</b> — een charismatische bemiddelaar die de groep gelooft; van hem is het heilige monopolie en de eerste regels.",
      "<b>Prest / sjaman</b> — en karismatisk megler gruppen tror på; hans er det hellige monopolet og de første reglene."],
    "<b>Enforcer / warrior</b> — a war-band raised from the base, rewarded to defend what was yielded.": [
      "<b>Executor / guerrer</b> — una banda guerrera reclutada de la base, recompensada per defensar el que es va cedir.",
      "<b>Ejecutor / guerrero</b> — una banda guerrera reclutada de la base, recompensada por defender lo que se cedió.",
      "<b>Exécutant / guerrier</b> — une bande guerrière levée dans la base, récompensée pour défendre ce qui a été cédé.",
      "<b>Handhaver / krijger</b> — een krijgsbende uit de basis, beloond om te verdedigen wat werd afgestaan.",
      "<b>Håndhever / kriger</b> — en krigerflokk reist fra basen, belønnet for å forsvare det som ble gitt fra seg."],
    "<b>Producer</b> — the base. In the circle they actively level would-be bosses (ridicule, ostracism, exile); in the pyramid they yield power upward and carry it.": [
      "<b>Productor</b> — la base. En el cercle anivellen activament els qui volen manar (burla, ostracisme, exili); en la piràmide cedeixen el poder cap amunt i el carreguen.",
      "<b>Productor</b> — la base. En el círculo nivelan activamente a los que quieren mandar (burla, ostracismo, exilio); en la pirámide ceden el poder hacia arriba y lo cargan.",
      "<b>Producteur</b> — la base. Dans le cercle, ils nivellent activement les aspirants chefs (moquerie, ostracisme, exil) ; dans la pyramide, ils cèdent le pouvoir vers le haut et le portent.",
      "<b>Producent</b> — de basis. In de cirkel nivelleren ze actief mogelijke bazen (spot, uitsluiting, verbanning); in de piramide staan ze macht naar boven af en dragen die.",
      "<b>Produsent</b> — basen. I sirkelen utjevner de aktivt mulige sjefer (hån, utstøting, eksil); i pyramiden gir de makt oppover og bærer den."],
    "<b>Priesthood</b> — the sacred establishment at the apex; its share of the elite tracks the temple’s weight in the order.": [
      "<b>Sacerdoci</b> — l'establiment sagrat a l'àpex; la seva part de l'elit segueix el pes del temple en l'ordre.",
      "<b>Sacerdocio</b> — el establecimiento sagrado en el ápice; su parte de la élite sigue el peso del templo en el orden.",
      "<b>Sacerdoce</b> — l'establishment sacré au sommet ; sa part de l'élite suit le poids du temple dans l'ordre.",
      "<b>Priesterschap</b> — het heilige establishment aan de top; zijn aandeel in de elite volgt het gewicht van de tempel in de orde.",
      "<b>Presteskapet</b> — det hellige etablissementet på toppen; dets andel av eliten følger tempelets vekt i ordenen."],
    "<b>Ruling class / politicians</b> — secular officeholders at the apex; their share of the elite tracks the palace–state’s weight.": [
      "<b>Classe dirigent / polítics</b> — titulars de càrrecs seculars a l'àpex; la seva part de l'elit segueix el pes del palau-estat.",
      "<b>Clase dirigente / políticos</b> — titulares de cargos seculares en el ápice; su parte de la élite sigue el peso del palacio-estado.",
      "<b>Classe dirigeante / politiciens</b> — détenteurs de charges séculières au sommet ; leur part de l'élite suit le poids du palais-État.",
      "<b>Heersende klasse / politici</b> — wereldlijke ambtsdragers aan de top; hun aandeel in de elite volgt het gewicht van de paleis-staat.",
      "<b>Herskende klasse / politikere</b> — verdslige embetsinnehavere på toppen; deres andel av eliten følger palass-statens vekt."],
    "<b>Sedentism & circumscription</b> — Fixed fields, bounded land and a filling landscape make walking away unsurvivable — <b>the keystone</b>: villages are old, but only when the country fills in does the way out truly close. While it is open every other hold stays loose; once it shuts, they all tighten.": [
      "<b>Sedentisme i circumscripció</b> — Els camps fixos, la terra delimitada i un paisatge que s'omple fan que marxar sigui inviable — <b>la clau de volta</b>: els pobles són antics, però només quan el país s'omple es tanca de debò la sortida. Mentre és oberta, totes les altres subjeccions queden fluixes; un cop es tanca, totes s'estrenyen.",
      "<b>Sedentarismo y circunscripción</b> — Los campos fijos, la tierra delimitada y un paisaje que se llena hacen que irse sea inviable — <b>la piedra angular</b>: los pueblos son antiguos, pero solo cuando el país se llena se cierra de verdad la salida. Mientras está abierta, los demás controles quedan flojos; una vez que se cierra, todos se aprietan.",
      "<b>Sédentarité et circonscription</b> — Des champs fixes, une terre délimitée et un paysage qui se remplit rendent le départ insurvivable — <b>la clé de voûte</b> : les villages sont anciens, mais ce n'est qu'une fois le pays rempli que l'issue se ferme vraiment. Tant qu'elle est ouverte, les autres emprises restent lâches ; une fois fermée, toutes se resserrent.",
      "<b>Sedentarisme en omsluiting</b> — Vaste akkers, begrensd land en een vollopend landschap maken weggaan onoverleefbaar — <b>de sluitsteen</b>: dorpen zijn oud, maar pas als het land volloopt sluit de uitweg echt. Zolang die open is, blijven de andere grepen los; zodra hij sluit, verstrakken ze allemaal.",
      "<b>Bofasthet og innesperring</b> — Faste åkrer, avgrenset land og et landskap som fylles opp gjør det ulevelig å dra — <b>bærebjelken</b>: landsbyer er gamle, men først når landet fylles, lukkes utveien for alvor. Mens den er åpen, holder de andre grepene seg løse; når den lukkes, strammes alle."],
    "<b>War-leader & warriors</b> — A protector commands a war-band raised from the base. Saying no acquires a price. He can compel even the priest.": [
      "<b>Cap de guerra i guerrers</b> — Un protector comanda una banda guerrera reclutada de la base. Dir que no té un preu. Pot obligar fins i tot el sacerdot.",
      "<b>Jefe de guerra y guerreros</b> — Un protector manda una banda guerrera reclutada de la base. Decir que no tiene un precio. Puede obligar incluso al sacerdote.",
      "<b>Chef de guerre et guerriers</b> — Un protecteur commande une bande guerrière levée dans la base. Dire non a un prix. Il peut contraindre même le prêtre.",
      "<b>Oorlogsleider en krijgers</b> — Een beschermer voert een krijgsbende uit de basis aan. Nee zeggen krijgt een prijs. Hij kan zelfs de priester dwingen.",
      "<b>Krigshøvding og krigere</b> — En beskytter befaler en krigerflokk reist fra basen. Å si nei får en pris. Han kan tvinge selv presten."],
    "<b>Sacralize the order</b> — The political order itself is declared eternal and divine — throne fused with altar. Refusal becomes heresy; the knowledge of how things could be otherwise is sealed. <span style=\"color:#5C6685\">(needs both a priest and a ruler)</span>": [
      "<b>Sacralitzar l'ordre</b> — El mateix ordre polític es declara etern i diví — el tron fusionat amb l'altar. La negativa esdevé heretgia; el coneixement de com podrien ser les coses altrament queda segellat. <span style=\"color:#5C6685\">(cal un sacerdot i un governant)</span>",
      "<b>Sacralizar el orden</b> — El propio orden político se declara eterno y divino — el trono fusionado con el altar. La negativa se vuelve herejía; el conocimiento de cómo podrían ser las cosas de otro modo queda sellado. <span style=\"color:#5C6685\">(requiere un sacerdote y un gobernante)</span>",
      "<b>Sacraliser l'ordre</b> — L'ordre politique lui-même est déclaré éternel et divin — le trône fusionné à l'autel. Le refus devient hérésie ; le savoir de ce qui pourrait être autrement est scellé. <span style=\"color:#5C6685\">(exige un prêtre et un dirigeant)</span>",
      "<b>De orde sacraliseren</b> — De politieke orde zelf wordt eeuwig en goddelijk verklaard — de troon versmolten met het altaar. Weigering wordt ketterij; de kennis van hoe het anders zou kunnen, wordt verzegeld. <span style=\"color:#5C6685\">(vereist een priester en een heerser)</span>",
      "<b>Hellige ordenen</b> — Selve den politiske ordenen erklæres evig og guddommelig — tronen smeltet sammen med alteret. Avvisning blir kjetteri; kunnskapen om hvordan ting kunne vært annerledes, forsegles. <span style=\"color:#5C6685\">(krever både en prest og en hersker)</span>"],
    "<b>Tribute</b> — A share of what everyone produces flows up to an authority — subsistence starts to pass through other hands. <span style=\"color:#5C6685\">(needs an authority (priest or leader))</span>": [
      "<b>Tribut</b> — Una part del que tothom produeix flueix cap amunt a una autoritat — la subsistència comença a passar per altres mans. <span style=\"color:#5C6685\">(cal una autoritat (sacerdot o líder))</span>",
      "<b>Tributo</b> — Una parte de lo que todos producen fluye hacia arriba a una autoridad — la subsistencia empieza a pasar por otras manos. <span style=\"color:#5C6685\">(requiere una autoridad (sacerdote o líder))</span>",
      "<b>Tribut</b> — Une part de ce que chacun produit remonte vers une autorité — la subsistance commence à passer par d'autres mains. <span style=\"color:#5C6685\">(exige une autorité (prêtre ou chef))</span>",
      "<b>Schatting</b> — Een deel van wat iedereen voortbrengt stroomt omhoog naar een gezag — het levensonderhoud begint door andere handen te gaan. <span style=\"color:#5C6685\">(vereist een gezag (priester of leider))</span>",
      "<b>Tributt</b> — En del av det alle produserer, flyter oppover til en autoritet — livsgrunnlaget begynner å gå gjennom andre hender. <span style=\"color:#5C6685\">(krever en autoritet (prest eller leder))</span>"],
    "<b>Private property</b> — Hoarding the group’s resources, once shameful and leveled, is reclassified as a legitimate, enforceable claim: ‘ours’ becomes ‘his’. The means of independent subsistence are enclosed — and with fields owned, leaving gets dearer too. <span style=\"color:#5C6685\">(needs enforcement, wealth, or the sacred)</span>": [
      "<b>Propietat privada</b> — Acaparar els recursos del grup, abans vergonyós i anivellat, es reclassifica com una reivindicació legítima i exigible: ‘nostre’ esdevé ‘seu’. Els mitjans de subsistència independent queden tancats — i amb els camps en propietat, marxar també es torna més car. <span style=\"color:#5C6685\">(cal coacció, riquesa o el sagrat)</span>",
      "<b>Propiedad privada</b> — Acaparar los recursos del grupo, antes vergonzoso y nivelado, se reclasifica como una reivindicación legítima y exigible: ‘nuestro’ se vuelve ‘suyo’. Los medios de subsistencia independiente quedan cercados — y con los campos en propiedad, irse también se vuelve más caro. <span style=\"color:#5C6685\">(requiere coacción, riqueza o lo sagrado)</span>",
      "<b>Propriété privée</b> — L'accaparement des ressources du groupe, jadis honteux et nivelé, est requalifié en revendication légitime et opposable : ‘le nôtre’ devient ‘le sien’. Les moyens de subsistance indépendante sont enclos — et, les champs étant possédés, partir devient aussi plus coûteux. <span style=\"color:#5C6685\">(exige la contrainte, la richesse ou le sacré)</span>",
      "<b>Privé-eigendom</b> — Het hamsteren van de groepshulpbronnen, ooit beschamend en genivelleerd, wordt geherclassificeerd als een legitieme, afdwingbare aanspraak: ‘van ons’ wordt ‘van hem’. De middelen voor zelfstandig bestaan worden omheind — en met akkers in eigendom wordt vertrekken ook duurder. <span style=\"color:#5C6685\">(vereist handhaving, rijkdom of het heilige)</span>",
      "<b>Privat eiendom</b> — Hamstring av gruppens ressurser, en gang skammelig og utjevnet, omklassifiseres som et legitimt, håndhevbart krav: ‘vårt’ blir ‘hans’. Midlene til uavhengig livsgrunnlag innhegnes — og med åkrene eid blir det også dyrere å dra. <span style=\"color:#5C6685\">(krever tvang, rikdom eller det hellige)</span>"],
    "<b>Sacred specialist</b> — A charismatic figure claims to mediate with the spirits; animism’s open access narrows to a shaman. The group <b>yields</b> the monopoly — and the first sacred rules, church-enforced.": [
      "<b>Especialista sagrat</b> — Una figura carismàtica afirma mediar amb els esperits; l'accés obert de l'animisme s'estreny a un xaman. El grup <b>cedeix</b> el monopoli — i les primeres regles sagrades, imposades per l'església.",
      "<b>Especialista sagrado</b> — Una figura carismática afirma mediar con los espíritus; el acceso abierto del animismo se estrecha a un chamán. El grupo <b>cede</b> el monopolio — y las primeras reglas sagradas, impuestas por la iglesia.",
      "<b>Spécialiste du sacré</b> — Une figure charismatique prétend intercéder auprès des esprits ; l'accès ouvert de l'animisme se restreint à un chaman. Le groupe <b>cède</b> le monopole — et les premières règles sacrées, imposées par l'Église.",
      "<b>Heilige specialist</b> — Een charismatische figuur beweert tussen de geesten te bemiddelen; de open toegang van het animisme versmalt tot een sjamaan. De groep <b>geeft</b> het monopolie op — en de eerste heilige regels, door de kerk afgedwongen.",
      "<b>Hellig spesialist</b> — En karismatisk skikkelse hevder å megle med åndene; animismens åpne tilgang innsnevres til en sjaman. Gruppen <b>gir fra seg</b> monopolet — og de første hellige reglene, håndhevet av kirken."],
    "<b>Records & writing</b> — Tallies, tokens and seals — and much later, writing. Accounts and knowledge are codified and controlled. When the controlled knowledge is <i>about the stores</i> (the right to declare the harvest), knowledge and the means of living lock together. <span style=\"color:#5C6685\">(needs the sacred or tribute)</span>": [
      "<b>Registres i escriptura</b> — Osques, fitxes i segells — i molt més tard, l'escriptura. Els comptes i el coneixement es codifiquen i es controlen. Quan el coneixement controlat és <i>sobre els magatzems</i> (el dret a declarar la collita), el coneixement i els mitjans de vida es lliguen. <span style=\"color:#5C6685\">(cal el sagrat o el tribut)</span>",
      "<b>Registros y escritura</b> — Muescas, fichas y sellos — y mucho más tarde, la escritura. Las cuentas y el conocimiento se codifican y se controlan. Cuando el conocimiento controlado es <i>sobre los almacenes</i> (el derecho a declarar la cosecha), el conocimiento y los medios de vida se traban. <span style=\"color:#5C6685\">(requiere lo sagrado o el tributo)</span>",
      "<b>Archives et écriture</b> — Encoches, jetons et sceaux — et bien plus tard, l'écriture. Les comptes et le savoir sont codifiés et contrôlés. Quand le savoir contrôlé porte <i>sur les réserves</i> (le droit de déclarer la récolte), le savoir et les moyens de subsistance se verrouillent. <span style=\"color:#5C6685\">(exige le sacré ou le tribut)</span>",
      "<b>Administratie en schrift</b> — Kerfstokken, fiches en zegels — en veel later het schrift. Rekeningen en kennis worden gecodificeerd en gecontroleerd. Wanneer de gecontroleerde kennis <i>over de voorraden</i> gaat (het recht om de oogst af te kondigen), grendelen kennis en bestaansmiddelen samen. <span style=\"color:#5C6685\">(vereist het heilige of schatting)</span>",
      "<b>Opptegnelser og skrift</b> — Karvestokker, sjetonger og segl — og mye senere, skriften. Regnskap og kunnskap kodifiseres og kontrolleres. Når den kontrollerte kunnskapen er <i>om lagrene</i> (retten til å erklære avlingen), låses kunnskap og livsgrunnlag sammen. <span style=\"color:#5C6685\">(krever det hellige eller tributt)</span>"],
    "<b>Aggrandizer (feasts, debt)</b> — A generous big-man wins favour and turns feasts into debt and clients — persuasive sway begins to settle in one person.": [
      "<b>Engrandidor (festins, deute)</b> — Un big-man generós es guanya el favor i converteix els festins en deute i clients — l'ascendent persuasiu comença a assentar-se en una persona.",
      "<b>Engrandecedor (festines, deuda)</b> — Un big-man generoso se gana el favor y convierte los festines en deuda y clientes — el ascendiente persuasivo empieza a asentarse en una persona.",
      "<b>Magnificateur (festins, dette)</b> — Un big-man généreux gagne les faveurs et transforme les festins en dette et en clients — l'ascendant persuasif commence à se fixer sur une personne.",
      "<b>Grootmaker (feesten, schuld)</b> — Een gulle big-man wint gunst en verandert feesten in schuld en cliënten — de overtuigende zeggenschap begint zich op één persoon vast te zetten.",
      "<b>Storgjører (gjestebud, gjeld)</b> — En raus stormann vinner gunst og gjør gjestebud om til gjeld og klienter — den overtalende innflytelsen begynner å legge seg på én person."],
    "<b>Lifelong office</b> — A grant for the moment is made to last a lifetime — influence stops oscillating. <span style=\"color:#5C6685\">(needs a leader)</span>": [
      "<b>Càrrec vitalici</b> — Una concessió per al moment es fa durar tota una vida — la influència deixa d'oscil·lar. <span style=\"color:#5C6685\">(cal un líder)</span>",
      "<b>Cargo vitalicio</b> — Una concesión para el momento se hace durar toda una vida — la influencia deja de oscilar. <span style=\"color:#5C6685\">(requiere un líder)</span>",
      "<b>Charge à vie</b> — Une concession pour l'instant est rendue durable une vie entière — l'influence cesse d'osciller. <span style=\"color:#5C6685\">(exige un chef)</span>",
      "<b>Levenslang ambt</b> — Een verlening voor het moment wordt een leven lang gemaakt — invloed houdt op met oscilleren. <span style=\"color:#5C6685\">(vereist een leider)</span>",
      "<b>Livsvarig embete</b> — En tildeling for øyeblikket gjøres varig livet ut — innflytelsen slutter å svinge. <span style=\"color:#5C6685\">(krever en leder)</span>"],
    "<b>Hereditary office</b> — The office is owned and passed to sons, as property is — sway set in a fixed lineage. <span style=\"color:#5C6685\">(needs a lifelong office and property)</span>": [
      "<b>Càrrec hereditari</b> — El càrrec es posseeix i es transmet als fills, com la propietat — l'ascendent fixat en un llinatge. <span style=\"color:#5C6685\">(cal un càrrec vitalici i propietat)</span>",
      "<b>Cargo hereditario</b> — El cargo se posee y se transmite a los hijos, como la propiedad — el ascendiente fijado en un linaje. <span style=\"color:#5C6685\">(requiere un cargo vitalicio y propiedad)</span>",
      "<b>Charge héréditaire</b> — La charge est possédée et transmise aux fils, comme la propriété — l'ascendant fixé dans une lignée. <span style=\"color:#5C6685\">(exige une charge à vie et la propriété)</span>",
      "<b>Erfelijk ambt</b> — Het ambt wordt bezeten en aan zonen doorgegeven, zoals eigendom — de zeggenschap vastgezet in een geslacht. <span style=\"color:#5C6685\">(vereist een levenslang ambt en eigendom)</span>",
      "<b>Arvelig embete</b> — Embetet eies og gis videre til sønner, slik som eiendom — innflytelsen festet i en slekt. <span style=\"color:#5C6685\">(krever et livsvarig embete og eiendom)</span>"],
    "<b>Monument</b> — Built into stone, the order looks permanent and beyond question; the labour is taken from the base. <span style=\"color:#5C6685\">(needs authority and mobilised labour)</span>": [
      "<b>Monument</b> — Construït en pedra, l'ordre sembla permanent i indiscutible; la mà d'obra es pren de la base. <span style=\"color:#5C6685\">(cal autoritat i mà d'obra mobilitzada)</span>",
      "<b>Monumento</b> — Construido en piedra, el orden parece permanente e incuestionable; la mano de obra se toma de la base. <span style=\"color:#5C6685\">(requiere autoridad y mano de obra movilizada)</span>",
      "<b>Monument</b> — Bâti dans la pierre, l'ordre paraît permanent et incontestable ; la main-d'œuvre est prise dans la base. <span style=\"color:#5C6685\">(exige l'autorité et une main-d'œuvre mobilisée)</span>",
      "<b>Monument</b> — In steen gebouwd lijkt de orde permanent en onbetwistbaar; de arbeid wordt aan de basis onttrokken. <span style=\"color:#5C6685\">(vereist gezag en gemobiliseerde arbeid)</span>",
      "<b>Monument</b> — Bygd i stein virker ordenen permanent og hevet over tvil; arbeidskraften tas fra basen. <span style=\"color:#5C6685\">(krever autoritet og mobilisert arbeidskraft)</span>"],
    "<b>Disuse (leveling abandoned)</b> — No one hoards, no one commands — but teasing the proud, gathering to decide, and walking away fall out of use. A power never used eventually stops working: the door, never opened, rusts shut. <b>Unfreedom with no villain.</b>": [
      "<b>Desús (anivellament abandonat)</b> — Ningú no acapara, ningú no mana — però burlar-se de l'orgullós, reunir-se per decidir i marxar cauen en desús. Un poder que mai no s'usa acaba deixant de funcionar: la porta, mai oberta, es rovella. <b>Manca de llibertat sense cap dolent.</b>",
      "<b>Desuso (nivelación abandonada)</b> — Nadie acapara, nadie manda — pero burlarse del orgulloso, reunirse para decidir y marcharse caen en desuso. Un poder que nunca se usa acaba dejando de funcionar: la puerta, nunca abierta, se oxida. <b>Falta de libertad sin villano.</b>",
      "<b>Désuétude (nivellement abandonné)</b> — Personne n'accapare, personne ne commande — mais se moquer de l'orgueilleux, se réunir pour décider et partir tombent en désuétude. Un pouvoir jamais employé finit par ne plus fonctionner : la porte, jamais ouverte, rouille. <b>Une non-liberté sans méchant.</b>",
      "<b>Onbruik (nivellering opgegeven)</b> — Niemand hamstert, niemand beveelt — maar de trotse plagen, samenkomen om te beslissen en weglopen raken in onbruik. Een macht die nooit gebruikt wordt, stopt uiteindelijk met werken: de deur, nooit geopend, roest vast. <b>Onvrijheid zonder schurk.</b>",
      "<b>Bruksopphør (utjevning forlatt)</b> — Ingen hamstrer, ingen befaler — men å gjøre narr av den stolte, å samles for å bestemme og å dra faller ut av bruk. En makt som aldri brukes, slutter til slutt å virke: døren, aldri åpnet, ruster. <b>Ufrihet uten skurk.</b>"]
  };

  // ---- engine ----
  var cur = "en";
  try { var saved = localStorage.getItem("pf-lang"); if (saved && (saved === "en" || NAMES[saved])) cur = saved; } catch (e) {}

  var M = null, KEYS = [], MH = null;
  function buildMap() {
    if (cur === "en") { M = null; KEYS = []; MH = null; return; }
    var i = ORD.indexOf(cur); M = {};
    for (var en in TR) { var t = TR[en][i]; if (t) M[en] = t; }
    KEYS = Object.keys(M).sort(function (a, b) { return b.length - a.length; });   // longest first
    MH = {}; for (var eh in TRH) { var th = TRH[eh][i]; if (th) MH[eh] = th; }
  }
  buildMap();

  function trStr(s) {
    if (!M || !s) return s;
    var out = s;
    for (var j = 0; j < KEYS.length; j++) { var k = KEYS[j]; if (out.indexOf(k) >= 0) out = out.split(k).join(M[k]); }
    return out;
  }

  var DYN_IDS = ["verdict", "cfg", "rc", "pvEra", "pvEraSub", "pvYear", "tlYear"];
  var SKIP_SEL = "#" + DYN_IDS.join(",#");
  var ORIG = new WeakMap();

  function staticRoots() {
    return [".brand", ".gauges", "#palette", "#compare", ".acts", "#expBtn", '[data-pop="argument"]', "#timelineBtn"]
      .map(function (s) { return document.querySelector(s); }).filter(Boolean);
  }
  function textNodes(root) {
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), n, a = [];
    while ((n = w.nextNode())) a.push(n);
    return a;
  }
  function applyStatic() {
    staticRoots().forEach(function (root) {
      textNodes(root).forEach(function (nd) {
        if (!nd.nodeValue || !nd.nodeValue.trim()) return;
        var p = nd.parentElement;
        if (p && p.closest && p.closest(SKIP_SEL)) return;          // dynamic elements handled by the tick
        if (!ORIG.has(nd)) ORIG.set(nd, nd.nodeValue);              // snapshot the English original once
        var o = ORIG.get(nd);
        var t = M ? trStr(o) : o;                                   // always translate from the original (so switching back to EN restores)
        if (nd.nodeValue !== t) nd.nodeValue = t;
      });
    });
  }

  // The app rewrites these regions (captions, verdict, palette %, timeline) in
  // English every frame. A MutationObserver re-translates AFTER each write, so the
  // browser only ever paints the translated text — no per-frame flicker. Our own
  // edits are idempotent (translated text holds no English keys) so they don't loop.
  var DYN_ROOTS = ["#reading", "#verdict", "#pivot", "#tlBar", "#palette", "#timelineBtn", "#tip"];
  function translateRoot(root) {
    if (!M || !root) return;
    textNodes(root).forEach(function (nd) {
      var v = nd.nodeValue; if (!v || !v.trim()) return;
      var t = trStr(v); if (t !== v) nd.nodeValue = t;
    });
  }
  // whole-block HTML swap for rich elements (tooltip body, beat lines) — preserves <b>/<i>
  function trHTML(el) { if (!MH || !el) return; var h = el.innerHTML; if (MH[h] != null && h !== MH[h]) el.innerHTML = MH[h]; }
  function translateRich(root) {
    if (!MH || !root) return;
    if (root.id === "tip") trHTML(root);
    var lines = root.querySelectorAll ? root.querySelectorAll(".pvline") : [];
    for (var i = 0; i < lines.length; i++) trHTML(lines[i]);
  }
  function translateDynamic() {
    DYN_ROOTS.forEach(function (s) { var r = document.querySelector(s); translateRoot(r); translateRich(r); });
  }

  var obs = null;
  function observe() {
    if (obs) obs.disconnect();
    obs = new MutationObserver(function (muts) {
      if (!M) return;
      var roots = [];
      muts.forEach(function (mu) {
        var n = mu.target, el = (n.nodeType === 3 ? n.parentElement : n);
        if (!el || !el.closest) return;
        var r = el.closest(DYN_ROOTS.join(","));
        if (r && roots.indexOf(r) < 0) roots.push(r);
      });
      roots.forEach(function (r) { translateRoot(r); translateRich(r); });
    });
    DYN_ROOTS.forEach(function (s) {
      var r = document.querySelector(s);
      if (r) obs.observe(r, { childList: true, characterData: true, subtree: true });
    });
  }

  function buildSelector() {
    var host = document.querySelector(".top .right"); if (!host || document.getElementById("pfLang")) return;
    var sel = document.createElement("select");
    sel.id = "pfLang"; sel.className = "chip"; sel.title = "Language";
    sel.style.cssText = "cursor:pointer;-webkit-appearance:none;appearance:none;padding-right:9px";
    for (var c in NAMES) { var o = document.createElement("option"); o.value = c; o.textContent = NAMES[c]; if (c === cur) o.selected = true; sel.appendChild(o); }
    sel.addEventListener("change", function () {
      cur = sel.value; try { localStorage.setItem("pf-lang", cur); } catch (e) {}
      buildMap(); applyStatic(); translateDynamic();
    });
    host.insertBefore(sel, host.firstChild);
  }

  function start() { buildSelector(); applyStatic(); observe(); translateDynamic(); }
  if (document.readyState !== "loading") start();
  else document.addEventListener("DOMContentLoaded", start);
})();
