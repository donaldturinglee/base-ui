import type * as React from "react";
import type { ResponsiveValue } from "../../hooks/useResponsive";

// How much room is left around and between the regions of the page
export type PageLayoutSpacing = "none" | "condensed" | "normal";

export type PageLayoutWidth = "full" | "medium" | "large" | "xlarge";

export type PageLayoutPosition = "start" | "end";

// A line is a hairline rule; a filled divider is a band of inset colour, which only reads
// well across the page rather than down it
export type PageLayoutDividerVariant = "none" | "line" | "filled";

// A divider given to a region may be a plain value, or one per viewport range where a
// narrow screen can take the filled treatment
export type PageLayoutDivider =
    "none" | "line" | ResponsiveValue<"none" | "line", PageLayoutDividerVariant>;

export type PaneWidth = "small" | "medium" | "large";

type Measurement = `${number}px`;

// Constraints of the caller's own, in place of a step of the width scale
export type CustomWidthOptions = {
    min: Measurement;
    default: Measurement;
    max: Measurement;
};

export type PaneWidthValue = PaneWidth | CustomWidthOptions;

export type PageLayoutProps = React.ComponentPropsWithoutRef<"div"> & {
    // The widest the page container is allowed to be
    containerWidth?: PageLayoutWidth;
    // The room between the outer edges of the page and the viewport
    padding?: PageLayoutSpacing;
    rowGap?: PageLayoutSpacing;
    columnGap?: PageLayoutSpacing;
    className?: string;
};

// The native `hidden` attribute is dropped throughout, so a region can be taken away one
// viewport range at a time rather than only outright
export type PageLayoutHeaderProps = Omit<React.ComponentPropsWithoutRef<"header">, "hidden"> & {
    padding?: PageLayoutSpacing;
    divider?: PageLayoutDivider;
    hidden?: boolean | ResponsiveValue<boolean>;
    className?: string;
};

export type PageLayoutContentProps = Omit<React.ComponentPropsWithoutRef<"main">, "hidden"> & {
    // The element the region is rendered as, where `main` is not the right one
    as?: React.ElementType;
    width?: PageLayoutWidth;
    padding?: PageLayoutSpacing;
    hidden?: boolean | ResponsiveValue<boolean>;
    className?: string;
};

type ResizableProps =
    | {
          // Called once a resize finishes, in place of the pane keeping the width itself
          onResizeEnd: (width: number) => void;
          // The width the pane is held at. Leave it undefined until a stored width has
          // been read
          currentWidth: number | undefined;
      }
    | {
          onResizeEnd?: never;
          currentWidth?: never;
      };

export type PageLayoutPaneBaseProps = Omit<React.ComponentPropsWithoutRef<"div">, "hidden"> & {
    position?: PageLayoutPosition | ResponsiveValue<PageLayoutPosition>;
    // A step of the width scale, or constraints of the caller's own. Where the pane can be
    // resized this is the width it starts at and the bounds it moves between
    width?: PaneWidthValue;
    // The narrowest the pane may be, in pixels. Only read for a named width
    minWidth?: number;
    // Where a resizable pane keeps its width between visits. Only read where no
    // `onResizeEnd` is given
    widthStorageKey?: string;
    padding?: PageLayoutSpacing;
    divider?: PageLayoutDivider;
    // Lets the reader drag or key the pane wider and narrower
    resizable?: boolean;
    sticky?: boolean;
    // How far down the page a sticky pane comes to rest, below whatever heads it
    offsetHeader?: string | number;
    hidden?: boolean | ResponsiveValue<boolean>;
    className?: string;
};

export type PageLayoutPaneProps = PageLayoutPaneBaseProps & ResizableProps;

export type PageLayoutSidebarBaseProps = Omit<React.ComponentPropsWithoutRef<"div">, "hidden"> & {
    position?: PageLayoutPosition;
    width?: PaneWidthValue;
    minWidth?: number;
    widthStorageKey?: string;
    padding?: PageLayoutSpacing;
    divider?: "none" | "line";
    resizable?: boolean;
    sticky?: boolean;
    // On a narrow screen the sidebar either keeps its place in the row, or covers the
    // viewport the way a dialog does
    responsiveVariant?: "default" | "fullscreen";
    hidden?: boolean | ResponsiveValue<boolean>;
    className?: string;
};

export type PageLayoutSidebarProps = PageLayoutSidebarBaseProps & ResizableProps;

export type PageLayoutFooterProps = Omit<React.ComponentPropsWithoutRef<"footer">, "hidden"> & {
    padding?: PageLayoutSpacing;
    divider?: PageLayoutDivider;
    hidden?: boolean | ResponsiveValue<boolean>;
    className?: string;
};

export type PageLayoutDividerProps = React.ComponentPropsWithoutRef<"div"> & {
    variant?: PageLayoutDividerVariant | ResponsiveValue<PageLayoutDividerVariant>;
    position?: PageLayoutPosition | ResponsiveValue<PageLayoutPosition>;
    className?: string;
};

export type PageLayoutContextValue = {
    padding: PageLayoutSpacing;
    rowGap: PageLayoutSpacing;
    columnGap: PageLayoutSpacing;
    paneRef: React.RefObject<HTMLDivElement | null>;
    contentWrapperRef: React.RefObject<HTMLDivElement | null>;
    sidebarRef: React.RefObject<HTMLDivElement | null>;
    sidebarContentWrapperRef: React.RefObject<HTMLDivElement | null>;
};

export type UsePaneWidthOptions = {
    width: PaneWidthValue;
    minWidth: number;
    resizable: boolean;
    widthStorageKey?: string;
    paneRef: React.RefObject<HTMLDivElement | null>;
    handleRef: React.RefObject<HTMLDivElement | null>;
    contentWrapperRef?: React.RefObject<HTMLDivElement | null>;
    // Caps a width of the caller's own to what the viewport leaves, so a pane in a row that
    // does not wrap cannot push past the edge
    constrainToViewport?: boolean;
    onResizeEnd?: (width: number) => void;
    currentWidth?: number;
    // What the handle announces as it arrives and as the viewport moves. Give the handle the
    // same one, so a reader hears the width put the same way throughout
    formatValueText?: (valueNow: number) => string;
};

export type UsePaneWidthResult = {
    currentWidth: number;
    // Follows the width through a drag without asking React to render every pixel
    currentWidthRef: React.RefObject<number>;
    minPaneWidth: number;
    maxPaneWidth: number;
    getMaxPaneWidth: () => number;
    getDefaultWidth: () => number;
    saveWidth: (value: number) => void;
};

export type DragHandleProps = {
    handleRef: React.RefObject<HTMLDivElement | null>;
    // Called once as a drag begins, with where the pointer started
    onDragStart: (clientX: number) => void;
    // Called as the drag runs, with the pointer position or, from the keyboard, a step
    onDrag: (value: number, isKeyboard: boolean) => void;
    onDragEnd: () => void;
    onDoubleClick?: React.MouseEventHandler<HTMLDivElement>;
    "aria-label"?: string;
    "aria-labelledby"?: string;
    "aria-valuemin"?: number;
    "aria-valuemax"?: number;
    "aria-valuenow"?: number;
    // What the drag holds still and contains while it runs
    dragTargetRef?: React.RefObject<HTMLElement | null>;
    contentWrapperRef?: React.RefObject<HTMLElement | null>;
    // How the width is put to a reader, in place of "Pane width 296 pixels"
    formatValueText?: (valueNow: number) => string;
    className?: string;
};
