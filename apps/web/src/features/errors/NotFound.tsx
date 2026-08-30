import { Link as RouterLink } from "react-router";
import { CompassNorthwestRegular } from "@gamecrafters/base-ui-icons";
import { Blankslate, Link, Stack } from "@gamecrafters/base-ui/react";

const classes = {
    icon: "size-[var(--base-size-24)]",
};

// Where a link with nothing behind it lands. The column beside the page names every component the
// library exports, and most of them are yet to be written up, so this is read far more often as
// "not written yet" than as "no such page" and says so rather than reporting a fault
const NotFound = () => (
    <Stack paddingBlock="spacious">
        <Blankslate>
            <Blankslate.Visual>
                <CompassNorthwestRegular className={classes.icon} />
            </Blankslate.Visual>
            <Blankslate.Heading as="h1">This page is not written yet</Blankslate.Heading>
            <Blankslate.Description>
                The component is in the library and can be used today — it is the page describing it
                that is still to come. Until then, its props and the ways it is meant to be put
                together are in Storybook, and the source is on GitHub.
            </Blankslate.Description>
            <Blankslate.PrimaryAction>
                <Link as={RouterLink} to="/">
                    Back to the start
                </Link>
            </Blankslate.PrimaryAction>
            <Blankslate.SecondaryAction href="https://github.com/donaldturinglee/base-ui">
                Read the source
            </Blankslate.SecondaryAction>
        </Blankslate>
    </Stack>
);

export default NotFound;
