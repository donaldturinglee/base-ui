import * as React from "react";
import { fixedForwardRef } from "../../utilities/polymorphic";
import Dialog from "../dialog/Dialog";
import type { DialogButtonProps } from "../dialog/Dialog.types";
import type { ConfirmationDialogProps } from "./ConfirmationDialog.types";

function ConfirmationDialog(
    props: ConfirmationDialogProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        onClose,
        title,
        cancelButtonContent = "Cancel",
        confirmButtonContent = "OK",
        confirmButtonType = "normal",
        cancelButtonLoading = false,
        confirmButtonLoading = false,
        overrideButtonFocus,
        width = "medium",
        height,
        className,
        children,
    } = props;

    // A dangerous action opens with the cancel button focused, so it cannot be confirmed by
    // a keypress that was already on its way
    const focusedButton =
        overrideButtonFocus ?? (confirmButtonType === "danger" ? "cancel" : "confirm");

    // The two buttons are all a confirmation ever has, so there is nothing for a caller to
    // render in their place
    const footerButtons: DialogButtonProps[] = [
        {
            content: cancelButtonContent,
            onClick: () => onClose("cancel"),
            autoFocus: focusedButton === "cancel",
            loading: cancelButtonLoading,
        },
        {
            content: confirmButtonContent,
            buttonType: confirmButtonType,
            onClick: () => onClose("confirm"),
            autoFocus: focusedButton === "confirm",
            loading: confirmButtonLoading,
        },
    ];

    return (
        <Dialog
            ref={ref}
            title={title}
            onClose={onClose}
            footerButtons={footerButtons}
            // A decision that has to be made before anything else can happen
            role="alertdialog"
            width={width}
            height={height}
            className={className}
            data-component="ConfirmationDialog"
        >
            {children}
        </Dialog>
    );
}

ConfirmationDialog.displayName = "ConfirmationDialog";

export default fixedForwardRef(ConfirmationDialog);
