import * as React from "react";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { MessageContext } from "./MessageContext";
import { MessageGroupContext } from "./MessageGroupContext";
import type { MessageAlign, MessageProps } from "./Message.types";

const messageVariants = cva("message", {
    variants: {
        align: {
            start: "message-align-start",
            end: "message-align-end",
        } satisfies Record<MessageAlign, string>,
    },
});

// One message in a conversation, with whoever said it standing beside it.
//
//     <Message>
//         <Message.Avatar>
//             <Avatar size={32}>
//                 <Avatar.Image src={source} />
//             </Avatar>
//         </Message.Avatar>
//         <Message.Content>
//             <Message.Header>Ada</Message.Header>
//             <Bubble variant="muted">
//                 <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
//             </Bubble>
//         </Message.Content>
//     </Message>
//
// The message is the row: who said it at one end, what they said filling the rest. A message from
// the other side of the conversation is laid out from the other end rather than written in a
// different order, so the same markup serves both speakers and only the side changes.
//
// The side is handed down rather than repeated: a bubble inside a message comes down the side the
// message is on without being told it a second time, which is what keeps a long thread from
// having the same word written on every turn in it
function Message<As extends React.ElementType = "div">(
    props: MessageProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "div", className, align, ...rest } = props as MessageProps<"div">;

    const { align: groupAlign } = React.useContext(MessageGroupContext);

    // A message comes down the side its run comes down, unless it says otherwise itself
    const resolvedAlign = align ?? groupAlign ?? "start";

    const context = { align: resolvedAlign };

    return (
        <MessageContext.Provider value={context}>
            <Component
                ref={ref}
                className={classNames(messageVariants({ align: resolvedAlign }), className)}
                data-component="Message"
                data-align={resolvedAlign}
                {...rest}
            />
        </MessageContext.Provider>
    );
}

Message.displayName = "Message";

export default fixedForwardRef(Message);
