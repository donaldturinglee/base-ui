import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { MessageFooterProps } from "./Message.types";

const classes = {
    root: "message-footer",
};

// The line below what was said: whether it went, when it was read, what can be done about it. It
// is set in from the edge by as much as the words are, and it gathers to the side the message is
// on so it stays under the end of what was said rather than under the start of the row
function MessageFooter<As extends React.ElementType = "div">(
    props: MessageFooterProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "div", className, ...rest } = props as MessageFooterProps<"div">;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Message.Footer"
            {...rest}
        />
    );
}

MessageFooter.displayName = "Message.Footer";

export default fixedForwardRef(MessageFooter);
