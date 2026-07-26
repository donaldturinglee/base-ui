import { createContext } from "react";
import type { CardContextValue } from "./Card.types";

export const CardContext = createContext<CardContextValue>({});
