import FileUploadBase from "./FileUpload";
import FileUploadDescription from "./FileUploadDescription";
import FileUploadIcon from "./FileUploadIcon";
import FileUploadItem from "./FileUploadItem";
import FileUploadLabel from "./FileUploadLabel";
import FileUploadList from "./FileUploadList";

export const FileUpload = Object.assign(FileUploadBase, {
    Icon: FileUploadIcon,
    Label: FileUploadLabel,
    Description: FileUploadDescription,
    List: FileUploadList,
    Item: FileUploadItem,
});

export { FileUploadIcon, FileUploadLabel, FileUploadDescription, FileUploadList, FileUploadItem };
export { FileUploadContext } from "./FileUploadContext";
export { formatFileSize, isFileAccepted, triageFiles } from "./files";
export type { FileTriage, FileTriageOptions } from "./files";
export * from "./FileUpload.types";
