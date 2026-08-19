import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { DismissRegular } from "@gamecrafters/base-ui-icons";
import { Button } from "../button";
import { Steps } from ".";

const classes = {
    // Gives the steps a container to lay themselves out against
    container: "w-[36rem]",
    // A column of steps asks for less room across than a row of them does
    column: "w-[20rem]",
    // Sets the buttons that move through the flow below the steps
    controls: "mt-6 flex gap-2",
};

const steps = [
    { title: "Create an account", description: "Pick a name and a password" },
    { title: "Add your details", description: "Tell us where to send things" },
    { title: "Start building", description: "Open your first project" },
];

export default {
    title: "Components/Steps/Features",
};

// Vertical, where each step has the room to say more than its title
export const Vertical: StoryFn<typeof Steps> = () => (
    <div className={classes.column}>
        <Steps currentStep={2} orientation="vertical" aria-label="Set up your project">
            {steps.map((step) => (
                <Steps.Item key={step.title}>
                    <Steps.Indicator />
                    <Steps.Body>
                        <Steps.Title>{step.title}</Steps.Title>
                        <Steps.Description>{step.description}</Steps.Description>
                    </Steps.Body>
                </Steps.Item>
            ))}
        </Steps>
    </div>
);

// Small, for a flow standing beside the work rather than above it
export const Small: StoryFn<typeof Steps> = () => (
    <div className={classes.container}>
        <Steps currentStep={2} size="small" aria-label="Set up your project">
            {steps.map((step) => (
                <Steps.Item key={step.title}>
                    <Steps.Indicator />
                    <Steps.Body>
                        <Steps.Title>{step.title}</Steps.Title>
                    </Steps.Body>
                </Steps.Item>
            ))}
        </Steps>
    </div>
);

// Not Started, where the flow has reached none of the steps yet
export const NotStarted: StoryFn<typeof Steps> = () => (
    <div className={classes.container}>
        <Steps currentStep={0} aria-label="Set up your project">
            {steps.map((step) => (
                <Steps.Item key={step.title}>
                    <Steps.Indicator />
                    <Steps.Body>
                        <Steps.Title>{step.title}</Steps.Title>
                    </Steps.Body>
                </Steps.Item>
            ))}
        </Steps>
    </div>
);

// Finished, where the flow has run past the last of them
export const Finished: StoryFn<typeof Steps> = () => (
    <div className={classes.container}>
        <Steps currentStep={steps.length + 1} aria-label="Set up your project">
            {steps.map((step) => (
                <Steps.Item key={step.title}>
                    <Steps.Indicator />
                    <Steps.Body>
                        <Steps.Title>{step.title}</Steps.Title>
                    </Steps.Body>
                </Steps.Item>
            ))}
        </Steps>
    </div>
);

// A Step Told Where It Stands, which keeps what it was told whatever the count says
export const AStepToldWhereItStands: StoryFn<typeof Steps> = () => (
    <div className={classes.column}>
        <Steps currentStep={3} orientation="vertical" aria-label="Publish your release">
            <Steps.Item>
                <Steps.Indicator />
                <Steps.Body>
                    <Steps.Title>Build the release</Steps.Title>
                </Steps.Body>
            </Steps.Item>
            <Steps.Item status="incomplete" statusLabel="Skipped">
                <Steps.Indicator>
                    <DismissRegular />
                </Steps.Indicator>
                <Steps.Body>
                    <Steps.Title>Run the smoke tests</Steps.Title>
                    <Steps.Description>Skipped for this release</Steps.Description>
                </Steps.Body>
            </Steps.Item>
            <Steps.Item>
                <Steps.Indicator />
                <Steps.Body>
                    <Steps.Title>Publish to the registry</Steps.Title>
                </Steps.Body>
            </Steps.Item>
        </Steps>
    </div>
);

// Moving Through The Flow, where the buttons below the steps say how far it has come
export const MovingThroughTheFlow: StoryFn<typeof Steps> = () => {
    const [currentStep, setCurrentStep] = React.useState(1);

    return (
        <div className={classes.container}>
            <Steps currentStep={currentStep} aria-label="Set up your project">
                {steps.map((step) => (
                    <Steps.Item key={step.title}>
                        <Steps.Indicator />
                        <Steps.Body>
                            <Steps.Title>{step.title}</Steps.Title>
                        </Steps.Body>
                    </Steps.Item>
                ))}
            </Steps>
            <div className={classes.controls}>
                <Button
                    disabled={currentStep <= 1}
                    onClick={() => setCurrentStep((step) => step - 1)}
                >
                    Back
                </Button>
                <Button
                    variant="primary"
                    disabled={currentStep > steps.length}
                    onClick={() => setCurrentStep((step) => step + 1)}
                >
                    {currentStep === steps.length ? "Finish" : "Next"}
                </Button>
            </div>
        </div>
    );
};
