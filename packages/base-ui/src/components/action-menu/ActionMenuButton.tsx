import * as React from "react";
import { ChevronDownRegular } from "@gamecrafters/base-ui-icons";
import { Button } from "../button";
import ActionMenuAnchor from "./ActionMenuAnchor";
import type { ActionMenuButtonProps } from "./ActionMenu.types";

// A button that opens the menu, which is the anchor most menus want. The chevron says that
// pressing it brings something else out
function ActionMenuButton<As extends React.ElementType = "button">(
    props: ActionMenuButtonProps<As>,
) {
    return (
        <ActionMenuAnchor>
            <Button
                type="button"
                trailingAction={ChevronDownRegular}
                data-component="ActionMenu.Button"
                {...(props as ActionMenuButtonProps)}
            />
        </ActionMenuAnchor>
    );
}

ActionMenuButton.displayName = "ActionMenu.Button";

export default ActionMenuButton;
