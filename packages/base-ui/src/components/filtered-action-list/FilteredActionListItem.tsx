import type * as React from "react";
import { isValidElementType } from "react-is";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { ActionList } from "../action-list";
import type { ActionListSelectEvent } from "../action-list";
import type { FilteredActionListItemInput } from "./FilteredActionList.types";

// A trailing visual is given either as the component to draw, or as something already
// built: an element, or plain text such as a count or a shortcut
const renderTrailingVisual = (visual: FilteredActionListItemInput["trailingVisual"]) => {
    if (typeof visual === "string" || !isValidElementType(visual)) {
        return visual as React.ReactNode;
    }

    const Visual = visual;

    return <Visual />;
};

// Draws one item from what describes it. An item carrying a renderer of its own is left to
// it, which is the way out for anything the list has no way to describe
function FilteredActionListItem(
    props: FilteredActionListItemInput,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    if (typeof props.renderItem === "function") {
        return props.renderItem(props);
    }

    const {
        id,
        text,
        description,
        descriptionVariant,
        leadingVisual: LeadingVisual,
        trailingVisual,
        onAction,
        children,
        // Neither the group an item belongs to nor the renderer it was offered says
        // anything about the element it is drawn as, so both are kept off the DOM
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        groupId: _groupId,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        renderItem: _renderItem,
        ...rest
    } = props;

    return (
        <ActionList.Item
            ref={ref}
            role="option"
            onSelect={(event: ActionListSelectEvent) => onAction?.(props, event)}
            data-id={id}
            {...rest}
        >
            {LeadingVisual ? (
                <ActionList.LeadingVisual>
                    <LeadingVisual />
                </ActionList.LeadingVisual>
            ) : null}
            {children}
            {text}
            {description ? (
                <ActionList.Description variant={descriptionVariant}>
                    {description}
                </ActionList.Description>
            ) : null}
            {trailingVisual ? (
                <ActionList.TrailingVisual>
                    {renderTrailingVisual(trailingVisual)}
                </ActionList.TrailingVisual>
            ) : null}
        </ActionList.Item>
    );
}

FilteredActionListItem.displayName = "FilteredActionList.Item";

export default fixedForwardRef(FilteredActionListItem);
