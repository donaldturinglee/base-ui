import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TopicTagGroupProps } from "./TopicTag.types";

const classes = {
    // Tags wrap onto as many lines as they need, with more room between the lines than
    // between the tags on one
    root: "flex flex-wrap gap-x-[var(--base-size-2)] gap-y-[var(--base-size-8)]",
};

function TopicTagGroup<As extends React.ElementType = "div">(
    props: TopicTagGroupProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "div", className, ...rest } = props as TopicTagGroupProps<"div">;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="TopicTag.Group"
            {...rest}
        />
    );
}

TopicTagGroup.displayName = "TopicTag.Group";

export default fixedForwardRef(TopicTagGroup);
