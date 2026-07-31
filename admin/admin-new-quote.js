/*==============================================================================
    HTML-ELEMENTER
==============================================================================*/

const quoteForm =
    document.getElementById("quote-form");

const quoteText =
    document.getElementById("quote-text");

const quoteAuthor =
    document.getElementById("quote-author");

const quoteSource =
    document.getElementById("quote-source");

const previewQuote =
    document.getElementById("preview-quote");

const previewAuthor =
    document.getElementById("preview-author");

const previewSource =
    document.getElementById("preview-source");

const generatedCode =
    document.getElementById("generated-code");

const saveStatus =
    document.getElementById("save-status");


/*==============================================================================
    MAPPE
==============================================================================*/

let projectFolder;


/*==============================================================================
    VELG BLEKKSPOR-MAPPEN
==============================================================================*/

async function selectProjectFolder() {

    projectFolder =
        await window.showDirectoryPicker();

}


/*==============================================================================
    LAG FILNAVN
==============================================================================*/

function createSlug(text) {

    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/æ/g, "ae")
        .replace(/ø/g, "o")
        .replace(/å/g, "a")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

}


function createFileName(id, author) {

    const authorSlug =
        createSlug(author) || "ukjent";

    return `${id}-${authorSlug}.json`;

}


/*==============================================================================
    HENT SITATOVERSIKT
==============================================================================*/

async function getQuoteIndex() {

    const dataFolder =
        await projectFolder.getDirectoryHandle(
            "data",
            { create: true }
        );

    const indexFileHandle =
        await dataFolder.getFileHandle(
            "quotes.json",
            { create: true }
        );

    const indexFile =
        await indexFileHandle.getFile();

    const indexText =
        await indexFile.text();

    if (!indexText.trim()) {
        return [];
    }

    const quoteIndex =
        JSON.parse(indexText);

    if (!Array.isArray(quoteIndex)) {
        throw new Error(
            "data/quotes.json må inneholde en liste."
        );
    }

    return quoteIndex;

}


/*==============================================================================
    LAG NESTE ID
==============================================================================*/

function createNextId(quoteIndex) {

    const highestId =
        quoteIndex.reduce(function (highest, quote) {

            const currentId =
                Number.parseInt(quote.id, 10);

            if (
                Number.isNaN(currentId) ||
                currentId <= highest
            ) {
                return highest;
            }

            return currentId;

        }, 0);

    return String(highestId + 1).padStart(3, "0");

}


/*==============================================================================
    LAG SITATDATA
==============================================================================*/

function createQuoteData() {

    const quote =
        quoteText.value.trim();

    const author =
        quoteAuthor.value.trim();

    const source =
        quoteSource.value.trim();

    const quoteData = {
        quote: quote,
        author: author
    };

    if (source) {
        quoteData.source = source;
    }

    return quoteData;

}


/*==============================================================================
    VIS FORHÅNDSVISNING
==============================================================================*/

function displayPreview(quoteData) {

    previewQuote.textContent =
        quoteData.quote;

    previewAuthor.textContent =
        quoteData.author
            ? `— ${quoteData.author}`
            : "";

    previewSource.textContent =
        quoteData.source || "";

    generatedCode.textContent =
        JSON.stringify(quoteData, null, 4);

}


/*==============================================================================
    LAGRE SITATFIL
==============================================================================*/

async function saveQuoteFile(fileName, quoteData) {

    const quotesFolder =
        await projectFolder.getDirectoryHandle(
            "quotes",
            { create: true }
        );

    const quoteFileHandle =
        await quotesFolder.getFileHandle(
            fileName,
            { create: true }
        );

    const writable =
        await quoteFileHandle.createWritable();

    await writable.write(
        JSON.stringify(quoteData, null, 4)
    );

    await writable.close();

}


/*==============================================================================
    OPPDATER SITATOVERSIKT
==============================================================================*/

async function updateQuoteIndex(
    quoteIndex,
    id,
    fileName
) {

    quoteIndex.push({
        id: id,
        file: fileName
    });

    const dataFolder =
        await projectFolder.getDirectoryHandle(
            "data",
            { create: true }
        );

    const indexFileHandle =
        await dataFolder.getFileHandle(
            "quotes.json",
            { create: true }
        );

    const writable =
        await indexFileHandle.createWritable();

    await writable.write(
        JSON.stringify(quoteIndex, null, 4)
    );

    await writable.close();

}


/*==============================================================================
    LAG SITAT
==============================================================================*/

quoteForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        saveStatus.textContent =
            "";

        try {

            const quoteData =
                createQuoteData();

            displayPreview(quoteData);

            if (!projectFolder) {
                await selectProjectFolder();
            }

            const quoteIndex =
                await getQuoteIndex();

            const id =
                createNextId(quoteIndex);

            const fileName =
                createFileName(
                    id,
                    quoteData.author
                );

            await saveQuoteFile(
                fileName,
                quoteData
            );

            await updateQuoteIndex(
                quoteIndex,
                id,
                fileName
            );

            saveStatus.textContent =
                `Sitatet er lagret som quotes/${fileName}`;

            quoteForm.reset();

        }

        catch (error) {

            console.error(error);

            if (error.name === "AbortError") {

                saveStatus.textContent =
                    "Ingen mappe ble valgt.";

                return;

            }

            saveStatus.textContent =
                "Sitatet kunne ikke lagres.";

        }

    }
);