import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TopicTagProps } from "./TopicTag.types";

const classes = {
    root: "inline-flex items-center whitespace-nowrap px-[var(--base-size-12)] py-[var(--base-size-2)] rounded-[var(--border-radius-full)] bg-[var(--background-color-accent-muted)] [color:var(--foreground-color-accent)] [font-size:var(--text-body-size-small)] [font-weight:var(--base-text-weight-semibold)] [line-height:var(--text-body-line-height-small)] border-solid border-[length:var(--border-width-thin)] border-[color:var(--topic-tag-border-color)]",
    // Resets what an anchor and a button bring with them, so the tag looks the same however
    // it is rendered
    reset: "no-underline m-0 appearance-none text-start [font-family:inherit]",
    // Only a tag that leads somewhere reads as something to click
    interactive: "[&:is(a,button)]:cursor-pointer [&:is(a,button)]:select-none",
    hover: "hover:bg-[var(--background-color-accent-emphasis)] hover:[color:var(--foreground-color-on-emphasis)]",
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
            className={classNames(
                classes.root,
                classes.reset,
                classes.interactive,
                classes.hover,
                className,
            )}
            data-component="TopicTag"
            {...rest}
        />
    );
}

TopicTag.displayName = "TopicTag";

export default fixedForwardRef(TopicTag);
