import { createContext } from "react";
import type { CodeBlockContextValue } from "./CodeBlock.types";

export const CodeBlockContext = createContext<CodeBlockContextValue>({});
