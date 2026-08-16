import { createContext } from "react";
import type { AvatarContextValue } from "./Avatar.types";

export const AvatarContext = createContext<AvatarContextValue>({});
