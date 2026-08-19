import type * as React from "react";
import type { ButtonVariant, ButtonVisual } from "../button";
import type { CaretProps } from "../caret";
import type { AnchorAlignment, AnchorSide } from "../tooltip/anchoredPosition";

// How a step is placed. A tooltip stands against something on the page and points at it, a
// dialog stands in the middle of the screen with nothing to point at, and a floating step keeps
// to a corner of the screen wherever the reader has scrolled to
export type TourStepType = "dialog" | "tooltip" | "floating";

// Which corner of the screen a floating step keeps to
export type TourFloatingPlacement = "top-start" | "top-end" | "bottom-start" | "bottom-end";

// The ways through a tour an action can reach for
export type TourActionKind = "next" | "prev" | "dismiss";

// A button written under a step. Pressing it takes one of the ways through the tour, or does
// something of the caller's own, which is handed the tour so it can take it wherever it likes
export type TourAction = {
    label: string;
    action: TourActionKind | ((tour: TourApi) => void);
};

// What a step's effect is allowed to change about the step it belongs to, for one that only
// knows what it has to say once something has come back
export type TourStepUpdate = {
    title?: React.ReactNode;
    description?: React.ReactNode;
    actions?: TourAction[];
};

// What a step's effect is handed. The ways through the tour do not change as the tour moves, so
// an effect is run once when its step is reached rather than again each time anything about the
// tour changes underneath it
export type TourStepEffectArgs = {
    next: () => void;
    prev: () => void;
    goto: (stepId: string) => void;
    dismiss: () => void;
    // Draws the step. A step carrying an effect stays back until this is called, which is what
    // lets one wait for something to happen on the page before it speaks
    show: () => void;
    update: (details: TourStepUpdate) => void;
    // What the step points at, asked again each time rather than held, since an element that
    // was not on the page when the effect started may be there by the time it is wanted
    target: () => HTMLElement | null;
};

// What an effect leaves behind to be undone once its step has been left, being whatever it put
// up to wait on the page
export type TourStepEffectCleanup = (() => void) | void;

export type TourStep = {
    // What the step is known as, which is what the tour is moved about by
    id: string;
    // Left out, a step that points at something is a tooltip and one that points at nothing is
    // a dialog
    type?: TourStepType;
    title?: React.ReactNode;
    description?: React.ReactNode;
    // What the step points at. It is asked for rather than held, since the element it names may
    // not be on the page until the step is reached
    target?: () => HTMLElement | null;
    // Which edge of that element the step stands off, and where along that edge it lines up
    side?: AnchorSide;
    align?: AnchorAlignment;
    // Which corner a floating step keeps to
    placement?: TourFloatingPlacement;
    actions?: TourAction[];
    // Whether the page behind is dimmed while the step is being read. Left out, every step
    // dims it, since a tour is read one step at a time
    backdrop?: boolean;
    // Whether the surface is drawn with a caret pointing at what the step points at. Left out,
    // a step standing against something points at it and one standing on its own does not
    arrow?: boolean;
    effect?: (args: TourStepEffectArgs) => TourStepEffectCleanup;
};

// Where a tour stands as a whole. It is started when it is opened, and ends either by being
// read to the end or by being closed part way through
export type TourStatus = "started" | "completed" | "dismissed";

export type TourStatusChangeDetails = {
    status: TourStatus;
};

export type TourStepChangeDetails = {
    // Which step is being read, or nothing where the tour has been closed
    stepId: string | null;
    // Where that step stands among the rest, counted from nought. Minus one where there is no
    // step being read
    stepIndex: number;
    count: number;
};

// What the step points at, as it stood when it was last measured. The coordinates are relative
// to the viewport, which is what everything drawn over the page is laid out against
export type TourRect = {
    top: number;
    left: number;
    width: number;
    height: number;
};

// Everything that can be done to a tour from outside the step it is showing. A caller reaches
// it through `useTour`, and a step's own action is handed it when it is pressed
export type TourApi = {
    open: boolean;
    // The step being read, as it stands after anything its effect has changed
    step: TourStep | null;
    // Where that step stands among the rest, counted from nought
    stepIndex: number;
    steps: TourStep[];
    // Opens the tour, at the step named or else at the first of them
    start: (stepId?: string) => void;
    next: () => void;
    prev: () => void;
    goto: (stepId: string) => void;
    dismiss: () => void;
    // How far along the tour has come, as it is written under a step
    progressText: string;
    // The same, from nought to a hundred, for a caller drawing a bar of their own
    progressPercent: number;
    hasNext: boolean;
    hasPrev: boolean;
};

export type TourContextValue = TourApi & {
    // The ids the parts point at one another by, so that two tours on the one page do not both
    // lay claim to the same element
    titleId: string;
    descriptionId: string;
    // Which of the three the step being read is, worked out once here rather than by each part
    // that has to place itself
    stepType: TourStepType;
    // Whether the step being read is ready to be drawn. A step carrying an effect stays back
    // until the effect says so
    ready: boolean;
    // What the step points at, and the element itself for the parts that have to measure it
    targetRect: TourRect | null;
    getTarget: () => HTMLElement | null;
    // How far the spotlight stands clear of what it picks out, and how far its corners are
    // rounded
    spotlightOffset: number;
    spotlightRadius: number;
    // The surface, which a press has to land outside of to close the tour
    contentRef: React.RefObject<HTMLDivElement | null>;
};

// Where the surface ended up, which is not always where it was asked to go. The caret is drawn
// from this rather than from what the step asked for, so it points at the target wherever the
// viewport left room for the surface to stand
export type TourPositionerContextValue = {
    side: AnchorSide;
    align: AnchorAlignment;
};

export type TourProps = {
    // The steps in the order they are read
    steps: TourStep[];
    // Which step is being read, by id. Left out, the tour keeps its own
    step?: string | null;
    defaultStep?: string | null;
    onStepChange?: (details: TourStepChangeDetails) => void;
    // Whether the tour is open. Left out, the tour keeps its own
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    onStatusChange?: (details: TourStatusChangeDetails) => void;
    // Whether the arrow keys step through the tour
    keyboardNavigation?: boolean;
    // Whether Escape closes the tour
    closeOnEscape?: boolean;
    // Whether a press landing anywhere but the surface and what the step points at closes the
    // tour
    closeOnInteractOutside?: boolean;
    spotlightOffset?: number;
    spotlightRadius?: number;
    // The id the parts are named from. Left out, one is made
    id?: string;
    children?: React.ReactNode;
};

export type TourBackdropProps = React.ComponentPropsWithoutRef<"div"> & {
    // The portal it is drawn into, for a page that keeps more than one
    portalContainerName?: string;
    className?: string;
};

export type TourSpotlightProps = TourBackdropProps;

export type TourPositionerProps = React.ComponentPropsWithoutRef<"div"> & {
    // Which edge of the target the surface stands off, and where along that edge it lines up,
    // for the steps that do not say for themselves
    side?: AnchorSide;
    align?: AnchorAlignment;
    // Which corner a floating step keeps to, for the steps that do not say for themselves
    placement?: TourFloatingPlacement;
    portalContainerName?: string;
    className?: string;
};

export type TourContentProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};

// The caret works out which way it points from where the surface ended up, so the location is
// not the caller's to give
export type TourArrowProps = Omit<CaretProps, "location">;

// The button is only ever an icon, so it is named by a label of its own rather than by anything
// on the page
export type TourCloseTriggerProps = Omit<
    React.ComponentPropsWithoutRef<"button">,
    "aria-labelledby"
> & {
    icon?: NonNullable<ButtonVisual>;
    className?: string;
};

export type TourTitleProps = React.ComponentPropsWithoutRef<"h2"> & {
    className?: string;
};

export type TourDescriptionProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};

export type TourProgressTextProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};

export type TourControlProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};

export type TourActionsProps = {
    children: (actions: TourAction[]) => React.ReactNode;
};

export type TourActionTriggerProps = Omit<
    React.ComponentPropsWithoutRef<"button">,
    "action" | "children"
> & {
    action: TourAction;
    variant?: ButtonVariant;
    // What the button reads as, in place of the label the action carries
    children?: React.ReactNode;
    className?: string;
};
