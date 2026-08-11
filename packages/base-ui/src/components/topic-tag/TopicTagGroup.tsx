import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TopicTagGroupProps } from "./TopicTag.types";

const classes = {
    root: "topic-tag-group",
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
