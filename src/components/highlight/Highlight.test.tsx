import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { Highlight, splitHighlightChunks } from ".";

const highlight = () => screen.getByTestId("highlight");

const marks = () => Array.from(highlight().querySelectorAll("[data-component='Mark']"));

const markedText = () => marks().map((mark) => mark.textContent);

describe("Highlight", () => {
    it("renders a span element by default", () => {
        render(<Highlight data-testid="highlight">Pull request</Highlight>);
        expect(highlight().tagName).toBe("SPAN");
    });

    it("renders the provided text content", () => {
        render(
            <Highlight data-testid="highlight" match="request">
                Pull request
            </Highlight>,
        );
        expect(highlight()).toHaveTextContent("Pull request");
    });

    it("renders as the element passed to the as prop", () => {
        render(
            <Highlight as="p" data-testid="highlight">
                Pull request
            </Highlight>,
        );
        expect(highlight().tagName).toBe("P");
    });

    it("forwards element specific props to the element passed to the as prop", () => {
        render(
            <Highlight as="time" dateTime="2026-08-03" data-testid="highlight">
                Pull request
            </Highlight>,
        );
        expect(highlight()).toHaveAttribute("datetime", "2026-08-03");
    });

    it("tags the root element with a data-component attribute", () => {
        render(<Highlight data-testid="highlight">Pull request</Highlight>);
        expect(highlight()).toHaveAttribute("data-component", "Highlight");
    });

    it("picks the matched run out with a mark", () => {
        render(
            <Highlight data-testid="highlight" match="request">
                Pull request
            </Highlight>,
        );
        expect(markedText()).toEqual(["request"]);
    });

    it("leaves the text alone when no match is provided", () => {
        render(<Highlight data-testid="highlight">Pull request</Highlight>);
        expect(marks()).toHaveLength(0);
        expect(highlight()).toHaveTextContent("Pull request");
    });

    it("leaves the text alone when the match is nowhere in it", () => {
        render(
            <Highlight data-testid="highlight" match="issue">
                Pull request
            </Highlight>,
        );
        expect(marks()).toHaveLength(0);
    });

    it("picks out every occurrence of the match", () => {
        render(
            <Highlight data-testid="highlight" match="re">
                Rebase and retry
            </Highlight>,
        );
        expect(markedText()).toEqual(["Re", "re"]);
    });

    it("keeps the case the text was written in", () => {
        render(
            <Highlight data-testid="highlight" match="pull">
                Pull request
            </Highlight>,
        );
        expect(markedText()).toEqual(["Pull"]);
    });

    it("only matches on case when caseSensitive is set", () => {
        render(
            <Highlight data-testid="highlight" match="pull" caseSensitive>
                Pull request
            </Highlight>,
        );
        expect(marks()).toHaveLength(0);
    });

    it("picks out each of several matches", () => {
        render(
            <Highlight data-testid="highlight" match={["pull", "request"]}>
                Pull request
            </Highlight>,
        );
        expect(markedText()).toEqual(["Pull", "request"]);
    });

    it("passes over an empty match", () => {
        render(
            <Highlight data-testid="highlight" match="">
                Pull request
            </Highlight>,
        );
        expect(marks()).toHaveLength(0);
    });

    it("draws the marks in the variant it was given", () => {
        render(
            <Highlight data-testid="highlight" match="request" variant="success">
                Pull request
            </Highlight>,
        );
        expect(highlight()).toHaveAttribute("data-variant", "success");
        expect(marks()[0]).toHaveClass("mark-success");
    });

    it("falls back to the attention variant when none is provided", () => {
        render(
            <Highlight data-testid="highlight" match="request">
                Pull request
            </Highlight>,
        );
        expect(highlight()).toHaveAttribute("data-variant", "attention");
        expect(marks()[0]).toHaveClass("mark-attention");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLElement>();
        render(
            <Highlight ref={ref} data-testid="highlight">
                Pull request
            </Highlight>,
        );
        expect(ref.current).toBe(highlight());
    });

    it("merges a custom className onto the root element", () => {
        render(
            <Highlight className="custom" data-testid="highlight">
                Pull request
            </Highlight>,
        );
        expect(highlight()).toHaveClass("custom");
    });
});

describe("splitHighlightChunks", () => {
    it("returns nothing for empty text", () => {
        expect(splitHighlightChunks("", "re")).toEqual([]);
    });

    it("returns the text whole where no term was given", () => {
        expect(splitHighlightChunks("Pull request")).toEqual([
            { text: "Pull request", matched: false },
        ]);
    });

    it("returns the runs in the order they are read", () => {
        expect(splitHighlightChunks("Pull request", "req")).toEqual([
            { text: "Pull ", matched: false },
            { text: "req", matched: true },
            { text: "uest", matched: false },
        ]);
    });

    it("picks the longer of two terms that start in the same place", () => {
        expect(splitHighlightChunks("renderer", ["re", "render"])).toEqual([
            { text: "render", matched: true },
            { text: "er", matched: false },
        ]);
    });

    it("draws two terms that meet as one run", () => {
        expect(splitHighlightChunks("pullrequest", ["pull", "request"])).toEqual([
            { text: "pullrequest", matched: true },
        ]);
    });

    it("matches on case alone when asked to", () => {
        expect(splitHighlightChunks("Pull Pull", "Pull", true)).toEqual([
            { text: "Pull", matched: true },
            { text: " ", matched: false },
            { text: "Pull", matched: true },
        ]);
    });
});
