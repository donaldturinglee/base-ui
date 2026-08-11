import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Image } from ".";
import type { ImageBorderRadius, ImageFit } from "./Image.types";

const SOURCE = "https://example.com/photograph.png";
const FALLBACK = "https://example.com/placeholder.png";

const image = () => screen.getByRole("img");

describe("Image", () => {
    it("renders an img element by default", () => {
        render(<Image src={SOURCE} alt="A photograph" />);
        expect(image().tagName).toBe("IMG");
    });

    it("renders as the element passed to the as prop", () => {
        render(<Image as="span" data-testid="image" />);
        expect(screen.getByTestId("image").tagName).toBe("SPAN");
    });

    it("sets the source it is given", () => {
        render(<Image src={SOURCE} alt="A photograph" />);
        expect(image()).toHaveAttribute("src", SOURCE);
    });

    it("tags the root element with a data-component attribute", () => {
        render(<Image src={SOURCE} alt="A photograph" />);
        expect(image()).toHaveAttribute("data-component", "Image");
    });

    it("reads as decorative when it is given nothing of its own to say", () => {
        render(<Image src={SOURCE} data-testid="image" />);
        expect(screen.getByTestId("image")).toHaveAttribute("alt", "");
    });

    it("carries the alternative text it is given", () => {
        render(<Image src={SOURCE} alt="A photograph" />);
        expect(image()).toHaveAccessibleName("A photograph");
    });

    it("holds off fetching until the picture is near the viewport", () => {
        render(<Image src={SOURCE} alt="A photograph" />);
        expect(image()).toHaveAttribute("loading", "lazy");
    });

    it("lets a caller ask for the picture at once", () => {
        render(<Image src={SOURCE} alt="A photograph" loading="eager" />);
        expect(image()).toHaveAttribute("loading", "eager");
    });

    it("falls back to covering the box it is given", () => {
        render(<Image src={SOURCE} alt="A photograph" />);
        expect(image()).toHaveAttribute("data-fit", "cover");
        expect(image()).toHaveClass("image-fit-cover");
    });

    it("respects the fit prop", () => {
        const fits = {
            contain: "image-fit-contain",
            cover: "image-fit-cover",
            fill: "image-fit-fill",
            none: "image-fit-none",
            "scale-down": "image-fit-scale-down",
        } as const;

        for (const [fit, expected] of Object.entries(fits)) {
            const { unmount } = render(
                <Image src={SOURCE} alt="A photograph" fit={fit as ImageFit} />,
            );
            expect(image()).toHaveAttribute("data-fit", fit);
            expect(image()).toHaveClass(expected);
            unmount();
        }
    });

    it("falls back to square corners", () => {
        render(<Image src={SOURCE} alt="A photograph" />);
        expect(image()).toHaveAttribute("data-border-radius", "none");
        expect(image()).toHaveClass("image-radius-none");
    });

    it("respects the borderRadius prop", () => {
        const radii = {
            none: "image-radius-none",
            small: "image-radius-small",
            medium: "image-radius-medium",
            large: "image-radius-large",
            full: "image-radius-full",
        } as const;

        for (const [borderRadius, expected] of Object.entries(radii)) {
            const { unmount } = render(
                <Image
                    src={SOURCE}
                    alt="A photograph"
                    borderRadius={borderRadius as ImageBorderRadius}
                />,
            );
            expect(image()).toHaveAttribute("data-border-radius", borderRadius);
            expect(image()).toHaveClass(expected);
            unmount();
        }
    });

    it("keeps the root class when a fit and a radius are asked for alongside it", () => {
        // The three classes answer three different things, so none of them displaces another
        // on the way through classNames
        render(<Image src={SOURCE} alt="A photograph" fit="contain" borderRadius="large" />);
        expect(image()).toHaveClass("image", "image-fit-contain", "image-radius-large");
    });

    it("puts the fallback in the place of a source that fails", () => {
        render(<Image src={SOURCE} alt="A photograph" fallbackSrc={FALLBACK} />);
        fireEvent.error(image());
        expect(image()).toHaveAttribute("src", FALLBACK);
        expect(image()).toHaveAttribute("data-fallback", "true");
    });

    it("keeps the source that failed where there is no fallback to put in its place", () => {
        render(<Image src={SOURCE} alt="A photograph" />);
        fireEvent.error(image());
        expect(image()).toHaveAttribute("src", SOURCE);
        expect(image()).not.toHaveAttribute("data-fallback");
    });

    it("gives a source put in the place of one that failed a chance of its own", () => {
        const { rerender } = render(
            <Image src={SOURCE} alt="A photograph" fallbackSrc={FALLBACK} />,
        );
        fireEvent.error(image());
        expect(image()).toHaveAttribute("src", FALLBACK);

        rerender(
            <Image
                src="https://example.com/another.png"
                alt="A photograph"
                fallbackSrc={FALLBACK}
            />,
        );
        expect(image()).toHaveAttribute("src", "https://example.com/another.png");
        expect(image()).not.toHaveAttribute("data-fallback");
    });

    it("still tells the caller that the source failed", () => {
        const onError = vi.fn();
        render(<Image src={SOURCE} alt="A photograph" fallbackSrc={FALLBACK} onError={onError} />);
        fireEvent.error(image());
        expect(onError).toHaveBeenCalledTimes(1);
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLImageElement>();
        render(<Image ref={ref} src={SOURCE} alt="A photograph" />);
        expect(ref.current).toBe(image());
    });

    it("merges a custom className onto the root element", () => {
        render(<Image src={SOURCE} alt="A photograph" className="custom" />);
        expect(image()).toHaveClass("custom");
    });

    it("passes extra props onto the root element", () => {
        render(<Image src={SOURCE} alt="A photograph" data-testid="image" />);
        expect(screen.getByTestId("image")).toBe(image());
    });
});
