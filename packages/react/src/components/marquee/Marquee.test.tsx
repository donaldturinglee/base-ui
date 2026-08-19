import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Marquee } from ".";
import { useMarquee } from "./useMarquee";
import type { MarqueeProps, MarqueeSide, MarqueeSpacing, MarqueeSpeed } from "./Marquee.types";

const originalResizeObserver = window.ResizeObserver;

// Everything jsdom measures is zero, so the run and the copy inside it are given sizes of their
// own. They are told apart by the class each carries. Height follows width unless the two are
// given apart, which is how the axis a run was measured by is told
const measureAs = (
    rootWidth: number,
    groupWidth: number,
    rootHeight = rootWidth,
    groupHeight = groupWidth,
) => {
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (
        this: Element,
    ) {
        const isGroup = this.classList.contains("marquee-group");
        const width = isGroup ? groupWidth : rootWidth;
        const height = isGroup ? groupHeight : rootHeight;

        return {
            width,
            height,
            top: 0,
            left: 0,
            right: width,
            bottom: height,
            x: 0,
            y: 0,
            toJSON: () => ({}),
        } as DOMRect;
    });
};

const renderMarquee = (props: Partial<MarqueeProps> = {}) =>
    render(
        <Marquee data-testid="marquee" {...props}>
            <span>Item</span>
        </Marquee>,
    );

const root = () => screen.getByTestId("marquee");

const groups = () => Array.from(root().querySelectorAll("[data-component='Marquee.Group']"));

describe("Marquee", () => {
    // jsdom has no ResizeObserver, and the run watches its own size so it can be measured again
    // as it grows
    beforeEach(() => {
        window.ResizeObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
        } as unknown as typeof ResizeObserver;
    });

    afterEach(() => {
        vi.restoreAllMocks();
        window.ResizeObserver = originalResizeObserver;
    });

    it("tags the root element with a data-component attribute", () => {
        renderMarquee();
        expect(root()).toHaveAttribute("data-component", "Marquee");
    });

    it("draws the content it is given", () => {
        renderMarquee();
        expect(screen.getAllByText("Item").length).toBeGreaterThan(0);
    });

    it("stands the content on a track of its own", () => {
        renderMarquee();

        const track = root().firstElementChild;
        expect(track).toHaveClass("marquee-track");
        expect(track?.children.length).toBe(groups().length);
    });

    describe("the copies the loop is made of", () => {
        it("makes at least two, since one cannot follow itself", () => {
            renderMarquee();
            expect(groups().length).toBeGreaterThanOrEqual(2);
        });

        it("makes enough to fill the run and one more to come round behind them", () => {
            measureAs(600, 120);
            renderMarquee();

            // Five copies of 120 cover the 600 the run is wide, and a sixth follows them
            expect(groups().length).toBe(6);
        });

        it("still makes two where the content is wider than the run", () => {
            measureAs(100, 400);
            renderMarquee();

            expect(groups().length).toBe(2);
        });

        it("reads the content once rather than once for every copy", () => {
            measureAs(600, 120);
            renderMarquee();

            const [first, ...rest] = groups();
            expect(first).not.toHaveAttribute("aria-hidden");
            rest.forEach((group) => {
                expect(group).toHaveAttribute("aria-hidden", "true");
            });
        });
    });

    describe("how far and how fast it travels", () => {
        it("travels the width of one copy, so the next stands where the last one was", () => {
            measureAs(600, 120);
            renderMarquee();

            expect(root().style.getPropertyValue("--marquee-distance")).toBe("120px");
        });

        it("takes as long as that distance at the speed it was given", () => {
            measureAs(600, 120);
            renderMarquee({ speed: "medium" });

            // 120 pixels at 60 a second
            expect(root().style.getPropertyValue("--marquee-duration")).toBe("2s");
        });

        it("takes longer over the same distance at a slower speed", () => {
            measureAs(600, 120);
            renderMarquee({ speed: "slow" });

            expect(root().style.getPropertyValue("--marquee-duration")).toBe("4s");
        });

        it("takes less over the same distance at a faster speed", () => {
            measureAs(600, 120);
            renderMarquee({ speed: "fast" });

            expect(root().style.getPropertyValue("--marquee-duration")).toBe("1s");
        });

        it("records the speed it was asked for", () => {
            renderMarquee({ speed: "fast" });
            expect(root()).toHaveAttribute("data-speed", "fast");
        });
    });

    describe("which side it travels towards", () => {
        it("travels towards the start of the line by default", () => {
            renderMarquee();

            expect(root()).toHaveClass("marquee-inline");
            expect(root()).not.toHaveClass("marquee-reversed");
            expect(root()).toHaveAttribute("data-side", "start");
            expect(root()).toHaveAttribute("data-axis", "inline");
        });

        it("runs the same travel backwards to reach the end of the line", () => {
            renderMarquee({ side: "end" });

            expect(root()).toHaveClass("marquee-inline", "marquee-reversed");
            expect(root()).toHaveAttribute("data-side", "end");
            expect(root()).toHaveAttribute("data-axis", "inline");
        });

        it("lays itself out down the page to travel to the top", () => {
            renderMarquee({ side: "top" });

            expect(root()).toHaveClass("marquee-block");
            expect(root()).not.toHaveClass("marquee-reversed");
            expect(root()).toHaveAttribute("data-side", "top");
            expect(root()).toHaveAttribute("data-axis", "block");
        });

        it("runs that travel backwards to reach the bottom", () => {
            renderMarquee({ side: "bottom" });

            expect(root()).toHaveClass("marquee-block", "marquee-reversed");
            expect(root()).toHaveAttribute("data-side", "bottom");
            expect(root()).toHaveAttribute("data-axis", "block");
        });

        it("is measured along the line where it travels along the line", () => {
            // The run is 600 by 300 and a copy of it 120 by 60
            measureAs(600, 120, 300, 60);
            renderMarquee({ side: "start" });

            expect(root().style.getPropertyValue("--marquee-distance")).toBe("120px");
            expect(groups().length).toBe(6);
        });

        it("is measured down the page where it travels down the page", () => {
            measureAs(600, 120, 300, 60);
            renderMarquee({ side: "top" });

            expect(root().style.getPropertyValue("--marquee-distance")).toBe("60px");
            expect(groups().length).toBe(6);
        });
    });

    describe("the room between the items", () => {
        const spacings: MarqueeSpacing[] = [
            "none",
            "tight",
            "condensed",
            "cozy",
            "normal",
            "spacious",
        ];

        it.each(spacings)("leaves %s room where it is asked for", (spacing) => {
            renderMarquee({ spacing });

            expect(root()).toHaveClass(`marquee-spacing-${spacing}`);
            expect(root()).toHaveAttribute("data-spacing", spacing);
        });

        it("leaves the spacing to the stylesheet where it is given none", () => {
            renderMarquee();

            // Nothing is written onto the run, so it falls back to the room a Stack leaves
            spacings.forEach((spacing) => {
                expect(root()).not.toHaveClass(`marquee-spacing-${spacing}`);
            });
            expect(root()).not.toHaveAttribute("data-spacing");
        });

        it("spaces the copies apart by the same room it spaces the items by", () => {
            renderMarquee({ spacing: "spacious" });

            // The room a copy leaves for the next one is carried by the copy itself, so both
            // are settled by the one class on the run
            expect(root()).toHaveClass("marquee-spacing-spacious");
            expect(groups()[0]).toHaveClass("marquee-group");
        });
    });

    describe("holding it still", () => {
        it("stops for the pointer by default", () => {
            renderMarquee();
            expect(root()).toHaveClass("marquee-pause-on-hover");
        });

        it("keeps going under the pointer where it is told to", () => {
            renderMarquee({ pauseOnHover: false });
            expect(root()).not.toHaveClass("marquee-pause-on-hover");
        });

        it("stands still where the caller is holding it", () => {
            renderMarquee({ paused: true });

            expect(root()).toHaveClass("marquee-paused");
            expect(root()).toHaveAttribute("data-paused", "true");
        });

        it("travels while the caller is not", () => {
            renderMarquee();

            expect(root()).not.toHaveClass("marquee-paused");
            expect(root()).toHaveAttribute("data-paused", "false");
        });
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLDivElement>();

        render(
            <Marquee ref={ref} data-testid="marquee">
                <span>Item</span>
            </Marquee>,
        );

        expect(ref.current).toBe(root());
    });

    it("merges a custom className onto the root element", () => {
        renderMarquee({ className: "custom" });
        expect(root()).toHaveClass("marquee", "custom");
    });

    it("keeps a style of the caller's own alongside what the loop is worked from", () => {
        measureAs(600, 120);
        renderMarquee({ style: { opacity: 0.5 } });

        expect(root().style.opacity).toBe("0.5");
        expect(root().style.getPropertyValue("--marquee-distance")).toBe("120px");
    });
});

// The hook is handed out on its own, so it is exercised on its own: a run laid out by hand
// rather than by the component should still be worked out the same way
describe("useMarquee", () => {
    const CustomMarquee = ({ speed, side }: { speed?: MarqueeSpeed; side?: MarqueeSide }) => {
        const { rootRef, groupRef, axis, copies, distance, duration, style } = useMarquee({
            speed,
            side,
        });

        return (
            <div
                ref={rootRef}
                style={style}
                data-testid="custom"
                data-axis={axis}
                data-copies={copies}
                data-distance={distance}
                data-duration={duration}
            >
                {Array.from({ length: copies }, (_, index) => (
                    <div
                        key={index}
                        ref={index === 0 ? groupRef : undefined}
                        className="marquee-group"
                    >
                        Item
                    </div>
                ))}
            </div>
        );
    };

    const custom = () => screen.getByTestId("custom");

    beforeEach(() => {
        window.ResizeObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
        } as unknown as typeof ResizeObserver;
    });

    afterEach(() => {
        vi.restoreAllMocks();
        window.ResizeObserver = originalResizeObserver;
    });

    it("measures how far the track has to travel", () => {
        measureAs(600, 120);
        render(<CustomMarquee />);

        expect(custom()).toHaveAttribute("data-distance", "120");
    });

    it("works out how long that takes at the speed it was given", () => {
        measureAs(600, 120);
        render(<CustomMarquee speed="fast" />);

        // 120 pixels at 120 a second
        expect(custom()).toHaveAttribute("data-duration", "1");
    });

    it("works out how many copies it takes to keep the run from emptying", () => {
        measureAs(600, 120);
        render(<CustomMarquee />);

        expect(custom()).toHaveAttribute("data-copies", "6");
    });

    it("hands both measurements over as custom properties, ready to go on the run", () => {
        measureAs(600, 120);
        render(<CustomMarquee />);

        expect(custom().style.getPropertyValue("--marquee-distance")).toBe("120px");
        expect(custom().style.getPropertyValue("--marquee-duration")).toBe("2s");
    });

    it("holds at the fewest copies a loop can be made of until it has been measured", () => {
        render(<CustomMarquee />);

        // Everything jsdom measures is zero, so there is nothing to work a copy count from
        expect(custom()).toHaveAttribute("data-copies", "2");
        expect(custom()).toHaveAttribute("data-distance", "0");
    });

    it.each([
        ["start", "inline"],
        ["end", "inline"],
        ["top", "block"],
        ["bottom", "block"],
    ] as [MarqueeSide, string][])(
        "lays a run travelling to the %s out along the %s axis",
        (side, axis) => {
            render(<CustomMarquee side={side} />);
            expect(custom()).toHaveAttribute("data-axis", axis);
        },
    );

    it("measures the axis it travels along rather than always the width", () => {
        measureAs(600, 120, 300, 60);
        render(<CustomMarquee side="bottom" />);

        expect(custom()).toHaveAttribute("data-distance", "60");
    });
});
