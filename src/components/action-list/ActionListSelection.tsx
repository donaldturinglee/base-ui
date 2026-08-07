import * as React from "react";
import { CheckmarkRegular } from "@gamecrafters/base-ui-icons";
import { classNames } from "../../lib/classnames";
import { ActionListContext } from "./ActionListContext";
import { ActionListGroupContext } from "./ActionListGroupContext";
import { ActionListVisualContainer } from "./ActionListVisual";

const classes = {
    // The mark keeps its place whether or not the item is picked, so the labels down the
    // list stay lined up with one another
    unselected: "invisible",
    checkmark: "action-list-selection-checkmark",
    checkbox: "action-list-selection-checkbox",
    checkboxSelected: "action-list-selection-checkbox-selected",
};

type ActionListSelectionProps = {
    selected?: boolean;
    className?: string;
};

// The mark saying whether an item is picked. Which mark is drawn is the list's to decide,
// so an item on its own has none
export const ActionListSelection = ({ selected, className }: ActionListSelectionProps) => {
    const { selectionVariant: listSelectionVariant } = React.useContext(ActionListContext);
    const { selectionVariant: groupSelectionVariant } = React.useContext(ActionListGroupContext);

    // A group says how its own items are picked, in place of what the list says
    const selectionVariant =
        groupSelectionVariant === undefined ? listSelectionVariant : groupSelectionVariant;

    if (!selectionVariant) {
        return null;
    }

    if (selectionVariant === "multiple") {
        return (
            <ActionListVisualContainer className={className} data-component="ActionList.Selection">
                <span
                    className={classNames(classes.checkbox, selected && classes.checkboxSelected)}
                >
                    <CheckmarkRegular className={selected ? undefined : classes.unselected} />
                </span>
            </ActionListVisualContainer>
        );
    }

    return (
        <ActionListVisualContainer className={className} data-component="ActionList.Selection">
            <CheckmarkRegular
                className={classNames(classes.checkmark, !selected && classes.unselected)}
            />
        </ActionListVisualContainer>
    );
};
