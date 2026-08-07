import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { StatisticCardContext } from "./StatisticCardContext";
import type { StatisticCardLabelProps } from "./StatisticCard.types";

const classes = {
    root: "statistic-card-label",
};

// Names what is being measured, in the words a reader would use for it rather than the ones the
// figure is stored under
function StatisticCardLabel(
    props: StatisticCardLabelProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, id, ...rest } = props;
    const { labelId } = React.useContext(StatisticCardContext);

    return (
        <span
            ref={ref}
            // The card is named after this line, so it takes the id the card is already pointing
            // at unless the caller has named one of their own
            id={id ?? labelId}
            className={classNames(classes.root, className)}
            data-component="StatisticCard.Label"
            {...rest}
        />
    );
}

StatisticCardLabel.displayName = "StatisticCard.Label";

export default fixedForwardRef(StatisticCardLabel);
