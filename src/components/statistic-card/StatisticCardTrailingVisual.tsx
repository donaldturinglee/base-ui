import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { StatisticCardTrailingVisualProps } from "./StatisticCard.types";

const classes = {
    root: "statistic-card-trailing-visual",
};

// The mark the card is closed by, standing after the words rather than beside the figure. It is
// held at the end of the row, so a run of cards carries its marks down one edge rather than at
// the front of lines of different lengths, and what it holds is drawn at the size the card sets
function StatisticCardTrailingVisual(
    props: StatisticCardTrailingVisualProps,
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
            data-component="StatisticCard.TrailingVisual"
            {...rest}
        />
    );
}

StatisticCardTrailingVisual.displayName = "StatisticCard.TrailingVisual";

export default fixedForwardRef(StatisticCardTrailingVisual);
