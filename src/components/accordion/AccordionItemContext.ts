import { createContext } from "react";
import type { AccordionItemContextValue } from "./Accordion.types";

export const AccordionItemContext = createContext<AccordionItemContextValue>({});
