import CollapsibleBase from "./Collapsible";
import CollapsiblePanel from "./CollapsiblePanel";
import CollapsibleTrigger from "./CollapsibleTrigger";

export const Collapsible = Object.assign(CollapsibleBase, {
    // Named as the root in its own right as well as by the compound itself, so either reads the
    // same and a set of disclosures written out in full is written the way it is read
    Root: CollapsibleBase,
    Trigger: CollapsibleTrigger,
    Panel: CollapsiblePanel,
    // What the panel was called before it was named for what the rest of the library calls the
    // same part. Kept so that anything written against the old name still draws
    Content: CollapsiblePanel,
});

export { CollapsibleTrigger, CollapsiblePanel, CollapsiblePanel as CollapsibleContent };
export { CollapsibleContext } from "./CollapsibleContext";
export * from "./Collapsible.types";
