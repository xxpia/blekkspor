/*==============================================================================
    TEMA
==============================================================================*/

/* ------------------------------- ELEMENTER -------------------------------- */
/* Finner temaknappen og et eventuelt lagret temavalg. */

const themeButton = document.querySelector(".theme-toggle");
const savedTheme = localStorage.getItem("theme");


/* ------------------------------- LAGRET TEMA ------------------------------- */
/* Bruker det lagrede temaet dersom besøkende har valgt et tidligere. */

if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
}


/* ------------------------------- TEMAKNAPP -------------------------------- */
/* Oppdaterer symbolet på knappen ut fra hvilket tema som er aktivt. */

function updateThemeButton() {
    if (!themeButton) {
        return;
    }

    const currentTheme =
        document.documentElement.getAttribute("data-theme");

    themeButton.textContent =
        currentTheme === "dark" ? "☀" : "☾";
}


/* ------------------------------- TEMABYTTE -------------------------------- */
/* Bytter mellom lyst og mørkt tema og lagrer valget. */

if (themeButton) {
    updateThemeButton();

    themeButton.addEventListener("click", () => {
        const currentTheme =
            document.documentElement.getAttribute("data-theme");

        const newTheme =
            currentTheme === "dark" ? "light" : "dark";

        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);

        updateThemeButton();
    });
}


/*==============================================================================
    FOOTER
==============================================================================*/

/* ------------------------------- ÅRSTALL ----------------------------------- */
/* Setter automatisk inneværende år i footeren. */

const year = document.getElementById("year");

if (year) {
    year.textContent = new Date().getFullYear();
}


/*==============================================================================
    NAVIGASJON
==============================================================================*/

/* ------------------------------- AKTIV SIDE ------------------------------- */
/* Marker riktig lenke i hovednavigasjonen på hovedsidene. */

function setActiveNavigation() {
    const currentPath = window.location.pathname;

    const currentPage =
        currentPath.split("/").pop() || "index.html";

    const mainPages = [
        "index.html",
        "archive.html",
        "about.html",
        "categories.html"
    ];

    /* Historiesider og andre undersider skal ikke ha et aktivt menyvalg. */

    if (!mainPages.includes(currentPage)) {
        return;
    }

    const navigationLinks =
        document.querySelectorAll(".main-nav a");

    navigationLinks.forEach(link => {
        const href = link.getAttribute("href");

        if (!href) {
            return;
        }

        const linkPage =
            href.split("/").pop();

        if (linkPage === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
    });
}

setActiveNavigation();


/*==============================================================================
    LOKAL ADMIN-LENKE
==============================================================================*/

const adminFooterLink =
    document.getElementById("admin-footer-link");

const isLocalWebsite =
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "localhost";

if (adminFooterLink && isLocalWebsite) {
    adminFooterLink.hidden = false;
}


/* ============================== JSON =================================== */


/* ------------------------------- HENT JSON ------------------------------ */

async function fetchJson(path) {

    const response =
        await fetch(path);

    if (!response.ok) {

        throw new Error(
            `Kunne ikke hente ${path}.`
        );

    }

    return await response.json();

}


/* ============================= HISTORIEMALER =========================== */


/* ------------------------------- MALFIL -------------------------------- */

function getTemplateFilename(category) {

    const templates = {

        novella:
            "novella-template.html",

        poem:
            "poem-template.html",

        shortprose:
            "shortprose-template.html",

        excerpt:
            "excerpt-template.html"

    };

    const filename =
        templates[category];

    if (!filename) {

        throw new Error(
            `Ukjent historiekategori: ${category}`
        );

    }

    return filename;

}