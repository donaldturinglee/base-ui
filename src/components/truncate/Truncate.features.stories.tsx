import type { StoryFn } from "@storybook/react-vite";
import { ArrowLeftRegular, ArrowRightRegular } from "@gamecrafters/base-ui-icons";
import Truncate from "./Truncate";

const classes = {
    icon: "size-[var(--base-size-16)] align-top",
};

const text = "Some example text that runs past the end of the line";

export default {
    title: "Components/Truncate/Features",
    parameters: {
        layout: "centered",
    },
};

// Expandable
export const Expandable: StoryFn<typeof Truncate> = () => (
    <Truncate title={text} expandable>
        {text}
    </Truncate>
);

// Inline
export const Inline: StoryFn<typeof Truncate> = () => (
    <>
        <ArrowRightRegular className={classes.icon} />
        <Truncate title={text} inline>
            {text}
        </Truncate>
        <ArrowLeftRegular className={classes.icon} />
    </>
);

// Max Width
export const MaxWidth: StoryFn<typeof Truncate> = () => (
    <Truncate title={text} maxWidth={300}>
        {text}
    </Truncate>
);
