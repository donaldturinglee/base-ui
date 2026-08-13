import { describe, expect, it } from "vitest";
import { readTokens } from "./tokens";

const primitives = `@theme static {
  /* Base size scale */
  --base-size-4: 0.25rem;
  --base-size-8: 0.5rem; /** Half a step of the scale */
}

@utility duration-micro {
  --tw-duration: 100ms;
}
`;

const light = `/* The design tokens the light scheme is drawn from */
[data-theme="light"] {
    --foreground-color-default: #1f2328;
    --foreground-color-accent: var(
        --base-color-blue-5
    ); /** Accent text for links and interactive elements */
}
`;

const dark = `[data-theme="dark"] {
    --foreground-color-default: #e6edf3;
    --foreground-color-accent: #4493f8;
}
`;

const read = () =>
    readTokens([
        { scheme: "static", text: primitives },
        { scheme: "light", text: light },
        { scheme: "dark", text: dark },
    ]);

const token = (name: string) => {
    const found = read().find((one) => one.name === name);
    if (!found) {
        throw new Error(`${name} was not read`);
    }
    return found;
};

describe("readTokens", () => {
    it("reads a token and what it holds", () => {
        expect(token("--base-size-4").values).toEqual({ static: "0.25rem" });
    });

    it("answers a token with the value it holds under each scheme", () => {
        expect(token("--foreground-color-default").values).toEqual({
            light: "#1f2328",
            dark: "#e6edf3",
        });
    });

    it("groups a token under the heading it was written below", () => {
        expect(token("--base-size-4").group).toBe("Base size scale");
    });

    it("groups a token by the namespace of its name where there is no heading", () => {
        expect(token("--foreground-color-default").group).toBe("foreground");
    });

    it("reads what was said beside a token as what it is for", () => {
        expect(token("--base-size-8").description).toBe("Half a step of the scale");
    });

    it("reads a token broken over several lines as the one line it stands for", () => {
        expect(token("--foreground-color-accent").values.light).toBe("var(--base-color-blue-5)");
    });

    it("still reads what was said beside a token that was broken over several lines", () => {
        expect(token("--foreground-color-accent").description).toBe(
            "Accent text for links and interactive elements",
        );
    });

    it("does not read the heading above a block as anything a token said", () => {
        expect(token("--base-size-4").description).toBeUndefined();
        expect(token("--foreground-color-default").description).toBeUndefined();
    });

    it("leaves alone a custom property declared outside a block of tokens", () => {
        expect(read().map((one) => one.name)).not.toContain("--tw-duration");
    });

    it("reads the tokens out in the order they are named in", () => {
        expect(read().map((one) => one.name)).toEqual([
            "--base-size-4",
            "--base-size-8",
            "--foreground-color-accent",
            "--foreground-color-default",
        ]);
    });
});
