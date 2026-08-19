import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { StatisticCardDescriptionProps } from "./StatisticCard.types";

const classes = {
    root: "statistic-card-description",
};

// What the figure has to be read against: the stretch it covers, or what it is being compared
// with
function StatisticCardDescription(
    props: StatisticCardDescriptionProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <span
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="StatisticCard.Description"
            {...rest}
        />
    );
}

StatisticCardDescription.displayName = "StatisticCard.Description";

export default fixedForwardRef(StatisticCardDescription);
