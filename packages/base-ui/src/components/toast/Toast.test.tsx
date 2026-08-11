import * as React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Button } from "../button";
import { Toaster, toast } from ".";
import { clearToasts } from "./toastStore";
import type { ToasterProps } from "./Toast.types";

const originalPointerEvent = window.PointerEvent;

// The toasts are held outside React, so putting one up is a change React has to be told about
const raise = (put: () => void) => act(put);

const renderToaster = (props: Partial<ToasterProps> = {}) => render(<Toaster {...props} />);

const toasts = () => screen.queryAllByRole("status");

const first = () => toasts()[0];

const region = () => screen.getByRole("region", { name: "Notifications" });

const list = () => document.querySelector("[data-component='Toaster']") as HTMLElement;

const part = (element: HTMLElement, name: string) =>
    element.querySelector(`[data-component='Toast.${name}']`);

describe("Toast", () => {
    afterEach(() => {
        act(clearToasts);
    });

    it("stands ready with nothing in it", () => {
        renderToaster();

        expect(region()).toBeInTheDocument();
        expect(toasts()).toHaveLength(0);
    });

    it("renders outside the tree it was written in", () => {
        const { container } = renderToaster();
        raise(() => toast("Saved"));

        expect(container).toBeEmptyDOMElement();
        expect(document.body).toContainElement(first());
    });

    it("shows whatever it was given", () => {
        renderToaster();
        raise(() => toast("Saved"));

        expect(screen.getByText("Saved")).toBeInTheDocument();
    });

    it("tags the list and every toast with a data-component attribute", () => {
        renderToaster();
        raise(() => toast("Saved"));

        expect(list()).toHaveAttribute("data-component", "Toaster");
        expect(first()).toHaveAttribute("data-component", "Toast");
    });

    it("tags each of a toast's parts with a data-component attribute", () => {
        renderToaster({ closeButton: true });
        raise(() =>
            toast.success("Saved", {
                description: "Your changes are safe",
                action: { label: "Undo" },
                cancel: { label: "Dismiss" },
            }),
        );

        for (const name of [
            "Body",
            "Icon",
            "Content",
            "Title",
            "Description",
            "Actions",
            "Action",
            "Cancel",
            "CloseButton",
        ]) {
            expect(part(first(), name)).toBeInTheDocument();
        }
    });

    it("shows a description below what the toast is saying", () => {
        renderToaster();
        raise(() => toast("Saved", { description: "Your changes are safe" }));

        expect(part(first(), "Description")).toHaveTextContent("Your changes are safe");
    });

    it("lays the newest toast at the front of the stack", () => {
        renderToaster();
        raise(() => toast("First"));
        raise(() => toast("Second"));

        expect(toasts()).toHaveLength(2);
        expect(toasts()[0]).toHaveTextContent("Second");
        expect(toasts()[0]).toHaveAttribute("data-front", "true");
        expect(toasts()[1]).toHaveAttribute("data-front", "false");
    });

    it("hands back the id it gave the toast", () => {
        renderToaster();

        let id = "";
        raise(() => {
            id = toast("Saved");
        });

        expect(id).toBeTruthy();
        expect(toast.getToasts()[0].id).toBe(id);
    });

    describe("what it is saying", () => {
        it("says nothing in particular by default", () => {
            renderToaster();
            raise(() => toast("Saved"));

            expect(first()).toHaveAttribute("data-variant", "default");
            expect(part(first(), "Icon")).toBeNull();
        });

        it.each([
            ["success", toast.success],
            ["error", toast.error],
            ["warning", toast.warning],
            ["info", toast.info],
            ["loading", toast.loading],
        ])("carries an icon of its own where it is %s", (variant, put) => {
            renderToaster();
            raise(() => put("Saved"));

            expect(first()).toHaveAttribute("data-variant", variant);
            expect(part(first(), "Icon")).toBeInTheDocument();
        });

        it("takes an icon of the caller's own in place of it", () => {
            renderToaster();
            raise(() => toast.success("Saved", { icon: <span data-testid="own-icon" /> }));

            expect(screen.getByTestId("own-icon")).toBeInTheDocument();
        });

        it("goes without an icon where it is given none at all", () => {
            renderToaster();
            raise(() => toast.success("Saved", { icon: null }));

            expect(part(first(), "Icon")).toBeNull();
        });

        it("takes icons the Toaster stands in for it", () => {
            renderToaster({ icons: { success: <span data-testid="toaster-icon" /> } });
            raise(() => toast.success("Saved"));

            expect(screen.getByTestId("toaster-icon")).toBeInTheDocument();
        });

        it("colours the whole toast where it is asked to", () => {
            renderToaster({ richColors: true });
            raise(() => toast.success("Saved"));

            expect(first()).toHaveAttribute("data-rich-colors", "true");
        });
    });

    describe("changing a toast where it stands", () => {
        it("changes the one already standing under that id rather than putting up another", () => {
            renderToaster();
            raise(() => toast("Working", { id: "task" }));
            raise(() => toast.success("Done", { id: "task" }));

            expect(toasts()).toHaveLength(1);
            expect(first()).toHaveAttribute("data-variant", "success");
            expect(screen.getByText("Done")).toBeInTheDocument();
            expect(screen.queryByText("Working")).not.toBeInTheDocument();
        });

        it("keeps the place it was standing in", () => {
            renderToaster();
            raise(() => toast("First", { id: "task" }));
            raise(() => toast("Second"));
            raise(() => toast.success("Done", { id: "task" }));

            expect(toasts()[1]).toHaveTextContent("Done");
        });
    });

    describe("seeing a toast off", () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        const settle = () => act(() => vi.advanceTimersByTime(400));

        it("goes away by itself once its time is up", () => {
            renderToaster({ duration: 1000 });
            raise(() => toast("Saved"));

            expect(toasts()).toHaveLength(1);

            act(() => vi.advanceTimersByTime(1000));
            settle();

            expect(toasts()).toHaveLength(0);
        });

        it("tells the caller it went away by itself", () => {
            const onAutoClose = vi.fn();
            renderToaster({ duration: 1000 });
            raise(() => toast("Saved", { onAutoClose }));

            act(() => vi.advanceTimersByTime(1000));

            expect(onAutoClose).toHaveBeenCalledTimes(1);
        });

        it("stands for as long as the toast asks rather than the Toaster's own time", () => {
            renderToaster({ duration: 1000 });
            raise(() => toast("Saved", { duration: 5000 }));

            act(() => vi.advanceTimersByTime(1000));
            settle();

            expect(toasts()).toHaveLength(1);
        });

        it("stands until it is dismissed where it has been given no time at all", () => {
            renderToaster();
            raise(() => toast.loading("Working"));

            act(() => vi.advanceTimersByTime(60000));
            settle();

            expect(toasts()).toHaveLength(1);
        });

        it("goes away when it is dismissed by id", () => {
            renderToaster();

            let id = "";
            raise(() => {
                id = toast("Saved");
            });

            raise(() => {
                toast.dismiss(id);
            });
            settle();

            expect(toasts()).toHaveLength(0);
        });

        it("sees off everything standing where no id is given", () => {
            renderToaster();
            raise(() => toast("First"));
            raise(() => toast("Second"));

            raise(() => {
                toast.dismiss();
            });
            settle();

            expect(toasts()).toHaveLength(0);
        });

        it("tells the caller it was seen off by hand", () => {
            const onDismiss = vi.fn();
            renderToaster({ closeButton: true });
            raise(() => toast("Saved", { onDismiss }));

            fireEvent.click(screen.getByRole("button", { name: "Close" }));

            expect(onDismiss).toHaveBeenCalledTimes(1);
        });

        it("holds a toast where it is while the reader is on the stack", () => {
            renderToaster({ duration: 1000 });
            raise(() => toast("Saved"));

            fireEvent.pointerEnter(list());
            act(() => vi.advanceTimersByTime(2000));
            settle();

            expect(toasts()).toHaveLength(1);
        });

        it("takes up where it left off once the reader moves on", () => {
            renderToaster({ duration: 1000 });
            raise(() => toast("Saved"));

            fireEvent.pointerEnter(list());
            act(() => vi.advanceTimersByTime(2000));
            fireEvent.pointerLeave(list());

            act(() => vi.advanceTimersByTime(1000));
            settle();

            expect(toasts()).toHaveLength(0);
        });
    });

    describe("the close button", () => {
        it("is kept out of the way unless it is asked for", () => {
            renderToaster();
            raise(() => toast("Saved"));

            expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
        });

        it("stands on a toast that asks for one of its own", () => {
            renderToaster();
            raise(() => toast("Saved", { closeButton: true }));

            expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
        });

        it("is kept out of the way on a toast that cannot be dismissed by hand", () => {
            renderToaster({ closeButton: true });
            raise(() => toast("Saved", { dismissible: false }));

            expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
        });
    });

    describe("buttons of the toast's own", () => {
        it("runs what the action was given and sees the toast off", async () => {
            const onClick = vi.fn();
            renderToaster();
            raise(() => toast("Saved", { action: { label: "Undo", onClick } }));

            fireEvent.click(screen.getByRole("button", { name: "Undo" }));

            expect(onClick).toHaveBeenCalledTimes(1);
            await waitFor(() => expect(toasts()).toHaveLength(0));
        });

        it("leaves the toast standing where the handler takes the event", () => {
            renderToaster();
            raise(() =>
                toast("Saved", {
                    action: {
                        label: "Undo",
                        onClick: (event) => event.preventDefault(),
                    },
                }),
            );

            fireEvent.click(screen.getByRole("button", { name: "Undo" }));

            expect(toasts()).toHaveLength(1);
        });

        it("lays a cancel button out beside the action", () => {
            renderToaster();
            raise(() =>
                toast("Saved", { action: { label: "Undo" }, cancel: { label: "Dismiss" } }),
            );

            expect(screen.getByRole("button", { name: "Undo" })).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument();
        });

        it("takes a button the caller has built themselves", () => {
            renderToaster();
            raise(() => toast("Saved", { action: <Button>Retry</Button> }));

            expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
        });
    });

    describe("a toast the caller lays out themselves", () => {
        it("renders what it was given in place of everything the toast would lay out", () => {
            renderToaster();
            raise(() => toast.custom((item) => <div data-testid="own">{item.id}</div>));

            expect(screen.getByTestId("own")).toBeInTheDocument();
            expect(part(first(), "Body")).toBeNull();
        });
    });

    describe("a toast that stands for a promise", () => {
        it("waits while the promise runs and says how it went", async () => {
            renderToaster();

            let resolve: (value: string) => void = () => {};
            const pending = new Promise<string>((settle) => {
                resolve = settle;
            });

            raise(() => {
                toast.promise(pending, {
                    loading: "Working",
                    success: (name) => `Saved ${name}`,
                    error: "Failed",
                });
            });

            expect(first()).toHaveAttribute("data-variant", "loading");

            await act(async () => {
                resolve("the draft");
                await pending;
            });

            expect(first()).toHaveAttribute("data-variant", "success");
            expect(screen.getByText("Saved the draft")).toBeInTheDocument();
        });

        it("says so where the promise gives out", async () => {
            renderToaster();

            const failed = Promise.reject(new Error("nope"));

            raise(() => {
                toast.promise(failed, {
                    loading: "Working",
                    success: "Saved",
                    error: "Failed",
                });
            });

            await waitFor(() => expect(first()).toHaveAttribute("data-variant", "error"));
            expect(screen.getByText("Failed")).toBeInTheDocument();
        });
    });

    describe("where the stack stands", () => {
        it("gathers at the bottom right by default", () => {
            renderToaster();
            raise(() => toast("Saved"));

            expect(list()).toHaveAttribute("data-position", "bottom-right");
            expect(first()).toHaveAttribute("data-position", "bottom-right");
        });

        it("gathers wherever it is told to", () => {
            renderToaster({ position: "top-center" });
            raise(() => toast("Saved"));

            expect(list()).toHaveAttribute("data-position", "top-center");
        });

        it("carries the room between one toast and the next in a variable", () => {
            renderToaster({ gap: 20 });

            expect(list().style.getPropertyValue("--toaster-gap")).toBe("20px");
        });

        it("reads a bare width and offset as pixels", () => {
            renderToaster({ width: 400, offset: 12 });

            expect(list().style.getPropertyValue("--toaster-width")).toBe("400px");
            expect(list().style.getPropertyValue("--toaster-viewport-offset")).toBe("12px");
        });

        it("passes a width of its own straight through", () => {
            renderToaster({ width: "30rem" });

            expect(list().style.getPropertyValue("--toaster-width")).toBe("30rem");
        });
    });

    describe("how many stand at once", () => {
        it("leaves the ones past the third waiting behind those in front", () => {
            renderToaster();
            raise(() => toast("First"));
            raise(() => toast("Second"));
            raise(() => toast("Third"));
            raise(() => toast("Fourth"));

            expect(toasts()[0]).toHaveAttribute("data-visible", "true");
            expect(toasts()[2]).toHaveAttribute("data-visible", "true");
            expect(toasts()[3]).toHaveAttribute("data-visible", "false");
        });

        it("shows as many at once as it is told to", () => {
            renderToaster({ visibleToasts: 1 });
            raise(() => toast("First"));
            raise(() => toast("Second"));

            expect(toasts()[0]).toHaveAttribute("data-visible", "true");
            expect(toasts()[1]).toHaveAttribute("data-visible", "false");
        });
    });

    describe("gathering the stack up and opening it out", () => {
        it("gathers the stack up until the reader comes to it", () => {
            renderToaster();
            raise(() => toast("Saved"));

            expect(list()).toHaveAttribute("data-expanded", "false");

            fireEvent.pointerEnter(list());
            expect(list()).toHaveAttribute("data-expanded", "true");

            fireEvent.pointerLeave(list());
            expect(list()).toHaveAttribute("data-expanded", "false");
        });

        it("leaves the stack open where it is asked to", () => {
            renderToaster({ expand: true });
            raise(() => toast("Saved"));

            expect(list()).toHaveAttribute("data-expanded", "true");
        });

        it("gathers the stack up again when escape is pressed on it", () => {
            renderToaster();
            raise(() => toast("Saved"));

            act(() => list().focus());
            expect(list()).toHaveAttribute("data-expanded", "true");

            fireEvent.keyDown(document, { code: "Escape" });
            expect(list()).toHaveAttribute("data-expanded", "false");
        });
    });

    describe("accessibility", () => {
        it("names the region the toasts stand in", () => {
            renderToaster();
            expect(region()).toHaveAttribute("aria-live", "polite");
        });

        it("names it something else where it is asked to", () => {
            renderToaster({ containerAriaLabel: "Alerts" });
            expect(screen.getByRole("region", { name: "Alerts" })).toBeInTheDocument();
        });

        it("reads a toast out when the reader next comes to a pause", () => {
            renderToaster();
            raise(() => toast("Saved"));

            expect(first()).toHaveAttribute("aria-live", "polite");
        });

        it("reads an important toast out at once", () => {
            renderToaster();
            raise(() => toast.error("Failed", { important: true }));

            expect(screen.getByRole("alert")).toHaveAttribute("aria-live", "assertive");
        });

        it("puts focus on the stack when the hotkey is pressed", () => {
            renderToaster();
            raise(() => toast("Saved"));

            fireEvent.keyDown(document, { code: "KeyT", altKey: true });

            expect(list()).toHaveFocus();
        });

        it("takes a hotkey of the caller's own", () => {
            renderToaster({ hotkey: ["KeyN"] });
            raise(() => toast("Saved"));

            fireEvent.keyDown(document, { code: "KeyN" });

            expect(list()).toHaveFocus();
        });

        it("keeps the icon out of the way of a screen reader", () => {
            renderToaster();
            raise(() => toast.success("Saved"));

            expect(part(first(), "Icon")).toHaveAttribute("aria-hidden", "true");
        });
    });

    describe("swiping a toast away", () => {
        // jsdom has no PointerEvent, and the plain event it falls back on carries none of the
        // coordinates a drag is followed by
        beforeEach(() => {
            window.PointerEvent = window.MouseEvent as unknown as typeof window.PointerEvent;
        });

        afterEach(() => {
            window.PointerEvent = originalPointerEvent;
        });

        it("sees the toast off once it has been dragged far enough", async () => {
            renderToaster();
            raise(() => toast("Saved"));

            const element = first();

            fireEvent.pointerDown(element, { clientX: 0, clientY: 0, button: 0 });
            fireEvent.pointerMove(element, { clientX: 0, clientY: 80 });
            fireEvent.pointerUp(element, { clientX: 0, clientY: 80 });

            expect(element).toHaveAttribute("data-swiped-out", "true");
            await waitFor(() => expect(toasts()).toHaveLength(0));
        });

        it("leaves the toast standing where it was not dragged far enough", () => {
            renderToaster();
            raise(() => toast("Saved"));

            const element = first();

            fireEvent.pointerDown(element, { clientX: 0, clientY: 0, button: 0 });
            fireEvent.pointerMove(element, { clientX: 0, clientY: 10 });
            fireEvent.pointerUp(element, { clientX: 0, clientY: 10 });

            expect(element).toHaveAttribute("data-swiped-out", "false");
            expect(toasts()).toHaveLength(1);
        });

        it("stays put where it is dragged a way it cannot be swiped", () => {
            renderToaster({ position: "bottom-right" });
            raise(() => toast("Saved"));

            const element = first();

            fireEvent.pointerDown(element, { clientX: 0, clientY: 0, button: 0 });
            fireEvent.pointerMove(element, { clientX: 0, clientY: -80 });
            fireEvent.pointerUp(element, { clientX: 0, clientY: -80 });

            expect(toasts()).toHaveLength(1);
        });

        it("cannot be swiped away where it is not dismissible", () => {
            renderToaster();
            raise(() => toast("Saved", { dismissible: false }));

            const element = first();

            fireEvent.pointerDown(element, { clientX: 0, clientY: 0, button: 0 });
            fireEvent.pointerMove(element, { clientX: 0, clientY: 80 });
            fireEvent.pointerUp(element, { clientX: 0, clientY: 80 });

            expect(toasts()).toHaveLength(1);
        });
    });

    describe("what every toast is given", () => {
        it("takes what the Toaster gives them all", () => {
            renderToaster({ toastOptions: { closeButton: true, className: "shared" } });
            raise(() => toast("Saved"));

            expect(first()).toHaveClass("shared");
            expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
        });

        it("lets a toast say otherwise for itself", () => {
            renderToaster({ toastOptions: { closeButton: true } });
            raise(() => toast("Saved", { closeButton: false }));

            expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
        });

        it("carries a class of the toast's own as well", () => {
            renderToaster();
            raise(() => toast("Saved", { className: "own" }));

            expect(first()).toHaveClass("own");
        });
    });
});
