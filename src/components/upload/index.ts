import UploadBase from "./Upload";
import UploadDescription from "./UploadDescription";
import UploadIcon from "./UploadIcon";
import UploadItem from "./UploadItem";
import UploadLabel from "./UploadLabel";
import UploadList from "./UploadList";

export const Upload = Object.assign(UploadBase, {
    Icon: UploadIcon,
    Label: UploadLabel,
    Description: UploadDescription,
    List: UploadList,
    Item: UploadItem,
});

export { UploadIcon, UploadLabel, UploadDescription, UploadList, UploadItem };
export { UploadContext } from "./UploadContext";
export { formatFileSize, isFileAccepted, triageFiles } from "./files";
export type { FileTriage, FileTriageOptions } from "./files";
export * from "./Upload.types";
