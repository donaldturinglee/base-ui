import * as React from "react";
import { MoreHorizontalRegular } from "@gamecrafters/base-ui-icons";
import { ActionList } from "../action-list";
import { ActionMenu } from "../action-menu";
import { IconButton } from "../icon-button";
import type { BreadcrumbsOverflowMenuProps } from "./Breadcrumbs.types";

// The steps of the trail that no longer fit across the page, brought out from a button
// standing where they were
function BreadcrumbsOverflowMenu({ items }: BreadcrumbsOverflowMenuProps) {
    return (
        <ActionMenu>
            <ActionMenu.Anchor>
                <IconButton
                    icon={MoreHorizontalRegular}
                    aria-label={`${items.length} more breadcrumb items`}
                    variant="invisible"
                    size="small"
                    data-component="Breadcrumbs.OverflowMenu"
                />
            </ActionMenu.Anchor>
            <ActionMenu.Overlay>
                <ActionList>
                    {items.map((item, index) => {
                        const { children, selected, as, ...itemProps } = item.props;

                        return (
                            <ActionList.LinkItem
                                key={index}
                                as={as}
                                aria-current={selected ? "page" : undefined}
                                {...itemProps}
                            >
                                {children}
                            </ActionList.LinkItem>
                        );
                    })}
                </ActionList>
            </ActionMenu.Overlay>
        </ActionMenu>
    );
}

BreadcrumbsOverflowMenu.displayName = "Breadcrumbs.OverflowMenu";

export default BreadcrumbsOverflowMenu;
