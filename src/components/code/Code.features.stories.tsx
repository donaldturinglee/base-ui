import type { StoryFn } from "@storybook/react-vite";
import { Link } from "../link";
import { Stack } from "../stack";
import { Text } from "../text";
import { Code } from ".";

const classes = {
    // Gives the running text a column to wrap within
    container: "w-[20rem]",
};

export default {
    title: "Components/Code/Features",
    parameters: {
        layout: "centered",
    },
};

// Default, for a name or a command read on its own
export const Default: StoryFn<typeof Code> = () => <Code>npm install</Code>;

// In Running Text, where the fragment takes the size of the line it is read in rather than
// setting one of its own against it
export const InRunningText: StoryFn<typeof Code> = () => (
    <Stack gap="normal" className={classes.container}>
        {(["large", "medium", "small"] as const).map((size) => (
            <Text key={size} as="p" size={size}>
                Install the package with <Code>npm install</Code>, then import <Code>main.css</Code>{" "}
                once at the root of the application.
            </Text>
        ))}
    </Stack>
);

// In A Link, where the fragment is read as part of what is being pointed at and takes the
// colour of the line it sits in
export const InALink: StoryFn<typeof Code> = () => (
    <Text as="p" className={classes.container}>
        The stylesheet is published as <Link href="#">@gamecrafters/base-ui/main.css</Link> and
        imported once, alongside <Code>main.js</Code>.
    </Text>
);

// Custom Element, for a fragment that is read as something other than source: a key the reader
// is asked to press, or what a program printed back
export const CustomElement: StoryFn<typeof Code> = () => (
    <Text as="p" className={classes.container}>
        Press <Code as="kbd">Ctrl + C</Code> to stop the process, which prints{" "}
        <Code as="samp">Process exited with code 0</Code> before it goes.
    </Text>
);
