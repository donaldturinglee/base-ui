import MessageBase from "./Message";
import MessageAvatar from "./MessageAvatar";
import MessageContent from "./MessageContent";
import MessageFooter from "./MessageFooter";
import MessageGroup from "./MessageGroup";
import MessageHeader from "./MessageHeader";

export const Message = Object.assign(MessageBase, {
    Group: MessageGroup,
    Avatar: MessageAvatar,
    Content: MessageContent,
    Header: MessageHeader,
    Footer: MessageFooter,
});

export { MessageGroup, MessageAvatar, MessageContent, MessageHeader, MessageFooter };
export { MessageContext } from "./MessageContext";
export { MessageGroupContext } from "./MessageGroupContext";
export * from "./Message.types";
