import * as React from "react";
import { act, createEvent, fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { HoverCard } from ".";
import type { HoverCardProps } from "./HoverCard.types";

const originalResizeObserver = window.ResizeObserver;

const renderHoverCard = (props: Partial<HoverCardProps> = {}) =>
    render(
        <HoverCard openDelay={100} closeDelay={100} {...props}>
            <HoverCard.Trigger>
                <button type="button">monalisa</button>
            </HoverCard.Trigger>
            <HoverCard.Content>Mona Lisa Octocat</HoverCard.Content>
        </HoverCard>,
    );

const trigger = () => screen.getByRole("button", { name: "monalisa" });

const card = () => document.querySelector("[data-component='HoverCard']") as HTMLElement | null;

const isOpen = () => card() !== null;

// The wait is what the card is for, so the tests move the clock rather than the pointer
const wait = (milliseconds: number) =>
    act(() => {
        vi.advanceTimersByTime(milliseconds);
    });

const hoverTrigger = () => fireEvent.pointerEnter(trigger());

const leaveTrigger = () => fireEvent.pointerLeave(trigger());

// `fireEvent.focus` only dispatches the event; the card asks whether the trigger really holds
// focus, so the tests reach it the way a reader would
const focusTrigger = () => act(() => trigger().focus());

const blurTrigger = () => act(() => trigger().blur());

describe("HoverCard", () => {
    // jsdom has no ResizeObserver, and the card watches its own size so it can be placed again
    // as it grows
    beforeEach(() => {
        window.ResizeObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
        } as unknown as typeof ResizeObserver;

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        window.ResizeObserver = originalResizeObserver;
    });

    it("renders the trigger it is wrapped around and nothing else to begin with", () => {
        renderHoverCard();

        expect(trigger()).toBeInTheDocument();
        expect(isOpen()).toBe(false);
    });

    it("draws no wrapper around the trigger, so the card stands against the words themselves", () => {
        const { container } = renderHoverCard();

        // The trigger is the only thing rendered in place; the card goes to the portal
        expect(container.firstElementChild).toBe(trigger());
    });

    describe("opening on the pointer", () => {
        it("waits out the delay before opening", () => {
            renderHoverCard();

            hoverTrigger();
            expect(isOpen()).toBe(false);

            wait(99);
            expect(isOpen()).toBe(false);

            wait(1);
            expect(isOpen()).toBe(true);
        });

        it("does not open where the pointer moved on before the wait was out", () => {
            renderHoverCard();

            hoverTrigger();
            leaveTrigger();
            wait(500);

            expect(isOpen()).toBe(false);
        });

        it("closes once the pointer has been gone for the closing delay", () => {
            renderHoverCard();

            hoverTrigger();
            wait(100);
            expect(isOpen()).toBe(true);

            leaveTrigger();
            expect(isOpen()).toBe(true);

            wait(100);
            expect(isOpen()).toBe(false);
        });

        it("stays open while the pointer rests on the card itself", () => {
            renderHoverCard();

            hoverTrigger();
            wait(100);

            // The pointer crosses the gap from the trigger onto the card
            leaveTrigger();
            fireEvent.pointerEnter(card() as HTMLElement);
            wait(500);

            expect(isOpen()).toBe(true);
        });

        it("closes once the pointer has left the card as well", () => {
            renderHoverCard();

            hoverTrigger();
            wait(100);
            leaveTrigger();
            fireEvent.pointerEnter(card() as HTMLElement);
            fireEvent.pointerLeave(card() as HTMLElement);
            wait(100);

            expect(isOpen()).toBe(false);
        });

        it("leaves a touch alone, since a tap has no pointer to move off the card again", () => {
            renderHoverCard();

            // jsdom has no PointerEvent, so `pointerType` has to be put on the event by hand
            // rather than passed to `fireEvent` as part of its init
            const event = createEvent.pointerEnter(trigger());
            Object.defineProperty(event, "pointerType", { value: "touch" });
            fireEvent(trigger(), event);

            wait(500);

            expect(isOpen()).toBe(false);
        });
    });

    describe("opening on the keyboard", () => {
        it("opens at once rather than waiting out a delay meant for a pointer", () => {
            renderHoverCard();

            focusTrigger();
            expect(isOpen()).toBe(true);
        });

        it("closes when focus leaves the trigger", () => {
            renderHoverCard();

            focusTrigger();
            blurTrigger();
            expect(isOpen()).toBe(false);
        });

        it("stays open where focus is moving onto the card", () => {
            renderHoverCard();

            focusTrigger();

            // A click on a link inside the card pulls focus off the trigger; closing here would
            // take the card away before the click landed
            act(() => {
                fireEvent.blur(trigger(), { relatedTarget: card() });
            });

            expect(isOpen()).toBe(true);
        });
    });

    it("closes on Escape", () => {
        renderHoverCard();

        focusTrigger();
        expect(isOpen()).toBe(true);

        act(() => {
            fireEvent.keyDown(document, { key: "Escape" });
        });

        expect(isOpen()).toBe(false);
    });

    describe("what the trigger points at", () => {
        it("describes the trigger by the card while it stands open", () => {
            renderHoverCard();

            focusTrigger();
            expect(trigger().getAttribute("aria-describedby")).toBe(card()?.id);
        });

        it("points at nothing while the card is shut", () => {
            renderHoverCard();
            expect(trigger()).not.toHaveAttribute("aria-describedby");
        });

        it("is added to whatever already describes the trigger", () => {
            render(
                <HoverCard openDelay={100} closeDelay={100}>
                    <HoverCard.Trigger>
                        <button type="button" aria-describedby="elsewhere">
                            monalisa
                        </button>
                    </HoverCard.Trigger>
                    <HoverCard.Content>Mona Lisa Octocat</HoverCard.Content>
                </HoverCard>,
            );

            focusTrigger();
            expect(trigger().getAttribute("aria-describedby")).toBe(`elsewhere ${card()?.id}`);
        });
    });

    it("keeps the handlers the trigger came with", () => {
        const onPointerEnter = vi.fn();
        const onFocus = vi.fn();

        render(
            <HoverCard openDelay={100} closeDelay={100}>
                <HoverCard.Trigger>
                    <button type="button" onPointerEnter={onPointerEnter} onFocus={onFocus}>
                        monalisa
                    </button>
                </HoverCard.Trigger>
                <HoverCard.Content>Mona Lisa Octocat</HoverCard.Content>
            </HoverCard>,
        );

        hoverTrigger();
        expect(onPointerEnter).toHaveBeenCalledTimes(1);

        focusTrigger();
        expect(onFocus).toHaveBeenCalledTimes(1);
    });

    describe("disabled", () => {
        it("stays shut on the pointer", () => {
            renderHoverCard({ disabled: true });

            hoverTrigger();
            wait(500);
            expect(isOpen()).toBe(false);
        });

        it("stays shut on focus", () => {
            renderHoverCard({ disabled: true });

            focusTrigger();
            expect(isOpen()).toBe(false);
        });

        it("stays shut even where the caller is holding it open", () => {
            renderHoverCard({ disabled: true, open: true });
            expect(isOpen()).toBe(false);
        });
    });

    describe("where the caller keeps hold of the card", () => {
        it("stands open because it was told to rather than because of the pointer", () => {
            renderHoverCard({ open: true });
            expect(isOpen()).toBe(true);
        });

        it("stays shut on hover until the caller says otherwise", () => {
            const onOpenChange = vi.fn();
            renderHoverCard({ open: false, onOpenChange });

            hoverTrigger();
            wait(100);

            expect(isOpen()).toBe(false);
            expect(onOpenChange).toHaveBeenCalledWith(true);
        });

        it("reports the card opening and closing either way", () => {
            const onOpenChange = vi.fn();
            renderHoverCard({ onOpenChange });

            hoverTrigger();
            wait(100);
            expect(onOpenChange).toHaveBeenLastCalledWith(true);

            leaveTrigger();
            wait(100);
            expect(onOpenChange).toHaveBeenLastCalledWith(false);
        });
    });

    describe("where the card stands", () => {
        it("stands below the trigger and lines up with its start by default", () => {
            renderHoverCard({ open: true });

            expect(card()).toHaveAttribute("data-side", "outside-bottom");
            expect(card()).toHaveAttribute("data-align", "start");
        });

        it("stands where it is told to", () => {
            renderHoverCard({ open: true, side: "outside-right", align: "center" });

            expect(card()).toHaveAttribute("data-side", "outside-right");
            expect(card()).toHaveAttribute("data-align", "center");
        });

        it("records where it ended up rather than where it was asked to go", () => {
            // Everything jsdom measures is zero, so there is no room above the trigger and the
            // card is turned over to the other side of it
            renderHoverCard({ open: true, side: "outside-top" });

            expect(card()).toHaveAttribute("data-side", "outside-bottom");
        });

        it("is laid out against the viewport from where it was placed", () => {
            renderHoverCard({ open: true });

            expect(card()?.style.getPropertyValue("--hover-card-top")).toMatch(/px$/);
            expect(card()?.style.getPropertyValue("--hover-card-left")).toMatch(/px$/);
        });
    });

    it("renders the card away from the trigger, so nothing on the page can clip it", () => {
        const { container } = renderHoverCard({ open: true });

        expect(container).not.toContainElement(card());
        expect(document.body).toContainElement(card());
    });

    it("draws the content it is given", () => {
        renderHoverCard({ open: true });

        const content = screen.getByText("Mona Lisa Octocat");
        expect(content).toHaveAttribute("data-component", "HoverCard.Content");
        expect(card()).toContainElement(content);
    });

    it("merges a custom className onto the card", () => {
        renderHoverCard({ open: true, className: "custom" });
        expect(card()).toHaveClass("hover-card", "custom");
    });

    it("merges a custom className onto the content", () => {
        render(
            <HoverCard open>
                <HoverCard.Trigger>
                    <button type="button">monalisa</button>
                </HoverCard.Trigger>
                <HoverCard.Content className="custom-content">Mona Lisa Octocat</HoverCard.Content>
            </HoverCard>,
        );

        expect(screen.getByText("Mona Lisa Octocat")).toHaveClass(
            "hover-card-content",
            "custom-content",
        );
    });
});
