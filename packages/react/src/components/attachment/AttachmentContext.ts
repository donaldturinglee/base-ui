import { createContext } from "react";
import type { AttachmentContextValue } from "./Attachment.types";

export const AttachmentContext = createContext<AttachmentContextValue>({});
