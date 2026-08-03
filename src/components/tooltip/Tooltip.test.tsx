import * as React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { Tooltip } from ".";
import { getAnchoredPosition } from "./anchoredPosition";
import type { TooltipProps } from "./Tooltip.types";

const renderTooltip = (props: Partial<TooltipProps> = {}) =>
    render(
        <Tooltip text="Tooltip text" {...props}>
            <button type="button">Trigger</button>
        </Tooltip>,
    );

const tooltip = () => screen.getByText("Tooltip text");

const trigger = () => screen.getByRole("button");

// `fireEvent.focus` only dispatches the event; the tooltip asks whether the trigger really
// holds focus, so the tests reach it the way a reader would
const focusTrigger = () => act(() => trigger().focus());

const blurTrigger = () => act(() => trigger().blur());

describe("Tooltip", () => {
    it("renders the text it is given beside the trigger", () => {
        renderTooltip();
        expect(tooltip()).toBeInTheDocument();
        expect(trigger()).toBeInTheDocument();
    });

    it("tags the tooltip with a data-component attribute", () => {
        renderTooltip();
        expect(tooltip()).toHaveAttribute("data-component", "Tooltip");
    });

    it("makes the tooltip a popover, so it stands above everything else on the page", () => {
        renderTooltip();
        // Manual, so that closing it neither hands focus back to the trigger nor closes
        // anything else standing open beside it
        expect(tooltip()).toHaveAttribute("popover", "manual");
    });

    it("stands to the south by default", () => {
        renderTooltip();
        expect(tooltip()).toHaveAttribute("data-direction", "s");
    });

    it("stands where it is told to", () => {
        renderTooltip({ direction: "nw" });
        expect(tooltip()).toHaveAttribute("data-direction", "nw");
    });

    it("describes the trigger by default", () => {
        renderTooltip();
        expect(tooltip()).toHaveAttribute("role", "tooltip");
        expect(trigger().getAttribute("aria-describedby")).toBe(tooltip().id);
    });

    it("names the trigger where it is a label", () => {
        renderTooltip({ type: "label" });
        expect(trigger()).toHaveAttribute("aria-labelledby", tooltip().id);
        // A label is the trigger's own name, so it is not a tooltip in its own right
        expect(tooltip()).not.toHaveAttribute("role");
    });

    it("keeps itself out of the accessibility tree either way", () => {
        const { rerender } = renderTooltip();
        expect(tooltip()).toHaveAttribute("aria-hidden", "true");

        rerender(
            <Tooltip text="Tooltip text" type="label">
                <button type="button">Trigger</button>
            </Tooltip>,
        );
        expect(tooltip()).toHaveAttribute("aria-hidden", "true");
    });

    it("adds itself to whatever already describes the trigger", () => {
        render(
            <>
                <span id="hint">An existing description</span>
                <Tooltip text="Tooltip text">
                    <button type="button" aria-describedby="hint">
                        Trigger
                    </button>
                </Tooltip>
            </>,
        );

        const describedBy = trigger().getAttribute("aria-describedby")?.split(" ") ?? [];
        expect(describedBy).toHaveLength(2);
        expect(describedBy).toContain("hint");
        expect(describedBy).toContain(tooltip().id);
    });

    it("takes an id of the caller's own", () => {
        renderTooltip({ id: "custom-tooltip" });
        expect(tooltip()).toHaveAttribute("id", "custom-tooltip");
        expect(trigger()).toHaveAttribute("aria-describedby", "custom-tooltip");
    });

    it("refuses a trigger a reader cannot reach", () => {
        // A tooltip only ever appears on hover or focus, so an unreachable trigger leaves
        // it unreadable
        expect(() =>
            render(
                <Tooltip text="Tooltip text">
                    <span>Not interactive</span>
                </Tooltip>,
            ),
        ).toThrow(/interactive content/);
    });

    it("accepts a trigger whose content is interactive", () => {
        expect(() =>
            render(
                <Tooltip text="Tooltip text">
                    <span>
                        <button type="button">Trigger</button>
                    </span>
                </Tooltip>,
            ),
        ).not.toThrow();
    });

    it("accepts a trigger interactive two levels down", () => {
        expect(() =>
            render(
                <Tooltip text="Tooltip text">
                    <span>
                        <span>
                            <button type="button">Trigger</button>
                        </span>
                    </span>
                </Tooltip>,
            ),
        ).not.toThrow();
    });

    it("forwards a ref to the trigger", () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(
            <Tooltip text="Tooltip text" ref={ref}>
                <button type="button">Trigger</button>
            </Tooltip>,
        );
        expect(ref.current).toBe(trigger());
    });

    it("shows itself for a browser's own open state and for the polyfilled one alike", () => {
        renderTooltip();

        // The polyfill marks an open popover with a class rather than the pseudo-class,
        // and rewrites only the selectors it is asked for, not the stylesheet
        expect(tooltip()).toHaveClass("tooltip-open");
        expect(tooltip()).toHaveClass("tooltip-open-polyfilled");
    });

    it("merges a custom className onto the tooltip", () => {
        renderTooltip({ className: "custom" });
        expect(tooltip()).toHaveClass("custom");
    });
});

describe("Tooltip opening and closing", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    // jsdom has no popover API of its own, so the polyfill the tooltip applies is what
    // opens and closes it here. The polyfill marks an open popover with a class of that
    // name, which is the state these tests read
    const isOpen = () => tooltip().classList.contains(":popover-open");

    it("waits for the pointer to settle before showing itself", () => {
        renderTooltip();

        fireEvent.mouseOver(trigger());
        expect(isOpen()).toBe(false);

        act(() => {
            jest.advanceTimersByTime(50);
        });
        expect(isOpen()).toBe(true);
    });

    it("waits longer where it is asked to", () => {
        renderTooltip({ delay: "long" });

        fireEvent.mouseOver(trigger());

        act(() => {
            jest.advanceTimersByTime(400);
        });
        expect(isOpen()).toBe(false);

        act(() => {
            jest.advanceTimersByTime(800);
        });
        expect(isOpen()).toBe(true);
    });

    it("never shows itself where the pointer only passed through", () => {
        renderTooltip({ delay: "medium" });

        fireEvent.mouseOver(trigger());
        fireEvent.mouseLeave(trigger());

        act(() => {
            jest.advanceTimersByTime(400);
        });
        expect(isOpen()).toBe(false);
    });

    it("hides itself once the pointer leaves", () => {
        renderTooltip();

        fireEvent.mouseOver(trigger());
        act(() => {
            jest.advanceTimersByTime(50);
        });
        expect(isOpen()).toBe(true);

        fireEvent.mouseLeave(trigger());
        expect(isOpen()).toBe(false);
    });

    it("shows itself as soon as the trigger is reached by keyboard", () => {
        renderTooltip();

        focusTrigger();
        expect(isOpen()).toBe(true);
    });

    it("hides itself once the trigger loses focus", () => {
        renderTooltip();

        focusTrigger();
        blurTrigger();

        expect(isOpen()).toBe(false);
    });

    it("stays open while the pointer rests on the tooltip itself", () => {
        renderTooltip();

        fireEvent.mouseEnter(tooltip());
        expect(isOpen()).toBe(true);
    });

    it("closes again on a tap, leaving press and hold to read it", () => {
        renderTooltip();

        focusTrigger();
        fireEvent.touchEnd(trigger());

        act(() => {
            jest.advanceTimersByTime(10);
        });
        expect(isOpen()).toBe(false);
    });

    it("closes on Escape once it is open", () => {
        renderTooltip();

        focusTrigger();
        expect(isOpen()).toBe(true);

        // Fired on the trigger rather than on the document, the way a real key press
        // reaches whatever holds focus before it bubbles
        fireEvent.keyDown(trigger(), { key: "Escape" });
        expect(isOpen()).toBe(false);
    });

    it("still calls the trigger's own handlers", () => {
        const onFocus = jest.fn();
        const onBlur = jest.fn();
        const onMouseLeave = jest.fn();

        render(
            <Tooltip text="Tooltip text">
                <button type="button" onFocus={onFocus} onBlur={onBlur} onMouseLeave={onMouseLeave}>
                    Trigger
                </button>
            </Tooltip>,
        );

        focusTrigger();
        blurTrigger();
        fireEvent.mouseLeave(trigger());

        expect(onFocus).toHaveBeenCalledTimes(1);
        expect(onBlur).toHaveBeenCalledTimes(1);
        expect(onMouseLeave).toHaveBeenCalledTimes(1);
    });
});

describe("getAnchoredPosition", () => {
    const { innerWidth, innerHeight } = window;

    // jsdom measures everything as zero, so the rectangles are stated outright
    const elementWith = (rect: Partial<DOMRect>) => {
        const element = document.createElement("div");

        element.getBoundingClientRect = () =>
            ({
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: 0,
                height: 0,
                ...rect,
            }) as DOMRect;

        return element;
    };

    beforeEach(() => {
        window.innerWidth = 1000;
        window.innerHeight = 1000;
    });

    afterEach(() => {
        window.innerWidth = innerWidth;
        window.innerHeight = innerHeight;
    });

    const anchor = () =>
        elementWith({ top: 500, bottom: 520, left: 500, right: 600, width: 100, height: 20 });

    const floating = () => elementWith({ width: 200, height: 40 });

    it("stands the floating element clear of the anchor", () => {
        const position = getAnchoredPosition(floating(), anchor(), {
            side: "outside-bottom",
            align: "center",
        });

        expect(position.top).toBe(524);
        expect(position.left).toBe(450);
        expect(position.anchorSide).toBe("outside-bottom");
        expect(position.anchorAlign).toBe("center");
    });

    it("lines it up with either end of the anchor", () => {
        const start = getAnchoredPosition(floating(), anchor(), {
            side: "outside-bottom",
            align: "start",
        });
        expect(start.left).toBe(500);

        const end = getAnchoredPosition(floating(), anchor(), {
            side: "outside-bottom",
            align: "end",
        });
        expect(end.left).toBe(400);
    });

    it("stands it beside the anchor", () => {
        const position = getAnchoredPosition(floating(), anchor(), {
            side: "outside-right",
            align: "center",
        });

        expect(position.left).toBe(604);
        expect(position.top).toBe(490);
    });

    it("turns it round where there is no room on the side it was sent to", () => {
        const highAnchor = elementWith({
            top: 10,
            bottom: 30,
            left: 500,
            right: 600,
            width: 100,
            height: 20,
        });

        const position = getAnchoredPosition(floating(), highAnchor, {
            side: "outside-top",
            align: "center",
        });

        expect(position.anchorSide).toBe("outside-bottom");
        expect(position.top).toBe(34);
    });

    it("leaves it where it was sent when neither side has room", () => {
        window.innerHeight = 50;

        const position = getAnchoredPosition(floating(), anchor(), {
            side: "outside-top",
            align: "center",
        });

        expect(position.anchorSide).toBe("outside-top");
    });

    it("slides it along where one end would run off the page", () => {
        const edgeAnchor = elementWith({
            top: 500,
            bottom: 520,
            left: 0,
            right: 40,
            width: 40,
            height: 20,
        });

        const position = getAnchoredPosition(floating(), edgeAnchor, {
            side: "outside-bottom",
            align: "center",
        });

        expect(position.anchorAlign).toBe("start");
        expect(position.left).toBe(0);
    });

    it("holds it inside the page whatever else it has done", () => {
        window.innerWidth = 100;

        const position = getAnchoredPosition(floating(), anchor(), {
            side: "outside-bottom",
            align: "center",
        });

        expect(position.left).toBeGreaterThanOrEqual(-100);
        expect(position.left).toBeLessThanOrEqual(0);
    });
});
