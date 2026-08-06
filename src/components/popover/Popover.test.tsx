import * as React from "react";
import { createEvent, fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, jest } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { Popover } from ".";
import type { PopoverCaret } from "./Popover.types";

const carets: PopoverCaret[] = [
    "top",
    "bottom",
    "left",
    "right",
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right",
    "left-top",
    "left-bottom",
    "right-top",
    "right-bottom",
];

const popover = () => document.querySelector("[data-component='Popover']");

const content = () => document.querySelector("[data-component='Popover.Content']");

const pressEscape = () => {
    const event = createEvent.keyDown(document, { key: "Escape" });
    fireEvent(document, event);

    return event;
};

describe("Popover", () => {
    it("renders the popover and the surface it holds", () => {
        render(
            <Popover>
                <Popover.Content>Message about popovers</Popover.Content>
            </Popover>,
        );

        expect(popover()).toBeInTheDocument();
        expect(popover()).toContainElement(content() as HTMLElement);
        expect(screen.getByText("Message about popovers")).toBe(content());
    });

    it("renders both as a div, and as whatever else it is asked for", () => {
        const { rerender } = render(
            <Popover>
                <Popover.Content />
            </Popover>,
        );

        expect(popover()?.tagName).toBe("DIV");
        expect(content()?.tagName).toBe("DIV");

        rerender(
            <Popover as="section">
                <Popover.Content as="article" />
            </Popover>,
        );

        expect(popover()?.tagName).toBe("SECTION");
        expect(content()?.tagName).toBe("ARTICLE");
    });

    describe("whether it is shown", () => {
        it("stands shut until it is opened, since what opens it is somewhere it cannot see", () => {
            render(<Popover />);

            expect(popover()).toHaveClass("popover");
            expect(popover()).not.toHaveClass("popover-open");
            expect(popover()).not.toHaveAttribute("data-open");
        });

        it("stands open where it is told to", () => {
            render(<Popover open />);

            expect(popover()).toHaveClass("popover-open");
            expect(popover()).toHaveAttribute("data-open", "");
        });

        it("stands in the flow where it is told to rather than against an ancestor", () => {
            render(<Popover relative />);

            expect(popover()).toHaveClass("popover-relative");
            expect(popover()).toHaveAttribute("data-relative", "");
        });
    });

    describe("where the caret stands", () => {
        it("points up from the middle unless it is told otherwise", () => {
            render(
                <Popover>
                    <Popover.Content />
                </Popover>,
            );

            expect(popover()).toHaveAttribute("data-caret", "top");
            expect(content()).toHaveClass("popover-content-caret-top");
        });

        for (const caret of carets) {
            it(`stands ${caret} where it is asked to`, () => {
                render(
                    <Popover caret={caret}>
                        <Popover.Content />
                    </Popover>,
                );

                expect(popover()).toHaveAttribute("data-caret", caret);
                expect(content()).toHaveAttribute("data-caret", caret);
                expect(content()).toHaveClass(`popover-content-caret-${caret}`);
            });
        }
    });

    describe("how large the surface stands", () => {
        it("takes a step of the width scale and as much height as it needs by default", () => {
            render(
                <Popover>
                    <Popover.Content />
                </Popover>,
            );

            expect(content()).toHaveClass(
                "popover-content-width-small",
                "popover-content-height-fit-content",
            );
            expect(content()).toHaveAttribute("data-width", "small");
            expect(content()).toHaveAttribute("data-height", "fit-content");
        });

        it("stands at whatever width and height it is given", () => {
            render(
                <Popover>
                    <Popover.Content width="large" height="medium" />
                </Popover>,
            );

            expect(content()).toHaveClass(
                "popover-content-width-large",
                "popover-content-height-medium",
            );
        });

        it("overflows by default, since anything that clips takes the caret with it", () => {
            render(
                <Popover>
                    <Popover.Content />
                </Popover>,
            );

            expect(content()).toHaveClass("popover-content-overflow-visible");
            expect(content()).toHaveAttribute("data-overflow", "visible");
        });

        it("clips where it has been asked to", () => {
            render(
                <Popover>
                    <Popover.Content overflow="auto" />
                </Popover>,
            );

            expect(content()).toHaveClass("popover-content-overflow-auto");
        });
    });

    describe("dismissing it with Escape", () => {
        it("reports the press while the popover is open", () => {
            const onEscape = jest.fn();

            render(
                <Popover open>
                    <Popover.Content onEscape={onEscape} />
                </Popover>,
            );

            pressEscape();

            expect(onEscape).toHaveBeenCalledTimes(1);
        });

        it("says nothing while the popover is shut, there being nothing on screen to dismiss", () => {
            const onEscape = jest.fn();

            render(
                <Popover open={false}>
                    <Popover.Content onEscape={onEscape} />
                </Popover>,
            );

            pressEscape();

            expect(onEscape).not.toHaveBeenCalled();
        });

        it("takes the press, so a layer it was opened over does not answer it as well", () => {
            render(
                <Popover open>
                    <Popover.Content onEscape={jest.fn()} />
                </Popover>,
            );

            expect(pressEscape().defaultPrevented).toBe(true);
        });

        it("leaves the press alone where it has nothing to say about it", () => {
            render(
                <Popover open>
                    <Popover.Content />
                </Popover>,
            );

            expect(pressEscape().defaultPrevented).toBe(false);
        });
    });

    describe("dismissing it with a press outside", () => {
        it("reports a press that landed anywhere else", () => {
            const onClickOutside = jest.fn();

            render(
                <Popover open>
                    <Popover.Content onClickOutside={onClickOutside} />
                </Popover>,
            );

            fireEvent.mouseDown(document.body);

            expect(onClickOutside).toHaveBeenCalledTimes(1);
        });

        it("says nothing about a press that landed on the surface itself", () => {
            const onClickOutside = jest.fn();

            render(
                <Popover open>
                    <Popover.Content onClickOutside={onClickOutside}>
                        <button type="button">Got it!</button>
                    </Popover.Content>
                </Popover>,
            );

            fireEvent.mouseDown(screen.getByRole("button", { name: "Got it!" }));

            expect(onClickOutside).not.toHaveBeenCalled();
        });

        it("says nothing about a press on whatever the popover was opened from", () => {
            const onClickOutside = jest.fn();

            const Example = () => {
                const buttonRef = React.useRef<HTMLButtonElement>(null);

                return (
                    <>
                        <button type="button" ref={buttonRef}>
                            Toggle popover
                        </button>
                        <Popover open>
                            <Popover.Content
                                onClickOutside={onClickOutside}
                                ignoreClickRefs={[buttonRef]}
                            />
                        </Popover>
                    </>
                );
            };

            render(<Example />);

            fireEvent.mouseDown(screen.getByRole("button", { name: "Toggle popover" }));

            expect(onClickOutside).not.toHaveBeenCalled();
        });

        it("says nothing while the popover is shut", () => {
            const onClickOutside = jest.fn();

            render(
                <Popover open={false}>
                    <Popover.Content onClickOutside={onClickOutside} />
                </Popover>,
            );

            fireEvent.mouseDown(document.body);

            expect(onClickOutside).not.toHaveBeenCalled();
        });

        it("leaves an auxiliary button alone, since it is not reaching for anything", () => {
            const onClickOutside = jest.fn();

            render(
                <Popover open>
                    <Popover.Content onClickOutside={onClickOutside} />
                </Popover>,
            );

            fireEvent.mouseDown(document.body, { button: 2 });

            expect(onClickOutside).not.toHaveBeenCalled();
        });

        it("reports a touch that landed anywhere else", () => {
            const onClickOutside = jest.fn();

            render(
                <Popover open>
                    <Popover.Content onClickOutside={onClickOutside} />
                </Popover>,
            );

            fireEvent.touchStart(document.body);

            expect(onClickOutside).toHaveBeenCalledTimes(1);
        });
    });

    it("merges a custom className onto the popover and onto the surface", () => {
        render(
            <Popover className="custom">
                <Popover.Content className="custom-content" />
            </Popover>,
        );

        expect(popover()).toHaveClass("popover", "custom");
        expect(content()).toHaveClass("popover-content", "custom-content");
    });

    it("hands the ref it is given the element itself", () => {
        const popoverRef = React.createRef<HTMLDivElement>();
        const contentRef = React.createRef<HTMLDivElement>();

        render(
            <Popover ref={popoverRef}>
                <Popover.Content ref={contentRef} />
            </Popover>,
        );

        expect(popoverRef.current).toBe(popover());
        expect(contentRef.current).toBe(content());
    });
});
