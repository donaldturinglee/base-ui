import {
    ArchiveRegular,
    CopyRegular,
    DeleteRegular,
    EditRegular,
} from "@gamecrafters/base-ui-icons";
import {
    ActionList,
    ActionMenu,
    Card,
    PINInput,
    SegmentedControl,
    Slider,
    Stack,
    Text,
} from "@gamecrafters/base-ui/react";

const classes = {
    // The specimens are laid out as many to a line as there is room for, and share out whatever
    // is left over rather than leaving a ragged end. The measure is the narrowest a tile can be
    // and still draw what stands in it at the size it was meant to be read at, which is what puts
    // all four on one line on a page as wide as the layout allows and folds them as it narrows
    grid: "grid grid-cols-[repeat(auto-fit,minmax(13.5rem,1fr))] gap-[var(--base-size-16)]",
    // A specimen is named rather than labelled: the name is what it would be imported under, so
    // it is set in the monospace stack the rest of the library sets code in
    name: "text-[var(--foreground-color-muted)] font-[family-name:var(--font-stack-monospace)]",
};

// A range that is dragged rather than typed. It runs the width of the tile, since a slider held
// to its content is a slider with nowhere to go
const slider = <Slider aria-label="Volume" defaultValue={64} block />;

// A code typed a character to a box. Four boxes rather than the six a one-time code usually runs
// to, so the specimen is read at the size the tile draws it rather than scrolled sideways
const pinInput = <PINInput aria-label="Verification code" length={4} />;

// One of a few, chosen by pressing the one wanted. What is being switched between is named the
// way a file would be looked at, since that is what the control is most often put to
const segmentedControl = (
    <SegmentedControl aria-label="File view">
        <SegmentedControl.Button defaultSelected>Preview</SegmentedControl.Button>
        <SegmentedControl.Button>Raw</SegmentedControl.Button>
    </SegmentedControl>
);

// What can be done to the thing the menu hangs off, gathered behind one press rather than laid
// out in the open. The last of them is set apart, since it is the one that cannot be undone
const actionMenu = (
    <ActionMenu>
        <ActionMenu.Button>Actions</ActionMenu.Button>
        <ActionMenu.Overlay>
            <ActionList>
                <ActionList.Item>
                    <ActionList.LeadingVisual>
                        <CopyRegular />
                    </ActionList.LeadingVisual>
                    Copy link
                </ActionList.Item>
                <ActionList.Item>
                    <ActionList.LeadingVisual>
                        <EditRegular />
                    </ActionList.LeadingVisual>
                    Rename
                </ActionList.Item>
                <ActionList.Item>
                    <ActionList.LeadingVisual>
                        <ArchiveRegular />
                    </ActionList.LeadingVisual>
                    Archive
                </ActionList.Item>
                <ActionList.Divider />
                <ActionList.Item variant="danger">
                    <ActionList.LeadingVisual>
                        <DeleteRegular />
                    </ActionList.LeadingVisual>
                    Delete
                </ActionList.Item>
            </ActionList>
        </ActionMenu.Overlay>
    </ActionMenu>
);

// The specimens, in the order they are read across: a control dragged, one typed into, one
// chosen from, and one that opens onto the rest. They are named as they would be imported, so a
// reader who wants one knows what to reach for
const specimens = [
    { name: "Slider", specimen: slider },
    { name: "PINInput", specimen: pinInput },
    { name: "SegmentedControl", specimen: segmentedControl },
    { name: "ActionMenu", specimen: actionMenu },
];

// The components themselves, working rather than written about. A reader deciding whether to
// build on the library is deciding what its components are like to use, and a page that only
// said so would be asking to be taken at its word: these are the library drawing itself, on the
// page that is trying to convince them.
//
// A tile is not a way in to anything, so none of them leads anywhere. The column of links beside
// every other page is where a component is looked up, and it names every one of them rather than
// the four that happen to stand here
const HomeShowcase = () => (
    <div className={classes.grid}>
        {specimens.map(({ name, specimen }) => (
            <Card key={name}>
                {/* The card is given its children rather than its parts, since what stands in
                    it is a working component and not a heading and a description */}
                <Stack gap="normal" align="stretch">
                    <Text size="small" className={classes.name}>
                        {name}
                    </Text>
                    {specimen}
                </Stack>
            </Card>
        ))}
    </div>
);

export default HomeShowcase;
