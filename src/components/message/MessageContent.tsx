import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { MessageContentProps } from "./Message.types";

const classes = {
    root: "message-content",
};

// What was said, and the lines above and below it that say who said it and what became of it.
// It takes the rest of the row once the speaker has been given their column, and everything
// stacked inside it keeps to the side the message is on
function MessageContent<As extends React.ElementType = "div">(
    props: MessageContentProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "div", className, ...rest } = props as MessageContentProps<"div">;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Message.Content"
            {...rest}
        />
    );
}

MessageContent.displayName = "Message.Content";

export default fixedForwardRef(MessageContent);
