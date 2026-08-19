import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { IssueLabelToken } from ".";
import { getIssueLabelColors } from "./issueLabelColor";

const label = () => document.querySelector("[data-component='IssueLabelToken']") as HTMLElement;

const removeButton = () =>
    document.querySelector("[data-component='Token.RemoveButton']") as HTMLElement | null;

describe("getIssueLabelColors", () => {
    it("draws black text on a colour light enough to read it against", () => {
        expect(getIssueLabelColors("#ffffff").light.foreground).toBe("hsl(0deg, 0%, 0%)");
    });

    it("draws white text on a colour that is not", () => {
        expect(getIssueLabelColors("#000000").light.foreground).toBe("hsl(0deg, 0%, 100%)");
    });

    it("gives a border only to a colour close enough to white to need one", () => {
        expect(getIssueLabelColors("#ffffff").light.border).toContain(", 1)");
        expect(getIssueLabelColors("#000000").light.border).toContain(", 0)");
    });

    it("draws the colour itself in a light theme, and a wash of it in a dark one", () => {
        const colors = getIssueLabelColors("#ff0000");

        expect(colors.light.background).toBe("rgb(255, 0, 0)");
        expect(colors.dark.background).toBe("rgba(255, 0, 0, 0.18)");
    });

    it("lightens the text of a dark colour so it stands clear of what it is drawn on", () => {
        // Blue reads as dark, so the text on it is lifted well above the fill itself and
        // held at the lightest a colour can be rather than asked for more than that
        expect(getIssueLabelColors("#0000ff").dark.foreground).toBe("hsl(240deg, 100%, 100%)");
        // A colour that already reads as light is left where it is
        expect(getIssueLabelColors("#ffffff").dark.foreground).toBe("hsl(0deg, 0%, 100%)");
    });

    it("reads a three digit hex the same way as a six digit one", () => {
        expect(getIssueLabelColors("#fff")).toEqual(getIssueLabelColors("#ffffff"));
    });

    it("reads an rgb colour as well as a hex one", () => {
        expect(getIssueLabelColors("rgb(255, 255, 255)")).toEqual(getIssueLabelColors("#ffffff"));
    });

    it("falls back to a grey it can read where the colour cannot be", () => {
        expect(getIssueLabelColors("not a colour")).toEqual(getIssueLabelColors("#999999"));
    });
});

describe("IssueLabelToken", () => {
    it("renders the text it is given", () => {
        render(<IssueLabelToken text="bug" />);
        expect(screen.getByText("bug")).toBeInTheDocument();
    });

    it("tags the label with a data-component attribute", () => {
        render(<IssueLabelToken text="bug" />);
        expect(label()).toHaveAttribute("data-component", "IssueLabelToken");
    });

    it("carries the colours it was given the one colour for", () => {
        render(<IssueLabelToken text="bug" fillColor="#ff0000" />);

        expect(label().style.getPropertyValue("--issue-label-background")).toBe("rgb(255, 0, 0)");
        expect(label().style.getPropertyValue("--issue-label-dark-background")).toBe(
            "rgba(255, 0, 0, 0.18)",
        );
    });

    it("takes the size it is given", () => {
        render(<IssueLabelToken text="bug" size="large" />);
        expect(label()).toHaveAttribute("data-size", "large");
    });

    it("says when it is one of the ones that have been picked", () => {
        render(<IssueLabelToken text="bug" isSelected />);
        expect(label()).toHaveAttribute("data-selected");
    });

    it("removes itself when the remove button is pressed", () => {
        const onRemove = vi.fn();
        render(<IssueLabelToken text="bug" onRemove={onRemove} />);

        fireEvent.click(screen.getByRole("button", { name: "Remove token" }));

        expect(onRemove).toHaveBeenCalledTimes(1);
    });

    it("moves what it leads to onto the text where it can also be taken back out", () => {
        render(<IssueLabelToken as="a" href="#bug" text="bug" onRemove={() => {}} />);

        expect(screen.getByRole("link", { name: /bug/ })).toHaveAttribute(
            "data-component",
            "Token.Text",
        );
        expect(removeButton()).toHaveAttribute("aria-hidden", "true");
    });
});
