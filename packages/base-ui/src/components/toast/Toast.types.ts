import type * as React from "react";

// What the toast is saying, which settles the icon it carries and, where rich colours are
// turned on, the colours it takes
export type ToastVariant = "default" | "success" | "error" | "warning" | "info" | "loading";

// The corner or the edge of the viewport the toasts gather at
export type ToastPosition =
    "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";

// The way a toast can be swiped to see it off
export type ToastSwipeDirection = "top" | "right" | "bottom" | "left";

// What saw the toast off, so a caller can tell one way of dismissing it from another
export type ToastCloseReason =
    "timeout" | "close-button" | "action" | "cancel" | "swipe" | "dismiss";

// A button the toast lays out beside its text. The toast closes once the button has been
// pressed, unless the handler asks for it to stay by taking the event
export type ToastActionDescriptor = {
    label: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

// A button is given either as a label and what to do when it is pressed, or as an element the
// caller has built themselves
export type ToastAction = ToastActionDescriptor | React.ReactNode;

export type ToastOptions = {
    // Names the toast, so that showing it again under the same id changes the one already
    // standing rather than putting up another beside it
    id?: string;
    description?: React.ReactNode;
    // How long the toast stands before it goes away by itself. `Infinity` leaves it standing
    // until something dismisses it
    duration?: number;
    // Stands in place of the icon the variant carries. `null` leaves the toast without one
    icon?: React.ReactNode;
    action?: ToastAction;
    cancel?: ToastAction;
    closeButton?: boolean;
    // A toast that cannot be dismissed by hand ignores a swipe and keeps its close button
    // out of the way
    dismissible?: boolean;
    // Colours the whole toast after what it is saying, rather than only its icon
    richColors?: boolean;
    // Read out at once, rather than when the reader next comes to a pause
    important?: boolean;
    // Called when the toast is seen off by hand: a close button, a swipe, one of its own
    // buttons, or `toast.dismiss`
    onDismiss?: (toast: ToastItem) => void;
    // Called when the toast went away by itself, its time having run out
    onAutoClose?: (toast: ToastItem) => void;
    className?: string;
};

// A toast as it is held while it stands
export type ToastItem = ToastOptions & {
    id: string;
    variant: ToastVariant;
    title?: React.ReactNode;
    // A toast the caller lays out themselves, in place of everything the toast would lay out
    // of its own
    render?: (toast: ToastItem) => React.ReactNode;
    // Set as the toast starts to go away, so that it is animated out before it is taken off
    // the list
    dismissed?: boolean;
    // Counts the times the toast has been changed where it stands, so that a change gives it
    // its time over again
    revision: number;
};

// What a promise has to say for itself once it settles. A message worked out from what it
// settled with is given as a function
export type ToastPromiseMessage<T> = React.ReactNode | ((value: T) => React.ReactNode);

export type ToastPromiseMessages<T> = {
    loading: React.ReactNode;
    success: ToastPromiseMessage<T>;
    error: ToastPromiseMessage<unknown>;
};

// Icons standing in for the ones the variants carry of their own
export type ToastIcons = Partial<Record<ToastVariant, React.ReactNode>>;

export type ToasterProps = React.ComponentPropsWithoutRef<"ol"> & {
    position?: ToastPosition;
    // Lays the stack out in full, rather than gathering it into a pile that only opens as the
    // reader comes to it
    expand?: boolean;
    // How many toasts stand at once. The rest wait behind them
    visibleToasts?: number;
    // What every toast takes unless it says otherwise
    toastOptions?: ToastOptions;
    duration?: number;
    closeButton?: boolean;
    richColors?: boolean;
    // The room between one toast and the next, in pixels
    gap?: number;
    // How far the stack stands from the edges of the viewport
    offset?: number | string;
    // The same, on a narrow viewport
    mobileOffset?: number | string;
    width?: number | string;
    // The keys that put focus on the stack, each given either as a property of the keyboard
    // event, such as `altKey`, or as the code of a key, such as `KeyT`
    hotkey?: string[];
    // Which ways a toast can be swiped away. Taken from the position where it is left out
    swipeDirections?: ToastSwipeDirection[];
    icons?: ToastIcons;
    // Names the region the toasts stand in
    containerAriaLabel?: string;
    className?: string;
};

// Where a toast stands in the stack, which the Toaster works out for it
export type ToastPlace = {
    index: number;
    // How far along the stack the toast sits once the stack is laid out in full, in pixels
    offset: number;
};

// What a toast falls back on for everything it has not been told itself
export type ToastDefaults = Required<
    Pick<ToastOptions, "duration" | "closeButton" | "richColors" | "dismissible">
> &
    Pick<ToastOptions, "important" | "className">;

// Everything a toast is told about where it stands and how it is to look, all of it settled
// by the Toaster around it
export type ToastProps = {
    toast: ToastItem;
    place: ToastPlace;
    position: ToastPosition;
    // Its own height as it was last measured, and the height of the toast at the front of the
    // stack, which a gathered toast is held to
    height: number;
    frontHeight: number;
    // How many toasts are standing, which settles how far forward this one is laid
    stackSize: number;
    expanded: boolean;
    visible: boolean;
    paused: boolean;
    swipeDirections: ToastSwipeDirection[];
    icons?: ToastIcons;
    defaults: ToastDefaults;
    onHeight: (id: string, height: number) => void;
};
