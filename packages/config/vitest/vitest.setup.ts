import { TextDecoder, TextEncoder } from "node:util";
import { JSDOM } from "jsdom";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// jsdom leaves TextEncoder and TextDecoder out of the globals it lays down, though browsers and
// Node itself have carried both for years. The QR encoder measures its data in bytes before it
// can choose a version to hold it, so without them there is no code to draw at all
if (typeof globalThis.TextEncoder === "undefined") {
    Object.assign(globalThis, { TextDecoder, TextEncoder });
}

// Node carries a localStorage of its own that stays switched off unless it is handed a file to
// keep the data in, and a global that is already there is one jsdom is not allowed to lay its
// own over. A window of its own is opened to take a working store from, so the pane width a
// reader was last left holding is kept the way a browser would keep it
if (typeof globalThis.localStorage === "undefined") {
    const { window } = new JSDOM("", { url: "http://localhost:3000" });

    Object.defineProperty(globalThis, "localStorage", {
        configurable: true,
        get: () => window.localStorage,
    });
}

// The suites name what they take from Vitest rather than reading it off the globals, so the
// testing library finds no afterEach of its own to hang its teardown on. Each render is taken
// down here instead, so every test still starts on an empty document
afterEach(() => {
    cleanup();
});
