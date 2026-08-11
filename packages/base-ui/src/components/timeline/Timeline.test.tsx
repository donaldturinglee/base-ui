import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { Timeline } from ".";
import type { TimelineBadgeVariant, TimelineClipSidebar } from "./Timeline.types";

const timeline = () => screen.getByRole("list");

const variants: TimelineBadgeVariant[] = [
    "accent",
    "success",
    "attention",
    "severe",
    "danger",
    "done",
    "open",
    "closed",
    "sponsors",
];

describe("Timeline", () => {
    it("renders an ordered list", () => {
        render(<Timeline />);
        expect(timeline().tagName).toBe("OL");
    });

    it("says it is a list, which Safari would otherwise take away", () => {
        // The semantics go with the markers, and a timeline has none
        render(<Timeline />);
        expect(timeline()).toHaveAttribute("role", "list");
    });

    it("tags the timeline and its parts with data-component attributes", () => {
        const { container } = render(
            <Timeline>
                <Timeline.Item>
                    <Timeline.Avatar />
                    <Timeline.Badge />
                    <Timeline.Body>A message</Timeline.Body>
                    <Timeline.Actions />
                </Timeline.Item>
                <Timeline.Break />
            </Timeline>,
        );

        for (const name of [
            "Timeline",
            "Timeline.Item",
            "Timeline.Avatar",
            "Timeline.Badge",
            "Timeline.Body",
            "Timeline.Actions",
            "Timeline.Break",
        ]) {
            expect(container.querySelector(`[data-component='${name}']`)).not.toBeNull();
        }
    });

    it("becomes its own query container so it can respond to the room it has", () => {
        render(<Timeline />);
        expect(timeline()).toHaveClass("timeline");
    });

    it("trims neither end by default", () => {
        render(<Timeline />);
        expect(timeline()).not.toHaveAttribute("data-clip-sidebar");
    });

    it("trims both ends when it is simply told to", () => {
        render(<Timeline clipSidebar />);
        expect(timeline()).toHaveAttribute("data-clip-sidebar", "both");
    });

    it("trims the end it is told to", () => {
        const clips: TimelineClipSidebar[] = ["start", "end", "both"];

        for (const clipSidebar of clips) {
            const { unmount } = render(<Timeline clipSidebar={clipSidebar} />);
            expect(timeline()).toHaveAttribute("data-clip-sidebar", clipSidebar);
            unmount();
        }
    });

    it("trims neither end when it is told not to", () => {
        render(<Timeline clipSidebar={false} />);
        expect(timeline()).not.toHaveAttribute("data-clip-sidebar");
    });

    it("forwards a ref to the list", () => {
        const ref = React.createRef<HTMLOListElement>();
        render(<Timeline ref={ref} />);
        expect(ref.current).toBe(timeline());
    });

    it("merges a custom className onto the list", () => {
        render(<Timeline className="custom" />);
        expect(timeline()).toHaveClass("custom");
    });
});

describe("Timeline.Item", () => {
    it("renders a list item", () => {
        render(
            <Timeline>
                <Timeline.Item>A message</Timeline.Item>
            </Timeline>,
        );
        expect(screen.getByRole("listitem").tagName).toBe("LI");
    });

    it("marks itself out from the other things a timeline holds", () => {
        // The timeline trims the rail against its first and last item, and a break is a
        // list item as well
        render(<Timeline.Item />);
        expect(screen.getByRole("listitem")).toHaveAttribute("data-timeline-item", "");
    });

    it("draws the rail beside itself", () => {
        render(<Timeline.Item />);
        expect(screen.getByRole("listitem")).toHaveClass("timeline-item-rail");
    });

    it("is not condensed by default", () => {
        render(<Timeline.Item />);
        expect(screen.getByRole("listitem")).not.toHaveAttribute("data-condensed");
    });

    it("draws itself tighter when condensed", () => {
        render(<Timeline.Item condensed />);
        const item = screen.getByRole("listitem");
        expect(item).toHaveAttribute("data-condensed", "");
        expect(item).toHaveClass("timeline-item-condensed");
    });

    it("brings the badge down to a line of text when condensed", () => {
        render(<Timeline.Item condensed />);
        expect(screen.getByRole("listitem")).toHaveClass("timeline-item-condensed-badge");
    });

    it("forwards a ref to the list item", () => {
        const ref = React.createRef<HTMLLIElement>();
        render(<Timeline.Item ref={ref} />);
        expect(ref.current).toBe(screen.getByRole("listitem"));
    });

    it("merges a custom className onto the list item", () => {
        render(<Timeline.Item className="custom" />);
        expect(screen.getByRole("listitem")).toHaveClass("custom");
    });
});

describe("Timeline.Badge", () => {
    const badge = (container: HTMLElement) =>
        container.querySelector("[data-component='Timeline.Badge']") as HTMLElement;

    it("renders its children", () => {
        render(
            <Timeline.Badge>
                <span>Icon</span>
            </Timeline.Badge>,
        );
        expect(screen.getByText("Icon")).toBeInTheDocument();
    });

    it("stands in a wrapper that keeps it above the rail", () => {
        const { container } = render(<Timeline.Badge />);
        expect(badge(container).parentElement).toHaveClass("timeline-badge-wrapper");
    });

    it("carries no variant by default", () => {
        const { container } = render(<Timeline.Badge />);
        expect(badge(container)).not.toHaveAttribute("data-variant");
    });

    it("fills itself for every variant", () => {
        for (const variant of variants) {
            const { container, unmount } = render(<Timeline.Badge variant={variant} />);
            expect(badge(container)).toHaveAttribute("data-variant", variant);
            expect(badge(container)).toHaveClass(`timeline-badge-${variant}`);
            unmount();
        }
    });

    it("sets its contents against the fill a variant gives it", () => {
        const { container } = render(<Timeline.Badge variant="done" />);
        expect(badge(container)).toHaveClass("timeline-badge-done");
    });

    it("forwards a ref to the badge rather than to its wrapper", () => {
        const ref = React.createRef<HTMLDivElement>();
        const { container } = render(<Timeline.Badge ref={ref} />);
        expect(ref.current).toBe(badge(container));
    });

    it("merges a custom className onto the badge", () => {
        const { container } = render(<Timeline.Badge className="custom" />);
        expect(badge(container)).toHaveClass("custom");
    });
});

describe("Timeline.Break", () => {
    it("renders a list item that is left out of the list", () => {
        const { container } = render(<Timeline.Break />);
        const element = container.firstElementChild;

        expect(element?.tagName).toBe("LI");
        expect(element).toHaveAttribute("role", "presentation");
        expect(screen.queryByRole("listitem")).toBeNull();
    });

    it("pulls a condensed item below it closer", () => {
        const { container } = render(<Timeline.Break />);
        expect(container.firstElementChild).toHaveClass("timeline-break-before-condensed");
    });

    it("merges a custom className onto the break", () => {
        const { container } = render(<Timeline.Break className="custom" />);
        expect(container.firstElementChild).toHaveClass("custom");
    });
});

describe("Timeline.Body", () => {
    it("renders its children", () => {
        render(<Timeline.Body>A message</Timeline.Body>);
        expect(screen.getByText("A message")).toBeInTheDocument();
    });

    it("takes the room left over beside the badge", () => {
        const { container } = render(<Timeline.Body />);
        expect(container.firstElementChild).toHaveClass("timeline-body");
    });

    it("passes extra props onto the body", () => {
        render(<Timeline.Body data-testid="body" />);
        expect(screen.getByTestId("body")).toHaveAttribute("data-component", "Timeline.Body");
    });
});

describe("Timeline.Actions", () => {
    it("renders its children", () => {
        render(
            <Timeline.Actions>
                <button type="button">Revert</button>
            </Timeline.Actions>,
        );
        expect(screen.getByRole("button", { name: "Revert" })).toBeInTheDocument();
    });

    it("stands at the end of the item", () => {
        const { container } = render(<Timeline.Actions />);
        expect(container.firstElementChild).toHaveClass("timeline-actions");
    });

    it("drops onto its own row where there is little room", () => {
        const { container } = render(<Timeline.Actions />);
        expect(container.firstElementChild).toHaveClass("timeline-actions-narrow");
    });
});

describe("Timeline.Avatar", () => {
    it("renders its children", () => {
        render(
            <Timeline.Avatar>
                <span>Avatar</span>
            </Timeline.Avatar>,
        );
        expect(screen.getByText("Avatar")).toBeInTheDocument();
    });

    it("stands out in the gutter beside the rail", () => {
        const { container } = render(<Timeline.Avatar />);
        expect(container.firstElementChild).toHaveClass("timeline-avatar");
    });

    it("passes extra props onto the avatar", () => {
        render(<Timeline.Avatar data-testid="avatar" />);
        expect(screen.getByTestId("avatar")).toHaveAttribute("data-component", "Timeline.Avatar");
    });
});
