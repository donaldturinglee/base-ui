import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { MessageGroupContext } from "./MessageGroupContext";
import type { MessageGroupProps } from "./Message.types";

const classes = {
    root: "message-group",
};

// A run of messages from one speaker, stacked close enough together to read as one turn in the
// conversation rather than as several.
//
// The side is named once, here, since a speaker does not change sides part way through a run.
// Each message takes it from the run unless it names one of its own
function MessageGroup<As extends React.ElementType = "div">(
    props: MessageGroupProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        align = "start",
        ...rest
    } = props as MessageGroupProps<"div">;

    return (
        <MessageGroupContext.Provider value={{ align }}>
            <Component
                ref={ref}
                className={classNames(classes.root, className)}
                data-component="Message.Group"
                data-align={align}
                {...rest}
            />
        </MessageGroupContext.Provider>
    );
}

MessageGroup.displayName = "Message.Group";

export default fixedForwardRef(MessageGroup);
