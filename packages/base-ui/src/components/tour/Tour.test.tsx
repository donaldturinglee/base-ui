import * as React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Tour, useTour } from ".";
import type { TourProps, TourStep } from "./Tour.types";

const originalResizeObserver = window.ResizeObserver;

const steps: TourStep[] = [
    {
        id: "welcome",
        type: "dialog",
        title: "Welcome",
        description: "A way round the place.",
        actions: [{ label: "Start", action: "next" }],
    },
    {
        id: "upload",
        title: "Upload",
        description: "Drop your files here.",
        target: () => document.querySelector<HTMLElement>("#upload"),
        actions: [
            { label: "Back", action: "prev" },
            { label: "Next", action: "next" },
        ],
    },
    {
        id: "done",
        type: "dialog",
        title: "Done",
        description: "That is the whole of it.",
        actions: [{ label: "Finish", action: "dismiss" }],
    },
];

const surface = (
    <>
        <Tour.Backdrop />
        <Tour.Spotlight />
        <Tour.Positioner>
            <Tour.Content>
                <Tour.Arrow />
                <Tour.CloseTrigger />
                <Tour.ProgressText />
                <Tour.Title />
                <Tour.Description />
                <Tour.Control>
                    <Tour.Actions>
                        {(actions) =>
                            actions.map((action) => (
                                <Tour.ActionTrigger key={action.label} action={action} />
                            ))
                        }
                    </Tour.Actions>
                </Tour.Control>
            </Tour.Content>
        </Tour.Positioner>
    </>
);

const tour = (props: Partial<TourProps> = {}) => (
    <div>
        <button id="upload" type="button">
            Upload
        </button>

        <Tour steps={steps} defaultOpen defaultStep="welcome" {...props}>
            {props.children ?? surface}
        </Tour>
    </div>
);

const renderTour = (props: Partial<TourProps> = {}) => render(tour(props));

const part = (name: string) => document.querySelector(`[data-component='Tour.${name}']`);

const content = () => screen.queryByRole("dialog");

const action = (label: string) => screen.getByRole("button", { name: label });

describe("Tour", () => {
    // jsdom has neither of these, and the tour watches what a step points at so the ring and
    // the surface can be placed again as it moves
    beforeEach(() => {
        window.ResizeObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
        } as unknown as typeof ResizeObserver;
    });

    afterEach(() => {
        window.ResizeObserver = originalResizeObserver;
    });

    it("tags each of its parts with a data-component attribute", () => {
        renderTour();

        for (const name of [
            "Backdrop",
            "Positioner",
            "Content",
            "CloseTrigger",
            "ProgressText",
            "Title",
            "Description",
            "Control",
            "ActionTrigger",
        ]) {
            expect(part(name)).not.toBeNull();
        }
    });

    it("draws nothing while it is closed", () => {
        renderTour({ defaultOpen: false });

        expect(content()).toBeNull();
        expect(part("Backdrop")).toBeNull();
    });

    it("draws the step it was opened at", () => {
        renderTour();

        expect(screen.getByText("Welcome")).toBeInTheDocument();
        expect(screen.getByText("A way round the place.")).toBeInTheDocument();
    });

    it("takes what the step says rather than what is written inside it", () => {
        renderTour();

        expect(part("Title")).toHaveTextContent("Welcome");
        expect(part("Description")).toHaveTextContent("A way round the place.");
    });

    it("lets what is written inside a part stand instead", () => {
        renderTour({
            children: (
                <Tour.Positioner>
                    <Tour.Content>
                        <Tour.Title>Something else</Tour.Title>
                    </Tour.Content>
                </Tour.Positioner>
            ),
        });

        expect(part("Title")).toHaveTextContent("Something else");
    });

    it("reads the surface as a dialog named and described by the step", () => {
        renderTour();

        const surfaceElement = content() as HTMLElement;

        expect(surfaceElement).toHaveAttribute("aria-labelledby", part("Title")?.id);
        expect(surfaceElement).toHaveAttribute("aria-describedby", part("Description")?.id);
    });

    it("says how far along it has come", () => {
        renderTour();
        expect(part("ProgressText")).toHaveTextContent("1 of 3");
    });

    describe("moving through it", () => {
        it("goes on a step when an action asks it to", () => {
            renderTour();

            fireEvent.click(action("Start"));

            expect(part("Title")).toHaveTextContent("Upload");
            expect(part("ProgressText")).toHaveTextContent("2 of 3");
        });

        it("goes back a step when an action asks it to", () => {
            renderTour({ defaultStep: "upload" });

            fireEvent.click(action("Back"));

            expect(part("Title")).toHaveTextContent("Welcome");
        });

        it("stays where it is where there is nothing to go back to", () => {
            renderTour();

            fireEvent.keyDown(document, { key: "ArrowLeft" });

            expect(part("Title")).toHaveTextContent("Welcome");
        });

        it("closes when an action dismisses it", () => {
            const onOpenChange = vi.fn();
            renderTour({ defaultStep: "done", onOpenChange });

            fireEvent.click(action("Finish"));

            expect(content()).toBeNull();
            expect(onOpenChange).toHaveBeenCalledWith(false);
        });

        it("closes when it is stepped past the last of them", () => {
            const onStatusChange = vi.fn();
            renderTour({
                defaultStep: "done",
                onStatusChange,
                children: (
                    <Tour.Positioner>
                        <Tour.Content>
                            <Tour.Title />
                            <Tour.ActionTrigger action={{ label: "Onwards", action: "next" }} />
                        </Tour.Content>
                    </Tour.Positioner>
                ),
            });

            fireEvent.click(action("Onwards"));

            expect(content()).toBeNull();
            expect(onStatusChange).toHaveBeenCalledWith({ status: "completed" });
        });

        it("hands an action of the caller's own the tour itself", () => {
            const onStepChange = vi.fn();
            renderTour({
                onStepChange,
                children: (
                    <Tour.Positioner>
                        <Tour.Content>
                            <Tour.ActionTrigger
                                action={{
                                    label: "Skip to the end",
                                    action: (api) => api.goto("done"),
                                }}
                            />
                        </Tour.Content>
                    </Tour.Positioner>
                ),
            });

            fireEvent.click(action("Skip to the end"));

            expect(onStepChange).toHaveBeenCalledWith({
                stepId: "done",
                stepIndex: 2,
                count: 3,
            });
        });

        it("says which step it has come to", () => {
            const onStepChange = vi.fn();
            renderTour({ onStepChange });

            fireEvent.click(action("Start"));

            expect(onStepChange).toHaveBeenCalledWith({
                stepId: "upload",
                stepIndex: 1,
                count: 3,
            });
        });
    });

    describe("the ways out of it", () => {
        it("closes on Escape", () => {
            const onStatusChange = vi.fn();
            renderTour({ onStatusChange });

            fireEvent.keyDown(document, { key: "Escape" });

            expect(content()).toBeNull();
            expect(onStatusChange).toHaveBeenCalledWith({ status: "dismissed" });
        });

        it("stays open on Escape where it has been asked to", () => {
            renderTour({ closeOnEscape: false });

            fireEvent.keyDown(document, { key: "Escape" });

            expect(content()).not.toBeNull();
        });

        it("closes on a press landing away from the step", () => {
            renderTour();

            fireEvent.mouseDown(document.body);

            expect(content()).toBeNull();
        });

        it("stays open on a press landing on the surface", () => {
            renderTour();

            fireEvent.mouseDown(content() as HTMLElement);

            expect(content()).not.toBeNull();
        });

        it("stays open on a press landing on what the step points at", () => {
            renderTour({ defaultStep: "upload" });

            fireEvent.mouseDown(document.querySelector("#upload") as HTMLElement);

            expect(content()).not.toBeNull();
        });

        it("stays open on a press where it has been asked to", () => {
            renderTour({ closeOnInteractOutside: false });

            fireEvent.mouseDown(document.body);

            expect(content()).not.toBeNull();
        });

        it("closes from the button that carries the way out", () => {
            renderTour();

            fireEvent.click(screen.getByRole("button", { name: "Close tour" }));

            expect(content()).toBeNull();
        });
    });

    describe("the arrow keys", () => {
        it("steps on and back where it has been asked to", () => {
            renderTour({ keyboardNavigation: true });

            fireEvent.keyDown(document, { key: "ArrowRight" });
            expect(part("Title")).toHaveTextContent("Upload");

            fireEvent.keyDown(document, { key: "ArrowLeft" });
            expect(part("Title")).toHaveTextContent("Welcome");
        });

        it("leaves them alone where it has not", () => {
            renderTour();

            fireEvent.keyDown(document, { key: "ArrowRight" });

            expect(part("Title")).toHaveTextContent("Welcome");
        });

        it("leaves them alone while a step is still waiting", () => {
            renderTour({
                keyboardNavigation: true,
                steps: [{ id: "waiting", title: "Waiting", effect() {} }, steps[1]],
                defaultStep: "waiting",
            });

            // The key is left to the page: `fireEvent` says so by giving back whether the event
            // ran its course rather than being taken
            const ranItsCourse = fireEvent.keyDown(document, { key: "ArrowRight" });

            expect(ranItsCourse).toBe(true);
            expect(content()).toBeNull();
        });
    });

    describe("what the step points at", () => {
        it("rings what a step stands against", () => {
            renderTour({ defaultStep: "upload" });
            expect(part("Spotlight")).not.toBeNull();
        });

        it("rings nothing where the step stands on its own", () => {
            renderTour();
            expect(part("Spotlight")).toBeNull();
        });

        it("points at what a step stands against", () => {
            renderTour({ defaultStep: "upload" });
            expect(part("Arrow")).not.toBeNull();
        });

        it("points at nothing where the step stands on its own", () => {
            renderTour();
            expect(part("Arrow")).toBeNull();
        });

        it("leaves the caret off a step that asked for none", () => {
            renderTour({
                steps: [{ ...steps[1], arrow: false }],
                defaultStep: "upload",
            });

            expect(part("Arrow")).toBeNull();
        });

        it("says which of the three the step is", () => {
            const { rerender } = renderTour();
            expect(part("Positioner")).toHaveAttribute("data-type", "dialog");

            rerender(tour({ defaultStep: "upload", step: "upload" }));
            expect(part("Positioner")).toHaveAttribute("data-type", "tooltip");
        });
    });

    describe("the dim behind it", () => {
        it("is drawn while a step is being read", () => {
            renderTour();
            expect(part("Backdrop")).not.toBeNull();
        });

        it("is left off a step that asked for none", () => {
            renderTour({ steps: [{ ...steps[0], backdrop: false }] });
            expect(part("Backdrop")).toBeNull();
        });
    });

    describe("a step that waits", () => {
        it("stays back until its effect says it is ready", () => {
            let show = () => {};

            renderTour({
                steps: [
                    {
                        id: "waiting",
                        title: "Waiting",
                        effect(args) {
                            show = args.show;
                        },
                    },
                ],
                defaultStep: "waiting",
            });

            expect(content()).toBeNull();

            act(() => show());

            expect(content()).not.toBeNull();
        });

        it("takes what its effect writes into it", () => {
            let update = (details: { title?: React.ReactNode }) => void details;
            let show = () => {};

            renderTour({
                steps: [
                    {
                        id: "waiting",
                        title: "Just a moment",
                        effect(args) {
                            update = args.update;
                            show = args.show;
                        },
                    },
                ],
                defaultStep: "waiting",
            });

            act(() => {
                update({ title: "Welcome back" });
                show();
            });

            expect(part("Title")).toHaveTextContent("Welcome back");
        });

        it("takes no press as a press outside while it is still waiting", () => {
            const onOpenChange = vi.fn();
            let show = () => {};

            renderTour({
                steps: [
                    {
                        id: "waiting",
                        title: "Waiting",
                        effect(args) {
                            show = args.show;
                        },
                    },
                ],
                defaultStep: "waiting",
                onOpenChange,
            });

            // What a step waits for is often the reader pressing something elsewhere on the
            // page, so a press while it waits must not close the tour out from under it
            fireEvent.mouseDown(document.body);

            expect(onOpenChange).not.toHaveBeenCalled();

            act(() => show());

            expect(content()).not.toBeNull();
        });

        it("stays where it is when the caller renders again around it", () => {
            const ran = vi.fn();

            // Steps written out inline, so the whole set is fresh on every render. The step
            // being read is the one it is by name, not by the identity of the object it arrived
            // in
            const Inline = () => {
                const [count, setCount] = React.useState(0);

                return (
                    <div>
                        <button type="button" onClick={() => setCount(count + 1)}>
                            Again
                        </button>
                        <span data-testid="count">{count}</span>

                        <Tour
                            steps={[
                                {
                                    id: "waiting",
                                    title: "Waiting",
                                    effect({ show }) {
                                        ran();
                                        show();
                                    },
                                },
                            ]}
                            defaultOpen
                            defaultStep="waiting"
                        >
                            <Tour.Positioner>
                                <Tour.Content>
                                    <Tour.Title />
                                </Tour.Content>
                            </Tour.Positioner>
                        </Tour>
                    </div>
                );
            };

            render(<Inline />);
            expect(part("Title")).toHaveTextContent("Waiting");

            fireEvent.click(action("Again"));

            expect(screen.getByTestId("count")).toHaveTextContent("1");
            expect(part("Title")).toHaveTextContent("Waiting");
            expect(ran).toHaveBeenCalledTimes(1);
        });

        it("undoes what its effect left behind once the step is left", () => {
            const stop = vi.fn();

            renderTour({
                steps: [
                    {
                        id: "waiting",
                        title: "Waiting",
                        effect({ show }) {
                            show();
                            return stop;
                        },
                    },
                ],
                defaultStep: "waiting",
            });

            fireEvent.keyDown(document, { key: "Escape" });

            expect(stop).toHaveBeenCalled();
        });
    });

    describe("holding it from outside", () => {
        it("follows the step the caller is holding", () => {
            const { rerender } = render(tour({ step: "welcome" }));
            expect(part("Title")).toHaveTextContent("Welcome");

            rerender(tour({ step: "done" }));
            expect(part("Title")).toHaveTextContent("Done");
        });

        it("leaves the step where the caller put it when an action asks for another", () => {
            const onStepChange = vi.fn();
            render(tour({ step: "welcome", onStepChange }));

            fireEvent.click(action("Start"));

            expect(part("Title")).toHaveTextContent("Welcome");
            expect(onStepChange).toHaveBeenCalledWith({
                stepId: "upload",
                stepIndex: 1,
                count: 3,
            });
        });

        it("follows whether the caller is holding it open", () => {
            const { rerender } = render(tour({ open: false }));
            expect(content()).toBeNull();

            rerender(tour({ open: true }));
            expect(content()).not.toBeNull();
        });
    });

    describe("useTour", () => {
        const Report = () => {
            const api = useTour();

            return (
                <div>
                    <span data-testid="progress">{api.progressText}</span>
                    <span data-testid="percent">{Math.round(api.progressPercent)}</span>
                    <span data-testid="has-next">{String(api.hasNext)}</span>
                    <span data-testid="has-prev">{String(api.hasPrev)}</span>
                    <button type="button" onClick={() => api.next()}>
                        Onwards
                    </button>
                </div>
            );
        };

        it("hands the tour to whatever is standing within it", () => {
            renderTour({ children: <Report /> });

            expect(screen.getByTestId("progress")).toHaveTextContent("1 of 3");
            expect(screen.getByTestId("percent")).toHaveTextContent("33");
            expect(screen.getByTestId("has-next")).toHaveTextContent("true");
            expect(screen.getByTestId("has-prev")).toHaveTextContent("false");
        });

        it("moves the tour from a control of the caller's own", () => {
            renderTour({ children: <Report /> });

            fireEvent.click(action("Onwards"));

            expect(screen.getByTestId("progress")).toHaveTextContent("2 of 3");
        });

        it("stops at a call made from outside a tour", () => {
            const failed = vi.spyOn(console, "error").mockImplementation(() => {});

            expect(() => render(<Report />)).toThrow(
                "`useTour` has to be called from within a `Tour` component.",
            );

            failed.mockRestore();
        });
    });

    it("draws nothing for a part written outside a tour", () => {
        render(<Tour.Title>Nowhere</Tour.Title>);
        expect(part("Title")).toBeNull();
    });

    it("merges a custom className onto each part", () => {
        renderTour({
            defaultStep: "upload",
            children: (
                <>
                    <Tour.Backdrop className="backdrop" />
                    <Tour.Spotlight className="spotlight" />
                    <Tour.Positioner className="positioner">
                        <Tour.Content className="content">
                            <Tour.Title className="title" />
                        </Tour.Content>
                    </Tour.Positioner>
                </>
            ),
        });

        expect(part("Backdrop")).toHaveClass("backdrop");
        expect(part("Spotlight")).toHaveClass("spotlight");
        expect(part("Positioner")).toHaveClass("positioner");
        expect(part("Content")).toHaveClass("content");
        expect(part("Title")).toHaveClass("title");
    });

    it("forwards a ref to the surface", () => {
        const ref = React.createRef<HTMLDivElement>();

        renderTour({
            children: (
                <Tour.Positioner>
                    <Tour.Content ref={ref} />
                </Tour.Positioner>
            ),
        });

        expect(ref.current).toBe(part("Content"));
    });
});
