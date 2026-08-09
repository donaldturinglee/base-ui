import * as React from "react";
import { act, render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { useIsClipped } from "../../hooks/useIsClipped";
import { OverflowObserverProvider, useOverflowObserver } from ".";

const originalIntersectionObserver = window.IntersectionObserver;

type Built = {
    root: Element | null;
    threshold: number | number[] | undefined;
    callback: IntersectionObserverCallback;
    observer: IntersectionObserver;
    observed: Element[];
    unobserved: Element[];
    disconnected: boolean;
};

let built: Built[] = [];

// Reports how much of an element the row it stands in still shows, which is what the provider
// reads to work out whether it has been cut off
const report = (element: Element, intersectionRatio: number) => {
    const entry = built.find((one) => one.observed.includes(element));

    if (!entry) {
        throw new Error("The element is not being watched");
    }

    act(() => {
        entry.callback(
            [{ target: element, intersectionRatio } as IntersectionObserverEntry],
            entry.observer,
        );
    });
};

const Item = ({ testId, disabled }: { testId: string; disabled?: boolean }) => {
    const ref = React.useRef<HTMLSpanElement>(null);
    const isClipped = useIsClipped({ ref, disabled });

    return (
        <span ref={ref} data-testid={testId}>
            {isClipped ? "clipped" : "fits"}
        </span>
    );
};

const Row = ({ children }: { children?: React.ReactNode }) => {
    const rootRef = React.useRef<HTMLDivElement>(null);

    return (
        <div ref={rootRef} data-testid="row">
            <OverflowObserverProvider rootRef={rootRef}>{children}</OverflowObserverProvider>
        </div>
    );
};

const item = (testId: string) => screen.getByTestId(testId);

describe("OverflowObserverProvider", () => {
    // jsdom carries no IntersectionObserver, and the provider is the one thing here that builds
    // them, so the stub is what every count below is read from
    beforeEach(() => {
        built = [];

        window.IntersectionObserver = class {
            private readonly entry: Built;

            constructor(
                callback: IntersectionObserverCallback,
                options?: IntersectionObserverInit,
            ) {
                this.entry = {
                    root: (options?.root as Element | null) ?? null,
                    threshold: options?.threshold,
                    callback,
                    observer: this as unknown as IntersectionObserver,
                    observed: [],
                    unobserved: [],
                    disconnected: false,
                };
                built.push(this.entry);
            }

            observe(element: Element) {
                this.entry.observed.push(element);
            }

            unobserve(element: Element) {
                this.entry.unobserved.push(element);
            }

            disconnect() {
                this.entry.disconnected = true;
            }
        } as unknown as typeof IntersectionObserver;
    });

    afterEach(() => {
        window.IntersectionObserver = originalIntersectionObserver;
    });

    it("builds one observer for everything below it", () => {
        render(
            <Row>
                <Item testId="first" />
                <Item testId="second" />
                <Item testId="third" />
            </Row>,
        );

        expect(built).toHaveLength(1);
        expect(built[0]?.observed).toHaveLength(3);
    });

    it("scopes the observer to the element that does the clipping", () => {
        render(
            <Row>
                <Item testId="first" />
            </Row>,
        );

        expect(built[0]?.root).toBe(screen.getByTestId("row"));
        expect(built[0]?.threshold).toBe(1);
    });

    it("hands a notification on to whoever asked about that element", () => {
        render(
            <Row>
                <Item testId="first" />
                <Item testId="second" />
            </Row>,
        );

        report(item("second"), 0);

        expect(item("first")).toHaveTextContent("fits");
        expect(item("second")).toHaveTextContent("clipped");
    });

    it("counts anything less than the whole of an element as cut off", () => {
        render(
            <Row>
                <Item testId="first" />
            </Row>,
        );

        report(item("first"), 0.5);
        expect(item("first")).toHaveTextContent("clipped");

        report(item("first"), 1);
        expect(item("first")).toHaveTextContent("fits");
    });

    it("leaves a disabled element off the observer altogether", () => {
        render(
            <Row>
                <Item testId="first" />
                <Item testId="second" disabled />
            </Row>,
        );

        expect(built[0]?.observed).toEqual([item("first")]);
        expect(item("second")).toHaveTextContent("fits");
    });

    it("takes an element off the observer once nothing is left watching it", () => {
        const { rerender } = render(
            <Row>
                <Item testId="first" />
                <Item testId="second" />
            </Row>,
        );

        const second = item("second");

        rerender(
            <Row>
                <Item testId="first" />
            </Row>,
        );

        expect(built[0]?.unobserved).toEqual([second]);
    });

    it("watches an element only once where more than one caller asks about it", () => {
        const Pair = () => {
            const ref = React.useRef<HTMLSpanElement>(null);
            const first = useIsClipped({ ref });
            const second = useIsClipped({ ref });

            return (
                <span ref={ref} data-testid="pair">
                    {first === second ? "agreed" : "split"}
                </span>
            );
        };

        render(
            <Row>
                <Pair />
            </Row>,
        );

        expect(built[0]?.observed).toEqual([item("pair")]);

        report(item("pair"), 0);
        expect(item("pair")).toHaveTextContent("agreed");
    });

    it("disconnects the observer once the provider goes", () => {
        const { unmount } = render(
            <Row>
                <Item testId="first" />
            </Row>,
        );

        unmount();

        expect(built[0]?.disconnected).toBe(true);
    });

    it("builds nothing while there is no root to scope an observer to", () => {
        const noRoot: React.RefObject<HTMLElement | null> = { current: null };

        render(
            <OverflowObserverProvider rootRef={noRoot}>
                <Item testId="first" />
            </OverflowObserverProvider>,
        );

        expect(built).toHaveLength(0);
        expect(item("first")).toHaveTextContent("fits");
    });

    describe("useOverflowObserver", () => {
        const Marker = () => {
            const observe = useOverflowObserver();
            return <span data-testid="marker">{observe ? "shared" : "alone"}</span>;
        };

        it("hands out the shared observer below a provider", () => {
            render(
                <Row>
                    <Marker />
                </Row>,
            );

            expect(item("marker")).toHaveTextContent("shared");
        });

        it("answers with nothing outside a provider", () => {
            render(<Marker />);
            expect(item("marker")).toHaveTextContent("alone");
        });
    });

    describe("useIsClipped outside a provider", () => {
        it("watches the element against the root it was given itself", () => {
            const Alone = () => {
                const ref = React.useRef<HTMLSpanElement>(null);
                const rootRef = React.useRef<HTMLDivElement>(null);
                const isClipped = useIsClipped({ ref, rootRef });

                return (
                    <div ref={rootRef} data-testid="root">
                        <span ref={ref} data-testid="alone">
                            {isClipped ? "clipped" : "fits"}
                        </span>
                    </div>
                );
            };

            render(<Alone />);

            expect(built).toHaveLength(1);
            expect(built[0]?.root).toBe(screen.getByTestId("root"));

            report(item("alone"), 0);
            expect(item("alone")).toHaveTextContent("clipped");
        });

        it("watches nothing where it was given no root of its own", () => {
            render(<Item testId="first" />);

            expect(built).toHaveLength(0);
            expect(item("first")).toHaveTextContent("fits");
        });
    });
});
