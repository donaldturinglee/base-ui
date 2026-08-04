import { codeToTokens } from "shiki";
import type { CodeBlockLanguage, CodeBlockLine, CodeBlockTheme } from "./CodeBlock.types";

// Plain text, for a listing whose grammar the caller did not name. Shiki reads it without
// fetching a grammar for it, so a listing that is only meant to be read as it was written
// costs nothing more than one that is
export const DEFAULT_LANGUAGE = "text";

// The themes the runs take their colour from when the caller names none
export const DEFAULT_LIGHT_THEME = "github-light";
export const DEFAULT_DARK_THEME = "github-dark";

type HighlightOptions = {
    language: CodeBlockLanguage;
    lightTheme: CodeBlockTheme;
    darkTheme: CodeBlockTheme;
};

// The listing as it was written, one line to a run and no colour on any of it. This is what
// stands in the moment before the grammar has been read, and what is left standing if it
// never arrives. An empty line holds no run at all, since there would be nothing in it
export const toPlainLines = (code: string): CodeBlockLine[] =>
    code.split("\n").map((line) => (line.length > 0 ? [{ content: line }] : []));

// The listing broken into the runs the grammar found in it, each carrying the colour both
// themes gave it. Neither theme is made the default one, so a run comes back with a custom
// property for each rather than a colour one of the two schemes would have to undo, and the
// stylesheet is left to pick between them
export const highlightLines = async (
    code: string,
    options: HighlightOptions,
): Promise<CodeBlockLine[]> => {
    const { tokens } = await codeToTokens(code, {
        lang: options.language,
        themes: { light: options.lightTheme, dark: options.darkTheme },
        defaultColor: false,
    });

    return tokens.map((line) =>
        line.map((token) => ({ content: token.content, style: token.htmlStyle })),
    );
};
