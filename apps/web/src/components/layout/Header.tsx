import type { CSSProperties } from "react";
import { Link } from "react-router";
import { WeatherMoonRegular, WeatherSunnyRegular } from "@gamecrafters/base-ui-icons";
import {
    Header as BaseHeader,
    IconButton,
    Separator,
    Text,
    useTheme,
} from "@gamecrafters/base-ui/react";

const classes = {
    // The row ends where the page does, so the last item is not held off the end
    lastItem: "me-0",
};

// The row is drawn in whatever the page is drawn in, so it follows the scheme the reader chose
// rather than standing white against a dark page. The pair of colours it is written in by default
// are pitched for the dark ground the library gives it and cannot be read on the page's own, so
// both are pointed at what the page is written in instead
const colors = {
    "--header-background-color": "var(--background-color-default)",
    "--header-foreground-color-logo": "var(--foreground-color-default)",
    "--header-foreground-color-default": "var(--foreground-color-default)",
} as CSSProperties;

// The row across the top of the page: what the site is, and the one control the page carries.
// It stands outside the layout rather than in a region of it, so the row itself is the `header`
// every page is headed by
const Header = () => {
    const { colorScheme, setColorMode } = useTheme();
    const isNight = colorScheme === "dark";

    return (
        <>
            <BaseHeader style={colors}>
                {/* What the site is takes whatever room the row leaves, so the control after it
                    is held to the far end */}
                <BaseHeader.Item full>
                    {/* The name of the site leads back to the page the site opens on, and is
                        followed the way the links beside the page are: the router answers it
                        rather than the browser fetching the document again */}
                    <BaseHeader.Link as={Link} to="/">
                        {/* The weight is said rather than left to the link to pass down, since
                            text carries a weight of its own and would otherwise draw the name
                            of the site lighter than the row means it to be read */}
                        <Text weight="semibold">Base UI</Text>
                    </BaseHeader.Link>
                </BaseHeader.Item>
                <BaseHeader.Item className={classes.lastItem}>
                    {/* The mark says which scheme the page is already in rather than which one
                        the press would bring: a sun where it is day and a moon where it is night.
                        What the press would do is left to the label, which says it in words */}
                    <IconButton
                        aria-label={
                            isNight ? "Switch to the day scheme" : "Switch to the night scheme"
                        }
                        icon={isNight ? WeatherMoonRegular : WeatherSunnyRegular}
                        variant="default"
                        onClick={() => setColorMode(isNight ? "day" : "night")}
                    />
                </BaseHeader.Item>
            </BaseHeader>
            {/* The row is drawn in the same colour the page is, so where one ends and the other
                begins is said by a line rather than left to the colours to say */}
            <Separator />
        </>
    );
};

export default Header;
