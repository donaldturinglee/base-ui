import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, jest } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { Button } from "../button";
import { Drawer } from ".";
import type { DrawerProps } from "./Drawer.types";

const originalResizeObserver = window.ResizeObserver;

const noop = () => {};

// The data attributes are spelled out, since they are only part of the props where they are
// written on the element itself
const renderDrawer = (props: Partial<DrawerProps & Record<`data-${string}`, string>> = {}) =>
    render(
        <Drawer title="Filters" onClose={noop} {...props}>
            Drawer content
        </Drawer>,
    );

const drawer = () => screen.getByRole("dialog");

const backdrop = () => drawer().parentElement as HTMLElement;

const button = (name: string) => screen.getByRole("button", { name });

describe("Drawer", () => {
    // jsdom has no ResizeObserver, and the body watches its own size to say whether there is
    // more to be read past the end of it
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

    it("renders with the dialog role", () => {
        renderDrawer();
        expect(drawer()).toBeInTheDocument();
    });

    it("tags the root element with a data-component attribute", () => {
        renderDrawer();
        expect(drawer()).toHaveAttribute("data-component", "Drawer");
    });

    it("lets the caller name the root element something else", () => {
        renderDrawer({ "data-component": "FilterDrawer" });
        expect(drawer()).toHaveAttribute("data-component", "FilterDrawer");
    });

    it("renders outside the tree it was written in", () => {
        const { container } = renderDrawer();
        expect(container).toBeEmptyDOMElement();
        expect(document.body).toContainElement(drawer());
    });

    it("names itself from its title and describes itself from its subtitle", () => {
        renderDrawer({ subtitle: "Narrow down what is listed" });

        const title = screen.getByText("Filters");
        const subtitle = screen.getByText("Narrow down what is listed");

        expect(drawer()).toHaveAttribute("aria-labelledby", title.id);
        expect(drawer()).toHaveAttribute("aria-describedby", subtitle.id);
    });

    it("describes itself with nothing where it has no subtitle", () => {
        renderDrawer();

        expect(drawer()).not.toHaveAttribute("aria-describedby");
        expect(drawer().querySelector("[data-component='Drawer.Subtitle']")).toBeNull();
    });

    it("keeps the name the caller gave it", () => {
        renderDrawer({ "aria-label": "Filter panel" });

        expect(drawer()).toHaveAccessibleName("Filter panel");
        expect(drawer()).not.toHaveAttribute("aria-labelledby");
    });

    it("tags each of its parts with a data-component attribute", () => {
        renderDrawer({ subtitle: "Narrow down what is listed" });

        for (const part of ["Header", "Title", "Subtitle", "CloseButton", "Body"]) {
            expect(drawer().querySelector(`[data-component='Drawer.${part}']`)).toBeInTheDocument();
        }
    });

    it("renders whatever it was given as its body", () => {
        renderDrawer();

        const body = drawer().querySelector("[data-component='Drawer.Body']");
        expect(body).toHaveTextContent("Drawer content");
    });

    describe("closing", () => {
        it("calls onClose with the close button gesture when the close button is pressed", () => {
            const onClose = jest.fn();
            renderDrawer({ onClose });

            fireEvent.click(button("Close"));

            expect(onClose).toHaveBeenCalledTimes(1);
            expect(onClose).toHaveBeenCalledWith("close-button");
        });

        it("calls onClose when escape is pressed", () => {
            const onClose = jest.fn();
            renderDrawer({ onClose });

            fireEvent.keyDown(document, { key: "Escape" });

            expect(onClose).toHaveBeenCalledWith("escape");
        });

        it("calls onClose when the backdrop is clicked", () => {
            const onClose = jest.fn();
            renderDrawer({ onClose });

            fireEvent.mouseDown(backdrop());
            fireEvent.click(backdrop());

            expect(onClose).toHaveBeenCalledWith("escape");
        });

        it("stays open where the click only ended on the backdrop", () => {
            const onClose = jest.fn();
            renderDrawer({ onClose });

            fireEvent.mouseDown(drawer());
            fireEvent.click(backdrop());

            expect(onClose).not.toHaveBeenCalled();
        });

        it("closes only the innermost layer when escape is pressed", () => {
            const onCloseOuter = jest.fn();
            const onCloseInner = jest.fn();

            const Fixture = () => {
                const [isInnerOpen, setIsInnerOpen] = React.useState(false);

                return (
                    <Drawer title="Outer" onClose={onCloseOuter}>
                        <Button onClick={() => setIsInnerOpen(true)}>Open the inner drawer</Button>
                        {isInnerOpen ? (
                            <Drawer title="Inner" onClose={onCloseInner}>
                                Inner content
                            </Drawer>
                        ) : null}
                    </Drawer>
                );
            };

            render(<Fixture />);
            fireEvent.click(button("Open the inner drawer"));
            fireEvent.keyDown(document, { key: "Escape" });

            expect(onCloseInner).toHaveBeenCalledWith("escape");
            expect(onCloseOuter).not.toHaveBeenCalled();
        });
    });

    describe("the edge it settles against", () => {
        it("comes in from the right by default", () => {
            renderDrawer();

            expect(drawer()).toHaveAttribute("data-position", "right");
            expect(backdrop()).toHaveAttribute("data-position", "right");
        });

        it("comes in from whichever edge it is given", () => {
            renderDrawer({ position: "bottom" });

            expect(drawer()).toHaveAttribute("data-position", "bottom");
            expect(backdrop()).toHaveAttribute("data-position", "bottom");
        });
    });

    describe("how far it comes in", () => {
        it("takes the medium step of the overlay scale by default", () => {
            renderDrawer();

            expect(drawer()).toHaveAttribute("data-size", "medium");
            expect(drawer()).not.toHaveStyle("--drawer-size: medium");
        });

        it("takes whichever step of the scale it is given", () => {
            renderDrawer({ size: "large" });
            expect(drawer()).toHaveAttribute("data-size", "large");
        });

        it("carries a size of its own in a variable rather than a step of the scale", () => {
            renderDrawer({ size: "22rem" });

            expect(drawer()).not.toHaveAttribute("data-size");
            expect(drawer().style.getPropertyValue("--drawer-size")).toBe("22rem");
        });

        it("reads a bare number as pixels", () => {
            renderDrawer({ size: 320 });
            expect(drawer().style.getPropertyValue("--drawer-size")).toBe("320px");
        });
    });

    describe("modal", () => {
        it("holds the page still while it is open", () => {
            document.body.style.overflow = "scroll";

            const { unmount } = renderDrawer();

            expect(document.body).toHaveAttribute("data-scroll-locked");
            expect(document.body).toHaveStyle("overflow: hidden");

            unmount();

            expect(document.body).not.toHaveAttribute("data-scroll-locked");
            expect(document.body).toHaveStyle("overflow: scroll");

            document.body.style.overflow = "";
        });

        it("hands the page back only once the last drawer has closed", () => {
            const { unmount: unmountFirst } = renderDrawer();
            const { unmount: unmountSecond } = renderDrawer();

            unmountFirst();
            expect(document.body).toHaveAttribute("data-scroll-locked");

            unmountSecond();
            expect(document.body).not.toHaveAttribute("data-scroll-locked");
        });

        it("says that it is modal", () => {
            renderDrawer();

            expect(drawer()).toHaveAttribute("aria-modal", "true");
            expect(drawer()).toHaveAttribute("data-modal", "true");
        });

        it("keeps focus within itself", () => {
            renderDrawer();
            expect(button("Close")).toHaveFocus();
        });

        it("takes escape, so a layer it was opened from keeps standing", () => {
            renderDrawer();
            expect(fireEvent.keyDown(document, { key: "Escape" })).toBe(false);
        });
    });

    describe("modeless", () => {
        it("leaves the page to be scrolled", () => {
            const { unmount } = renderDrawer({ modal: false });

            expect(document.body).not.toHaveAttribute("data-scroll-locked");

            unmount();
        });

        it("does not read as modal", () => {
            renderDrawer({ modal: false });

            expect(drawer()).not.toHaveAttribute("aria-modal");
            expect(drawer()).toHaveAttribute("data-modal", "false");
        });

        it("leaves focus where it was", () => {
            renderDrawer({ modal: false });
            expect(button("Close")).not.toHaveFocus();
        });

        it("leaves escape for whatever is behind it to answer as well", () => {
            const onClose = jest.fn();
            renderDrawer({ modal: false, onClose });

            // fireEvent hands back false where the event was taken
            const wasLeftAlone = fireEvent.keyDown(document, { key: "Escape" });

            expect(onClose).toHaveBeenCalledWith("escape");
            expect(wasLeftAlone).toBe(true);
        });

        it("stays open when the layer it is laid out in is clicked", () => {
            const onClose = jest.fn();
            renderDrawer({ modal: false, onClose });

            fireEvent.mouseDown(backdrop());
            fireEvent.click(backdrop());

            expect(onClose).not.toHaveBeenCalled();
        });
    });

    describe("focus", () => {
        it("hands focus back to whatever opened it", () => {
            const Fixture = () => {
                const [isOpen, setIsOpen] = React.useState(false);

                return (
                    <>
                        <Button onClick={() => setIsOpen(true)}>Show drawer</Button>
                        {isOpen ? (
                            <Drawer title="Filters" onClose={() => setIsOpen(false)}>
                                Drawer content
                            </Drawer>
                        ) : null}
                    </>
                );
            };

            render(<Fixture />);

            button("Show drawer").focus();
            fireEvent.click(button("Show drawer"));
            fireEvent.click(button("Close"));

            expect(button("Show drawer")).toHaveFocus();
        });

        it("opens on whatever it is told to", () => {
            const Fixture = () => {
                const inputRef = React.useRef<HTMLInputElement>(null);

                return (
                    <Drawer title="Add a note" initialFocusRef={inputRef} onClose={noop}>
                        <input ref={inputRef} aria-label="Note" />
                    </Drawer>
                );
            };

            render(<Fixture />);

            expect(screen.getByLabelText("Note")).toHaveFocus();
        });
    });

    describe("the parts a caller builds themselves", () => {
        it("takes a header of the caller's own in place of the default one", () => {
            render(
                <Drawer title="Filters" onClose={noop}>
                    <Drawer.Header>
                        <Drawer.Title>Built by hand</Drawer.Title>
                    </Drawer.Header>
                    <Drawer.Body>Body</Drawer.Body>
                </Drawer>,
            );

            expect(screen.getByText("Built by hand")).toBeInTheDocument();
            expect(screen.queryByText("Filters")).not.toBeInTheDocument();
        });

        it("names the drawer after a title standing in a header of the caller's own", () => {
            render(
                <Drawer title="Filters" onClose={noop}>
                    <Drawer.Header>
                        <Drawer.Title>Built by hand</Drawer.Title>
                    </Drawer.Header>
                </Drawer>,
            );

            expect(drawer()).toHaveAccessibleName("Built by hand");
        });

        it("lays a header of the caller's own out in a row, with the close button at the end", () => {
            render(
                <Drawer title="Filters" onClose={noop}>
                    <Drawer.Header>
                        <Drawer.Title>Built by hand</Drawer.Title>
                        <Drawer.CloseButton />
                    </Drawer.Header>
                </Drawer>,
            );

            const header = drawer().querySelector("[data-component='Drawer.Header']");

            // Without the row the title takes the whole width and the button drops beneath it
            expect(header).toHaveClass("drawer-header");
            expect(button("Close")).toHaveClass("drawer-close-button");
        });

        it("gives a title written straight into the header the rhythm the grouped one gets", () => {
            render(
                <Drawer title="Filters" onClose={noop}>
                    <Drawer.Header>
                        <Drawer.Title>Built by hand</Drawer.Title>
                        <Drawer.CloseButton />
                    </Drawer.Header>
                </Drawer>,
            );

            const header = drawer().querySelector("[data-component='Drawer.Header']");

            // Without these the title sits against the edge, and rides above the button beside
            // it rather than standing to the same height
            expect(header).toHaveClass("drawer-header-direct-title");
        });

        it("closes from a close button standing in a header of the caller's own", () => {
            const onClose = jest.fn();
            render(
                <Drawer title="Filters" onClose={onClose}>
                    <Drawer.Header>
                        <Drawer.Title>Built by hand</Drawer.Title>
                        <Drawer.CloseButton />
                    </Drawer.Header>
                </Drawer>,
            );

            fireEvent.click(button("Close"));

            expect(onClose).toHaveBeenCalledWith("close-button");
        });

        it("takes a body of the caller's own in place of the default one", () => {
            render(
                <Drawer title="Filters" onClose={noop}>
                    <Drawer.Body className="custom">Body of my own</Drawer.Body>
                </Drawer>,
            );

            const body = drawer().querySelector("[data-component='Drawer.Body']");

            expect(body).toHaveTextContent("Body of my own");
            expect(body).toHaveClass("custom");
        });

        it("says nothing of a footer where it has none", () => {
            renderDrawer();
            expect(drawer()).not.toHaveAttribute("data-has-footer");
        });

        it("says that it has a footer", () => {
            render(
                <Drawer title="Filters" onClose={noop}>
                    <Drawer.Footer>Footer</Drawer.Footer>
                </Drawer>,
            );

            expect(drawer()).toHaveAttribute("data-has-footer", "");
        });

        it("keeps the footer out of the body", () => {
            render(
                <Drawer title="Filters" onClose={noop}>
                    Drawer content
                    <Drawer.Footer>Footer</Drawer.Footer>
                </Drawer>,
            );

            const body = drawer().querySelector("[data-component='Drawer.Body']");
            const footer = drawer().querySelector<HTMLElement>("[data-component='Drawer.Footer']");

            expect(body).toHaveTextContent("Drawer content");
            expect(body).not.toContainElement(footer);
        });
    });
});
