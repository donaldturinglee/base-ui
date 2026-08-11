import { createContext } from "react";
import type { StatisticCardContextValue } from "./StatisticCard.types";

export const StatisticCardContext = createContext<StatisticCardContextValue>({});
