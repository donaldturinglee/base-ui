import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { readEntry } from "./entries";

// Read against the library itself rather than against a fixture: what a reader of sources is
// worth is whether it reads the sources there are, so the components it is pointed at here are
// the ones the design system is least likely to stop having
const LIBRARY = fileURLToPath(new URL("../../../react/src", import.meta.url));

const IMPORT = "@gamecrafters/base-ui/react";

const read = (section: "components" | "providers", directory: string) => {
    const entry = readEntry(`${LIBRARY}/${section}/${directory}`, section, IMPORT);
    if (!entry) {
        throw new Error(`${directory} was not read as an entry`);
    }
    return entry;
};

describe("readEntry", () => {
    it("names a component for the directory it is written in", () => {
        const entry = read("components", "button");
        expect(entry.name).toBe("Button");
        expect(entry.directory).toBe("button");
        expect(entry.section).toBe("components");
    });

    it("reads what the component takes", () => {
        const props = read("components", "button").props[0];
        expect(props?.name).toBe("ButtonProps");
        expect(props?.props.map((prop) => prop.name)).toContain("variant");
    });

    it("reads the examples the component is developed and reviewed through", () => {
        expect(read("components", "button").examples.length).toBeGreaterThan(1);
    });

    it("hangs the parts of a component off it", () => {
        expect(read("components", "dialog").parts).toContain("Header");
    });

    it("names a provider for what it exports rather than for its directory", () => {
        const entry = read("providers", "theme");
        expect(entry.name).toBe("ThemeProvider");
        expect(entry.directory).toBe("theme");
        expect(entry.exports).toContain("useTheme");
    });

    it("reads nothing from a directory that exports nothing", () => {
        expect(readEntry(`${LIBRARY}/styles/themes`, "components", IMPORT)).toBeUndefined();
    });
});
