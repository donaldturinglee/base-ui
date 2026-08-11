import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, jest } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { ProgressBar } from ".";
import type { ProgressBarVariant } from "./ProgressBar.types";

describe("ProgressBar", () => {
    it("renders a span element by default", () => {
        render(<ProgressBar progress={50} data-testid="progress-bar" />);
        expect(screen.getByTestId("progress-bar").tagName).toBe("SPAN");
    });

    it("renders as the element passed to the as prop", () => {
        render(<ProgressBar as="div" progress={50} data-testid="progress-bar" />);
        expect(screen.getByTestId("progress-bar").tagName).toBe("DIV");
    });

    it("tags the track and the item with data-component attributes", () => {
        render(<ProgressBar progress={50} data-testid="progress-bar" />);
        const track = screen.getByTestId("progress-bar");
        expect(track).toHaveAttribute("data-component", "ProgressBar");
        expect(screen.getByRole("progressbar")).toHaveAttribute(
            "data-component",
            "ProgressBar.Item",
        );
    });

    it("respects the size prop", () => {
        const sizes = {
            small: "progress-bar-small",
            medium: "progress-bar-medium",
            large: "progress-bar-large",
        };

        for (const [size, expected] of Object.entries(sizes)) {
            const { unmount } = render(
                <ProgressBar
                    progress={50}
                    size={size as keyof typeof sizes}
                    data-testid="progress-bar"
                />,
            );
            const track = screen.getByTestId("progress-bar");
            expect(track).toHaveAttribute("data-size", size);
            expect(track).toHaveClass(expected);
            unmount();
        }
    });

    it("respects the inline prop", () => {
        render(<ProgressBar inline progress={50} data-testid="progress-bar" />);
        const track = screen.getByTestId("progress-bar");
        expect(track).toHaveAttribute("data-inline", "true");
        expect(track).toHaveClass("progress-bar-inline");
    });

    it("leaves the inline attribute unset by default", () => {
        render(<ProgressBar progress={50} data-testid="progress-bar" />);
        expect(screen.getByTestId("progress-bar")).not.toHaveAttribute("data-inline");
    });

    it("passes the aria-label down to the item", () => {
        render(<ProgressBar progress={80} aria-label="Upload test.png" />);
        expect(screen.getByRole("progressbar")).toHaveAttribute("aria-label", "Upload test.png");
    });

    it("passes the aria-valuetext down to the item", () => {
        render(<ProgressBar aria-valuetext="80 percent" />);
        expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuetext", "80 percent");
    });

    it("derives aria-valuenow from the progress", () => {
        render(<ProgressBar progress={50} />);
        expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "50");
    });

    it("lets an explicit aria-valuenow win over the progress", () => {
        render(<ProgressBar progress={80} aria-valuenow={20} />);
        expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "20");
    });

    it("reports a progress of zero as aria-valuenow", () => {
        render(<ProgressBar progress={0} />);
        expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
    });

    it("bounds the item between aria-valuemin and aria-valuemax", () => {
        render(<ProgressBar progress={50} />);
        const item = screen.getByRole("progressbar");
        expect(item).toHaveAttribute("aria-valuemin", "0");
        expect(item).toHaveAttribute("aria-valuemax", "100");
    });

    it("sets the item width from the progress", () => {
        render(<ProgressBar progress={75} />);
        expect(screen.getByRole("progressbar")).toHaveStyle({
            "--progress-bar-item-width": "75%",
        });
    });

    it("fills the track with a success segment by default", () => {
        render(<ProgressBar progress={50} />);
        const item = screen.getByRole("progressbar");
        expect(item).toHaveAttribute("data-variant", "success");
        expect(item).toHaveClass("progress-bar-item-success");
    });

    it("respects the variant prop", () => {
        const variants: ProgressBarVariant[] = [
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
            const { unmount } = render(<ProgressBar progress={50} variant={variant} />);
            expect(screen.getByRole("progressbar")).toHaveClass(`progress-bar-item-${variant}`);
            unmount();
        }
    });

    it("animates the item when animated", () => {
        render(<ProgressBar progress={50} animated />);
        const item = screen.getByRole("progressbar");
        expect(item).toHaveAttribute("data-animated", "true");
        expect(item).toHaveClass("motion-safe:shimmer");
    });

    it("leaves the item unanimated by default", () => {
        render(<ProgressBar progress={50} />);
        const item = screen.getByRole("progressbar");
        expect(item).not.toHaveAttribute("data-animated");
        expect(item).not.toHaveClass("motion-safe:shimmer");
    });

    it("renders the children in place of the generated item", () => {
        render(
            <ProgressBar aria-label="Storage usage">
                <ProgressBar.Item progress={30} variant="danger" aria-label="Photos" />
                <ProgressBar.Item progress={20} variant="accent" aria-label="Music" />
            </ProgressBar>,
        );

        const items = screen.getAllByRole("progressbar");
        expect(items).toHaveLength(2);
        expect(items[0]).toHaveClass("progress-bar-item-danger");
        expect(items[1]).toHaveClass("progress-bar-item-accent");
        expect(items[0]).toHaveStyle({ "--progress-bar-item-width": "30%" });
    });

    it("does not pass the aria-label down when children are provided", () => {
        render(
            <ProgressBar aria-label="Storage usage">
                <ProgressBar.Item progress={80} />
            </ProgressBar>,
        );
        expect(screen.getByRole("progressbar")).not.toHaveAttribute("aria-label");
    });

    it("throws when both progress and children are passed", () => {
        const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

        expect(() =>
            render(
                <ProgressBar progress={50}>
                    <ProgressBar.Item progress={50} />
                </ProgressBar>,
            ),
        ).toThrow(/not both/);

        consoleError.mockRestore();
    });

    it("forwards a ref to the track element", () => {
        const ref = React.createRef<HTMLSpanElement>();
        render(<ProgressBar ref={ref} progress={50} />);
        expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });

    it("merges a custom className onto the track element", () => {
        render(<ProgressBar className="custom" progress={50} data-testid="progress-bar" />);
        expect(screen.getByTestId("progress-bar")).toHaveClass("custom");
    });
});

describe("ProgressBar.Item", () => {
    it("forwards a ref to the item element", () => {
        const ref = React.createRef<HTMLSpanElement>();
        render(
            <ProgressBar>
                <ProgressBar.Item ref={ref} progress={50} />
            </ProgressBar>,
        );
        expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });

    it("merges a custom className onto the item element", () => {
        render(
            <ProgressBar>
                <ProgressBar.Item className="custom" progress={50} />
            </ProgressBar>,
        );
        expect(screen.getByRole("progressbar")).toHaveClass("custom");
    });

    it("renders an empty segment when no progress is given", () => {
        render(
            <ProgressBar>
                <ProgressBar.Item />
            </ProgressBar>,
        );
        const item = screen.getByRole("progressbar");
        expect(item).toHaveStyle({ "--progress-bar-item-width": "0%" });
        expect(item).toHaveAttribute("aria-valuenow", "0");
    });
});
