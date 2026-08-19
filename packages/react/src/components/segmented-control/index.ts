import SegmentedControlBase from "./SegmentedControl";
import SegmentedControlButton from "./SegmentedControlButton";
import SegmentedControlIconButton from "./SegmentedControlIconButton";

export const SegmentedControl = Object.assign(SegmentedControlBase, {
    Button: SegmentedControlButton,
    IconButton: SegmentedControlIconButton,
});

export { SegmentedControlButton, SegmentedControlIconButton };
export * from "./SegmentedControl.types";
