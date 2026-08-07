import * as React from "react";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { NavigationMenuContext, NavigationMenuItemContext } from "./NavigationMenuContext";
import type {
    NavigationMenuContentAlign,
    NavigationMenuContentProps,
} from "./NavigationMenu.types";

const navigationMenuContentVariants = cva("navigation-menu-content", {
    variants: {
        open: {
            // A panel standing over the page arrives from the edge of the item it was opened
            // from, which says where it came from. One standing in the flow of a column is
            // already part of the list it opened in, and is simply there, the way a navigation
            // list shows its sub-lists. The classes are only carried while it is open, so the
            // panel plays this each time it is shown rather than once when the menu was drawn
            true: "motion-safe:data-[orientation=horizontal]:animate-in motion-safe:data-[orientation=horizontal]:fade-in motion-safe:data-[orientation=horizontal]:duration-short motion-safe:data-[orientation=horizontal]:slide-in-from-top-1",
            false: "",
        },
        align: {
            start: "navigation-menu-content-align-start",
            center: "navigation-menu-content-align-center",
            end: "navigation-menu-content-align-end",
        } satisfies Record<NavigationMenuContentAlign, string>,
    },
});

// The panel an item opens, standing against the item rather than being measured against the
// page: an item already knows where it is, so there is nothing here to work out. It is drawn
// whether or not it is open, so that the trigger has something to point at either way, and
// while it is shut it is taken out of the page altogether rather than only hidden, so nothing
// inside it can still be tabbed to or read out.
//
// Where it stands follows the menu. In a row it is a surface over the page, since a row has no
// room under it to give. In a column it is drawn in the flow, stepped in from the item that
// opened it, which is how a navigation list shows the list standing under one of its items —
// a column already runs the way a panel would grow, so there is nothing to be gained by
// lifting it off the page
function NavigationMenuContent<As extends React.ElementType = "div">(
    props: NavigationMenuContentProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        align = "start",
        ...rest
    } = props as NavigationMenuContentProps<"div">;

    const { orientation } = React.useContext(NavigationMenuContext);
    const { triggerId, contentId, isOpen } = React.useContext(NavigationMenuItemContext);

    // A panel with nothing to open it has nothing to name it either, so there is nothing
    // worth drawing
    if (!contentId) {
        return null;
    }

    // A panel drawn in the flow is under the item it belongs to and nowhere else, so there is
    // no edge left for it to line up against
    const alignment = orientation === "vertical" ? undefined : align;

    return (
        <Component
            ref={ref}
            id={contentId}
            hidden={!isOpen}
            aria-labelledby={triggerId}
            className={classNames(
                navigationMenuContentVariants({ open: isOpen, align: alignment }),
                className,
            )}
            data-component="NavigationMenu.Content"
            data-orientation={orientation}
            data-align={alignment}
            data-open={isOpen ? "" : undefined}
            {...rest}
        />
    );
}

NavigationMenuContent.displayName = "NavigationMenu.Content";

export default fixedForwardRef(NavigationMenuContent);
