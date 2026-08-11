import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { DragHandle, PageLayout } from ".";
import {
    ARROW_KEY_STEP,
    defaultPaneWidth,
    getDefaultPaneWidth,
    getMaxWidthDiffFromViewport,
    isCustomWidthOptions,
    isPaneWidth,
    PANE_MAX_WIDTH_DIFF,
    PANE_MAX_WIDTH_DIFF_WIDE,
    updateAriaValues,
} from "./paneUtils";
import type {
    PageLayoutPaneBaseProps,
    PageLayoutPaneProps,
    PageLayoutSidebarBaseProps,
    PageLayoutSidebarProps,
} from "./PageLayout.types";

// A pane takes `onResizeEnd` and `currentWidth` together or not at all, which a test cannot
// promise while it is spreading whatever it was handed
type PaneProps = Partial<PageLayoutPaneBaseProps> & {
    onResizeEnd?: (width: number) => void;
    currentWidth?: number;
};

type SidebarProps = Partial<PageLayoutSidebarBaseProps> & {
    onResizeEnd?: (width: number) => void;
    currentWidth?: number;
};

const originalResizeObserver = window.ResizeObserver;

// jsdom has no ResizeObserver, and a pane watches its own size to work out whether it
// scrolls
beforeEach(() => {
    window.ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
    } as unknown as typeof ResizeObserver;
});

afterEach(() => {
    window.ResizeObserver = originalResizeObserver;
    localStorage.clear();
});

const part = (container: HTMLElement, name: string) =>
    container.querySelector(`[data-component='PageLayout.${name}']`) as HTMLElement;

const layout = () => screen.getByTestId("layout");

describe("PageLayout", () => {
    it("renders the regions it is given", () => {
        const { container } = render(
            <PageLayout data-testid="layout">
                <PageLayout.Header>Header</PageLayout.Header>
                <PageLayout.Content>Content</PageLayout.Content>
                <PageLayout.Pane>Pane</PageLayout.Pane>
                <PageLayout.Footer>Footer</PageLayout.Footer>
            </PageLayout>,
        );

        for (const name of ["Header", "Content", "Pane", "Footer"]) {
            expect(part(container, name)).not.toBeNull();
        }
    });

    it("tags the root with a data-component attribute", () => {
        render(<PageLayout data-testid="layout" />);
        expect(layout()).toHaveAttribute("data-component", "PageLayout");
    });

    it("renders the header as a banner and the footer as contentinfo", () => {
        render(
            <PageLayout>
                <PageLayout.Header>Header</PageLayout.Header>
                <PageLayout.Content>Content</PageLayout.Content>
                <PageLayout.Footer>Footer</PageLayout.Footer>
            </PageLayout>,
        );

        expect(screen.getByRole("banner")).toBeInTheDocument();
        expect(screen.getByRole("main")).toBeInTheDocument();
        expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });

    it("pulls the header, the footer and the sidebar out of the order they were given in", () => {
        // The regions each have a place of their own, so a caller can write them in
        // whatever order reads best
        const { container } = render(
            <PageLayout data-testid="layout">
                <PageLayout.Content>Content</PageLayout.Content>
                <PageLayout.Header>Header</PageLayout.Header>
            </PageLayout>,
        );

        const wrapper = part(container, "Header").parentElement as HTMLElement;
        expect(wrapper.firstElementChild).toBe(part(container, "Header"));
    });

    it("falls back to the xlarge container width", () => {
        const { container } = render(
            <PageLayout>
                <PageLayout.Content>Content</PageLayout.Content>
            </PageLayout>,
        );
        expect(container.querySelector("[data-width='xlarge']")).not.toBeNull();
    });

    it("holds the page in to the container width it is given", () => {
        const { container } = render(
            <PageLayout containerWidth="medium">
                <PageLayout.Content>Content</PageLayout.Content>
            </PageLayout>,
        );

        const wrapper = container.querySelector("[data-page-layout-wrapper]") as HTMLElement;
        expect(wrapper).toHaveAttribute("data-width", "medium");
        expect(wrapper).toHaveClass("page-layout-width-medium");
    });

    it("reads its spacing from the scale the padding names", () => {
        render(<PageLayout data-testid="layout" padding="condensed" />);
        expect(layout().style.getPropertyValue("--spacing")).toBe(
            "var(--page-layout-spacing-condensed)",
        );
    });

    it("lays itself out in a row once it holds a sidebar", () => {
        render(
            <PageLayout data-testid="layout">
                <PageLayout.Sidebar>Sidebar</PageLayout.Sidebar>
                <PageLayout.Content>Content</PageLayout.Content>
            </PageLayout>,
        );

        expect(layout()).toHaveAttribute("data-has-sidebar", "");
        expect(layout()).toHaveClass("page-layout-has-sidebar");
    });

    it("says nothing about a sidebar it does not hold", () => {
        render(<PageLayout data-testid="layout" />);
        expect(layout()).not.toHaveAttribute("data-has-sidebar");
    });

    it("forwards a ref to the root", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(<PageLayout ref={ref} data-testid="layout" />);
        expect(ref.current).toBe(layout());
    });

    it("merges a custom className onto the root", () => {
        render(<PageLayout className="custom" data-testid="layout" />);
        expect(layout()).toHaveClass("custom");
    });
});

describe("PageLayout.Content", () => {
    it("renders a main element by default", () => {
        render(
            <PageLayout>
                <PageLayout.Content>Content</PageLayout.Content>
            </PageLayout>,
        );
        expect(screen.getByRole("main").tagName).toBe("MAIN");
    });

    it("renders as the element it is given", () => {
        const { container } = render(
            <PageLayout>
                <PageLayout.Content as="div">Content</PageLayout.Content>
            </PageLayout>,
        );
        expect(part(container, "Content").tagName).toBe("DIV");
    });

    it("holds its contents in to the width it is given", () => {
        const { container } = render(
            <PageLayout>
                <PageLayout.Content width="large">Content</PageLayout.Content>
            </PageLayout>,
        );

        const inner = part(container, "Content").firstElementChild as HTMLElement;
        expect(inner).toHaveAttribute("data-width", "large");
        expect(inner).toHaveClass("page-layout-content-width-large");
    });

    it("can be taken away for good or one viewport range at a time", () => {
        const { container, rerender } = render(
            <PageLayout>
                <PageLayout.Content hidden>Content</PageLayout.Content>
            </PageLayout>,
        );
        expect(part(container, "Content")).toHaveAttribute("data-is-hidden", "true");

        rerender(
            <PageLayout>
                <PageLayout.Content hidden={{ narrow: true, regular: false }}>
                    Content
                </PageLayout.Content>
            </PageLayout>,
        );
        expect(part(container, "Content")).toHaveAttribute("data-is-hidden-narrow", "true");
        expect(part(container, "Content")).toHaveAttribute("data-is-hidden-regular", "false");
    });
});

describe("PageLayout.Pane", () => {
    const renderPane = (props: PaneProps = {}) =>
        render(
            <PageLayout>
                <PageLayout.Content>Content</PageLayout.Content>
                <PageLayout.Pane {...(props as PageLayoutPaneProps)}>Pane</PageLayout.Pane>
            </PageLayout>,
        );

    it("stands at the end of the content by default", () => {
        const { container } = renderPane();
        const wrapper = part(container, "Pane").parentElement as HTMLElement;
        expect(wrapper).toHaveAttribute("data-position", "end");
    });

    it("stands where it is told to", () => {
        const { container } = renderPane({ position: "start" });
        const wrapper = part(container, "Pane").parentElement as HTMLElement;
        expect(wrapper).toHaveAttribute("data-position", "start");
    });

    it("takes a place per viewport range", () => {
        const { container } = renderPane({ position: { narrow: "start", regular: "end" } });
        const wrapper = part(container, "Pane").parentElement as HTMLElement;
        expect(wrapper).toHaveAttribute("data-position-narrow", "start");
        expect(wrapper).toHaveAttribute("data-position-regular", "end");
    });

    it("falls back to the medium width", () => {
        const { container } = renderPane();
        expect(part(container, "Pane").style.getPropertyValue("--pane-width-size")).toBe(
            "var(--pane-width-medium)",
        );
    });

    it("takes bounds of the caller's own", () => {
        const { container } = renderPane({
            width: { min: "100px", default: "200px", max: "300px" },
        });
        const pane = part(container, "Pane");

        expect(pane.style.getPropertyValue("--pane-min-width")).toBe("100px");
        expect(pane.style.getPropertyValue("--pane-max-width")).toBe("300px");
        expect(pane.style.getPropertyValue("--pane-width-custom")).toBe("200px");
        expect(pane.style.getPropertyValue("--pane-width-size")).toBe("var(--pane-width-custom)");
    });

    it("cannot be resized by default", () => {
        const { container } = renderPane();
        expect(part(container, "Pane")).not.toHaveAttribute("data-resizable");
        expect(screen.queryByRole("slider")).toBeNull();
    });

    it("shows a handle once it can be resized", () => {
        const { container } = renderPane({ resizable: true });

        expect(part(container, "Pane")).toHaveAttribute("data-resizable", "true");
        expect(screen.getByRole("slider", { name: "Draggable pane splitter" })).toBeInTheDocument();
    });

    it("opens at the width its size asks for", () => {
        const { container } = renderPane({ resizable: true, width: "large" });
        expect(part(container, "Pane").style.getPropertyValue("--pane-width")).toBe(
            `${defaultPaneWidth.large}px`,
        );
    });

    it("says how wide it is to a screen reader", () => {
        renderPane({ resizable: true, width: "small" });

        const handle = screen.getByRole("slider");
        expect(handle).toHaveAttribute("aria-valuenow", String(defaultPaneWidth.small));
        expect(handle).toHaveAttribute(
            "aria-valuetext",
            `Pane width ${defaultPaneWidth.small} pixels`,
        );
    });

    it("keeps the width it is held at", () => {
        const { container } = renderPane({
            resizable: true,
            currentWidth: 400,
            onResizeEnd: () => {},
        });
        expect(part(container, "Pane").style.getPropertyValue("--pane-width")).toBe("400px");
    });

    it("draws a line for the reader to take hold of, whatever divider it was given", () => {
        const { container } = renderPane({ resizable: true });
        const divider = container.querySelector(
            "[data-component='PageLayout.VerticalDivider']",
        ) as HTMLElement;

        expect(divider).toHaveAttribute("data-variant-regular", "line");
    });

    it("divides itself from the content across the page when it stacks", () => {
        const { container } = renderPane({ divider: "line" });
        const divider = container.querySelector(
            "[data-component='PageLayout.HorizontalDivider']",
        ) as HTMLElement;

        expect(divider).toHaveAttribute("data-variant-narrow", "line");
        expect(divider).toHaveAttribute("data-variant-regular", "none");
    });

    it("can be taken away one viewport range at a time", () => {
        const { container } = renderPane({ hidden: { narrow: true, regular: false } });
        const wrapper = part(container, "Pane").parentElement as HTMLElement;
        expect(wrapper).toHaveAttribute("data-is-hidden-narrow", "true");
    });

    it("stays put as the content scrolls past it when sticky", () => {
        const { container } = renderPane({ sticky: true, offsetHeader: 48 });
        const wrapper = part(container, "Pane").parentElement as HTMLElement;

        expect(wrapper).toHaveAttribute("data-sticky", "true");
        expect(wrapper.style.getPropertyValue("--offset-header")).toBe("48px");
    });

    it("forwards a ref to the pane", () => {
        const ref = React.createRef<HTMLDivElement>();
        const { container } = render(
            <PageLayout>
                <PageLayout.Pane ref={ref}>Pane</PageLayout.Pane>
            </PageLayout>,
        );
        expect(ref.current).toBe(part(container, "Pane"));
    });
});

describe("PageLayout.Pane resizing", () => {
    const renderResizable = (props: PaneProps = {}) =>
        render(
            <PageLayout>
                <PageLayout.Content>Content</PageLayout.Content>
                <PageLayout.Pane resizable width="small" {...(props as PageLayoutPaneProps)}>
                    Pane
                </PageLayout.Pane>
            </PageLayout>,
        );

    const paneOf = (container: HTMLElement) => part(container, "Pane");

    it("widens on an arrow key and narrows on the other", () => {
        const { container } = renderResizable();
        const handle = screen.getByRole("slider");
        const start = defaultPaneWidth.small;

        fireEvent.keyDown(handle, { key: "ArrowRight" });
        expect(paneOf(container).style.getPropertyValue("--pane-width")).toBe(
            `${start + ARROW_KEY_STEP}px`,
        );

        fireEvent.keyDown(handle, { key: "ArrowLeft" });
        expect(paneOf(container).style.getPropertyValue("--pane-width")).toBe(`${start}px`);
    });

    it("says the new width to a screen reader as it moves", () => {
        renderResizable();
        const handle = screen.getByRole("slider");

        fireEvent.keyDown(handle, { key: "ArrowRight" });

        const width = defaultPaneWidth.small + ARROW_KEY_STEP;
        expect(handle).toHaveAttribute("aria-valuenow", String(width));
        expect(handle).toHaveAttribute("aria-valuetext", `Pane width ${width} pixels`);
    });

    it("goes no narrower than it is allowed to", () => {
        const { container } = renderResizable({ width: "small", minWidth: defaultPaneWidth.small });
        const handle = screen.getByRole("slider");

        fireEvent.keyDown(handle, { key: "ArrowLeft" });
        expect(paneOf(container).style.getPropertyValue("--pane-width")).toBe(
            `${defaultPaneWidth.small}px`,
        );
    });

    it("reports the width once the reader lets go", () => {
        const onResizeEnd = jest.fn();
        renderResizable({ onResizeEnd, currentWidth: defaultPaneWidth.small });
        const handle = screen.getByRole("slider");

        fireEvent.keyDown(handle, { key: "ArrowRight" });
        fireEvent.keyUp(handle, { key: "ArrowRight" });

        expect(onResizeEnd).toHaveBeenCalledWith(defaultPaneWidth.small + ARROW_KEY_STEP);
    });

    it("goes back to the width its size asks for on a double click", () => {
        const { container } = renderResizable();
        const handle = screen.getByRole("slider");

        fireEvent.keyDown(handle, { key: "ArrowRight" });
        fireEvent.doubleClick(handle);

        expect(paneOf(container).style.getPropertyValue("--pane-width")).toBe(
            `${defaultPaneWidth.small}px`,
        );
    });

    it("keeps the width it was left at between visits", () => {
        const { unmount } = renderResizable({ widthStorageKey: "test-pane" });
        const handle = screen.getByRole("slider");

        fireEvent.keyDown(handle, { key: "ArrowRight" });
        fireEvent.keyUp(handle, { key: "ArrowRight" });
        unmount();

        expect(localStorage.getItem("test-pane")).toBe(
            String(defaultPaneWidth.small + ARROW_KEY_STEP),
        );

        const { container } = renderResizable({ widthStorageKey: "test-pane" });
        expect(paneOf(container).style.getPropertyValue("--pane-width")).toBe(
            `${defaultPaneWidth.small + ARROW_KEY_STEP}px`,
        );
    });

    it("leaves storage alone where the caller keeps the width itself", () => {
        renderResizable({
            widthStorageKey: "test-pane",
            onResizeEnd: () => {},
            currentWidth: 300,
        });
        const handle = screen.getByRole("slider");

        fireEvent.keyDown(handle, { key: "ArrowRight" });
        fireEvent.keyUp(handle, { key: "ArrowRight" });

        expect(localStorage.getItem("test-pane")).toBeNull();
    });

    it("ignores a key that is not an arrow", () => {
        const onResizeEnd = jest.fn();
        renderResizable({ onResizeEnd, currentWidth: 300 });

        fireEvent.keyDown(screen.getByRole("slider"), { key: "Enter" });
        expect(onResizeEnd).not.toHaveBeenCalled();
    });

    it("finishes the drag even where the caller's own handler throws", () => {
        const onResizeEnd = jest.fn(() => {
            throw new Error("Nothing the pane can do about this");
        });

        renderResizable({ onResizeEnd, currentWidth: defaultPaneWidth.small });
        const handle = screen.getByRole("slider");

        fireEvent.keyDown(handle, { key: "ArrowRight" });

        expect(() => fireEvent.keyUp(handle, { key: "ArrowRight" })).not.toThrow();
        expect(onResizeEnd).toHaveBeenCalledWith(defaultPaneWidth.small + ARROW_KEY_STEP);
    });
});

describe("PageLayout.DragHandle", () => {
    it("says the width the way it was asked to", () => {
        render(
            <DragHandle
                handleRef={React.createRef<HTMLDivElement>()}
                onDragStart={() => {}}
                onDrag={() => {}}
                onDragEnd={() => {}}
                aria-valuenow={300}
                formatValueText={(value) => `${value} pixels across`}
            />,
        );

        expect(screen.getByRole("slider")).toHaveAttribute("aria-valuetext", "300 pixels across");
    });
});

describe("PageLayout.Sidebar", () => {
    const renderSidebar = (props: SidebarProps = {}) =>
        render(
            <PageLayout>
                <PageLayout.Sidebar {...(props as PageLayoutSidebarProps)}>
                    Sidebar
                </PageLayout.Sidebar>
                <PageLayout.Content>Content</PageLayout.Content>
            </PageLayout>,
        );

    it("stands before everything else by default", () => {
        const { container } = renderSidebar();
        const wrapper = part(container, "Sidebar").parentElement as HTMLElement;
        expect(wrapper).toHaveAttribute("data-position", "start");
    });

    it("stands after everything else where it is told to", () => {
        const { container } = renderSidebar({ position: "end" });
        const wrapper = part(container, "Sidebar").parentElement as HTMLElement;
        expect(wrapper).toHaveAttribute("data-position", "end");
    });

    it("puts the line between itself and the rest of the page", () => {
        const { container } = renderSidebar({ divider: "line" });
        const wrapper = part(container, "Sidebar").parentElement as HTMLElement;

        // A sidebar at the start is divided on its trailing edge
        expect(wrapper.lastElementChild).toHaveAttribute(
            "data-component",
            "PageLayout.VerticalDivider",
        );
    });

    it("puts the line on the other side where it stands at the end", () => {
        const { container } = renderSidebar({ position: "end", divider: "line" });
        const wrapper = part(container, "Sidebar").parentElement as HTMLElement;

        expect(wrapper.firstElementChild).toHaveAttribute(
            "data-component",
            "PageLayout.VerticalDivider",
        );
    });

    it("shows a handle once it can be resized", () => {
        const { container } = renderSidebar({ resizable: true });

        expect(part(container, "Sidebar")).toHaveAttribute("data-resizable", "true");
        expect(screen.getByRole("slider")).toBeInTheDocument();
    });

    it("covers the viewport on a narrow screen where it is asked to", () => {
        const { container } = renderSidebar({ responsiveVariant: "fullscreen" });
        const wrapper = part(container, "Sidebar").parentElement as HTMLElement;
        expect(wrapper).toHaveAttribute("data-responsive-variant", "fullscreen");
    });

    it("says nothing about the variant where it keeps its place", () => {
        const { container } = renderSidebar();
        const wrapper = part(container, "Sidebar").parentElement as HTMLElement;
        expect(wrapper).not.toHaveAttribute("data-responsive-variant");
    });

    it("keeps no width between visits unless it is given somewhere to keep it", () => {
        renderSidebar({ resizable: true });
        const handle = screen.getByRole("slider");

        fireEvent.keyDown(handle, { key: "ArrowRight" });
        fireEvent.keyUp(handle, { key: "ArrowRight" });

        expect(localStorage.length).toBe(0);
    });
});

describe("pane width helpers", () => {
    it("tells a step of the scale from bounds of the caller's own", () => {
        expect(isPaneWidth("small")).toBe(true);
        expect(isPaneWidth({ min: "1px", default: "2px", max: "3px" })).toBe(false);
        expect(isCustomWidthOptions({ min: "1px", default: "2px", max: "3px" })).toBe(true);
        expect(isCustomWidthOptions("large")).toBe(false);
    });

    it("reads the width a size asks for", () => {
        expect(getDefaultPaneWidth("medium")).toBe(defaultPaneWidth.medium);
        expect(getDefaultPaneWidth({ min: "100px", default: "240px", max: "400px" })).toBe(240);
    });

    it("reserves more of a wide viewport for everything beside the pane", () => {
        const { innerWidth } = window;

        window.innerWidth = 1024;
        expect(getMaxWidthDiffFromViewport()).toBe(PANE_MAX_WIDTH_DIFF);

        window.innerWidth = 1440;
        expect(getMaxWidthDiffFromViewport()).toBe(PANE_MAX_WIDTH_DIFF_WIDE);

        window.innerWidth = innerWidth;
    });

    it("writes the slider values straight onto the handle", () => {
        const handle = document.createElement("div");

        updateAriaValues(handle, { min: 100, max: 500, current: 300 });

        expect(handle).toHaveAttribute("aria-valuemin", "100");
        expect(handle).toHaveAttribute("aria-valuemax", "500");
        expect(handle).toHaveAttribute("aria-valuenow", "300");
        expect(handle).toHaveAttribute("aria-valuetext", "Pane width 300 pixels");
    });

    it("says the width the way it was asked to", () => {
        const handle = document.createElement("div");

        updateAriaValues(handle, { current: 300 }, (value) => `${value} pixels across`);

        expect(handle).toHaveAttribute("aria-valuetext", "300 pixels across");
    });

    it("does nothing without a handle to write to", () => {
        expect(() => updateAriaValues(null, { current: 300 })).not.toThrow();
    });
});
