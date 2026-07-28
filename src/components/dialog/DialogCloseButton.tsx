import * as React from "react";
import { DismissRegular } from "@gamecrafters/base-ui-icons";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { IconButton } from "../icon-button";
import type { DialogCloseButtonProps } from "./Dialog.types";

function DialogCloseButton(
    props: DialogCloseButtonProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { onClose, ...rest } = props;

    return (
        <IconButton
            ref={ref}
            icon={DismissRegular}
            aria-label="Close"
            variant="invisible"
            onClick={onClose}
            data-component="Dialog.CloseButton"
            {...rest}
        />
    );
}

DialogCloseButton.displayName = "Dialog.CloseButton";

export default fixedForwardRef(DialogCloseButton);
