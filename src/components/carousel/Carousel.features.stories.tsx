import * as React from "react";
import type { Decorator, StoryFn } from "@storybook/react-vite";
import { Button } from "../button";
import { Card } from "../card";
import { Text } from "../text";
import { Carousel } from ".";

const classes = {
    // A carousel fills its container, so the stories give it one to fill
    container: "w-[var(--overlay-width-medium)] max-w-full",
    panel: "flex items-center justify-center h-[var(--base-size-128)] rounded-[var(--border-radius-medium)] bg-[var(--background-color-accent-muted)] [font-size:var(--text-title-size-small)] [font-weight:var(--base-text-weight-semibold)]",
    // A bar of the caller's own, with the steps pushed to either end of it
    spread: "justify-between",
    caption: "text-center [color:var(--foreground-color-muted)]",
};

const withContainer: Decorator = (Story) => (
    <div className={classes.container}>
        <Story />
    </div>
);

const slides = ["First slide", "Second slide", "Third slide", "Fourth slide"];

const Panel = ({ children }: React.PropsWithChildren) => (
    <div className={classes.panel}>{children}</div>
);

export default {
    title: "Components/Carousel/Features",
    decorators: [withContainer],
};

// Coming Round, where moving past either end of the run carries on rather than stopping
export const Loop: StoryFn = () => (
    <Carousel aria-label="Featured projects" loop>
        {slides.map((slide) => (
            <Carousel.Slide key={slide}>
                <Panel>{slide}</Panel>
            </Carousel.Slide>
        ))}
    </Carousel>
);

// Starting Part Way Along, rather than at the beginning of the run
export const DefaultIndex: StoryFn = () => (
    <Carousel aria-label="Featured projects" defaultIndex={2}>
        {slides.map((slide) => (
            <Carousel.Slide key={slide}>
                <Panel>{slide}</Panel>
            </Carousel.Slide>
        ))}
    </Carousel>
);

// Moving On By Itself, which holds still while a reader is on it and can be stopped for good
// from the button beside the dots
export const AutoPlay: StoryFn = () => (
    <Carousel aria-label="Featured projects" autoPlay interval={2500} loop>
        {slides.map((slide) => (
            <Carousel.Slide key={slide}>
                <Panel>{slide}</Panel>
            </Carousel.Slide>
        ))}
    </Carousel>
);

// Held By The Caller, where the carousel asks to be moved and the caller says where it lands
export const Controlled: StoryFn = () => {
    const [index, setIndex] = React.useState(0);

    return (
        <Carousel aria-label="Featured projects" index={index} onChange={setIndex} loop>
            {slides.map((slide) => (
                <Carousel.Slide key={slide}>
                    <Panel>{slide}</Panel>
                </Carousel.Slide>
            ))}
            <Text size="small" className={classes.caption}>
                Showing {index + 1} of {slides.length}
            </Text>
        </Carousel>
    );
};

// A Bar Of The Caller's Own, built from the carousel's own parts so that the steps and the
// dots still know what to move
export const CustomControls: StoryFn = () => (
    <Carousel aria-label="Featured projects" loop>
        {slides.map((slide) => (
            <Carousel.Slide key={slide}>
                <Panel>{slide}</Panel>
            </Carousel.Slide>
        ))}
        <Carousel.Controls className={classes.spread}>
            <Carousel.PreviousButton />
            <Carousel.Indicators />
            <Carousel.NextButton />
        </Carousel.Controls>
    </Carousel>
);

// Only The Dots, for a short run that says everything it needs to with them
export const IndicatorsOnly: StoryFn = () => (
    <Carousel aria-label="Featured projects">
        {slides.map((slide) => (
            <Carousel.Slide key={slide}>
                <Panel>{slide}</Panel>
            </Carousel.Slide>
        ))}
        <Carousel.Controls>
            <Carousel.Indicators />
        </Carousel.Controls>
    </Carousel>
);

// Slides Holding More Than A Picture, where everything on the slide being shown can be
// reached and everything on the ones either side of it is out of the way
export const WithCards: StoryFn = () => (
    <Carousel aria-label="Repositories" loop>
        {slides.map((slide) => (
            <Carousel.Slide key={slide}>
                <Card>
                    <Card.Heading>{slide}</Card.Heading>
                    <Card.Description>
                        Only the slide being shown can be tabbed into, so the button below is
                        reached once its slide comes round.
                    </Card.Description>
                    <Card.Action>
                        <Button>Open {slide}</Button>
                    </Card.Action>
                </Card>
            </Carousel.Slide>
        ))}
    </Carousel>
);
