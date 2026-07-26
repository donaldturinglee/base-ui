import type { Decorator, StoryFn } from "@storybook/react-vite";
import { BookRegular } from "@gamecrafters/base-ui-icons";
import { Link } from "../link";
import { Blankslate } from ".";

const classes = {
    icon: "size-[var(--base-size-24)]",
    // The blankslate reads the width of its container, so a narrow one shows the tighter
    // layout without touching the viewport
    constrained: "max-w-[30rem]",
};

const content = (
    <>
        <Blankslate.Visual>
            <BookRegular className={classes.icon} />
        </Blankslate.Visual>
        <Blankslate.Heading>Welcome to the wiki</Blankslate.Heading>
        <Blankslate.Description>
            Wikis give your project a place to lay out its roadmap and document the work.
        </Blankslate.Description>
    </>
);

const withActions = (
    <>
        {content}
        <Blankslate.PrimaryAction>
            <Link as="button">Create the first page</Link>
        </Blankslate.PrimaryAction>
        <Blankslate.SecondaryAction href="#">Learn more about wikis</Blankslate.SecondaryAction>
    </>
);

export default {
    title: "Components/Blankslate/Features",
};

// Small Size
export const SizeSmall: StoryFn<typeof Blankslate> = () => (
    <Blankslate size="small">{withActions}</Blankslate>
);

// Large Size
export const SizeLarge: StoryFn<typeof Blankslate> = () => (
    <Blankslate size="large">{withActions}</Blankslate>
);

// Bordered
export const Border: StoryFn<typeof Blankslate> = () => (
    <Blankslate border>{withActions}</Blankslate>
);

// Narrow
export const Narrow: StoryFn<typeof Blankslate> = () => (
    <Blankslate narrow border>
        {withActions}
    </Blankslate>
);

// Spacious
export const Spacious: StoryFn<typeof Blankslate> = () => (
    <Blankslate spacious border>
        {withActions}
    </Blankslate>
);

// Without Actions
export const WithoutActions: StoryFn<typeof Blankslate> = () => (
    <Blankslate border>{content}</Blankslate>
);

// In A Constrained Container, where the tighter layout takes over
const withConstrainedContainer: Decorator = (Story) => (
    <div className={classes.constrained}>
        <Story />
    </div>
);

export const InAConstrainedContainer: StoryFn<typeof Blankslate> = () => (
    <Blankslate border>{withActions}</Blankslate>
);

InAConstrainedContainer.decorators = [withConstrainedContainer];
