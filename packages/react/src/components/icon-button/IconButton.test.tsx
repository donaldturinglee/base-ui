import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import IconButton from "./IconButton";

const Icon = () => <svg data-testid="icon" />;

describe("IconButton", () => {
    it("renders a button element by default", () => {
        render(<IconButton icon={Icon} aria-label="Close" />);
        const button = screen.getByRole("button", { name: "Close" });
        expect(button.tagName).toBe("BUTTON");
        expect(button).toHaveAttribute("type", "button");
    });

    it("tags the root element with a data-component attribute", () => {
        render(<IconButton icon={Icon} aria-label="Close" />);
        expect(screen.getByRole("button")).toHaveAttribute("data-component", "IconButton");
    });

    it("renders the icon given as a component", () => {
        render(<IconButton icon={Icon} aria-label="Close" />);
        expect(screen.getByTestId("icon").parentElement).toHaveAttribute("data-component", "icon");
    });

    it("renders an icon given as an element", () => {
        render(<IconButton icon={<svg data-testid="glyph" />} aria-label="Close" />);
        expect(screen.getByTestId("glyph")).toBeInTheDocument();
    });

    it("lays the icon out on its own rather than on the button content grid", () => {
        render(<IconButton icon={Icon} aria-label="Close" />);
        const button = screen.getByRole("button");
        expect(button.querySelector("[data-component='buttonContent']")).toBeNull();
        expect(button).toHaveClass("icon-button");
    });

    it("is square at the medium size by default", () => {
        render(<IconButton icon={Icon} aria-label="Close" />);
        const button = screen.getByRole("button");
        expect(button).toHaveAttribute("data-size", "medium");
        expect(button).toHaveClass("icon-button-medium");
        expect(button).toHaveClass("button");
    });

    it("respects the size", () => {
        render(<IconButton icon={Icon} size="large" aria-label="Close" />);
        const button = screen.getByRole("button");
        expect(button).toHaveClass("icon-button-large");
        expect(button).toHaveClass("button-large");
    });

    it("mutes the icon on a default button", () => {
        render(<IconButton icon={Icon} aria-label="Close" />);
        expect(screen.getByRole("button")).toHaveClass("button-icon-tone-default");
    });

    it("respects the variant", () => {
        render(<IconButton icon={Icon} variant="danger" aria-label="Delete" />);
        const button = screen.getByRole("button");
        expect(button).toHaveAttribute("data-variant", "danger");
        expect(button).toHaveClass("button-danger");
    });

    it("takes the button colour once it is out of use", () => {
        render(<IconButton icon={Icon} disabled aria-label="Close" />);
        const button = screen.getByRole("button");
        expect(button).toBeDisabled();
        expect(button).toHaveClass("button-default-disabled");
    });

    it("swaps the icon for a spinner while loading", () => {
        render(<IconButton icon={Icon} loading aria-label="Close" />);
        expect(screen.queryByTestId("icon")).not.toBeInTheDocument();
        expect(screen.getByRole("button")).toHaveAttribute("aria-disabled", "true");
        expect(screen.getByRole("status")).toHaveTextContent("Loading");
    });

    it("keeps its accessible name while loading", () => {
        render(<IconButton icon={Icon} loading aria-label="Close" />);
        expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    });

    it("accepts a name given by aria-labelledby instead", () => {
        render(
            <>
                <span id="close-label">Close</span>
                <IconButton icon={Icon} aria-labelledby="close-label" />
            </>,
        );
        expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    });

    it("does not leak its own props onto the element", () => {
        render(<IconButton icon={Icon} size="small" variant="invisible" aria-label="Close" />);
        const button = screen.getByRole("button");
        expect(button).not.toHaveAttribute("icon");
        expect(button).not.toHaveAttribute("size");
        expect(button).not.toHaveAttribute("variant");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(<IconButton icon={Icon} ref={ref} aria-label="Close" />);
        expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("merges a custom className onto the root element", () => {
        render(<IconButton icon={Icon} className="custom" aria-label="Close" />);
        expect(screen.getByRole("button")).toHaveClass("custom");
    });
});
