import DialogBase from "./Dialog";
import DialogBody from "./DialogBody";
import DialogButtons from "./DialogButtons";
import DialogCloseButton from "./DialogCloseButton";
import DialogFooter from "./DialogFooter";
import DialogHeader from "./DialogHeader";
import DialogSubtitle from "./DialogSubtitle";
import DialogTitle from "./DialogTitle";

// The parts are here for custom renderers to build a header, body or footer of their
// own. There is no call for them otherwise
export const Dialog = Object.assign(DialogBase, {
    Header: DialogHeader,
    Title: DialogTitle,
    Subtitle: DialogSubtitle,
    Body: DialogBody,
    Footer: DialogFooter,
    Buttons: DialogButtons,
    CloseButton: DialogCloseButton,
});

export {
    DialogHeader,
    DialogTitle,
    DialogSubtitle,
    DialogBody,
    DialogFooter,
    DialogButtons,
    DialogCloseButton,
};
export { DialogContext } from "./DialogContext";
export * from "./Dialog.types";
