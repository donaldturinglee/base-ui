import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { Bubble } from "../bubble";
import { Message } from ".";
import type { MessageProps } from "./Message.types";

const message = (props: Partial<MessageProps> = {}) => (
    <Message {...props}>
        <Message.Avatar>
            <img src="ada.png" alt="Ada" />
        </Message.Avatar>
        <Message.Content>
            <Message.Header>Ada</Message.Header>
            <Bubble variant="muted">
                <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
            </Bubble>
            <Message.Footer>Sent 09:14</Message.Footer>
        </Message.Content>
    </Message>
);

const root = () => document.querySelector('[data-component="Message"]') as HTMLElement;

const group = () => document.querySelector('[data-component="Message.Group"]') as HTMLElement;

const avatar = () => document.querySelector('[data-component="Message.Avatar"]') as HTMLElement;

const content = () => document.querySelector('[data-component="Message.Content"]') as HTMLElement;

const header = () => document.querySelector('[data-component="Message.Header"]') as HTMLElement;

const footer = () => document.querySelector('[data-component="Message.Footer"]') as HTMLElement;

const bubble = () => document.querySelector('[data-component="Bubble"]') as HTMLElement;

describe("Message", () => {
    it("renders a plain box by default", () => {
        render(message());
        expect(root().tagName).toBe("DIV");
    });

    it("renders as whatever it is told to", () => {
        render(
            <Message as="article">
                <Message.Content>Thursday still works</Message.Content>
            </Message>,
        );
        expect(root().tagName).toBe("ARTICLE");
    });

    it("tags the message and its parts with data-component attributes", () => {
        render(<Message.Group>{message()}</Message.Group>);

        for (const name of [
            "Message.Group",
            "Message",
            "Message.Avatar",
            "Message.Content",
            "Message.Header",
            "Message.Footer",
        ]) {
            expect(document.querySelector(`[data-component="${name}"]`)).not.toBeNull();
        }
    });

    it("says which side it comes down, so a caller can style from it", () => {
        render(message({ align: "end" }));

        expect(root()).toHaveAttribute("data-align", "end");
        expect(root()).toHaveClass("message", "message-align-end");
    });

    it("comes down the leading side where it was told nothing", () => {
        render(message());

        expect(root()).toHaveAttribute("data-align", "start");
        expect(root()).toHaveClass("message-align-start");
    });

    describe("the side it comes down", () => {
        it("takes the side of the run it stands in", () => {
            render(<Message.Group align="end">{message()}</Message.Group>);

            expect(group()).toHaveAttribute("data-align", "end");
            expect(root()).toHaveAttribute("data-align", "end");
        });

        it("lets a message come down a side other than its run's", () => {
            render(<Message.Group align="end">{message({ align: "start" })}</Message.Group>);

            expect(root()).toHaveAttribute("data-align", "start");
        });

        it("stands a run at the start where it was told nothing", () => {
            render(<Message.Group>{message()}</Message.Group>);

            expect(group()).toHaveAttribute("data-align", "start");
        });
    });

    describe("what it hands down", () => {
        it("places a bubble inside it without the bubble being told the side", () => {
            render(message({ align: "end" }));

            expect(bubble()).toHaveAttribute("data-align", "end");
            expect(bubble()).toHaveClass("bubble-align-end");
        });

        it("hands the side down through a run of messages", () => {
            render(<Message.Group align="end">{message()}</Message.Group>);

            expect(bubble()).toHaveAttribute("data-align", "end");
        });

        it("leaves a bubble that named its own side alone", () => {
            render(
                <Message align="end">
                    <Message.Content>
                        <Bubble align="start">
                            <Bubble.Content>Thursday still works</Bubble.Content>
                        </Bubble>
                    </Message.Content>
                </Message>,
            );

            expect(bubble()).toHaveAttribute("data-align", "start");
        });

        it("lets a run of bubbles inside it override the message's side", () => {
            render(
                <Message align="end">
                    <Message.Content>
                        <Bubble.Group align="start">
                            <Bubble>
                                <Bubble.Content>Thursday still works</Bubble.Content>
                            </Bubble>
                        </Bubble.Group>
                    </Message.Content>
                </Message>,
            );

            expect(bubble()).toHaveAttribute("data-align", "start");
        });

        it("carries the side through to where the reactions gather", () => {
            render(
                <Message align="end">
                    <Message.Content>
                        <Bubble>
                            <Bubble.Content>Thursday still works</Bubble.Content>
                            <Bubble.Reactions>👍 3</Bubble.Reactions>
                        </Bubble>
                    </Message.Content>
                </Message>,
            );

            expect(document.querySelector('[data-component="Bubble.Reactions"]')).toHaveAttribute(
                "data-align",
                "end",
            );
        });
    });

    it("carries whoever said it, and what they said", () => {
        render(message());

        expect(avatar()).toContainElement(screen.getByAltText("Ada"));
        expect(header()).toHaveTextContent("Ada");
        expect(content()).toHaveTextContent("Are we still on for Thursday?");
        expect(footer()).toHaveTextContent("Sent 09:14");
    });

    it("keeps whatever else it was given, in the order it was written", () => {
        render(
            <Message>
                <Message.Content>
                    <span data-testid="extra">Edited</span>
                </Message.Content>
            </Message>,
        );

        expect(screen.getByTestId("extra")).toBeInTheDocument();
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(
            <Message ref={ref}>
                <Message.Content>Thursday still works</Message.Content>
            </Message>,
        );
        expect(ref.current).toBe(root());
    });

    it("forwards a ref to each part", () => {
        const groupRef = React.createRef<HTMLDivElement>();
        const avatarRef = React.createRef<HTMLDivElement>();
        const contentRef = React.createRef<HTMLDivElement>();
        const headerRef = React.createRef<HTMLDivElement>();
        const footerRef = React.createRef<HTMLDivElement>();

        render(
            <Message.Group ref={groupRef}>
                <Message>
                    <Message.Avatar ref={avatarRef} />
                    <Message.Content ref={contentRef}>
                        <Message.Header ref={headerRef}>Ada</Message.Header>
                        <Message.Footer ref={footerRef}>Sent</Message.Footer>
                    </Message.Content>
                </Message>
            </Message.Group>,
        );

        expect(groupRef.current).toBe(group());
        expect(avatarRef.current).toBe(avatar());
        expect(contentRef.current).toBe(content());
        expect(headerRef.current).toBe(header());
        expect(footerRef.current).toBe(footer());
    });

    it("merges a custom className onto each part", () => {
        render(
            <Message.Group className="run">
                <Message className="row">
                    <Message.Avatar className="who" />
                    <Message.Content className="said">
                        <Message.Header className="above">Ada</Message.Header>
                        <Message.Footer className="below">Sent</Message.Footer>
                    </Message.Content>
                </Message>
            </Message.Group>,
        );

        expect(group()).toHaveClass("run");
        expect(root()).toHaveClass("row");
        expect(avatar()).toHaveClass("who");
        expect(content()).toHaveClass("said");
        expect(header()).toHaveClass("above");
        expect(footer()).toHaveClass("below");
    });
});
