import * as React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Carousel } from ".";
import type { CarouselProps } from "./Carousel.types";

type TestProps = Partial<Omit<CarouselProps, "aria-label">> &
    Partial<Record<`data-${string}`, string>>;

const renderCarousel = (props: TestProps = {}, slides = ["One", "Two", "Three"]) =>
    render(
        <Carousel aria-label="Featured projects" {...props}>
            {slides.map((slide) => (
                <Carousel.Slide key={slide}>{slide}</Carousel.Slide>
            ))}
        </Carousel>,
    );

const carousel = () => screen.getByRole("region", { name: "Featured projects" });

const track = () => carousel().querySelector("[data-component='Carousel.Track']") as HTMLElement;

const slideAt = (position: number) => screen.getAllByRole("group")[position];

const button = (name: string) => screen.getByRole("button", { name });

const offset = () => track().style.getPropertyValue("--carousel-index");

describe("Carousel", () => {
    it("renders a named region that says what it is", () => {
        renderCarousel();

        expect(carousel()).toHaveAttribute("data-component", "Carousel");
        expect(carousel()).toHaveAttribute("aria-roledescription", "carousel");
    });

    it("lets the caller name the root element something else", () => {
        renderCarousel({ "data-component": "FeatureCarousel" });
        expect(carousel()).toHaveAttribute("data-component", "FeatureCarousel");
    });

    it("counts the slides it was given", () => {
        renderCarousel();

        expect(carousel()).toHaveAttribute("data-count", "3");
        expect(screen.getAllByRole("group")).toHaveLength(3);
    });

    it("says where in the run each slide stands", () => {
        renderCarousel();

        expect(slideAt(0)).toHaveAttribute("aria-roledescription", "slide");
        expect(slideAt(0)).toHaveAccessibleName("1 of 3");
        expect(slideAt(2)).toHaveAccessibleName("3 of 3");
    });

    it("opens on the first slide", () => {
        renderCarousel();

        expect(carousel()).toHaveAttribute("data-index", "0");
        expect(slideAt(0)).toHaveAttribute("data-current", "true");
        expect(offset()).toBe("0");
    });

    it("opens on whichever slide it is told to", () => {
        renderCarousel({ defaultIndex: 1 });

        expect(carousel()).toHaveAttribute("data-index", "1");
        expect(slideAt(1)).toHaveAttribute("data-current", "true");
        expect(offset()).toBe("1");
    });

    it("keeps a slide that has been stepped past out of the way", () => {
        renderCarousel();

        expect(slideAt(0)).not.toHaveAttribute("inert");
        expect(slideAt(1)).toHaveAttribute("inert");
    });

    describe("stepping through the run", () => {
        it("moves on a slide at a time", () => {
            renderCarousel();

            fireEvent.click(button("Next slide"));

            expect(carousel()).toHaveAttribute("data-index", "1");
            expect(offset()).toBe("1");
        });

        it("moves back a slide at a time", () => {
            renderCarousel({ defaultIndex: 2 });

            fireEvent.click(button("Previous slide"));

            expect(carousel()).toHaveAttribute("data-index", "1");
        });

        it("says which slide it has moved to and what moved it", () => {
            const onChange = vi.fn();
            renderCarousel({ onChange });

            fireEvent.click(button("Next slide"));

            expect(onChange).toHaveBeenCalledWith(1, "next");
        });

        it("goes straight to a slide from its dot", () => {
            const onChange = vi.fn();
            renderCarousel({ onChange });

            fireEvent.click(button("Slide 3"));

            expect(carousel()).toHaveAttribute("data-index", "2");
            expect(onChange).toHaveBeenCalledWith(2, "indicator");
        });

        it("stops at either end of a run that does not come round", () => {
            renderCarousel();

            expect(button("Previous slide")).toBeDisabled();
            expect(button("Next slide")).toBeEnabled();

            fireEvent.click(button("Slide 3"));

            expect(button("Previous slide")).toBeEnabled();
            expect(button("Next slide")).toBeDisabled();
        });

        it("carries on past either end of a run that comes round", () => {
            renderCarousel({ loop: true });

            expect(button("Previous slide")).toBeEnabled();

            fireEvent.click(button("Previous slide"));

            expect(carousel()).toHaveAttribute("data-index", "2");

            fireEvent.click(button("Next slide"));

            expect(carousel()).toHaveAttribute("data-index", "0");
        });
    });

    describe("held by the caller", () => {
        it("takes what is showing from the prop", () => {
            renderCarousel({ index: 2 });

            expect(carousel()).toHaveAttribute("data-index", "2");
            expect(slideAt(2)).toHaveAttribute("data-current", "true");
        });

        it("asks to be moved rather than moving itself", () => {
            const onChange = vi.fn();
            renderCarousel({ index: 0, onChange });

            fireEvent.click(button("Next slide"));

            expect(onChange).toHaveBeenCalledWith(1, "next");
            expect(carousel()).toHaveAttribute("data-index", "0");
        });
    });

    describe("the dots", () => {
        it("draws one for each slide, and marks the one being shown", () => {
            renderCarousel();

            expect(button("Slide 1")).toHaveAttribute("aria-current", "true");
            expect(button("Slide 2")).not.toHaveAttribute("aria-current");
        });

        it("draws none where there are no slides", () => {
            render(<Carousel aria-label="Empty" />);

            expect(screen.queryByRole("button", { name: /^Slide/ })).not.toBeInTheDocument();
        });
    });

    describe("the bar beneath the run", () => {
        it("holds the steps and the dots by default", () => {
            renderCarousel();

            expect(button("Previous slide")).toBeInTheDocument();
            expect(button("Next slide")).toBeInTheDocument();
            expect(button("Slide 1")).toBeInTheDocument();
        });

        it("leaves out the play button where the run cannot move by itself", () => {
            renderCarousel();

            expect(
                screen.queryByRole("button", { name: /automatic slide show/ }),
            ).not.toBeInTheDocument();
        });

        it("takes a bar of the caller's own in place of the default one", () => {
            render(
                <Carousel aria-label="Featured projects">
                    <Carousel.Slide>One</Carousel.Slide>
                    <Carousel.Slide>Two</Carousel.Slide>
                    <Carousel.Controls>
                        <Carousel.NextButton />
                    </Carousel.Controls>
                </Carousel>,
            );

            expect(button("Next slide")).toBeInTheDocument();
            expect(
                screen.queryByRole("button", { name: "Previous slide" }),
            ).not.toBeInTheDocument();
        });

        it("keeps the bar out of the run of slides", () => {
            renderCarousel();

            const controls = carousel().querySelector("[data-component='Carousel.Controls']");

            expect(track()).not.toContainElement(controls as HTMLElement);
        });

        it("stands anything else it was given below the bar", () => {
            render(
                <Carousel aria-label="Featured projects">
                    <Carousel.Slide>One</Carousel.Slide>
                    <p>A caption of my own</p>
                </Carousel>,
            );

            const caption = screen.getByText("A caption of my own");

            expect(carousel()).toContainElement(caption);
            expect(track()).not.toContainElement(caption);
        });
    });

    describe("moving on by itself", () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it("moves on once the slide has been held long enough", () => {
            const onChange = vi.fn();
            renderCarousel({ autoPlay: true, interval: 1000, loop: true, onChange });

            act(() => {
                vi.advanceTimersByTime(1000);
            });

            expect(onChange).toHaveBeenCalledWith(1, "auto");
            expect(carousel()).toHaveAttribute("data-index", "1");
        });

        it("holds still until it is told to move on", () => {
            renderCarousel({ interval: 1000, loop: true });

            act(() => {
                vi.advanceTimersByTime(5000);
            });

            expect(carousel()).toHaveAttribute("data-index", "0");
        });

        it("stops at the end of a run that does not come round", () => {
            renderCarousel({ autoPlay: true, interval: 1000, defaultIndex: 2 });

            act(() => {
                vi.advanceTimersByTime(3000);
            });

            expect(carousel()).toHaveAttribute("data-index", "2");
            expect(carousel()).not.toHaveAttribute("data-playing");
        });

        it("holds still while a pointer is on it", () => {
            renderCarousel({ autoPlay: true, interval: 1000, loop: true });

            fireEvent.mouseEnter(carousel());

            act(() => {
                vi.advanceTimersByTime(3000);
            });

            expect(carousel()).toHaveAttribute("data-index", "0");

            fireEvent.mouseLeave(carousel());

            act(() => {
                vi.advanceTimersByTime(1000);
            });

            expect(carousel()).toHaveAttribute("data-index", "1");
        });

        it("holds still while something inside it has focus", () => {
            renderCarousel({ autoPlay: true, interval: 1000, loop: true });

            fireEvent.focus(button("Next slide"));

            act(() => {
                vi.advanceTimersByTime(3000);
            });

            expect(carousel()).toHaveAttribute("data-index", "0");
        });

        it("is stopped for good by the play button", () => {
            renderCarousel({ autoPlay: true, interval: 1000, loop: true });

            fireEvent.click(button("Stop automatic slide show"));

            act(() => {
                vi.advanceTimersByTime(3000);
            });

            expect(carousel()).toHaveAttribute("data-index", "0");
            expect(button("Start automatic slide show")).toBeInTheDocument();
        });

        it("leaves the run alone while it is moving, and announces it once it is not", () => {
            renderCarousel({ autoPlay: true, interval: 1000, loop: true });

            const viewport = carousel().querySelector("[data-component='Carousel.Viewport']");

            expect(viewport).toHaveAttribute("aria-live", "off");

            fireEvent.click(button("Stop automatic slide show"));

            expect(viewport).toHaveAttribute("aria-live", "polite");
        });
    });
});
