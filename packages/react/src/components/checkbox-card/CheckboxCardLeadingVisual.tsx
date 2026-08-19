import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { CheckboxCardLeadingVisualProps } from "./CheckboxCard.types";

const classes = {
    root: "checkbox-card-leading-visual",
};

// The mark the card is led by, standing before the words rather than beside the checkbox. What
// it holds is drawn at the size the card sets, so a row of cards is led by marks of one size
function CheckboxCardLeadingVisual(
    props: CheckboxCardLeadingVisualProps,
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
            data-component="CheckboxCard.LeadingVisual"
            {...rest}
        />
    );
}

CheckboxCardLeadingVisual.displayName = "CheckboxCard.LeadingVisual";

export default fixedForwardRef(CheckboxCardLeadingVisual);
