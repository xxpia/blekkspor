"use strict";


/* ============================== HJEM =================================== */


/* ------------------------------ INNSTILLINGER --------------------------- */

const latestStoryLimit = 3;


/* ------------------------------- OPPSTART ------------------------------- */

document.addEventListener(
    "DOMContentLoaded",
    loadLatestStories
);


/* --------------------------- SIDEELEMENTER ------------------------------ */

const latestStoriesContainer =
    document.getElementById(
        "latest-stories"
    );


/* ------------------------ LAST NYESTE HISTORIER ------------------------- */

async function loadLatestStories() {

    try {

        if (!latestStoriesContainer) {

            throw new Error(
                "Fant ikke området for de nyeste historiene."
            );

        }

        displayLatestStoriesStatus(
            "Laster historier…"
        );

        const storyIndex =
            await fetchJson(
                "DATA/stories.json"
            );

        if (!Array.isArray(storyIndex)) {

            throw new Error(
                "Historieoversikten har feil format."
            );

        }

        const stories =
            await loadHomeStories(
                storyIndex
            );

        const publishedStories =
            stories.filter(story => {
                return story.published !== false;
            });

        const latestStories =
            sortLatestStories(
                publishedStories
            ).slice(
                0,
                latestStoryLimit
            );

        displayLatestStories(
            latestStories
        );

    } catch (error) {

        console.error(error);

        displayLatestStoriesError(
            error.message
        );

    }

}


/* -------------------------- LAST HISTORIER ----------------------------- */

async function loadHomeStories(
    storyIndex
) {

    return await Promise.all(

        storyIndex.map(async entry => {

            const story =
                await fetchJson(
                    `STORIES/${entry.file}`
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


/* -------------------------- SORTER HISTORIER --------------------------- */

function sortLatestStories(
    stories
) {

    return [...stories].sort(
        compareLatestStories
    );

}


/* -------------------------- SAMMENLIGN HISTORIER ----------------------- */

function compareLatestStories(
    storyA,
    storyB
) {

    const yearA =
        getHomeStorySortYear(
            storyA
        );

    const yearB =
        getHomeStorySortYear(
            storyB
        );

    const yearDifference =
        yearB - yearA;

    if (yearDifference !== 0) {
        return yearDifference;
    }

    return storyA.title.localeCompare(
        storyB.title,
        "nb",
        {
            sensitivity: "base"
        }
    );

}


/* --------------------------- SORTERINGSÅR ------------------------------ */

function getHomeStorySortYear(
    story
) {

    if (
        typeof story.sortYear === "number"
    ) {

        return story.sortYear;

    }

    return Number.NEGATIVE_INFINITY;

}


/* ---------------------- VIS NYESTE HISTORIER --------------------------- */

function displayLatestStories(
    stories
) {

    latestStoriesContainer.replaceChildren();


    if (stories.length === 0) {

        displayEmptyLatestStories();

        return;

    }


    const storyCards =
        stories.map(story => {
            return createLatestStoryCard(
                story
            );
        });

    latestStoriesContainer.append(
        ...storyCards
    );

}


/* --------------------------- HISTORIEKORT ------------------------------ */

function createLatestStoryCard(
    story
) {

    const article =
        document.createElement(
            "article"
        );

    article.className =
        "latest-story";


    /* Overskrift */

    const title =
        document.createElement(
            "h3"
        );

    title.className =
        "latest-story-title";


    const titleLink =
        document.createElement(
            "a"
        );

    titleLink.href =
        createHomeStoryUrl(
            story
        );

    const isYear =
    /^\d{4}$/.test(story.date ?? "");

titleLink.textContent =
    story.title;

if (isYear) {

    const year =
        document.createElement(
            "span"
        );

    year.className =
        "latest-story-year";

    year.textContent =
        ` (${story.date})`;

    titleLink.appendChild(
        year
    );

}

    title.appendChild(
        titleLink
    );

    article.appendChild(
        title
    );


    /* Informasjon */



    /* Sammendrag */

    if (story.summary) {

        const summary =
            document.createElement(
                "p"
            );

        summary.className =
            "latest-story-summary";

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
        "latest-story-link";

    readLink.href =
        createHomeStoryUrl(
            story
        );

    readLink.textContent =
        "les mer...";

    article.appendChild(
        readLink
    );


    return article;

}


/* --------------------------- HISTORIELENKE ----------------------------- */

function createHomeStoryUrl(
    story
) {

    const templateFilename =
        getTemplateFilename(
            story.category
        );

    return (
        `TEMPLATES/${templateFilename}` +
        `?id=${encodeURIComponent(story.id)}`
    );

}


/* -------------------------- INGEN HISTORIER ---------------------------- */

function displayEmptyLatestStories() {

    const message =
        document.createElement(
            "p"
        );

    message.className =
        "latest-stories-empty";

    message.textContent =
        "Det finnes ingen publiserte tekster ennå.";

    latestStoriesContainer.appendChild(
        message
    );

}


/* ----------------------------- STATUS --------------------------------- */

function displayLatestStoriesStatus(
    message
) {

    latestStoriesContainer.replaceChildren();

    const status =
        document.createElement(
            "p"
        );

    status.className =
        "latest-stories-status";

    status.textContent =
        message;

    latestStoriesContainer.appendChild(
        status
    );

}


/* ------------------------------- FEIL ---------------------------------- */

function displayLatestStoriesError(
    message
) {

    latestStoriesContainer.replaceChildren();

    const errorMessage =
        document.createElement(
            "p"
        );

    errorMessage.className =
        "latest-stories-error";

    errorMessage.textContent =
        message;

    latestStoriesContainer.appendChild(
        errorMessage
    );

}