import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { StatisticCardValueProps } from "./StatisticCard.types";

const classes = {
    root: "statistic-card-value",
};

// The figure the card is for, drawn large enough to be read before anything else on it. The
// caller hands it over already shortened, since only they know whether their reader wants
// 1,284,000 or 1.28M
function StatisticCardValue(
    props: StatisticCardValueProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <span
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="StatisticCard.Value"
            {...rest}
        />
    );
}

StatisticCardValue.displayName = "StatisticCard.Value";

export default fixedForwardRef(StatisticCardValue);
