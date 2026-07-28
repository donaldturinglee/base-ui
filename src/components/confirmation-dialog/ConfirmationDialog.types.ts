import type * as React from "react";
import type { DialogCloseGesture, DialogHeight, DialogWidth } from "../dialog/Dialog.types";

// A confirmation is closed either by deciding on it or by dismissing it, and the caller is
// told which of the two happened
export type ConfirmationDialogCloseGesture = DialogCloseGesture | "confirm" | "cancel";

// The confirm button carries the action, so it is styled by how grave that action is.
// "normal" is the older name for the default variant
export type ConfirmationButtonType = "normal" | "primary" | "danger";

// Which of the two buttons opens with focus
export type ConfirmationButtonFocus = "cancel" | "confirm";

export type ConfirmationDialogProps = React.PropsWithChildren<{
    // Called when the dialog is dismissed, with the gesture that dismissed it
    onClose: (gesture: ConfirmationDialogCloseGesture) => void;
    // The question being asked, which names the dialog to a screen reader as well as
    // titling it
    title: React.ReactNode;
    cancelButtonContent?: React.ReactNode;
    confirmButtonContent?: React.ReactNode;
    confirmButtonType?: ConfirmationButtonType;
    cancelButtonLoading?: boolean;
    confirmButtonLoading?: boolean;
    // Opens with this button focused, in place of the one the confirm button's type calls
    // for. Worth overriding only rarely, since the default keeps a dangerous action from
    // being confirmed by a keypress that was already on its way
    overrideButtonFocus?: ConfirmationButtonFocus;
    width?: DialogWidth;
    height?: DialogHeight;
    className?: string;
}>;

// What the shorthand is asked with. It has no children to take the body from, so the body
// is given as an option of its own
export type ConfirmOptions = Omit<ConfirmationDialogProps, "onClose" | "children"> & {
    content: React.ReactNode;
};
