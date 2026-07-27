import AccordionBase from "./Accordion";
import AccordionHeader from "./AccordionHeader";
import AccordionItem from "./AccordionItem";
import AccordionPanel from "./AccordionPanel";

export const Accordion = Object.assign(AccordionBase, {
    Item: AccordionItem,
    Header: AccordionHeader,
    Panel: AccordionPanel,
});

export { AccordionItem, AccordionHeader, AccordionPanel };
export { AccordionContext } from "./AccordionContext";
export { AccordionItemContext } from "./AccordionItemContext";
export * from "./Accordion.types";
