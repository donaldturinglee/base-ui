import ProgressBarBase from "./ProgressBar";
import ProgressBarItem from "./ProgressBarItem";

export const ProgressBar = Object.assign(ProgressBarBase, {
    Item: ProgressBarItem,
});

export { ProgressBarItem };
export * from "./ProgressBar.types";
