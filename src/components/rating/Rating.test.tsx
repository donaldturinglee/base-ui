import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, jest } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { Rating, DEFAULT_RATING_COUNT } from ".";
import type { RatingProps, RatingSize } from "./Rating.types";

const LABEL = "Rate this article";

const renderRating = (props: Partial<RatingProps> = {}) =>
    render(<Rating {...props} aria-label={LABEL} data-testid="rating" />);

const root = () => screen.getByTestId("rating");

const stars = () => screen.getAllByRole("radio");

const star = (name: string) => screen.getByRole("radio", { name });

const items = () => root().querySelectorAll("[data-component='Rating.Item']");

describe("Rating", () => {
    it("renders a group of stars tagged as a Rating", () => {
        renderRating();

        expect(root()).toHaveAttribute("data-component", "Rating");
        expect(screen.getByRole("radiogroup", { name: LABEL })).toBe(root());
    });

    it("is read out of five stars by default", () => {
        renderRating();

        expect(stars()).toHaveLength(DEFAULT_RATING_COUNT);
        expect(root()).toHaveAttribute("data-count", String(DEFAULT_RATING_COUNT));
    });

    it("is read out of however many stars it is told", () => {
        renderRating({ count: 10 });

        expect(stars()).toHaveLength(10);
        expect(root()).toHaveAttribute("data-count", "10");
    });

    it("stands at none of them until it is given a value", () => {
        renderRating();

        expect(root()).toHaveAttribute("data-value", "0");
        expect(stars().every((input) => !(input as HTMLInputElement).checked)).toBe(true);
    });

    it("starts where it is told to", () => {
        renderRating({ defaultValue: 3 });

        expect(root()).toHaveAttribute("data-value", "3");
        expect(star("3 stars")).toBeChecked();
    });

    it("names the first star in the singular", () => {
        renderRating();
        expect(star("1 star")).toBeInTheDocument();
    });

    it("says each star in words of its own where it is given them", () => {
        renderRating({ count: 3, itemLabel: (value, count) => `${value} of ${count}` });

        expect(star("1 of 3")).toBeInTheDocument();
        expect(star("3 of 3")).toBeInTheDocument();
    });

    describe("the fill", () => {
        it("hands the value to the stylesheet rather than working the stars out here", () => {
            renderRating({ defaultValue: 2 });
            expect(root().style.getPropertyValue("--rating-value")).toBe("2");
        });

        it("gives each star its place in the row", () => {
            renderRating({ count: 3 });

            const places = Array.from(items(), (item) =>
                (item as HTMLElement).style.getPropertyValue("--rating-item-index"),
            );
            expect(places).toEqual(["0", "1", "2"]);
        });

        it("brings a value past the end of the row back to it", () => {
            renderRating({ value: 9 });
            expect(root()).toHaveAttribute("data-value", "5");
        });

        it("brings a value below the row back to none", () => {
            renderRating({ value: -2 });
            expect(root()).toHaveAttribute("data-value", "0");
        });
    });

    describe("moving it", () => {
        it("reports the star it has moved to", () => {
            const onChange = jest.fn();
            renderRating({ onChange });

            fireEvent.click(star("4 stars"));
            expect(onChange).toHaveBeenCalledWith(4);
        });

        it("keeps its own value where the caller is not holding it", () => {
            renderRating();

            fireEvent.click(star("4 stars"));
            expect(star("4 stars")).toBeChecked();
            expect(root()).toHaveAttribute("data-value", "4");
        });

        it("leaves a rating the caller is holding the value of where it was", () => {
            const onChange = jest.fn();
            renderRating({ value: 2, onChange });

            fireEvent.click(star("4 stars"));

            expect(onChange).toHaveBeenCalledWith(4);
            expect(root()).toHaveAttribute("data-value", "2");
        });

        it("follows the caller where they are holding the value", () => {
            const { rerender } = renderRating({ value: 2 });
            expect(star("2 stars")).toBeChecked();

            rerender(<Rating value={5} aria-label={LABEL} data-testid="rating" />);
            expect(star("5 stars")).toBeChecked();
        });

        it("does not report on arrival or when the value changes elsewhere", () => {
            const onChange = jest.fn();
            const { rerender } = renderRating({ value: 2, onChange });
            expect(onChange).not.toHaveBeenCalled();

            rerender(
                <Rating value={4} onChange={onChange} aria-label={LABEL} data-testid="rating" />,
            );
            expect(onChange).not.toHaveBeenCalled();
        });
    });

    describe("clearing it", () => {
        it("takes the rating back to none when the star it stands at is picked again", () => {
            const onChange = jest.fn();
            renderRating({ clearable: true, defaultValue: 3, onChange });

            fireEvent.click(star("3 stars"));

            expect(onChange).toHaveBeenCalledWith(0);
            expect(root()).toHaveAttribute("data-value", "0");
            expect(star("3 stars")).not.toBeChecked();
        });

        it("leaves the rating where it stands when it was not told it could be cleared", () => {
            const onChange = jest.fn();
            renderRating({ defaultValue: 3, onChange });

            fireEvent.click(star("3 stars"));

            expect(onChange).not.toHaveBeenCalled();
            expect(star("3 stars")).toBeChecked();
        });

        it("moves rather than clears when another star is picked", () => {
            const onChange = jest.fn();
            renderRating({ clearable: true, defaultValue: 3, onChange });

            fireEvent.click(star("5 stars"));

            expect(onChange).toHaveBeenCalledWith(5);
            expect(root()).toHaveAttribute("data-value", "5");
        });
    });

    describe("a reading", () => {
        it("has nothing behind the stars to pick", () => {
            renderRating({ readOnly: true, value: 4 });

            expect(screen.queryAllByRole("radio")).toHaveLength(0);
            expect(root()).toHaveAttribute("data-readonly", "true");
        });

        it("is read as one thing rather than as a row of stars", () => {
            render(<Rating readOnly value={4} data-testid="rating" />);

            expect(screen.getByRole("img")).toBe(root());
            expect(root()).toHaveAttribute("aria-label", "4 out of 5 stars");
        });

        it("says what it reads in words of its own where it is given them", () => {
            render(
                <Rating
                    readOnly
                    value={4}
                    valueLabel={(value, count) => `Rated ${value} of ${count}`}
                    data-testid="rating"
                />,
            );
            expect(root()).toHaveAttribute("aria-label", "Rated 4 of 5");
        });

        it("keeps a name of its own over the one it would be read by", () => {
            renderRating({ readOnly: true, value: 4 });
            expect(root()).toHaveAttribute("aria-label", LABEL);
        });

        it("is left standing between two stars rather than rounded to the nearer one", () => {
            renderRating({ readOnly: true, value: 3.5 });

            expect(root()).toHaveAttribute("data-value", "3.5");
            expect(root().style.getPropertyValue("--rating-value")).toBe("3.5");
        });

        it("does not show where a pointer would leave it, since there is nothing to leave", () => {
            renderRating({ readOnly: true, value: 3 });
            expect(root()).not.toHaveClass("rating-interactive");
        });
    });

    describe("disabled", () => {
        it("stops the stars being picked", () => {
            const onChange = jest.fn();
            renderRating({ disabled: true, defaultValue: 2, onChange });

            fireEvent.click(star("4 stars"));

            expect(star("4 stars")).toBeDisabled();
            expect(onChange).not.toHaveBeenCalled();
            expect(root()).toHaveAttribute("data-value", "2");
        });

        it("fades the whole row rather than draining it", () => {
            renderRating({ disabled: true, defaultValue: 2 });

            expect(root()).toHaveClass("rating-disabled");
            expect(root()).not.toHaveClass("rating-interactive");
            expect(root()).toHaveAttribute("data-value", "2");
        });
    });

    describe("sizes", () => {
        const sizes: RatingSize[] = ["small", "medium", "large"];

        it("is drawn at the medium size by default", () => {
            renderRating();
            expect(root()).toHaveAttribute("data-size", "medium");
        });

        it.each(sizes)("is drawn at the %s size", (size) => {
            renderRating({ size });

            expect(root()).toHaveAttribute("data-size", size);
            expect(root()).toHaveClass(`rating-${size}`);
        });
    });

    describe("the name the stars are grouped under", () => {
        it("groups them under the name it is given", () => {
            renderRating({ name: "article-rating" });

            for (const input of stars()) {
                expect(input).toHaveAttribute("name", "article-rating");
            }
        });

        it("makes one up so that two ratings on a page are not one group", () => {
            render(
                <>
                    <Rating aria-label="First" data-testid="first" />
                    <Rating aria-label="Second" data-testid="second" />
                </>,
            );

            const nameOf = (testId: string) =>
                screen.getByTestId(testId).querySelector("input")?.getAttribute("name");

            expect(nameOf("first")).toBeTruthy();
            expect(nameOf("first")).not.toBe(nameOf("second"));
        });
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLSpanElement>();
        render(<Rating ref={ref} aria-label={LABEL} data-testid="rating" />);
        expect(ref.current).toBe(root());
    });

    it("keeps a style of the caller's own alongside the value", () => {
        renderRating({ defaultValue: 2, style: { marginTop: "1rem" } });

        expect(root()).toHaveStyle({ marginTop: "1rem" });
        expect(root().style.getPropertyValue("--rating-value")).toBe("2");
    });

    it("merges a custom className onto the root element", () => {
        renderRating({ className: "custom" });
        expect(root()).toHaveClass("custom");
    });
});
