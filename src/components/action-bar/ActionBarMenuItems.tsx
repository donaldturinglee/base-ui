import * as React from "react";
import { ActionList } from "../action-list";
import { ActionMenu } from "../action-menu";
import type { ButtonVisual } from "../button";
import type { ActionBarMenuItem } from "./ActionBar.types";

const renderVisual = (visual: ButtonVisual | string) => {
    if (typeof visual === "string") {
        return <span>{visual}</span>;
    }

    if (React.isValidElement(visual)) {
        return visual;
    }

    const Visual = visual as React.ElementType;
    return <Visual />;
};

// The contents of a menu, drawn from plain objects rather than from elements so that the
// same items can be shown by the bar's own overflow menu without being written twice
export const ActionBarMenuItems = ({ items }: { items: ActionBarMenuItem[] }) => (
    <>
        {items.map((item, index) => {
            if (item.type === "divider") {
                return <ActionList.Divider key={index} />;
            }

            const { label, disabled, variant, leadingVisual, trailingVisual, onClick } = item;

            const contents = (
                <>
                    {leadingVisual ? (
                        <ActionList.LeadingVisual>
                            {renderVisual(leadingVisual)}
                        </ActionList.LeadingVisual>
                    ) : null}
                    {label}
                    {trailingVisual ? (
                        <ActionList.TrailingVisual>
                            {renderVisual(trailingVisual)}
                        </ActionList.TrailingVisual>
                    ) : null}
                </>
            );

            // An item that holds items of its own brings them out as a menu beside itself
            if (item.items && item.items.length > 0) {
                return (
                    <ActionMenu key={index}>
                        <ActionMenu.Anchor>
                            <ActionList.Item disabled={disabled} variant={variant}>
                                {contents}
                            </ActionList.Item>
                        </ActionMenu.Anchor>
                        <ActionMenu.Overlay>
                            <ActionList>
                                <ActionBarMenuItems items={item.items} />
                            </ActionList>
                        </ActionMenu.Overlay>
                    </ActionMenu>
                );
            }

            return (
                <ActionList.Item
                    key={index}
                    onSelect={onClick}
                    disabled={disabled}
                    variant={variant}
                >
                    {contents}
                </ActionList.Item>
            );
        })}
    </>
);
