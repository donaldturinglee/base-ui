import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { ProgressCircle } from ".";
import type { ProgressCircleVariant } from "./ProgressCircle.types";

const circle = () => screen.getByRole("progressbar");

const ring = () => circle().querySelector("svg");

const track = () => circle().querySelector(".progress-circle-track");

const indicator = () => circle().querySelector(".progress-circle-indicator");

const label = () => circle().querySelector(".progress-circle-label");

describe("ProgressCircle", () => {
    it("renders a span element by default", () => {
        render(<ProgressCircle progress={50} />);
        expect(circle().tagName).toBe("SPAN");
    });

    it("renders as the element passed to the as prop", () => {
        render(<ProgressCircle as="div" progress={50} />);
        expect(circle().tagName).toBe("DIV");
    });

    it("forwards element specific props to the element passed to the as prop", () => {
        render(<ProgressCircle as="a" href="https://example.com" progress={50} />);
        expect(circle()).toHaveAttribute("href", "https://example.com");
    });

    it("tags the root element with a data-component attribute", () => {
        render(<ProgressCircle progress={50} />);
        expect(circle()).toHaveAttribute("data-component", "ProgressCircle");
    });

    it("exposes a progressbar role for assistive technology", () => {
        render(<ProgressCircle progress={50} />);
        expect(circle()).toBeInTheDocument();
    });

    it("derives aria-valuenow from the progress", () => {
        render(<ProgressCircle progress={50} />);
        expect(circle()).toHaveAttribute("aria-valuenow", "50");
    });

    it("rounds a fractional progress for aria-valuenow", () => {
        render(<ProgressCircle progress={49.6} />);
        expect(circle()).toHaveAttribute("aria-valuenow", "50");
    });

    it("lets an explicit aria-valuenow win over the progress", () => {
        render(<ProgressCircle progress={80} aria-valuenow={20} />);
        expect(circle()).toHaveAttribute("aria-valuenow", "20");
    });

    it("reports a progress of zero as aria-valuenow", () => {
        render(<ProgressCircle progress={0} />);
        expect(circle()).toHaveAttribute("aria-valuenow", "0");
    });

    it("bounds the ring between aria-valuemin and aria-valuemax", () => {
        render(<ProgressCircle progress={50} />);
        expect(circle()).toHaveAttribute("aria-valuemin", "0");
        expect(circle()).toHaveAttribute("aria-valuemax", "100");
    });

    it("passes the aria-label onto the root element", () => {
        render(<ProgressCircle progress={80} aria-label="Upload test.png" />);
        expect(circle()).toHaveAttribute("aria-label", "Upload test.png");
    });

    it("passes the aria-valuetext onto the root element", () => {
        render(<ProgressCircle progress={80} aria-valuetext="80 percent" />);
        expect(circle()).toHaveAttribute("aria-valuetext", "80 percent");
    });

    it("sets the drawn length from the progress", () => {
        render(<ProgressCircle progress={75} />);
        expect(circle()).toHaveStyle({ "--progress-circle-progress": "75" });
    });

    it("draws an empty ring when no progress is given", () => {
        render(<ProgressCircle />);
        expect(circle()).toHaveStyle({ "--progress-circle-progress": "0" });
        expect(circle()).toHaveAttribute("aria-valuenow", "0");
    });

    it("brings a progress past the end of the track back to it", () => {
        render(<ProgressCircle progress={140} />);
        expect(circle()).toHaveStyle({ "--progress-circle-progress": "100" });
        expect(circle()).toHaveAttribute("aria-valuenow", "100");
    });

    it("brings a progress below the start of the track back to it", () => {
        render(<ProgressCircle progress={-20} />);
        expect(circle()).toHaveStyle({ "--progress-circle-progress": "0" });
        expect(circle()).toHaveAttribute("aria-valuenow", "0");
    });

    it("draws the track and the arc from a path normalised to a hundred units", () => {
        render(<ProgressCircle progress={50} />);
        expect(track()).toHaveAttribute("pathLength", "100");
        expect(indicator()).toHaveAttribute("pathLength", "100");
    });

    it("keeps the ring from a screen reader, since the value already says what it says", () => {
        render(<ProgressCircle progress={50} />);
        expect(ring()).toHaveAttribute("aria-hidden", "true");
    });

    it("falls back to the medium size when none is provided", () => {
        render(<ProgressCircle progress={50} />);
        expect(circle()).toHaveAttribute("data-size", "medium");
        expect(circle()).toHaveClass("progress-circle-medium");
    });

    it("respects the size prop", () => {
        const sizes = {
            small: "progress-circle-small",
            medium: "progress-circle-medium",
            large: "progress-circle-large",
        } as const;

        for (const [size, expected] of Object.entries(sizes)) {
            const { unmount } = render(
                <ProgressCircle progress={50} size={size as keyof typeof sizes} />,
            );
            expect(circle()).toHaveAttribute("data-size", size);
            expect(circle()).toHaveClass(expected);
            unmount();
        }
    });

    it("fills the ring with a success arc by default", () => {
        render(<ProgressCircle progress={50} />);
        expect(circle()).toHaveAttribute("data-variant", "success");
        expect(circle()).toHaveClass("progress-circle-success");
    });

    it("respects the variant prop", () => {
        const variants: ProgressCircleVariant[] = [
            "accent",
            "attention",
            "danger",
            "done",
            "neutral",
            "severe",
            "sponsors",
            "success",
        ];

        for (const variant of variants) {
            const { unmount } = render(<ProgressCircle progress={50} variant={variant} />);
            expect(circle()).toHaveAttribute("data-variant", variant);
            expect(circle()).toHaveClass(`progress-circle-${variant}`);
            unmount();
        }
    });

    it("keeps the colour and the size apart, so neither displaces the other", () => {
        render(<ProgressCircle progress={50} variant="accent" size="large" />);
        expect(circle()).toHaveClass(
            "progress-circle",
            "progress-circle-accent",
            "progress-circle-large",
        );
    });

    it("lays the children in the middle of the ring", () => {
        render(<ProgressCircle progress={66}>66%</ProgressCircle>);
        expect(label()).toHaveTextContent("66%");
    });

    it("draws no label when no children are given", () => {
        render(<ProgressCircle progress={66} />);
        expect(label()).toBeNull();
    });

    it("does not leak the progress, size and variant props onto the element", () => {
        render(<ProgressCircle progress={50} size="small" variant="accent" />);
        expect(circle()).not.toHaveAttribute("progress");
        expect(circle()).not.toHaveAttribute("size");
        expect(circle()).not.toHaveAttribute("variant");
    });

    it("keeps a style passed in alongside the one it draws the arc with", () => {
        render(<ProgressCircle progress={50} style={{ opacity: 0.5 }} />);
        expect(circle()).toHaveStyle({ opacity: "0.5" });
        expect(circle()).toHaveStyle({ "--progress-circle-progress": "50" });
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLSpanElement>();
        render(<ProgressCircle ref={ref} progress={50} />);
        expect(ref.current).toBe(circle());
    });

    it("merges a custom className onto the root element", () => {
        render(<ProgressCircle className="custom" progress={50} />);
        expect(circle()).toHaveClass("progress-circle", "custom");
    });

    it("passes extra props onto the root element", () => {
        render(<ProgressCircle id="upload-progress" progress={50} />);
        expect(circle()).toHaveAttribute("id", "upload-progress");
    });
});
