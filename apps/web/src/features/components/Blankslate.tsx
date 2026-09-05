import { BookRegular, SearchRegular } from "@gamecrafters/base-ui-icons";
import {
    Blankslate as BlankslateComponent,
    Button,
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
    // A mark handed to a blankslate is drawn as it arrives, so it is given the height the library
    // draws its marks beside a line of text at
    icon: "size-[var(--base-size-24)]",
    // A blankslate answers the room it is given rather than the width of the window, so the one
    // example that is about being given less of it is held to a width narrow enough for the
    // tighter layout to take over
    narrow: "max-w-[30rem]",
};

// The line under the heading. It is written once and read out into the examples that share it,
// since what they are about is the blankslate around the words rather than the words themselves,
// and a line that changed between them would be read as though it were the point
const description = "Wikis give a project somewhere to lay out its roadmap and its decisions.";

// What the examples have to have in hand before they can be drawn. Each is written once and reached
// for by the examples that need it
const iconSetup = `const icon = "size-[var(--base-size-24)]";`;

const descriptionSetup = `const description = "Wikis give a project somewhere to lay out its roadmap and its decisions.";`;

const setup = `${iconSetup}

${descriptionSetup}`;

// The plainest blankslate there is: a mark, what would have been here, a line saying more, and the
// two ways of putting something here. Nothing is said with a prop, so it comes to the middle of the
// scale and stands on the page without a line around it.
//
// The page and the component it is about are both called Blankslate, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Blankslate, as an application
// importing it would
const defaultPreview = (
    <BlankslateComponent>
        <BlankslateComponent.Visual>
            <BookRegular className={classes.icon} />
        </BlankslateComponent.Visual>
        <BlankslateComponent.Heading>Welcome to the wiki</BlankslateComponent.Heading>
        <BlankslateComponent.Description>{description}</BlankslateComponent.Description>
        <BlankslateComponent.PrimaryAction>
            <Button variant="primary">Create the first page</Button>
        </BlankslateComponent.PrimaryAction>
        <BlankslateComponent.SecondaryAction href="#">
            Learn more about wikis
        </BlankslateComponent.SecondaryAction>
    </BlankslateComponent>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Blankslate>
    <Blankslate.Visual>
        <BookRegular className={icon} />
    </Blankslate.Visual>
    <Blankslate.Heading>Welcome to the wiki</Blankslate.Heading>
    <Blankslate.Description>{description}</Blankslate.Description>
    <Blankslate.PrimaryAction>
        <Button variant="primary">Create the first page</Button>
    </Blankslate.PrimaryAction>
    <Blankslate.SecondaryAction href="#">Learn more about wikis</Blankslate.SecondaryAction>
</Blankslate>`;

// Which step of the scale the blankslate is drawn at. The three are drawn together rather than one
// to an example, since a size is read against the others rather than on its own, and each is named
// by the value that drew it. They are laid one under another rather than across, since a blankslate
// runs the width of whatever holds it.
//
// Each is bordered, because most of what a size settles is the room inside the line and there would
// otherwise be no line to read it against
const sizesPreview = (
    <Stack gap="condensed">
        <BlankslateComponent size="small" border>
            <BlankslateComponent.Visual>
                <BookRegular className={classes.icon} />
            </BlankslateComponent.Visual>
            <BlankslateComponent.Heading>small</BlankslateComponent.Heading>
            <BlankslateComponent.Description>{description}</BlankslateComponent.Description>
        </BlankslateComponent>
        <BlankslateComponent size="medium" border>
            <BlankslateComponent.Visual>
                <BookRegular className={classes.icon} />
            </BlankslateComponent.Visual>
            <BlankslateComponent.Heading>medium</BlankslateComponent.Heading>
            <BlankslateComponent.Description>{description}</BlankslateComponent.Description>
        </BlankslateComponent>
        <BlankslateComponent size="large" border>
            <BlankslateComponent.Visual>
                <BookRegular className={classes.icon} />
            </BlankslateComponent.Visual>
            <BlankslateComponent.Heading>large</BlankslateComponent.Heading>
            <BlankslateComponent.Description>{description}</BlankslateComponent.Description>
        </BlankslateComponent>
    </Stack>
);

// The stack is part of what is being shown rather than the page's own furniture, since what the
// example is about is the three read one under the other, so it is written out with them
const sizesCode = `<Stack gap="condensed">
    <Blankslate size="small" border>
        <Blankslate.Visual>
            <BookRegular className={icon} />
        </Blankslate.Visual>
        <Blankslate.Heading>small</Blankslate.Heading>
        <Blankslate.Description>{description}</Blankslate.Description>
    </Blankslate>
    <Blankslate size="medium" border>
        <Blankslate.Visual>
            <BookRegular className={icon} />
        </Blankslate.Visual>
        <Blankslate.Heading>medium</Blankslate.Heading>
        <Blankslate.Description>{description}</Blankslate.Description>
    </Blankslate>
    <Blankslate size="large" border>
        <Blankslate.Visual>
            <BookRegular className={icon} />
        </Blankslate.Visual>
        <Blankslate.Heading>large</Blankslate.Heading>
        <Blankslate.Description>{description}</Blankslate.Description>
    </Blankslate>
</Stack>`;

// A line drawn around the blankslate, which is what one standing inside a page that has other things
// on it wants: without it there is nothing saying where the part with nothing in it begins and the
// part with something in it leaves off
const borderPreview = (
    <BlankslateComponent border>
        <BlankslateComponent.Visual>
            <BookRegular className={classes.icon} />
        </BlankslateComponent.Visual>
        <BlankslateComponent.Heading>Welcome to the wiki</BlankslateComponent.Heading>
        <BlankslateComponent.Description>{description}</BlankslateComponent.Description>
        <BlankslateComponent.PrimaryAction>
            <Button variant="primary">Create the first page</Button>
        </BlankslateComponent.PrimaryAction>
        <BlankslateComponent.SecondaryAction href="#">
            Learn more about wikis
        </BlankslateComponent.SecondaryAction>
    </BlankslateComponent>
);

const borderCode = `<Blankslate border>
    <Blankslate.Visual>
        <BookRegular className={icon} />
    </Blankslate.Visual>
    <Blankslate.Heading>Welcome to the wiki</Blankslate.Heading>
    <Blankslate.Description>{description}</Blankslate.Description>
    <Blankslate.PrimaryAction>
        <Button variant="primary">Create the first page</Button>
    </Blankslate.PrimaryAction>
    <Blankslate.SecondaryAction href="#">Learn more about wikis</Blankslate.SecondaryAction>
</Blankslate>`;

// The blankslate held to a column and set in the middle of whatever it was put in, so the words are
// read at a measure rather than run the width of the page. It is the blankslate that is narrowed and
// not the room it was given, so the type stays where the size put it
const narrowPreview = (
    <BlankslateComponent narrow border>
        <BlankslateComponent.Visual>
            <BookRegular className={classes.icon} />
        </BlankslateComponent.Visual>
        <BlankslateComponent.Heading>Welcome to the wiki</BlankslateComponent.Heading>
        <BlankslateComponent.Description>{description}</BlankslateComponent.Description>
        <BlankslateComponent.PrimaryAction>
            <Button variant="primary">Create the first page</Button>
        </BlankslateComponent.PrimaryAction>
        <BlankslateComponent.SecondaryAction href="#">
            Learn more about wikis
        </BlankslateComponent.SecondaryAction>
    </BlankslateComponent>
);

const narrowCode = `<Blankslate narrow border>
    <Blankslate.Visual>
        <BookRegular className={icon} />
    </Blankslate.Visual>
    <Blankslate.Heading>Welcome to the wiki</Blankslate.Heading>
    <Blankslate.Description>{description}</Blankslate.Description>
    <Blankslate.PrimaryAction>
        <Button variant="primary">Create the first page</Button>
    </Blankslate.PrimaryAction>
    <Blankslate.SecondaryAction href="#">Learn more about wikis</Blankslate.SecondaryAction>
</Blankslate>`;

// The padding opened up, for a blankslate that is the whole of the page rather than a part of it.
// Nothing else about it changes, so it is the same blankslate with the same parts in it
const spaciousPreview = (
    <BlankslateComponent spacious border>
        <BlankslateComponent.Visual>
            <BookRegular className={classes.icon} />
        </BlankslateComponent.Visual>
        <BlankslateComponent.Heading>Welcome to the wiki</BlankslateComponent.Heading>
        <BlankslateComponent.Description>{description}</BlankslateComponent.Description>
        <BlankslateComponent.PrimaryAction>
            <Button variant="primary">Create the first page</Button>
        </BlankslateComponent.PrimaryAction>
        <BlankslateComponent.SecondaryAction href="#">
            Learn more about wikis
        </BlankslateComponent.SecondaryAction>
    </BlankslateComponent>
);

const spaciousCode = `<Blankslate spacious border>
    <Blankslate.Visual>
        <BookRegular className={icon} />
    </Blankslate.Visual>
    <Blankslate.Heading>Welcome to the wiki</Blankslate.Heading>
    <Blankslate.Description>{description}</Blankslate.Description>
    <Blankslate.PrimaryAction>
        <Button variant="primary">Create the first page</Button>
    </Blankslate.PrimaryAction>
    <Blankslate.SecondaryAction href="#">Learn more about wikis</Blankslate.SecondaryAction>
</Blankslate>`;

// A blankslate that reports rather than invites, so there is nothing hanging off the bottom of it.
// The parts are all optional and are read in the order they are given, so leaving the actions out
// is a matter of not writing them rather than of saying so with a prop
const withoutActionsPreview = (
    <BlankslateComponent border>
        <BlankslateComponent.Visual>
            <SearchRegular className={classes.icon} />
        </BlankslateComponent.Visual>
        <BlankslateComponent.Heading>No results found</BlankslateComponent.Heading>
        <BlankslateComponent.Description>
            Nothing here matches what was searched for. Try fewer words, or a different spelling.
        </BlankslateComponent.Description>
    </BlankslateComponent>
);

const withoutActionsCode = `<Blankslate border>
    <Blankslate.Visual>
        <SearchRegular className={icon} />
    </Blankslate.Visual>
    <Blankslate.Heading>No results found</Blankslate.Heading>
    <Blankslate.Description>
        Nothing here matches what was searched for. Try fewer words, or a different spelling.
    </Blankslate.Description>
</Blankslate>`;

// The same blankslate given less room than it wants. It measures what it was put in rather than the
// window, so the type comes down, the padding closes up and the mark is held to the height of a
// line, none of which the size prop was asked about
const constrainedPreview = (
    <Stack className={classes.narrow}>
        <BlankslateComponent border>
            <BlankslateComponent.Visual>
                <BookRegular className={classes.icon} />
            </BlankslateComponent.Visual>
            <BlankslateComponent.Heading>Welcome to the wiki</BlankslateComponent.Heading>
            <BlankslateComponent.Description>{description}</BlankslateComponent.Description>
            <BlankslateComponent.PrimaryAction>
                <Button variant="primary">Create the first page</Button>
            </BlankslateComponent.PrimaryAction>
            <BlankslateComponent.SecondaryAction href="#">
                Learn more about wikis
            </BlankslateComponent.SecondaryAction>
        </BlankslateComponent>
    </Stack>
);

// The width the example is held to is part of what is being shown rather than the page's own
// furniture, since a blankslate standing alone fills what it was put in and there would be nothing
// to see. It is written out as the class it stands for rather than as the name the page holds it
// under, since what is copied out of here has only itself to reach for
const constrainedCode = `<Stack className="max-w-[30rem]">
    <Blankslate border>
        <Blankslate.Visual>
            <BookRegular className={icon} />
        </Blankslate.Visual>
        <Blankslate.Heading>Welcome to the wiki</Blankslate.Heading>
        <Blankslate.Description>{description}</Blankslate.Description>
        <Blankslate.PrimaryAction>
            <Button variant="primary">Create the first page</Button>
        </Blankslate.PrimaryAction>
        <Blankslate.SecondaryAction href="#">Learn more about wikis</Blankslate.SecondaryAction>
    </Blankslate>
</Stack>`;

// The blankslate as it is reached for, drawn and written out one above the other. The plainest one
// comes first, then the scale it is drawn on, then what is done to the frame around it, and last
// what it comes to where it is left with less than it asked for
const examples: ComponentExample[] = [
    {
        name: "Default",
        setup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Sizes",
        description:
            "Which step of the scale the blankslate is drawn at: the type of the heading and of the line under it, and the room around them. A mark handed to it is drawn at whatever size it arrived at, except at the small size, which holds it to a height of its own.",
        setup,
        preview: sizesPreview,
        code: sizesCode,
    },
    {
        name: "Bordered",
        description:
            "A line drawn around the blankslate, which is what one standing inside a page that has other things on it wants. A blankslate that is the whole of the page has nothing to be set apart from, so it is left without.",
        setup,
        preview: borderPreview,
        code: borderCode,
    },
    {
        name: "Narrow",
        description:
            "The blankslate held to a column and set in the middle of whatever it was put in, so the words are read at a measure rather than run the width of the page. It is the blankslate that is narrowed and not the room it was given, so the type stays where the size put it; what a blankslate comes to when the room itself runs short is the last example below.",
        setup,
        preview: narrowPreview,
        code: narrowCode,
    },
    {
        name: "Spacious",
        description:
            "The padding opened up, for a blankslate that is the whole of the page rather than a part of it. Nothing else about it changes, so it is still the same blankslate holding the same parts.",
        setup,
        preview: spaciousPreview,
        code: spaciousCode,
    },
    {
        name: "Without actions",
        description:
            "A blankslate that reports rather than invites. There is nothing to be done about a search that found nothing except search again, and that is done where the searching was, so the blankslate says what happened and stops there. Every part is optional and is read in the order it is given, so leaving the actions out is a matter of not writing them rather than of saying so with a prop.",
        setup: iconSetup,
        preview: withoutActionsPreview,
        code: withoutActionsCode,
    },
    {
        name: "In a narrow container",
        description:
            "The same blankslate given less room than it wants. It measures what it was put in rather than the width of the window, so the type comes down to the small scale, the padding closes up and the mark is held to the height of a line, whatever the size prop was told. Only the room around it has changed here; the blankslate is the one drawn in the examples above.",
        setup,
        preview: constrainedPreview,
        code: constrainedCode,
    },
];

// Which step of the scale the blankslate is drawn at. It stands as the values themselves rather than
// as the name they are collected under, since one of them is what a caller actually hands over
const size = '"small" | "medium" | "large"';

// What the heading can be as a heading. A blankslate is as often the whole of a page as a part of
// one, so its heading runs the full range of levels rather than starting below the first
const headingLevel = '"h1" | "h2" | "h3" | "h4" | "h5" | "h6"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// What the element being drawn takes on top of what the library declares itself. Those props are
// the element's own and are documented wherever elements are, so what is said here is what the
// library adds to them
const polymorphic = {
    name: "as",
    type: "React.ElementType",
    default: '"div"',
    description: "The element or component this is drawn as, in place of its default",
};

// Every prop the blankslate and its parts take, under the one that takes it. The scale comes first,
// then what is done to the frame around it. The parts are drawn as the elements they are meant to
// be — a span, a heading, a paragraph — so only the heading has anything to say about what it is
const groups: ComponentPropGroup[] = [
    {
        name: "Blankslate",
        props: [
            {
                name: "size",
                type: size,
                default: '"medium"',
                description:
                    "Which step of the scale the blankslate is drawn at: the type of the heading and of the line under it, and the room around them. It is read alongside the room the blankslate is given rather than instead of it, so a blankslate in a narrow container drops to the small scale whatever it was told",
            },
            {
                name: "border",
                type: "boolean",
                default: "false",
                description:
                    "Draws a line around the blankslate, for one standing inside a page that has other things on it. A blankslate that is the whole of the page has nothing to be set apart from",
            },
            {
                name: "narrow",
                type: "boolean",
                default: "false",
                description:
                    "Holds the blankslate to a column and sets it in the middle of whatever it was put in, so the words are read at a measure rather than run the width of the page. It is the blankslate that is narrowed and not the room it was given, so the type stays where the size put it",
            },
            {
                name: "spacious",
                type: "boolean",
                default: "false",
                description:
                    "Opens the padding up, for a blankslate that is the whole of the page rather than a part of it",
            },
            styling,
            polymorphic,
        ],
    },
    {
        name: "Blankslate.Visual",
        props: [styling],
    },
    {
        name: "Blankslate.Heading",
        props: [
            {
                name: "as",
                type: headingLevel,
                default: '"h2"',
                description:
                    "What the heading is as a heading, so the blankslate sits at the right depth in the document outline. A blankslate standing for the whole of a page takes the first level, and one standing inside a page takes whatever level it is being read beneath",
            },
            styling,
        ],
    },
    {
        name: "Blankslate.Description",
        props: [styling],
    },
    {
        name: "Blankslate.PrimaryAction",
        props: [styling],
    },
    {
        name: "Blankslate.SecondaryAction",
        props: [
            {
                name: "href",
                type: "string",
                description:
                    "Draws whatever the action holds as a link to this address, which is what a secondary action is by convention. Left out, what it holds is drawn as it stands, so anything else can be put there instead",
            },
            styling,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the blankslate is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const Blankslate = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Blankslate
            </Heading>
            <Text as="p" size="large">
                A page, or a part of one, with nothing in it yet: a mark, what would have been here,
                a line saying more, and whatever puts something here. It stands where an empty list,
                a search that found nothing or a feature nobody has used would otherwise leave a
                blank, so a reader arrives at an explanation rather than at nothing at all. It
                answers the room it is given rather than the width of the window, so the same
                blankslate reads correctly in a column beside a page as it does across one.
            </Text>
        </Stack>
        <ComponentExamples component="Blankslate" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Blankslate;
