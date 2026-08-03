import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import StateLabel from "./StateLabel";
import type { StateLabelStatus } from "./StateLabel.types";

// The tone each status is expected to carry, keyed by the background token it resolves to
const tones: Record<StateLabelStatus, string> = {
    open: "open",
    issueOpened: "open",
    pullOpened: "open",
    alertOpened: "open",
    closed: "done",
    issueClosed: "done",
    pullMerged: "done",
    alertFixed: "done",
    pullClosed: "closed",
    alertClosed: "closed",
    issueClosedNotPlanned: "neutral",
    unavailable: "neutral",
    archived: "neutral",
    pullQueued: "attention",
    draft: "draft",
    issueDraft: "draft",
    alertDismissed: "draft",
};

describe("StateLabel", () => {
    it("renders a span element by default", () => {
        render(
            <StateLabel status="open" data-testid="state">
                Open
            </StateLabel>,
        );
        expect(screen.getByTestId("state").tagName).toBe("SPAN");
    });

    it("renders as the element passed to the as prop", () => {
        render(
            <StateLabel as="div" status="open" data-testid="state">
                Open
            </StateLabel>,
        );
        expect(screen.getByTestId("state").tagName).toBe("DIV");
    });

    it("renders its children", () => {
        render(<StateLabel status="issueOpened">Open</StateLabel>);
        expect(screen.getByText("Open")).toBeInTheDocument();
    });

    it("tags the root element with a data-component attribute", () => {
        render(
            <StateLabel status="open" data-testid="state">
                Open
            </StateLabel>,
        );
        expect(screen.getByTestId("state")).toHaveAttribute("data-component", "StateLabel");
    });

    it("records the status in a data attribute", () => {
        render(
            <StateLabel status="pullMerged" data-testid="state">
                Merged
            </StateLabel>,
        );
        expect(screen.getByTestId("state")).toHaveAttribute("data-status", "pullMerged");
    });

    it("colours every status from its tone", () => {
        for (const status of Object.keys(tones) as StateLabelStatus[]) {
            const { unmount } = render(
                <StateLabel status={status} data-testid="state">
                    Label
                </StateLabel>,
            );
            const state = screen.getByTestId("state");
            expect(state).toHaveClass(
                `bg-background-${tones[status]}-emphasis`,
                `[box-shadow:var(--box-shadow-thin)_var(--border-color-${tones[status]}-emphasis)]`,
            );
            unmount();
        }
    });

    it("falls back to the medium size", () => {
        render(
            <StateLabel status="open" data-testid="state">
                Open
            </StateLabel>,
        );
        const state = screen.getByTestId("state");
        expect(state).toHaveAttribute("data-size", "medium");
        expect(state).toHaveClass("[font-size:var(--text-body-size-medium)]");
        expect(state).toHaveClass("px-[var(--base-size-12)]");
    });

    it("respects the small size", () => {
        render(
            <StateLabel status="open" size="small" data-testid="state">
                Open
            </StateLabel>,
        );
        const state = screen.getByTestId("state");
        expect(state).toHaveAttribute("data-size", "small");
        expect(state).toHaveClass("[font-size:var(--text-body-size-small)]");
        expect(state).toHaveClass("px-[var(--base-size-8)]");
    });

    it("rounds itself into a pill", () => {
        render(
            <StateLabel status="open" data-testid="state">
                Open
            </StateLabel>,
        );
        expect(screen.getByTestId("state")).toHaveClass("rounded-[var(--border-radius-full)]");
    });

    it("leaves the generic statuses without an icon", () => {
        for (const status of ["open", "closed"] as StateLabelStatus[]) {
            const { container, unmount } = render(<StateLabel status={status}>Label</StateLabel>);
            expect(container.querySelector("svg")).toBeNull();
            unmount();
        }
    });

    it("shows an icon for a specific status", () => {
        const { container } = render(<StateLabel status="issueOpened">Open</StateLabel>);
        expect(container.querySelector("svg")).toBeInstanceOf(SVGElement);
    });

    it("names the icon after the kind of thing the state belongs to", () => {
        render(<StateLabel status="pullMerged">Merged</StateLabel>);
        expect(screen.getByRole("img", { name: "Pull request" })).toBeInTheDocument();
    });

    it("names a not planned issue apart from an ordinary one", () => {
        render(<StateLabel status="issueClosedNotPlanned">Closed</StateLabel>);
        expect(screen.getByRole("img", { name: "Issue, not planned" })).toBeInTheDocument();
    });

    it("hides an icon that has nothing to add", () => {
        const { container } = render(<StateLabel status="unavailable">Unavailable</StateLabel>);
        const icon = container.querySelector("svg");
        expect(icon).toHaveAttribute("aria-hidden", "true");
        expect(icon).not.toHaveAttribute("role");
    });

    it("shrinks the icon alongside a small label", () => {
        const { container } = render(
            <StateLabel status="issueOpened" size="small">
                Open
            </StateLabel>,
        );
        expect(container.querySelector("svg")).toHaveClass("size-[1em]");
    });

    it("does not leak the status and size props onto the element", () => {
        render(
            <StateLabel status="open" size="small" data-testid="state">
                Open
            </StateLabel>,
        );
        const state = screen.getByTestId("state");
        expect(state).not.toHaveAttribute("status");
        expect(state).not.toHaveAttribute("size");
    });

    it("forwards element specific props to the element passed to the as prop", () => {
        render(
            <StateLabel status="open" id="issue-state" data-testid="state">
                Open
            </StateLabel>,
        );
        expect(screen.getByTestId("state")).toHaveAttribute("id", "issue-state");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLSpanElement>();
        render(
            <StateLabel ref={ref} status="open">
                Open
            </StateLabel>,
        );
        expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });

    it("merges a custom className onto the root element", () => {
        render(
            <StateLabel status="open" className="custom" data-testid="state">
                Open
            </StateLabel>,
        );
        expect(screen.getByTestId("state")).toHaveClass("custom");
    });
});
