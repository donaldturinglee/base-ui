import type { Decorator, StoryFn } from "@storybook/react-vite";
import { BookRegular, MoreHorizontalRegular, StarRegular } from "@gamecrafters/base-ui-icons";
import { Label } from "../label";
import { Link } from "../link";
import { Card } from ".";

const classes = {
    // Cards fill their container, so the stories give them one to fill
    container: "max-w-[25rem]",
    icon: "size-[var(--base-size-16)] shrink-0",
    list: "flex flex-col gap-[var(--stack-gap-condensed)] m-0 p-0 list-none",
    customContent: "flex flex-col gap-[var(--stack-gap-condensed)] [&>*]:m-0",
};

const withContainer: Decorator = (Story) => (
    <div className={classes.container}>
        <Story />
    </div>
);

export default {
    title: "Components/Card/Features",
    decorators: [withContainer],
};

// With Image
export const WithImage: StoryFn<typeof Card> = () => (
    <Card>
        <Card.Image src="https://github.com/octocat.png" alt="Octocat" />
        <Card.Heading>Card with Image</Card.Heading>
        <Card.Description>
            This card uses an edge to edge image instead of an icon.
        </Card.Description>
    </Card>
);

// Compact Layout
export const Compact: StoryFn<typeof Card> = () => (
    <Card layout="compact">
        <Card.Icon icon={BookRegular} />
        <Card.Heading>base-ui</Card.Heading>
        <Card.Description>
            The compact layout uses tighter spacing, an icon without a background container, and a
            smaller title.
        </Card.Description>
        <Card.Metadata>
            <StarRegular className={classes.icon} />
            1.2k stars
        </Card.Metadata>
    </Card>
);

// With Metadata
export const WithMetadata: StoryFn<typeof Card> = () => (
    <Card>
        <Card.Icon icon={BookRegular} />
        <Card.Heading>base-ui</Card.Heading>
        <Card.Description>
            A design system implemented as React components for building consistent interfaces.
        </Card.Description>
        <Card.Metadata>
            <StarRegular className={classes.icon} />
            1.2k stars
            <Label variant="accent">TypeScript</Label>
        </Card.Metadata>
    </Card>
);

// With Action
export const WithAction: StoryFn<typeof Card> = () => (
    <Card>
        <Card.Icon icon={BookRegular} />
        <Card.Heading>base-ui</Card.Heading>
        <Card.Description>
            A design system implemented as React components for building consistent interfaces.
        </Card.Description>
        <Card.Action>
            <Link as="button" aria-label="More options for base-ui">
                <MoreHorizontalRegular className={classes.icon} />
            </Link>
        </Card.Action>
    </Card>
);

// Padding Scale
export const PaddingScale: StoryFn<typeof Card> = () => (
    <ul className={classes.list}>
        {(["none", "condensed", "normal"] as const).map((padding) => (
            <li key={padding}>
                <Card padding={padding}>
                    <Card.Heading>{`padding="${padding}"`}</Card.Heading>
                </Card>
            </li>
        ))}
    </ul>
);

// Border Radius Scale
export const BorderRadiusScale: StoryFn<typeof Card> = () => (
    <ul className={classes.list}>
        {(["medium", "large"] as const).map((borderRadius) => (
            <li key={borderRadius}>
                <Card borderRadius={borderRadius}>
                    <Card.Heading>{`borderRadius="${borderRadius}"`}</Card.Heading>
                </Card>
            </li>
        ))}
    </ul>
);

// Custom Content
export const CustomContent: StoryFn<typeof Card> = () => (
    <Card>
        <div className={classes.customContent}>
            <h3>Custom Content Card</h3>
            <p>This card uses arbitrary content instead of the built in subcomponents.</p>
        </div>
    </Card>
);

// Standalone Section
export const StandaloneSection: StoryFn<typeof Card> = () => (
    <Card as="section">
        <Card.Icon icon={BookRegular} />
        <Card.Heading>base-ui</Card.Heading>
        <Card.Description>
            A standalone card renders as a labelled section landmark, named from its heading.
        </Card.Description>
    </Card>
);

// In A List
export const InAList: StoryFn<typeof Card> = () => (
    <ul className={classes.list} aria-label="Repositories">
        {["base-ui", "base-ui-icons", "base-ui-docs"].map((name) => (
            <li key={name}>
                <Card layout="compact">
                    <Card.Icon icon={BookRegular} />
                    <Card.Heading>{name}</Card.Heading>
                    <Card.Metadata>
                        <StarRegular className={classes.icon} />
                        1.2k stars
                    </Card.Metadata>
                </Card>
            </li>
        ))}
    </ul>
);
