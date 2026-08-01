"use strict";


/*==============================================================================
    REDIGER HISTORIE
==============================================================================*/


/* ------------------------------- ELEMENTER -------------------------------- */

const storyForm =
    document.getElementById("edit-story-form");

const storySelector =
    document.getElementById("story-selector");

const storyLoadStatus =
    document.getElementById("story-load-status");

const titleInput =
    document.getElementById("story-title");

const categorySelect =
    document.getElementById("story-category");

const dateInput =
    document.getElementById("story-date");

const storyEditor =
    document.getElementById("story-editor");

const summaryInput =
    document.getElementById("story-summary");

const commentInput =
    document.getElementById("story-comment");

const publishedInput =
    document.getElementById("story-published");

const featuredInput =
    document.getElementById("story-featured");

const filenamePreview =
    document.getElementById("filename-preview");

const sortYearPreview =
    document.getElementById("sort-year-preview");

const wordCountPreview =
    document.getElementById("word-count-preview");

const formStatus =
    document.getElementById("form-status");

const saveButton =
    document.getElementById("save-story");

const editorButtons =
    document.querySelectorAll(".editor-button");

const dividerButton =
    document.getElementById("insert-divider");

const alignLeftButton =
    document.getElementById("align-left");

const alignCenterButton =
    document.getElementById("align-center");


/* ------------------------------- TILSTAND -------------------------------- */

let stories = [];

let currentStory = null;

let originalStoryId = "";

let originalStoryFilename = "";

let savedSelection = null;


/* ------------------------------- KATEGORIER ------------------------------- */

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


/* ------------------------------- FILNAVN -------------------------------- */

function createStoryId(title) {

    return title
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

}


function createStoryJsonFilename(title) {

    const storyId =
        createStoryId(title);

    return storyId
        ? `${storyId}.json`
        : "";

}


/* ----------------------------- SORTERINGSÅR ------------------------------ */

function getSortYear(dateText) {

    const yearMatch =
        dateText.match(
            /\b(?:18|19|20|21)\d{2}\b/
        );

    return yearMatch
        ? Number(yearMatch[0])
        : null;

}


/* ------------------------------- ORDTELLING ------------------------------ */

function getStoryText() {

    return storyEditor.innerText
        .replace(/\u00a0/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

}


function countWords(text) {

    if (!text.trim()) {
        return 0;
    }

    const words =
        text.match(
            /[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu
        );

    return words
        ? words.length
        : 0;

}


/* --------------------------- AKTIVER SKJEMA ------------------------------ */

function setFormEnabled(enabled) {

    titleInput.disabled = !enabled;
    categorySelect.disabled = !enabled;
    dateInput.disabled = !enabled;
    summaryInput.disabled = !enabled;
    commentInput.disabled = !enabled;
    featuredInput.disabled = !enabled;
    publishedInput.disabled = !enabled;

    saveButton.disabled = !enabled;

    storyEditor.contentEditable =
        enabled ? "true" : "false";

    storyEditor.dataset.placeholder =
        enabled
            ? "Lim inn eller skriv historien her."
            : "Velg en historie først.";

    editorButtons.forEach(button => {

        button.disabled =
            !enabled;

    });

}


/* ------------------------------ HENT JSON ------------------------------- */

async function fetchJson(path) {

    const separator =
        path.includes("?")
            ? "&"
            : "?";

    const response =
        await fetch(
            `${path}${separator}v=${Date.now()}`,
            {
                cache: "no-store"
            }
        );

    if (!response.ok) {

        throw new Error(
            `Kunne ikke hente ${path}.`
        );

    }

    return await response.json();

}


/* --------------------------- LAST HISTORIER ----------------------------- */

async function loadStoryList() {

    storyLoadStatus.textContent =
        "Laster historier…";

    try {

        const storyIndex =
            await fetchJson(
                "../data/stories.json"
            );

        stories =
            await Promise.all(

                storyIndex.map(async entry => {

                    const story =
                        await fetchJson(
                            `../stories/${entry.file}`
                        );

                    return {

                        ...story,

                        indexId:
                            entry.id,

                        file:
                            entry.file

                    };

                })

            );

        stories.sort((a, b) =>
            a.title.localeCompare(
                b.title,
                "nb"
            )
        );

        populateStorySelector();

        storyLoadStatus.textContent =
            `${stories.length} tekster klare.`;

    } catch (error) {

        console.error(error);

        storyLoadStatus.textContent =
            error.message;

    }

}

/* ------------------------ FYLL HISTORIEVELGER ------------------------- */

function populateStorySelector() {

    storySelector.replaceChildren();

    const defaultOption =
        document.createElement(
            "option"
        );

    defaultOption.value =
        "";

    defaultOption.textContent =
        "Velg historie";

    storySelector.appendChild(
        defaultOption
    );


    stories.forEach(story => {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            story.indexId;

        option.textContent =
            `${story.title} — ${
                story.categoryLabel ||
                story.category
            }`;

        storySelector.appendChild(
            option
        );

    });

}


/* --------------------------- VIS HISTORIE ----------------------------- */

function displaySelectedStory(story) {

    currentStory =
        story;

    originalStoryId =
        story.indexId ||
        story.id;

    originalStoryFilename =
        story.file;


    /* Tittel */

    titleInput.value =
        story.title || "";


    /* Kategori */

    categorySelect.value =
        story.category || "";


    /* Dato */

    dateInput.value =
        story.date || "";


    /* Historietekst */

    storyEditor.innerHTML =
        story.content || "";


    /* Sammendrag */

    summaryInput.value =
        story.summary || "";


    /* Kommentar */

    commentInput.value =
        story.comment || "";

    featuredInput.checked =
        story.featured === true;


    /* Publisering */

    publishedInput.checked =
        story.published !== false;


    /* Aktiver redigering */

    setFormEnabled(
        true
    );


    /* Rydd editorinnhold */

    cleanEditorContent();


    /* Oppdater forhåndsvisning */

    updateStoryInformation();


    formStatus.textContent =
        "";

}


/* -------------------------- VELG HISTORIE ----------------------------- */

storySelector.addEventListener(
    "change",
    () => {

        const selectedId =
            storySelector.value;


        if (!selectedId) {

            currentStory =
                null;

            setFormEnabled(
                false
            );

            return;

        }


        const selectedStory =
            stories.find(story => {

                return (
                    story.indexId ===
                    selectedId
                );

            });


        if (!selectedStory) {

            formStatus.textContent =
                "Fant ikke historien.";

            return;

        }


        displaySelectedStory(
            selectedStory
        );

    }
);


/* ------------------------- LAGRE MARKERING ---------------------------- */
/*
    Lagrer markeringen i editoren slik at den ikke forsvinner
    når du trykker på en knapp i verktøylinjen.
*/

function saveEditorSelection() {

    const selection =
        window.getSelection();


    if (
        !selection ||
        selection.rangeCount === 0
    ) {

        return;

    }


    const range =
        selection.getRangeAt(0);


    if (
        !storyEditor.contains(
            range.commonAncestorContainer
        )
    ) {

        return;

    }


    savedSelection =
        range.cloneRange();

}


/* ---------------------- GJENOPPRETT MARKERING ------------------------- */

function restoreEditorSelection() {

    if (!savedSelection) {
        return false;
    }


    const selection =
        window.getSelection();

    selection.removeAllRanges();

    selection.addRange(
        savedSelection
    );

    return true;

}


/* ---------------------- MARKERINGSHENDELSER --------------------------- */

storyEditor.addEventListener(
    "mouseup",
    saveEditorSelection
);

storyEditor.addEventListener(
    "keyup",
    saveEditorSelection
);

storyEditor.addEventListener(
    "input",
    saveEditorSelection
);


/* ---------------- BEHOLD MARKERING VED KNAPPEKLIKK -------------------- */

editorButtons.forEach(button => {

    button.addEventListener(
        "mousedown",
        event => {

            event.preventDefault();

        }
    );

});


/* --------------------------- FORMATERING ------------------------------ */

editorButtons.forEach(button => {

if (
    button === dividerButton ||
    button === alignLeftButton ||
    button === alignCenterButton
) {
    return;
}

    button.addEventListener(
        "click",
        () => {

            storyEditor.focus();

            restoreEditorSelection();

            const command =
                button.dataset.command;

            const value =
                button.dataset.value ||
                null;

            document.execCommand(
                command,
                false,
                value
            );

            cleanEditorContent();

            saveEditorSelection();

            updateStoryInformation();

        }
    );

    });

/* ------------------------- FINN VALGTE AVSNITT ---------------------------- */

function getSelectedBlocks() {

    storyEditor.focus();

    if (!restoreEditorSelection()) {
        return [];
    }

    const selection =
        window.getSelection();

    if (
        !selection ||
        selection.rangeCount === 0
    ) {
        return [];
    }

    const range =
        selection.getRangeAt(0);


    /*
        Dersom det bare står en markør i teksten,
        brukes kun avsnittet markøren står i.
    */

    if (range.collapsed) {

        let currentNode =
            range.startContainer;

        if (
            currentNode.nodeType ===
            Node.TEXT_NODE
        ) {

            currentNode =
                currentNode.parentElement;

        }

        const currentBlock =
            currentNode?.closest?.(
                "p, div, h2, h3"
            );

        if (
            currentBlock &&
            storyEditor.contains(
                currentBlock
            )
        ) {

            return [
                currentBlock
            ];

        }

        return [];

    }


    /*
        Ved faktisk markering tas bare elementer med som
        markeringen går inn i – ikke elementer som bare
        berører markeringens start eller slutt.
    */

    const blocks =
        [
            ...storyEditor.querySelectorAll(
                ":scope > p, :scope > div, :scope > h2, :scope > h3"
            )
        ];

    return blocks.filter(block => {

        const blockRange =
            document.createRange();

        blockRange.selectNodeContents(
            block
        );

        const selectionEndsAfterBlockStarts =
            range.compareBoundaryPoints(
                Range.END_TO_START,
                blockRange
            ) > 0;

        const selectionStartsBeforeBlockEnds =
            range.compareBoundaryPoints(
                Range.START_TO_END,
                blockRange
            ) < 0;

        return (
            selectionEndsAfterBlockStarts &&
            selectionStartsBeforeBlockEnds
        );

    });

}


/* ---------------------------- TEKSTPLASSERING ------------------------- */

function alignSelectedBlocks(
    alignment
) {

    const blocks =
        getSelectedBlocks();

    if (blocks.length === 0) {
        return;
    }

    blocks.forEach(block => {

        block.classList.remove(
            "text-left",
            "text-center"
        );

        block.classList.add(
            alignment === "center"
                ? "text-center"
                : "text-left"
        );

    });

    saveEditorSelection();

    updateStoryInformation();

}


alignLeftButton.addEventListener(
    "click",
    () => {

        alignSelectedBlocks(
            "left"
        );

    }
);


alignCenterButton.addEventListener(
    "click",
    () => {

        alignSelectedBlocks(
            "center"
        );

    }
);


/* ---------------------------- SKILLELINJE ----------------------------- */

dividerButton.addEventListener(
    "click",
    () => {

        storyEditor.focus();


        if (!restoreEditorSelection()) {
            return;
        }


        const selection =
            window.getSelection();

        const range =
            selection.getRangeAt(0);


        /*
            Fjerner eventuelt markert tegn eller tekst.
        */

        range.deleteContents();


        const divider =
            document.createElement(
                "hr"
            );

        divider.className =
            "story-divider";


        range.insertNode(
            divider
        );


        /*
            Lager et tomt avsnitt etter divideren.
        */

        const paragraph =
            document.createElement(
                "p"
            );

        paragraph.appendChild(
            document.createElement(
                "br"
            )
        );


        divider.after(
            paragraph
        );


        const newRange =
            document.createRange();

        newRange.setStart(
            paragraph,
            0
        );

        newRange.collapse(
            true
        );


        selection.removeAllRanges();

        selection.addRange(
            newRange
        );


        savedSelection =
            newRange.cloneRange();


        updateStoryInformation();

    }
);

/* ---------------------------- RYDD INNHOLD ----------------------------- */
/*
    Rydder bort unødvendig formatering fra Word, Google Docs
    og andre programmer.

    Følgende beholdes:
    - avsnitt
    - overskrifter
    - linjeskift
    - fet tekst
    - kursiv tekst
    - venstrejustering
    - midtstilling
    - skillelinjer
*/

function cleanEditorContent() {

    const allowedElements =
        new Set([
            "P",
            "DIV",
            "H2",
            "H3",
            "BR",
            "STRONG",
            "B",
            "EM",
            "I",
            "HR"
        ]);


    const elements =
        [
            ...storyEditor.querySelectorAll(
                "*"
            )
        ];


    elements.forEach(element => {

        /*
            Gjør <b> om til <strong>.
        */

        if (
            element.tagName === "B"
        ) {

            const strong =
                document.createElement(
                    "strong"
                );

            strong.innerHTML =
                element.innerHTML;


            element.replaceWith(
                strong
            );

            return;

        }


        /*
            Gjør <i> om til <em>.
        */

        if (
            element.tagName === "I"
        ) {

            const emphasis =
                document.createElement(
                    "em"
                );

            emphasis.innerHTML =
                element.innerHTML;


            element.replaceWith(
                emphasis
            );

            return;

        }


        /*
            Beholder bare riktig klasse på skillelinjer.
        */

        if (
            element.tagName === "HR"
        ) {

            [
                ...element.attributes
            ].forEach(attribute => {

                element.removeAttribute(
                    attribute.name
                );

            });


            element.className =
                "story-divider";

            return;

        }


        /*
            Beholder bare tillatte tekstplasseringsklasser
            på avsnitt og overskrifter.
        */

        if (
            element.matches(
                "p, div, h2, h3"
            )
        ) {

            const isCentered =
                element.classList.contains(
                    "text-center"
                ) ||
                element.style.textAlign ===
                    "center" ||
                element.getAttribute(
                    "align"
                ) === "center";

            const isLeftAligned =
                element.classList.contains(
                    "text-left"
                ) ||
                element.style.textAlign ===
                    "left" ||
                element.getAttribute(
                    "align"
                ) === "left";


            [
                ...element.attributes
            ].forEach(attribute => {

                element.removeAttribute(
                    attribute.name
                );

            });


            if (isCentered) {

                element.classList.add(
                    "text-center"
                );

            } else if (isLeftAligned) {

                element.classList.add(
                    "text-left"
                );

            }

            return;

        }


        /*
            Fjerner attributter fra andre tillatte elementer.
        */

        if (
            allowedElements.has(
                element.tagName
            )
        ) {

            [
                ...element.attributes
            ].forEach(attribute => {

                element.removeAttribute(
                    attribute.name
                );

            });

            return;

        }


        /*
            Fjerner ukjente HTML-elementer,
            men beholder teksten og innholdet inni dem.
        */

        element.replaceWith(
            ...element.childNodes
        );

    });

}


/* ---------------------------- INNLIMT TEKST ---------------------------- */

storyEditor.addEventListener(
    "paste",
    () => {

        window.setTimeout(
            () => {

                cleanEditorContent();

                updateStoryInformation();

            },
            0
        );

    }
);


/* ---------------------- FORMATER HISTORIE-HTML ------------------------ */
/*
    Gjør editorinnholdet klart til historiefilen.
*/

function getFormattedStoryContent() {

    cleanEditorContent();


    const temporaryContainer =
        document.createElement(
            "div"
        );


    temporaryContainer.innerHTML =
        storyEditor.innerHTML;


    const formattedParts = [];


    [
        ...temporaryContainer.childNodes
    ].forEach(node => {

        /*
            Ren tekst uten omsluttende HTML-element
            gjøres om til et avsnitt.
        */

        if (
            node.nodeType ===
            Node.TEXT_NODE
        ) {

            const text =
                node.textContent.trim();


            if (!text) {
                return;
            }


            const paragraph =
                document.createElement(
                    "p"
                );

            paragraph.textContent =
                text;


            formattedParts.push(
                paragraph.outerHTML
            );

            return;

        }


        if (
            node.nodeType !==
            Node.ELEMENT_NODE
        ) {

            return;

        }


        /*
            Skillelinjer beholdes som egne elementer.
        */

        if (
            node.tagName === "HR"
        ) {

            formattedParts.push(
                '<hr class="story-divider">'
            );

            return;

        }


        /*
            Eksisterende avsnitt og overskrifter beholdes.
        */

        if (
            node.tagName === "P" ||
            node.tagName === "H2" ||
            node.tagName === "H3"
        ) {

            if (
                node.textContent.trim()
            ) {

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

        if (
            node.tagName === "DIV"
        ) {

            const paragraph =
                document.createElement(
                    "p"
                );


            paragraph.innerHTML =
                node.innerHTML;


            if (
                node.classList.contains(
                    "text-center"
                )
            ) {

                paragraph.classList.add(
                    "text-center"
                );

            } else if (
                node.classList.contains(
                    "text-left"
                )
            ) {

                paragraph.classList.add(
                    "text-left"
                );

            }


            if (
                paragraph.textContent.trim()
            ) {

                formattedParts.push(
                    paragraph.outerHTML
                );

            }

            return;

        }


        /*
            Fet eller kursiv tekst uten avsnitt rundt seg
            plasseres automatisk i et avsnitt.
        */

        const paragraph =
            document.createElement(
                "p"
            );


        paragraph.appendChild(
            node.cloneNode(
                true
            )
        );


        formattedParts.push(
            paragraph.outerHTML
        );

    });


    return formattedParts.join(
        "\n\n"
    );

}


/* --------------------- OPPDATER INFORMASJON -------------------------- */

function updateStoryInformation() {

    const filename =
        createStoryJsonFilename(
            titleInput.value
        );


    const sortYear =
        getSortYear(
            dateInput.value
        );


    const wordCount =
        countWords(
            getStoryText()
        );


    filenamePreview.textContent =
        filename || "—";


    sortYearPreview.textContent =
        sortYear || "—";


    wordCountPreview.textContent =
        wordCount.toLocaleString(
            "nb-NO"
        );

}


/* ---------------------------- HENDELSER ------------------------------- */

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

/* ------------------------------- VALIDERING ------------------------------- */
/* Kontrollerer at nødvendig informasjon er fylt ut. */

function validateStory() {

    if (!currentStory) {

        return "Velg en historie.";

    }


    const title =
        titleInput.value.trim();

    const category =
        categorySelect.value;

    const dateText =
        dateInput.value.trim();

    const storyText =
        getStoryText();

    const summary =
        summaryInput.value.trim();


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


    if (!summary) {

        return "Skriv inn et sammendrag.";

    }


    return "";

}


/* ----------------------------- SAMLE DATA --------------------------------- */
/* Samler historien slik den skal lagres i JSON-filen. */

function collectStoryData() {

    const title =
        titleInput.value.trim();

    const categoryKey =
        categorySelect.value;

    const category =
        categories[categoryKey];

    const date =
        dateInput.value.trim();

    const storyText =
        getStoryText();


    return {

        id:
            createStoryId(
                title
            ),

        title,

        summary:
            summaryInput.value.trim(),

        category:
            categoryKey,

        categoryLabel:
            category.label,

        date,

        sortYear:
            getSortYear(
                date
            ),

        content:
            getFormattedStoryContent(),

        comment:
            commentInput.value.trim(),

        wordCount:
            countWords(
                storyText
            ),

        featured:
            featuredInput.checked,

        published:
            publishedInput.checked

    };

}


/* --------------------------- FILHJELPEFUNKSJONER --------------------------- */

/*
    Skriver tekst eller JSON til en fil.
*/

async function writeFile(
    directoryHandle,
    filename,
    content
) {

    const fileHandle =
        await directoryHandle.getFileHandle(
            filename,
            {
                create: true
            }
        );


    const writable =
        await fileHandle.createWritable();


    await writable.write(
        content
    );


    await writable.close();

}


/*
    Leser en JSON-fil.
*/

async function readJsonFile(
    directoryHandle,
    filename
) {

    const fileHandle =
        await directoryHandle.getFileHandle(
            filename
        );


    const file =
        await fileHandle.getFile();


    const fileContent =
        await file.text();


    if (!fileContent.trim()) {

        return [];

    }


    return JSON.parse(
        fileContent
    );

}


/* ----------------------------- ÅPNE PROSJEKT ------------------------------- */
/*
    Du skal velge selve Blekkspor-mappen.

    Denne må inneholde:
    - stories
    - data
*/

async function openProject() {

    const root =
        await window.showDirectoryPicker({
            mode: "readwrite"
        });


    return {

        root,

        stories:
            await root.getDirectoryHandle(
                "stories"
            ),

        data:
            await root.getDirectoryHandle(
                "data"
            )

    };

}


/* ---------------------------- LAGRE ENDRINGER ----------------------------- */

async function saveEditedStory(
    storyData
) {

    const project =
        await openProject();


    const newFilename =
        `${storyData.id}.json`;


    /*
        Leser historieoversikten.
    */

    const storyIndex =
        await readJsonFile(
            project.data,
            "stories.json"
        );


    if (!Array.isArray(storyIndex)) {

        throw new Error(
            "data/stories.json må inneholde en liste."
        );

    }


    /*
        Kontrollerer at den nye ID-en ikke allerede brukes
        av en annen historie.
    */

    const conflictingEntry =
        storyIndex.find(entry => {

            return (
                entry.id === storyData.id &&
                entry.id !== originalStoryId
            );

        });


    if (conflictingEntry) {

        throw new Error(
            `En annen historie bruker allerede ID-en "${storyData.id}".`
        );

    }


    /*
        Skriver den oppdaterte historien til JSON.
    */

    await writeFile(
        project.stories,
        newFilename,
        JSON.stringify(
            storyData,
            null,
            4
        )
    );


    /*
        Finner historien i stories.json.
    */

    const existingIndex =
        storyIndex.findIndex(entry => {

            return entry.id === originalStoryId;

        });


    const updatedEntry = {

        id:
            storyData.id,

        file:
            newFilename

    };


    /*
        Oppdaterer eksisterende oppføring,
        eller lager en ny dersom den mangler.
    */

    if (existingIndex === -1) {

        storyIndex.push(
            updatedEntry
        );

    } else {

        storyIndex[existingIndex] =
            updatedEntry;

    }


    /*
        Sorterer registeret alfabetisk etter ID.
    */

    storyIndex.sort((entryA, entryB) => {

        return entryA.id.localeCompare(
            entryB.id,
            "nb"
        );

    });


    /*
        Lagrer oppdatert stories.json.
    */

    await writeFile(
        project.data,
        "stories.json",
        JSON.stringify(
            storyIndex,
            null,
            4
        )
    );


    /*
        Dersom tittelen ble endret, får historien nytt filnavn.
        Da forsøker vi å slette den gamle JSON-filen.
    */

    if (
        originalStoryFilename &&
        originalStoryFilename !== newFilename
    ) {

        try {

            await project.stories.removeEntry(
                originalStoryFilename
            );

        } catch (error) {

            console.warn(
                "Den gamle historiefilen kunne ikke slettes:",
                error
            );

        }

    }


    return {

        filename:
            newFilename

    };

}

/* ------------------------------- SKJEMA ----------------------------------- */

storyForm.addEventListener(
    "submit",
    async event => {

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


        if (
            !(
                "showDirectoryPicker"
                in window
            )
        ) {

            formStatus.textContent =
                "Lagring krever Google Chrome eller Microsoft Edge.";

            return;

        }


        const storyData =
            collectStoryData();


        formStatus.textContent =
            "Lagrer endringene…";


        saveButton.disabled =
            true;


        try {

            const savedStory =
                await saveEditedStory(
                    storyData
                );


            formStatus.textContent =
                `Endringene ble lagret i ${savedStory.filename}.`;


            /*
                Oppdaterer informasjonen om historien etter lagring.
            */

            originalStoryId =
                storyData.id;


            originalStoryFilename =
                savedStory.filename;


            currentStory = {

                ...storyData,

                indexId:
                    storyData.id,

                file:
                    savedStory.filename

            };


            /*
                Oppdaterer historien i listen som allerede er lastet inn.
            */

            const storyPosition =
                stories.findIndex(story => {

                    return (
                        story.indexId ===
                        storySelector.value
                    );

                });


            if (storyPosition !== -1) {

                stories[storyPosition] =
                    currentStory;

            }


            /*
                Oppdaterer valget i menyen dersom tittelen eller ID-en
                ble endret.
            */

            stories.sort((storyA, storyB) => {

                return storyA.title.localeCompare(
                    storyB.title,
                    "nb",
                    {
                        sensitivity: "base"
                    }
                );

            });


            populateStorySelector();


            storySelector.value =
                storyData.id;


            updateStoryInformation();


            saveButton.disabled =
                false;

        } catch (error) {

            if (
                error.name ===
                "AbortError"
            ) {

                formStatus.textContent =
                    "Mappevalget ble avbrutt.";

                saveButton.disabled =
                    false;

                return;

            }


            if (
                error.name ===
                "NotFoundError"
            ) {

                formStatus.textContent =
                    "Fant ikke stories- eller data-mappen. Velg selve Blekkspor-mappen.";

                saveButton.disabled =
                    false;

                return;

            }


            console.error(
                "Kunne ikke lagre historien:",
                error
            );


            formStatus.textContent =
                `Historien kunne ikke lagres: ${error.message}`;


            saveButton.disabled =
                false;

        }

    }
);


/* ------------------------------- OPPSTART --------------------------------- */

setFormEnabled(
    false
);


updateStoryInformation();


loadStoryList();

