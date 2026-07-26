import * as React from "react";
import { useId } from "../../hooks/useId";
import { useSlots } from "../../hooks/useSlots";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import Checkbox from "../checkbox/Checkbox";
import type { CheckboxProps } from "../checkbox/Checkbox.types";
import CheckboxGroupCaption from "./CheckboxGroupCaption";
import { CheckboxGroupContext } from "./CheckboxGroupContext";
import CheckboxGroupLabel from "./CheckboxGroupLabel";
import CheckboxGroupValidation from "./CheckboxGroupValidation";
import type { CheckboxGroupProps } from "./CheckboxGroup.types";

const classes = {
    root: "p-0 m-0 border-none",
    legend: "p-0",
    legendVisible: "mb-[var(--base-size-8)]",
    // The boxes stack, each one spaced from the last
    body: "flex flex-col list-none p-0 m-0 [&>*+*]:mt-[var(--base-size-8)]",
    validation: "mt-[var(--base-size-8)]",
    hidden: "sr-only",
};

// Walks the tree for the boxes that start out checked, so the group knows its selection
// before anything is clicked
const getCheckedValues = (children: React.ReactNode): string[] => {
    const values: string[] = [];

    const visit = (nodes: React.ReactNode) => {
        React.Children.forEach(nodes, (child) => {
            if (!React.isValidElement<CheckboxProps>(child)) {
                return;
            }

            if (child.type === Checkbox) {
                const { checked, defaultChecked, value } = child.props;

                if ((checked || defaultChecked) && value) {
                    values.push(value);
                }

                return;
            }

            visit((child.props as { children?: React.ReactNode }).children);
        });
    };

    visit(children);

    return values;
};

function CheckboxGroup<As extends React.ElementType = "fieldset">(
    props: CheckboxGroupProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "fieldset",
        className,
        children,
        disabled,
        required,
        onChange,
        id: idProp,
        "aria-labelledby": ariaLabelledBy,
        ...rest
    } = props as CheckboxGroupProps<"fieldset">;

    const [slots, boxes] = useSlots(children, {
        label: CheckboxGroupLabel,
        caption: CheckboxGroupCaption,
        validation: CheckboxGroupValidation,
    });

    const id = useId(idProp);
    const captionId = slots.caption ? `${id}-caption` : undefined;
    const validationMessageId = slots.validation ? `${id}-validation` : undefined;

    const [selected, setSelected] = React.useState(() => getCheckedValues(children));

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.currentTarget;
        const next = checked
            ? [...selected, value]
            : selected.filter((selectedValue) => selectedValue !== value);

        setSelected(next);
        onChange?.(next, event);
    };

    const isLabelVisible = React.isValidElement<{ visuallyHidden?: boolean }>(slots.label)
        ? !slots.label.props.visuallyHidden
        : false;

    const context = {
        disabled,
        required,
        captionId,
        validationMessageId,
        onChange: handleChange,
    };

    return (
        <CheckboxGroupContext.Provider value={context}>
            <Component
                ref={ref}
                id={id}
                disabled={disabled}
                aria-labelledby={slots.label ? undefined : ariaLabelledBy}
                aria-describedby={
                    [validationMessageId, captionId].filter(Boolean).join(" ") || undefined
                }
                className={classNames(classes.root, className)}
                data-component="CheckboxGroup"
                data-disabled={disabled}
                data-required={required}
                {...rest}
            >
                {slots.label ? (
                    // The caption and the validation message sit in the legend as well, so
                    // a screen reader reads them as part of the group's name
                    <legend
                        className={classNames(
                            classes.legend,
                            isLabelVisible && classes.legendVisible,
                        )}
                    >
                        {slots.label}
                        {required ? <span className={classes.hidden}>, required</span> : null}
                        {slots.caption}
                    </legend>
                ) : (
                    slots.caption
                )}

                <div className={classes.body}>{boxes}</div>

                {slots.validation ? (
                    <div className={classes.validation}>{slots.validation}</div>
                ) : null}
            </Component>
        </CheckboxGroupContext.Provider>
    );
}

CheckboxGroup.displayName = "CheckboxGroup";

export default fixedForwardRef(CheckboxGroup);
