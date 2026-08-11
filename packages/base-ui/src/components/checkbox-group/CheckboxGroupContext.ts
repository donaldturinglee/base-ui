import { createContext } from "react";
import type { CheckboxGroupContextValue } from "./CheckboxGroup.types";

export const CheckboxGroupContext = createContext<CheckboxGroupContextValue>({});
