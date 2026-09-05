import * as React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Presence, splitPresenceProps } from ".";
import type { PresenceProps } from "./Presence.types";

type HarnessProps = Partial<PresenceProps> & {
    initiallyPresent?: boolean;
};

// A button beside the content, which is how presence is asked for on a page
const Harness = ({ initiallyPresent = false, ...props }: HarnessProps) => {
    const [present, setPresent] = React.useState(initiallyPresent);

    return (
        <>
            <button type="button" onClick={() => setPresent((current) => !current)}>
                Toggle
            </button>
            <Presence present={present} data-testid="box" {...props}>
                Content
            </Presence>
        </>
    );
};

const toggle = () => fireEvent.click(screen.getByRole("button", { name: "Toggle" }));

const box = () => screen.queryByTestId("box");

type AnimationNames = {
    open: string;
    closed: string;
};

// jsdom runs no animations, so the content is read as animating the way a stylesheet would
// have it, one way in and another way out, and its animations are ended by hand. The names are
// written over the styles the element is really drawn with, so everything else about them
// still reads as it should
const animating = (names: AnimationNames = { open: "fade-in", closed: "fade-out" }) => {
    const original = window.getComputedStyle;

    vi.spyOn(window, "getComputedStyle").mockImplementation((element, pseudo) => {
        const styles = original.call(window, element, pseudo);

        if (element instanceof HTMLElement && element.dataset.component === "Presence") {
            Object.defineProperties(styles, {
                animationName: {
                    value: element.dataset.state === "closed" ? names.closed : names.open,
                    configurable: true,
                },
                animationDuration: { value: "0.1s", configurable: true },
            });
        }

        return styles;
    });
};

// Lets whatever was waiting on the next frame run
const settle = () =>
    act(
        () =>
            new Promise<void>((resolve) => {
                setTimeout(resolve, 50);
            }),
    );

describe("Presence", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("renders a plain box by default", () => {
        render(<Harness />);

        expect(box()?.tagName).toBe("DIV");
        expect(box()).toHaveAttribute("data-component", "Presence");
    });

    it("renders as whatever it is told to", () => {
        render(<Harness as="section" />);
        expect(box()?.tagName).toBe("SECTION");
    });

    it("draws the content hidden while it is not present, and shows it once it is", () => {
        render(<Harness />);

        expect(box()).toBeInTheDocument();
        expect(box()).not.toBeVisible();
        expect(box()).toHaveAttribute("hidden");
        expect(box()).toHaveAttribute("data-state", "closed");

        toggle();

        expect(box()).toBeVisible();
        expect(box()).not.toHaveAttribute("hidden");
        expect(box()).toHaveAttribute("data-state", "open");
    });

    it("hides the content again once it has left, where nothing animates it out", async () => {
        render(<Harness initiallyPresent />);

        toggle();

        // The content is told it is leaving at once, and hidden a frame later
        expect(box()).toHaveAttribute("data-state", "closed");

        await waitFor(() => expect(box()).not.toBeVisible());
    });

    it("says once the content has left, and sends the element word as well", async () => {
        const onExitComplete = vi.fn();
        const onExitEvent = vi.fn();
        render(
            <Harness
                initiallyPresent
                onExitComplete={onExitComplete}
                ref={(node: HTMLElement | null) =>
                    node?.addEventListener("exitcomplete", onExitEvent)
                }
            />,
        );

        toggle();

        await waitFor(() => expect(onExitComplete).toHaveBeenCalledTimes(1));
        expect(onExitEvent).toHaveBeenCalledTimes(1);
    });

    describe("drawn only once it is asked for", () => {
        it("stays off the page until it is first present", () => {
            render(<Harness lazyMount />);

            expect(box()).not.toBeInTheDocument();

            toggle();

            expect(box()).toBeVisible();
        });

        it("is left on the page hidden once it has been there", async () => {
            render(<Harness lazyMount />);

            toggle();
            toggle();

            await waitFor(() => expect(box()).not.toBeVisible());
            expect(box()).toBeInTheDocument();
        });
    });

    describe("taken off once it leaves", () => {
        it("is drawn hidden to start with, and taken off rather than hidden after that", async () => {
            render(<Harness unmountOnExit />);

            expect(box()).toBeInTheDocument();
            expect(box()).not.toBeVisible();

            toggle();
            expect(box()).toBeVisible();

            toggle();
            await waitFor(() => expect(box()).not.toBeInTheDocument());
        });

        it("is only ever on the page while present, where it is drawn only once asked for as well", async () => {
            render(<Harness lazyMount unmountOnExit />);

            expect(box()).not.toBeInTheDocument();

            toggle();
            expect(box()).toBeVisible();

            toggle();
            await waitFor(() => expect(box()).not.toBeInTheDocument());

            toggle();
            expect(box()).toBeVisible();
        });
    });

    describe("an exit animation", () => {
        it("keeps the content on the page while it runs, then takes it off", async () => {
            animating();
            const onExitComplete = vi.fn();
            render(<Harness initiallyPresent unmountOnExit onExitComplete={onExitComplete} />);

            toggle();

            expect(box()).toHaveAttribute("data-state", "closed");

            // The last frame is held while the content waits, so it does not flash back
            await waitFor(() => expect(box()?.style.animationFillMode).toBe("forwards"));
            expect(box()).toBeVisible();
            expect(onExitComplete).not.toHaveBeenCalled();

            fireEvent.animationEnd(box() as HTMLElement);

            await waitFor(() => expect(box()).not.toBeInTheDocument());
            expect(onExitComplete).toHaveBeenCalledTimes(1);
        });

        it("takes the content back where it is asked for before the animation ends", async () => {
            animating();
            const onExitComplete = vi.fn();
            render(<Harness initiallyPresent onExitComplete={onExitComplete} />);

            toggle();
            await waitFor(() => expect(box()?.style.animationFillMode).toBe("forwards"));

            toggle();

            expect(box()).toHaveAttribute("data-state", "open");
            expect(box()).toBeVisible();

            fireEvent.animationEnd(box() as HTMLElement);
            await settle();

            expect(box()).toBeVisible();
            expect(onExitComplete).not.toHaveBeenCalled();
        });

        it("does not wait on an animation the content was already running", async () => {
            // The same animation either way, which is nothing new to wait for on the way out
            animating({ open: "pulse", closed: "pulse" });
            const onExitComplete = vi.fn();
            render(<Harness initiallyPresent onExitComplete={onExitComplete} />);

            // The animation the content arrived with is read a frame after it arrives
            await settle();

            toggle();

            await waitFor(() => expect(box()).not.toBeVisible());
            expect(onExitComplete).toHaveBeenCalledTimes(1);
        });

        it("takes the content off at once where the animation is cancelled", async () => {
            animating();
            render(<Harness initiallyPresent unmountOnExit />);

            toggle();
            await waitFor(() => expect(box()?.style.animationFillMode).toBe("forwards"));

            fireEvent(box() as HTMLElement, new Event("animationcancel"));

            await waitFor(() => expect(box()).not.toBeInTheDocument());
        });
    });

    describe("an enter animation", () => {
        it("says once the content has arrived, where nothing animates it in", async () => {
            const onEnterComplete = vi.fn();
            render(<Harness onEnterComplete={onEnterComplete} />);

            toggle();

            await waitFor(() => expect(onEnterComplete).toHaveBeenCalledTimes(1));
        });

        it("waits for the animation to run first", async () => {
            animating();
            const onEnterComplete = vi.fn();
            render(<Harness onEnterComplete={onEnterComplete} />);

            toggle();
            await settle();

            expect(onEnterComplete).not.toHaveBeenCalled();

            fireEvent.animationEnd(box() as HTMLElement);

            expect(onEnterComplete).toHaveBeenCalledTimes(1);
        });

        it("says nothing for content that was there from the start", async () => {
            const onEnterComplete = vi.fn();
            render(<Harness initiallyPresent onEnterComplete={onEnterComplete} />);

            await settle();

            expect(onEnterComplete).not.toHaveBeenCalled();
        });
    });

    describe("skipping the animation on mount", () => {
        it("leaves the state off content that starts out present, until it changes", () => {
            render(<Harness initiallyPresent skipAnimationOnMount />);

            expect(box()).toBeVisible();
            expect(box()).not.toHaveAttribute("data-state");

            toggle();
            expect(box()).toHaveAttribute("data-state", "closed");

            toggle();
            expect(box()).toHaveAttribute("data-state", "open");
        });

        it("still animates content that arrives later", () => {
            render(<Harness skipAnimationOnMount />);

            expect(box()).not.toHaveAttribute("data-state");

            toggle();

            expect(box()).toHaveAttribute("data-state", "open");
        });
    });

    describe("hidden content held by React", () => {
        it("is left to React rather than hidden here", async () => {
            render(<Harness hideMode="activity" />);

            await waitFor(() => expect(box()).toBeInTheDocument());
            expect(box()).not.toHaveAttribute("hidden");
            expect(box()).not.toBeVisible();

            toggle();

            await waitFor(() => expect(box()).toBeVisible());
        });
    });

    it("splits the props about presence from the rest", () => {
        const onExitComplete = () => {};
        const [presenceProps, rest] = splitPresenceProps({
            present: true,
            lazyMount: true,
            onExitComplete,
            id: "box",
            className: "custom",
        });

        expect(presenceProps).toEqual({
            present: true,
            lazyMount: true,
            unmountOnExit: undefined,
            hideMode: undefined,
            skipAnimationOnMount: undefined,
            onEnterComplete: undefined,
            onExitComplete,
        });
        expect(rest).toEqual({ id: "box", className: "custom" });
    });

    it("forwards a ref to the element", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(<Harness ref={ref} />);

        expect(ref.current).toBe(box());
    });

    it("hands the caller's own props onto the element", () => {
        render(<Harness className="custom" id="content" />);

        expect(box()).toHaveClass("custom");
        expect(box()).toHaveAttribute("id", "content");
    });
});
