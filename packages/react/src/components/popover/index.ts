import PopoverBase from "./Popover";
import PopoverContent from "./PopoverContent";

export const Popover = Object.assign(PopoverBase, {
    Content: PopoverContent,
});

export { PopoverContent };
export { PopoverContext } from "./PopoverContext";
export * from "./Popover.types";
