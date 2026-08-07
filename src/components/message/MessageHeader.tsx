import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { MessageHeaderProps } from "./Message.types";

const classes = {
    root: "message-header",
};

// The line above what was said: a name, a time, whichever of them the conversation needs. It is
// set in from the edge by as much as the words are, so it stands over the first letter of them
// rather than over the corner of the bubble they are on
function MessageHeader<As extends React.ElementType = "div">(
    props: MessageHeaderProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "div", className, ...rest } = props as MessageHeaderProps<"div">;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Message.Header"
            {...rest}
        />
    );
}

MessageHeader.displayName = "Message.Header";

export default fixedForwardRef(MessageHeader);
