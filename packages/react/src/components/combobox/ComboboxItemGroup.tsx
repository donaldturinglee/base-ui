import * as React from "react";
import { useId } from "../../hooks/useId";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { ComboboxContext, ComboboxItemGroupContext } from "./ComboboxContext";
import type { ComboboxItemGroupProps } from "./Combobox.types";

const classes = {
    root: "combobox-item-group",
    hidden: "hidden",
};

// A run of items under a name of their own. Once what was typed has left it with nothing in it,
// the group stands down along with its name rather than leaving a name over an empty space
function ComboboxItemGroup(
    props: ComboboxItemGroupProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { forceMount = false, className, children, ...rest } = props;

    const groupId = useId();
    const labelId = useId();
    const combobox = React.useContext(ComboboxContext);

    const context = React.useMemo(() => ({ groupId, labelId }), [groupId, labelId]);

    // A group whose items have yet to say they are there is left standing, since they are
    // drawn inside it and would have nowhere to arrive
    const mine = (combobox?.entries ?? []).filter((entry) => entry.groupId === groupId);
    const isShown =
        forceMount ||
        mine.length === 0 ||
        mine.some((entry) => combobox?.isMatch(entry.value) ?? true);

    return (
        <ComboboxItemGroupContext.Provider value={context}>
            <div
                ref={ref}
                role="group"
                aria-labelledby={labelId}
                className={classNames(classes.root, !isShown && classes.hidden, className)}
                data-component="Combobox.ItemGroup"
                {...rest}
            >
                {children}
            </div>
        </ComboboxItemGroupContext.Provider>
    );
}

ComboboxItemGroup.displayName = "Combobox.ItemGroup";

export default fixedForwardRef(ComboboxItemGroup);
