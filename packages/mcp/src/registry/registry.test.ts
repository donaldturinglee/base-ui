import { describe, expect, it } from "vitest";
import { registry } from "../tests/registry";
import { findEntry, searchEntries, searchTokens } from "./registry";

const names = (entries: { name: string }[]) => entries.map((entry) => entry.name);

describe("findEntry", () => {
    it("finds an entry by the name it is drawn under", () => {
        expect(findEntry(registry, "Dialog")?.name).toBe("Dialog");
    });

    it("does not hold the caller to the case it was written in", () => {
        expect(findEntry(registry, "dialog")?.name).toBe("Dialog");
    });

    it("finds an entry by the directory it is written in", () => {
        expect(findEntry(registry, "theme")?.name).toBe("ThemeProvider");
    });

    it("finds an entry by something exported beside it", () => {
        expect(findEntry(registry, "useTheme")?.name).toBe("ThemeProvider");
    });

    it("finds an entry by a part hung off it", () => {
        expect(findEntry(registry, "Dialog.Header")?.name).toBe("Dialog");
    });

    it("finds nothing for a name the library does not have", () => {
        expect(findEntry(registry, "Carousel")).toBeUndefined();
    });
});

describe("searchEntries", () => {
    it("answers with the whole library where nothing was asked of it", () => {
        expect(searchEntries(registry)).toHaveLength(registry.entries.length);
    });

    it("answers with what is named for the query before what only mentions it", () => {
        expect(names(searchEntries(registry, "theme"))).toEqual(["ThemeProvider"]);
    });

    it("searches what an entry takes as well as what it is called", () => {
        expect(names(searchEntries(registry, "colorMode"))).toEqual(["ThemeProvider"]);
    });

    it("searches what an entry has been shown doing", () => {
        expect(names(searchEntries(registry, "variant scale"))).toEqual(["Button"]);
    });

    it("answers with nothing where nothing answers", () => {
        expect(searchEntries(registry, "nothing of the sort")).toEqual([]);
    });
});

describe("searchTokens", () => {
    it("searches the name of a token", () => {
        expect(searchTokens(registry, "base-size")).toHaveLength(1);
    });

    it("searches what a token is for", () => {
        expect(searchTokens(registry, "body text")[0]?.name).toBe("--foreground-color-default");
    });

    it("narrows to a group", () => {
        expect(searchTokens(registry, undefined, "foreground")).toHaveLength(1);
    });

    it("narrows to a group and a query together", () => {
        expect(searchTokens(registry, "base-size", "foreground")).toEqual([]);
    });
});
