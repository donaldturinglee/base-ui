import AttachmentBase from "./Attachment";
import AttachmentAction from "./AttachmentAction";
import AttachmentActions from "./AttachmentActions";
import AttachmentContent from "./AttachmentContent";
import AttachmentDescription from "./AttachmentDescription";
import AttachmentGroup from "./AttachmentGroup";
import AttachmentMedia from "./AttachmentMedia";
import AttachmentTitle from "./AttachmentTitle";
import AttachmentTrigger from "./AttachmentTrigger";

export const Attachment = Object.assign(AttachmentBase, {
    Group: AttachmentGroup,
    Media: AttachmentMedia,
    Content: AttachmentContent,
    Title: AttachmentTitle,
    Description: AttachmentDescription,
    Actions: AttachmentActions,
    Action: AttachmentAction,
    Trigger: AttachmentTrigger,
});

export {
    AttachmentGroup,
    AttachmentMedia,
    AttachmentContent,
    AttachmentTitle,
    AttachmentDescription,
    AttachmentActions,
    AttachmentAction,
    AttachmentTrigger,
};
export { AttachmentContext } from "./AttachmentContext";
export * from "./Attachment.types";
