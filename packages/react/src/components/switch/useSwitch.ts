import * as React from "react";
import { useId } from "../../hooks/useId";
import { FormControlContext } from "../form-control/FormControlContext";
import type { UseSwitchProps, UseSwitchReturn } from "./Switch.types";

// Everything a switch needs and nothing that draws one: whether it is on, what it is called and
// what it submits, and the way to turn it. The switch is built on this, so a caller who wants to
// turn it from somewhere else, or draw a control of their own rather than the parts, is working
// from the same state the parts are.
//
//     const notifications = useSwitch({ defaultChecked: true });
//
//     <Switch.RootProvider value={notifications}>...</Switch.RootProvider>
//     <Button onClick={notifications.toggleChecked}>Toggle</Button>
//
// A switch standing in a FormControl is wired into it: the input takes the field's id, so the
// name over the field points at it, and the switch is disabled, required and described as the
// field says unless it was told otherwise itself
export const useSwitch = (props: UseSwitchProps = {}): UseSwitchReturn => {
    const {
        checked,
        defaultChecked,
        disabled,
        readOnly,
        required,
        invalid,
        name,
        value,
        form,
        id,
        ids,
        onCheckedChange,
    } = props;

    const field = React.useContext(FormControlContext);

    // A switch the caller is holding the state of takes whether it is on from the prop; one that
    // is not keeps its own
    const isControlled = checked !== undefined;
    const [selfChecked, setSelfChecked] = React.useState(Boolean(defaultChecked));
    const isChecked = isControlled ? checked : selfChecked;

    // The parts are named from the switch's own id, so that the root can point at the input and
    // the input can name itself by the label without either having been told the other's name
    const uuid = useId(id);

    // Turning is not refused here for a switch that is disabled or read-only: the input is what
    // refuses a press on either, and a caller turning the switch from outside is left to it
    const setChecked = (next: boolean) => {
        if (!isControlled) {
            setSelfChecked(next);
        }

        onCheckedChange?.(next);
    };

    return {
        checked: isChecked,
        disabled: Boolean(disabled ?? field.disabled),
        readOnly: Boolean(readOnly),
        required: Boolean(required ?? field.required),
        invalid: Boolean(invalid),
        name,
        value,
        form,
        ids: {
            root: ids?.root ?? uuid,
            label: ids?.label ?? `${uuid}-label`,
            control: ids?.control ?? `${uuid}-control`,
            thumb: ids?.thumb ?? `${uuid}-thumb`,
            // The input takes the field's id where it stands in one, since that is what the
            // field's own name and caption point at
            hiddenInput: ids?.hiddenInput ?? field.id ?? `${uuid}-input`,
        },
        describedBy:
            [field.validationMessageId, field.captionId].filter(Boolean).join(" ") || undefined,
        setChecked,
        toggleChecked: () => setChecked(!isChecked),
    };
};
