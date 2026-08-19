import * as React from "react";
import { act, render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Markdown, MARKDOWN_TRANSFORMERS } from ".";
import type { MarkdownProps } from "./Markdown.types";

// Lexical draws what it has read on the next tick where it was not asked to do it at once, so
// every render lets that land before the test reads the prose back
const settle = async () => {
    await act(async () => {});
};

const renderMarkdown = async (source: string, props: Partial<MarkdownProps> = {}) => {
    const result = render(
        <Markdown {...props} data-testid="markdown">
            {source}
        </Markdown>,
    );
    await settle();

    return result;
};

const prose = () => screen.getByTestId("markdown");

describe("Markdown", () => {
    it("renders one element tagged as a Markdown", async () => {
        await renderMarkdown("Plain prose");

        expect(prose()).toHaveAttribute("data-component", "Markdown");
        expect(prose()).toHaveClass("markdown");
    });

    it("reads the markdown into the prose it stands for", async () => {
        await renderMarkdown("Plain prose");

        expect(prose().querySelector("p.markdown-paragraph")).toHaveTextContent("Plain prose");
    });

    it("leaves nothing to be written in", async () => {
        await renderMarkdown("Plain prose");

        expect(prose()).not.toHaveAttribute("contenteditable");
        expect(screen.queryByRole("textbox")).toBeNull();
    });

    describe("the syntax it reads", () => {
        it("reads headings, at each of the levels markdown has", async () => {
            await renderMarkdown(
                "# One\n\n## Two\n\n### Three\n\n#### Four\n\n##### Five\n\n###### Six",
            );

            for (const [level, words] of [
                [1, "One"],
                [2, "Two"],
                [3, "Three"],
                [4, "Four"],
                [5, "Five"],
                [6, "Six"],
            ] as const) {
                const heading = prose().querySelector(`h${level}`);
                expect(heading).toHaveTextContent(words);
                expect(heading).toHaveClass(`markdown-heading-${level}`);
            }
        });

        it("reads the marks laid over a run of words", async () => {
            await renderMarkdown("**bold** and *italic* and ~~struck~~ and ==picked out==");

            expect(prose().querySelector(".markdown-bold")).toHaveTextContent("bold");
            expect(prose().querySelector(".markdown-italic")).toHaveTextContent("italic");
            expect(prose().querySelector(".markdown-strikethrough")).toHaveTextContent("struck");
            expect(prose().querySelector(".markdown-highlight")).toHaveTextContent("picked out");
        });

        it("reads a name written in code inside a line of prose", async () => {
            await renderMarkdown("Call `render` first");

            expect(prose().querySelector(".markdown-code-inline")).toHaveTextContent("render");
        });

        it("reads a fenced listing as the preformatted run it is", async () => {
            await renderMarkdown("```\nconst a = 1;\n```");

            const block = prose().querySelector("code.markdown-code-block");
            expect(block).toHaveTextContent("const a = 1;");
        });

        it("reads a quote", async () => {
            await renderMarkdown("> Said elsewhere");

            expect(prose().querySelector("blockquote.markdown-quote")).toHaveTextContent(
                "Said elsewhere",
            );
        });

        it("reads a bulleted list", async () => {
            await renderMarkdown("- First\n- Second");

            const list = prose().querySelector("ul.markdown-list-bullet");
            expect(list?.querySelectorAll("li")).toHaveLength(2);
        });

        it("reads a numbered list", async () => {
            await renderMarkdown("1. First\n2. Second");

            const list = prose().querySelector("ol.markdown-list-number");
            expect(list?.querySelectorAll("li")).toHaveLength(2);
        });

        it("reads a task list, and says of each task whether it is done", async () => {
            await renderMarkdown("- [x] Done\n- [ ] Not done");

            const tasks = prose().querySelectorAll("[role='checkbox']");
            expect(tasks).toHaveLength(2);
            expect(tasks[0]).toHaveAttribute("aria-checked", "true");
            expect(tasks[1]).toHaveAttribute("aria-checked", "false");
        });

        it("leaves a task out of the tab order, since there is nothing there to tick", async () => {
            await renderMarkdown("- [ ] Not done");

            expect(prose().querySelector("[role='checkbox']")).toHaveAttribute("tabindex", "-1");
        });

        it("reads a link", async () => {
            await renderMarkdown("[Example](https://example.com)");

            const link = prose().querySelector("a.markdown-link");
            expect(link).toHaveAttribute("href", "https://example.com");
            expect(link).toHaveTextContent("Example");
        });

        it("joins the lines of a paragraph the way markdown does", async () => {
            await renderMarkdown("One line\nand the next");

            expect(prose().querySelectorAll("p")).toHaveLength(1);
        });

        it("keeps every line break where it is asked to", async () => {
            await renderMarkdown("One line\nand the next", { preserveNewLines: true });

            expect(prose().querySelectorAll("p")).toHaveLength(2);
        });

        it("reads only the syntax it is told to", async () => {
            // With nothing but the marks left in, a heading is read as the words it was written
            // with rather than as a heading
            await renderMarkdown("# Not a heading", { transformers: [] });

            expect(prose().querySelector("h1")).toBeNull();
            expect(prose()).toHaveTextContent("# Not a heading");
        });
    });

    describe("when the markdown changes", () => {
        it("reads it again", async () => {
            const { rerender } = await renderMarkdown("# First");
            expect(prose().querySelector("h1")).toHaveTextContent("First");

            rerender(<Markdown data-testid="markdown">## Second</Markdown>);
            await settle();

            expect(prose().querySelector("h1")).toBeNull();
            expect(prose().querySelector("h2")).toHaveTextContent("Second");
        });

        it("leaves nothing of the last reading behind", async () => {
            const { rerender } = await renderMarkdown("- One\n- Two");
            expect(prose().querySelectorAll("li")).toHaveLength(2);

            rerender(<Markdown data-testid="markdown">Plain prose</Markdown>);
            await settle();

            expect(prose().querySelectorAll("li")).toHaveLength(0);
            expect(prose()).toHaveTextContent("Plain prose");
        });
    });

    it("draws nothing where it was given nothing", async () => {
        await renderMarkdown("");
        expect(prose()).toHaveTextContent("");
    });

    it("reads every kind of syntax it knows by default", async () => {
        expect(MARKDOWN_TRANSFORMERS.length).toBeGreaterThan(0);
    });

    it("forwards a ref to the prose", async () => {
        const ref = React.createRef<HTMLDivElement>();
        render(
            <Markdown ref={ref} data-testid="markdown">
                Plain prose
            </Markdown>,
        );
        await settle();

        expect(ref.current).toBe(prose());
    });

    it("merges a custom className onto the prose", async () => {
        await renderMarkdown("Plain prose", { className: "custom" });
        expect(prose()).toHaveClass("custom");
    });

    it("forwards element specific props to the prose", async () => {
        await renderMarkdown("Plain prose", { id: "release-notes" });
        expect(prose()).toHaveAttribute("id", "release-notes");
    });
});
