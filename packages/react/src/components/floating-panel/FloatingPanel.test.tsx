import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { FloatingPanel } from ".";
import type { FloatingPanelProps, FloatingPanelResizeAxis } from "./FloatingPanel.types";

const originalPointerEvent = window.PointerEvent;

const part = (name: string) =>
    document.querySelector(`[data-component="FloatingPanel.${name}"]`) as HTMLElement;

const positioner = () => part("Positioner");

// Where the panel stands is carried in custom properties rather than written onto the element, so
// the readings are taken from there
const rect = () => {
    const element = positioner();

    return {
        x: element.style.getPropertyValue("--floating-panel-x"),
        y: element.style.getPropertyValue("--floating-panel-y"),
        width: element.style.getPropertyValue("--floating-panel-width"),
        height: element.style.getPropertyValue("--floating-panel-height"),
    };
};

const Panel = ({
    children,
    axes = ["se"],
    ...props
}: FloatingPanelProps & { axes?: FloatingPanelResizeAxis[] }) => (
    <FloatingPanel {...props}>
        <FloatingPanel.Trigger>Open</FloatingPanel.Trigger>
        <FloatingPanel.Positioner>
            <FloatingPanel.Content>
                <FloatingPanel.DragTrigger>
                    <FloatingPanel.Header>
                        <FloatingPanel.Title>Layers</FloatingPanel.Title>
                        <FloatingPanel.Control>
                            <FloatingPanel.StageTrigger stage="minimized" />
                            <FloatingPanel.StageTrigger stage="maximized" />
                            <FloatingPanel.CloseTrigger />
                        </FloatingPanel.Control>
                    </FloatingPanel.Header>
                </FloatingPanel.DragTrigger>
                <FloatingPanel.Body>{children ?? "Panel contents"}</FloatingPanel.Body>
                {axes.map((axis) => (
                    <FloatingPanel.ResizeTrigger key={axis} axis={axis} />
                ))}
            </FloatingPanel.Content>
        </FloatingPanel.Positioner>
    </FloatingPanel>
);

// The gesture is followed on the window, so the moves and the release are fired there rather than
// on the trigger the press landed on
const drag = (from: HTMLElement, to: { x: number; y: number }) => {
    fireEvent.pointerDown(from, { clientX: 0, clientY: 0, button: 0 });
    fireEvent.pointerMove(window, { clientX: to.x, clientY: to.y });
    fireEvent.pointerUp(window, { clientX: to.x, clientY: to.y });
};

// jsdom has no PointerEvent, and the plain event it falls back on carries none of the readings a
// gesture is worked out from
beforeEach(() => {
    window.PointerEvent = window.MouseEvent as unknown as typeof window.PointerEvent;
});

afterEach(() => {
    window.PointerEvent = originalPointerEvent;
});

describe("FloatingPanel", () => {
    it("shows nothing until it is opened", () => {
        render(<Panel />);

        expect(positioner()).toBeNull();
        expect(screen.getByRole("button", { name: "Open" })).toHaveAttribute(
            "aria-expanded",
            "false",
        );
    });

    it("opens when the trigger is pressed", () => {
        render(<Panel />);

        fireEvent.click(screen.getByRole("button", { name: "Open" }));

        expect(positioner()).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Open" })).toHaveAttribute(
            "aria-expanded",
            "true",
        );
    });

    it("starts open when it is told to", () => {
        render(<Panel defaultOpen />);
        expect(positioner()).toBeInTheDocument();
    });

    it("names the panel to a screen reader with its title", () => {
        render(<Panel defaultOpen />);

        expect(screen.getByRole("dialog", { name: "Layers" })).toBeInTheDocument();
    });

    it("renders every part it was given", () => {
        render(<Panel defaultOpen />);

        for (const name of [
            "Positioner",
            "Content",
            "DragTrigger",
            "Header",
            "Title",
            "Control",
            "Body",
            "ResizeTrigger",
        ]) {
            expect(part(name)).toBeInTheDocument();
        }
    });

    it("renders outside the tree it was written in", () => {
        const { container } = render(<Panel defaultOpen />);

        expect(container).not.toContainElement(positioner());
        expect(document.body).toContainElement(positioner());
    });

    it("stays where it was written when laid out against an ancestor", () => {
        const { container } = render(<Panel defaultOpen strategy="absolute" />);

        expect(container).toContainElement(positioner());
        expect(positioner()).toHaveAttribute("data-strategy", "absolute");
    });

    it("opens at the rect it was given", () => {
        render(
            <Panel
                defaultOpen
                defaultPosition={{ x: 40, y: 60 }}
                defaultSize={{ width: 300, height: 200 }}
            />,
        );

        expect(rect()).toEqual({ x: "40px", y: "60px", width: "300px", height: "200px" });
    });

    describe("closing", () => {
        it("closes when the close trigger is pressed", () => {
            render(<Panel defaultOpen />);

            fireEvent.click(screen.getByRole("button", { name: "Close panel" }));
            expect(positioner()).toBeNull();
        });

        it("closes on escape", () => {
            render(<Panel defaultOpen />);

            fireEvent.keyDown(document, { key: "Escape" });
            expect(positioner()).toBeNull();
        });

        it("stays open on escape where it was told to", () => {
            render(<Panel defaultOpen closeOnEscape={false} />);

            fireEvent.keyDown(document, { key: "Escape" });
            expect(positioner()).toBeInTheDocument();
        });

        it("reports the change to a caller holding the state", () => {
            const onOpenChange = vi.fn();
            render(<Panel open onOpenChange={onOpenChange} />);

            fireEvent.click(screen.getByRole("button", { name: "Close panel" }));

            expect(onOpenChange).toHaveBeenCalledWith(false);
            // Held by the caller, so it stays showing until the caller says otherwise
            expect(positioner()).toBeInTheDocument();
        });
    });

    describe("dragging", () => {
        it("moves the panel by however far the pointer went", () => {
            render(<Panel defaultOpen defaultPosition={{ x: 24, y: 24 }} />);

            drag(part("DragTrigger"), { x: 100, y: 50 });

            expect(rect().x).toBe("124px");
            expect(rect().y).toBe("74px");
        });

        it("says so while the gesture is under way", () => {
            render(<Panel defaultOpen />);

            fireEvent.pointerDown(part("DragTrigger"), { clientX: 0, clientY: 0, button: 0 });
            expect(positioner()).toHaveAttribute("data-dragging", "");

            fireEvent.pointerUp(window, { clientX: 0, clientY: 0 });
            expect(positioner()).not.toHaveAttribute("data-dragging");
        });

        it("reports each step, and where it landed once", () => {
            const onPositionChange = vi.fn();
            const onPositionChangeEnd = vi.fn();

            render(
                <Panel
                    defaultOpen
                    defaultPosition={{ x: 0, y: 0 }}
                    onPositionChange={onPositionChange}
                    onPositionChangeEnd={onPositionChangeEnd}
                />,
            );

            fireEvent.pointerDown(part("DragTrigger"), { clientX: 0, clientY: 0, button: 0 });
            fireEvent.pointerMove(window, { clientX: 10, clientY: 0 });
            fireEvent.pointerMove(window, { clientX: 20, clientY: 0 });
            fireEvent.pointerUp(window, { clientX: 20, clientY: 0 });

            expect(onPositionChange).toHaveBeenCalledTimes(2);
            expect(onPositionChangeEnd).toHaveBeenCalledTimes(1);
            expect(onPositionChangeEnd).toHaveBeenCalledWith({ x: 20, y: 0 });
        });

        it("measures every step from where the gesture started rather than the last one", () => {
            render(<Panel defaultOpen defaultPosition={{ x: 50, y: 50 }} />);

            fireEvent.pointerDown(part("DragTrigger"), { clientX: 0, clientY: 0, button: 0 });
            fireEvent.pointerMove(window, { clientX: 30, clientY: 30 });
            // Dragged back over its own path, which lands it where it began
            fireEvent.pointerMove(window, { clientX: 0, clientY: 0 });
            fireEvent.pointerUp(window, { clientX: 0, clientY: 0 });

            expect(rect().x).toBe("50px");
            expect(rect().y).toBe("50px");
        });

        it("leaves a press on a button in the header to that button", () => {
            render(<Panel defaultOpen defaultPosition={{ x: 24, y: 24 }} />);

            drag(screen.getByRole("button", { name: "Minimize panel" }), { x: 100, y: 100 });

            expect(rect().x).toBe("24px");
        });

        it("leaves a press of anything but the primary button alone", () => {
            render(<Panel defaultOpen defaultPosition={{ x: 24, y: 24 }} />);

            fireEvent.pointerDown(part("DragTrigger"), { clientX: 0, clientY: 0, button: 2 });
            fireEvent.pointerMove(window, { clientX: 100, clientY: 100 });

            expect(rect().x).toBe("24px");
        });

        it("cannot be dragged where it was told it cannot", () => {
            render(<Panel defaultOpen draggable={false} defaultPosition={{ x: 24, y: 24 }} />);

            drag(part("DragTrigger"), { x: 100, y: 100 });
            expect(rect().x).toBe("24px");
        });

        it("cannot be dragged while it is disabled", () => {
            render(<Panel defaultOpen disabled defaultPosition={{ x: 24, y: 24 }} />);

            drag(part("DragTrigger"), { x: 100, y: 100 });
            expect(rect().x).toBe("24px");
        });
    });

    describe("the boundary", () => {
        it("holds the panel within the room it was given", () => {
            render(<Panel defaultOpen defaultPosition={{ x: 24, y: 24 }} />);

            drag(part("DragTrigger"), { x: -200, y: -200 });

            expect(rect().x).toBe("0px");
            expect(rect().y).toBe("0px");
        });

        it("lets the panel past the edge where it was told to", () => {
            render(<Panel defaultOpen allowOverflow defaultPosition={{ x: 24, y: 24 }} />);

            drag(part("DragTrigger"), { x: -200, y: -200 });

            expect(rect().x).toBe("-176px");
        });

        it("rounds each step onto the grid it was given", () => {
            render(<Panel defaultOpen gridSize={10} defaultPosition={{ x: 24, y: 24 }} />);

            drag(part("DragTrigger"), { x: 13, y: 27 });

            expect(rect().x).toBe("40px");
            expect(rect().y).toBe("50px");
        });
    });

    describe("resizing", () => {
        it("grows the panel from the corner that was dragged", () => {
            render(<Panel defaultOpen defaultSize={{ width: 320, height: 240 }} />);

            drag(part("ResizeTrigger"), { x: 50, y: 50 });

            expect(rect().width).toBe("370px");
            expect(rect().height).toBe("290px");
        });

        it("moves the corner the panel is positioned by when the other edges are dragged", () => {
            render(
                <Panel
                    defaultOpen
                    axes={["nw"]}
                    defaultPosition={{ x: 100, y: 100 }}
                    defaultSize={{ width: 320, height: 240 }}
                />,
            );

            drag(part("ResizeTrigger"), { x: 40, y: 40 });

            expect(rect()).toEqual({ x: "140px", y: "140px", width: "280px", height: "200px" });
        });

        // Which corners a panel can be taken hold of by is settled by which triggers were
        // rendered, so each of them is dragged here to say that any of the four does its work
        it("resizes from every corner, each holding the one opposite it still", () => {
            const corners: {
                axis: FloatingPanelResizeAxis;
                expected: Record<"x" | "y" | "width" | "height", string>;
            }[] = [
                {
                    axis: "nw",
                    expected: { x: "120px", y: "120px", width: "300px", height: "220px" },
                },
                {
                    axis: "ne",
                    expected: { x: "100px", y: "120px", width: "340px", height: "220px" },
                },
                {
                    axis: "sw",
                    expected: { x: "120px", y: "100px", width: "300px", height: "260px" },
                },
                {
                    axis: "se",
                    expected: { x: "100px", y: "100px", width: "340px", height: "260px" },
                },
            ];

            for (const { axis, expected } of corners) {
                const { unmount } = render(
                    <Panel
                        defaultOpen
                        axes={[axis]}
                        defaultPosition={{ x: 100, y: 100 }}
                        defaultSize={{ width: 320, height: 240 }}
                    />,
                );

                drag(part("ResizeTrigger"), { x: 20, y: 20 });

                expect(rect(), `dragged from ${axis}`).toEqual(expected);

                unmount();
            }
        });

        it("holds the panel to the smallest size it was given", () => {
            render(
                <Panel
                    defaultOpen
                    defaultSize={{ width: 320, height: 240 }}
                    minSize={{ width: 200, height: 120 }}
                />,
            );

            drag(part("ResizeTrigger"), { x: -400, y: -400 });

            expect(rect().width).toBe("200px");
            expect(rect().height).toBe("120px");
        });

        it("holds the panel to the largest size it was given", () => {
            render(
                <Panel
                    defaultOpen
                    defaultSize={{ width: 320, height: 240 }}
                    maxSize={{ width: 400, height: 300 }}
                />,
            );

            drag(part("ResizeTrigger"), { x: 400, y: 400 });

            expect(rect().width).toBe("400px");
            expect(rect().height).toBe("300px");
        });

        it("keeps the panel in proportion where it was told to", () => {
            render(
                <Panel
                    defaultOpen
                    lockAspectRatio
                    defaultSize={{ width: 300, height: 150 }}
                    minSize={{ width: 100, height: 50 }}
                />,
            );

            drag(part("ResizeTrigger"), { x: 100, y: 0 });

            // Two to one at the start, and still two to one after the side was dragged out
            expect(rect().width).toBe("400px");
            expect(rect().height).toBe("200px");
        });

        it("reports where it landed once the edge is let go of", () => {
            const onSizeChangeEnd = vi.fn();
            render(
                <Panel
                    defaultOpen
                    defaultSize={{ width: 320, height: 240 }}
                    onSizeChangeEnd={onSizeChangeEnd}
                />,
            );

            drag(part("ResizeTrigger"), { x: 20, y: 20 });

            expect(onSizeChangeEnd).toHaveBeenCalledWith({ width: 340, height: 260 });
        });

        it("cannot be resized where it was told it cannot", () => {
            render(
                <Panel defaultOpen resizable={false} defaultSize={{ width: 320, height: 240 }} />,
            );

            drag(part("ResizeTrigger"), { x: 50, y: 50 });
            expect(rect().width).toBe("320px");
        });
    });

    describe("the stages", () => {
        it("draws the panel as its header alone when minimized", () => {
            render(<Panel defaultOpen />);

            fireEvent.click(screen.getByRole("button", { name: "Minimize panel" }));

            expect(positioner()).toHaveAttribute("data-stage", "minimized");
            expect(part("Body")).toBeNull();
        });

        it("fills the room it was given when maximized", () => {
            render(<Panel defaultOpen />);

            fireEvent.click(screen.getByRole("button", { name: "Maximize panel" }));

            expect(positioner()).toHaveAttribute("data-stage", "maximized");
            expect(part("Body")).toBeInTheDocument();
        });

        it("takes the panel back to the default from the stage it is already at", () => {
            render(<Panel defaultOpen />);

            fireEvent.click(screen.getByRole("button", { name: "Minimize panel" }));
            // The same button now offers to put it back rather than to minimize it again
            fireEvent.click(screen.getByRole("button", { name: "Restore panel" }));

            expect(positioner()).toHaveAttribute("data-stage", "default");
        });

        it("cannot be dragged while maximized, being laid out from the room it was given", () => {
            render(
                <Panel defaultOpen defaultStage="maximized" defaultPosition={{ x: 24, y: 24 }} />,
            );

            drag(part("DragTrigger"), { x: 100, y: 100 });
            expect(rect().x).toBe("24px");
        });

        // A minimized panel is still stood at its own corner and only drawn shorter, so it is
        // carried about like any other. Only a maximized one has nothing for a drag to move
        it("can still be carried about while it is minimized", () => {
            render(
                <Panel defaultOpen defaultStage="minimized" defaultPosition={{ x: 24, y: 24 }} />,
            );

            drag(part("DragTrigger"), { x: 100, y: 50 });

            expect(rect().x).toBe("124px");
            expect(rect().y).toBe("74px");
        });

        it("moves with the arrow keys while it is minimized", () => {
            render(
                <Panel defaultOpen defaultStage="minimized" defaultPosition={{ x: 100, y: 100 }} />,
            );

            fireEvent.keyDown(part("Content"), { key: "ArrowRight" });
            expect(rect().x).toBe("108px");
        });

        it("cannot be resized while minimized, having only its header to show", () => {
            render(
                <Panel
                    defaultOpen
                    defaultStage="minimized"
                    defaultSize={{ width: 320, height: 240 }}
                />,
            );

            drag(part("ResizeTrigger"), { x: 50, y: 50 });
            expect(rect().width).toBe("320px");
        });

        it("reports the change to a caller holding the state", () => {
            const onStageChange = vi.fn();
            render(<Panel defaultOpen stage="default" onStageChange={onStageChange} />);

            fireEvent.click(screen.getByRole("button", { name: "Minimize panel" }));

            expect(onStageChange).toHaveBeenCalledWith("minimized");
            expect(positioner()).toHaveAttribute("data-stage", "default");
        });
    });

    describe("the keyboard", () => {
        it("moves the panel with the arrow keys", () => {
            render(<Panel defaultOpen defaultPosition={{ x: 100, y: 100 }} />);

            fireEvent.keyDown(part("Content"), { key: "ArrowRight" });
            expect(rect().x).toBe("108px");

            fireEvent.keyDown(part("Content"), { key: "ArrowUp" });
            expect(rect().y).toBe("92px");
        });

        it("moves it further with shift held", () => {
            render(<Panel defaultOpen defaultPosition={{ x: 100, y: 100 }} />);

            fireEvent.keyDown(part("Content"), { key: "ArrowRight", shiftKey: true });
            expect(rect().x).toBe("140px");
        });

        it("leaves an arrow pressed inside the panel to whatever holds it", () => {
            render(
                <Panel defaultOpen defaultPosition={{ x: 100, y: 100 }}>
                    <input aria-label="Search" />
                </Panel>,
            );

            fireEvent.keyDown(screen.getByRole("textbox", { name: "Search" }), {
                key: "ArrowRight",
            });

            expect(rect().x).toBe("100px");
        });

        it("resizes the panel from a resize trigger", () => {
            render(<Panel defaultOpen defaultSize={{ width: 320, height: 240 }} />);

            fireEvent.keyDown(part("ResizeTrigger"), { key: "ArrowRight" });
            expect(rect().width).toBe("328px");

            fireEvent.keyDown(part("ResizeTrigger"), { key: "ArrowDown" });
            expect(rect().height).toBe("248px");
        });

        it("names each resize trigger by the edge it takes hold of", () => {
            render(<Panel defaultOpen axes={["nw", "se"]} />);

            expect(
                screen.getByRole("button", { name: "Resize panel from the top left" }),
            ).toBeInTheDocument();
            expect(
                screen.getByRole("button", { name: "Resize panel from the bottom right" }),
            ).toBeInTheDocument();
        });
    });

    describe("held by the caller", () => {
        it("stands where the prop says rather than where it was dragged", () => {
            const onPositionChange = vi.fn();
            render(
                <Panel
                    defaultOpen
                    position={{ x: 10, y: 10 }}
                    onPositionChange={onPositionChange}
                />,
            );

            drag(part("DragTrigger"), { x: 100, y: 100 });

            expect(onPositionChange).toHaveBeenCalledWith({ x: 110, y: 110 });
            expect(rect().x).toBe("10px");
        });

        it("is the size the prop says rather than the one it was dragged to", () => {
            const onSizeChange = vi.fn();
            render(
                <Panel
                    defaultOpen
                    size={{ width: 300, height: 200 }}
                    onSizeChange={onSizeChange}
                />,
            );

            drag(part("ResizeTrigger"), { x: 50, y: 50 });

            expect(onSizeChange).toHaveBeenCalledWith({ width: 350, height: 250 });
            expect(rect().width).toBe("300px");
        });
    });
});
