"use strict";


/* ========================== HISTORIESORTERING ========================== */


/* -------------------------- VALGT SORTERING ---------------------------- */

function getSelectedSort() {

    const parameters =
        new URLSearchParams(
            window.location.search
        );

    return (
        parameters.get("sort") ??
        "newest"
    );

}


/* -------------------------- SORTER HISTORIER --------------------------- */

function sortStories(
    stories,
    sortMethod
) {

    /*
        Lager en kopi av listen slik at den opprinnelige
        listen ikke endres.
    */

    const sortedStories =
        [...stories];


    switch (sortMethod) {

        case "oldest":

            return sortedStories.sort(
                sortByOldest
            );


        case "title":

            return sortedStories.sort(
                sortByTitle
            );


        case "newest":
        default:

            return sortedStories.sort(
                sortByNewest
            );

    }

}


/* ----------------------------- NYEST FØRST ----------------------------- */

function sortByNewest(
    storyA,
    storyB
) {

    const yearDifference =
        getStorySortYear(storyB) -
        getStorySortYear(storyA);

    if (yearDifference !== 0) {
        return yearDifference;
    }

    return sortByTitle(
        storyA,
        storyB
    );

}


/* ----------------------------- ELDST FØRST ----------------------------- */

function sortByOldest(
    storyA,
    storyB
) {

    const yearDifference =
        getStorySortYear(storyA) -
        getStorySortYear(storyB);

    if (yearDifference !== 0) {
        return yearDifference;
    }

    return sortByTitle(
        storyA,
        storyB
    );

}


/* --------------------------- ALFABETISK -------------------------------- */

function sortByTitle(
    storyA,
    storyB
) {

    return storyA.title.localeCompare(
        storyB.title,
        "nb",
        {
            sensitivity: "base"
        }
    );

}


/* -------------------------- SORTERINGSÅR ------------------------------- */

function getStorySortYear(story) {

    if (
        typeof story.sortYear === "number"
    ) {

        return story.sortYear;

    }

    /*
        Historier uten sorteringsår plasseres nederst
        både ved nyeste og eldste sortering.
    */

    return Number.NEGATIVE_INFINITY;

}