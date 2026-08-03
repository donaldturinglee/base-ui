import * as React from "react";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { useOnEscapePress } from "../../hooks/useOnEscapePress";
import { useScrollLock } from "../../hooks/useScrollLock";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Portal } from "../portal";
import CommandPalette from "./CommandPalette";
import type { CommandPaletteDialogProps } from "./CommandPalette.types";

const classes = {
    // The palette sits high on the screen rather than in the middle of it, since it is reached
    // for and read from the top down
    backdrop:
        "fixed inset-0 flex justify-center overflow-y-auto bg-[var(--overlay-backdrop-background-color)] p-[var(--base-size-16)] pt-[10dvh] motion-safe:animate-in motion-safe:fade-in motion-safe:duration-short",
    // It arrives where it stands rather than travelling there, growing the last of the way in
    // from just under its own size, which reads as the page coming forward to meet the reader
    panel: "h-fit w-[var(--overlay-width-large)] max-w-full [box-shadow:var(--shadow-floating-medium)] motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-short",
};

// The palette brought out over the page, which is how it is usually reached. Everything about
// the palette itself is unchanged; this only stands it over what was being read
function CommandPaletteDialog(
    props: CommandPaletteDialogProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { open, onOpenChange, returnFocusRef, overlayClassName, className, children, ...rest } =
        props;

    const panelRef = React.useRef<HTMLDivElement>(null);

    // Focus is held to the palette, and the field inside it is the first thing that can take
    // it, so the reader can start typing the moment it opens
    useFocusTrap({ containerRef: panelRef, returnFocusRef, disabled: !open });

    useOnEscapePress((event) => {
        if (!open) {
            return;
        }

        // Taking the event keeps a layer the palette was opened from standing
        event.preventDefault();
        onOpenChange(false);
    });

    useScrollLock(!open);

    if (!open) {
        return null;
    }

    return (
        <Portal>
            <div
                className={classNames(classes.backdrop, overlayClassName)}
                onMouseDown={(event) => {
                    // A press that both starts and ends off the panel is what closes it, so a
                    // selection dragged out of the palette leaves it standing
                    if (event.target === event.currentTarget) {
                        onOpenChange(false);
                    }
                }}
                data-component="CommandPalette.Backdrop"
            >
                <div
                    ref={panelRef}
                    role="dialog"
                    aria-modal="true"
                    aria-label={rest.label ?? "Command palette"}
                    className={classes.panel}
                    data-component="CommandPalette.Dialog"
                >
                    <CommandPalette ref={ref} className={className} {...rest}>
                        {children}
                    </CommandPalette>
                </div>
            </div>
        </Portal>
    );
}

CommandPaletteDialog.displayName = "CommandPalette.Dialog";

export default fixedForwardRef(CommandPaletteDialog);
