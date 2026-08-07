import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { DetailsSummaryProps } from "./Details.types";

const classes = {
    root: "details-summary",
};

// What the disclosure is opened and closed from, and the one part of it that is always read
function DetailsSummary<As extends React.ElementType = "summary">(
    props: DetailsSummaryProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as, className, ...rest } = props as DetailsSummaryProps<"summary">;

    const Component: React.ElementType = as ?? "summary";
    // Whatever it is rendered as is still a summary in the end, since that is the element
    // the disclosure around it opens and closes from
    const asSummary = Component === "summary" ? {} : { as: "summary" };

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Details.Summary"
            {...asSummary}
            {...rest}
        />
    );
}

DetailsSummary.displayName = "Details.Summary";

export default fixedForwardRef(DetailsSummary);
