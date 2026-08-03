import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TopicTagProps } from "./TopicTag.types";

const classes = {
    // The reset for an anchor or a button travels with the root class, so the tag looks the
    // same however it is rendered
    root: "topic-tag",
    interactive: "topic-tag-interactive",
    hover: "topic-tag-hover",
};

function TopicTag<As extends React.ElementType = "a">(
    props: TopicTagProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "a", className, ...rest } = props as TopicTagProps<"a">;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, classes.interactive, classes.hover, className)}
            data-component="TopicTag"
            {...rest}
        />
    );
}

TopicTag.displayName = "TopicTag";

export default fixedForwardRef(TopicTag);
