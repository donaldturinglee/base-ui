import * as React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { AnchoredOverlay } from ".";
import type { AnchoredOverlayProps } from "./AnchoredOverlay.types";

const originalResizeObserver = window.ResizeObserver;

const noop = () => {};

const defaultProps: AnchoredOverlayProps = {
    open: true,
    onClose: noop,
    renderAnchor: (anchorProps) => (
        <button type="button" {...anchorProps}>
            Anchor
        </button>
    ),
};

const anchoredOverlay = (props: Partial<AnchoredOverlayProps> = {}) => {
    const { children, ...rest } = props;

    return (
        <AnchoredOverlay {...({ ...defaultProps, ...rest } as AnchoredOverlayProps)}>
            {children ?? <button type="button">Focusable child</button>}
        </AnchoredOverlay>
    );
};

const renderAnchoredOverlay = (props: Partial<AnchoredOverlayProps> = {}) =>
    render(anchoredOverlay(props));

const anchor = () => screen.getByRole("button", { name: "Anchor" });

const overlay = () =>
    document.querySelector("[data-component='AnchoredOverlay']") as HTMLElement | null;

describe("AnchoredOverlay", () => {
    // jsdom has no ResizeObserver, and the overlay watches its own size so it can be placed
    // again as it grows
    beforeEach(() => {
        window.ResizeObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
        } as unknown as typeof ResizeObserver;
    });

    afterEach(() => {
        window.ResizeObserver = originalResizeObserver;
    });

    it("renders the anchor it is given", () => {
        renderAnchoredOverlay({ open: false });
        expect(anchor()).toBeInTheDocument();
    });

    it("renders nothing but the anchor while it is closed", () => {
        renderAnchoredOverlay({ open: false });
        expect(overlay()).not.toBeInTheDocument();
    });

    it("renders the overlay outside the tree it was written in", () => {
        const { container } = renderAnchoredOverlay();

        expect(document.body).toContainElement(overlay());
        expect(container).not.toContainElement(overlay());
    });

    it("tags the overlay with a data-component attribute", () => {
        renderAnchoredOverlay();
        expect(overlay()).toHaveAttribute("data-component", "AnchoredOverlay");
    });

    it("says that the anchor opens something, and whether it is open", () => {
        const { rerender } = renderAnchoredOverlay({ open: false });

        expect(anchor()).toHaveAttribute("aria-haspopup", "true");
        expect(anchor()).toHaveAttribute("aria-expanded", "false");

        rerender(anchoredOverlay());
        expect(anchor()).toHaveAttribute("aria-expanded", "true");
    });

    it("names the anchor itself, or takes a name of the caller's own", () => {
        const { rerender } = renderAnchoredOverlay({ open: false });
        expect(anchor()).toHaveAttribute("id");

        rerender(anchoredOverlay({ open: false, anchorId: "my-custom-anchor-id" }));
        expect(anchor()).toHaveAttribute("id", "my-custom-anchor-id");
    });

    it("opens when the anchor is clicked", () => {
        const onOpen = vi.fn();
        const onClose = vi.fn();
        renderAnchoredOverlay({ open: false, onOpen, onClose });

        fireEvent.click(anchor());

        expect(onOpen).toHaveBeenCalledTimes(1);
        expect(onOpen).toHaveBeenCalledWith("anchor-click");
        expect(onClose).not.toHaveBeenCalled();
    });

    it("closes when the anchor is clicked again", () => {
        const onOpen = vi.fn();
        const onClose = vi.fn();
        renderAnchoredOverlay({ onOpen, onClose });

        fireEvent.click(anchor());

        expect(onClose).toHaveBeenCalledTimes(1);
        expect(onClose).toHaveBeenCalledWith("anchor-click");
        expect(onOpen).not.toHaveBeenCalled();
    });

    it.each(["ArrowDown", "ArrowUp", " ", "Enter"])("opens on the %s key", (key) => {
        const onOpen = vi.fn();
        renderAnchoredOverlay({ open: false, onOpen });

        fireEvent.keyDown(anchor(), { key });

        expect(onOpen).toHaveBeenCalledTimes(1);
        expect(onOpen).toHaveBeenCalledWith("anchor-key-press", expect.anything());
    });

    it("leaves every other key alone", () => {
        const onOpen = vi.fn();
        renderAnchoredOverlay({ open: false, onOpen });

        fireEvent.keyDown(anchor(), { key: "a" });

        expect(onOpen).not.toHaveBeenCalled();
    });

    it("closes on Escape", () => {
        const onClose = vi.fn();
        renderAnchoredOverlay({ onClose });

        fireEvent.keyDown(document, { key: "Escape" });

        expect(onClose).toHaveBeenCalledTimes(1);
        expect(onClose).toHaveBeenCalledWith("escape");
    });

    it("stays open on Escape while it is closed", () => {
        const onClose = vi.fn();
        renderAnchoredOverlay({ open: false, onClose });

        fireEvent.keyDown(document, { key: "Escape" });

        expect(onClose).not.toHaveBeenCalled();
    });

    it("closes when a press lands anywhere else", () => {
        const onClose = vi.fn();
        renderAnchoredOverlay({ onClose });

        fireEvent.mouseDown(document.body);

        expect(onClose).toHaveBeenCalledTimes(1);
        expect(onClose).toHaveBeenCalledWith("click-outside");
    });

    it("leaves a press inside the overlay alone", () => {
        const onClose = vi.fn();
        renderAnchoredOverlay({ onClose });

        fireEvent.mouseDown(screen.getByRole("button", { name: "Focusable child" }));

        expect(onClose).not.toHaveBeenCalled();
    });

    it("leaves a press on the anchor to the anchor", () => {
        const onClose = vi.fn();
        renderAnchoredOverlay({ onClose });

        fireEvent.mouseDown(anchor());

        expect(onClose).not.toHaveBeenCalled();
    });

    it("stands below the anchor by default", () => {
        renderAnchoredOverlay();

        expect(overlay()).toHaveAttribute("data-side", "outside-bottom");
        expect(overlay()).toHaveAttribute("data-align", "start");
        // Everything jsdom measures is zero, so the overlay stands the default offset below
        // the top left corner
        expect(overlay()?.style.getPropertyValue("--anchored-overlay-top")).toBe("4px");
        expect(overlay()?.style.getPropertyValue("--anchored-overlay-left")).toBe("0px");
    });

    it("stands where it is told to", () => {
        renderAnchoredOverlay({ side: "outside-right" });

        expect(overlay()).toHaveAttribute("data-side", "outside-right");
        expect(overlay()?.style.getPropertyValue("--anchored-overlay-top")).toBe("0px");
        expect(overlay()?.style.getPropertyValue("--anchored-overlay-left")).toBe("4px");
    });

    it("stands as far clear of the anchor as it is asked to", () => {
        renderAnchoredOverlay({ anchorOffset: 20 });
        expect(overlay()?.style.getPropertyValue("--anchored-overlay-top")).toBe("20px");
    });

    it("moves along the edge it lines up against as it is asked to", () => {
        renderAnchoredOverlay({ alignmentOffset: 20 });
        expect(overlay()?.style.getPropertyValue("--anchored-overlay-left")).toBe("20px");
    });

    it("reports where it ended up", () => {
        const onPositionChange = vi.fn();
        renderAnchoredOverlay({ onPositionChange });

        expect(onPositionChange).toHaveBeenCalledWith({
            position: {
                top: 4,
                left: 0,
                anchorSide: "outside-bottom",
                anchorAlign: "start",
            },
        });
    });

    it("only shows itself once it has been placed", () => {
        renderAnchoredOverlay();
        expect(overlay()).toHaveAttribute("data-visibility", "visible");
    });

    it("transitions nothing, so it appears where it belongs rather than travelling there", () => {
        // The overlay is measured as it opens, so its coordinates always change once. A
        // transition would carry it into place from the corner it was first rendered in
        renderAnchoredOverlay();
        expect(overlay()).toHaveClass("anchored-overlay");
    });

    it("tags the width and height it was given", () => {
        renderAnchoredOverlay({ width: "large", height: "small" });

        expect(overlay()).toHaveAttribute("data-width", "large");
        expect(overlay()).toHaveAttribute("data-height", "small");
    });

    it("tags the variant it was given for each viewport", () => {
        renderAnchoredOverlay({ variant: { regular: "anchored", narrow: "fullscreen" } });

        expect(overlay()).toHaveAttribute("data-variant-regular", "anchored");
        expect(overlay()).toHaveAttribute("data-variant-narrow", "fullscreen");
    });

    it("moves focus into the overlay as it opens, and back to the anchor as it closes", () => {
        const { rerender } = renderAnchoredOverlay({ open: false });

        act(() => {
            anchor().focus();
        });

        rerender(anchoredOverlay());
        expect(screen.getByRole("button", { name: "Focusable child" })).toHaveFocus();

        rerender(anchoredOverlay({ open: false }));
        expect(anchor()).toHaveFocus();
    });

    it("hands focus to whatever the caller asks for instead", () => {
        const Harness = () => {
            const initialFocusRef = React.useRef<HTMLButtonElement>(null);

            return (
                <AnchoredOverlay
                    open
                    onClose={noop}
                    focusTrapSettings={{ initialFocusRef }}
                    renderAnchor={(anchorProps) => (
                        <button type="button" {...anchorProps}>
                            Anchor
                        </button>
                    )}
                >
                    <button type="button">First</button>
                    <button type="button" ref={initialFocusRef}>
                        Second
                    </button>
                </AnchoredOverlay>
            );
        };

        render(<Harness />);

        expect(screen.getByRole("button", { name: "Second" })).toHaveFocus();
    });

    it("leaves focus where it is where the trap is turned off", () => {
        renderAnchoredOverlay({ focusTrapSettings: { disabled: true } });
        expect(screen.getByRole("button", { name: "Focusable child" })).not.toHaveFocus();
    });

    it("spreads the overlay props it is given onto the overlay", () => {
        renderAnchoredOverlay({
            overlayProps: { role: "dialog", "aria-label": "Merge details" },
        });

        expect(screen.getByRole("dialog", { name: "Merge details" })).toBe(overlay());
    });

    it("hands the overlay to a ref passed through the overlay props", () => {
        const ref = React.createRef<HTMLDivElement>();

        renderAnchoredOverlay({ overlayProps: { ref } });

        expect(ref.current).toBeInstanceOf(HTMLDivElement);
        expect(ref.current).toHaveAttribute("data-component", "AnchoredOverlay");
    });

    it("renders no close button unless a narrow viewport is given the whole screen", () => {
        renderAnchoredOverlay();
        expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
    });

    it("renders a close button for an overlay that fills a narrow screen", () => {
        const onClose = vi.fn();
        renderAnchoredOverlay({
            onClose,
            variant: { regular: "anchored", narrow: "fullscreen" },
        });

        const closeButton = screen.getByRole("button", { name: "Close" });
        expect(closeButton).toHaveAttribute("data-component", "AnchoredOverlay.CloseButton");

        fireEvent.click(closeButton);

        expect(onClose).toHaveBeenCalledWith("close-button");
    });

    it("leaves out the close button where it is not asked for", () => {
        renderAnchoredOverlay({
            displayCloseButton: false,
            variant: { regular: "anchored", narrow: "fullscreen" },
        });

        expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
    });

    it("names the close button whatever the caller asks for", () => {
        renderAnchoredOverlay({
            variant: { regular: "anchored", narrow: "fullscreen" },
            closeButtonProps: { "aria-label": "Dismiss" },
        });

        expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument();
    });

    it("stands against an anchor it did not render", () => {
        const Harness = () => {
            const anchorRef = React.useRef<HTMLButtonElement>(null);

            return (
                <>
                    <button type="button" ref={anchorRef}>
                        Anchor
                    </button>
                    <AnchoredOverlay open onClose={noop} renderAnchor={null} anchorRef={anchorRef}>
                        <button type="button">Focusable child</button>
                    </AnchoredOverlay>
                </>
            );
        };

        render(<Harness />);

        expect(overlay()).toBeInTheDocument();
        // The anchor was written by the caller, so nothing has been spread onto it
        expect(anchor()).not.toHaveAttribute("aria-haspopup");
    });
});
