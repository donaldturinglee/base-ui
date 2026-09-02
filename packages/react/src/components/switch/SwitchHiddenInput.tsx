import * as React from "react";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { SwitchContext } from "./SwitchContext";
import type { SwitchHiddenInputProps } from "./Switch.types";

const classes = {
    root: "switch-hidden-input",
    hidden: "sr-only",
};

// The checkbox the switch is drawn over. It is kept on the page but out of sight, so that the
// browser does the turning, the tab stop, the submitting and the resetting, and a reader who
// cannot see the track is still handed a control they know. It says it is a switch, since what
// it holds is a setting that is on or off rather than a box that is ticked.
//
// It is named by the words beside the track, and described by the caption and the validation
// message of the field it stands in, where it stands in one. Whatever the caller sets on it
// stands, so it can still be wired up by hand where it has to be
function SwitchHiddenInput(
    props: SwitchHiddenInputProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, onChange, ...rest } = props;
    const {
        checked = false,
        disabled,
        readOnly,
        required,
        invalid,
        name,
        value,
        form,
        ids,
        describedBy,
        initialChecked,
        setChecked,
    } = React.useContext(SwitchContext);

    const inputRef = React.useRef<HTMLInputElement>(null);
    const mergedRef = useMergedRefs(ref, inputRef);

    // The listener below is set up once, so the latest state is held aside for it rather than
    // the listener being set up again on every render
    const resetRef = React.useRef(() => {});

    React.useEffect(() => {
        resetRef.current = () => setChecked?.(Boolean(initialChecked));
    }, [initialChecked, setChecked]);

    // A form that is reset takes every control in it back to where it started, and the browser
    // does that to the input on its own. The switch holds the state the track is drawn from, so
    // it is taken back as well, or the track would be left showing where the input no longer is
    React.useEffect(() => {
        const owner = inputRef.current?.form;

        if (!owner) {
            return;
        }

        const handleReset = () => resetRef.current();

        owner.addEventListener("reset", handleReset);

        return () => {
            owner.removeEventListener("reset", handleReset);
        };
    }, [form]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(event);

        // The switch holds the state the input is drawn from, so a press it does not follow is
        // a press the input is put back from: a read-only switch stays where it stands, and so
        // does one whose press the caller has answered, since the browser turns the input back
        // over for that on its own and the switch would otherwise be left disagreeing with it
        if (readOnly || event.nativeEvent.defaultPrevented) {
            return;
        }

        setChecked?.(event.currentTarget.checked);
    };

    return (
        <input
            ref={mergedRef}
            id={ids?.hiddenInput}
            type="checkbox"
            role="switch"
            className={classNames(classes.root, classes.hidden, className)}
            checked={checked}
            disabled={disabled}
            required={required}
            name={name}
            value={value}
            form={form}
            aria-labelledby={ids?.label}
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            onChange={handleChange}
            data-component="Switch.HiddenInput"
            {...rest}
        />
    );
}

SwitchHiddenInput.displayName = "Switch.HiddenInput";

export default fixedForwardRef(SwitchHiddenInput);
