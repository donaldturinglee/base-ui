import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { RadioCardLeadingVisualProps } from "./RadioCard.types";

const classes = {
    root: "radio-card-leading-visual",
};

// The mark the card is led by, standing before the words rather than beside the radio. What it
// holds is drawn at the size the card sets, so a row of cards is led by marks of one size
function RadioCardLeadingVisual(
    props: RadioCardLeadingVisualProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, "aria-label": ariaLabel, ...rest } = props;

    return (
        <span
            ref={ref}
            // An unlabelled visual is decorative, so it stays out of the accessibility tree
            role={ariaLabel ? "img" : undefined}
            aria-label={ariaLabel}
            aria-hidden={ariaLabel ? undefined : true}
            className={classNames(classes.root, className)}
            data-component="RadioCard.LeadingVisual"
            {...rest}
        />
    );
}

RadioCardLeadingVisual.displayName = "RadioCard.LeadingVisual";

export default fixedForwardRef(RadioCardLeadingVisual);
