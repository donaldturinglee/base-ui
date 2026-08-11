import type { StoryFn, Meta } from "@storybook/react-vite";
import { Steps } from ".";
import type { StepsProps } from "./Steps.types";

const classes = {
    // Gives the steps a container to lay themselves out against
    container: "w-[36rem]",
};

const titles = ["Create an account", "Add your details", "Start building"];

export default {
    title: "Components/Steps",
    component: Steps,
} as Meta<typeof Steps>;

export const Default: StoryFn<typeof Steps> = () => (
    <div className={classes.container}>
        <Steps currentStep={2} aria-label="Set up your project">
            {titles.map((title) => (
                <Steps.Item key={title}>
                    <Steps.Indicator />
                    <Steps.Body>
                        <Steps.Title>{title}</Steps.Title>
                    </Steps.Body>
                </Steps.Item>
            ))}
        </Steps>
    </div>
);

export const Playground: StoryFn<StepsProps> = (args) => (
    <div className={classes.container}>
        <Steps {...args} aria-label="Set up your project">
            {titles.map((title) => (
                <Steps.Item key={title}>
                    <Steps.Indicator />
                    <Steps.Body>
                        <Steps.Title>{title}</Steps.Title>
                    </Steps.Body>
                </Steps.Item>
            ))}
        </Steps>
    </div>
);

Playground.args = {
    currentStep: 2,
    orientation: "horizontal",
    size: "medium",
};

Playground.argTypes = {
    currentStep: {
        control: {
            type: "number",
            min: 0,
            max: 4,
            step: 1,
        },
        description: "Which step the flow has reached, counted from one",
    },
    orientation: {
        control: {
            type: "radio",
        },
        options: ["horizontal", "vertical"],
        description: "Which way the steps run",
    },
    size: {
        control: {
            type: "radio",
        },
        options: ["small", "medium"],
        description: "How big the steps are drawn",
    },
    children: {
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
