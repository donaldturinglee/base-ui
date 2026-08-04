import * as React from "react";
import { useId } from "../../hooks/useId";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { RatingProps, RatingSize } from "./Rating.types";

// How many stars a rating is read out of where it is not told otherwise
export const DEFAULT_RATING_COUNT = 5;

const classes = {
    item: "rating-item",
    input: "rating-input",
    srOnly: "sr-only",
    star: "rating-star",
    starTrack: "rating-star-track",
    starFill: "rating-star-fill",
    starFillIcon: "rating-star-fill-icon",
};

const ratingVariants = cva("rating", {
    variants: {
        size: {
            small: "rating-small",
            medium: "rating-medium",
            large: "rating-large",
        } satisfies Record<RatingSize, string>,
        // Only a rating that can be moved shows where the pointer would leave it
        interactive: {
            true: "rating-interactive",
            false: "",
        },
        disabled: {
            true: "rating-disabled",
            false: "",
        },
    },
});

// What a screen reader hears for each star, where the caller has not said it in words of their
// own. A radio already says which of the group it is, so the label says what the group counts in
const defaultItemLabel = (value: number) => (value === 1 ? "1 star" : `${value} stars`);

// And what it hears for a reading, which is read as one thing rather than as a row of stars
const defaultValueLabel = (value: number, count: number) => `${value} out of ${count} stars`;

// The star both copies of every star are drawn from. It belongs to the rating rather than to the
// icon set, so it is drawn here. How big it is drawn is left to the stylesheet, which sizes the
// box it is laid in, so the shape follows the size the rating stands at without being told twice
const StarIcon = ({ className }: { className: string }) => (
    <svg
        className={className}
        aria-hidden="true"
        viewBox="0 0 16 16"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
    </svg>
);

// How well a thing was thought of, read as a row of stars out of however many it is read out of.
//
// A rating that can be moved is a group of radios, one to a star, drawn over rather than redrawn:
// the browser does the picking, the arrow keys and the tab stop, and the stars are what it is
// drawn as. The value is handed to the stylesheet rather than turned into a fill here, so how
// much of each star is filled is settled in the same place as the colour and the size it is drawn
// with, and the row can show where the pointer would leave it without a value React has to keep
// in step with the pointer.
//
// A reading is drawn from the same stars with nothing behind them, and is read as one thing:
// there is nothing there to pick, so a value standing between two stars is drawn standing there
function Rating(
    props: RatingProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        style,
        count = DEFAULT_RATING_COUNT,
        value,
        defaultValue,
        size = "medium",
        readOnly,
        disabled,
        clearable,
        name,
        onChange,
        itemLabel = defaultItemLabel,
        valueLabel = defaultValueLabel,
        "aria-label": ariaLabel,
        ...rest
    } = props;

    // A rating the caller is holding the value of takes where it stands from the prop; one that
    // is not keeps its own, since how much of each star is filled has to be worked out from it
    // either way
    const isControlled = value !== undefined;
    const [selfValue, setSelfValue] = React.useState(() => defaultValue ?? 0);
    const currentValue = isControlled ? value : selfValue;

    // The row is drawn from whole stars, and a value past either end of it is brought back to
    // the end it ran past before the stars are filled from it
    const stars = Math.max(Math.trunc(count), 0);
    const shownValue = Math.min(Math.max(currentValue, 0), stars);

    // The radios are grouped by name, so a rating that was given none is given one of its own
    // rather than joining every other rating on the page
    const groupName = useId(name);
    const isInteractive = !readOnly && !disabled;

    const changeTo = (next: number) => {
        // A rating that cannot be moved does not move, however the click reached it
        if (!isInteractive) {
            return;
        }

        if (!isControlled) {
            setSelfValue(next);
        }

        onChange?.(next);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        changeTo(Number(event.currentTarget.value));
    };

    // The browser reports no change for a radio that was already checked, so a click is what
    // says the star the rating already stands at has been picked again
    const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
        if (clearable && Number(event.currentTarget.value) === shownValue) {
            changeTo(0);
        }
    };

    // A star that can be picked is a label, so the whole of it is a target for the radio behind
    // it. A reading has no radio to point at, so its stars are left as plain spans
    const Item: React.ElementType = readOnly ? "span" : "label";

    return (
        <span
            ref={ref}
            role={readOnly ? "img" : "radiogroup"}
            // A reading is named by what it reads where it was given no name of its own, since
            // the stars themselves say nothing once there is nothing to pick among them
            aria-label={readOnly ? (ariaLabel ?? valueLabel(shownValue, stars)) : ariaLabel}
            className={classNames(
                ratingVariants({ size, interactive: isInteractive, disabled: Boolean(disabled) }),
                className,
            )}
            style={
                {
                    ...style,
                    "--rating-value": shownValue,
                } as React.CSSProperties
            }
            data-component="Rating"
            data-size={size}
            data-value={shownValue}
            data-count={stars}
            data-readonly={readOnly}
            data-disabled={disabled}
            {...rest}
        >
            {Array.from({ length: stars }, (_, index) => {
                const starValue = index + 1;

                return (
                    <Item
                        key={starValue}
                        className={classes.item}
                        // Each star carries its place in the row, which is what the stylesheet
                        // works out its share of the value from
                        style={{ "--rating-item-index": index } as React.CSSProperties}
                        data-component="Rating.Item"
                    >
                        {readOnly ? null : (
                            <input
                                type="radio"
                                className={classNames(classes.input, classes.srOnly)}
                                name={groupName}
                                value={starValue}
                                checked={starValue === shownValue}
                                disabled={disabled}
                                aria-label={itemLabel(starValue, stars)}
                                onChange={handleChange}
                                onClick={handleClick}
                                data-component="Rating.Input"
                            />
                        )}
                        <span className={classes.star} aria-hidden="true">
                            <StarIcon className={classes.starTrack} />
                            <span className={classes.starFill}>
                                <StarIcon className={classes.starFillIcon} />
                            </span>
                        </span>
                    </Item>
                );
            })}
        </span>
    );
}

Rating.displayName = "Rating";

export default fixedForwardRef(Rating);
