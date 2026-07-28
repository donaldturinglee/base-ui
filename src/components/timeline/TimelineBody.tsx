import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TimelineBodyProps } from "./Timeline.types";

const classes = {
    // The top margin sets the first line of text against the middle of the badge beside it
    root: "flex-auto min-w-0 max-w-full mt-[calc(var(--base-size-4)_+_1px)] [font-size:var(--text-body-size-medium)] [color:var(--foreground-color-muted)] [grid-area:body]",
};

function TimelineBody(
    props: TimelineBodyProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <div
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Timeline.Body"
            {...rest}
        />
    );
}

TimelineBody.displayName = "Timeline.Body";

export default fixedForwardRef(TimelineBody);
