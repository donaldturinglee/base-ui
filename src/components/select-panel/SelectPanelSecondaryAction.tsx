import * as React from "react";
import { useId } from "../../hooks/useId";
import { classNames } from "../../utilities/classnames";
import { Button } from "../button";
import { Checkbox } from "../checkbox";
import { Link } from "../link";
import type { CheckboxProps } from "../checkbox";
import type { SelectPanelSecondaryActionProps } from "./SelectPanel.types";

const classes = {
    small: "[font-size:var(--text-body-size-small)]",
    checkbox: "flex items-center gap-[var(--stack-gap-condensed)]",
    // The box is centred against the single line of text beside it rather than against a
    // label standing above a field
    box: "mt-0",
};

const SecondaryCheckbox = (props: CheckboxProps) => {
    const { id, children, className, ...rest } = props;
    const checkboxId = useId(id);

    return (
        <span className={classes.checkbox} data-component="SelectPanel.SecondaryAction">
            <Checkbox id={checkboxId} className={classNames(classes.box, className)} {...rest} />
            <label htmlFor={checkboxId} className={classes.small}>
                {children}
            </label>
        </span>
    );
};

// A second thing the footer can do, standing beside saving and cancelling. What it is drawn
// as follows from the variant, since all three read as one action in the same place. The
// variant itself says nothing about that element, so it is kept off the DOM
function SelectPanelSecondaryAction(props: SelectPanelSecondaryActionProps) {
    if (props.variant === "checkbox") {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { variant: _variant, ...rest } = props;
        return <SecondaryCheckbox {...rest} />;
    }

    if (props.variant === "link") {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { variant: _variant, className, ...rest } = props;
        return (
            <Link
                className={classNames(classes.small, className)}
                data-component="SelectPanel.SecondaryAction"
                {...rest}
            />
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { variant: _variant, ...rest } = props;

    return (
        <Button
            type="button"
            size="small"
            block
            data-component="SelectPanel.SecondaryAction"
            {...rest}
        />
    );
}

SelectPanelSecondaryAction.displayName = "SelectPanel.SecondaryAction";

export default SelectPanelSecondaryAction;
