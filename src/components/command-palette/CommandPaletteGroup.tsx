import * as React from "react";
import { useId } from "../../hooks/useId";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { CommandPaletteContext, CommandPaletteGroupContext } from "./CommandPaletteContext";
import type { CommandPaletteGroupProps } from "./CommandPalette.types";

const classes = {
    // A column of its own, so that the items inside it can be laid out in the order they
    // answered best in just as they are in the list itself
    root: "flex flex-col",
    heading:
        "px-[var(--base-size-8)] pt-[var(--base-size-8)] pb-[var(--base-size-4)] [color:var(--foreground-color-muted)] [font-size:var(--text-body-size-small)] [font-weight:var(--base-text-weight-semibold)] [line-height:var(--text-body-line-height-small)]",
    hidden: "hidden",
};

// A run of items under a heading. Once the filter has left it with nothing in it, the group
// stands down along with its heading rather than leaving a heading over an empty space
function CommandPaletteGroup(
    props: CommandPaletteGroupProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { heading, forceMount = false, className, children, ...rest } = props;

    const groupId = useId();
    const headingId = useId();
    const palette = React.useContext(CommandPaletteContext);

    const context = React.useMemo(() => ({ groupId }), [groupId]);

    // Where every item inside has been filtered away the group has nothing left to head, and a
    // heading over an empty space is worse than no heading at all. A group whose items have
    // yet to say they are there is left standing, since they are drawn inside it
    const mine = (palette?.entries ?? []).filter((entry) => entry.groupId === groupId);
    const ranks = mine
        .map((entry) => palette?.order.indexOf(entry.value) ?? -1)
        .filter((rank) => rank !== -1);

    const isShown = forceMount || mine.length === 0 || ranks.length > 0;

    return (
        <CommandPaletteGroupContext.Provider value={context}>
            <div
                ref={ref}
                role="group"
                aria-labelledby={heading ? headingId : undefined}
                className={classNames(classes.root, !isShown && classes.hidden, className)}
                // The groups fall in behind whichever of them answered best, in the same way
                // the items inside them do
                style={{ order: ranks.length > 0 ? Math.min(...ranks) : undefined }}
                data-component="CommandPalette.Group"
                {...rest}
            >
                {heading ? (
                    <div
                        id={headingId}
                        className={classes.heading}
                        data-component="CommandPalette.GroupHeading"
                    >
                        {heading}
                    </div>
                ) : null}
                {children}
            </div>
        </CommandPaletteGroupContext.Provider>
    );
}

CommandPaletteGroup.displayName = "CommandPalette.Group";

export default fixedForwardRef(CommandPaletteGroup);
