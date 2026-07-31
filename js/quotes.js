/*==============================================================================
    HTML-ELEMENTER
==============================================================================*/

const quoteElement =
    document.getElementById("quote");

const authorElement =
    document.getElementById("author");


/*==============================================================================
    HENT OVERSIKT OVER SITATER
==============================================================================*/

async function getQuotes() {

    const response =
        await fetch("data/quotes.json", {
            cache: "no-store"
        });

    if (!response.ok) {
        throw new Error("Kunne ikke hente sitatoversikten.");
    }

    const quotes =
        await response.json();

    if (!Array.isArray(quotes) || quotes.length === 0) {
        throw new Error("Sitatoversikten er tom.");
    }

    return quotes;

}


/*==============================================================================
    HENT TILFELDIG SITAT
==============================================================================*/

async function getRandomQuote() {

    const quotes =
        await getQuotes();

    const randomIndex =
        Math.floor(Math.random() * quotes.length);

    const selectedQuote =
        quotes[randomIndex];

    const response =
        await fetch(`quotes/${selectedQuote.file}`, {
            cache: "no-store"
        });

    if (!response.ok) {
        throw new Error(
            `Kunne ikke hente sitatet: ${selectedQuote.file}`
        );
    }

    return await response.json();

}


/*==============================================================================
    VIS TILFELDIG SITAT
==============================================================================*/

async function displayRandomQuote() {

    if (!quoteElement || !authorElement) {
        return;
    }

    try {

        const randomQuote =
            await getRandomQuote();

        quoteElement.textContent =
            randomQuote.quote;

        let authorText =
            "";

        if (randomQuote.author) {
            authorText =
                `— ${randomQuote.author}`;
        }

        if (randomQuote.source) {

            authorText += authorText
                ? `, ${randomQuote.source}`
                : randomQuote.source;

        }

        authorElement.textContent =
            authorText;

    }

    catch (error) {

        console.error(error);

        quoteElement.textContent =
            "Kunne ikke laste sitat.";

        authorElement.textContent =
            "";

    }

}


/*==============================================================================
    OPPSTART
==============================================================================*/

displayRandomQuote();