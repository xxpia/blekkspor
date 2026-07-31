# Blekkspor
    Nettsiden er håndkodet i HTML, CSS og JavaScript uten eksterne rammeverk.


## Hvor skal jeg lete?

**Forsiden ser feil ut**
→ `home.js`

**Arkivet ser feil ut**
→ `archive.js`

**En historie vises feil**
→ `story-loader.js`

**Forrige/neste fungerer ikke**
→ `story-navigation.js`

**Kategori fungerer ikke**
→ `category-filter.js`

**Sortering fungerer ikke**
→ `story-sort.js`

**Lys/mørk modus eller footer**
→ `main.js`

**Tilfeldige sitater**
→ `quotes.js`

**Søk**
→ `search.js`

**Små hjelpefunksjoner**
→ `utilities.js`






    

## /admin = verktøy for å administrere nettstedet.
    admin-dashboard.html
    admin-edit-story.html
    admin-index.html
    admin-new-story.html
    admin-quotes.html
    admin.settings.html
    admin-config.js
    admin-dashboard.js
    admin-edit-story.js
    admin-index.js
    admin-new-story.js
    admin-quotes.js
    admin-settings.js
        Innstillinger og funksjoner for administrasjon av nettstedet.



## /css = all styling.
    admin.css
        all tysling for admin sidene.
    style.css
        all styling for nettstedet.


## /data =
    categories.json
        Informasjon om alle kategorier.
    manifest.json
        Brukes dersom Blekkspor senere skal fungere som en installérbar webapp (PWA).
    quotes
        x
    site-settings.json
        Generelle innstillinger for nettstedet.
    stories-meta.json
        Metadata om alle publiserte historier.


## /images =
    /icons - ikoner
    /logos - logoer
    /stories - illustrasjoner til historier
    favicon.svg
        Ikonet som vises i nettleserfanen og bokmerker.









## JavaScript (`/js`)

JavaScript er delt opp etter ansvar, slik at hver fil har én hovedoppgave.

---

### `main.js`
Felles funksjoner som brukes på hele nettstedet.

Ansvar:
- Lys/mørk modus.
- Aktiv hovednavigasjon.
- Automatisk årstall i footer.
- Generelle funksjoner som flere filer bruker.

Åpne denne hvis du skal endre noe som gjelder hele nettstedet.

---

### `story-loader.js`
Laster inn én historie fra JSON og fyller inn historiemalen.

Ansvar:
- Leser `id` fra URL.
- Henter riktig JSON-fil.
- Fyller inn tittel, tekst, kategori, dato osv.
- Viser historien på siden.

Åpne denne hvis informasjon inne på en historie vises feil.

---

### `story-navigation.js`
Navigasjon mellom historier.

Ansvar:
- Forrige historie.
- Neste historie.
- Tilbake til arkivet.
- Eventuell annen historienavigasjon.

Åpne denne hvis lenkene mellom historier fungerer feil.

---

### `category-filter.js`
Filtrering av arkivet.

Ansvar:
- Leser valgt kategori.
- Viser bare historier fra den kategorien.

Åpne denne hvis kategorisidene eller filtreringen fungerer feil.

---

### `story-sort.js`
Sortering av historier.

Ansvar:
- Nyeste først.
- Eldste først.
- Alfabetisk.

Åpne denne hvis sorteringen i arkivet skal endres.

---

### `archive.js`
Bygger arkivsiden.

Ansvar:
- Laster alle publiserte historier.
- Filtrerer.
- Sorterer.
- Oppretter forhåndsvisningene.

Åpne denne hvis arkivet ser feil ut.

---

### `home.js`
Bygger forsiden.

Ansvar:
- Laster de nyeste historiene.
- Viser forhåndsvisninger på forsiden.

Åpne denne hvis forsiden viser feil historier eller feil rekkefølge.

---

### `quotes.js`
Tilfeldige sitater på Om-siden.

Ansvar:
- Leser `quotes.json`.
- Velger et tilfeldig sitat.

---

### `search.js`
Søk etter historier.

Ansvar:
- Søkefelt.
- Søkeresultater.
- Filtrering av treff.

---

### `utilities.js`
Små hjelpefunksjoner.

Ansvar:
- Små funksjoner som brukes flere steder.
- Skal ikke inneholde side-spesifikk logikk.

Hvis du er usikker hvor en funksjon hører hjemme, spør:
"Vil flere sider kunne bruke denne?"
Hvis ja, hører den sannsynligvis hjemme her.








## /quotes
    alle sitater samlet.
## /stories
    alle publiserte historier.


## /templates = HTML-maler.
    excerpt-template.html
        utdrag mal.
        <article class="story story-excerpt">

    novella-template.html
        novelle mal.
        <article class="story story-novella">

    poem-template.html
        dikt mal.
        <article class="story story-poem">

    shortprose-template.html
        kortprosa mal.
        <article class="story story-shortprose">


## HOVEDSIDER
    404.html
        Error-siden.
        .error-page

    about.html
        Om-siden.
        .about-page

    archive.html
        Arkiv-siden.
        .archive-page

    categories.html
        Kategori-siden.
        .categories-page

    index.html
        Forsiden.
        .home-page

    privacy.html
        Personvern-siden.
        .privacy-page


## CSS
    :root = globale variabler (farge, størrelser, osv.) som brukes for hele nettstedet.
    * = grunninnstillinger som alle HTML-elementer starter med.
    a = lenker.

    Navigasjon
        .main-nav
        .story-nav
        .story-preview-nav

### CSS Variabler
    --background
        Sidebakgrunn.

    --text
        Hovedtekst.

    --link
        Lenker.

    --link-hover
        Lenker ved hover.

    --border
        Linjer og skilleelementer.

    --text-muted
        Metadata.

    --text-subtle
        Svak tekst.

    --card-background
        Kort og bokser.

    --content-width
        Standard bredde.

    --wide-content-width
        Bredere innhold.

    --page-padding
        Horisontal padding.
