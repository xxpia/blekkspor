"use strict";


/* ============================== ARKIV ================================== */

let archiveStories = [];
let sortMenuPrepared = false;

/* ------------------------------- OPPSTART ------------------------------- */

document.addEventListener(
    "DOMContentLoaded",
    loadArchive
);


/* ---------------------------- ARKIVELEMENTER ---------------------------- */

const archiveList =
    document.getElementById(
        "archive-list"
    );

const archiveStatus =
    document.getElementById(
        "archive-status"
    );

const archiveSort =
    document.getElementById(
        "archive-sort"
    );

const archiveCategory =
    document.getElementById(
        "archive-category"
    );

const archiveTitle =
    document.getElementById(
        "archive-title"
    );

const archiveDescription =
    document.getElementById(
        "archive-description"
    );

const archiveCount =
    document.getElementById(
        "archive-count"
    );

/* ---------------------------- LAST ARKIV ------------------------------- */

async function loadArchive() {

    try {

        if (!archiveList) {

            throw new Error(
                "Fant ikke historielisten i arkivet."
            );

        }

        setArchiveStatus(
            "Laster historier…"
        );

        const storyIndex =
            await fetchJson(
                "data/stories.json"
            );

        if (!Array.isArray(storyIndex)) {

            throw new Error(
                "Historieoversikten har feil format."
            );

        }

        const stories =
            await loadArchiveStories(
                storyIndex
            );

archiveStories =
    stories.filter(story => {
        return story.published !== false;
    });

prepareSortMenu();

displayArchive(
    archiveStories
);

    } catch (error) {

        console.error(error);

        displayArchiveError(
            error.message
        );

    }

}


/* -------------------------- LAST HISTORIER ----------------------------- */

async function loadArchiveStories(
    storyIndex
) {

    return await Promise.all(

        storyIndex.map(async entry => {

            const story =
                await fetchJson(
                    `stories/${entry.file}`
                );

            return {

                ...story,

                id:
                    entry.id,

                file:
                    entry.file

            };

        })

    );

}


/* ---------------------------- VIS ARKIV -------------------------------- */

function displayArchive(stories) {

    const selectedCategory =
        getSelectedCategory();

    const selectedSort =
        getSelectedSort();


    if (archiveCategory) {

        archiveCategory.value =
            selectedCategory;

    }


    updateArchiveSection(
        selectedCategory
    );


    const filteredStories =
        filterStoriesByCategory(
            stories,
            selectedCategory
        );


    const sortedStories =
        sortStories(
            filteredStories,
            selectedSort
        );


    updateArchiveCount(
        sortedStories.length
    );


    archiveList.replaceChildren();


    if (sortedStories.length === 0) {

        displayEmptyArchive(
            selectedCategory
        );

        return;

    }


    const storyCards =
        sortedStories.map(story => {

            return createStoryCard(
                story
            );

        });


    archiveList.append(
        ...storyCards
    );


    setArchiveStatus("");

}


/* --------------------------- HISTORIEKORT ------------------------------ */

function createStoryCard(story) {

    const article =
        document.createElement(
            "article"
        );

    article.className =
        "archive-story";


    /* Overskrift */

    const title =
        document.createElement(
            "h2"
        );

    title.className =
        "archive-story-title";


    const link =
        document.createElement(
            "a"
        );

    link.href =
        createStoryUrl(story);

    link.textContent =
        story.title;

    title.appendChild(
        link
    );


    /* Informasjon */

    article.appendChild(
        title
    );



    /* Sammendrag */

    if (story.summary) {

        const summary =
            document.createElement(
                "p"
            );

        summary.className =
            "archive-story-summary";

        summary.textContent =
            story.summary;

        article.appendChild(
            summary
        );

    }


    /* Leselenke */

    const readLink =
        document.createElement(
            "a"
        );

    readLink.className =
        "archive-story-link";

    readLink.href =
        createStoryUrl(story);

    readLink.textContent =
        "les mer...";

    article.appendChild(
        readLink
    );


    return article;

}


/* --------------------------- HISTORIELENKE ----------------------------- */

function createStoryUrl(story) {

    const templateFilename =
        getTemplateFilename(
            story.category
        );

    return (
        `templates/${templateFilename}` +
        `?id=${encodeURIComponent(story.id)}`
    );

}


/* -------------------------- ARKIVSEKSJON ------------------------------- */

function updateArchiveSection(
    selectedCategory
) {

    const sections = {

        all: {
            title: "alle tekster",
            description:
                "alle spor, samlet på ett sted."
        },

        novella: {
            title: "noveller",
            description:
                "historier med en slutt."
        },

        poem: {
            title: "dikt",
            description:
                "tanker som ble til vers."
        },

        shortprose: {
            title: "kortprosa",
            description:
                "historier fortalt med få ord."
        },

        excerpt: {
            title: "utdrag",
            description:
                "smakebiter fra større prosjekter."
        }

    };


    const section =
        sections[selectedCategory] ??
        sections.all;


    if (archiveTitle) {

        archiveTitle.textContent =
            section.title;

    }


    if (archiveDescription) {

        archiveDescription.textContent =
            section.description;

    }

}

/* -------------------------- ANTALL TEKSTER ----------------------------- */

function updateArchiveCount(
    storyCount
) {

    if (!archiveCount) {
        return;
    }

    if (storyCount === 1) {

        archiveCount.textContent =
            "1 tekst";

        return;

    }

    archiveCount.textContent =
        `${storyCount} tekster`;

}


/* ------------------------- TOMT ARKIV ---------------------------------- */

function displayEmptyArchive(
    selectedCategory
) {

    const message =
        document.createElement(
            "p"
        );

    message.className =
        "archive-empty";


    if (
        selectedCategory &&
        selectedCategory !== "all"
    ) {

        message.textContent =
            "Det finnes ingen publiserte tekster i denne kategorien.";

    } else {

        message.textContent =
            "Arkivet inneholder ingen publiserte tekster ennå.";

    }

    archiveList.appendChild(
        message
    );

    setArchiveStatus("");

}


/* -------------------------- SORTERINGSMENY ----------------------------- */

function prepareSortMenu() {

    if (archiveSort) {

        archiveSort.value =
            getSelectedSort();

    }

    if (archiveCategory) {

        archiveCategory.value =
            getSelectedCategory();

    }

    if (sortMenuPrepared) {
        return;
    }

    if (archiveSort) {

        archiveSort.addEventListener(
            "change",
            updateArchiveSort
        );

    }

    if (archiveCategory) {

        archiveCategory.addEventListener(
            "change",
            updateArchiveCategory
        );

    }

    sortMenuPrepared = true;

}



/* --------------------------- ENDRE KATEGORI ---------------------------- */

function updateArchiveCategory() {

    const parameters =
        new URLSearchParams(
            window.location.search
        );

    const selectedCategory =
        archiveCategory.value;


    if (selectedCategory === "all") {

        parameters.delete(
            "category"
        );

    } else {

        parameters.set(
            "category",
            selectedCategory
        );

    }


    const queryString =
        parameters.toString();

    const newUrl =
        queryString
            ? `${window.location.pathname}?${queryString}`
            : window.location.pathname;

    window.history.replaceState(
        {},
        "",
        newUrl
    );

    displayArchive(
        archiveStories
    );

}


/* -------------------------- ENDRE SORTERING ---------------------------- */

function updateArchiveSort() {

    const parameters =
        new URLSearchParams(
            window.location.search
        );

    const selectedSort =
        archiveSort.value;


    if (selectedSort === "newest") {

        parameters.delete("sort");

    } else {

        parameters.set(
            "sort",
            selectedSort
        );

    }


    const queryString =
        parameters.toString();

    const newUrl =
        queryString
            ? `${window.location.pathname}?${queryString}`
            : window.location.pathname;

    window.history.replaceState(
        {},
        "",
        newUrl
    );

    displayArchive(
        archiveStories
    );

}


/* --------------------------- ARKIVSTATUS ------------------------------- */

function setArchiveStatus(message) {

    if (!archiveStatus) {
        return;
    }

    archiveStatus.textContent =
        message;

    archiveStatus.hidden =
        !message;

}


/* ----------------------------- VIS FEIL -------------------------------- */

function displayArchiveError(message) {

    if (archiveList) {

        archiveList.replaceChildren();

        const errorMessage =
            document.createElement(
                "p"
            );

        errorMessage.className =
            "archive-error";

        errorMessage.textContent =
            message;

        archiveList.appendChild(
            errorMessage
        );

    }

    setArchiveStatus("");

}
