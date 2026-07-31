"use strict";


/* =========================== KATEGORIFILTER ============================ */


/* ----------------------------- FILTER ------------------------------ */

function filterStoriesByCategory(
    stories,
    category
) {

    if (
        !category ||
        category === "all"
    ) {

        return stories;

    }

    return stories.filter(story => {

        return (
            story.category === category
        );

    });

}


/* --------------------------- AKTIV KATEGORI ---------------------------- */

function getSelectedCategory() {

    const parameters =
        new URLSearchParams(
            window.location.search
        );

    return (
        parameters.get("category") ??
        "all"
    );

}