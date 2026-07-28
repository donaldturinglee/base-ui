import { createContext } from "react";
import type { RadioGroupContextValue } from "./RadioGroup.types";

export const RadioGroupContext = createContext<RadioGroupContextValue>({});
