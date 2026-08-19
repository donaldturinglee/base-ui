import * as React from "react";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { Button } from "../button";
import { DialogContext } from "./DialogContext";
import type { DialogButtonsProps } from "./Dialog.types";

function DialogButtons({ buttons }: DialogButtonsProps) {
    const context = React.useContext(DialogContext);
    // Only the first button asking for focus is given it, so two of them cannot pull it
    // between themselves
    const autoFocusIndex = buttons.findIndex((button) => button.autoFocus);
    // The dialog holds a ref of its own to focus the button with, which is handed to the
    // button alongside whatever ref the caller asked for
    const autoFocusRef = useMergedRefs(context?.autoFocusRef, buttons[autoFocusIndex]?.ref);

    return (
        <>
            {buttons.map((button, index) => {
                const { content, buttonType = "default", autoFocus, ref, ...rest } = button;

                return (
                    <Button
                        key={index}
                        ref={autoFocus && index === autoFocusIndex ? autoFocusRef : ref}
                        // "normal" is the older name for the default variant
                        variant={buttonType === "normal" ? "default" : buttonType}
                        data-component="Dialog.FooterButton"
                        {...rest}
                    >
                        {content}
                    </Button>
                );
            })}
        </>
    );
}

DialogButtons.displayName = "Dialog.Buttons";

export default DialogButtons;
