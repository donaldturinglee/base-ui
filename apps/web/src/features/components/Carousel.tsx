import * as React from "react";
import {
    Button,
    Card,
    Carousel as CarouselComponent,
    Heading,
    Stack,
    Text,
} from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // A carousel fills whatever it was put in, so the page gives it something to fill rather than
    // running a strip of slides the whole way across the card
    preview: "w-full max-w-[30rem]",
    // What each slide holds, standing in for whatever an application would put on one: a picture,
    // a card, a panel of its own. It is given a height, since a slide holding nothing taller than a
    // line of words would leave the run with nothing to look at
    panel: "flex h-[var(--base-size-128)] items-center justify-center rounded-[var(--border-radius-medium)] bg-[var(--background-color-accent-muted)] font-semibold",
    // A bar of the caller's own, with the two steps pushed to either end of it
    spread: "justify-between",
    // The line under the bar, which is an aside to the run rather than a part of it
    caption: "text-center text-[var(--foreground-color-muted)]",
};

// What every example is a run of. The slides are written once and read out into each of them, since
// what the examples are about is the run around the slides rather than what is on them, and slides
// that changed between examples would be read as though they were the point
const slides = ["First slide", "Second slide", "Third slide", "Fourth slide"];

const panels = slides.map((slide) => (
    <CarouselComponent.Slide key={slide}>
        <div className={classes.panel}>{slide}</div>
    </CarouselComponent.Slide>
));

// What the examples have to have in hand before they can be drawn: what a slide holds, and the run
// of them. They are written once and reached for by each example rather than run out along lines
// that would then have to be read across
const setup = `const panel =
    "flex h-[var(--base-size-128)] items-center justify-center " +
    "rounded-[var(--border-radius-medium)] bg-[var(--background-color-accent-muted)] font-semibold";

const slides = ["First slide", "Second slide", "Third slide", "Fourth slide"];`;

// The plainest carousel there is: the slides, and the bar the carousel draws beneath them where it
// is handed no bar of its own. It keeps which slide is showing for itself, since nothing was handed
// it to hold, and stops at either end rather than coming round.
//
// It is named, which is the one thing a carousel cannot be drawn without: it is a landmark of its
// own, so a reader arriving at it by landmark has to be told what they have arrived at.
//
// The width it is held to is the page's own furniture, as the card around it is, so the listing
// beneath is of the carousel alone: standing in an application it fills whatever it was put in.
//
// The page and the component it is about are both called Carousel, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Carousel, as an application
// importing it would
const defaultPreview = (
    <Stack className={classes.preview}>
        <CarouselComponent aria-label="Featured projects">{panels}</CarouselComponent>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Carousel aria-label="Featured projects">
    {slides.map((slide) => (
        <Carousel.Slide key={slide}>
            <div className={panel}>{slide}</div>
        </Carousel.Slide>
    ))}
</Carousel>`;

// A run that comes round, where moving past either end carries on rather than stopping. Neither
// step is ever stopped, since there is always somewhere to go
const loopPreview = (
    <Stack className={classes.preview}>
        <CarouselComponent aria-label="Featured projects" loop>
            {panels}
        </CarouselComponent>
    </Stack>
);

const loopCode = `<Carousel aria-label="Featured projects" loop>
    {slides.map((slide) => (
        <Carousel.Slide key={slide}>
            <div className={panel}>{slide}</div>
        </Carousel.Slide>
    ))}
</Carousel>`;

// A run opened part way along rather than at its beginning, for a carousel arriving at whatever the
// reader was last on
const defaultIndexPreview = (
    <Stack className={classes.preview}>
        <CarouselComponent aria-label="Featured projects" defaultIndex={2}>
            {panels}
        </CarouselComponent>
    </Stack>
);

const defaultIndexCode = `<Carousel aria-label="Featured projects" defaultIndex={2}>
    {slides.map((slide) => (
        <Carousel.Slide key={slide}>
            <div className={panel}>{slide}</div>
        </Carousel.Slide>
    ))}
</Carousel>`;

// A run that moves on by itself. It holds still while a reader is on it, and the button beside the
// dots stops it for good, which is what a carousel that moves without being asked to has to carry
const autoPlayPreview = (
    <Stack className={classes.preview}>
        <CarouselComponent aria-label="Featured projects" autoPlay interval={2500} loop>
            {panels}
        </CarouselComponent>
    </Stack>
);

const autoPlayCode = `<Carousel aria-label="Featured projects" autoPlay interval={2500} loop>
    {slides.map((slide) => (
        <Carousel.Slide key={slide}>
            <div className={panel}>{slide}</div>
        </Carousel.Slide>
    ))}
</Carousel>`;

// The carousel with which slide is showing held by whoever is drawing it rather than by the
// carousel. It is a component of its own rather than an element the page holds ready, since the
// slide has to be kept somewhere for it to be handed back down.
//
// What the caller does with it is the reason for holding it at all, so it is put to use beside the
// run: the line beneath counts the run off, and it stands inside the carousel rather than under it,
// since anything handed to a carousel that is not a slide or a bar stands below the bar
const ControlledPreview = () => {
    const [index, setIndex] = React.useState(0);

    return (
        <Stack className={classes.preview}>
            <CarouselComponent
                aria-label="Featured projects"
                index={index}
                onChange={setIndex}
                loop
            >
                {panels}
                <Text size="small" className={classes.caption}>
                    Showing {index + 1} of {slides.length}
                </Text>
            </CarouselComponent>
        </Stack>
    );
};

// What the example has to have in hand. The carousel is told which slide is showing rather than
// keeping it, so the slide is the caller's and is got ready here
const controlledSetup = `${setup}

const [index, setIndex] = React.useState(0);`;

const controlledCode = `<Carousel aria-label="Featured projects" index={index} onChange={setIndex} loop>
    {slides.map((slide) => (
        <Carousel.Slide key={slide}>
            <div className={panel}>{slide}</div>
        </Carousel.Slide>
    ))}
    <Text size="small" className="text-center text-[var(--foreground-color-muted)]">
        Showing {index + 1} of {slides.length}
    </Text>
</Carousel>`;

// A bar of the caller's own, built out of the carousel's own parts so that the steps and the dots
// still know what it is they are moving. Here the two steps are pushed to either end of the bar and
// the dots left in the middle of it
const customControlsPreview = (
    <Stack className={classes.preview}>
        <CarouselComponent aria-label="Featured projects" loop>
            {panels}
            <CarouselComponent.Controls className={classes.spread}>
                <CarouselComponent.PreviousButton />
                <CarouselComponent.Indicators />
                <CarouselComponent.NextButton />
            </CarouselComponent.Controls>
        </CarouselComponent>
    </Stack>
);

const customControlsCode = `<Carousel aria-label="Featured projects" loop>
    {slides.map((slide) => (
        <Carousel.Slide key={slide}>
            <div className={panel}>{slide}</div>
        </Carousel.Slide>
    ))}
    <Carousel.Controls className="justify-between">
        <Carousel.PreviousButton />
        <Carousel.Indicators />
        <Carousel.NextButton />
    </Carousel.Controls>
</Carousel>`;

// Only the dots, for a short run that says everything it has to with them. The bar is handed
// children, so what it would have held is left out rather than hidden
const indicatorsOnlyPreview = (
    <Stack className={classes.preview}>
        <CarouselComponent aria-label="Featured projects">
            {panels}
            <CarouselComponent.Controls>
                <CarouselComponent.Indicators />
            </CarouselComponent.Controls>
        </CarouselComponent>
    </Stack>
);

const indicatorsOnlyCode = `<Carousel aria-label="Featured projects">
    {slides.map((slide) => (
        <Carousel.Slide key={slide}>
            <div className={panel}>{slide}</div>
        </Carousel.Slide>
    ))}
    <Carousel.Controls>
        <Carousel.Indicators />
    </Carousel.Controls>
</Carousel>`;

// Slides holding more than a picture, where everything on the slide being shown can be reached and
// everything on the slides either side of it is out of the way. The cards are written out rather
// than read out of the run every other example uses, since what is on the slide is the point here
const cardsPreview = (
    <Stack className={classes.preview}>
        <CarouselComponent aria-label="Repositories" loop>
            {slides.map((slide) => (
                <CarouselComponent.Slide key={slide}>
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
                </CarouselComponent.Slide>
            ))}
        </CarouselComponent>
    </Stack>
);

const cardsCode = `<Carousel aria-label="Repositories" loop>
    {slides.map((slide) => (
        <Carousel.Slide key={slide}>
            <Card>
                <Card.Heading>{slide}</Card.Heading>
                <Card.Description>
                    Only the slide being shown can be tabbed into, so the button below is reached
                    once its slide comes round.
                </Card.Description>
                <Card.Action>
                    <Button>Open {slide}</Button>
                </Card.Action>
            </Card>
        </Carousel.Slide>
    ))}
</Carousel>`;

// The carousel as it is reached for, drawn and written out one above the other. The plainest one
// comes first, then how the run is stepped through, then who holds where it stands, and last what
// the bar and the slides are made of
const examples: ComponentExample[] = [
    {
        name: "Default",
        setup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Coming round",
        description:
            "Moving past either end of the run carries on to the other rather than stopping there. Where a run does not come round, the step that would lead off the end is stopped rather than left to be pressed, and a run moving on by itself stops at the last slide instead of holding on one that is never going to change.",
        setup,
        preview: loopPreview,
        code: loopCode,
    },
    {
        name: "Starting part way along",
        description:
            "Which slide the run opens on, where the carousel keeps hold of it itself. It is what a carousel arriving at whatever the reader was last on wants; where the slide has to be moved from elsewhere on the page as well, index is what to reach for in its place.",
        setup,
        preview: defaultIndexPreview,
        code: defaultIndexCode,
    },
    {
        name: "Moving on by itself",
        description:
            "A run that steps on without being asked to. It holds still while a reader is on it, whether they arrived with the pointer or with the keyboard, and picks up again once they have moved off. A button to stop it for good stands in the bar for as long as the run may move at all, since a carousel that moves by itself has to be stoppable. While it is moving the run is not read out, so a reader is not interrupted every few seconds by a slide they did not ask for.",
        setup,
        preview: autoPlayPreview,
        code: autoPlayCode,
    },
    {
        name: "Held by the caller",
        description:
            "Which slide is showing, held by whoever is drawing the carousel rather than by the carousel, which is what anything else on the page having a say over it wants. The carousel asks to be moved rather than moving itself, and says what brought the step about, so a press can be told apart from the clock. The line beneath is written inside the carousel: anything handed to it that is neither a slide nor a bar stands below the bar.",
        setup: controlledSetup,
        preview: <ControlledPreview />,
        code: controlledCode,
    },
    {
        name: "A bar of the caller's own",
        description:
            "A bar built out of the carousel's own parts, which take what they move from the carousel around them rather than being told it. Given children, the bar holds those instead of what it would have drawn, so the parts can be laid out in any order and any of them left out.",
        setup,
        preview: customControlsPreview,
        code: customControlsCode,
    },
    {
        name: "Only the dots",
        description:
            "A bar holding the dots alone, for a short run that says everything it has to with them. Each dot is a press of its own, so the run can be stepped to rather than only through.",
        setup,
        preview: indicatorsOnlyPreview,
        code: indicatorsOnlyCode,
    },
    {
        name: "Slides holding more than a picture",
        description:
            "A slide is whatever is put on it. Only the slide being shown can be reached: the ones either side are out of the way as well as out of sight, so the button on the slide after this one is not tabbed into from off screen and is not read out until its slide comes round.",
        preview: cardsPreview,
        code: cardsCode,
    },
];

// What brought a slide into view, so a caller can tell a press apart from the clock. It stands as
// the values themselves rather than as the name they are collected under, since one of them is what
// a caller is handed
const reason = '"previous" | "next" | "indicator" | "auto"';

const onChange = `(index: number, reason: ${reason}) => void`;

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the carousel and its parts take, under the one that takes it. What names the carousel
// comes first, since it is what one cannot be drawn without, then which slide is showing, then how
// the run is stepped through.
//
// The parts below it carry an icon the carousel settles and a name the carousel gives them, so
// there is nothing left to put in them or to call them: what each is for is said in the examples,
// and what is left here is how each is styled
const groups: ComponentPropGroup[] = [
    {
        name: "Carousel",
        props: [
            {
                name: "aria-label",
                type: "string",
                description:
                    "Names the carousel in words. It is a landmark of its own, so a reader moving by landmark arrives at it and has to be told what they have arrived at; one of this and aria-labelledby has to be given",
            },
            {
                name: "aria-labelledby",
                type: "string",
                description:
                    "Names the carousel by whatever on the page already says what it is, in place of aria-label",
            },
            {
                name: "index",
                type: "number",
                description:
                    "Which slide is showing, held by the caller. The carousel asks to be moved rather than moving itself, so every step arrives at onChange and lands where the caller puts it",
            },
            {
                name: "defaultIndex",
                type: "number",
                default: "0",
                description:
                    "Which slide starts out showing, where the carousel keeps hold of it itself",
            },
            {
                name: "onChange",
                type: onChange,
                description:
                    "Called with the slide that has just come into view, and with what brought it there, so a press can be told apart from the clock",
            },
            {
                name: "loop",
                type: "boolean",
                default: "false",
                description:
                    "Whether moving past either end of the run comes round to the other. Where it does not, the step that would lead off the end is stopped rather than left to be pressed",
            },
            {
                name: "autoPlay",
                type: "boolean",
                default: "false",
                description:
                    "Whether the run moves on by itself. It holds still while a reader is on it and picks up once they have moved off, and a button to stop it for good stands in the bar for as long as the run may move at all",
            },
            {
                name: "interval",
                type: "number",
                default: "5000",
                description:
                    "How long each slide is held before the next one, in milliseconds. It is read only by a run that moves on by itself",
            },
            styling,
        ],
    },
    {
        name: "Carousel.Slide",
        props: [styling],
    },
    {
        name: "Carousel.Controls",
        props: [styling],
    },
    {
        name: "Carousel.PreviousButton",
        props: [styling],
    },
    {
        name: "Carousel.NextButton",
        props: [styling],
    },
    {
        name: "Carousel.Indicators",
        props: [styling],
    },
    {
        name: "Carousel.PlayButton",
        props: [styling],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the carousel is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const Carousel = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Carousel
            </Heading>
            <Text as="p" size="large">
                A run of slides shown one at a time, stepped through by the bar beneath it. It is a
                landmark of its own, so it has to be named — in its own words or by something
                already on the page. Only the slide being shown can be reached: the ones either side
                are out of the way as well as out of sight, so nothing standing on them is read out
                or tabbed into from off screen. The slides are written straight into the carousel,
                and anything else handed to it stands below the bar.
            </Text>
        </Stack>
        <ComponentExamples component="Carousel" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Carousel;
