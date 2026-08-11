import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Button } from "../button";
import { Dialog } from ".";
import type { DialogProps } from "./Dialog.types";

const originalResizeObserver = window.ResizeObserver;

const noop = () => {};

const renderDialog = (props: Partial<DialogProps> = {}) =>
    render(
        <Dialog title="Delete repository" onClose={noop} {...props}>
            Dialog content
        </Dialog>,
    );

const dialog = () => screen.getByRole("dialog");

const backdrop = () => dialog().parentElement as HTMLElement;

const button = (name: string) => screen.getByRole("button", { name });

describe("Dialog", () => {
    // jsdom has no ResizeObserver, and the dialog watches its own size to lay the footer
    // buttons out
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

    it("renders with the dialog role by default", () => {
        renderDialog();
        expect(dialog()).toBeInTheDocument();
    });

    it("renders with the role passed to the role prop", () => {
        renderDialog({ role: "alertdialog" });
        expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    });

    it("tags the root element with a data-component attribute", () => {
        renderDialog();
        expect(dialog()).toHaveAttribute("data-component", "Dialog");
    });

    it("lets the caller name the root element something else", () => {
        renderDialog({ "data-component": "ConfirmationDialog" });
        expect(dialog()).toHaveAttribute("data-component", "ConfirmationDialog");
    });

    it("renders outside the tree it was written in", () => {
        const { container } = renderDialog();
        expect(container).toBeEmptyDOMElement();
        expect(document.body).toContainElement(dialog());
    });

    it("names itself from its title and describes itself from its subtitle", () => {
        renderDialog({ subtitle: "This cannot be undone" });

        const title = screen.getByText("Delete repository");
        const subtitle = screen.getByText("This cannot be undone");

        expect(dialog()).toHaveAttribute("aria-labelledby", title.id);
        expect(dialog()).toHaveAttribute("aria-describedby", subtitle.id);
        expect(dialog()).toHaveAttribute("aria-modal", "true");
    });

    it("leaves out the subtitle when it has not been given one", () => {
        renderDialog();
        expect(dialog().querySelector("[data-component='Dialog.Subtitle']")).toBeNull();
    });

    it("tags each of its parts with a data-component attribute", () => {
        renderDialog({
            subtitle: "This cannot be undone",
            footerButtons: [{ content: "Delete" }],
        });

        for (const part of ["Header", "Title", "Subtitle", "CloseButton", "Body", "Footer"]) {
            expect(dialog().querySelector(`[data-component='Dialog.${part}']`)).toBeInTheDocument();
        }
    });

    it("calls onClose with the close button gesture when the close button is pressed", () => {
        const onClose = vi.fn();
        renderDialog({ onClose });

        fireEvent.click(button("Close"));

        expect(onClose).toHaveBeenCalledTimes(1);
        expect(onClose).toHaveBeenCalledWith("close-button");
    });

    it("calls onClose when the backdrop is clicked", () => {
        const onClose = vi.fn();
        renderDialog({ onClose });

        fireEvent.mouseDown(backdrop());
        fireEvent.click(backdrop());

        expect(onClose).toHaveBeenCalledWith("escape");
    });

    it("leaves the dialog open when the click only ended on the backdrop", () => {
        const onClose = vi.fn();
        renderDialog({ onClose });

        fireEvent.mouseDown(dialog());
        fireEvent.click(backdrop());

        expect(onClose).not.toHaveBeenCalled();
    });

    it("calls onClose when escape is pressed", () => {
        const onClose = vi.fn();
        renderDialog({ onClose });

        fireEvent.keyDown(document, { key: "Escape" });

        expect(onClose).toHaveBeenCalledWith("escape");
    });

    it("closes only the innermost dialog when escape is pressed", () => {
        const onCloseOuter = vi.fn();
        const onCloseInner = vi.fn();

        const Fixture = () => {
            const [isInnerOpen, setIsInnerOpen] = React.useState(false);

            return (
                <Dialog title="Outer" onClose={onCloseOuter}>
                    <Button onClick={() => setIsInnerOpen(true)}>Open the inner dialog</Button>
                    {isInnerOpen ? (
                        <Dialog title="Inner" onClose={onCloseInner}>
                            Inner content
                        </Dialog>
                    ) : null}
                </Dialog>
            );
        };

        render(<Fixture />);
        fireEvent.click(button("Open the inner dialog"));
        fireEvent.keyDown(document, { key: "Escape" });

        expect(onCloseInner).toHaveBeenCalledWith("escape");
        expect(onCloseOuter).not.toHaveBeenCalled();
    });

    it("holds the page still while it is open", () => {
        document.body.style.overflow = "scroll";

        const { unmount } = renderDialog();

        expect(document.body).toHaveAttribute("data-dialog-scroll-disabled");
        expect(document.body).toHaveStyle("overflow: hidden");

        unmount();

        expect(document.body).not.toHaveAttribute("data-dialog-scroll-disabled");
        expect(document.body).toHaveStyle("overflow: scroll");

        document.body.style.overflow = "";
    });

    it("hands the page back only once the last dialog has closed", () => {
        const { unmount: unmountFirst } = renderDialog();
        const { unmount: unmountSecond } = renderDialog();

        unmountFirst();
        expect(document.body).toHaveAttribute("data-dialog-scroll-disabled");

        unmountSecond();
        expect(document.body).not.toHaveAttribute("data-dialog-scroll-disabled");
    });

    describe("footer", () => {
        const footerButtons = [
            { content: "Cancel" },
            { buttonType: "danger" as const, content: "Delete" },
        ];

        it("renders a button for each one it is given", () => {
            renderDialog({ footerButtons });

            const buttons = dialog().querySelectorAll("[data-component='Dialog.FooterButton']");

            expect(buttons).toHaveLength(2);
            expect(buttons[0]).toHaveTextContent("Cancel");
            expect(buttons[1]).toHaveTextContent("Delete");
        });

        it("gives each button the variant its button type asks for", () => {
            renderDialog({
                footerButtons: [
                    { content: "Cancel", buttonType: "normal" },
                    { content: "Delete", buttonType: "danger" },
                ],
            });

            expect(button("Cancel")).toHaveAttribute("data-variant", "default");
            expect(button("Delete")).toHaveAttribute("data-variant", "danger");
        });

        it("says that it has a footer", () => {
            renderDialog({ footerButtons });
            expect(dialog()).toHaveAttribute("data-has-footer", "");
            expect(dialog()).toHaveAttribute("data-footer-button-layout", "wrap");
        });

        it("says nothing where the footer renders nothing", () => {
            renderDialog({ renderFooter: () => null });
            expect(dialog()).not.toHaveAttribute("data-has-footer");
            expect(dialog()).not.toHaveAttribute("data-footer-button-layout");
        });

        it("moves between the buttons with the arrow keys", () => {
            renderDialog({ footerButtons });

            button("Cancel").focus();
            fireEvent.keyDown(button("Cancel"), { key: "ArrowRight" });
            expect(button("Delete")).toHaveFocus();

            // Moving on from the last button comes round to the first
            fireEvent.keyDown(button("Delete"), { key: "ArrowRight" });
            expect(button("Cancel")).toHaveFocus();

            fireEvent.keyDown(button("Cancel"), { key: "ArrowLeft" });
            expect(button("Delete")).toHaveFocus();
        });
    });

    describe("focus", () => {
        it("opens on the first thing inside it that can take focus", () => {
            renderDialog();
            expect(button("Close")).toHaveFocus();
        });

        it("opens on the footer button asking for focus", () => {
            renderDialog({
                footerButtons: [
                    { content: "Cancel" },
                    { content: "Delete", autoFocus: true },
                    { content: "Delete everything", autoFocus: true },
                ],
            });

            expect(button("Delete")).toHaveFocus();
        });

        it("opens on the element named by initialFocusRef", () => {
            const Fixture = () => {
                const initialFocusRef = React.useRef<HTMLButtonElement>(null);

                return (
                    <Dialog
                        title="Delete repository"
                        onClose={noop}
                        initialFocusRef={initialFocusRef}
                    >
                        <Button ref={initialFocusRef}>Read more</Button>
                    </Dialog>
                );
            };

            render(<Fixture />);

            expect(button("Read more")).toHaveFocus();
        });

        it("keeps the tab key within the dialog", () => {
            renderDialog({ footerButtons: [{ content: "Delete" }] });

            expect(button("Close")).toHaveFocus();

            button("Delete").focus();
            fireEvent.keyDown(document, { key: "Tab" });
            expect(button("Close")).toHaveFocus();

            fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
            expect(button("Delete")).toHaveFocus();
        });

        it("hands focus back to whatever held it beforehand", () => {
            const Fixture = () => {
                const [isOpen, setIsOpen] = React.useState(false);

                return (
                    <>
                        <Button onClick={() => setIsOpen(true)}>Show dialog</Button>
                        {isOpen ? (
                            <Dialog title="Delete repository" onClose={() => setIsOpen(false)}>
                                Dialog content
                            </Dialog>
                        ) : null}
                    </>
                );
            };

            render(<Fixture />);

            const trigger = button("Show dialog");

            trigger.focus();
            fireEvent.click(trigger);
            fireEvent.click(button("Close"));

            expect(screen.queryByRole("dialog")).toBeNull();
            expect(trigger).toHaveFocus();
        });

        it("hands focus to the element named by returnFocusRef", () => {
            const Fixture = () => {
                const [isOpen, setIsOpen] = React.useState(true);
                const returnFocusRef = React.useRef<HTMLButtonElement>(null);

                return (
                    <>
                        <Button ref={returnFocusRef}>Take focus afterwards</Button>
                        {isOpen ? (
                            <Dialog
                                title="Delete repository"
                                onClose={() => setIsOpen(false)}
                                returnFocusRef={returnFocusRef}
                            >
                                Dialog content
                            </Dialog>
                        ) : null}
                    </>
                );
            };

            render(<Fixture />);
            fireEvent.click(button("Close"));

            expect(button("Take focus afterwards")).toHaveFocus();
        });
    });

    describe("size", () => {
        it("names the step of the scale it was given", () => {
            renderDialog({ width: "small", height: "large" });

            expect(dialog()).toHaveAttribute("data-width", "small");
            expect(dialog()).toHaveAttribute("data-height", "large");
            expect(dialog().style.getPropertyValue("--dialog-width")).toBe("");
        });

        it("carries a width of its own in a variable", () => {
            renderDialog({ width: "25rem" });

            expect(dialog()).not.toHaveAttribute("data-width");
            expect(dialog().style.getPropertyValue("--dialog-width")).toBe("25rem");
        });

        it("reads a width given as a number as pixels", () => {
            renderDialog({ width: 400 });

            expect(dialog().style.getPropertyValue("--dialog-width")).toBe("400px");
        });
    });

    describe("position", () => {
        it("stands in the middle by default", () => {
            renderDialog();

            expect(dialog()).toHaveAttribute("data-position-regular", "center");
            expect(dialog()).toHaveAttribute("data-position-narrow", "center");
        });

        it("takes a position for every viewport from a single value", () => {
            renderDialog({ position: "right" });

            expect(dialog()).toHaveAttribute("data-position-regular", "right");
            expect(dialog()).not.toHaveAttribute("data-position-narrow");
        });

        it("takes a position of its own for narrow viewports", () => {
            renderDialog({ position: { narrow: "fullscreen", regular: "left" } });

            expect(dialog()).toHaveAttribute("data-position-narrow", "fullscreen");
            expect(dialog()).toHaveAttribute("data-position-regular", "left");
        });
    });

    describe("align", () => {
        it("says where down the screen it sits, on the dialog and on the backdrop", () => {
            renderDialog({ align: "top" });

            expect(dialog()).toHaveAttribute("data-align", "top");
            expect(backdrop()).toHaveAttribute("data-align", "top");
        });

        it("says nothing where it was not given an alignment", () => {
            renderDialog();
            expect(dialog()).not.toHaveAttribute("data-align");
        });
    });

    describe("custom rendering", () => {
        it("renders the parts given as children in place of the default ones", () => {
            render(
                <Dialog title="Delete repository" onClose={noop}>
                    <Dialog.Header>
                        <Dialog.Title>Given directly</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>Body given directly</Dialog.Body>
                    <Dialog.Footer>Footer given directly</Dialog.Footer>
                </Dialog>,
            );

            expect(screen.getByText("Given directly")).toBeInTheDocument();
            expect(screen.getByText("Body given directly")).toBeInTheDocument();
            expect(screen.getByText("Footer given directly")).toBeInTheDocument();
            expect(screen.queryByRole("button", { name: "Close" })).toBeNull();
            expect(dialog()).toHaveAttribute("data-has-footer", "");
        });

        it("hands the renderers everything the dialog was given", () => {
            renderDialog({
                subtitle: "This cannot be undone",
                footerButtons: [{ content: "Delete" }],
                renderHeader: ({ title, subtitle, dialogLabelId }) => (
                    <Dialog.Header>
                        <Dialog.Title id={dialogLabelId}>{`${title}: ${subtitle}`}</Dialog.Title>
                    </Dialog.Header>
                ),
                renderBody: ({ children }) => <Dialog.Body>{children}</Dialog.Body>,
                renderFooter: ({ footerButtons }) => (
                    <Dialog.Footer>
                        {footerButtons ? <Dialog.Buttons buttons={footerButtons} /> : null}
                    </Dialog.Footer>
                ),
            });

            expect(
                screen.getByText("Delete repository: This cannot be undone"),
            ).toBeInTheDocument();
            expect(screen.getByText("Dialog content")).toBeInTheDocument();
            expect(button("Delete")).toBeInTheDocument();
        });
    });

    it("passes the class names it is given on to the dialog", () => {
        renderDialog({ className: "custom-class" });
        expect(dialog()).toHaveClass("custom-class");
    });

    it("hands its root element to the ref it is given", () => {
        const ref = React.createRef<HTMLDivElement>();

        renderDialog({ ref });

        expect(ref.current).toBe(dialog());
    });
});
