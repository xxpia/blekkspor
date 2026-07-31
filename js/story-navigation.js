"use strict";


/* ========================== HISTORIENAVIGASJON ========================== */


/* ---------------------------- LAG NAVIGASJON ---------------------------- */

async function createStoryNavigation(
    storyIndex,
    currentStoryId
) {

    const stories =
        await loadStoryInformation(
            storyIndex
        );

    const publishedStories =
        stories.filter(story => {
            return story.published !== false;
        });

    const currentIndex =
        publishedStories.findIndex(story => {
            return story.id === currentStoryId;
        });

    const previousLink =
        document.getElementById(
            "story-previous"
        );

    const nextLink =
        document.getElementById(
            "story-next"
        );


    /* Forrige */

    if (currentIndex > 0) {

        setNavigationLink(
            previousLink,
            publishedstories[currentIndex - 1],
            "← forrige"
        );

    } else {

        previousLink.hidden = true;

    }


    /* Neste */

    if (
        currentIndex !== -1 &&
        currentIndex < publishedstories.length - 1
    ) {

        setNavigationLink(
            nextLink,
            publishedstories[currentIndex + 1],
            "neste →"
        );

    } else {

        nextLink.hidden = true;

    }

}


/* ------------------------ LES HISTORIEINFORMASJON ----------------------- */

async function loadStoryInformation(
    storyIndex
) {

    return Promise.all(

        storyIndex.map(async entry => {

            const story =
                await fetchJson(
                    `../stories/${entry.file}`
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


/* ---------------------------- NAVIGASJONSLENKE -------------------------- */

function setNavigationLink(
    link,
    story,
    text
) {

    link.href =
        `${getTemplateFilename(story.category)}?id=${encodeURIComponent(story.id)}`;

    link.textContent =
        text;

    link.title =
        story.title;

    link.hidden =
        false;

}
