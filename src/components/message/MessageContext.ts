import { createContext } from "react";
import type { MessageContextValue } from "./Message.types";

export const MessageContext = createContext<MessageContextValue>({});
