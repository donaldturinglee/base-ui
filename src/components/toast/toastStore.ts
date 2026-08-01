import type * as React from "react";
import type {
    ToastItem,
    ToastOptions,
    ToastPromiseMessage,
    ToastPromiseMessages,
    ToastVariant,
} from "./Toast.types";

// The toasts every Toaster on the page is showing. The list is held outside React so that a
// toast can be put up from anywhere at all, without a component having to hold on to anything

let toasts: ToastItem[] = [];
let count = 0;

const listeners = new Set<() => void>();

const emit = () => {
    for (const listener of listeners) {
        listener();
    }
};

export const subscribeToToasts = (onStoreChange: () => void) => {
    listeners.add(onStoreChange);

    return () => {
        listeners.delete(onStoreChange);
    };
};

export const getToasts = () => toasts;

// The same empty list every time, since a fresh one reads as a change and would leave React
// rendering without end
const noToasts: ToastItem[] = [];

export const getServerToasts = () => noToasts;

// Puts a toast up, or changes the one already standing under that id. A toast that is changed
// keeps the place it had in the stack and is given its time over again
const putToast = (toast: Omit<ToastItem, "revision">) => {
    const isStanding = toasts.some((item) => item.id === toast.id);

    if (isStanding) {
        toasts = toasts.map((item) => {
            if (item.id !== toast.id) {
                return item;
            }

            return { ...item, ...toast, dismissed: false, revision: item.revision + 1 };
        });
    } else {
        toasts = [{ ...toast, revision: 0 }, ...toasts];
    }

    emit();

    return toast.id;
};

// Marks a toast as being on its way out, so that it is animated away before it is taken off
// the list. Leaving the id out sees off everything standing
export const dismissToast = (id?: string) => {
    toasts = toasts.map((item) =>
        id === undefined || item.id === id ? { ...item, dismissed: true } : item,
    );

    emit();

    return id;
};

// Takes a toast off the list, once it has finished being animated away
export const removeToast = (id: string) => {
    toasts = toasts.filter((item) => item.id !== id);
    emit();
};

// Empties the list outright, with nothing animated away. For tearing down between tests
export const clearToasts = () => {
    toasts = [];
    count = 0;
    emit();
};

const nextId = () => `toast-${++count}`;

const create = (variant: ToastVariant, title: React.ReactNode, options: ToastOptions = {}) =>
    putToast({ ...options, id: options.id ?? nextId(), title, variant });

// A message is either given outright or worked out from what the promise settled with
const resolveMessage = <T>(message: ToastPromiseMessage<T>, value: T) =>
    typeof message === "function"
        ? (message as (value: T) => React.ReactNode)(value)
        : (message as React.ReactNode);

// A toast that stands for a promise: it waits while the promise runs, and says how it went
// once it settles. The rejection is answered here rather than passed on, since what the
// caller asked for is the toast rather than the promise
const promise = <T>(
    input: Promise<T> | (() => Promise<T>),
    messages: ToastPromiseMessages<T>,
    options: ToastOptions = {},
) => {
    const id = options.id ?? nextId();

    create("loading", messages.loading, { ...options, id, duration: Infinity });

    // The time is handed back to whatever the Toaster gives every other toast, unless the
    // caller asked for one of their own
    const settle = (variant: ToastVariant, message: React.ReactNode) => {
        if (message === undefined || message === null) {
            dismissToast(id);
            return;
        }

        create(variant, message, { ...options, id, duration: options.duration });
    };

    void (typeof input === "function" ? input() : input).then(
        (value) => settle("success", resolveMessage(messages.success, value)),
        (error) => settle("error", resolveMessage(messages.error, error)),
    );

    return id;
};

const message = (title: React.ReactNode, options?: ToastOptions) =>
    create("default", title, options);

// Puts a toast up and hands back its id, which is what changes or dismisses it afterwards
export const toast = Object.assign(message, {
    message,
    success: (title: React.ReactNode, options?: ToastOptions) => create("success", title, options),
    error: (title: React.ReactNode, options?: ToastOptions) => create("error", title, options),
    warning: (title: React.ReactNode, options?: ToastOptions) => create("warning", title, options),
    info: (title: React.ReactNode, options?: ToastOptions) => create("info", title, options),
    // A toast that waits on something stands until it is told how it went
    loading: (title: React.ReactNode, options?: ToastOptions) =>
        create("loading", title, { duration: Infinity, ...options }),
    // A toast the caller lays out themselves. It is handed the toast it stands for, so that
    // it can dismiss itself
    custom: (render: (toast: ToastItem) => React.ReactNode, options: ToastOptions = {}) =>
        putToast({ ...options, id: options.id ?? nextId(), variant: "default", render }),
    promise,
    dismiss: dismissToast,
    getToasts,
});
