import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { MessageAvatarProps } from "./Message.types";

const classes = {
    root: "message-avatar",
};

// Who said it. It holds whatever stands for the speaker — a picture, their initials, the mark of
// the thing that is talking — and gives it a round ground to sit on, so a set of speakers drawn
// from different sources still reads as one column down the edge of the conversation.
//
// It settles at the foot of the message rather than the head of it, beside the last thing said
// rather than the first, which is where the eye goes for who is speaking
function MessageAvatar<As extends React.ElementType = "div">(
    props: MessageAvatarProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "div", className, ...rest } = props as MessageAvatarProps<"div">;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Message.Avatar"
            {...rest}
        />
    );
}

MessageAvatar.displayName = "Message.Avatar";

export default fixedForwardRef(MessageAvatar);
