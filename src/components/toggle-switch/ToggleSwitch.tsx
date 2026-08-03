import * as React from "react";
import { useId } from "../../hooks/useId";
import { classNames } from "../../utilities/classnames";
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
    root: "inline-flex items-center",
    statusLabelPosition: {
        start: "flex-row",
        end: "flex-row-reverse",
    } satisfies Record<ToggleSwitchStatusLabelPosition, string>,
    spinner: {
        root: "inline-flex",
        end: "ms-[var(--base-size-8)]",
    },
    statusText: {
        root: "relative mx-[var(--base-size-8)] cursor-pointer [color:var(--foreground-color-default)]",
        disabled: "cursor-not-allowed [color:var(--foreground-color-muted)]",
        size: {
            small: "[font-size:var(--text-body-size-small)]",
            medium: "[font-size:var(--text-body-size-medium)]",
        } satisfies Record<ToggleSwitchSize, string>,
        // Both readings are laid out, with the one that does not apply left in place but out
        // of sight, so the switch keeps its width as it is turned on and off
        item: "block text-end",
        itemHidden: "invisible h-0",
    },
    button: {
        root: "relative block overflow-hidden p-0 cursor-pointer select-none appearance-none no-underline rounded-[var(--border-radius-default)] border-solid border-[length:var(--border-width-thin)] transition-[background-color,border-color] duration-micro ease-move motion-reduce:transition-none",
        // The focus ring is drawn outside the track rather than inset, where the fill behind
        // it would swallow it
        focus: "focus-visible:outline-solid focus-visible:outline-[length:var(--focus-outline-width)] focus-visible:outline-[color:var(--focus-outline-color)] focus-visible:outline-offset-[var(--base-size-2)]",
        // A coarse pointer is given a target taller than the switch itself to aim at
        target: "pointer-coarse:before:content-[''] pointer-coarse:before:absolute pointer-coarse:before:inset-x-0 pointer-coarse:before:top-1/2 pointer-coarse:before:-translate-y-1/2 pointer-coarse:before:min-h-[var(--control-min-target-coarse)]",
        // The track is twice as wide as it is tall. The small switch stands at the height the
        // control scale calls xsmall
        size: {
            small: "h-[var(--control-xsmall-size)] w-[calc(var(--control-xsmall-size)*2)]",
            medium: "h-[var(--control-medium-size)] w-[calc(var(--control-medium-size)*2)]",
        } satisfies Record<ToggleSwitchSize, string>,
        track: {
            off: "bg-[var(--control-track-background-color-rest)] border-[color:var(--control-track-border-color-rest)] hover:bg-[var(--control-track-background-color-hover)] focus-visible:bg-[var(--control-track-background-color-hover)] active:bg-[var(--control-track-background-color-active)]",
            on: "bg-[var(--control-checked-background-color-rest)] border-[color:var(--control-checked-border-color-rest)] hover:bg-[var(--control-checked-background-color-hover)] focus-visible:bg-[var(--control-checked-background-color-hover)] active:bg-[var(--control-checked-background-color-active)]",
            disabled:
                "cursor-not-allowed transition-none bg-[var(--control-track-background-color-disabled)] border-transparent forced-colors:border-[color:GrayText]",
        },
    },
    content: "flex items-center w-full h-full overflow-hidden",
    icon: {
        // Each icon takes half the track, so the pair slides by exactly its own width. The
        // icon is centred in that half by the container rather than laid out as a line of
        // text, which would leave it sitting on a baseline with the descender space below it
        root: "flex items-center justify-center grow shrink-0 basis-1/2 transition-transform duration-micro ease-move motion-reduce:transition-none",
        // The bar follows the knob in from the start of the track as the switch goes on, and
        // the ring leaves at the end of it
        line: "[color:var(--control-checked-foreground-color-rest)]",
        lineDisabled: "[color:var(--control-checked-foreground-color-disabled)]",
        lineOn: "translate-x-0",
        lineOff: "-translate-x-full",
        circle: "[color:var(--control-track-foreground-color-rest)]",
        circleDisabled: "[color:var(--control-track-foreground-color-disabled)]",
        circleOn: "translate-x-full",
        circleOff: "translate-x-0",
    },
    knob: {
        // The knob sits inside the track's border, so its own radius comes in by as much
        root: "absolute z-1 top-px bottom-px left-px w-1/2 bg-[var(--control-knob-background-color-rest)] border-solid border-[length:var(--border-width-thin)] border-[color:var(--control-knob-border-color-rest)] rounded-[calc(var(--border-radius-default)-var(--border-width-thick))] transition-transform duration-micro ease-move motion-reduce:transition-none",
        // The travel is short by the borders the knob is inset from
        on: "translate-x-[calc(100%-2px)] bg-[var(--control-knob-background-color-checked)] border-[color:var(--control-knob-border-color-checked)]",
        off: "translate-x-0",
        disabled:
            "bg-[var(--control-knob-background-color-disabled)] border-[color:var(--control-knob-border-color-disabled)]",
    },
    srOnly: "sr-only",
};

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
            className={classNames(
                classes.root,
                classes.statusLabelPosition[statusLabelPosition],
                className,
            )}
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
                    className={classNames(
                        classes.spinner.root,
                        statusLabelPosition === "end" && classes.spinner.end,
                    )}
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
                    classes.statusText.root,
                    classes.statusText.size[size],
                    !acceptsInteraction && classes.statusText.disabled,
                )}
                aria-hidden="true"
                onClick={handleToggleClick}
                data-component="ToggleSwitch.StatusText"
            >
                <span
                    className={classNames(
                        classes.statusText.item,
                        !isOn && classes.statusText.itemHidden,
                    )}
                >
                    {buttonLabelOn}
                </span>
                <span
                    className={classNames(
                        classes.statusText.item,
                        isOn && classes.statusText.itemHidden,
                    )}
                >
                    {buttonLabelOff}
                </span>
            </span>

            <button
                ref={ref}
                type={buttonType}
                className={classNames(
                    classes.button.root,
                    classes.button.focus,
                    classes.button.target,
                    classes.button.size[size],
                    acceptsInteraction
                        ? isOn
                            ? classes.button.track.on
                            : classes.button.track.off
                        : classes.button.track.disabled,
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
                            classes.icon.root,
                            acceptsInteraction ? classes.icon.line : classes.icon.lineDisabled,
                            isOn ? classes.icon.lineOn : classes.icon.lineOff,
                        )}
                        data-component="ToggleSwitch.LineIcon"
                    >
                        <LineIcon size={size} />
                    </span>
                    <span
                        className={classNames(
                            classes.icon.root,
                            acceptsInteraction ? classes.icon.circle : classes.icon.circleDisabled,
                            isOn ? classes.icon.circleOn : classes.icon.circleOff,
                        )}
                        data-component="ToggleSwitch.CircleIcon"
                    >
                        <CircleIcon size={size} />
                    </span>
                </span>
                <span
                    className={classNames(
                        classes.knob.root,
                        isOn ? classes.knob.on : classes.knob.off,
                        !acceptsInteraction && classes.knob.disabled,
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
