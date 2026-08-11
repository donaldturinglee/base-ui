import { createContext } from "react";
import type { FlowContextValue } from "./Flow.types";

export const FlowContext = createContext<FlowContextValue>({});
