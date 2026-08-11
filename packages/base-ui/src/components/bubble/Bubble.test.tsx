import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { Bubble } from ".";
import type { BubbleProps } from "./Bubble.types";

const bubble = (props: Partial<BubbleProps> = {}) => (
    <Bubble {...props}>
        <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
    </Bubble>
);

const root = () => document.querySelector('[data-component="Bubble"]') as HTMLElement;

const group = () => document.querySelector('[data-component="Bubble.Group"]') as HTMLElement;

const content = () => document.querySelector('[data-component="Bubble.Content"]') as HTMLElement;

const reactions = () =>
    document.querySelector('[data-component="Bubble.Reactions"]') as HTMLElement;

describe("Bubble", () => {
    it("renders a plain box by default", () => {
        render(bubble());
        expect(root().tagName).toBe("DIV");
    });

    it("renders as whatever it is told to", () => {
        render(
            <Bubble as="article">
                <Bubble.Content>Thursday still works</Bubble.Content>
            </Bubble>,
        );
        expect(root().tagName).toBe("ARTICLE");
    });

    it("tags the bubble and its parts with data-component attributes", () => {
        render(
            <Bubble.Group>
                <Bubble>
                    <Bubble.Content>Thursday still works</Bubble.Content>
                    <Bubble.Reactions>👍 3</Bubble.Reactions>
                </Bubble>
            </Bubble.Group>,
        );

        for (const name of ["Bubble.Group", "Bubble", "Bubble.Content", "Bubble.Reactions"]) {
            expect(document.querySelector(`[data-component="${name}"]`)).not.toBeNull();
        }
    });

    it("says how it is drawn, so a caller can style from it", () => {
        render(bubble({ variant: "outline", align: "end" }));

        expect(root()).toHaveAttribute("data-variant", "outline");
        expect(root()).toHaveAttribute("data-align", "end");
        expect(root()).toHaveClass("bubble", "bubble-outline", "bubble-align-end");
    });

    it("is painted in the accent and stood at the start where it was told neither", () => {
        render(bubble());

        expect(root()).toHaveAttribute("data-variant", "default");
        expect(root()).toHaveAttribute("data-align", "start");
    });

    describe("the side it stands on", () => {
        it("takes the side of the run it stands in", () => {
            render(<Bubble.Group align="end">{bubble()}</Bubble.Group>);

            expect(group()).toHaveAttribute("data-align", "end");
            expect(root()).toHaveAttribute("data-align", "end");
        });

        it("lets a turn stand somewhere other than where its run stands", () => {
            render(<Bubble.Group align="end">{bubble({ align: "start" })}</Bubble.Group>);

            expect(root()).toHaveAttribute("data-align", "start");
        });

        it("stands a run at the start where it was told nothing", () => {
            render(<Bubble.Group>{bubble()}</Bubble.Group>);

            expect(group()).toHaveAttribute("data-align", "start");
            expect(root()).toHaveAttribute("data-align", "start");
        });
    });

    describe("the surface", () => {
        it("carries the words it was given", () => {
            render(bubble());
            expect(content()).toHaveTextContent("Are we still on for Thursday?");
        });

        it("renders as the thing that acts where the turn can be acted on", () => {
            render(
                <Bubble>
                    <Bubble.Content as="button" type="button">
                        Retry sending this
                    </Bubble.Content>
                </Bubble>,
            );

            expect(screen.getByRole("button", { name: "Retry sending this" })).toBe(content());
        });

        it("renders as a link where the turn leads somewhere", () => {
            render(
                <Bubble>
                    <Bubble.Content as="a" href="#thread">
                        Jump to the thread
                    </Bubble.Content>
                </Bubble>,
            );

            expect(screen.getByRole("link", { name: "Jump to the thread" })).toBe(content());
        });
    });

    describe("the reactions", () => {
        it("gathers at the corner the turn's own side points to", () => {
            render(
                <Bubble align="end">
                    <Bubble.Content>Thursday still works</Bubble.Content>
                    <Bubble.Reactions>👍 3</Bubble.Reactions>
                </Bubble>,
            );

            expect(reactions()).toHaveAttribute("data-align", "end");
            expect(reactions()).toHaveClass("bubble-reactions-align-end");
        });

        it("follows a turn standing at the start over to the start", () => {
            render(
                <Bubble>
                    <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
                    <Bubble.Reactions>👍 3</Bubble.Reactions>
                </Bubble>,
            );

            expect(reactions()).toHaveAttribute("data-align", "start");
            expect(reactions()).toHaveClass("bubble-reactions-align-start");
        });

        it("lets a caller name the corner themselves", () => {
            render(
                <Bubble align="end">
                    <Bubble.Content>Thursday still works</Bubble.Content>
                    <Bubble.Reactions align="start">👍 3</Bubble.Reactions>
                </Bubble>,
            );

            expect(reactions()).toHaveAttribute("data-align", "start");
        });

        it("gathers at the end where it stands outside a bubble altogether", () => {
            render(<Bubble.Reactions>👍 3</Bubble.Reactions>);
            expect(reactions()).toHaveAttribute("data-align", "end");
        });

        it("hangs below the bubble unless it is told otherwise", () => {
            render(
                <Bubble>
                    <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
                    <Bubble.Reactions>👍 3</Bubble.Reactions>
                </Bubble>,
            );

            expect(reactions()).toHaveAttribute("data-side", "bottom");
            expect(reactions()).toHaveClass("bubble-reactions-bottom");
        });

        it("hangs above it where it was told to", () => {
            render(
                <Bubble>
                    <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
                    <Bubble.Reactions side="top">👍 3</Bubble.Reactions>
                </Bubble>,
            );

            expect(reactions()).toHaveAttribute("data-side", "top");
            expect(reactions()).toHaveClass("bubble-reactions-top");
        });
    });

    it("keeps whatever else it was given, in the order it was written", () => {
        render(
            <Bubble>
                <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
                <span data-testid="timestamp">09:14</span>
            </Bubble>,
        );

        expect(screen.getByTestId("timestamp")).toBeInTheDocument();
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(
            <Bubble ref={ref}>
                <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
            </Bubble>,
        );
        expect(ref.current).toBe(root());
    });

    it("forwards a ref to each part", () => {
        const groupRef = React.createRef<HTMLDivElement>();
        const contentRef = React.createRef<HTMLDivElement>();
        const reactionsRef = React.createRef<HTMLDivElement>();

        render(
            <Bubble.Group ref={groupRef}>
                <Bubble>
                    <Bubble.Content ref={contentRef}>Thursday still works</Bubble.Content>
                    <Bubble.Reactions ref={reactionsRef}>👍 3</Bubble.Reactions>
                </Bubble>
            </Bubble.Group>,
        );

        expect(groupRef.current).toBe(group());
        expect(contentRef.current).toBe(content());
        expect(reactionsRef.current).toBe(reactions());
    });

    it("merges a custom className onto each part", () => {
        render(
            <Bubble.Group className="run">
                <Bubble className="turn">
                    <Bubble.Content className="surface">Thursday still works</Bubble.Content>
                    <Bubble.Reactions className="pill">👍 3</Bubble.Reactions>
                </Bubble>
            </Bubble.Group>,
        );

        expect(group()).toHaveClass("run");
        expect(root()).toHaveClass("turn");
        expect(content()).toHaveClass("surface");
        expect(reactions()).toHaveClass("pill");
    });
});
