import { createContext } from "react";
import type { SelectContextValue } from "./Select.types";

export const SelectContext = createContext<SelectContextValue>({});
