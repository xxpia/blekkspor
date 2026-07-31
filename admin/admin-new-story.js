/*==============================================================================
    NY HISTORIE
==============================================================================*/


/* ------------------------------- ELEMENTER -------------------------------- */
/* Henter elementene fra admin-new-story.html. */

const storyForm =
    document.getElementById("new-story-form");

const titleInput =
    document.getElementById("story-title");

const categorySelect =
    document.getElementById("story-category");

const dateInput =
    document.getElementById("story-date");

const summaryInput =
    document.getElementById("story-summary");

const automaticSummaryPreview =
    document.getElementById("automatic-summary-preview");

const automaticSummaryText =
    document.getElementById("automatic-summary-text");

const summaryOptions =
    document.querySelectorAll('input[name="summary-mode"]');

const storyEditor =
    document.getElementById("story-editor");

const commentInput =
    document.getElementById("story-comment");

const filenamePreview =
    document.getElementById("filename-preview");

const sortYearPreview =
    document.getElementById("sort-year-preview");

const wordCountPreview =
    document.getElementById("word-count-preview");

const formStatus =
    document.getElementById("form-status");

const boldButton =
    document.querySelector('[data-command="bold"]');

const italicButton =
    document.querySelector('[data-command="italic"]');

const dividerButton =
    document.getElementById("insert-divider");


/* ------------------------------- KATEGORIER ------------------------------- */
/* Informasjon om kategoriene og CSS-klassene deres. */

const categories = {
    novella: {
        label: "novelle"
    },

    poem: {
        label: "dikt"
    },

    shortprose: {
        label: "kortprosa"
    },

    excerpt: {
        label: "utdrag"
    }
};


/* ------------------------------- FILNAVN ---------------------------------- */
/* Lager et skjult filnavn automatisk fra tittelen. */

function createFilename(title) {
    const filename = title
        .trim()
        .toLowerCase()
        .replaceAll("æ", "ae")
        .replaceAll("ø", "o")
        .replaceAll("å", "a")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

    if (!filename) {
        return "";
    }

    return `${filename}.html`;
}


/* ----------------------------- SORTERINGSÅR ------------------------------- */
/* Finner det første firesifrede årstallet i datofeltet. */

function getSortYear(dateText) {
    const yearMatch =
        dateText.match(/\b(?:18|19|20|21)\d{2}\b/);

    if (!yearMatch) {
        return null;
    }

    return Number(yearMatch[0]);
}


/* ------------------------------- REN TEKST -------------------------------- */
/* Henter teksten fra editoren uten HTML-koder. */

function getStoryText() {
    return storyEditor.innerText
        .replace(/\u00a0/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}


/* ------------------------------- ORDTELLING ------------------------------- */
/* Teller ordene i historien. */

function countWords(text) {
    if (!text.trim()) {
        return 0;
    }

    const words = text.match(
        /[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu
    );

    return words ? words.length : 0;
}


/* ------------------------------- SAMMENDRAG ------------------------------- */
/* Finner første setning og bruker den som automatisk sammendrag. */

function createAutomaticSummary(text) {
    const cleanedText = text
        .replace(/\s+/g, " ")
        .trim();

    if (!cleanedText) {
        return "";
    }

    const firstSentence =
        cleanedText.match(/^.*?[.!?](?:\s|$)/);

    if (firstSentence) {
        return firstSentence[0].trim();
    }

    /*
        Dersom teksten ikke har punktum, spørsmålstegn eller
        utropstegn, brukes opptil 180 tegn.
    */

    if (cleanedText.length <= 180) {
        return cleanedText;
    }

    return `${cleanedText.slice(0, 180).trim()}…`;
}


/* -------------------------- SAMMENDRAGSVALG ------------------------------- */
/* Viser tekstfeltet bare når eget sammendrag er valgt. */

function getSummaryMode() {
    const selectedOption =
        document.querySelector(
            'input[name="summary-mode"]:checked'
        );

    return selectedOption
        ? selectedOption.value
        : "automatic";
}


function updateSummaryField() {
    const customSummarySelected =
        getSummaryMode() === "custom";

    summaryInput.hidden =
        !customSummarySelected;

    summaryInput.required =
        customSummarySelected;

    automaticSummaryPreview.hidden =
        customSummarySelected;

    automaticSummaryText.textContent =
        createAutomaticSummary(getStoryText());
}


/* ---------------------------- LAGRE MARKERING ----------------------------- */
/*
    Lagrer markeringen i historieeditoren.

    Dette gjør at markert tekst ikke forsvinner når du trykker
    på fet-, kursiv- eller dividerknappen.
*/

let savedSelection = null;


function saveEditorSelection() {
    const selection =
        window.getSelection();

    if (!selection || selection.rangeCount === 0) {
        return;
    }

    const range =
        selection.getRangeAt(0);

    if (!storyEditor.contains(range.commonAncestorContainer)) {
        return;
    }

    savedSelection =
        range.cloneRange();
}


function restoreEditorSelection() {
    if (!savedSelection) {
        return false;
    }

    const selection =
        window.getSelection();

    selection.removeAllRanges();
    selection.addRange(savedSelection);

    return true;
}

storyEditor.addEventListener(
    "mouseup",
    saveEditorSelection
);

storyEditor.addEventListener(
    "keyup",
    saveEditorSelection
);


/* ------------------------------- FORMATERING ------------------------------ */
/* Legger strong eller em rundt den markerte teksten. */

function formatSelectedText(tagName) {
    storyEditor.focus();

    if (!restoreEditorSelection()) {
        return;
    }

    const selection =
        window.getSelection();

    const range =
        selection.getRangeAt(0);

    if (range.collapsed) {
        return;
    }

    const formattingElement =
        document.createElement(tagName);

    try {
        range.surroundContents(formattingElement);
    } catch {
        /*
            Dersom markeringen går på tvers av flere HTML-elementer,
            flyttes innholdet inn i det nye elementet i stedet.
        */

        const selectedContent =
            range.extractContents();

        formattingElement.appendChild(selectedContent);
        range.insertNode(formattingElement);
    }

    selection.removeAllRanges();

    const newRange =
        document.createRange();

    newRange.selectNodeContents(formattingElement);
    selection.addRange(newRange);

    savedSelection =
        newRange.cloneRange();

    updateStoryInformation();
}


/* Hindrer at markeringen forsvinner når knappene trykkes. */

boldButton.addEventListener("mousedown", event => {
    event.preventDefault();
});


italicButton.addEventListener("mousedown", event => {
    event.preventDefault();
});


boldButton.addEventListener("click", () => {
    formatSelectedText("strong");
});


italicButton.addEventListener("click", () => {
    formatSelectedText("em");
});


/* ------------------------------- SKILLELINJE ------------------------------ */
/*
    Markert tekst, for eksempel #, * eller ¤, erstattes med
    en skillelinje.
*/

dividerButton.addEventListener("mousedown", event => {
    event.preventDefault();
});


dividerButton.addEventListener("click", () => {
    storyEditor.focus();

    if (!restoreEditorSelection()) {
        return;
    }

    const selection =
        window.getSelection();

    const range =
        selection.getRangeAt(0);

    /*
        Fjerner tegnet eller teksten som er markert.
    */

    range.deleteContents();

    const divider =
        document.createElement("hr");

    divider.className =
        "story-divider";

    range.insertNode(divider);

    /*
        Lager et tomt avsnitt etter skillelinjen slik at du kan
        fortsette å skrive eller redigere.
    */

    const paragraph =
        document.createElement("p");

    paragraph.appendChild(
        document.createElement("br")
    );

    divider.after(paragraph);

    const newRange =
        document.createRange();

    newRange.setStart(paragraph, 0);
    newRange.collapse(true);

    selection.removeAllRanges();
    selection.addRange(newRange);

    savedSelection =
        newRange.cloneRange();

    updateStoryInformation();
});


/* ---------------------------- RYDD INNHOLD -------------------------------- */
/*
    Rydder bort unødvendig formatering fra Word, Google Docs
    og andre programmer.

    Følgende beholdes:
    - avsnitt
    - linjeskift
    - fet tekst
    - kursiv tekst
    - skillelinjer
*/

function cleanEditorContent() {
    const allowedElements = new Set([
        "P",
        "DIV",
        "BR",
        "STRONG",
        "B",
        "EM",
        "I",
        "HR"
    ]);

    const elements =
        [...storyEditor.querySelectorAll("*")];

    elements.forEach(element => {
        /*
            Gjør <b> om til <strong>.
        */

        if (element.tagName === "B") {
            const strong =
                document.createElement("strong");

            strong.innerHTML =
                element.innerHTML;

            element.replaceWith(strong);

            return;
        }

        /*
            Gjør <i> om til <em>.
        */

        if (element.tagName === "I") {
            const emphasis =
                document.createElement("em");

            emphasis.innerHTML =
                element.innerHTML;

            element.replaceWith(emphasis);

            return;
        }

        /*
            Beholder bare riktig klasse på skillelinjer.
        */

        if (element.tagName === "HR") {
            [...element.attributes].forEach(attribute => {
                element.removeAttribute(attribute.name);
            });

            element.className =
                "story-divider";

            return;
        }

        /*
            Fjerner unødvendige attributter fra tillatte elementer.
        */

        if (allowedElements.has(element.tagName)) {
            [...element.attributes].forEach(attribute => {
                element.removeAttribute(attribute.name);
            });

            return;
        }

        /*
            Fjerner ukjente HTML-elementer, men beholder teksten
            og innholdet som lå inni dem.
        */

        element.replaceWith(
            ...element.childNodes
        );
    });
}


/* ---------------------------- INNLIMT TEKST ------------------------------- */
/* Rydder innholdet rett etter at en historie er limt inn. */

storyEditor.addEventListener("paste", () => {
    window.setTimeout(() => {
        cleanEditorContent();
        updateStoryInformation();
    }, 0);
});


/* ------------------------- FORMATER HISTORIE-HTML ------------------------- */
/*
    Gjør editorinnholdet klart til historiefilen.

    Avsnittene opprettes automatisk. Du trenger ikke skrive
    <p> eller andre HTML-koder selv.
*/

function getFormattedStoryContent() {
    cleanEditorContent();

    const temporaryContainer =
        document.createElement("div");

    temporaryContainer.innerHTML =
        storyEditor.innerHTML;

    const formattedParts = [];

    [...temporaryContainer.childNodes].forEach(node => {
        /*
            Ren tekst uten et omsluttende HTML-element blir
            automatisk gjort til et avsnitt.
        */

        if (node.nodeType === Node.TEXT_NODE) {
            const text =
                node.textContent.trim();

            if (!text) {
                return;
            }

            const paragraph =
                document.createElement("p");

            paragraph.textContent =
                text;

            formattedParts.push(
                paragraph.outerHTML
            );

            return;
        }

        if (node.nodeType !== Node.ELEMENT_NODE) {
            return;
        }

        /*
            Skillelinjer beholdes som egne elementer.
        */

        if (node.tagName === "HR") {
            formattedParts.push(
                '<hr class="story-divider">'
            );

            return;
        }

        /*
            Eksisterende avsnitt beholdes.
        */

        if (node.tagName === "P") {
            if (node.textContent.trim()) {
                formattedParts.push(
                    node.outerHTML
                );
            }

            return;
        }

        /*
            Mange programmer limer inn avsnitt som <div>.
            Disse gjøres om til <p>.
        */

        if (node.tagName === "DIV") {
            const paragraph =
                document.createElement("p");

            paragraph.innerHTML =
                node.innerHTML;

            if (paragraph.textContent.trim()) {
                formattedParts.push(
                    paragraph.outerHTML
                );
            }

            return;
        }

        /*
            Fet eller kursiv tekst uten et avsnitt rundt seg
            plasseres automatisk i et avsnitt.
        */

        const paragraph =
            document.createElement("p");

        paragraph.appendChild(
            node.cloneNode(true)
        );

        formattedParts.push(
            paragraph.outerHTML
        );
    });

    return formattedParts.join("\n\n");
}


/* ------------------------ OPPDATER INFORMASJON ---------------------------- */
/* Oppdaterer filnavn, årstall og ordtelling mens du skriver. */

function updateStoryInformation() {
    const filename =
        createFilename(titleInput.value);

    const sortYear =
        getSortYear(dateInput.value);

    const wordCount =
        countWords(getStoryText());

    filenamePreview.textContent =
        filename || "—";

    sortYearPreview.textContent =
        sortYear || "—";

    wordCountPreview.textContent =
        wordCount.toLocaleString("nb-NO");

    if (getSummaryMode() === "automatic") {
        automaticSummaryText.textContent =
            createAutomaticSummary(getStoryText());
    }
}


/* ------------------------------- HENDELSER -------------------------------- */

titleInput.addEventListener(
    "input",
    updateStoryInformation
);

dateInput.addEventListener(
    "input",
    updateStoryInformation
);

storyEditor.addEventListener(
    "input",
    updateStoryInformation
);

summaryOptions.forEach(option => {
    option.addEventListener(
        "change",
        updateSummaryField
    );
});


/* ------------------------------- VALIDERING ------------------------------- */
/* Kontrollerer at nødvendig informasjon er fylt ut. */

function validateStory() {
    const title =
        titleInput.value.trim();

    const category =
        categorySelect.value;

    const dateText =
        dateInput.value.trim();

    const storyText =
        getStoryText();

    if (!title) {
        return "Skriv inn en tittel.";
    }

    if (!category) {
        return "Velg en kategori.";
    }

    if (!dateText) {
        return "Skriv inn datoen som skal vises.";
    }

    if (!getSortYear(dateText)) {
        return "Datofeltet må inneholde et firesifret årstall.";
    }

    if (!storyText) {
        return "Historien kan ikke være tom.";
    }

    if (
        getSummaryMode() === "custom" &&
        !summaryInput.value.trim()
    ) {
        return "Skriv inn et sammendrag.";
    }

return "";

}


/* ----------------------------- SAMLE DATA --------------------------------- */
/* Samler informasjonen som senere skal lagres i HTML og JSON. */

function collectStoryData() {
    const title =
        titleInput.value.trim();

    const categoryKey =
        categorySelect.value;

    const dateDisplay =
        dateInput.value.trim();

    const storyText =
        getStoryText();

    const summary =
        getSummaryMode() === "custom"
            ? summaryInput.value.trim()
            : createAutomaticSummary(storyText);

    const category =
        categories[categoryKey];

    return {
        id: createFilename(title)
            .replace(/\.html$/, ""),

        title,

        category:
            categoryKey,

        categoryLabel:
            category.label,

        dateDisplay,

        sortYear:
            getSortYear(dateDisplay),

        summary,

        content:
            getFormattedStoryContent(),

        comment:
            commentInput.value.trim(),

        wordCount:
            countWords(storyText),

        published:
            true
    };
}


/* --------------------------- FILHJELPEFUNKSJONER --------------------------- */

/*
    Skriver tekst eller JSON til en fil.
*/

async function writeFile(directoryHandle, filename, content) {

    const fileHandle =
        await directoryHandle.getFileHandle(
            filename,
            {
                create: true
            }
        );

    const writable =
        await fileHandle.createWritable();

    await writable.write(content);

    await writable.close();
}


/*
    Leser en JSON-fil.

    Dersom filen er tom, returneres en tom liste.
*/

async function readJsonFile(directoryHandle, filename) {

    const fileHandle =
        await directoryHandle.getFileHandle(
            filename,
            {
                create: true
            }
        );

    const file =
        await fileHandle.getFile();

    const fileContent =
        await file.text();

    if (!fileContent.trim()) {
        return [];
    }

    return JSON.parse(fileContent);
}


/* ----------------------------- ÅPNE PROSJEKT ------------------------------- */

async function openProject() {

    const root =
        await window.showDirectoryPicker({
            mode: "readwrite"
        });

    return {
        root,

        stories:
            await root.getDirectoryHandle("STORIES"),

        data:
            await root.getDirectoryHandle("DATA")
    };
}


/* ---------------------------- LAGRE HISTORIE ------------------------------- */

async function saveStory(storyData) {

    /*
        Brukeren skal velge selve BLEKKSPOR2-mappen.
    */

    const project =
        await openProject();

    const jsonFilename =
        createStoryJsonFilename(storyData);

    const storyFileData = {
        id:
            storyData.id,

        title:
            storyData.title,

        summary:
            storyData.summary,

        category:
            storyData.category,

        categoryLabel:
            storyData.categoryLabel,

        date:
            storyData.dateDisplay,

        sortYear:
            storyData.sortYear,

        content:
            storyData.content,

        comment:
            storyData.comment,

        wordCount:
            storyData.wordCount,

        published:
            storyData.published
    };

    /*
        Lager selve JSON-filen i STORIES.
    */

    await writeFile(
        project.stories,
        jsonFilename,
        JSON.stringify(storyFileData, null, 4)
    );

    /*
        Leser den eksisterende historieoversikten.
    */

    const storyIndex =
        await readJsonFile(
            project.data,
            "stories.json"
        );

    if (!Array.isArray(storyIndex)) {
        throw new Error(
            "DATA/stories.json må inneholde en liste."
        );
    }

    /*
        Kontrollerer om historien allerede finnes.
    */

    const existingStoryIndex =
        storyIndex.findIndex(entry => {
            return entry.id === storyData.id;
        });

    const indexEntry = {
        id:
            storyData.id,

        file:
            jsonFilename
    };

    /*
        Dersom historien allerede finnes, oppdateres
        oppføringen. Ellers legges den til.
    */

    if (existingStoryIndex !== -1) {

        storyIndex[existingStoryIndex] =
            indexEntry;

    } else {

        storyIndex.push(indexEntry);

    }

    /*
        Sorterer registeret alfabetisk etter ID.
    */

    storyIndex.sort((a, b) => {
        return a.id.localeCompare(
            b.id,
            "nb"
        );
    });

    /*
        Lagrer den oppdaterte oversikten.
    */

    await writeFile(
        project.data,
        "stories.json",
        JSON.stringify(storyIndex, null, 4)
    );

    return {
        jsonFilename
    };
}


/* ---------------------------- HISTORIEFILNAVN ------------------------------ */

/*
    Lager filnavnet til historien.

    Historier lagres som:

    test2.json
    dassvann.json
*/

function createStoryJsonFilename(storyData) {

    return `${storyData.id}.json`;

}

/* ------------------------------- SKJEMA ----------------------------------- */

storyForm.addEventListener("submit", async event => {

    event.preventDefault();

    formStatus.textContent =
        "";

    const validationMessage =
        validateStory();

    if (validationMessage) {

        formStatus.textContent =
            validationMessage;

        return;
    }

    if (!("showDirectoryPicker" in window)) {

        formStatus.textContent =
            "Lagring krever Google Chrome eller Microsoft Edge.";

        return;
    }

    const storyData =
        collectStoryData();

    formStatus.textContent =
        "Lagrer historien…";

    try {

        const savedStory =
            await saveStory(storyData);

        formStatus.textContent =
            `Historien ble lagret som ${savedStory.jsonFilename}.`;

        console.log(
            "Historien ble lagret:",
            storyData
        );

    } catch (error) {

        if (error.name === "AbortError") {

            formStatus.textContent =
                "Mappevalget ble avbrutt.";

            return;
        }

        if (error.name === "NotFoundError") {

            formStatus.textContent =
                "Fant ikke STORIES- eller DATA-mappen. Velg selve BLEKKSPOR2-mappen.";

            return;
        }

        console.error(
            "Kunne ikke lagre historien:",
            error
        );

        formStatus.textContent =
            `Historien kunne ikke lagres: ${error.message}`;
    }
});

/* ------------------------------- OPPSTART --------------------------------- */

updateSummaryField();
updateStoryInformation();