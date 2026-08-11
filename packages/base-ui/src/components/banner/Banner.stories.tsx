import type { StoryFn, Meta } from "@storybook/react-vite";
import { Link } from "../link";
import { Banner } from ".";
import type { BannerProps } from "./Banner.types";

const description = (
    <>
        Everyone reaching this repository is{" "}
        <Link inline href="#">
            now required
        </Link>{" "}
        to turn on two-factor authentication.
    </>
);

export default {
    title: "Components/Banner",
    component: Banner,
} as Meta<typeof Banner>;

export const Default: StoryFn<typeof Banner> = () => (
    <Banner
        title="Info"
        description={description}
        primaryAction={<Banner.PrimaryAction>Turn it on</Banner.PrimaryAction>}
        secondaryAction={<Banner.SecondaryAction>Read more</Banner.SecondaryAction>}
        onDismiss={() => {}}
    />
);

export const Playground: StoryFn<BannerProps> = (args) => (
    <Banner
        {...args}
        primaryAction={<Banner.PrimaryAction>Turn it on</Banner.PrimaryAction>}
        secondaryAction={<Banner.SecondaryAction>Read more</Banner.SecondaryAction>}
    />
);

Playground.args = {
    title: "Info",
    description:
        "Everyone reaching this repository is now required to turn on two-factor authentication.",
    variant: "info",
    layout: "default",
    actionsLayout: "default",
    hideTitle: false,
    flush: false,
};

Playground.argTypes = {
    title: {
        control: {
            type: "text",
        },
        description: "Names the region to a screen reader as well as titling it",
    },
    description: {
        control: {
            type: "text",
        },
        description: "Says more about the banner, below the title",
    },
    variant: {
        control: {
            type: "radio",
        },
        options: ["critical", "info", "success", "upsell", "warning"],
        description: "What the banner is telling the reader, which sets its colours and icon",
    },
    layout: {
        control: {
            type: "radio",
        },
        options: ["default", "compact"],
        description: "How much padding the banner is given",
    },
    actionsLayout: {
        control: {
            type: "radio",
        },
        options: ["default", "inline", "stacked"],
        description: "Where the actions stand in relation to the content",
    },
    hideTitle: {
        control: {
            type: "boolean",
        },
        description: "Keeps the title as the region's name while taking it off the screen",
    },
    flush: {
        control: {
            type: "boolean",
        },
        description: "Gives up the side borders and the corners, for a banner that spans its box",
    },
    onDismiss: {
        table: {
            disable: true,
        },
    },
    leadingVisual: {
        table: {
            disable: true,
        },
    },
    primaryAction: {
        table: {
            disable: true,
        },
    },
    secondaryAction: {
        table: {
            disable: true,
        },
    },
    children: {
        table: {
            disable: true,
        },
    },
};
