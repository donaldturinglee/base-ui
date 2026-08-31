import * as React from "react";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { ButtonVisual } from "../button";
import type { BadgeAppearance, BadgeProps, BadgeSize, BadgeVariant } from "./Badge.types";

const classes = {
    // The dot is drawn by the badge rather than passed to it, since the colour it carries is the
    // variant's and there is nothing for a caller to decide about it
    indicator: "badge-indicator",
    visual: "badge-visual",
};

const badgeVariants = cva("badge", {
    variants: {
        size: {
            small: "badge-small",
            medium: "badge-medium",
            large: "badge-large",
        } satisfies Record<BadgeSize, string>,
        variant: {
            default: "badge-default",
            primary: "badge-primary",
            accent: "badge-accent",
            success: "badge-success",
            attention: "badge-attention",
            severe: "badge-severe",
            danger: "badge-danger",
            done: "badge-done",
            sponsors: "badge-sponsors",
            outline: "badge-outline",
            invisible: "badge-invisible",
            link: "badge-link",
        } satisfies Record<BadgeVariant, string>,
        // A filled badge is the variant's own ground, so it adds nothing here. The dot
        // appearance takes the ground back off and is written after the variants in the
        // stylesheet, so it is the one that stands
        appearance: {
            filled: "",
            dot: "badge-dot",
        } satisfies Record<BadgeAppearance, string>,
    },
});

// A visual is given either as the component to draw, which is called with no props of its own,
// or as an element that is already built and is taken as it stands
const renderVisual = (visual: NonNullable<ButtonVisual>) => {
    if (React.isValidElement(visual)) {
        return visual;
    }

    const Visual = visual as React.ElementType;
    return <Visual />;
};

// A small pill for saying what something is or what state it is in: a word or two, read at a
// glance beside whatever it belongs to. Where Label draws the same word in outline, a badge fills,
// so it is the one to reach for where the colour is doing the work.
//
// The variant is kept on the element whichever appearance is asked for, since the dot takes its
// colour from it and the stylesheet reads the pair together
function Badge<As extends React.ElementType = "span">(
    props: BadgeProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "span",
        className,
        variant = "default",
        appearance = "filled",
        size = "small",
        leadingVisual,
        children,
        ...rest
    } = props as BadgeProps<"span">;

    // Two marks before one word is one more than the word needs, so a visual given by the caller
    // stands in the dot's place rather than beside it
    const showDot = appearance === "dot" && !leadingVisual;

    return (
        <Component
            ref={ref}
            className={classNames(badgeVariants({ size, variant, appearance }), className)}
            data-component="Badge"
            data-variant={variant}
            data-appearance={appearance}
            data-size={size}
            {...rest}
        >
            {leadingVisual ? (
                <span className={classes.visual} data-component="Badge.LeadingVisual">
                    {renderVisual(leadingVisual)}
                </span>
            ) : null}
            {/* The dot says the same thing the word beside it does, so it is left to the word
                rather than read out a second time */}
            {showDot ? <span aria-hidden="true" className={classes.indicator} /> : null}
            {children}
        </Component>
    );
}

Badge.displayName = "Badge";

export default fixedForwardRef(Badge);
