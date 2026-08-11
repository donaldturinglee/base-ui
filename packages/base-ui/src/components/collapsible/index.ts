import CollapsibleBase from "./Collapsible";
import CollapsibleContent from "./CollapsibleContent";
import CollapsibleTrigger from "./CollapsibleTrigger";

export const Collapsible = Object.assign(CollapsibleBase, {
    Trigger: CollapsibleTrigger,
    Content: CollapsibleContent,
});

export { CollapsibleTrigger, CollapsibleContent };
export { CollapsibleContext } from "./CollapsibleContext";
export * from "./Collapsible.types";
