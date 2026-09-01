import { Link } from "react-router";
import { ArrowRightRegular } from "@gamecrafters/base-ui-icons";
import { CodeBlock, Heading, LinkButton, Stack, Text } from "@gamecrafters/base-ui/react";

const classes = {
    // The opening is read as prose rather than looked at as a specimen, so it is held to a
    // measure instead of running out to the width of whatever it is opened in
    root: "max-w-[46rem]",
    // The line beside the button is drawn to the height the button is drawn to, and takes it from
    // the same token rather than from a number that happens to match: a large control is that
    // tall, and the two stand in a row where either being taller than the other is read as one of
    // them having gone wrong. The room the block puts around its line is what it is given instead
    // of that height, so it is taken off and the line is set against the middle of what is left.
    //
    // Its width is the width of what it holds, which is how the button beside it is sized as
    // well: neither is given a measure of its own, and each is as wide as what it has to say
    install:
        "h-[var(--control-large-size)] [&>div]:grow [&>div]:flex [&>div]:items-center [&_pre]:py-0",
};

// Where a reader who has decided is sent: the page naming the one thing that has to be done
// before any of the library can be used, which is where the row across the top leads as well
const startHref = "/overview/installation";

// The one line that has to be run before anything shown below it can be drawn in a project of the
// reader's own. It is the line the installation page opens on, said here as well so that a reader
// who has already decided is not sent to another page to be told the obvious
const install = "npm install @gamecrafters/base-ui";

// What the library is and what it is for, said once, above anything asking to be read in order.
// There is the one thing to do next, so there is the one thing to press: the way to the source
// is carried by the row across the top, where it stands on every page rather than on this one
const HomeHero = () => (
    <Stack className={classes.root} gap="normal" align="start">
        <Heading as="h1" size="large">
            The design system GameCrafters draws its interfaces with
        </Heading>
        <Text as="p" size="large">
            Base UI is a React implementation of the GameCrafters design language: the components an
            interface is assembled from, the tokens they are drawn by, and the two colour schemes
            those tokens resolve under. Install it, import one stylesheet, and the rest is a
            component import.
        </Text>
        {/* The line stands beside the button rather than under it: it is not a second thing to
            press but what the reader who presses the first one will be asked for, and the two are
            read in the one glance. They fall one under the other on a screen with no room for
            both, which is the only way either of them would have to be cut short.

            The two are set against each other's middles rather than their tops, since the line is
            drawn in a block of its own and is the taller of the pair */}
        <Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
            {/* What the page is for, so it is drawn as the primary action. It stays on the site,
                and is followed by the router the way the links beside a page are */}
            <LinkButton
                as={Link}
                to={startHref}
                variant="primary"
                size="large"
                trailingVisual={ArrowRightRegular}
            >
                Start building
            </LinkButton>
            <CodeBlock language="shellscript" className={classes.install}>
                <CodeBlock.Content>
                    <CodeBlock.Code>{install}</CodeBlock.Code>
                </CodeBlock.Content>
            </CodeBlock>
        </Stack>
    </Stack>
);

export default HomeHero;
