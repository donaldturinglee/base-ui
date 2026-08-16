import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Frame, FRAME_ROOT_CLASS } from ".";

const frame = () => document.querySelector("[data-component='Frame']") as HTMLIFrameElement;

const frameDocument = () => frame().contentWindow?.document;

// The children are drawn into a document of their own, so they are looked for in there rather
// than through the queries that read this one
const inside = (selector: string) => frameDocument()?.querySelector(selector);

const withText = (text: string) =>
    [...(frameDocument()?.body.querySelectorAll("*") ?? [])].find(
        (element) => element.textContent === text,
    );

describe("Frame", () => {
    it("renders an iframe", async () => {
        render(<Frame />);

        await waitFor(() => expect(frame()).toBeInTheDocument());
        expect(frame().tagName).toBe("IFRAME");
    });

    it("names itself for a screen reader where it was not given a name", async () => {
        render(<Frame />);

        await waitFor(() => expect(frame()).toHaveAttribute("title"));
        expect(frame().getAttribute("title")).toMatch(/^Frame /);
    });

    it("takes a name of its own over the one it would have made up", async () => {
        render(<Frame title="Preview" />);

        await waitFor(() => expect(screen.getByTitle("Preview")).toBeInTheDocument());
    });

    it("passes the rest of its props down", async () => {
        render(<Frame className="preview" width={320} data-testid="frame" />);

        await waitFor(() => expect(frame()).toHaveClass("frame"));
        expect(frame()).toHaveClass("preview");
        expect(frame()).toHaveAttribute("width", "320");
        expect(frame()).toHaveAttribute("data-testid", "frame");
    });

    it("forwards a ref to the element it rendered", async () => {
        const ref = React.createRef<HTMLIFrameElement>();
        render(<Frame ref={ref} />);

        await waitFor(() => expect(ref.current).toBe(frame()));
    });

    describe("the document it writes", () => {
        it("lays a root down for the children to be drawn into", async () => {
            render(<Frame />);

            await waitFor(() => expect(inside(`.${FRAME_ROOT_CLASS}`)).toBeTruthy());
        });

        it("takes away the margins the browser puts on of its own", async () => {
            render(<Frame />);

            await waitFor(() => expect(frameDocument()?.head.querySelector("style")).toBeTruthy());
            expect(frameDocument()?.head.innerHTML).toContain("box-sizing");
        });

        it("writes a document of the caller's instead where it was given one", async () => {
            render(<Frame srcDoc="<html><body><main id='own'></main></body></html>" />);

            await waitFor(() => expect(inside("#own")).toBeTruthy());
            // Written rather than handed over as an attribute, so the frame carries none
            expect(frame()).not.toHaveAttribute("srcdoc");
        });
    });

    describe("the children", () => {
        it("draws them inside the frame rather than in this document", async () => {
            render(
                <Frame>
                    <p>Inside the frame</p>
                </Frame>,
            );

            await waitFor(() => expect(withText("Inside the frame")).toBeTruthy());
            expect(screen.queryByText("Inside the frame")).toBeNull();
        });

        it("draws them into the root it laid down", async () => {
            render(
                <Frame>
                    <p>Inside the frame</p>
                </Frame>,
            );

            await waitFor(() => expect(withText("Inside the frame")).toBeTruthy());
            expect(withText("Inside the frame")?.closest(`.${FRAME_ROOT_CLASS}`)).toBeTruthy();
        });

        it("draws them into the body where the document left no root", async () => {
            render(
                <Frame srcDoc="<html><body></body></html>">
                    <p>Inside the frame</p>
                </Frame>,
            );

            await waitFor(() => expect(withText("Inside the frame")).toBeTruthy());
        });

        it("keeps them up to date as they change", async () => {
            const { rerender } = render(
                <Frame>
                    <p>First</p>
                </Frame>,
            );
            await waitFor(() => expect(withText("First")).toBeTruthy());

            rerender(
                <Frame>
                    <p>Second</p>
                </Frame>,
            );
            await waitFor(() => expect(withText("Second")).toBeTruthy());
            expect(withText("First")).toBeFalsy();
        });
    });

    describe("the head", () => {
        it("writes what it was given into the frame's own head", async () => {
            render(<Frame head={<link rel="stylesheet" href="/preview.css" />} />);

            await waitFor(() => expect(inside("head link")).toBeTruthy());
            expect(inside("head link")).toHaveAttribute("href", "/preview.css");
        });

        it("leaves the head alone where it was given nothing", async () => {
            render(<Frame />);

            await waitFor(() => expect(frame()).toBeInTheDocument());
            expect(inside("head link")).toBeFalsy();
        });
    });

    describe("mounting", () => {
        it("says when the children have been drawn into the frame", async () => {
            const onMount = vi.fn();
            render(
                <Frame onMount={onMount}>
                    <p>Inside the frame</p>
                </Frame>,
            );

            await waitFor(() => expect(onMount).toHaveBeenCalledTimes(1));
        });

        it("says when they have been taken back out again", async () => {
            const onUnmount = vi.fn();
            const { unmount } = render(<Frame onUnmount={onUnmount} />);

            await waitFor(() => expect(frame()).toBeInTheDocument());
            expect(onUnmount).not.toHaveBeenCalled();

            unmount();
            expect(onUnmount).toHaveBeenCalledTimes(1);
        });

        it("does not call the callbacks again for a fresh function on a later render", async () => {
            const onMount = vi.fn();
            const { rerender } = render(<Frame onMount={() => onMount()} />);

            await waitFor(() => expect(onMount).toHaveBeenCalledTimes(1));

            rerender(<Frame onMount={() => onMount()} />);
            expect(onMount).toHaveBeenCalledTimes(1);
        });
    });
});
