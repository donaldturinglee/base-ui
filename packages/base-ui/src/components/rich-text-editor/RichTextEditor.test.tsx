import * as React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, jest } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { $createParagraphNode, $createTextNode, $getRoot } from "lexical";
import { RichTextEditor } from ".";
import type { RichTextEditorProps } from "./RichTextEditor.types";
import type { LexicalEditor } from "lexical";

const LABEL = "Description";

// Lexical builds the editor and commits what it has built on the next tick, so every render
// lets that land before the test reads the editor back
const settle = async () => {
    await act(async () => {});
};

const renderEditor = async (ui: React.ReactElement) => {
    const result = render(ui);
    await settle();

    return result;
};

const renderDefault = (props: Partial<RichTextEditorProps> = {}) =>
    renderEditor(
        <RichTextEditor {...props} aria-label={LABEL} data-testid="editor">
            <RichTextEditor.Toolbar />
            <RichTextEditor.Content />
        </RichTextEditor>,
    );

// The starting state is handed the editor it is laying the writing into, which is the one way
// to reach the editor from outside without a plugin of the caller's own
const seed =
    (text: string) =>
    (editor: LexicalEditor): void => {
        void editor;
        const paragraph = $createParagraphNode();
        paragraph.append($createTextNode(text));
        $getRoot().append(paragraph);
    };

const root = () => screen.getByTestId("editor");

const content = () => screen.getByRole("textbox", { name: LABEL });

const control = (name: string) => screen.getByRole("button", { name });

describe("RichTextEditor", () => {
    it("renders a frame tagged as a RichTextEditor", async () => {
        await renderDefault();

        expect(root()).toHaveAttribute("data-component", "RichTextEditor");
        expect(root()).toHaveClass("rich-text-editor");
    });

    it("renders a writing area named by the editor around it", async () => {
        await renderDefault();

        expect(content()).toHaveAttribute("contenteditable", "true");
        expect(content()).toHaveAttribute("data-component", "RichTextEditor.Content");
    });

    it("describes the writing area with the caption the editor was given", async () => {
        await renderEditor(
            <RichTextEditor aria-label={LABEL} aria-describedby="caption" data-testid="editor">
                <RichTextEditor.Content />
            </RichTextEditor>,
        );
        expect(content()).toHaveAttribute("aria-describedby", "caption");
    });

    it("lays in the writing it is given to start with", async () => {
        await renderDefault({ defaultValue: seed("Already written") });
        expect(content()).toHaveTextContent("Already written");
    });

    describe("the placeholder", () => {
        it("stands in the writing's place while nothing has been written", async () => {
            await renderDefault({ placeholder: "Write something" });

            expect(screen.getByText("Write something")).toHaveClass("rich-text-editor-placeholder");
            expect(content()).toHaveAttribute("aria-placeholder", "Write something");
        });

        it("is not there where the editor was given none", async () => {
            await renderDefault();
            expect(content()).not.toHaveAttribute("aria-placeholder");
        });
    });

    describe("the toolbar", () => {
        it("is one stop on the way round the page", async () => {
            await renderDefault();

            const toolbar = screen.getByRole("toolbar", { name: "Formatting" });
            expect(toolbar).toHaveAttribute("aria-orientation", "horizontal");
        });

        it("takes a name of its own", async () => {
            await renderEditor(
                <RichTextEditor aria-label={LABEL}>
                    <RichTextEditor.Toolbar aria-label="Description formatting" />
                </RichTextEditor>,
            );
            expect(screen.getByRole("toolbar", { name: "Description formatting" })).toBeVisible();
        });

        it("draws every run of controls by default", async () => {
            await renderDefault();

            for (const name of ["Undo", "Redo", "Bold", "Italic", "Heading 1", "Quote", "Link"]) {
                expect(control(name)).toBeInTheDocument();
            }
        });

        it("draws only the runs it is told to", async () => {
            await renderEditor(
                <RichTextEditor aria-label={LABEL}>
                    <RichTextEditor.Toolbar controls={["inline"]} />
                </RichTextEditor>,
            );

            expect(control("Bold")).toBeInTheDocument();
            expect(screen.queryByRole("button", { name: "Undo" })).toBeNull();
            expect(screen.queryByRole("button", { name: "Heading 1" })).toBeNull();
        });

        it("parts one run of controls from the next", async () => {
            await renderDefault();

            const dividers = root().querySelectorAll(
                "[data-component='RichTextEditor.ToolbarDivider']",
            );
            // One fewer than there are runs, since the first has nothing before it
            expect(dividers).toHaveLength(4);
        });

        it("says of each control whether it is the one in force", async () => {
            await renderDefault();

            expect(control("Bold")).toHaveAttribute("aria-pressed", "false");
            expect(control("Heading 1")).toHaveAttribute("aria-pressed", "false");
            expect(control("Bulleted list")).toHaveAttribute("aria-pressed", "false");
        });

        it("has nothing to undo or redo until something has been written", async () => {
            await renderDefault();

            expect(control("Undo")).toBeDisabled();
            expect(control("Redo")).toBeDisabled();
        });

        it("draws controls of the caller's own after its own", async () => {
            await renderEditor(
                <RichTextEditor aria-label={LABEL}>
                    <RichTextEditor.Toolbar controls={["inline"]}>
                        <button type="button">Mention</button>
                    </RichTextEditor.Toolbar>
                </RichTextEditor>,
            );
            expect(control("Mention")).toBeInTheDocument();
        });
    });

    describe("the link control", () => {
        it("asks where the link should point before making one", async () => {
            await renderDefault();
            expect(screen.queryByRole("textbox", { name: "Link address" })).toBeNull();

            fireEvent.click(control("Link"));
            expect(screen.getByRole("textbox", { name: "Link address" })).toBeVisible();
        });

        it("puts the field away again once the address has been applied", async () => {
            await renderDefault();

            fireEvent.click(control("Link"));
            fireEvent.change(screen.getByRole("textbox", { name: "Link address" }), {
                target: { value: "https://example.com" },
            });
            fireEvent.click(control("Apply"));
            await settle();

            expect(screen.queryByRole("textbox", { name: "Link address" })).toBeNull();
        });

        it("puts the field away when it is dismissed", async () => {
            await renderDefault();

            fireEvent.click(control("Link"));
            fireEvent.keyDown(screen.getByRole("textbox", { name: "Link address" }), {
                key: "Escape",
            });
            await settle();

            expect(screen.queryByRole("textbox", { name: "Link address" })).toBeNull();
        });
    });

    describe("read only", () => {
        it("leaves the writing to be read but not changed", async () => {
            await renderDefault({ readOnly: true, defaultValue: seed("Already written") });

            expect(content()).toHaveAttribute("contenteditable", "false");
            expect(content()).toHaveTextContent("Already written");
            expect(root()).toHaveAttribute("data-read-only", "true");
            expect(root()).toHaveClass("rich-text-editor-read-only");
        });

        it("takes the toolbar's controls out of use", async () => {
            await renderDefault({ readOnly: true });

            expect(control("Bold")).toBeDisabled();
            expect(control("Heading 1")).toBeDisabled();
        });

        it("gives the writing back once it can be changed again", async () => {
            const { rerender } = await renderDefault({ readOnly: true });
            expect(content()).toHaveAttribute("contenteditable", "false");

            rerender(
                <RichTextEditor aria-label={LABEL} data-testid="editor">
                    <RichTextEditor.Toolbar />
                    <RichTextEditor.Content />
                </RichTextEditor>,
            );
            await settle();

            expect(content()).toHaveAttribute("contenteditable", "true");
        });
    });

    describe("reading what has been written", () => {
        it("reports the state the editor has moved to", async () => {
            const onChange = jest.fn();
            let editor: LexicalEditor | null = null;

            await renderDefault({
                onChange,
                defaultValue: (instance: LexicalEditor) => {
                    editor = instance;
                    $getRoot().append($createParagraphNode());
                },
            });

            onChange.mockClear();

            await act(async () => {
                // Lexical batches an update and commits it on the next tick; a discrete one is
                // committed where it stands, which is what lets the test read it back
                (editor as unknown as LexicalEditor).update(
                    () => {
                        const paragraph = $createParagraphNode();
                        paragraph.append($createTextNode("Written later"));
                        $getRoot().append(paragraph);
                    },
                    { discrete: true },
                );
            });

            expect(onChange).toHaveBeenCalled();
            expect(content()).toHaveTextContent("Written later");
        });
    });

    it("draws what is written in the design system's own classes", async () => {
        await renderDefault({ defaultValue: seed("Already written") });

        expect(content().querySelector(".rich-text-editor-paragraph")).not.toBeNull();
    });

    it("holds the writing area to the height it is given", async () => {
        await renderDefault({ minHeight: 120, maxHeight: 320 });

        const scroll = root().querySelector<HTMLElement>(
            "[data-component='RichTextEditor.Scroll']",
        );
        expect(scroll).toHaveStyle({ minHeight: "120px", maxHeight: "320px" });
    });

    it("forwards a ref to the frame", async () => {
        const ref = React.createRef<HTMLDivElement>();
        await renderEditor(
            <RichTextEditor ref={ref} aria-label={LABEL} data-testid="editor">
                <RichTextEditor.Content />
            </RichTextEditor>,
        );
        expect(ref.current).toBe(root());
    });

    it("merges a custom className onto the frame", async () => {
        await renderDefault({ className: "custom" });
        expect(root()).toHaveClass("custom");
    });

    it("forwards element specific props to the frame", async () => {
        await renderDefault({ id: "description-editor" });
        expect(root()).toHaveAttribute("id", "description-editor");
    });
});
