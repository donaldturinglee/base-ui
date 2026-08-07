import * as React from "react";
import { useId } from "../../hooks/useId";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Spinner } from "../spinner";
import type {
    ToggleSwitchProps,
    ToggleSwitchSize,
    ToggleSwitchStatusLabelPosition,
} from "./ToggleSwitch.types";

// Long enough that a switch which settles on its own says nothing, rather than interrupting a
// reader over a wait they never noticed
export const DEFAULT_TOGGLE_SWITCH_LOADING_LABEL_DELAY = 2000;

const classes = {
    content: "toggle-switch-content",
    srOnly: "sr-only",
};

const iconRoot = "toggle-switch-icon";

const toggleSwitchVariants = cva("toggle-switch", {
    variants: {
        statusLabelPosition: {
            start: "toggle-switch-label-start",
            end: "toggle-switch-label-end",
        } satisfies Record<ToggleSwitchStatusLabelPosition, string>,
    },
});

const toggleSwitchSpinnerVariants = cva("toggle-switch-status", {
    variants: {
        statusLabelPosition: {
            start: "",
            end: "toggle-switch-status-end",
        } satisfies Record<ToggleSwitchStatusLabelPosition, string>,
    },
});

const toggleSwitchStatusTextVariants = cva("toggle-switch-status-label", {
    variants: {
        size: {
            small: "toggle-switch-status-label-small",
            medium: "toggle-switch-status-label-medium",
        } satisfies Record<ToggleSwitchSize, string>,
        disabled: {
            true: "toggle-switch-status-label-disabled",
            false: "",
        },
    },
});

// Both readings are laid out, with the one that does not apply left in place but out of
// sight, so the switch keeps its width as it is turned on and off
const toggleSwitchStatusTextItemVariants = cva("toggle-switch-status-text", {
    variants: {
        hidden: {
            true: "toggle-switch-status-text-hidden",
            false: "",
        },
    },
});

const toggleSwitchButtonVariants = cva("toggle-switch-track", {
    variants: {
        size: {
            small: "toggle-switch-track-small",
            medium: "toggle-switch-track-medium",
        } satisfies Record<ToggleSwitchSize, string>,
        track: {
            off: "toggle-switch-track-off",
            on: "toggle-switch-track-on",
            disabled: "toggle-switch-track-disabled",
        },
    },
});

// The bar follows the knob in from the start of the track as the switch goes on, and the ring
// leaves at the end of it
const toggleSwitchLineIconVariants = cva(iconRoot, {
    variants: {
        disabled: {
            true: "toggle-switch-circle-icon-disabled",
            false: "toggle-switch-circle-icon",
        },
        checked: {
            true: "translate-x-0",
            false: "-translate-x-full",
        },
    },
});

const toggleSwitchCircleIconVariants = cva(iconRoot, {
    variants: {
        disabled: {
            true: "toggle-switch-line-icon-disabled",
            false: "toggle-switch-line-icon",
        },
        checked: {
            true: "translate-x-full",
            false: "translate-x-0",
        },
    },
});

const toggleSwitchKnobVariants = cva("toggle-switch-knob", {
    variants: {
        // The travel is short by the borders the knob is inset from
        checked: {
            true: "toggle-switch-knob-checked",
            false: "translate-x-0",
        },
        disabled: {
            true: "toggle-switch-knob-disabled",
            false: "",
        },
    },
});

const iconSizes = { small: 12, medium: 16 } satisfies Record<ToggleSwitchSize, number>;

// The ring and the bar that slide behind the knob. They belong to the switch rather than to
// the icon set, so they are drawn here
const CircleIcon = ({ size }: { size: ToggleSwitchSize }) => (
    <svg
        aria-hidden="true"
        width={iconSizes[size]}
        height={iconSizes[size]}
        viewBox="0 0 16 16"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fillRule="evenodd"
            d="M8 12.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12Z"
        />
    </svg>
);

const LineIcon = ({ size }: { size: ToggleSwitchSize }) => (
    <svg
        aria-hidden="true"
        width={iconSizes[size]}
        height={iconSizes[size]}
        viewBox="0 0 16 16"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fillRule="evenodd"
            d="M8 2a.75.75 0 0 1 .75.75v11.5a.75.75 0 0 1-1.5 0V2.75A.75.75 0 0 1 8 2Z"
        />
    </svg>
);

function ToggleSwitch(
    props: ToggleSwitchProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        checked,
        defaultChecked,
        disabled,
        loading,
        onChange,
        onClick,
        size = "medium",
        statusLabelPosition = "start",
        buttonType = "button",
        loadingLabel = "Loading",
        loadingLabelDelay = DEFAULT_TOGGLE_SWITCH_LOADING_LABEL_DELAY,
        buttonLabelOn = "On",
        buttonLabelOff = "Off",
        "aria-labelledby": ariaLabelledBy,
        "aria-describedby": ariaDescribedBy,
        ...rest
    } = props;

    // A switch the caller is holding the state of takes its position from the prop; one that
    // is not keeps its own
    const isControlled = checked !== undefined;
    const [selfChecked, setSelfChecked] = React.useState(Boolean(defaultChecked));
    const isOn = isControlled ? checked : selfChecked;
    const acceptsInteraction = !disabled && !loading;

    const uuid = useId();
    const loadingLabelId = `${uuid}-loading-label`;
    const [isLoadingLabelVisible, setIsLoadingLabelVisible] = React.useState(false);

    // The wait is only spoken of once it has gone on long enough to be worth mentioning
    React.useEffect(() => {
        if (!loading) {
            setIsLoadingLabelVisible(false);
            return;
        }

        const timeout = window.setTimeout(() => {
            setIsLoadingLabelVisible(true);
        }, loadingLabelDelay);

        return () => {
            window.clearTimeout(timeout);
        };
    }, [loading, loadingLabelDelay]);

    const handleToggleClick = (event: React.MouseEvent) => {
        if (!acceptsInteraction) {
            return;
        }

        if (!isControlled) {
            setSelfChecked(!isOn);
        }

        onChange?.(!isOn);
        onClick?.(event);
    };

    const describedBy = [isLoadingLabelVisible ? loadingLabelId : undefined, ariaDescribedBy]
        .filter(Boolean)
        .join(" ");

    return (
        <div
            className={classNames(toggleSwitchVariants({ statusLabelPosition }), className)}
            data-component="ToggleSwitch"
            data-size={size}
            data-status-label-position={statusLabelPosition}
            data-checked={isOn}
            data-disabled={!acceptsInteraction}
            data-loading={loading ? "true" : undefined}
            {...rest}
        >
            <span id={loadingLabelId} role="status" className={classes.srOnly}>
                {isLoadingLabelVisible ? loadingLabel : ""}
            </span>

            {loading ? (
                <span
                    className={classNames(toggleSwitchSpinnerVariants({ statusLabelPosition }))}
                    data-component="ToggleSwitch.LoadingSpinner"
                >
                    {/* The switch says its own piece through the live region above, so the
                        spinner is left as decoration rather than adding a second one */}
                    <Spinner size="small" srText={null} role="presentation" />
                </span>
            ) : null}

            {/* The button carries the name and the state, so the labels beside it are there
                to be read and clicked rather than announced */}
            <span
                className={classNames(
                    toggleSwitchStatusTextVariants({ size, disabled: !acceptsInteraction }),
                )}
                aria-hidden="true"
                onClick={handleToggleClick}
                data-component="ToggleSwitch.StatusText"
            >
                <span className={classNames(toggleSwitchStatusTextItemVariants({ hidden: !isOn }))}>
                    {buttonLabelOn}
                </span>
                <span className={classNames(toggleSwitchStatusTextItemVariants({ hidden: isOn }))}>
                    {buttonLabelOff}
                </span>
            </span>

            <button
                ref={ref}
                type={buttonType}
                className={classNames(
                    toggleSwitchButtonVariants({
                        size,
                        track: acceptsInteraction ? (isOn ? "on" : "off") : "disabled",
                    }),
                )}
                onClick={handleToggleClick}
                aria-labelledby={ariaLabelledBy}
                aria-describedby={describedBy || undefined}
                aria-pressed={isOn}
                aria-disabled={!acceptsInteraction}
                data-component="ToggleSwitch.SwitchButton"
            >
                <span className={classes.content} aria-hidden="true">
                    <span
                        className={classNames(
                            toggleSwitchLineIconVariants({
                                disabled: !acceptsInteraction,
                                checked: isOn,
                            }),
                        )}
                        data-component="ToggleSwitch.LineIcon"
                    >
                        <LineIcon size={size} />
                    </span>
                    <span
                        className={classNames(
                            toggleSwitchCircleIconVariants({
                                disabled: !acceptsInteraction,
                                checked: isOn,
                            }),
                        )}
                        data-component="ToggleSwitch.CircleIcon"
                    >
                        <CircleIcon size={size} />
                    </span>
                </span>
                <span
                    className={classNames(
                        toggleSwitchKnobVariants({
                            checked: isOn,
                            disabled: !acceptsInteraction,
                        }),
                    )}
                    aria-hidden="true"
                    data-component="ToggleSwitch.ToggleKnob"
                />
            </button>
        </div>
    );
}

ToggleSwitch.displayName = "ToggleSwitch";

export default fixedForwardRef(ToggleSwitch);
