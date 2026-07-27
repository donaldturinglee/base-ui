import type { StoryFn, Meta } from "@storybook/react-vite";
import { Accordion } from ".";
import type { AccordionProps } from "./Accordion.types";

const classes = {
    // The accordion fills its container, so the stories give it one to fill
    container: "w-[28rem]",
};

const sections = [
    {
        value: "billing",
        heading: "Billing",
        body: "Change the card the account is billed to, and see what has been charged to it.",
    },
    {
        value: "notifications",
        heading: "Notifications",
        body: "Choose what you hear about, and whether it reaches you by email or on the site.",
    },
    {
        value: "security",
        heading: "Security",
        body: "Review the devices signed in to the account and the keys that can reach it.",
    },
];

export default {
    title: "Components/Accordion",
    component: Accordion,
} as Meta<typeof Accordion>;

export const Default: StoryFn<typeof Accordion> = () => (
    <div className={classes.container}>
        <Accordion>
            {sections.map((section) => (
                <Accordion.Item key={section.value} value={section.value}>
                    <Accordion.Header>{section.heading}</Accordion.Header>
                    <Accordion.Panel>{section.body}</Accordion.Panel>
                </Accordion.Item>
            ))}
        </Accordion>
    </div>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<AccordionProps> = (args) => (
    <div className={classes.container}>
        <Accordion {...args}>
            {sections.map((section) => (
                <Accordion.Item key={section.value} value={section.value}>
                    <Accordion.Header>{section.heading}</Accordion.Header>
                    <Accordion.Panel>{section.body}</Accordion.Panel>
                </Accordion.Item>
            ))}
        </Accordion>
    </div>
);

Playground.args = {
    defaultValue: ["billing"],
    multiple: false,
    disabled: false,
    headingLevel: "h3",
};

Playground.argTypes = {
    defaultValue: {
        control: {
            type: "check",
        },
        options: sections.map((section) => section.value),
        description: "Which items start out open, where the accordion holds the state itself",
    },
    multiple: {
        control: {
            type: "boolean",
        },
        description: "Whether more than one item can stand open at once",
    },
    disabled: {
        control: {
            type: "boolean",
        },
        description: "Stops every item being opened or closed",
    },
    headingLevel: {
        control: {
            type: "radio",
        },
        options: ["h2", "h3", "h4", "h5", "h6"],
        description: "What each header is as a heading",
    },
    value: {
        table: {
            disable: true,
        },
    },
    ref: {
        table: {
            disable: true,
        },
    },
};

Playground.parameters = {
    layout: "centered",
};
