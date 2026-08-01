import { createContext } from "react";
import type { UploadContextValue } from "./Upload.types";

export const UploadContext = createContext<UploadContextValue>({});
