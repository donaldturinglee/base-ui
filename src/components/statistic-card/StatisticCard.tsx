import * as React from "react";
import { useId } from "../../hooks/useId";
import { useSlots } from "../../hooks/useSlots";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { StatisticCardContext } from "./StatisticCardContext";
import StatisticCardDescription from "./StatisticCardDescription";
import StatisticCardLabel from "./StatisticCardLabel";
import StatisticCardTrailingVisual from "./StatisticCardTrailingVisual";
import StatisticCardTrend from "./StatisticCardTrend";
import StatisticCardValue from "./StatisticCardValue";
import type { StatisticCardProps } from "./StatisticCard.types";

const classes = {
    root: "statistic-card",
    body: "statistic-card-body",
    figure: "statistic-card-figure",
};

// One headline figure drawn as a card: what is being measured, what it now stands at, and which
// way it has moved.
//
// The parts are held together as a group named after the card's own line, so a reader arriving
// at the figure is told what it counts rather than being left with a number on its own. A run of
// these cards is how a set of headline figures is shown, rather than a chart with one bar to
// each of them
function StatisticCard(
    props: StatisticCardProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        children,
        id: idProp,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        ...rest
    } = props;

    const id = useId(idProp);
    const labelId = `${id}-label`;

    const [slots, extras] = useSlots(children, {
        trailingVisual: StatisticCardTrailingVisual,
        label: StatisticCardLabel,
        value: StatisticCardValue,
        trend: StatisticCardTrend,
        description: StatisticCardDescription,
    });

    // The card is named after the line naming the figure, unless the caller has named it
    // themselves
    const labelledBy = ariaLabelledBy ?? (slots.label && !ariaLabel ? labelId : undefined);

    return (
        <StatisticCardContext.Provider value={{ labelId }}>
            <div
                ref={ref}
                id={idProp}
                // The parts are only worth grouping once there is a name to group them under: an
                // unnamed group says nothing but that it is one
                role={labelledBy || ariaLabel ? "group" : undefined}
                aria-label={ariaLabel}
                aria-labelledby={labelledBy}
                className={classNames(classes.root, className)}
                data-component="StatisticCard"
                {...rest}
            >
                <div className={classes.body}>
                    {slots.label}

                    {/* The figure and the way it has moved are read as one, so they stand
                        together on a line of their own */}
                    {slots.value || slots.trend ? (
                        <div className={classes.figure}>
                            {slots.value}
                            {slots.trend}
                        </div>
                    ) : null}

                    {slots.description}
                    {extras}
                </div>

                {/* The mark closes the row rather than leading it, so it is found in the same
                    place on every card in a run however long their lines happen to be */}
                {slots.trailingVisual}
            </div>
        </StatisticCardContext.Provider>
    );
}

StatisticCard.displayName = "StatisticCard";

export default fixedForwardRef(StatisticCard);
