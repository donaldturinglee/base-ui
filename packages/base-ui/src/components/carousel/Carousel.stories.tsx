import type { Decorator, StoryFn, Meta } from "@storybook/react-vite";
import { Carousel } from ".";
import type { CarouselProps } from "./Carousel.types";

const classes = {
    // A carousel fills its container, so the stories give it one to fill
    container: "w-[var(--overlay-width-medium)] max-w-full",
    panel: "flex items-center justify-center h-[var(--base-size-128)] rounded-[var(--border-radius-medium)] bg-background-accent-muted [font-size:var(--text-title-size-small)] [font-weight:var(--base-text-weight-semibold)]",
};

const withContainer: Decorator = (Story) => (
    <div className={classes.container}>
        <Story />
    </div>
);

const slides = ["First slide", "Second slide", "Third slide"];

export default {
    title: "Components/Carousel",
    component: Carousel,
    decorators: [withContainer],
} as Meta<typeof Carousel>;

export const Default: StoryFn<typeof Carousel> = () => (
    <Carousel aria-label="Featured projects">
        {slides.map((slide) => (
            <Carousel.Slide key={slide}>
                <div className={classes.panel}>{slide}</div>
            </Carousel.Slide>
        ))}
    </Carousel>
);

export const Playground: StoryFn<CarouselProps> = (args) => (
    <Carousel {...args}>
        {slides.map((slide) => (
            <Carousel.Slide key={slide}>
                <div className={classes.panel}>{slide}</div>
            </Carousel.Slide>
        ))}
    </Carousel>
);

Playground.args = {
    "aria-label": "Featured projects",
    defaultIndex: 0,
    loop: false,
    autoPlay: false,
    interval: 5000,
};

Playground.argTypes = {
    defaultIndex: {
        control: {
            type: "number",
        },
        description: "Which slide the run starts on",
    },
    loop: {
        control: {
            type: "boolean",
        },
        description: "Whether moving past either end comes round to the other",
    },
    autoPlay: {
        control: {
            type: "boolean",
        },
        description: "Moves on by itself, and holds still while a reader is on it",
    },
    interval: {
        control: {
            type: "number",
        },
        description: "How long each slide is held before the next one, in milliseconds",
    },
    index: {
        table: {
            disable: true,
        },
    },
    onChange: {
        table: {
            disable: true,
        },
    },
};
