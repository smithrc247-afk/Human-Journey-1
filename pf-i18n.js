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
    "Early city-states & god-kings": ["Primeres ciutats-estat i déus-reis", "Primeras ciudades-estado y reyes-dioses", "Premières cités-États et rois-dieux", "Vroege stadstaten en god-koningen", "Tidlige bystater og gudekonger"],
    "Classical empires": ["Imperis clàssics", "Imperios clásicos", "Empires classiques", "Klassieke rijken", "Klassiske imperier"],
    "Feudalism": ["Feudalisme", "Feudalismo", "Féodalité", "Feodalisme", "Føydalisme"],
    "Mercantilism & Colonialism": ["Mercantilisme i colonialisme", "Mercantilismo y colonialismo", "Mercantilisme et colonialisme", "Mercantilisme en kolonialisme", "Merkantilisme og kolonialisme"],
    "Industrial Capitalism": ["Capitalisme industrial", "Capitalismo industrial", "Capitalisme industriel", "Industrieel kapitalisme", "Industriell kapitalisme"],
    "The Modern Globalized Economy": ["L'economia global moderna", "La economía global moderna", "L'économie mondialisée moderne", "De moderne geglobaliseerde economie", "Den moderne globaliserte økonomien"],
    "Stored grain feeds those who never farm. The temple keeps the accounts and the god-king fuses throne and altar — the take-back power, once lent, is seized.": ["El gra emmagatzemat alimenta els qui mai no conreen. El temple porta els comptes i el déu-rei fusiona el tron i l'altar — el poder de recuperar, un cop prestat, és pres.", "El grano almacenado alimenta a quienes nunca cultivan. El templo lleva las cuentas y el rey-dios fusiona el trono y el altar — el poder de recuperar, una vez prestado, es arrebatado.", "Le grain stocké nourrit ceux qui ne cultivent jamais. Le temple tient les comptes et le roi-dieu fusionne le trône et l'autel — le pouvoir de reprendre, une fois prêté, est saisi.", "Opgeslagen graan voedt wie nooit boert. De tempel houdt de rekeningen en de god-koning versmelt troon en altaar — de macht om terug te nemen, eenmaal geleend, wordt gegrepen.", "Lagret korn fôrer dem som aldri dyrker. Tempelet fører regnskapet og gudekongen smelter sammen trone og alter — makten til å ta tilbake, en gang lånt, blir grepet."],
    "Codified law, coinage and mass slavery. The order runs as a structure, not just a person — and the enslaved produce much yet own nothing.": ["Llei codificada, moneda i esclavitud massiva. L'ordre funciona com una estructura, no només com una persona — i els esclaus produeixen molt però no posseeixen res.", "Ley codificada, moneda y esclavitud masiva. El orden funciona como una estructura, no solo como una persona — y los esclavizados producen mucho pero no poseen nada.", "Droit codifié, monnaie et esclavage de masse. L'ordre fonctionne comme une structure, non plus seulement une personne — et les esclaves produisent beaucoup mais ne possèdent rien.", "Gecodificeerd recht, muntgeld en massaslavernij. De orde draait als een structuur, niet meer als één persoon — en de tot slaaf gemaakten produceren veel maar bezitten niets.", "Kodifisert lov, mynt og masseslaveri. Ordenen kjører som en struktur, ikke bare som en person — og de slavebundne produserer mye, men eier ingenting."],
    "Born a serf, die a serf. Land is bound to bloodline; the lord is owner, judge and warrior at once, and the way out stays closed.": ["Neixes serf, mors serf. La terra està lligada al llinatge; el senyor és alhora propietari, jutge i guerrer, i la sortida continua tancada.", "Naces siervo, mueres siervo. La tierra está ligada al linaje; el señor es a la vez propietario, juez y guerrero, y la salida sigue cerrada.", "Né serf, mort serf. La terre est liée à la lignée ; le seigneur est à la fois propriétaire, juge et guerrier, et l'issue reste fermée.", "Als horige geboren, als horige gestorven. Land is aan bloedlijn gebonden; de heer is tegelijk eigenaar, rechter en krijger, en de uitweg blijft gesloten.", "Født som livegen, dø som livegen. Jorda er bundet til slektslinjen; herren er eier, dommer og kriger på én gang, og utveien forblir stengt."],
    "Power goes global. Chartered companies fuse capital with state force, and a racialised, heritable enslaved class is built at the base.": ["El poder es fa global. Les companyies privilegiades fusionen el capital amb la força de l'estat, i es construeix a la base una classe esclava racialitzada i hereditària.", "El poder se hace global. Las compañías privilegiadas fusionan el capital con la fuerza del estado, y se construye en la base una clase esclava racializada y hereditaria.", "Le pouvoir devient mondial. Les compagnies à charte fusionnent le capital avec la force de l'État, et une classe d'esclaves racialisée et héréditaire est bâtie à la base.", "Macht wordt mondiaal. Gepatenteerde compagnieën versmelten kapitaal met staatsgeweld, en aan de basis wordt een geracialiseerde, erfelijke slavenklasse gebouwd.", "Makten blir global. Privilegerte selskaper smelter sammen kapital med statsmakt, og en rasialisert, arvelig slaveklasse bygges ved basen."],
    "Mills concentrate wealth — yet the worker, legally free and massed in factories, can organise. Unions, the vote and the welfare state bend the curve back.": ["Les fàbriques concentren la riquesa — però el treballador, legalment lliure i aplegat a les fàbriques, es pot organitzar. Els sindicats, el vot i l'estat del benestar tornen a doblegar la corba.", "Las fábricas concentran la riqueza — pero el trabajador, legalmente libre y reunido en las fábricas, puede organizarse. Los sindicatos, el voto y el estado de bienestar vuelven a doblar la curva.", "Les usines concentrent la richesse — mais l'ouvrier, légalement libre et massé dans les usines, peut s'organiser. Les syndicats, le vote et l'État-providence rabattent la courbe.", "Fabrieken concentreren rijkdom — maar de arbeider, wettelijk vrij en samengepakt in fabrieken, kan zich organiseren. Vakbonden, het stemrecht en de verzorgingsstaat buigen de curve terug.", "Fabrikker konsentrerer rikdom — men arbeideren, juridisk fri og samlet i fabrikker, kan organisere seg. Fagforeninger, stemmeretten og velferdsstaten bøyer kurven tilbake."],
    "Formal power is one-person-one-vote, yet wealth re-concentrates at the top. Ownership re-fuses with management, and the determinants run worldwide.": ["El poder formal és un vot per persona, però la riquesa es torna a concentrar a dalt. La propietat es torna a fusionar amb la gestió, i els determinants operen a escala mundial.", "El poder formal es un voto por persona, pero la riqueza se vuelve a concentrar arriba. La propiedad se vuelve a fusionar con la gestión, y los determinantes operan a escala mundial.", "Le pouvoir formel est un vote par personne, mais la richesse se reconcentre au sommet. La propriété refusionne avec la gestion, et les déterminants opèrent à l'échelle mondiale.", "Formele macht is één persoon, één stem, maar rijkdom concentreert zich opnieuw aan de top. Eigendom versmelt opnieuw met management, en de determinanten werken wereldwijd.", "Formell makt er én person, én stemme, men rikdommen samler seg igjen på toppen. Eierskap smelter på nytt sammen med ledelse, og determinantene virker verden over."],
    "Power is shared": ["El poder es comparteix", "El poder se comparte", "Le pouvoir est partagé", "Macht wordt gedeeld", "Makt deles"],
    "The state is born": ["Neix l'estat", "Nace el estado", "L'État naît", "De staat wordt geboren", "Staten blir til"],
    "Power outlives the ruler": ["El poder sobreviu al governant", "El poder sobrevive al gobernante", "Le pouvoir survit au dirigeant", "Macht overleeft de heerser", "Makten overlever herskeren"],
    "The door is bolted": ["La porta es panya", "La puerta se atranca", "La porte est verrouillée", "De deur wordt vergrendeld", "Døren boltes igjen"],
    "Command without a face": ["Comandament sense rostre", "Mando sin rostro", "Le commandement sans visage", "Bevel zonder gezicht", "Kommando uten ansikt"],
    "The door cracks open": ["La porta s'entreobre", "La puerta se entreabre", "La porte s'entrouvre", "De deur gaat op een kier", "Døren åpnes på gløtt"],
    "Re-fused at the top": ["Refusionat a dalt", "Refundido en la cima", "Refusionné au sommet", "Opnieuw versmolten aan de top", "Smeltet sammen igjen på toppen"],
    "Egalitarian foragers": ["Forrajadors igualitaris", "Forrajeros igualitarios", "Chasseurs-cueilleurs égalitaires", "Egalitaire jager-verzamelaars", "Egalitære sankere"],
    "The door is open": ["La porta és oberta", "La puerta está abierta", "La porte est ouverte", "De deur is open", "Døren er åpen"],
    "Power is shared among equals and kept flat on purpose — the boastful teased, the bossy ignored, and anyone free to walk away. The take-back power is alive, used daily.": ["El poder es comparteix entre iguals i es manté pla expressament — el fanfarró és objecte de burla, el manaire ignorat, i tothom és lliure de marxar. El poder de recuperar és viu, usat cada dia.", "El poder se comparte entre iguales y se mantiene plano a propósito — el fanfarrón es objeto de burla, el mandón ignorado, y todos son libres de marcharse. El poder de recuperar está vivo, usado a diario.", "Le pouvoir est partagé entre égaux et maintenu plat à dessein — le vantard est moqué, l'autoritaire ignoré, et chacun est libre de partir. Le pouvoir de reprendre est vivant, employé chaque jour.", "Macht wordt gedeeld onder gelijken en bewust vlak gehouden — de opschepper geplaagd, de bazige genegeerd, en iedereen vrij om weg te lopen. De macht om terug te nemen leeft, dagelijks gebruikt.", "Makt deles blant likemenn og holdes flat med vilje — skrytepaven ertes, den bossete overses, og alle står fritt til å dra. Makten til å ta tilbake er levende, brukt daglig."],
    "Means of living enclosed": ["Mitjans de vida tancats", "Medios de vida cercados", "Moyens de subsistance enclos", "Bestaansmiddelen omheind", "Livsgrunnlag innhegnet"],
    "Force becomes law": ["La força esdevé llei", "La fuerza se vuelve ley", "La force devient loi", "Geweld wordt wet", "Makt blir lov"],
    "Slavery at the base": ["Esclavitud a la base", "Esclavitud en la base", "L'esclavage à la base", "Slavernij aan de basis", "Slaveri ved basen"],
    "The door stays shut": ["La porta segueix tancada", "La puerta sigue cerrada", "La porte reste fermée", "De deur blijft dicht", "Døren forblir lukket"],
    "Office made hereditary": ["Càrrec fet hereditari", "Cargo hecho hereditario", "Charge rendue héréditaire", "Ambt erfelijk gemaakt", "Embete gjort arvelig"],
    "Capital fuses with force": ["El capital es fusiona amb la força", "El capital se fusiona con la fuerza", "Le capital fusionne avec la force", "Kapitaal versmelt met geweld", "Kapital smelter sammen med makt"],
    "The Atlantic trade": ["El comerç atlàntic", "El comercio atlántico", "Le commerce atlantique", "De Atlantische handel", "Den atlantiske handelen"],
    "The worker is free": ["El treballador és lliure", "El trabajador es libre", "L'ouvrier est libre", "De arbeider is vrij", "Arbeideren er fri"],
    "…and can organise": ["…i es pot organitzar", "…y puede organizarse", "…et peut s'organiser", "…en kan zich organiseren", "…og kan organisere seg"],
    "Ownership re-fuses with management": ["La propietat es torna a fusionar amb la gestió", "La propiedad se vuelve a fusionar con la gestión", "La propriété refusionne avec la gestion", "Eigendom versmelt opnieuw met management", "Eierskap smelter på nytt sammen med ledelse"],
    "Influence runs worldwide": ["La influència opera arreu del món", "La influencia opera por todo el mundo", "L'influence opère dans le monde entier", "Invloed werkt wereldwijd", "Innflytelse virker verden over"],
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
      "<b>Bruksopphør (utjevning forlatt)</b> — Ingen hamstrer, ingen befaler — men å gjøre narr av den stolte, å samles for å bestemme og å dra faller ut av bruk. En makt som aldri brukes, slutter til slutt å virke: døren, aldri åpnet, ruster. <b>Ufrihet uten skurk.</b>"],
    "How to use this": ["Com utilitzar això", "Cómo usar esto", "Comment utiliser ceci", "Hoe dit te gebruiken", "Slik bruker du dette"],
    "A sandbox": ["Un espai lliure", "Un entorno libre", "Un bac à sable", "Een zandbak", "En sandkasse"],
    "The repertoire, not the ladder": ["El repertori, no l'escala", "El repertorio, no la escalera", "Le répertoire, non l'échelle", "Het repertoire, niet de ladder", "Repertoaret, ikke stigen"],
    "A theory of freedom": ["Una teoria de la llibertat", "Una teoría de la libertad", "Une théorie de la liberté", "Een theorie van vrijheid", "En teori om frihet"],
    "Begin ▸": ["Comença ▸", "Comenzar ▸", "Commencer ▸", "Beginnen ▸", "Begynn ▸"],
    "Drag any move’s slider to apply it partly or fully; drag back to undo it. Moves that need others are <b>locked</b> until their requirements are met, with the reason shown. The society and the freedom gauges respond live.": [
      "Arrossega el control lliscant de qualsevol moviment per aplicar-lo en part o del tot; arrossega'l enrere per desfer-lo. Els moviments que en necessiten d'altres estan <b>bloquejats</b> fins que es compleixen els seus requisits, amb el motiu indicat. La societat i els indicadors de llibertat responen en directe.",
      "Arrastra el control deslizante de cualquier movimiento para aplicarlo en parte o del todo; arrástralo atrás para deshacerlo. Los movimientos que necesitan otros están <b>bloqueados</b> hasta que se cumplen sus requisitos, con el motivo mostrado. La sociedad y los indicadores de libertad responden en directo.",
      "Faites glisser le curseur d'un mouvement pour l'appliquer en partie ou entièrement ; ramenez-le en arrière pour l'annuler. Les mouvements qui en nécessitent d'autres sont <b>verrouillés</b> jusqu'à ce que leurs conditions soient remplies, avec la raison indiquée. La société et les jauges de liberté réagissent en direct.",
      "Sleep de schuifregelaar van een zet om die deels of volledig toe te passen; sleep terug om die ongedaan te maken. Zetten die andere nodig hebben zijn <b>vergrendeld</b> tot aan hun vereisten is voldaan, met de reden erbij. De samenleving en de vrijheidsmeters reageren live.",
      "Dra glidebryteren for et trekk for å bruke det delvis eller fullt; dra tilbake for å angre det. Trekk som trenger andre er <b>låst</b> til kravene er oppfylt, med grunnen vist. Samfunnet og frihetsmålerne reagerer direkte."],
    "Click an <b>opening</b> in the strip below to load a whole composition and explore it, or <b>Reset</b> to empty the board. Use <b>Timeline of history</b> (top right) to watch one common road play out, then return to the sandbox with the same button.": [
      "Fes clic en una <b>obertura</b> de la tira de sota per carregar una composició sencera i explorar-la, o <b>Reinicia</b> per buidar el tauler. Fes servir <b>Línia del temps de la història</b> (a dalt a la dreta) per veure com es desplega un camí comú, i torna a l'espai lliure amb el mateix botó.",
      "Haz clic en una <b>apertura</b> de la tira de abajo para cargar una composición entera y explorarla, o <b>Reiniciar</b> para vaciar el tablero. Usa <b>Línea del tiempo de la historia</b> (arriba a la derecha) para ver desplegarse un camino común, y vuelve al entorno libre con el mismo botón.",
      "Cliquez sur une <b>ouverture</b> dans la bande ci-dessous pour charger une composition entière et l'explorer, ou <b>Réinitialiser</b> pour vider le plateau. Utilisez <b>Frise chronologique de l'histoire</b> (en haut à droite) pour voir se dérouler un chemin commun, puis revenez au bac à sable avec le même bouton.",
      "Klik op een <b>opening</b> in de strook hieronder om een hele compositie te laden en te verkennen, of <b>Herstellen</b> om het bord leeg te maken. Gebruik <b>Tijdlijn van de geschiedenis</b> (rechtsboven) om één gemeenschappelijke weg te zien ontvouwen, en keer met dezelfde knop terug naar de zandbak.",
      "Klikk på en <b>åpning</b> i stripen nedenfor for å laste en hel sammensetning og utforske den, eller <b>Nullstill</b> for å tømme brettet. Bruk <b>Historiens tidslinje</b> (øverst til høyre) for å se én vanlig vei utspille seg, og gå tilbake til sandkassen med samme knapp."],
    "Social power is the ability to influence others, steer your own circumstances, or make things happen. It isn’t a thing you hold — it lives in relationships, and it depends on what you control: resources, information, connections. In a small band it stays flat among equals, kept flat by deliberate effort — teasing the boastful, ignoring the bossy. What follows is not a fixed series of stages every society climbs. It’s a <b>repertoire</b>: a set of moves a society can make in <b>any order</b>, <b>partway</b>, and can <b>undo</b>.": [
      "El poder social és la capacitat d'influir en els altres, dirigir les pròpies circumstàncies o fer que les coses passin. No és una cosa que es tingui — viu en les relacions, i depèn del que controles: recursos, informació, connexions. En una banda petita es manté pla entre iguals, mantingut pla amb esforç deliberat — burlar-se del fanfarró, ignorar el manaire. El que segueix no és una sèrie fixa d'etapes que tota societat puja. És un <b>repertori</b>: un conjunt de moviments que una societat pot fer en <b>qualsevol ordre</b>, <b>en part</b>, i pot <b>desfer</b>.",
      "El poder social es la capacidad de influir en los demás, dirigir las propias circunstancias o hacer que las cosas pasen. No es algo que se tenga — vive en las relaciones, y depende de lo que controlas: recursos, información, conexiones. En una banda pequeña se mantiene plano entre iguales, mantenido plano con esfuerzo deliberado — burlarse del fanfarrón, ignorar al mandón. Lo que sigue no es una serie fija de etapas que toda sociedad sube. Es un <b>repertorio</b>: un conjunto de movimientos que una sociedad puede hacer en <b>cualquier orden</b>, <b>en parte</b>, y puede <b>deshacer</b>.",
      "Le pouvoir social est la capacité d'influencer les autres, d'orienter sa propre situation ou de faire advenir les choses. Ce n'est pas une chose que l'on détient — il vit dans les relations, et dépend de ce que vous contrôlez : ressources, information, relations. Dans une petite bande, il reste plat entre égaux, maintenu plat par un effort délibéré — se moquer du vantard, ignorer l'autoritaire. Ce qui suit n'est pas une série fixe d'étapes que toute société gravit. C'est un <b>répertoire</b> : un ensemble de mouvements qu'une société peut faire dans <b>n'importe quel ordre</b>, <b>partiellement</b>, et peut <b>annuler</b>.",
      "Sociale macht is het vermogen om anderen te beïnvloeden, je eigen omstandigheden te sturen of dingen te laten gebeuren. Het is geen ding dat je vasthoudt — het leeft in relaties, en hangt af van wat je beheerst: hulpbronnen, informatie, connecties. In een kleine groep blijft het vlak onder gelijken, vlak gehouden door bewuste inspanning — de opschepper plagen, de bazige negeren. Wat volgt is geen vaste reeks fasen die elke samenleving beklimt. Het is een <b>repertoire</b>: een reeks zetten die een samenleving in <b>elke volgorde</b>, <b>deels</b> kan doen, en kan <b>ongedaan maken</b>.",
      "Sosial makt er evnen til å påvirke andre, styre dine egne omstendigheter eller få ting til å skje. Det er ikke en ting du holder — den lever i relasjoner, og avhenger av hva du kontrollerer: ressurser, informasjon, forbindelser. I en liten gruppe holder den seg flat blant likemenn, holdt flat ved bevisst innsats — å gjøre narr av skrytepaven, å overse den bossete. Det som følger er ikke en fast rekke stadier hvert samfunn klatrer. Det er et <b>repertoar</b>: et sett trekk et samfunn kan gjøre i <b>hvilken som helst rekkefølge</b>, <b>delvis</b>, og kan <b>angre</b>."],
    "<b>The theory.</b> Beneath every move runs one question: can the people who handed power over still take it back — really, survivably? Call this <b style=\"color:#5BE0A8\">the power to take back</b>. Freedom and domination aren’t opposites on a scale; they’re conditions of this one capacity, with a threshold between them and a middle state in between:": [
      "<b>La teoria.</b> Sota cada moviment hi ha una pregunta: la gent que va cedir el poder, encara el pot tornar a prendre — de debò, de manera viable? Anomena-ho <b style=\"color:#5BE0A8\">el poder de recuperar</b>. La llibertat i la dominació no són oposats en una escala; són condicions d'aquesta única capacitat, amb un llindar entre elles i un estat intermedi al mig:",
      "<b>La teoría.</b> Bajo cada movimiento hay una pregunta: la gente que cedió el poder, ¿aún puede volver a tomarlo — de verdad, de forma viable? Llámalo <b style=\"color:#5BE0A8\">el poder de recuperar</b>. La libertad y la dominación no son opuestos en una escala; son condiciones de esta única capacidad, con un umbral entre ellas y un estado intermedio en medio:",
      "<b>La théorie.</b> Sous chaque mouvement court une question : ceux qui ont cédé le pouvoir peuvent-ils encore le reprendre — vraiment, de façon survivable ? Appelez cela <b style=\"color:#5BE0A8\">le pouvoir de reprendre</b>. Liberté et domination ne sont pas des opposés sur une échelle ; ce sont des conditions de cette seule capacité, avec un seuil entre elles et un état intermédiaire au milieu :",
      "<b>De theorie.</b> Onder elke zet loopt één vraag: kunnen de mensen die de macht overdroegen haar nog terugnemen — echt, overleefbaar? Noem dit <b style=\"color:#5BE0A8\">de macht om terug te nemen</b>. Vrijheid en overheersing zijn geen tegenpolen op een schaal; het zijn condities van deze ene capaciteit, met een drempel ertussen en een tussentoestand daartussenin:",
      "<b>Teorien.</b> Under hvert trekk løper ett spørsmål: kan de som overlot makten, fortsatt ta den tilbake — virkelig, overlevbart? Kall dette <b style=\"color:#5BE0A8\">makten til å ta tilbake</b>. Frihet og dominans er ikke motsetninger på en skala; de er tilstander av denne ene evnen, med en terskel mellom dem og en mellomtilstand imellom:"],
    "<b>Freedom</b> — the power to take back is alive: it would work if used, whether or not anyone is using it right now. So you can be free with no oppressor in sight and nothing to fight. You don’t have to exercise the power to be free — but using it now and then is what keeps it in working order.": [
      "<b>Llibertat</b> — el poder de recuperar és viu: funcionaria si s'usés, tant si algú l'usa ara mateix com si no. Així pots ser lliure sense cap opressor a la vista i res a combatre. No cal exercir el poder per ser lliure — però usar-lo de tant en tant és el que el manté en funcionament.",
      "<b>Libertad</b> — el poder de recuperar está vivo: funcionaría si se usara, lo esté usando alguien ahora mismo o no. Así puedes ser libre sin ningún opresor a la vista y nada que combatir. No hace falta ejercer el poder para ser libre — pero usarlo de vez en cuando es lo que lo mantiene en funcionamiento.",
      "<b>Liberté</b> — le pouvoir de reprendre est vivant : il fonctionnerait si on l'employait, que quelqu'un l'emploie en ce moment ou non. Vous pouvez donc être libre sans aucun oppresseur en vue et rien à combattre. Vous n'avez pas à exercer le pouvoir pour être libre — mais l'employer de temps en temps, c'est ce qui l'entretient.",
      "<b>Vrijheid</b> — de macht om terug te nemen leeft: ze zou werken als ze gebruikt werd, of iemand haar nu op dit moment gebruikt of niet. Dus je kunt vrij zijn zonder onderdrukker in zicht en niets om te bestrijden. Je hoeft de macht niet uit te oefenen om vrij te zijn — maar haar af en toe gebruiken houdt haar in werking.",
      "<b>Frihet</b> — makten til å ta tilbake er levende: den ville virke om den ble brukt, enten noen bruker den akkurat nå eller ikke. Så du kan være fri uten en undertrykker i sikte og ingenting å kjempe mot. Du trenger ikke utøve makten for å være fri — men å bruke den nå og da er det som holder den i orden."],
    "<b>Legitimate inequality</b> — power has been handed over, but it can still be recalled. Real inequality that is not domination: a leader people follow but could ignore or remove.": [
      "<b>Desigualtat legítima</b> — el poder s'ha cedit, però encara es pot revocar. Desigualtat real que no és dominació: un líder que la gent segueix però podria ignorar o destituir.",
      "<b>Desigualdad legítima</b> — el poder se ha cedido, pero aún se puede revocar. Desigualdad real que no es dominación: un líder al que la gente sigue pero podría ignorar o destituir.",
      "<b>Inégalité légitime</b> — le pouvoir a été cédé, mais il peut encore être repris. Une inégalité réelle qui n'est pas domination : un chef que les gens suivent mais pourraient ignorer ou révoquer.",
      "<b>Legitieme ongelijkheid</b> — macht is overgedragen, maar kan nog worden teruggeroepen. Echte ongelijkheid die geen overheersing is: een leider die mensen volgen maar zouden kunnen negeren of afzetten.",
      "<b>Legitim ulikhet</b> — makten er overlatt, men kan fortsatt kalles tilbake. Virkelig ulikhet som ikke er dominans: en leder folk følger, men kunne ignorere eller avsette."],
    "<b>Unfreedom, in two kinds.</b> A power never used eventually stops working — so a society can drift out of freedom with no oppressor ever appearing, just by letting the take-back power rust until it would fail if tried. <b>Domination</b> is when someone shuts the door on you; <b>decay</b> is when the door, never opened, rusts shut on its own. Both are unfreedom; only the first has a villain. And the line between free and unfree is a blurry zone, not a sharp edge.": [
      "<b>Manca de llibertat, de dues menes.</b> Un poder que mai no s'usa acaba deixant de funcionar — així una societat pot sortir de la llibertat sense que aparegui cap opressor, només deixant que el poder de recuperar es rovelli fins que fallaria si s'intentés. La <b>dominació</b> és quan algú et tanca la porta; la <b>decadència</b> és quan la porta, mai oberta, es rovella sola. Totes dues són manca de llibertat; només la primera té un dolent. I la línia entre lliure i no lliure és una zona difusa, no una vora nítida.",
      "<b>Falta de libertad, de dos clases.</b> Un poder que nunca se usa acaba dejando de funcionar — así una sociedad puede salir de la libertad sin que aparezca ningún opresor, solo dejando que el poder de recuperar se oxide hasta que fallaría si se intentara. La <b>dominación</b> es cuando alguien te cierra la puerta; la <b>decadencia</b> es cuando la puerta, nunca abierta, se oxida sola. Ambas son falta de libertad; solo la primera tiene un villano. Y la línea entre libre y no libre es una zona difusa, no un borde nítido.",
      "<b>Non-liberté, de deux sortes.</b> Un pouvoir jamais employé finit par ne plus fonctionner — une société peut donc sortir de la liberté sans qu'aucun oppresseur n'apparaisse, simplement en laissant le pouvoir de reprendre rouiller jusqu'à ce qu'il échoue si on l'essayait. La <b>domination</b>, c'est quand quelqu'un vous ferme la porte ; le <b>déclin</b>, c'est quand la porte, jamais ouverte, rouille d'elle-même. Les deux sont non-liberté ; seule la première a un méchant. Et la ligne entre libre et non libre est une zone floue, non un bord net.",
      "<b>Onvrijheid, in twee soorten.</b> Een macht die nooit gebruikt wordt, stopt uiteindelijk met werken — dus een samenleving kan uit vrijheid wegdrijven zonder dat er ooit een onderdrukker verschijnt, enkel door de macht om terug te nemen te laten roesten tot ze zou falen als je het probeerde. <b>Overheersing</b> is wanneer iemand de deur voor je sluit; <b>verval</b> is wanneer de deur, nooit geopend, vanzelf vastroest. Beide zijn onvrijheid; alleen de eerste heeft een schurk. En de grens tussen vrij en onvrij is een vage zone, geen scherpe rand.",
      "<b>Ufrihet, i to slag.</b> En makt som aldri brukes, slutter til slutt å virke — så et samfunn kan drive ut av friheten uten at noen undertrykker noensinne dukker opp, bare ved å la makten til å ta tilbake ruste til den ville svikte om man prøvde. <b>Dominans</b> er når noen lukker døren for deg; <b>forfall</b> er når døren, aldri åpnet, ruster igjen av seg selv. Begge er ufrihet; bare den første har en skurk. Og grensen mellom fri og ufri er en uklar sone, ikke en skarp kant."],
    "Five things determine whether you can take power back — <b style=\"color:#E8654B\">the price of saying no</b> (what happens if you refuse?), <b style=\"color:#3F6FC9\">the ability to leave</b> (could you walk away and survive?), <b style=\"color:#C9855A\">access to the means of living</b> (food, land, tools — or are they all owned?), <b style=\"color:#E7B24C\">access to knowledge</b> (can you learn what you’d need to live on your own and to judge the claims made over you?), and <b style=\"color:#9B8CFF\">whether influence circulates</b> (does sway pass from person to person, or has it settled permanently on someone?). These don’t simply add up — they switch each other on and off. Threats barely matter while the door is open; the same threats become total once the door shuts.": [
      "Cinc coses determinen si pots recuperar el poder — <b style=\"color:#E8654B\">el preu de dir que no</b> (què passa si et negues?), <b style=\"color:#3F6FC9\">la capacitat de marxar</b> (podries anar-te'n i sobreviure?), <b style=\"color:#C9855A\">l'accés als mitjans de vida</b> (menjar, terra, eines — o tot és propietat d'algú?), <b style=\"color:#E7B24C\">l'accés al coneixement</b> (pots aprendre el que necessitaries per viure pel teu compte i per jutjar les pretensions que es fan sobre tu?), i <b style=\"color:#9B8CFF\">si la influència circula</b> (l'ascendent passa de persona a persona, o s'ha assentat permanentment en algú?). Aquestes coses no se sumen sense més — s'activen i es desactiven mútuament. Les amenaces gairebé no compten mentre la porta és oberta; les mateixes amenaces esdevenen totals un cop la porta es tanca.",
      "Cinco cosas determinan si puedes recuperar el poder — <b style=\"color:#E8654B\">el precio de decir que no</b> (¿qué pasa si te niegas?), <b style=\"color:#3F6FC9\">la capacidad de irse</b> (¿podrías marcharte y sobrevivir?), <b style=\"color:#C9855A\">el acceso a los medios de vida</b> (comida, tierra, herramientas — ¿o todo tiene dueño?), <b style=\"color:#E7B24C\">el acceso al conocimiento</b> (¿puedes aprender lo que necesitarías para vivir por tu cuenta y para juzgar las pretensiones que se hacen sobre ti?), y <b style=\"color:#9B8CFF\">si la influencia circula</b> (¿el ascendiente pasa de persona a persona, o se ha asentado permanentemente en alguien?). Estas cosas no se suman sin más — se activan y desactivan mutuamente. Las amenazas apenas cuentan mientras la puerta está abierta; las mismas amenazas se vuelven totales una vez que la puerta se cierra.",
      "Cinq choses déterminent si vous pouvez reprendre le pouvoir — <b style=\"color:#E8654B\">le prix de dire non</b> (que se passe-t-il si vous refusez ?), <b style=\"color:#3F6FC9\">la capacité de partir</b> (pourriez-vous partir et survivre ?), <b style=\"color:#C9855A\">l'accès aux moyens de subsistance</b> (nourriture, terre, outils — ou tout appartient-il à quelqu'un ?), <b style=\"color:#E7B24C\">l'accès au savoir</b> (pouvez-vous apprendre ce qu'il vous faudrait pour vivre par vous-même et pour juger les prétentions exercées sur vous ?), et <b style=\"color:#9B8CFF\">si l'influence circule</b> (l'ascendant passe-t-il de personne à personne, ou s'est-il fixé à demeure sur quelqu'un ?). Ces choses ne s'additionnent pas simplement — elles s'activent et se désactivent mutuellement. Les menaces comptent à peine tant que la porte est ouverte ; les mêmes menaces deviennent totales une fois la porte fermée.",
      "Vijf dingen bepalen of je macht kunt terugnemen — <b style=\"color:#E8654B\">de prijs van nee zeggen</b> (wat gebeurt er als je weigert?), <b style=\"color:#3F6FC9\">de mogelijkheid om te vertrekken</b> (zou je kunnen weglopen en overleven?), <b style=\"color:#C9855A\">toegang tot de bestaansmiddelen</b> (voedsel, land, gereedschap — of is alles eigendom?), <b style=\"color:#E7B24C\">toegang tot kennis</b> (kun je leren wat je nodig zou hebben om op jezelf te leven en om de aanspraken over jou te beoordelen?), en <b style=\"color:#9B8CFF\">of invloed circuleert</b> (gaat de zeggenschap van persoon tot persoon, of is ze blijvend op iemand neergeslagen?). Deze dingen tellen niet zomaar op — ze zetten elkaar aan en uit. Dreigingen doen er nauwelijks toe zolang de deur open is; dezelfde dreigingen worden totaal zodra de deur sluit.",
      "Fem ting avgjør om du kan ta makten tilbake — <b style=\"color:#E8654B\">prisen for å si nei</b> (hva skjer om du nekter?), <b style=\"color:#3F6FC9\">evnen til å dra</b> (kunne du gå din vei og overleve?), <b style=\"color:#C9855A\">tilgang til livsgrunnlaget</b> (mat, jord, redskaper — eller eies alt?), <b style=\"color:#E7B24C\">tilgang til kunnskap</b> (kan du lære det du trenger for å leve på egen hånd og for å bedømme kravene som stilles over deg?), og <b style=\"color:#9B8CFF\">om innflytelse sirkulerer</b> (går makten fra person til person, eller har den lagt seg permanent på noen?). Disse tingene legges ikke bare sammen — de slår hverandre på og av. Trusler betyr knapt noe mens døren er åpen; de samme truslene blir totale når døren lukkes."],
    "Two claims make this a real theory — meaning it can be proven wrong. First: control of knowledge and control of resources are separate things that lock together only when the knowledge is <i>about</i> the resources — the priest’s right to declare the harvest — and stay separate otherwise. Second: <b>the ability to leave is the keystone</b>. Power only becomes permanent and inheritable after leaving has been closed off, and freedom returns by reopening the way out first — never the other way around. If anyone finds a lasting society that was easy to walk out of and yet kept a frozen hereditary monopoly, this theory is wrong.": [
      "Dues afirmacions fan d'això una teoria de debò — és a dir, que es pot refutar. Primera: el control del coneixement i el control dels recursos són coses separades que es lliguen només quan el coneixement és <i>sobre</i> els recursos — el dret del sacerdot a declarar la collita — i altrament queden separades. Segona: <b>la capacitat de marxar és la clau de volta</b>. El poder només esdevé permanent i hereditari un cop tancada la sortida, i la llibertat torna reobrint primer la sortida — mai a l'inrevés. Si algú troba una societat duradora que fos fàcil d'abandonar i que tanmateix mantingués un monopoli hereditari congelat, aquesta teoria és falsa.",
      "Dos afirmaciones hacen de esto una teoría de verdad — es decir, que puede refutarse. Primera: el control del conocimiento y el control de los recursos son cosas separadas que se traban solo cuando el conocimiento es <i>sobre</i> los recursos — el derecho del sacerdote a declarar la cosecha — y por lo demás quedan separadas. Segunda: <b>la capacidad de irse es la piedra angular</b>. El poder solo se vuelve permanente y hereditario una vez cerrada la salida, y la libertad regresa reabriendo primero la salida — nunca al revés. Si alguien encuentra una sociedad duradera que fuera fácil de abandonar y que aun así mantuviera un monopolio hereditario congelado, esta teoría es falsa.",
      "Deux affirmations en font une vraie théorie — c'est-à-dire qu'on peut la réfuter. Première : le contrôle du savoir et le contrôle des ressources sont des choses distinctes qui ne se verrouillent que lorsque le savoir porte <i>sur</i> les ressources — le droit du prêtre de déclarer la récolte — et restent distinctes sinon. Deuxième : <b>la capacité de partir est la clé de voûte</b>. Le pouvoir ne devient permanent et héréditaire qu'une fois l'issue fermée, et la liberté revient en rouvrant d'abord l'issue — jamais l'inverse. Si quelqu'un trouve une société durable dont il était facile de sortir et qui maintenait pourtant un monopole héréditaire figé, cette théorie est fausse.",
      "Twee beweringen maken dit tot een echte theorie — wat betekent dat ze weerlegd kan worden. Ten eerste: de beheersing van kennis en de beheersing van hulpbronnen zijn aparte dingen die alleen samengrendelen wanneer de kennis <i>over</i> de hulpbronnen gaat — het recht van de priester om de oogst af te kondigen — en anders apart blijven. Ten tweede: <b>de mogelijkheid om te vertrekken is de sluitsteen</b>. Macht wordt pas permanent en erfelijk nadat vertrekken is afgesloten, en vrijheid keert terug door eerst de uitweg te heropenen — nooit andersom. Als iemand een duurzame samenleving vindt die makkelijk te verlaten was en toch een bevroren erfelijk monopolie behield, dan is deze theorie onjuist.",
      "To påstander gjør dette til en virkelig teori — det vil si at den kan motbevises. For det første: kontroll over kunnskap og kontroll over ressurser er atskilte ting som bare låses sammen når kunnskapen er <i>om</i> ressursene — prestens rett til å erklære avlingen — og ellers forblir atskilt. For det andre: <b>evnen til å dra er bærebjelken</b>. Makt blir først permanent og arvelig etter at det å dra er stengt, og friheten vender tilbake ved å gjenåpne utveien først — aldri omvendt. Om noen finner et varig samfunn som var lett å gå ut av og likevel beholdt et fastfrosset arvelig monopol, er denne teorien feil."],
    "The throughline of the timeline: what force eventually seizes is never the power itself — that was <b>lent</b> willingly. What gets seized is the <b>ability to take it back</b>. And there is no inevitable ending: some societies saw the danger and refused these moves, keeping the take-back power alive by using it — mocking the proud, dispersing the hoard, walking away.": [
      "El fil conductor de la línia del temps: el que la força acaba prenent mai no és el poder en si — aquest es va <b>prestar</b> de grat. El que es pren és la <b>capacitat de recuperar-lo</b>. I no hi ha cap final inevitable: algunes societats van veure el perill i van rebutjar aquests moviments, mantenint viu el poder de recuperar usant-lo — burlant-se de l'orgullós, dispersant l'acaparament, marxant.",
      "El hilo conductor de la línea del tiempo: lo que la fuerza acaba arrebatando nunca es el poder en sí — ese se <b>prestó</b> de buen grado. Lo que se arrebata es la <b>capacidad de recuperarlo</b>. Y no hay un final inevitable: algunas sociedades vieron el peligro y rechazaron estos movimientos, manteniendo vivo el poder de recuperar usándolo — burlándose del orgulloso, dispersando el acaparamiento, marchándose.",
      "Le fil conducteur de la frise : ce que la force finit par saisir n'est jamais le pouvoir lui-même — celui-ci fut <b>prêté</b> de plein gré. Ce qui est saisi, c'est la <b>capacité de le reprendre</b>. Et il n'y a pas de fin inévitable : certaines sociétés ont vu le danger et ont refusé ces mouvements, gardant vivant le pouvoir de reprendre en l'employant — en se moquant de l'orgueilleux, en dispersant l'accaparement, en partant.",
      "De rode draad van de tijdlijn: wat geweld uiteindelijk grijpt is nooit de macht zelf — die werd vrijwillig <b>geleend</b>. Wat gegrepen wordt, is het <b>vermogen om haar terug te nemen</b>. En er is geen onvermijdelijk einde: sommige samenlevingen zagen het gevaar en weigerden deze zetten, en hielden de macht om terug te nemen levend door haar te gebruiken — de trotse bespotten, de hamstering verspreiden, weglopen.",
      "Den røde tråden i tidslinjen: det makten til slutt griper, er aldri makten selv — den ble <b>lånt</b> villig. Det som gripes, er <b>evnen til å ta den tilbake</b>. Og det finnes ingen uunngåelig slutt: noen samfunn så faren og avviste disse trekkene, og holdt makten til å ta tilbake levende ved å bruke den — ved å gjøre narr av den stolte, spre hamstringen, gå sin vei."],
    "<b>Scale is not destiny.</b> In the timeline the crowd grows with world population, but its shape comes only from the moves a society makes. Some of the largest early settlements ran flat, without rulers. Numbers alone never required a pyramid.": [
      "<b>L'escala no és el destí.</b> En la línia del temps la multitud creix amb la població mundial, però la seva forma prové només dels moviments que fa una societat. Alguns dels assentaments primerencs més grans funcionaven plans, sense governants. Els nombres tots sols mai no van requerir una piràmide.",
      "<b>La escala no es el destino.</b> En la línea del tiempo la multitud crece con la población mundial, pero su forma proviene solo de los movimientos que hace una sociedad. Algunos de los asentamientos tempranos más grandes funcionaban planos, sin gobernantes. Los números por sí solos nunca requirieron una pirámide.",
      "<b>L'échelle n'est pas le destin.</b> Dans la frise, la foule croît avec la population mondiale, mais sa forme ne vient que des mouvements qu'une société fait. Certains des plus grands établissements anciens fonctionnaient à plat, sans dirigeants. Les nombres seuls n'ont jamais exigé une pyramide.",
      "<b>Schaal is geen lot.</b> In de tijdlijn groeit de menigte mee met de wereldbevolking, maar haar vorm komt enkel voort uit de zetten die een samenleving doet. Sommige van de grootste vroege nederzettingen functioneerden vlak, zonder heersers. Aantallen alleen vereisten nooit een piramide.",
      "<b>Skala er ikke skjebne.</b> I tidslinjen vokser folkemengden med verdensbefolkningen, men formen kommer bare fra trekkene et samfunn gjør. Noen av de største tidlige bosetningene fungerte flatt, uten herskere. Tall alene krevde aldri en pyramide."],
    "A visual introduction": ["Una introducció visual", "Una introducción visual", "Une introduction visuelle", "Een visuele inleiding", "En visuell innføring"],
    "The full theory, formulas & sources": ["La teoria completa, fórmules i fonts", "La teoría completa, fórmulas y fuentes", "La théorie complète, formules et sources", "De volledige theorie, formules en bronnen", "Hele teorien, formler og kilder"],
    "Power is lent": ["El poder es presta", "El poder se presta", "Le pouvoir est prêté", "Macht wordt geleend", "Makt lånes"],
    "The determinants gate each other": ["Els determinants es controlen mútuament", "Los determinantes se controlan mutuamente", "Les déterminants se conditionnent mutuellement", "De determinanten poorten elkaar", "Determinantene styrer hverandre"],
    "Unfreedom with no villain": ["Manca de llibertat sense cap dolent", "Falta de libertad sin villano", "Une non-liberté sans méchant", "Onvrijheid zonder schurk", "Ufrihet uten skurk"],
    "No single road": ["No hi ha un sol camí", "No hay un solo camino", "Pas de chemin unique", "Geen enkele weg", "Ingen enkelt vei"],
    "In a small band, power lives in relationships and stays flat — kept flat on purpose. Sometimes the band hands power upward: they choose a hunt leader, a healer, a voice in council.<br>These individuals can use charisma to be elevated to their position, convincing the group to hand over power to them.<br>Everything depends on the question that comes <i>after</i>: <b style=\"color:#5BE0A8\">can the group take it back — really, survivably?</b>": [
      "En una banda petita, el poder viu en les relacions i es manté pla — mantingut pla expressament. De vegades la banda cedeix poder cap amunt: trien un cap de cacera, un guaridor, una veu al consell.<br>Aquests individus poden usar el carisma per ser elevats a la seva posició, convencent el grup que els cedeixi el poder.<br>Tot depèn de la pregunta que ve <i>després</i>: <b style=\"color:#5BE0A8\">pot el grup tornar-lo a prendre — de debò, de manera viable?</b>",
      "En una banda pequeña, el poder vive en las relaciones y se mantiene plano — mantenido plano a propósito. A veces la banda cede poder hacia arriba: eligen un líder de caza, un sanador, una voz en el consejo.<br>Estos individuos pueden usar el carisma para ser elevados a su posición, convenciendo al grupo de cederles el poder.<br>Todo depende de la pregunta que viene <i>después</i>: <b style=\"color:#5BE0A8\">¿puede el grupo volver a tomarlo — de verdad, de forma viable?</b>",
      "Dans une petite bande, le pouvoir vit dans les relations et reste plat — maintenu plat à dessein. Parfois la bande cède du pouvoir vers le haut : elle choisit un chef de chasse, un guérisseur, une voix au conseil.<br>Ces individus peuvent user de charisme pour être élevés à leur position, convainquant le groupe de leur céder le pouvoir.<br>Tout dépend de la question qui vient <i>après</i> : <b style=\"color:#5BE0A8\">le groupe peut-il le reprendre — vraiment, de façon survivable ?</b>",
      "In een kleine groep leeft macht in relaties en blijft vlak — bewust vlak gehouden. Soms draagt de groep macht naar boven over: ze kiezen een jachtleider, een genezer, een stem in de raad.<br>Deze individuen kunnen charisma gebruiken om naar hun positie te worden verheven, en overtuigen de groep hun de macht te geven.<br>Alles hangt af van de vraag die <i>daarna</i> komt: <b style=\"color:#5BE0A8\">kan de groep haar terugnemen — echt, overleefbaar?</b>",
      "I en liten gruppe lever makt i relasjoner og holder seg flat — holdt flat med vilje. Noen ganger overlater gruppen makt oppover: de velger en jaktleder, en helbreder, en stemme i rådet.<br>Disse individene kan bruke karisma for å bli løftet til sin posisjon, og overbevise gruppen om å gi makten til dem.<br>Alt avhenger av spørsmålet som kommer <i>etterpå</i>: <b style=\"color:#5BE0A8\">kan gruppen ta den tilbake — virkelig, overlevbart?</b>"],
    "Freedom and domination aren’t opposites on a scale — they’re zones of one capacity. Five things set where a society sits. They don’t add up — they switch each other on and off. Move them one at a time and watch the result:": [
      "La llibertat i la dominació no són oposats en una escala — són zones d'una mateixa capacitat. Cinc coses determinen on se situa una societat. No se sumen — s'activen i es desactiven mútuament. Mou-les d'una en una i observa el resultat:",
      "La libertad y la dominación no son opuestos en una escala — son zonas de una misma capacidad. Cinco cosas determinan dónde se sitúa una sociedad. No se suman — se activan y desactivan mutuamente. Muévelas de una en una y observa el resultado:",
      "Liberté et domination ne sont pas des opposés sur une échelle — ce sont des zones d'une même capacité. Cinq choses déterminent où se situe une société. Elles ne s'additionnent pas — elles s'activent et se désactivent mutuellement. Déplacez-les une à une et observez le résultat :",
      "Vrijheid en overheersing zijn geen tegenpolen op een schaal — het zijn zones van één capaciteit. Vijf dingen bepalen waar een samenleving zit. Ze tellen niet op — ze zetten elkaar aan en uit. Verschuif ze één voor één en kijk naar het resultaat:",
      "Frihet og dominans er ikke motsetninger på en skala — de er soner av én og samme evne. Fem ting avgjør hvor et samfunn ligger. De legges ikke sammen — de slår hverandre på og av. Flytt dem én om gangen og se resultatet:"],
    "No one hoards, no one commands. But a power never used eventually stops working — a society can drift out of freedom with <b>no oppressor ever appearing</b>.": [
      "Ningú no acapara, ningú no mana. Però un poder que mai no s'usa acaba deixant de funcionar — una societat pot sortir de la llibertat sense que <b>aparegui mai cap opressor</b>.",
      "Nadie acapara, nadie manda. Pero un poder que nunca se usa acaba dejando de funcionar — una sociedad puede salir de la libertad sin que <b>aparezca nunca ningún opresor</b>.",
      "Personne n'accapare, personne ne commande. Mais un pouvoir jamais employé finit par ne plus fonctionner — une société peut sortir de la liberté sans qu'<b>aucun oppresseur n'apparaisse jamais</b>.",
      "Niemand hamstert, niemand beveelt. Maar een macht die nooit gebruikt wordt, stopt uiteindelijk met werken — een samenleving kan uit vrijheid wegdrijven zonder dat er <b>ooit een onderdrukker verschijnt</b>.",
      "Ingen hamstrer, ingen befaler. Men en makt som aldri brukes, slutter til slutt å virke — et samfunn kan drive ut av friheten uten at <b>noen undertrykker noensinne dukker opp</b>."],
    "Following this introduction, the “Timeline of history” shows one path that affected many people on the planet, but this is not the only way that groups of people have lived over time. The path is known as “our history” but it is <b>illustrative, not inevitable</b>. It can also be changed.<br>Societies opened the door to power in different ways, partly, or refused every move: mocking the proud, dispersing the hoard, walking away. Domination is not destiny.": [
      "Després d'aquesta introducció, la «Línia del temps de la història» mostra un camí que va afectar molta gent del planeta, però no és l'única manera com els grups de persones han viscut al llarg del temps. El camí es coneix com «la nostra història», però és <b>il·lustratiu, no inevitable</b>. També es pot canviar.<br>Les societats van obrir la porta al poder de maneres diferents, en part, o van rebutjar cada moviment: burlant-se de l'orgullós, dispersant l'acaparament, marxant. La dominació no és el destí.",
      "Tras esta introducción, la «Línea del tiempo de la historia» muestra un camino que afectó a mucha gente del planeta, pero no es la única manera en que los grupos de personas han vivido a lo largo del tiempo. El camino se conoce como «nuestra historia», pero es <b>ilustrativo, no inevitable</b>. También se puede cambiar.<br>Las sociedades abrieron la puerta al poder de maneras distintas, en parte, o rechazaron cada movimiento: burlándose del orgulloso, dispersando el acaparamiento, marchándose. La dominación no es el destino.",
      "Après cette introduction, la « Frise chronologique de l'histoire » montre un chemin qui a touché beaucoup de gens sur la planète, mais ce n'est pas la seule façon dont des groupes humains ont vécu au fil du temps. Ce chemin est connu comme « notre histoire », mais il est <b>illustratif, non inévitable</b>. Il peut aussi être changé.<br>Les sociétés ont ouvert la porte au pouvoir de différentes façons, partiellement, ou ont refusé chaque mouvement : en se moquant de l'orgueilleux, en dispersant l'accaparement, en partant. La domination n'est pas le destin.",
      "Na deze inleiding toont de «Tijdlijn van de geschiedenis» één pad dat veel mensen op de planeet raakte, maar dit is niet de enige manier waarop groepen mensen door de tijd heen hebben geleefd. Het pad staat bekend als «onze geschiedenis», maar het is <b>illustratief, niet onvermijdelijk</b>. Het kan ook veranderd worden.<br>Samenlevingen openden de deur naar macht op verschillende manieren, deels, of weigerden elke zet: de trotse bespotten, de hamstering verspreiden, weglopen. Overheersing is geen lot.",
      "Etter denne innføringen viser «Historiens tidslinje» én vei som påvirket mange mennesker på planeten, men dette er ikke den eneste måten grupper av mennesker har levd på over tid. Veien er kjent som «vår historie», men den er <b>illustrerende, ikke uunngåelig</b>. Den kan også endres.<br>Samfunn åpnet døren til makt på ulike måter, delvis, eller avviste hvert trekk: ved å gjøre narr av den stolte, spre hamstringen, gå sin vei. Dominans er ikke skjebne."],
    "Lend power upward": ["Cedeix poder cap amunt", "Cede poder hacia arriba", "Céder le pouvoir vers le haut", "Macht naar boven lenen", "Lån makt oppover"],
    "Taken back. Using the power now and then is what keeps it in working order.": ["Recuperat. Usar el poder de tant en tant és el que el manté en funcionament.", "Recuperado. Usar el poder de vez en cuando es lo que lo mantiene en funcionamiento.", "Repris. Employer le pouvoir de temps en temps, c'est ce qui l'entretient.", "Teruggenomen. De macht af en toe gebruiken houdt haar in werking.", "Tatt tilbake. Å bruke makten nå og da er det som holder den i orden."],
    "Let years pass": ["Deixa passar els anys", "Deja pasar los años", "Laisser passer les années", "Laat de jaren verstrijken", "La årene gå"],
    "Practice taking back": ["Practica recuperar-lo", "Practica recuperarlo", "S'exercer à reprendre", "Oefen het terugnemen", "Øv på å ta tilbake"],
    "Influence rotates": ["La influència rota", "La influencia rota", "L'influence tourne", "Invloed roteert", "Innflytelse roterer"],
    "Start exploring ▸": ["Comença a explorar ▸", "Empieza a explorar ▸", "Commencer à explorer ▸", "Begin met verkennen ▸", "Begynn å utforske ▸"],
    "The fine print: full theory, formulas & sources": ["La lletra petita: teoria completa, fórmules i fonts", "La letra pequeña: teoría completa, fórmulas y fuentes", "Les détails : théorie complète, formules et sources", "De kleine lettertjes: volledige theorie, formules en bronnen", "Det med liten skrift: hele teorien, formler og kilder"],
    "Close": ["Tanca", "Cerrar", "Fermer", "Sluiten", "Lukk"],
    "<b>Whether influence rotates</b> — does sway pass from person to person, or has it settled permanently on someone and their line?": [
      "<b>Si la influència rota</b> — l'ascendent passa de persona a persona, o s'ha assentat permanentment en algú i el seu llinatge?",
      "<b>Si la influencia rota</b> — ¿el ascendiente pasa de persona a persona, o se ha asentado permanentemente en alguien y su linaje?",
      "<b>Si l'influence tourne</b> — l'ascendant passe-t-il de personne à personne, ou s'est-il fixé à demeure sur quelqu'un et sa lignée ?",
      "<b>Of invloed roteert</b> — gaat de zeggenschap van persoon tot persoon, of is ze blijvend neergeslagen op iemand en zijn geslacht?",
      "<b>Om innflytelse roterer</b> — går makten fra person til person, eller har den lagt seg permanent på noen og deres slekt?"],
    "<b>The temple — dominant (Uruk).</b> The temple economy holds land, stores and the first accounts: the sacred and administrative core of the early state. <i>Contested:</i> Graeber & Wengrow read early Uruk as council-run for centuries, kingship arriving later from the margins.": [
      "<b>El temple — dominant (Uruk).</b> L'economia del temple controla terra, magatzems i els primers comptes: el nucli sagrat i administratiu del primer estat. <i>Discutit:</i> Graeber i Wengrow llegeixen l'Uruk primerenc com a governat per consell durant segles, amb la reialesa arribant més tard des dels marges.",
      "<b>El templo — dominante (Uruk).</b> La economía del templo controla tierra, almacenes y las primeras cuentas: el núcleo sagrado y administrativo del primer estado. <i>Discutido:</i> Graeber y Wengrow leen el Uruk temprano como gobernado por consejo durante siglos, con la realeza llegando más tarde desde los márgenes.",
      "<b>Le temple — dominant (Uruk).</b> L'économie du temple détient terres, réserves et les premiers comptes : le cœur sacré et administratif du premier État. <i>Contesté :</i> Graeber et Wengrow lisent l'Uruk ancien comme dirigé par un conseil pendant des siècles, la royauté arrivant plus tard depuis les marges.",
      "<b>De tempel — dominant (Uruk).</b> De tempeleconomie houdt land, voorraden en de eerste rekeningen: de heilige en administratieve kern van de vroege staat. <i>Betwist:</i> Graeber en Wengrow lezen het vroege Uruk als eeuwenlang door een raad bestuurd, met koningschap dat later vanaf de marges arriveert.",
      "<b>Tempelet — dominerende (Uruk).</b> Tempeløkonomien holder land, lagre og de første regnskapene: den hellige og administrative kjernen i den tidlige staten. <i>Omstridt:</i> Graeber og Wengrow leser tidlig Uruk som rådstyrt i århundrer, med kongedømme som kommer senere fra randsonene."],
    "<b>The palace — secondary here.</b> Secular kingship grows up beside the temple and only later fuses with it.": [
      "<b>El palau — secundari aquí.</b> La reialesa secular creix al costat del temple i només més tard s'hi fusiona.",
      "<b>El palacio — secundario aquí.</b> La realeza secular crece junto al templo y solo más tarde se fusiona con él.",
      "<b>Le palais — secondaire ici.</b> La royauté séculière grandit à côté du temple et ne fusionne avec lui que plus tard.",
      "<b>Het paleis — hier secundair.</b> Het wereldlijke koningschap groeit naast de tempel op en versmelt er pas later mee.",
      "<b>Palasset — sekundært her.</b> Det verdslige kongedømmet vokser opp ved siden av tempelet og smelter først senere sammen med det."],
    "<b>The temple — co-opted.</b> In a conquest state the sacred is brought in afterwards to sanctify a power that already exists by force.": [
      "<b>El temple — cooptat.</b> En un estat de conquesta el sagrat s'incorpora després per santificar un poder que ja existeix per la força.",
      "<b>El templo — cooptado.</b> En un estado de conquista lo sagrado se incorpora después para santificar un poder que ya existe por la fuerza.",
      "<b>Le temple — coopté.</b> Dans un État de conquête, le sacré est introduit après coup pour sanctifier un pouvoir qui existe déjà par la force.",
      "<b>De tempel — ingelijfd.</b> In een veroveringsstaat wordt het heilige er achteraf bij gehaald om een macht te heiligen die al door geweld bestaat.",
      "<b>Tempelet — innlemmet.</b> I en erobringsstat hentes det hellige inn i etterkant for å hellige en makt som allerede finnes ved makt."],
    "<b>The palace — dominant (conquest).</b> Built on the war-band; the throne commands by force, with property and the inherited office.": [
      "<b>El palau — dominant (conquesta).</b> Construït sobre la banda guerrera; el tron comanda per la força, amb la propietat i el càrrec hereditari.",
      "<b>El palacio — dominante (conquista).</b> Construido sobre la banda guerrera; el trono manda por la fuerza, con la propiedad y el cargo hereditario.",
      "<b>Le palais — dominant (conquête).</b> Bâti sur la bande guerrière ; le trône commande par la force, avec la propriété et la charge héréditaire.",
      "<b>Het paleis — dominant (verovering).</b> Gebouwd op de krijgsbende; de troon gebiedt met geweld, met eigendom en het erfelijke ambt.",
      "<b>Palasset — dominerende (erobring).</b> Bygd på krigerflokken; tronen befaler med makt, med eiendom og det arvelige embetet."],
    "<b>The temple — modest.</b> The sacred is present but not yet the seat of a great institution.": [
      "<b>El temple — modest.</b> El sagrat hi és present però encara no és la seu d'una gran institució.",
      "<b>El templo — modesto.</b> Lo sagrado está presente pero aún no es la sede de una gran institución.",
      "<b>Le temple — modeste.</b> Le sacré est présent mais n'est pas encore le siège d'une grande institution.",
      "<b>De tempel — bescheiden.</b> Het heilige is aanwezig maar nog niet de zetel van een grote instelling.",
      "<b>Tempelet — beskjedent.</b> Det hellige er til stede, men ennå ikke setet for en stor institusjon."],
    "<b>The palace — the big-man’s house writ large.</b> Wealth, feasts and clients, with force to back the new property.": [
      "<b>El palau — la casa del big-man a gran escala.</b> Riquesa, festins i clients, amb la força per donar suport a la nova propietat.",
      "<b>El palacio — la casa del big-man a gran escala.</b> Riqueza, festines y clientes, con la fuerza para respaldar la nueva propiedad.",
      "<b>Le palais — la maison du big-man en grand.</b> Richesse, festins et clients, avec la force pour soutenir la nouvelle propriété.",
      "<b>Het paleis — het huis van de big-man op grote schaal.</b> Rijkdom, feesten en cliënten, met geweld om het nieuwe eigendom te schragen.",
      "<b>Palasset — stormannens hus i stort format.</b> Rikdom, gjestebud og klienter, med makt til å støtte den nye eiendommen."],
    "<b>The temple — kept in check.</b> A shaman without a monopoly; the sacred stays open to all.": [
      "<b>El temple — controlat.</b> Un xaman sense monopoli; el sagrat continua obert a tothom.",
      "<b>El templo — bajo control.</b> Un chamán sin monopolio; lo sagrado sigue abierto a todos.",
      "<b>Le temple — tenu en bride.</b> Un chaman sans monopole ; le sacré reste ouvert à tous.",
      "<b>De tempel — in toom gehouden.</b> Een sjamaan zonder monopolie; het heilige blijft voor iedereen open.",
      "<b>Tempelet — holdt i sjakk.</b> En sjaman uten monopol; det hellige forblir åpent for alle."],
    "<b>The palace — refused.</b> Leadership is lent and recalled; no permanent seat of force takes hold (a society against the state).": [
      "<b>El palau — rebutjat.</b> El lideratge es presta i es revoca; cap seu permanent de la força no s'arrela (una societat contra l'estat).",
      "<b>El palacio — rechazado.</b> El liderazgo se presta y se revoca; ninguna sede permanente de la fuerza se afianza (una sociedad contra el estado).",
      "<b>Le palais — refusé.</b> Le commandement est prêté et révoqué ; aucun siège permanent de la force ne s'installe (une société contre l'État).",
      "<b>Het paleis — geweigerd.</b> Leiderschap wordt geleend en teruggeroepen; geen permanente zetel van geweld krijgt vat (een samenleving tegen de staat).",
      "<b>Palasset — avvist.</b> Lederskap lånes og kalles tilbake; ingen permanent maktsete fester seg (et samfunn mot staten)."],
    "Stored grain feeds priests, scribes and soldiers who never farm.": ["El gra emmagatzemat alimenta sacerdots, escribes i soldats que mai no conreen.", "El grano almacenado alimenta a sacerdotes, escribas y soldados que nunca cultivan.", "Le grain stocké nourrit prêtres, scribes et soldats qui ne cultivent jamais.", "Opgeslagen graan voedt priesters, schrijvers en soldaten die nooit boeren.", "Lagret korn fôrer prester, skrivere og soldater som aldri dyrker."],
    "The temple keeps the accounts and the god-king fuses throne and altar — refusal becomes heresy.": ["El temple porta els comptes i el déu-rei fusiona el tron i l'altar — la negativa esdevé heretgia.", "El templo lleva las cuentas y el rey-dios fusiona el trono y el altar — la negativa se vuelve herejía.", "Le temple tient les comptes et le roi-dieu fusionne le trône et l'autel — le refus devient hérésie.", "De tempel houdt de rekeningen en de god-koning versmelt troon en altaar — weigering wordt ketterij.", "Tempelet fører regnskapet og gudekongen smelter sammen trone og alter — avvisning blir kjetteri."],
    "The take-back power, once lent, is now seized: this is the power of the state.": ["El poder de recuperar, un cop prestat, ara és pres: aquest és el poder de l'estat.", "El poder de recuperar, una vez prestado, ahora es arrebatado: este es el poder del estado.", "Le pouvoir de reprendre, une fois prêté, est désormais saisi : c'est le pouvoir de l'État.", "De macht om terug te nemen, eenmaal geleend, wordt nu gegrepen: dit is de macht van de staat.", "Makten til å ta tilbake, en gang lånt, blir nå grepet: dette er statens makt."],
    "Codified law, coinage and a standing army turn the order into a <b>structure</b>, not just a person.": ["La llei codificada, la moneda i un exèrcit permanent converteixen l'ordre en una <b>estructura</b>, no només una persona.", "La ley codificada, la moneda y un ejército permanente convierten el orden en una <b>estructura</b>, no solo una persona.", "Le droit codifié, la monnaie et une armée permanente transforment l'ordre en une <b>structure</b>, non plus seulement une personne.", "Gecodificeerd recht, muntgeld en een staand leger maken van de orde een <b>structuur</b>, niet meer één persoon.", "Kodifisert lov, mynt og en stående hær gjør ordenen til en <b>struktur</b>, ikke bare en person."],
    "Mass slavery is built into the economy — the enslaved produce much and own nothing.": ["L'esclavitud massiva s'integra a l'economia — els esclaus produeixen molt i no posseeixen res.", "La esclavitud masiva se integra en la economía — los esclavizados producen mucho y no poseen nada.", "L'esclavage de masse est intégré à l'économie — les esclaves produisent beaucoup et ne possèdent rien.", "Massaslavernij is in de economie ingebouwd — de tot slaaf gemaakten produceren veel en bezitten niets.", "Masseslaveri er bygd inn i økonomien — de slavebundne produserer mye og eier ingenting."],
    "Power now outlives any single ruler; the machinery persists.": ["El poder ara sobreviu a qualsevol governant; la maquinària perdura.", "El poder ahora sobrevive a cualquier gobernante; la maquinaria perdura.", "Le pouvoir survit désormais à tout dirigeant ; la machinerie persiste.", "Macht overleeft nu elke heerser; de machinerie blijft bestaan.", "Makten overlever nå enhver hersker; maskineriet består."],
    "Born a serf, die a serf. Land is bound to bloodline.": ["Neixes serf, mors serf. La terra està lligada al llinatge.", "Naces siervo, mueres siervo. La tierra está ligada al linaje.", "Né serf, mort serf. La terre est liée à la lignée.", "Als horige geboren, als horige gestorven. Land is aan bloedlijn gebonden.", "Født som livegen, dø som livegen. Jorda er bundet til slektslinjen."],
    "The lord is owner, judge and warrior at once, and the way out stays closed.": ["El senyor és alhora propietari, jutge i guerrer, i la sortida continua tancada.", "El señor es a la vez propietario, juez y guerrero, y la salida sigue cerrada.", "Le seigneur est à la fois propriétaire, juge et guerrier, et l'issue reste fermée.", "De heer is tegelijk eigenaar, rechter en krijger, en de uitweg blijft gesloten.", "Herren er eier, dommer og kriger på én gang, og utveien forblir stengt."],
    "The order is held to be ordained — not chosen.": ["Es considera que l'ordre és ordenat per designi — no triat.", "Se considera que el orden es ordenado por designio — no elegido.", "L'ordre est tenu pour ordonné par décret — non choisi.", "De orde wordt geacht voorbestemd te zijn — niet gekozen.", "Ordenen anses som forordnet — ikke valgt."],
    "Power goes global. Chartered companies fuse capital with state force and rule millions.": ["El poder es fa global. Les companyies privilegiades fusionen el capital amb la força de l'estat i governen milions.", "El poder se hace global. Las compañías privilegiadas fusionan el capital con la fuerza del estado y gobiernan a millones.", "Le pouvoir devient mondial. Les compagnies à charte fusionnent le capital avec la force de l'État et gouvernent des millions.", "Macht wordt mondiaal. Gepatenteerde compagnieën versmelten kapitaal met staatsgeweld en heersen over miljoenen.", "Makten blir global. Privilegerte selskaper smelter sammen kapital med statsmakt og styrer millioner."],
    "A racialised, heritable enslaved class is built at the base — bondage made uncrossable.": ["Es construeix a la base una classe esclava racialitzada i hereditària — la servitud feta infranquejable.", "Se construye en la base una clase esclava racializada y hereditaria — la servidumbre hecha infranqueable.", "Une classe d'esclaves racialisée et héréditaire est bâtie à la base — la servitude rendue infranchissable.", "Aan de basis wordt een geracialiseerde, erfelijke slavenklasse gebouwd — knechtschap onoverbrugbaar gemaakt.", "En rasialisert, arvelig slaveklasse bygges ved basen — trelldom gjort uoverstigelig."],
    "The bundle of ownership and command migrates from a person to a company.": ["El conjunt de propietat i comandament migra d'una persona a una companyia.", "El conjunto de propiedad y mando migra de una persona a una compañía.", "Le faisceau de propriété et de commandement migre d'une personne à une compagnie.", "De bundel van eigendom en commando verhuist van een persoon naar een compagnie.", "Knippet av eierskap og kommando flytter fra en person til et selskap."],
    "Mills concentrate wealth as never before.": ["Les fàbriques concentren la riquesa com mai abans.", "Las fábricas concentran la riqueza como nunca antes.", "Les usines concentrent la richesse comme jamais auparavant.", "Fabrieken concentreren rijkdom als nooit tevoren.", "Fabrikker konsentrerer rikdom som aldri før."],
    "But the worker, legally free and massed in factories, can <b>organise</b>.": ["Però el treballador, legalment lliure i aplegat a les fàbriques, es pot <b>organitzar</b>.", "Pero el trabajador, legalmente libre y reunido en las fábricas, puede <b>organizarse</b>.", "Mais l'ouvrier, légalement libre et massé dans les usines, peut s'<b>organiser</b>.", "Maar de arbeider, wettelijk vrij en samengepakt in fabrieken, kan zich <b>organiseren</b>.", "Men arbeideren, juridisk fri og samlet i fabrikker, kan <b>organisere seg</b>."],
    "Unions, the vote and the welfare state bend the curve back — the one great compression.": ["Els sindicats, el vot i l'estat del benestar tornen a doblegar la corba — la gran compressió.", "Los sindicatos, el voto y el estado de bienestar vuelven a doblar la curva — la gran compresión.", "Les syndicats, le vote et l'État-providence rabattent la courbe — la grande compression.", "Vakbonden, het stemrecht en de verzorgingsstaat buigen de curve terug — de grote compressie.", "Fagforeninger, stemmeretten og velferdsstaten bøyer kurven tilbake — den store sammentrykkingen."],
    "Formal power is one-person-one-vote, yet wealth re-concentrates at the top.": ["El poder formal és un vot per persona, però la riquesa es torna a concentrar a dalt.", "El poder formal es un voto por persona, pero la riqueza se vuelve a concentrar arriba.", "Le pouvoir formel est un vote par personne, mais la richesse se reconcentre au sommet.", "Formele macht is één persoon, één stem, maar rijkdom concentreert zich opnieuw aan de top.", "Formell makt er én person, én stemme, men rikdommen samler seg igjen på toppen."],
    "Ownership re-fuses with management, and the determinants now run worldwide.": ["La propietat es torna a fusionar amb la gestió, i els determinants ara operen arreu del món.", "La propiedad se vuelve a fusionar con la gestión, y los determinantes ahora operan por todo el mundo.", "La propriété refusionne avec la gestion, et les déterminants opèrent désormais dans le monde entier.", "Eigendom versmelt opnieuw met management, en de determinanten werken nu wereldwijd.", "Eierskap smelter på nytt sammen med ledelse, og determinantene virker nå verden over."],
    "The order is costly to hold up, and — as ever — never quite beyond undoing; any undoing begins at the door.": ["L'ordre és costós de mantenir dret i — com sempre — mai del tot impossible de desfer; qualsevol desfeta comença a la porta.", "El orden es costoso de mantener en pie y — como siempre — nunca del todo imposible de deshacer; cualquier deshacer empieza en la puerta.", "L'ordre est coûteux à maintenir debout et — comme toujours — jamais tout à fait impossible à défaire ; tout défaire commence à la porte.", "De orde is kostbaar om overeind te houden en — zoals altijd — nooit helemaal onomkeerbaar; elk ongedaan maken begint bij de deur.", "Ordenen er kostbar å holde oppe og — som alltid — aldri helt umulig å oppheve; enhver oppheving begynner ved døren."],
    "For most of human history, power lived in relationships and stayed flat — kept flat on purpose.": ["Durant la major part de la història humana, el poder vivia en les relacions i es mantenia pla — mantingut pla expressament.", "Durante la mayor parte de la historia humana, el poder vivía en las relaciones y se mantenía plano — mantenido plano a propósito.", "Pendant la majeure partie de l'histoire humaine, le pouvoir vivait dans les relations et restait plat — maintenu plat à dessein.", "Het grootste deel van de menselijke geschiedenis leefde macht in relaties en bleef vlak — bewust vlak gehouden.", "I store deler av menneskets historie levde makt i relasjoner og holdt seg flat — holdt flat med vilje."],
    "The boastful were teased, the bossy ignored, and anyone could walk away.": ["El fanfarró era objecte de burla, el manaire ignorat, i qualsevol podia marxar.", "El fanfarrón era objeto de burla, el mandón ignorado, y cualquiera podía marcharse.", "Le vantard était moqué, l'autoritaire ignoré, et chacun pouvait partir.", "De opschepper werd geplaagd, de bazige genegeerd, en iedereen kon weglopen.", "Skrytepaven ble ertet, den bossete oversett, og hvem som helst kunne dra."],
    "The take-back power is alive and used daily: no one keeps what they hoard or commands what they cannot persuade.": ["El poder de recuperar és viu i s'usa cada dia: ningú no es queda el que acapara ni mana allò que no pot persuadir.", "El poder de recuperar está vivo y se usa a diario: nadie se queda con lo que acapara ni manda lo que no puede persuadir.", "Le pouvoir de reprendre est vivant et employé chaque jour : personne ne garde ce qu'il accapare ni ne commande ce qu'il ne peut persuader.", "De macht om terug te nemen leeft en wordt dagelijks gebruikt: niemand houdt wat hij hamstert of beveelt wat hij niet kan overtuigen.", "Makten til å ta tilbake er levende og brukes daglig: ingen beholder det de hamstrer eller befaler det de ikke kan overtale."],
    "Every escape route is shut at once: no exit, no refusal, no independent living.": ["Totes les vies de fugida es tanquen alhora: ni sortida, ni negativa, ni vida independent.", "Todas las vías de escape se cierran a la vez: ni salida, ni negativa, ni vida independiente.", "Toutes les voies de sortie se ferment d'un coup : ni départ, ni refus, ni vie indépendante.", "Elke ontsnappingsroute sluit tegelijk: geen uitweg, geen weigering, geen zelfstandig bestaan.", "Alle fluktveier stenges på én gang: ingen utgang, ingen nektelse, intet selvstendig livsgrunnlag."],
    "The take-back power is no longer just blocked — it is now believed to be illegitimate.": ["El poder de recuperar ja no només està bloquejat — ara es creu que és il·legítim.", "El poder de recuperar ya no solo está bloqueado — ahora se cree que es ilegítimo.", "Le pouvoir de reprendre n'est plus seulement bloqué — on le croit désormais illégitime.", "De macht om terug te nemen is niet langer alleen geblokkeerd — ze wordt nu als onwettig beschouwd.", "Makten til å ta tilbake er ikke lenger bare blokkert — den anses nå som illegitim."],
    "The bundle of ownership and force migrates from a person to an immortal company — so no one is responsible.": ["El conjunt de propietat i força migra d'una persona a una companyia immortal — així ningú no és responsable.", "El conjunto de propiedad y fuerza migra de una persona a una compañía inmortal — así nadie es responsable.", "Le faisceau de propriété et de force migre d'une personne à une compagnie immortelle — ainsi personne n'est responsable.", "De bundel van eigendom en geweld verhuist van een persoon naar een onsterfelijke compagnie — zo is niemand verantwoordelijk.", "Knippet av eierskap og makt flytter fra en person til et udødelig selskap — slik er ingen ansvarlig."],
    "Across the ocean, bondage is made racial and heritable: a door that can never be reopened.": ["A l'altra banda de l'oceà, la servitud es fa racial i hereditària: una porta que mai no es pot tornar a obrir.", "Al otro lado del océano, la servidumbre se hace racial y hereditaria: una puerta que nunca puede reabrirse.", "De l'autre côté de l'océan, la servitude est rendue raciale et héréditaire : une porte qui ne peut jamais être rouverte.", "Aan de overkant van de oceaan wordt knechtschap raciaal en erfelijk gemaakt: een deur die nooit meer geopend kan worden.", "På andre siden av havet gjøres trelldom rasial og arvelig: en dør som aldri kan åpnes igjen."],
    "For the first time the trend reverses: the worker is legally free to leave, refuse and organise.": ["Per primera vegada la tendència s'inverteix: el treballador és legalment lliure de marxar, negar-se i organitzar-se.", "Por primera vez la tendencia se invierte: el trabajador es legalmente libre de marcharse, negarse y organizarse.", "Pour la première fois, la tendance s'inverse : l'ouvrier est légalement libre de partir, de refuser et de s'organiser.", "Voor het eerst keert de trend: de arbeider is wettelijk vrij om te vertrekken, te weigeren en zich te organiseren.", "For første gang snur trenden: arbeideren er juridisk fri til å dra, nekte og organisere seg."],
    "Unions, the vote and the welfare state claw the take-back power partway back.": ["Els sindicats, el vot i l'estat del benestar recuperen en part el poder de recuperar.", "Los sindicatos, el voto y el estado de bienestar recuperan en parte el poder de recuperar.", "Les syndicats, le vote et l'État-providence regagnent en partie le pouvoir de reprendre.", "Vakbonden, het stemrecht en de verzorgingsstaat heroveren de macht om terug te nemen deels.", "Fagforeninger, stemmeretten og velferdsstaten vinner makten til å ta tilbake delvis tilbake."],
    "One-person-one-vote, yet ownership re-merges with management and influence runs worldwide.": ["Un vot per persona, però la propietat es torna a fusionar amb la gestió i la influència opera arreu del món.", "Un voto por persona, pero la propiedad se vuelve a fusionar con la gestión y la influencia opera por todo el mundo.", "Un vote par personne, mais la propriété refusionne avec la gestion et l'influence opère dans le monde entier.", "Eén persoon, één stem, maar eigendom versmelt opnieuw met management en invloed werkt wereldwijd.", "Én person, én stemme, men eierskap smelter på nytt sammen med ledelse og innflytelse virker verden over."],
    "Costly to hold up, never quite beyond undoing — and any undoing still begins at the door.": ["Costós de mantenir dret, mai del tot impossible de desfer — i qualsevol desfeta encara comença a la porta.", "Costoso de mantener en pie, nunca del todo imposible de deshacer — y cualquier deshacer aún empieza en la puerta.", "Coûteux à maintenir debout, jamais tout à fait impossible à défaire — et tout défaire commence encore à la porte.", "Kostbaar om overeind te houden, nooit helemaal onomkeerbaar — en elk ongedaan maken begint nog steeds bij de deur.", "Kostbar å holde oppe, aldri helt umulig å oppheve — og enhver oppheving begynner fortsatt ved døren."]
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
    for (var j = 0; j < KEYS.length; j++) { var k = KEYS[j]; if (!k || !M[k]) continue; if (out.indexOf(k) >= 0) out = out.split(k).join(M[k]); }
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
  var DYN_ROOTS = ["#reading", "#verdict", "#pivot", "#tlBar", "#palette", "#timelineBtn", "#tip", "#overlay"];
  function translateRoot(root) {
    if (!M || !root) return;
    textNodes(root).forEach(function (nd) {
      var v = nd.nodeValue; if (!v || !v.trim()) return;
      var t = trStr(v); if (t !== v) nd.nodeValue = t;
    });
  }
  // whole-block HTML swap for rich elements (tooltip body, beat lines) — preserves <b>/<i>
  function trHTML(el) { if (!MH || !el) return; var h = el.innerHTML; if (MH[h] && h !== MH[h]) el.innerHTML = MH[h]; }
  function translateRich(root) {
    if (!MH || !root) return;
    if (root.id === "tip") trHTML(root);
    var els = root.querySelectorAll ? root.querySelectorAll(".pvline, #pop p, #pop li, #pop h3, #pop h4, #pop .k, #pop .icap, #pop .ict, #pop .ilab, #pop button") : [];
    for (var i = 0; i < els.length; i++) trHTML(els[i]);
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

  function start() { try { buildSelector(); applyStatic(); observe(); translateDynamic(); } catch (e) { /* never break the host page */ } }
  if (document.readyState !== "loading") start();
  else document.addEventListener("DOMContentLoaded", start);
})();
