import * as React from "react";
import { act } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { CodeBlock } from ".";

type Tokenise = (
    code: string,
    options: { lang: string; themes: { light: string; dark: string } },
) => Promise<{ tokens: { content: string; htmlStyle?: Record<string, string> }[][] }>;

// Reading a grammar over a listing means fetching that grammar and the themes it is coloured
// under, which is shiki's work rather than the component's. This stands in for it, so what is
// tested here is what the component does with the runs it is handed. The stand-in is raised
// with the mock itself, since Vitest lifts the mock above everything the file declares
const { mockCodeToTokens } = vi.hoisted(() => ({ mockCodeToTokens: vi.fn<Tokenise>() }));

vi.mock("shiki", () => ({
    codeToTokens: (...args: Parameters<Tokenise>) => mockCodeToTokens(...args),
}));

// One run to a line, carrying the colour each of the two themes gave it
const tokenise: Tokenise = async (code) => ({
    tokens: code.split("\n").map((line) =>
        line.length > 0
            ? [
                  {
                      content: line,
                      htmlStyle: { "--shiki-light": "#005cc5", "--shiki-dark": "#79b8ff" },
                  },
              ]
            : [],
    ),
});

const originalResizeObserver = window.ResizeObserver;

let resize: (entries: ResizeObserverEntry[]) => void;

// Only the four dimensions the overflow hook reads are needed, so this stands in for a
// real entry
const entryWith = (dimensions: { scrollWidth?: number; clientWidth?: number }) =>
    ({
        target: {
            scrollHeight: 0,
            clientHeight: 0,
            scrollWidth: 0,
            clientWidth: 0,
            ...dimensions,
        },
    }) as unknown as ResizeObserverEntry;

const code = () => screen.getByTestId("code");

describe("CodeBlock", () => {
    beforeEach(() => {
        mockCodeToTokens.mockImplementation(tokenise);

        // jsdom has no ResizeObserver, and the content watches its own size to say whether
        // there is anything to scroll to
        window.ResizeObserver = class {
            constructor(callback: ResizeObserverCallback) {
                resize = (entries) => callback(entries, this as unknown as ResizeObserver);
            }
            observe() {}
            unobserve() {}
            disconnect() {}
        } as unknown as typeof ResizeObserver;
    });

    afterEach(() => {
        mockCodeToTokens.mockReset();
        window.ResizeObserver = originalResizeObserver;
    });

    it("renders a div element by default", () => {
        render(<CodeBlock data-testid="block" />);
        expect(screen.getByTestId("block").tagName).toBe("DIV");
    });

    it("renders as the element passed to the as prop", () => {
        render(<CodeBlock as="figure" data-testid="block" />);
        expect(screen.getByTestId("block").tagName).toBe("FIGURE");
    });

    it("does not forward the as prop to the element", () => {
        render(<CodeBlock as="figure" data-testid="block" />);
        expect(screen.getByTestId("block")).not.toHaveAttribute("as");
    });

    it("tags the root element with a data-component attribute", () => {
        render(<CodeBlock data-testid="block" />);
        expect(screen.getByTestId("block")).toHaveAttribute("data-component", "CodeBlock");
    });

    it("names the grammar it was given on the root element", () => {
        render(<CodeBlock language="tsx" data-testid="block" />);
        expect(screen.getByTestId("block")).toHaveAttribute("data-language", "tsx");
    });

    it("reads a listing as plain text when no grammar was named", () => {
        render(<CodeBlock data-testid="block" />);
        expect(screen.getByTestId("block")).toHaveAttribute("data-language", "text");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(<CodeBlock ref={ref} data-testid="block" />);
        expect(ref.current).toBe(screen.getByTestId("block"));
    });

    it("merges a custom className onto the root element", () => {
        render(<CodeBlock className="custom" data-testid="block" />);
        expect(screen.getByTestId("block")).toHaveClass("code-block", "custom");
    });

    it("numbers the lines when asked to", () => {
        render(<CodeBlock showLineNumbers data-testid="block" />);
        expect(screen.getByTestId("block")).toHaveClass("code-block-numbered");
    });

    it("leaves the lines unnumbered by default", () => {
        render(<CodeBlock data-testid="block" />);
        expect(screen.getByTestId("block")).not.toHaveClass("code-block-numbered");
    });

    it("wraps the lines when asked to", () => {
        render(<CodeBlock wrap="wrap" data-testid="block" />);
        expect(screen.getByTestId("block")).toHaveClass("code-block-wrap");
    });

    it("keeps the lines at the length they were written when asked to", () => {
        render(<CodeBlock wrap="nowrap" data-testid="block" />);
        expect(screen.getByTestId("block")).toHaveClass("code-block-nowrap");
    });

    it("leaves a long line to be scrolled to by default", () => {
        render(<CodeBlock data-testid="block" />);
        expect(screen.getByTestId("block")).toHaveClass("code-block-nowrap");
        expect(screen.getByTestId("block")).not.toHaveClass("code-block-wrap");
    });

    it("does not forward the wrap prop to the element", () => {
        render(<CodeBlock wrap="wrap" data-testid="block" />);
        expect(screen.getByTestId("block")).not.toHaveAttribute("wrap");
    });

    describe("Header", () => {
        it("renders a header holding a title", () => {
            render(
                <CodeBlock>
                    <CodeBlock.Header data-testid="header">
                        <CodeBlock.Title>Button.tsx</CodeBlock.Title>
                    </CodeBlock.Header>
                </CodeBlock>,
            );
            expect(screen.getByTestId("header")).toHaveAttribute(
                "data-component",
                "CodeBlock.Header",
            );
            expect(screen.getByText("Button.tsx")).toHaveAttribute(
                "data-component",
                "CodeBlock.Title",
            );
        });

        it("renders the title as the element passed to its as prop", () => {
            render(
                <CodeBlock>
                    <CodeBlock.Header>
                        <CodeBlock.Title as="h3">Button.tsx</CodeBlock.Title>
                    </CodeBlock.Header>
                </CodeBlock>,
            );
            expect(
                screen.getByRole("heading", { level: 3, name: "Button.tsx" }),
            ).toBeInTheDocument();
        });
    });

    describe("Content", () => {
        it("stays out of the tab order until the listing overflows", () => {
            render(
                <CodeBlock>
                    <CodeBlock.Content data-testid="content" />
                </CodeBlock>,
            );
            expect(screen.getByTestId("content")).not.toHaveAttribute("tabindex");
        });

        it("becomes reachable by the keyboard once the listing overflows", () => {
            render(
                <CodeBlock>
                    <CodeBlock.Content data-testid="content" />
                </CodeBlock>,
            );

            act(() => {
                resize([entryWith({ scrollWidth: 500, clientWidth: 100 })]);
            });

            expect(screen.getByTestId("content")).toHaveAttribute("tabindex", "0");
        });

        it("tags the content with a data-component attribute", () => {
            render(
                <CodeBlock>
                    <CodeBlock.Content data-testid="content" />
                </CodeBlock>,
            );
            expect(screen.getByTestId("content")).toHaveAttribute(
                "data-component",
                "CodeBlock.Content",
            );
        });
    });

    describe("Code", () => {
        it("renders a pre element holding a code element", async () => {
            render(
                <CodeBlock>
                    <CodeBlock.Code data-testid="code">const answer = 42;</CodeBlock.Code>
                </CodeBlock>,
            );

            await waitFor(() => expect(code()).toHaveAttribute("data-highlighted", "true"));
            expect(code().tagName).toBe("PRE");
            expect(code().firstElementChild?.tagName).toBe("CODE");
        });

        it("draws the listing as it was written before the grammar has been read", () => {
            mockCodeToTokens.mockReturnValue(new Promise(() => {}));

            render(
                <CodeBlock language="tsx">
                    <CodeBlock.Code data-testid="code">const answer = 42;</CodeBlock.Code>
                </CodeBlock>,
            );

            expect(code()).toHaveAttribute("data-highlighted", "false");
            expect(screen.getByText("const answer = 42;")).toBeInTheDocument();
        });

        it("colours the runs once the grammar has been read", async () => {
            render(
                <CodeBlock language="tsx">
                    <CodeBlock.Code data-testid="code">const answer = 42;</CodeBlock.Code>
                </CodeBlock>,
            );

            await waitFor(() => expect(code()).toHaveAttribute("data-highlighted", "true"));
            expect(screen.getByText("const answer = 42;")).toHaveStyle({
                "--shiki-light": "#005cc5",
                "--shiki-dark": "#79b8ff",
            });
        });

        it("reads the listing under the grammar and the themes the block named", async () => {
            render(
                <CodeBlock language="tsx" lightTheme="min-light" darkTheme="min-dark">
                    <CodeBlock.Code data-testid="code">const answer = 42;</CodeBlock.Code>
                </CodeBlock>,
            );

            await waitFor(() => expect(code()).toHaveAttribute("data-highlighted", "true"));
            expect(mockCodeToTokens).toHaveBeenCalledWith(
                "const answer = 42;",
                expect.objectContaining({
                    lang: "tsx",
                    themes: { light: "min-light", dark: "min-dark" },
                }),
            );
        });

        it("lets a listing name a grammar of its own", async () => {
            render(
                <CodeBlock language="tsx">
                    <CodeBlock.Code language="json" data-testid="code">
                        {"{}"}
                    </CodeBlock.Code>
                </CodeBlock>,
            );

            await waitFor(() => expect(code()).toHaveAttribute("data-language", "json"));
            expect(mockCodeToTokens).toHaveBeenCalledWith(
                "{}",
                expect.objectContaining({
                    lang: "json",
                }),
            );
        });

        it("keeps the line breaks and the blank lines of the listing", async () => {
            render(
                <CodeBlock>
                    <CodeBlock.Code data-testid="code">{"first\n\nthird"}</CodeBlock.Code>
                </CodeBlock>,
            );

            await waitFor(() => expect(code()).toHaveAttribute("data-highlighted", "true"));
            expect(code()).toHaveTextContent("first");
            expect(code()).toHaveTextContent("third");
            expect(code().querySelectorAll(".code-block-line")).toHaveLength(3);
        });

        it("drops the newline a listing written as a template literal ends on", async () => {
            render(
                <CodeBlock>
                    <CodeBlock.Code data-testid="code">{"first\nsecond\n"}</CodeBlock.Code>
                </CodeBlock>,
            );

            await waitFor(() => expect(code()).toHaveAttribute("data-highlighted", "true"));
            expect(code().querySelectorAll(".code-block-line")).toHaveLength(2);
        });

        it("leaves the listing as it was written when the grammar cannot be read", async () => {
            mockCodeToTokens.mockRejectedValue(new Error("Language `wat` is not included"));

            render(
                <CodeBlock>
                    <CodeBlock.Code data-testid="code">const answer = 42;</CodeBlock.Code>
                </CodeBlock>,
            );

            await waitFor(() => expect(code()).toHaveAttribute("data-highlighted", "true"));
            expect(screen.getByText("const answer = 42;")).toBeInTheDocument();
            expect(screen.getByText("const answer = 42;")).not.toHaveAttribute("style");
        });

        it("forwards a ref to the pre element", async () => {
            const ref = React.createRef<HTMLPreElement>();
            render(
                <CodeBlock>
                    <CodeBlock.Code ref={ref} data-testid="code">
                        const answer = 42;
                    </CodeBlock.Code>
                </CodeBlock>,
            );

            await waitFor(() => expect(code()).toHaveAttribute("data-highlighted", "true"));
            expect(ref.current).toBe(code());
        });

        it("merges a custom className onto the pre element", async () => {
            render(
                <CodeBlock>
                    <CodeBlock.Code className="custom" data-testid="code">
                        const answer = 42;
                    </CodeBlock.Code>
                </CodeBlock>,
            );

            await waitFor(() => expect(code()).toHaveAttribute("data-highlighted", "true"));
            expect(code()).toHaveClass("code-block-pre", "custom");
        });
    });
});
