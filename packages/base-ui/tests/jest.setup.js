import { TextDecoder, TextEncoder } from "node:util";
import "@testing-library/jest-dom";

// jsdom leaves TextEncoder and TextDecoder out of the globals it lays down, though browsers and
// Node itself have carried both for years. The QR encoder measures its data in bytes before it
// can choose a version to hold it, so without them there is no code to draw at all
if (typeof globalThis.TextEncoder === "undefined") {
    Object.assign(globalThis, { TextDecoder, TextEncoder });
}
