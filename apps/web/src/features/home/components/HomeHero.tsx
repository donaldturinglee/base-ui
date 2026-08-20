import { ArrowRightRegular } from "@gamecrafters/base-ui-icons";
import { Heading, Label, LinkButton, Stack, Text } from "@gamecrafters/base-ui/react";
import { version } from "@gamecrafters/base-ui/package.json";

const classes = {
    // The opening is read as prose rather than looked at as a specimen, so it is held to a
    // measure instead of running out to the width of whatever it is opened in
    root: "max-w-[46rem]",
};

// What the library is and what it is for, said once, above anything asking to be read in
// order. The version is taken from the package itself so the page cannot say an old one
const HomeHero = () => (
    <Stack className={classes.root} gap="normal" align="start" paddingBlock="spacious">
        <Label variant="accent" size="medium">
            v{version}
        </Label>
        <Heading as="h1" size="large">
            The design system GameCrafters draws its interfaces with
        </Heading>
        <Text as="p" size="large">
            Base UI is a React implementation of the GameCrafters design language: the components an
            interface is assembled from, the tokens they are drawn by, and the two colour schemes
            those tokens resolve under. Install it, import one stylesheet, and the rest is a
            component import.
        </Text>
        <Stack direction="horizontal" gap="condensed" wrap="wrap">
            <LinkButton
                href="https://github.com/donaldturinglee/base-ui"
                target="_blank"
                rel="noreferrer"
                variant="primary"
                size="large"
                trailingVisual={ArrowRightRegular}
            >
                Read the source
            </LinkButton>
        </Stack>
    </Stack>
);

export default HomeHero;
