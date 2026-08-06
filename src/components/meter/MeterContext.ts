import { createContext } from "react";
import type { MeterContextValue } from "./Meter.types";

export const MeterContext = createContext<MeterContextValue>({});
