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
    content: "card-content",
};

const cardVariants = cva("card", {
    variants: {
        borderRadius: {
            medium: "card-radius-medium",
            large: "card-radius-large",
        } satisfies Record<CardBorderRadius, string>,
        layout: {
            default: "",
            compact: "card-compact",
        } satisfies Record<CardLayout, string>,
        padding: {
            none: "card-padding-none",
            condensed: "card-padding-condensed",
            normal: "card-padding-normal",
        } satisfies Record<CardPadding, string>,
    },
    compoundVariants: [
        { layout: "compact", padding: "normal", class: "card-compact-padding-normal" },
    ],
});

const cardHeaderVariants = cva("card-header", {
    variants: {
        edgeToEdge: {
            true: "card-header-edge-to-edge",
            false: "",
        },
        layout: {
            default: "",
            compact: "card-header-compact",
        } satisfies Record<CardLayout, string>,
    },
});

const cardBodyVariants = cva("card-body", {
    variants: {
        layout: {
            default: "",
            compact: "card-body-compact",
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
