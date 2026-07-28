import * as React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, jest } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { ConfirmationDialog, useConfirm } from ".";
import type { ConfirmationDialogProps } from "./ConfirmationDialog.types";

const originalResizeObserver = window.ResizeObserver;

const noop = () => {};

const renderDialog = (props: Partial<ConfirmationDialogProps> = {}) =>
    render(
        <ConfirmationDialog title="Delete repository?" onClose={noop} {...props}>
            Dialog content
        </ConfirmationDialog>,
    );

const dialog = () => screen.getByRole("alertdialog");

const button = (name: string) => screen.getByRole("button", { name });

// Asks the question through the hook, so the shorthand is exercised the way a caller
// would reach it
const Confirmer = ({ onAnswer }: { onAnswer: (confirmed: boolean) => void }) => {
    const confirm = useConfirm();

    return (
        <button
            onClick={() => {
                void confirm({ title: "Delete repository?", content: "Dialog content" }).then(
                    onAnswer,
                );
            }}
        >
            Ask
        </button>
    );
};

describe("ConfirmationDialog", () => {
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

    it("renders with the alertdialog role", () => {
        renderDialog();
        expect(dialog()).toBeInTheDocument();
    });

    it("tags the root element with a data-component attribute", () => {
        renderDialog();
        expect(dialog()).toHaveAttribute("data-component", "ConfirmationDialog");
    });

    it("names itself from its title and renders its children as the body", () => {
        renderDialog();

        const title = screen.getByText("Delete repository?");

        expect(dialog()).toHaveAttribute("aria-labelledby", title.id);
        expect(screen.getByText("Dialog content")).toBeInTheDocument();
    });

    it("renders a cancel button and a confirm button", () => {
        renderDialog();

        const buttons = screen.getAllByRole("button", { name: /Cancel|OK/ });

        expect(buttons).toHaveLength(2);
        expect(buttons[0]).toHaveAccessibleName("Cancel");
        expect(buttons[1]).toHaveAccessibleName("OK");
    });

    it("labels the buttons with the content it is given", () => {
        renderDialog({ cancelButtonContent: "Keep it", confirmButtonContent: "Delete it" });

        expect(button("Keep it")).toBeInTheDocument();
        expect(button("Delete it")).toBeInTheDocument();
    });

    it("styles the confirm button by the type it is given", () => {
        renderDialog({ confirmButtonType: "danger" });
        expect(button("OK")).toHaveAttribute("data-variant", "danger");
    });

    it("falls back to the default variant for the older normal name", () => {
        renderDialog();
        expect(button("OK")).toHaveAttribute("data-variant", "default");
    });

    it("opens with the confirm button focused", () => {
        renderDialog();
        expect(button("OK")).toHaveFocus();
    });

    it("opens with the confirm button focused for a primary action", () => {
        renderDialog({ confirmButtonType: "primary" });
        expect(button("OK")).toHaveFocus();
    });

    it("opens with the cancel button focused for a dangerous action", () => {
        renderDialog({ confirmButtonType: "danger" });
        expect(button("Cancel")).toHaveFocus();
        expect(button("OK")).not.toHaveFocus();
    });

    it("opens on the button the caller names, even for a dangerous action", () => {
        renderDialog({ confirmButtonType: "danger", overrideButtonFocus: "confirm" });
        expect(button("OK")).toHaveFocus();
    });

    it("opens on the cancel button where the caller names it", () => {
        renderDialog({ overrideButtonFocus: "cancel" });
        expect(button("Cancel")).toHaveFocus();
    });

    it("calls onClose with the confirm gesture when the confirm button is pressed", () => {
        const onClose = jest.fn();
        renderDialog({ onClose });

        fireEvent.click(button("OK"));

        expect(onClose).toHaveBeenCalledTimes(1);
        expect(onClose).toHaveBeenCalledWith("confirm");
    });

    it("calls onClose with the cancel gesture when the cancel button is pressed", () => {
        const onClose = jest.fn();
        renderDialog({ onClose });

        fireEvent.click(button("Cancel"));

        expect(onClose).toHaveBeenCalledTimes(1);
        expect(onClose).toHaveBeenCalledWith("cancel");
    });

    it("calls onClose with the close button gesture when the close button is pressed", () => {
        const onClose = jest.fn();
        renderDialog({ onClose });

        fireEvent.click(button("Close"));

        expect(onClose).toHaveBeenCalledWith("close-button");
    });

    it("calls onClose with the escape gesture when escape is pressed", () => {
        const onClose = jest.fn();
        renderDialog({ onClose });

        fireEvent.keyDown(document, { key: "Escape" });

        expect(onClose).toHaveBeenCalledWith("escape");
    });

    it("marks the confirm button as loading", () => {
        renderDialog({ confirmButtonLoading: true });

        expect(button("OK")).toHaveAttribute("data-loading", "true");
        expect(button("Cancel")).not.toHaveAttribute("data-loading");
    });

    it("marks the cancel button as loading", () => {
        renderDialog({ cancelButtonLoading: true });

        expect(button("Cancel")).toHaveAttribute("data-loading", "true");
        expect(button("OK")).not.toHaveAttribute("data-loading");
    });

    it("marks both buttons as loading", () => {
        renderDialog({ confirmButtonLoading: true, cancelButtonLoading: true });

        expect(button("OK")).toHaveAttribute("data-loading", "true");
        expect(button("Cancel")).toHaveAttribute("data-loading", "true");
    });

    it("leaves the buttons alone when nothing is loading", () => {
        renderDialog({ confirmButtonLoading: false, cancelButtonLoading: false });

        expect(button("OK")).not.toHaveAttribute("data-loading");
        expect(button("Cancel")).not.toHaveAttribute("data-loading");
    });

    it("ignores a press on a button that is already loading", () => {
        const onClose = jest.fn();
        renderDialog({ onClose, confirmButtonLoading: true });

        fireEvent.click(button("OK"));

        expect(onClose).not.toHaveBeenCalled();
    });

    it("stands at the medium width by default", () => {
        renderDialog();
        expect(dialog()).toHaveAttribute("data-width", "medium");
    });

    it("stands at the width it is given", () => {
        renderDialog({ width: "large" });
        expect(dialog()).toHaveAttribute("data-width", "large");
    });

    it("stands at the height it is given", () => {
        renderDialog({ height: "small" });
        expect(dialog()).toHaveAttribute("data-height", "small");
    });

    it("merges a custom className onto the dialog", () => {
        renderDialog({ className: "custom" });
        expect(dialog()).toHaveClass("custom");
    });

    it("forwards a ref to the dialog", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(
            <ConfirmationDialog ref={ref} title="Delete repository?" onClose={noop}>
                Dialog content
            </ConfirmationDialog>,
        );
        expect(ref.current).toBe(dialog());
    });

    describe("useConfirm", () => {
        // The question stands in a tree of its own, which nothing takes down for the next
        // test, so each of them answers what it asked
        const answer = async (name: string) => {
            fireEvent.click(button(name));
            await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
        };

        it("puts the question up when it is asked", async () => {
            render(<Confirmer onAnswer={noop} />);

            fireEvent.click(button("Ask"));

            expect(await screen.findByRole("alertdialog")).toHaveAttribute(
                "data-component",
                "ConfirmationDialog",
            );

            await answer("Cancel");
        });

        it("answers with true when the question is confirmed", async () => {
            const onAnswer = jest.fn();
            render(<Confirmer onAnswer={onAnswer} />);

            fireEvent.click(button("Ask"));
            await screen.findByRole("alertdialog");
            await answer("OK");

            await waitFor(() => expect(onAnswer).toHaveBeenCalledWith(true));
        });

        it("answers with false when the question is turned down", async () => {
            const onAnswer = jest.fn();
            render(<Confirmer onAnswer={onAnswer} />);

            fireEvent.click(button("Ask"));
            await screen.findByRole("alertdialog");
            await answer("Cancel");

            await waitFor(() => expect(onAnswer).toHaveBeenCalledWith(false));
        });

        it("takes the dialog and the element holding it away once it closes", async () => {
            render(<Confirmer onAnswer={noop} />);

            fireEvent.click(button("Ask"));
            await screen.findByRole("alertdialog");

            const openChildCount = document.body.children.length;

            // Only the element the question was put up in goes; the portal root is left
            // standing for whatever is asked next
            await answer("Cancel");

            expect(document.body.children).toHaveLength(openChildCount - 1);
        });
    });
});
