import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Button } from "../button";
import { Details } from ".";
import type { DetailsProps } from "./Details.types";

const renderDetails = (props: Partial<DetailsProps> = {}) =>
    render(
        <Details data-testid="details" {...props}>
            <Details.Summary>See details</Details.Summary>
            <p>The two commits on the branch are now on main.</p>
        </Details>,
    );

const details = () => screen.getByTestId("details") as HTMLDetailsElement;

const summary = () => screen.getByText("See details");

// jsdom leaves the element as it was when the summary is clicked, so the tests open and close
// it the way a browser would and let the component hear about it afterwards
const toggle = (open: boolean) => {
    const element = details();
    element.open = open;
    fireEvent(element, new Event("toggle"));
};

describe("Details", () => {
    it("renders a details element", () => {
        renderDetails();
        expect(details().tagName).toBe("DETAILS");
    });

    it("tags the elements with data-component attributes", () => {
        renderDetails();
        expect(details()).toHaveAttribute("data-component", "Details");
        expect(summary()).toHaveAttribute("data-component", "Details.Summary");
    });

    it("takes away the marker the browser draws beside the summary", () => {
        renderDetails();
        expect(details()).toHaveClass("details");
    });

    it("starts closed", () => {
        renderDetails();
        expect(details()).not.toHaveAttribute("open");
    });

    it("starts open where it is asked to", () => {
        renderDetails({ defaultOpen: true });
        expect(details()).toHaveAttribute("open");
    });

    it("follows the element as the browser opens and closes it", () => {
        renderDetails();

        toggle(true);
        expect(details()).toHaveAttribute("open");

        toggle(false);
        expect(details()).not.toHaveAttribute("open");
    });

    it("reports every change through onChange", () => {
        const onChange = vi.fn();
        renderDetails({ onChange });

        toggle(true);
        expect(onChange).toHaveBeenCalledWith(true);

        toggle(false);
        expect(onChange).toHaveBeenCalledWith(false);
        expect(onChange).toHaveBeenCalledTimes(2);
    });

    it("passes the toggle event on to a caller listening for it", () => {
        const onToggle = vi.fn();
        renderDetails({ onToggle });

        toggle(true);
        expect(onToggle).toHaveBeenCalledTimes(1);
    });

    it("holds the element to what the caller asked for, where they are holding the state", () => {
        const onChange = vi.fn();
        renderDetails({ open: false, onChange });

        toggle(true);
        // The caller is told the summary was used, and until they say otherwise the element
        // is put back to the state they last asked for
        expect(onChange).toHaveBeenCalledWith(true);
        expect(details()).not.toHaveAttribute("open");
    });

    it("opens where the caller says it is open", () => {
        renderDetails({ open: true });
        expect(details()).toHaveAttribute("open");
    });

    it("closes when a click lands outside of it", () => {
        renderDetails({ closeOnOutsideClick: true, defaultOpen: true });

        fireEvent.click(document.body);
        expect(details()).not.toHaveAttribute("open");
    });

    it("reports the outside click through onChange", () => {
        const onChange = vi.fn();
        renderDetails({ closeOnOutsideClick: true, defaultOpen: true, onChange });

        fireEvent.click(document.body);
        expect(onChange).toHaveBeenCalledWith(false);
    });

    it("stays open when the click lands inside of it", () => {
        render(
            <Details data-testid="details" closeOnOutsideClick defaultOpen>
                <Details.Summary>See details</Details.Summary>
                <button type="button">Undo</button>
            </Details>,
        );

        fireEvent.click(screen.getByRole("button", { name: "Undo" }));
        expect(details()).toHaveAttribute("open");
    });

    it("leaves an outside click alone where it is not asked to close", () => {
        renderDetails({ defaultOpen: true });

        fireEvent.click(document.body);
        expect(details()).toHaveAttribute("open");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLDetailsElement>();
        render(
            <Details ref={ref} data-testid="details">
                <Details.Summary>See details</Details.Summary>
            </Details>,
        );
        expect(ref.current).toBe(details());
    });

    it("merges a custom className onto the root element", () => {
        renderDetails({ className: "custom" });
        expect(details()).toHaveClass("custom");
    });

    it("passes extra props onto the root element", () => {
        renderDetails({ "aria-label": "Details" });
        expect(details()).toHaveAttribute("aria-label", "Details");
    });

    describe("Details.Summary", () => {
        it("renders a summary element by default", () => {
            renderDetails();
            expect(summary().tagName).toBe("SUMMARY");
        });

        it("still renders a summary where it is asked to be something else", () => {
            render(
                <Details data-testid="details">
                    <Details.Summary as={Button}>See details</Details.Summary>
                </Details>,
            );

            const element = screen.getByText("See details").closest("summary");
            expect(element).not.toBeNull();
            expect(element).toHaveAttribute("data-component", "Details.Summary");
            // What it was asked to be rendered as is still what drew it
            expect(element).toHaveAttribute("data-variant", "default");
        });

        it("merges a custom className onto the summary", () => {
            render(<Details.Summary className="custom">See details</Details.Summary>);
            expect(summary()).toHaveClass("custom");
        });

        it("passes extra props onto the summary", () => {
            render(<Details.Summary data-testid="summary">See details</Details.Summary>);
            expect(summary()).toHaveAttribute("data-testid", "summary");
        });
    });
});
