import * as React from "react";
import { createRoot } from "react-dom/client";
import { LocaleProvider, ThemeProvider } from "@gamecrafters/base-ui/react";
import { Home } from "./features";
import "@gamecrafters/base-ui/main.css";
import "./styles/main.css";

const classes = {
    // The provider is the element carrying `data-theme`, and the background the tokens resolve
    // to with it, so it is the one that has to reach the full height of the viewport
    theme: "min-h-dvh",
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

// Everything the app settles before any feature is drawn, and then the page the site is: the
// language it is read in and the direction that follows from it, and the colour scheme its
// tokens resolve under. `auto` follows the operating system until the reader says otherwise
createRoot(container).render(
    <React.StrictMode>
        <LocaleProvider locale={locale}>
            <ThemeProvider className={classes.theme} colorMode="auto">
                <Home />
            </ThemeProvider>
        </LocaleProvider>
    </React.StrictMode>,
);
