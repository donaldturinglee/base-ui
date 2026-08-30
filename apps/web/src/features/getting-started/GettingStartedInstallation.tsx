import { Code, CodeBlock, Heading, Stack, Text } from "@gamecrafters/base-ui/react";

const classes = {
    // The prose is read, the listings beside it are copied, so only the prose is held to a measure
    prose: "max-w-[46rem]",
    // A listing is copied rather than read across, so it is held to a narrower measure than the
    // prose and its lines are left at the length they were written at
    listing: "max-w-[46rem]",
};

// What is installed. The package holds the components and the providers together, and the
// stylesheet the tokens are declared in comes out of the same build, so there is one thing to add
const install = `npm install @gamecrafters/base-ui`;

// React is not installed by the package. It is a peer, so the application says which version it is
// on and the library is drawn by whichever one that is
const peers = `npm install react react-dom`;

// The two things an application does once, before any component is written into it: the stylesheet
// the tokens are declared in, and the providers everything below them is drawn under
const setup = `import { createRoot } from "react-dom/client";
import { LocaleProvider, ThemeProvider } from "@gamecrafters/base-ui/react";
import App from "./App";
import "@gamecrafters/base-ui/main.css";

createRoot(document.getElementById("root")!).render(
    <LocaleProvider locale="en-US">
        <ThemeProvider colorMode="auto">
            <App />
        </ThemeProvider>
    </LocaleProvider>,
);`;

// Everything after that is a component import, written the same way whichever component it is
const usage = `import { Button, Stack, TextInput } from "@gamecrafters/base-ui/react";

const SignIn = () => (
    <Stack gap="normal" align="start">
        <TextInput placeholder="Email" />
        <Button variant="primary">Sign in</Button>
    </Stack>
);`;

// What has to be done before any of the library can be used, in the order it is done in. It is
// three steps rather than one because the stylesheet and the providers are settled at the root and
// nowhere else, and a component reached for before either of them is drawn by nothing
const GettingStartedInstallation = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Installation
            </Heading>
            <Text as="p" size="large">
                The package holds the components, the providers and the stylesheet the tokens are
                declared in. Install it, import the stylesheet once, wrap the application in the
                providers, and everything after that is a component import.
            </Text>
        </Stack>
        <Stack gap="condensed" className={classes.listing}>
            <Heading as="h2" size="small">
                Install the package
            </Heading>
            <CodeBlock language="shellscript">
                <CodeBlock.Content>
                    <CodeBlock.Code>{install}</CodeBlock.Code>
                </CodeBlock.Content>
            </CodeBlock>
            <Text as="p" size="small" className={classes.prose}>
                React and React DOM are peers rather than dependencies, so the application says
                which version it is on. Anything from <Code>18</Code> upwards is drawn correctly.
            </Text>
            <CodeBlock language="shellscript">
                <CodeBlock.Content>
                    <CodeBlock.Code>{peers}</CodeBlock.Code>
                </CodeBlock.Content>
            </CodeBlock>
        </Stack>
        <Stack gap="condensed" className={classes.listing}>
            <Heading as="h2" size="small">
                Set the application up
            </Heading>
            <Text as="p" size="small" className={classes.prose}>
                The stylesheet is imported once, at the root, since it declares the tokens every
                component is drawn by rather than the rules of any one of them.{" "}
                <Code>ThemeProvider</Code> is what those tokens resolve under, and{" "}
                <Code>LocaleProvider</Code> says the language the copy is read in and the direction
                that follows from it.
            </Text>
            <CodeBlock language="tsx">
                <CodeBlock.Header>
                    <CodeBlock.Title>main.tsx</CodeBlock.Title>
                </CodeBlock.Header>
                <CodeBlock.Content>
                    <CodeBlock.Code>{setup}</CodeBlock.Code>
                </CodeBlock.Content>
            </CodeBlock>
            <Text as="p" size="small" className={classes.prose}>
                <Code>colorMode</Code> takes <Code>day</Code>, <Code>night</Code> or{" "}
                <Code>auto</Code>, and <Code>auto</Code> follows the operating system until the
                reader says otherwise. A nested provider only has to say what it changes, so a
                subtree can hold a scheme of its own.
            </Text>
        </Stack>
        <Stack gap="condensed" className={classes.listing}>
            <Heading as="h2" size="small">
                Use a component
            </Heading>
            <Text as="p" size="small" className={classes.prose}>
                Every component and provider is exported from the one entry point, so there is one
                place to import from whatever is being reached for.
            </Text>
            <CodeBlock language="tsx">
                <CodeBlock.Header>
                    <CodeBlock.Title>SignIn.tsx</CodeBlock.Title>
                </CodeBlock.Header>
                <CodeBlock.Content>
                    <CodeBlock.Code>{usage}</CodeBlock.Code>
                </CodeBlock.Content>
            </CodeBlock>
        </Stack>
    </Stack>
);

export default GettingStartedInstallation;
