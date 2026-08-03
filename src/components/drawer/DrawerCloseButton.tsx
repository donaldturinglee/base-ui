import * as React from "react";
import { DismissRegular } from "@gamecrafters/base-ui-icons";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { IconButton } from "../icon-button";
import { DrawerContext } from "./DrawerContext";
import type { DrawerCloseButtonProps } from "./Drawer.types";

const classes = {
    root: "drawer-close-button",
};

function DrawerCloseButton(
    props: DrawerCloseButtonProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, onClose, ...rest } = props;
    const { onClose: closeDrawer } = React.useContext(DrawerContext);

    return (
        <IconButton
            ref={ref}
            icon={DismissRegular}
            aria-label="Close"
            variant="invisible"
            className={classNames(classes.root, className)}
            // The drawer around the button already knows how to close itself, so a header of
            // the caller's own does not have to be told how
            onClick={onClose ?? closeDrawer}
            data-component="Drawer.CloseButton"
            {...rest}
        />
    );
}

DrawerCloseButton.displayName = "Drawer.CloseButton";

export default fixedForwardRef(DrawerCloseButton);
