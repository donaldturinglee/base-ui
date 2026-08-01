import DrawerBase from "./Drawer";
import DrawerBody from "./DrawerBody";
import DrawerCloseButton from "./DrawerCloseButton";
import DrawerFooter from "./DrawerFooter";
import DrawerHeader from "./DrawerHeader";
import DrawerSubtitle from "./DrawerSubtitle";
import DrawerTitle from "./DrawerTitle";

export const Drawer = Object.assign(DrawerBase, {
    Header: DrawerHeader,
    Title: DrawerTitle,
    Subtitle: DrawerSubtitle,
    Body: DrawerBody,
    Footer: DrawerFooter,
    CloseButton: DrawerCloseButton,
});

export { DrawerHeader, DrawerTitle, DrawerSubtitle, DrawerBody, DrawerFooter, DrawerCloseButton };
export { DrawerContext } from "./DrawerContext";
export * from "./Drawer.types";
