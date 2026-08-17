import * as React from "react";
import { useId } from "../../hooks/useId";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { SelectOptGroupContext } from "./SelectOptGroupContext";
import type { SelectOptGroupProps } from "./Select.types";

const classes = {
    group: "select-optgroup",
    label: "select-optgroup-label",
};

// A run of options gathered under a name. The name is a row of its own rather than a choice,
// so it is read as what the group is called and never picked
function SelectOptGroup(
    props: SelectOptGroupProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, label, disabled, id: idProp, ...rest } = props;

    const id = useId(idProp);
    const labelId = `${id}-label`;

    // A group that cannot be used says so once here rather than marking each of its options,
    // so it reaches them however they were written underneath it
    const context = React.useMemo(() => ({ disabled }), [disabled]);

    return (
        <div
            ref={ref}
            id={id}
            role="group"
            aria-labelledby={labelId}
            className={classNames(classes.group, className)}
            data-component="Select.OptGroup"
            data-disabled={disabled || undefined}
            {...rest}
        >
            <div id={labelId} className={classes.label}>
                {label}
            </div>
            <SelectOptGroupContext.Provider value={context}>
                {children}
            </SelectOptGroupContext.Provider>
        </div>
    );
}

SelectOptGroup.displayName = "Select.OptGroup";

export default fixedForwardRef(SelectOptGroup);
