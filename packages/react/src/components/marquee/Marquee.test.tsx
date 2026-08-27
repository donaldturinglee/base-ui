import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Marquee, useMarquee, useMarqueeContext } from ".";
import type { MarqueeProps, UseMarqueeProps } from "./Marquee.types";

const originalResizeObserver = window.ResizeObserver;
const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth");

// jsdom lays nothing out, so a run has no length to be timed by and no window to be drawn out to
// fill. Both are stood in here, and each part is given the size the part it is standing for
// would have had
const setSizes = ({ viewport, copy }: { viewport: number; copy: number }) => {
    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
        configurable: true,
        get(this: HTMLElement) {
            return this.dataset.component === "Marquee.Viewport" ? viewport : 0;
        },
    });

    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
        configurable: true,
        get(this: HTMLElement) {
            return this.dataset.component === "Marquee.Content" ? copy : 0;
        },
    });
};

type TestProps = Partial<MarqueeProps> & Partial<Record<`data-${string}`, string>>;

const run = (
    <Marquee.Viewport>
        <Marquee.Content>
            <Marquee.Item>Apple</Marquee.Item>
            <Marquee.Item>Banana</Marquee.Item>
        </Marquee.Content>
    </Marquee.Viewport>
);

const marquee = (props: TestProps = {}, extras?: React.ReactNode) => (
    <Marquee {...props}>
        {run}
        {extras}
    </Marquee>
);

const root = () => document.querySelector('[data-component="Marquee"]') as HTMLElement;

const viewport = () => document.querySelector('[data-component="Marquee.Viewport"]');

const copies = () =>
    Array.from(document.querySelectorAll<HTMLElement>('[data-component="Marquee.Content"]'));

const items = () =>
    Array.from(document.querySelectorAll<HTMLElement>('[data-component="Marquee.Item"]'));

const edges = () =>
    Array.from(document.querySelectorAll<HTMLElement>('[data-component="Marquee.Edge"]'));

const variable = (name: string) => root().style.getPropertyValue(name);

beforeEach(() => {
    // jsdom has no ResizeObserver, and a run watches both its window and itself so it can be
    // timed again as either changes
    window.ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
    } as unknown as typeof ResizeObserver;
});

afterEach(() => {
    window.ResizeObserver = originalResizeObserver;

    if (originalOffsetWidth) {
        Object.defineProperty(HTMLElement.prototype, "offsetWidth", originalOffsetWidth);
    }

    Reflect.deleteProperty(HTMLElement.prototype, "clientWidth");
});

describe("Marquee", () => {
    it("renders a plain box by default", () => {
        render(marquee());
        expect(root().tagName).toBe("DIV");
    });

    it("renders as whatever it is told to", () => {
        render(<Marquee as="section">{run}</Marquee>);
        expect(root().tagName).toBe("SECTION");
    });

    it("tags the marquee and its parts with data-component attributes", () => {
        render(marquee());

        expect(root()).toBeInTheDocument();
        expect(viewport()).toBeInTheDocument();
        expect(copies()).toHaveLength(2);
        expect(items()).toHaveLength(4);
    });

    it("lets the caller name the root element something else", () => {
        render(marquee({ "data-component": "SponsorMarquee" }));
        expect(document.querySelector('[data-component="SponsorMarquee"]')).toBeInTheDocument();
    });

    it("keeps the class it was given alongside its own", () => {
        render(marquee({ className: "sponsors" }));
        expect(root()).toHaveClass("marquee", "sponsors");
    });

    it("reads across towards the start of the line by default", () => {
        render(marquee());

        expect(root()).toHaveAttribute("data-orientation", "horizontal");
        expect(root()).toHaveAttribute("data-side", "start");
    });

    it("reads down where it is headed for the top or the bottom", () => {
        render(marquee({ side: "bottom" }));

        expect(root()).toHaveAttribute("data-orientation", "vertical");
        expect(root()).toHaveAttribute("data-side", "bottom");
    });

    it("sends the run the other way when it is told to", () => {
        render(marquee({ reverse: true }));
        expect(root()).toHaveAttribute("data-reverse", "true");
    });

    describe("the parts the run is made of", () => {
        it("gives every part a class of its own", () => {
            render(marquee());

            expect(viewport()).toHaveClass("marquee-viewport");
            expect(copies()[0]).toHaveClass("marquee-content");
            expect(items()[0]).toHaveClass("marquee-item");
        });

        it("lets a part be drawn as whatever it is told to", () => {
            render(
                <Marquee>
                    <Marquee.Viewport as="section">
                        <Marquee.Content as="ul">
                            <Marquee.Item as="li">Apple</Marquee.Item>
                        </Marquee.Content>
                    </Marquee.Viewport>
                </Marquee>,
            );

            expect(viewport()?.tagName).toBe("SECTION");
            expect(copies()[0].tagName).toBe("UL");
            expect(items()[0].tagName).toBe("LI");
        });

        it("draws a run standing outside a marquee the once", () => {
            render(
                <Marquee.Content>
                    <Marquee.Item>Apple</Marquee.Item>
                </Marquee.Content>,
            );

            expect(copies()).toHaveLength(1);
            expect(screen.getAllByText("Apple")).toHaveLength(1);
        });

        it("fades the run out at whichever edge it is given", () => {
            render(
                <Marquee>
                    <Marquee.Edge side="start" />
                    {run}
                    <Marquee.Edge side="end" />
                </Marquee>,
            );

            expect(edges()).toHaveLength(2);
            expect(edges()[0]).toHaveAttribute("data-side", "start");
            expect(edges()[1]).toHaveAttribute("data-side", "end");
        });

        it("says nothing to a reader who cannot see the edge", () => {
            render(
                <Marquee>
                    <Marquee.Edge side="top" />
                    {run}
                </Marquee>,
            );

            expect(edges()[0]).toHaveAttribute("aria-hidden", "true");
            expect(edges()[0]).toHaveClass("marquee-edge");
        });
    });

    describe("the copies the run stands in", () => {
        it("lays the run out twice, so that one copy follows the other", () => {
            render(marquee());

            expect(copies()).toHaveLength(2);
            expect(screen.getAllByText("Apple")).toHaveLength(2);
        });

        it("reads the first copy and no other", () => {
            render(marquee());

            expect(copies()[0]).not.toHaveAttribute("aria-hidden");
            expect(copies()[0]).not.toHaveAttribute("inert");

            expect(copies()[1]).toHaveAttribute("aria-hidden", "true");
            expect(copies()[1]).toHaveAttribute("inert");
        });

        it("draws out as many copies as the window takes when it is asked to fill it", () => {
            setSizes({ viewport: 300, copy: 100 });
            render(marquee({ autoFill: true }));

            expect(copies()).toHaveLength(4);
        });

        it("stands in two copies where a run already fills the window", () => {
            setSizes({ viewport: 100, copy: 400 });
            render(marquee({ autoFill: true }));

            expect(copies()).toHaveLength(2);
        });

        it("leaves a run that was not asked to fill the window in two copies", () => {
            setSizes({ viewport: 300, copy: 100 });
            render(marquee());

            expect(copies()).toHaveLength(2);
        });
    });

    describe("timing the run", () => {
        it("times a copy by how long it is and how fast it was asked to travel", () => {
            setSizes({ viewport: 300, copy: 200 });
            render(marquee({ speed: 50 }));

            expect(variable("--marquee-duration")).toBe("4s");
        });

        it("takes longer over a longer run at the same speed", () => {
            setSizes({ viewport: 300, copy: 400 });
            render(marquee({ speed: 50 }));

            expect(variable("--marquee-duration")).toBe("8s");
        });

        it("leaves the run standing until there is something to time it by", () => {
            render(marquee());

            expect(root()).not.toHaveAttribute("data-running");
            expect(variable("--marquee-duration")).toBe("0s");
        });

        it("sets the run going once it has been measured", () => {
            setSizes({ viewport: 300, copy: 200 });
            render(marquee());

            expect(root()).toHaveAttribute("data-running", "true");
        });

        it("goes round for good where it was given no number of times", () => {
            render(marquee());
            expect(variable("--marquee-loop-count")).toBe("infinite");
        });

        it("writes the delay and the number of times round onto the run", () => {
            render(marquee({ delay: 1500, loopCount: 3 }));

            expect(variable("--marquee-delay")).toBe("1500ms");
            expect(variable("--marquee-loop-count")).toBe("3");
        });

        it("takes a gap of its own between one thing and the next", () => {
            render(marquee({ spacing: "3rem" }));
            expect(variable("--marquee-spacing")).toBe("3rem");
        });

        it("leaves the gap to the stylesheet where it was given none", () => {
            render(marquee());
            expect(variable("--marquee-spacing")).toBe("");
        });

        it("keeps whatever else the caller wrote onto the box", () => {
            render(marquee({ style: { width: "400px" } }));
            expect(root()).toHaveStyle({ width: "400px" });
        });
    });

    describe("holding the run", () => {
        it("goes as soon as it is drawn", () => {
            render(marquee());
            expect(root()).not.toHaveAttribute("data-paused");
        });

        it("holds still while a pointer is on it", () => {
            render(marquee());

            fireEvent.mouseEnter(root());
            expect(root()).toHaveAttribute("data-paused", "true");

            fireEvent.mouseLeave(root());
            expect(root()).not.toHaveAttribute("data-paused");
        });

        it("holds still while something inside it has focus", () => {
            render(marquee());

            fireEvent.focusIn(screen.getAllByText("Apple")[0]);
            expect(root()).toHaveAttribute("data-paused", "true");
        });

        it("keeps holding while focus moves from one thing in the run to another", () => {
            render(marquee());

            fireEvent.focusIn(screen.getAllByText("Apple")[0]);
            fireEvent.focusOut(screen.getAllByText("Apple")[0], {
                relatedTarget: screen.getAllByText("Banana")[0],
            });

            expect(root()).toHaveAttribute("data-paused", "true");
        });

        it("lets go once focus has left it altogether", () => {
            render(marquee());

            fireEvent.focusIn(screen.getAllByText("Apple")[0]);
            fireEvent.focusOut(screen.getAllByText("Apple")[0], { relatedTarget: document.body });

            expect(root()).not.toHaveAttribute("data-paused");
        });

        it("leaves the run going where it was told not to hold", () => {
            render(marquee({ pauseOnInteraction: false }));

            fireEvent.mouseEnter(root());
            expect(root()).not.toHaveAttribute("data-paused");
        });

        it("still tells the caller about the pointer it was handed", () => {
            const onMouseEnter = vi.fn();
            render(marquee({ onMouseEnter }));

            fireEvent.mouseEnter(root());
            expect(onMouseEnter).toHaveBeenCalledTimes(1);
        });

        it("starts out held where it is told to", () => {
            render(marquee({ defaultPaused: true }));
            expect(root()).toHaveAttribute("data-paused", "true");
        });

        it("takes the state from the caller where the caller keeps hold of it", () => {
            const { rerender } = render(marquee({ paused: true }));
            expect(root()).toHaveAttribute("data-paused", "true");

            rerender(marquee({ paused: false }));
            expect(root()).not.toHaveAttribute("data-paused");
        });

        it("leaves a run the caller is holding alone while a pointer rests on it", () => {
            const onPauseChange = vi.fn();
            render(marquee({ paused: false, onPauseChange }));

            fireEvent.mouseEnter(root());

            expect(root()).toHaveAttribute("data-paused", "true");
            expect(onPauseChange).not.toHaveBeenCalled();
        });

        it("hands a control standing among the parts the run to hold", () => {
            const PauseButton = () => {
                const { paused, toggle } = useMarqueeContext();

                return (
                    <button type="button" onClick={toggle}>
                        {paused ? "Play" : "Pause"}
                    </button>
                );
            };

            render(marquee({ pauseOnInteraction: false }, <PauseButton />));

            fireEvent.click(screen.getByRole("button"));

            expect(root()).toHaveAttribute("data-paused", "true");
            expect(screen.getByRole("button")).toHaveTextContent("Play");
        });
    });

    describe("reporting the run", () => {
        it("reports each time the run comes round", () => {
            const onLoopComplete = vi.fn();
            render(marquee({ onLoopComplete }));

            fireEvent.animationIteration(copies()[0]);
            fireEvent.animationIteration(copies()[0]);

            expect(onLoopComplete).toHaveBeenNthCalledWith(1, 1);
            expect(onLoopComplete).toHaveBeenNthCalledWith(2, 2);
        });

        it("reports the last time round and that the run has finished", () => {
            const onLoopComplete = vi.fn();
            const onComplete = vi.fn();
            render(marquee({ loopCount: 1, onLoopComplete, onComplete }));

            fireEvent.animationEnd(copies()[0]);

            expect(onLoopComplete).toHaveBeenCalledWith(1);
            expect(onComplete).toHaveBeenCalledTimes(1);
        });

        it("counts the first copy alone, so a run is not reported once for each of them", () => {
            const onLoopComplete = vi.fn();
            render(marquee({ onLoopComplete }));

            fireEvent.animationIteration(copies()[1]);

            expect(onLoopComplete).not.toHaveBeenCalled();
        });

        it("leaves an animation of something in the run out of the count", () => {
            const onLoopComplete = vi.fn();
            render(marquee({ onLoopComplete }));

            fireEvent.animationIteration(items()[0]);

            expect(onLoopComplete).not.toHaveBeenCalled();
        });
    });
});

describe("useMarquee", () => {
    const Store = (props: UseMarqueeProps) => {
        const store = useMarquee(props);

        return (
            <>
                <button type="button" onClick={store.toggle}>
                    {store.paused ? "Play" : "Pause"}
                </button>
                <button type="button" onClick={store.pause}>
                    Hold
                </button>
                <button type="button" onClick={store.resume}>
                    Let go
                </button>
            </>
        );
    };

    const toggle = () => screen.getByRole("button", { name: /Play|Pause/ });

    const hold = () => screen.getByRole("button", { name: "Hold" });

    it("starts the run going", () => {
        render(<Store />);
        expect(toggle()).toHaveTextContent("Pause");
    });

    it("holds the run and lets it go again", () => {
        render(<Store />);

        fireEvent.click(toggle());
        expect(toggle()).toHaveTextContent("Play");

        fireEvent.click(toggle());
        expect(toggle()).toHaveTextContent("Pause");
    });

    it("starts out held where it is told to", () => {
        render(<Store defaultPaused />);
        expect(toggle()).toHaveTextContent("Play");
    });

    it("leaves the state to the caller where the caller keeps hold of it", () => {
        const onPauseChange = vi.fn();
        render(<Store paused={false} onPauseChange={onPauseChange} />);

        fireEvent.click(toggle());

        // The caller holds the state, so nothing has moved here until they say it has
        expect(toggle()).toHaveTextContent("Pause");
        expect(onPauseChange).toHaveBeenCalledWith(true);
    });

    it("says nothing where the run is already where it is being put", () => {
        const onPauseChange = vi.fn();
        render(<Store defaultPaused onPauseChange={onPauseChange} />);

        fireEvent.click(hold());

        expect(onPauseChange).not.toHaveBeenCalled();
    });
});
