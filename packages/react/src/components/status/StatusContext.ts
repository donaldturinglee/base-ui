import { createContext } from "react";
import type { StatusContextValue } from "./Status.types";

export const StatusContext = createContext<StatusContextValue>({});
