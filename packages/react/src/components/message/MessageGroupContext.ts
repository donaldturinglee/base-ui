import { createContext } from "react";
import type { MessageGroupContextValue } from "./Message.types";

export const MessageGroupContext = createContext<MessageGroupContextValue>({});
