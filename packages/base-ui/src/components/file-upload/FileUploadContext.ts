import { createContext } from "react";
import type { FileUploadContextValue } from "./FileUpload.types";

export const FileUploadContext = createContext<FileUploadContextValue>({});
