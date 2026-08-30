import * as React from "react";
import { createRoot } from "react-dom/client";
import { LocaleProvider, ThemeProvider } from "@gamecrafters/base-ui/react";
import Router from "./router";
import "@gamecrafters/base-ui/main.css";
import "./styles/main.css";

const classes = {
    // The provider is the element carrying `data-theme`, and the background the tokens resolve
    // to with it, so it is the one that has to reach the full height of the viewport. The page
    // is stood down it in a column so that the height it reaches is a height the page can be
    // given a share of, rather than one it is only drawn against
    theme: "min-h-dvh flex flex-col",
};

// The locale the site is written in. It is said rather than followed from the reader's browser,
// since the copy is in one language whatever the reader's own is set to, and the direction it is
// read in is worked out from this tag rather than asked for separately
const locale = "en-US";

const container = document.getElementById("root");

// The element the app is mounted into is written into the document rather than built here, so
// its absence is a broken document rather than a state the app could carry on from
if (!container) {
    throw new Error("The element the app is mounted into is missing from the document");
}

// Everything the app settles before any feature is drawn, and then the site itself: the language
// it is read in and the direction that follows from it, and the colour scheme its tokens resolve
// under. `auto` follows the operating system until the reader says otherwise.
//
// Which page is drawn is the router's, so it is the one thing mounted here. The providers stand
// outside it rather than within a page, so what a page is drawn under is settled once and does
// not go and come back as the reader moves between them
createRoot(container).render(
    <React.StrictMode>
        <LocaleProvider locale={locale}>
            <ThemeProvider className={classes.theme} colorMode="auto">
                <Router />
            </ThemeProvider>
        </LocaleProvider>
    </React.StrictMode>,
);
