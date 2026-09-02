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
    // What is drawn outside the page stands over everything on it, the row across the top
    // included. The row is a sticky layer and the portal is drawn after it, but the layer the
    // library gives what is portalled is lower than the row's, so the row would otherwise be
    // drawn over a dialog and take the presses meant for it. Both are laid out in this column,
    // so saying which layer this one is on is enough to settle the two
    portal: "z-[var(--z-index-modal)]",
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
                {/* Where everything drawn outside the page it was opened from goes: a menu, an
                    overlay, a dialog. The library puts those on the body unless it is given
                    somewhere of its own, and the body stands outside the element carrying
                    `data-theme`, which is what every token is declared against — so a menu put
                    there would be drawn with none of them resolving.

                    It stands inside the provider and so inside the theme, and holds nothing
                    itself: what is put into it is placed against the page rather than laid out
                    where it was written, so it takes no room in the column */}
                <div className={classes.portal} data-portal-root />
            </ThemeProvider>
        </LocaleProvider>
    </React.StrictMode>,
);
