import * as React from "react";
import { useId } from "../../hooks/useId";
import { useSlots } from "../../hooks/useSlots";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import CardAction from "./CardAction";
import { CardContext } from "./CardContext";
import CardDescription from "./CardDescription";
import CardHeading from "./CardHeading";
import CardIcon from "./CardIcon";
import CardImage from "./CardImage";
import CardMetadata from "./CardMetadata";
import type {
    CardBorderRadius,
    CardElement,
    CardLayout,
    CardPadding,
    CardProps,
} from "./Card.types";

const classes = {
    content: "grid gap-[var(--stack-gap-condensed)]",
};

const cardVariants = cva(
    "relative grid overflow-hidden [grid-auto-rows:max-content_auto] gap-[var(--stack-gap-normal)] bg-[var(--card-background-color)] border-solid border-[length:var(--border-width-thin)] border-border-default [box-shadow:var(--shadow-resting-small)]",
    {
        variants: {
            borderRadius: {
                medium: "rounded-[var(--border-radius-medium)]",
                large: "rounded-[var(--border-radius-large)]",
            } satisfies Record<CardBorderRadius, string>,
            // A compact card lays its parts out in a row rather than stacking them
            layout: {
                default: "",
                compact: "flex items-start gap-[var(--stack-gap-condensed)]",
            } satisfies Record<CardLayout, string>,
            padding: {
                none: "p-0",
                condensed: "p-[var(--stack-padding-condensed)]",
                normal: "p-[var(--stack-padding-spacious)]",
            } satisfies Record<CardPadding, string>,
        },
        // A compact card pulls its normal padding in by a step
        compoundVariants: [
            { layout: "compact", padding: "normal", class: "p-[var(--stack-padding-normal)]" },
        ],
    },
);

const cardHeaderVariants = cva("block w-full h-auto", {
    variants: {
        // An image runs to the card's edges, so the header cancels the padding around it
        edgeToEdge: {
            true: "mt-[calc(-1*var(--stack-padding-spacious))] mx-[calc(-1*var(--stack-padding-spacious))] w-[calc(100%+2*var(--stack-padding-spacious))]",
            false: "",
        },
        layout: {
            default: "",
            compact: "flex-none w-auto",
        } satisfies Record<CardLayout, string>,
    },
});

const cardBodyVariants = cva("grid gap-[var(--stack-gap-normal)]", {
    variants: {
        layout: {
            default: "",
            compact: "flex-auto",
        } satisfies Record<CardLayout, string>,
    },
});

function Card<As extends CardElement = "div">(
    props: CardProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        children,
        padding = "normal",
        borderRadius = "large",
        layout = "default",
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        ...rest
        // The cast keeps `as` as the full element union, so the section check below narrows
    } = props as CardProps<CardElement>;

    const generatedId = useId();
    const [slots] = useSlots(children, {
        icon: CardIcon,
        image: CardImage,
        heading: CardHeading,
        description: CardDescription,
        metadata: CardMetadata,
        action: CardAction,
    });

    const isSection = Component === "section";
    const titleId = isSection ? generatedId : undefined;
    // A standalone card is a landmark, so it needs a name; the heading supplies one unless
    // the caller has named it directly
    const labelledBy = ariaLabelledBy ?? (isSection && !ariaLabel ? titleId : undefined);

    const header = slots.image ?? slots.icon;
    const hasSlots = Boolean(
        header || slots.heading || slots.description || slots.metadata || slots.action,
    );

    // Nothing to show, not even an empty shell
    if (React.Children.toArray(children).length === 0) {
        return null;
    }

    return (
        <CardContext.Provider value={{ titleId, layout }}>
            <Component
                ref={ref}
                aria-label={ariaLabel}
                aria-labelledby={labelledBy}
                className={classNames(cardVariants({ borderRadius, layout, padding }), className)}
                data-component="Card"
                data-padding={padding}
                data-border-radius={borderRadius}
                data-layout={layout}
                {...rest}
            >
                {hasSlots ? (
                    <>
                        {header ? (
                            <div
                                className={classNames(
                                    cardHeaderVariants({
                                        edgeToEdge: Boolean(slots.image),
                                        layout,
                                    }),
                                )}
                            >
                                {header}
                            </div>
                        ) : null}
                        <div className={classNames(cardBodyVariants({ layout }))}>
                            <div className={classes.content}>
                                {slots.heading}
                                {slots.description}
                            </div>
                            {slots.metadata}
                        </div>
                        {slots.action}
                    </>
                ) : (
                    children
                )}
            </Component>
        </CardContext.Provider>
    );
}

Card.displayName = "Card";

export default fixedForwardRef(Card);
