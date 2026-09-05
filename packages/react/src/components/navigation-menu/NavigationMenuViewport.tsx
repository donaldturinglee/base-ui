import * as React from "react";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames, cva } from "../../lib/classnames";
import { NavigationMenuContext, NavigationMenuPositionerContext } from "./NavigationMenuContext";
import type { NavigationMenuViewportProps } from "./NavigationMenu.types";

const navigationMenuViewportVariants = cva("navigation-menu-viewport", {
    variants: {
        // It arrives once, as the menu opens. Moving between items after that slides and grows
        // it rather than drawing it again, so the classes are only carried while it is open
        open: {
            true: "motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-short",
            false: "",
        },
    },
});

const px = (value: number | undefined) => (value === undefined ? undefined : `${value}px`);

// The one surface every panel is drawn in, for a menu that would rather slide a surface along
// the row and grow it to fit each panel than draw a surface under each item. It tells the menu
// where it is, so that the panels can be carried off into it, and is sized and placed from what
// the menu measures the open panel and its trigger to be
function NavigationMenuViewport(
    props: NavigationMenuViewportProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, style, onPointerEnter, onPointerLeave, ...rest } = props;

    const menu = React.useContext(NavigationMenuContext);
    const positioner = React.useContext(NavigationMenuPositionerContext);
    const align = positioner?.align ?? "center";

    const viewportRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRefs(ref, viewportRef);

    const registerViewport = menu?.registerViewport;

    useIsomorphicLayoutEffect(() => {
        const node = viewportRef.current;

        if (!registerViewport || !node) {
            return;
        }

        registerViewport({ node, align });

        return () => registerViewport(null);
    }, [align, registerViewport]);

    if (!menu) {
        return null;
    }

    // A pointer resting on the viewport keeps it standing, and one leaving it starts the wait
    // before it is put away. Only a mouse counts as resting: a finger is lifted rather than
    // moved off, and a menu that does not open on the pointer does not close on it either
    const handlePointerEnter = (event: React.PointerEvent<HTMLDivElement>) => {
        onPointerEnter?.(event);

        if (event.pointerType === "mouse") {
            menu.cancelClose();
        }
    };

    const handlePointerLeave = (event: React.PointerEvent<HTMLDivElement>) => {
        onPointerLeave?.(event);

        if (
            event.pointerType === "mouse" &&
            !menu.disableHoverTrigger &&
            !menu.disablePointerLeaveClose
        ) {
            menu.closeAfterDelay();
        }
    };

    return (
        <div
            ref={mergedRef}
            hidden={!menu.open}
            className={classNames(navigationMenuViewportVariants({ open: menu.open }), className)}
            // Its size and where it stands are the open panel's and its trigger's, handed to
            // the stylesheet so that moving between items can be a transition from one to the
            // next rather than a jump
            style={
                {
                    ...style,
                    "--navigation-menu-viewport-width": px(menu.viewportSize?.width),
                    "--navigation-menu-viewport-height": px(menu.viewportSize?.height),
                    "--navigation-menu-viewport-x": px(menu.viewportPosition?.x),
                    "--navigation-menu-viewport-y": px(menu.viewportPosition?.y),
                } as React.CSSProperties
            }
            data-component="NavigationMenu.Viewport"
            data-orientation={menu.orientation}
            data-align={align}
            data-open={menu.open ? "" : undefined}
            // A menu that has just opened has nowhere for the viewport to slide or grow from, so
            // it is drawn where it belongs rather than carried there from wherever it last stood
            data-still={menu.still ? "" : undefined}
            {...rest}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
        />
    );
}

NavigationMenuViewport.displayName = "NavigationMenu.Viewport";

export default React.forwardRef(NavigationMenuViewport);
