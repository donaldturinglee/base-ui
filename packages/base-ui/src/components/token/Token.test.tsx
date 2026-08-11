import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { PersonRegular } from "@gamecrafters/base-ui-icons";
import { Token } from ".";

const token = () => document.querySelector("[data-component='Token']") as HTMLElement;

const removeButton = () =>
    document.querySelector("[data-component='Token.RemoveButton']") as HTMLElement | null;

const leadingVisual = () => document.querySelector("[data-component='Token.LeadingVisual']");

describe("Token", () => {
    it("renders the text it is given", () => {
        render(<Token text="monalisa" />);
        expect(screen.getByText("monalisa")).toBeInTheDocument();
    });

    it("tags the token with a data-component attribute", () => {
        render(<Token text="monalisa" />);
        expect(token()).toHaveAttribute("data-component", "Token");
    });

    it("is medium unless it is told otherwise", () => {
        render(<Token text="monalisa" />);
        expect(token()).toHaveAttribute("data-size", "medium");
    });

    it("takes the size it is given", () => {
        render(<Token text="monalisa" size="xlarge" />);
        expect(token()).toHaveAttribute("data-size", "xlarge");
    });

    it("says when it is one of the ones that have been picked", () => {
        render(<Token text="monalisa" isSelected />);
        expect(token()).toHaveAttribute("data-selected");
    });

    it("renders a leading visual beside the text", () => {
        render(<Token text="monalisa" leadingVisual={PersonRegular} />);
        expect(leadingVisual()).toBeInTheDocument();
    });

    it("leaves the leading visual out of a small token, which has no room for one", () => {
        render(<Token text="monalisa" size="small" leadingVisual={PersonRegular} />);
        expect(leadingVisual()).not.toBeInTheDocument();
    });

    it("renders no remove button unless it can be removed", () => {
        render(<Token text="monalisa" />);
        expect(removeButton()).not.toBeInTheDocument();
    });

    it("renders a remove button that says what it does", () => {
        render(<Token text="monalisa" onRemove={() => {}} />);
        expect(screen.getByRole("button", { name: "Remove token" })).toBe(removeButton());
        expect(token()).toHaveAttribute("data-has-remove-button");
    });

    it("leaves the remove button out where it is not asked for", () => {
        render(<Token text="monalisa" onRemove={() => {}} hideRemoveButton />);
        expect(removeButton()).not.toBeInTheDocument();
    });

    it("removes itself when the remove button is pressed", () => {
        const onRemove = vi.fn();
        render(<Token text="monalisa" onRemove={onRemove} />);

        fireEvent.click(screen.getByRole("button", { name: "Remove token" }));

        expect(onRemove).toHaveBeenCalledTimes(1);
    });

    it.each(["Backspace", "Delete"])("removes itself on the %s key", (key) => {
        const onRemove = vi.fn();
        render(<Token text="monalisa" onRemove={onRemove} />);

        fireEvent.keyDown(token(), { key });

        expect(onRemove).toHaveBeenCalledTimes(1);
    });

    it("says how it is taken back out, for a reader who cannot see the button", () => {
        render(<Token text="monalisa" onRemove={() => {}} />);
        expect(screen.getByText(/press backspace or delete to remove/)).toBeInTheDocument();
    });

    it("renders as the link it is asked to be", () => {
        render(<Token as="a" href="#profile" text="monalisa" />);

        const link = screen.getByRole("link", { name: "monalisa" });
        expect(link).toBe(token());
        expect(link).toHaveAttribute("href", "#profile");
    });

    it("renders as the button it is asked to be, and does what it is asked on a click", () => {
        const onClick = vi.fn();
        render(<Token as="button" text="monalisa" onClick={onClick} />);

        const button = screen.getByRole("button", { name: "monalisa" });
        expect(button).toBe(token());
        expect(button).toHaveAttribute("type", "button");

        fireEvent.click(button);
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("says whether it answers the reader at all", () => {
        const { rerender } = render(<Token text="monalisa" />);
        expect(token()).not.toHaveAttribute("data-interactive");

        rerender(<Token as="button" text="monalisa" onClick={() => {}} />);
        expect(token()).toHaveAttribute("data-interactive");

        rerender(<Token as="button" text="monalisa" onClick={() => {}} disabled />);
        expect(token()).not.toHaveAttribute("data-interactive");
    });

    it("moves what it leads to onto the text where it can also be taken back out", () => {
        render(<Token as="a" href="#profile" text="monalisa" onRemove={() => {}} />);

        // The link is the text rather than the token, so the remove button is left standing
        // beside it rather than inside it
        const link = screen.getByRole("link", { name: /monalisa/ });
        expect(link).toHaveAttribute("data-component", "Token.Text");
        expect(token()).not.toBe(link);
        expect(token().tagName).toBe("SPAN");
    });

    it("leaves the second remove control out of the accessibility tree", () => {
        render(<Token as="a" href="#profile" text="monalisa" onRemove={() => {}} />);

        // The token is already something to press, so the mark beside it is drawn but not
        // read — Backspace and Delete are what remove it there
        expect(removeButton()).toHaveAttribute("aria-hidden", "true");
        expect(screen.queryByRole("button", { name: "Remove token" })).not.toBeInTheDocument();
    });

    it("removes itself without also following what it leads to", () => {
        const onRemove = vi.fn();
        const onClick = vi.fn();
        render(<Token as="button" text="monalisa" onClick={onClick} onRemove={onRemove} />);

        fireEvent.click(removeButton() as HTMLElement);

        expect(onRemove).toHaveBeenCalledTimes(1);
        expect(onClick).not.toHaveBeenCalled();
    });

    it("takes a class name of the caller's own", () => {
        render(<Token text="monalisa" className="custom" />);
        expect(token()).toHaveClass("custom");
    });
});
