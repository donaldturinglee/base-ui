import type { StoryFn } from "@storybook/react-vite";
import { Stack } from "../stack";
import { Text } from "../text";
import { Highlight } from ".";

const classes = {
    // Gives the running text a column to wrap within
    container: "w-[20rem]",
};

// What a search over a list of repositories has turned up, and what it was searched for
const typed = "act";

const results = [
    "actions/checkout",
    "primer/react",
    "github/interaction-tracking",
    "reactjs/react-transaction",
];

export default {
    title: "Components/Highlight/Features",
    parameters: {
        layout: "centered",
    },
};

// Single Term
export const SingleTerm: StoryFn<typeof Highlight> = () => (
    <Highlight match="request">Pull request</Highlight>
);

// Several Terms, picked out at once
export const SeveralTerms: StoryFn<typeof Highlight> = () => (
    <Highlight match={["pull", "request"]}>Pull request</Highlight>
);

// Every Occurrence of a term is picked out, not only the first
export const EveryOccurrence: StoryFn<typeof Highlight> = () => (
    <Highlight match="re">Rebase and retry</Highlight>
);

// Case Sensitive, where a term only stands where the letters match in case as well
export const CaseSensitive: StoryFn<typeof Highlight> = () => (
    <Stack gap="condensed">
        <Highlight match="pull">Pull request (case insensitive)</Highlight>
        <Highlight match="pull" caseSensitive>
            Pull request (case sensitive)
        </Highlight>
    </Stack>
);

// No Match leaves the text exactly as it was written
export const NoMatch: StoryFn<typeof Highlight> = () => (
    <Highlight match="issue">Pull request</Highlight>
);

// Accent Variant
export const Accent: StoryFn<typeof Highlight> = () => (
    <Highlight match="request" variant="accent">
        Pull request
    </Highlight>
);

// Success Variant
export const Success: StoryFn<typeof Highlight> = () => (
    <Highlight match="request" variant="success">
        Pull request
    </Highlight>
);

// Danger Variant
export const Danger: StoryFn<typeof Highlight> = () => (
    <Highlight match="request" variant="danger">
        Pull request
    </Highlight>
);

// Neutral Variant
export const Neutral: StoryFn<typeof Highlight> = () => (
    <Highlight match="request" variant="neutral">
        Pull request
    </Highlight>
);

// In Search Results, where the highlight says what each result was found on
export const InSearchResults: StoryFn<typeof Highlight> = () => (
    <Stack gap="condensed" className={classes.container}>
        {results.map((result) => (
            <Text key={result} as="p" size="medium">
                <Highlight match={typed}>{result}</Highlight>
            </Text>
        ))}
    </Stack>
);

// In Running Text, where the highlight takes the size of the line it is read in rather than
// setting one of its own against it
export const InRunningText: StoryFn<typeof Highlight> = () => (
    <Stack gap="normal" className={classes.container}>
        {(["large", "medium", "small"] as const).map((size) => (
            <Text key={size} as="p" size={size}>
                <Highlight match="everyone">
                    Deleting this repository takes it away from everyone who can reach it.
                </Highlight>
            </Text>
        ))}
    </Stack>
);

// Custom Element, for a highlight that stands as a paragraph of its own
export const CustomElement: StoryFn<typeof Highlight> = () => (
    <Highlight as="p" match="request" className={classes.container}>
        Pull request
    </Highlight>
);
