"use strict";


/* ============================ HISTORIELASTER ============================ */


/* ------------------------------- OPPSTART ------------------------------- */

document.addEventListener(
    "DOMContentLoaded",
    loadStory
);


/* ---------------------------- LAST HISTORIE ----------------------------- */

async function loadStory() {

    try {

        const storyId =
            getStoryId();

        if (!storyId) {

            throw new Error(
                "Ingen historie-ID ble funnet i adressen."
            );

        }


        const storyIndex =
            await fetchJson(
                "../data/stories.json"
            );

        if (!Array.isArray(storyIndex)) {

            throw new Error(
                "Historieoversikten har feil format."
            );

        }


        const storyEntry =
            storyIndex.find(entry => {

                return entry.id === storyId;

            });

        if (!storyEntry) {

            throw new Error(
                `Fant ikke historien "${storyId}".`
            );

        }


        const story =
            await fetchJson(
                `../stories/${storyEntry.file}`
            );

        if (story.published === false) {

            throw new Error(
                "Denne historien er ikke publisert."
            );

        }


        displayStory(
            story
        );


        await createStoryNavigation(
            storyIndex,
            storyId
        );

    } catch (error) {

        console.error(
            error
        );

        displayStoryError(
            error.message
        );

    }

}


/* ------------------------------ HISTORIE-ID ----------------------------- */

function getStoryId() {

    const parameters =
        new URLSearchParams(
            window.location.search
        );

    return parameters.get(
        "id"
    );

}


/* ---------------------------- VIS HISTORIE ------------------------------ */

function displayStory(story) {

    const title =
        document.getElementById(
            "story-title"
        );

    const category =
        document.getElementById(
            "story-category"
        );

    const date =
        document.getElementById(
            "story-date"
        );

    const dateSeparator =
        document.getElementById(
            "story-meta-separator"
        );

    const body =
        document.getElementById(
            "story-body"
        );

    const comment =
        document.getElementById(
            "story-comment"
        );

    const informationCategory =
        document.getElementById(
            "story-info-category"
        );

    const wordCount =
        document.getElementById(
            "story-info-word-count"
        );


    /* Tittel */

    if (title) {

        title.textContent =
            story.title || "uten tittel";

    }

    document.title =
        `${story.title || "uten tittel"} | blekkspor`;


    /* Kategori */

    const categoryLabel =
        story.categoryLabel ||
        story.category ||
        "";

    if (category) {

        category.textContent =
            categoryLabel;

    }

    if (informationCategory) {

        informationCategory.textContent =
            categoryLabel;

    }


    /* Dato */

    displayStoryDate(
        date,
        dateSeparator,
        story.date
    );


    /* Historietekst */

    if (body) {

        body.innerHTML =
            story.content || "";

    }


    /* Kommentar */

    displayStoryComment(
        comment,
        story.comment
    );


    /* Antall ord */

    if (wordCount) {

        wordCount.textContent =
            getStoryWordCount(
                story
            );

    }

}


/* ----------------------------- VIS DATO -------------------------------- */

function displayStoryDate(
    dateElement,
    separatorElement,
    storyDate
) {

    if (!dateElement) {
        return;
    }


    if (storyDate) {

        dateElement.textContent =
            storyDate;

        dateElement.hidden =
            false;

        if (separatorElement) {

            separatorElement.hidden =
                false;

        }

        return;

    }


    dateElement.hidden =
        true;

    if (separatorElement) {

        separatorElement.hidden =
            true;

    }

}


/* ---------------------------- VIS KOMMENTAR ----------------------------- */

function displayStoryComment(
    commentElement,
    comment
) {

    if (!commentElement) {
        return;
    }


    commentElement.replaceChildren();


    if (!comment) {

        commentElement.hidden =
            true;

        return;

    }


    const paragraph =
        document.createElement(
            "p"
        );

    paragraph.textContent =
        comment;

    commentElement.appendChild(
        paragraph
    );

    commentElement.hidden =
        false;

}


/* ----------------------------- ANTALL ORD ------------------------------- */

function getStoryWordCount(story) {

    if (
        typeof story.wordCount === "number"
    ) {

        return story.wordCount;

    }


    if (
        typeof story.wordCount === "string" &&
        story.wordCount.trim() !== ""
    ) {

        return story.wordCount;

    }


    return countWordsFromContent(
        story.content
    );

}


/* ---------------------------- TELL ORD --------------------------------- */

function countWordsFromContent(content) {

    if (!content) {
        return 0;
    }


    const temporaryElement =
        document.createElement(
            "div"
        );

    temporaryElement.innerHTML =
        content;

    const text =
        temporaryElement.textContent
            .trim();

    if (!text) {
        return 0;
    }


    return text
        .split(/\s+/)
        .filter(Boolean)
        .length;

}


/* ============================== FEIL =================================== */


/* ------------------------------ VIS FEIL ------------------------------- */

function displayStoryError(message) {

    const story =
        document.querySelector(
            ".story"
        );

    if (!story) {
        return;
    }


    story.replaceChildren();


    const title =
        document.createElement(
            "h2"
        );

    title.textContent =
        "historien kunne ikke åpnes";


    const errorText =
        document.createElement(
            "p"
        );

    errorText.textContent =
        message;


    const linkParagraph =
        document.createElement(
            "p"
        );

    const archiveLink =
        document.createElement(
            "a"
        );

    archiveLink.href =
        "../archive.html";

    archiveLink.textContent =
        "← tilbake til arkivet";


    linkParagraph.appendChild(
        archiveLink
    );

    story.append(
        title,
        errorText,
        linkParagraph
    );

}
