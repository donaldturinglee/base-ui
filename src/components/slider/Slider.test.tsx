import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, jest } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { Slider } from ".";
import type { SliderSize } from "./Slider.types";

const slider = () => screen.getByRole("slider");

const fill = () => slider().style.getPropertyValue("--slider-fill");

const moveTo = (value: number) => {
    fireEvent.change(slider(), { target: { value: String(value) } });
};

describe("Slider", () => {
    it("renders a range input tagged as a Slider", () => {
        render(<Slider aria-label="Volume" />);

        expect(slider()).toHaveAttribute("type", "range");
        expect(slider()).toHaveAttribute("data-component", "Slider");
    });

    it("runs from 0 to 100 in steps of one by default", () => {
        render(<Slider aria-label="Volume" />);

        expect(slider()).toHaveAttribute("min", "0");
        expect(slider()).toHaveAttribute("max", "100");
        expect(slider()).toHaveAttribute("step", "1");
    });

    it("runs over whatever range it is given", () => {
        render(<Slider aria-label="Volume" min={10} max={20} step={2} defaultValue={14} />);

        expect(slider()).toHaveAttribute("min", "10");
        expect(slider()).toHaveAttribute("max", "20");
        expect(slider()).toHaveAttribute("step", "2");
        expect(slider()).toHaveValue("14");
    });

    it("starts at the bottom of its range", () => {
        render(<Slider aria-label="Volume" min={10} max={20} />);

        expect(slider()).toHaveValue("10");
        expect(fill()).toBe("0%");
    });

    it("starts where it is told to", () => {
        render(<Slider aria-label="Volume" defaultValue={25} />);

        expect(slider()).toHaveValue("25");
        expect(fill()).toBe("25%");
    });

    describe("the fill", () => {
        it("says how far along the track the slider stands", () => {
            render(<Slider aria-label="Volume" defaultValue={50} />);
            expect(fill()).toBe("50%");
        });

        it("is worked out against the range rather than against a hundred", () => {
            render(<Slider aria-label="Volume" min={10} max={20} defaultValue={15} />);
            expect(fill()).toBe("50%");
        });

        it("follows the slider as it moves", () => {
            render(<Slider aria-label="Volume" />);

            moveTo(80);
            expect(fill()).toBe("80%");
        });

        it("stays empty where the range has nowhere to go", () => {
            render(<Slider aria-label="Volume" min={5} max={5} defaultValue={5} />);
            expect(fill()).toBe("0%");
        });
    });

    describe("moving it", () => {
        it("reports the value it has moved to, and the event that moved it", () => {
            const onChange = jest.fn();
            render(<Slider aria-label="Volume" onChange={onChange} />);

            moveTo(40);

            expect(onChange.mock.calls[0][0]).toBe(40);
            expect(onChange.mock.calls[0][1]).toMatchObject({ type: "change" });
        });

        it("keeps its own value where the caller is not holding it", () => {
            render(<Slider aria-label="Volume" />);

            moveTo(40);
            expect(slider()).toHaveValue("40");
        });

        it("leaves a slider the caller is holding the value of where it was", () => {
            const onChange = jest.fn();
            render(<Slider aria-label="Volume" value={30} onChange={onChange} />);

            moveTo(40);

            expect(onChange).toHaveBeenCalledWith(40, expect.anything());
            expect(slider()).toHaveValue("30");
        });

        it("follows the caller where they are holding the value", () => {
            const { rerender } = render(<Slider aria-label="Volume" value={30} />);
            expect(fill()).toBe("30%");

            rerender(<Slider aria-label="Volume" value={70} />);
            expect(slider()).toHaveValue("70");
            expect(fill()).toBe("70%");
        });
    });

    describe("disabled", () => {
        it("stops the slider being used", () => {
            render(<Slider aria-label="Volume" disabled />);

            expect(slider()).toBeDisabled();
            expect(slider()).toHaveAttribute("data-disabled", "true");
        });

        it("fades the whole control rather than draining it", () => {
            render(<Slider aria-label="Volume" disabled />);

            expect(slider()).toHaveClass("disabled:opacity-[var(--slider-disabled-opacity)]");
            expect(slider()).toHaveClass("[--slider-disabled-opacity:0.5]");
        });

        it("keeps the colours it is drawn in, so where it stands is still clear", () => {
            render(<Slider aria-label="Volume" defaultValue={40} disabled />);

            expect(slider()).toHaveClass(
                "[--slider-fill-color:var(--control-checked-background-color-rest)]",
            );
            expect(slider()).toHaveClass(
                "[--slider-track-color:var(--control-track-background-color-rest)]",
            );
            expect(fill()).toBe("40%");
        });
    });

    describe("sizes", () => {
        const sizes: SliderSize[] = ["small", "medium", "large"];

        it("stands at the medium size by default", () => {
            render(<Slider aria-label="Volume" />);
            expect(slider()).toHaveAttribute("data-size", "medium");
        });

        it.each(sizes)("stands at the %s size", (size) => {
            render(<Slider aria-label="Volume" size={size} />);
            expect(slider()).toHaveAttribute("data-size", size);
        });

        it("sizes the track and the thumb from the size it stands at", () => {
            render(<Slider aria-label="Volume" size="large" />);

            expect(slider()).toHaveClass("[--slider-thumb-size:var(--base-size-20)]");
            expect(slider()).toHaveClass("[--slider-track-size:var(--base-size-8)]");
        });
    });

    it("fills the width of what it stands in when it is asked to", () => {
        render(<Slider aria-label="Volume" block />);

        expect(slider()).toHaveClass("w-full");
        expect(slider()).toHaveAttribute("data-block", "true");
    });

    it("is named by a label pointing at it", () => {
        render(
            <>
                <label htmlFor="volume">Volume</label>
                <Slider id="volume" />
            </>,
        );
        expect(screen.getByRole("slider", { name: "Volume" })).toBeInTheDocument();
    });

    it("says what its value stands for where the number alone would not", () => {
        render(<Slider aria-label="Volume" defaultValue={50} aria-valuetext="50 per cent" />);
        expect(slider()).toHaveAttribute("aria-valuetext", "50 per cent");
    });

    it("keeps a style of the caller's own alongside the fill", () => {
        render(<Slider aria-label="Volume" defaultValue={20} style={{ maxWidth: "10rem" }} />);

        expect(slider()).toHaveStyle({ maxWidth: "10rem" });
        expect(fill()).toBe("20%");
    });

    it("forwards a ref to the input", () => {
        const ref = React.createRef<HTMLInputElement>();
        render(<Slider aria-label="Volume" ref={ref} />);
        expect(ref.current).toBe(slider());
    });

    it("merges a custom className onto the input", () => {
        render(<Slider aria-label="Volume" className="custom" />);
        expect(slider()).toHaveClass("custom");
    });
});
