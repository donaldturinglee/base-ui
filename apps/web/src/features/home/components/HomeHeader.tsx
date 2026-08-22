import type { CSSProperties } from "react";
import { WeatherMoonRegular, WeatherSunnyRegular } from "@gamecrafters/base-ui-icons";
import { Header, IconButton, Separator, Text, useTheme } from "@gamecrafters/base-ui/react";

const classes = {
    // The row ends where the page does, so the last item is not held off the end
    lastItem: "me-0",
};

// The row is drawn white whichever of the two schemes the page is read under. The light pair of
// colours it is written in by default cannot be read on that, so both are pointed at the dark
// end of the scale instead, which is dark under either scheme
const colors = {
    "--header-background-color": "var(--base-color-white)",
    "--header-foreground-color-logo": "var(--base-color-black)",
    "--header-foreground-color-default": "var(--base-color-black)",
} as CSSProperties;

// The row across the top of the page: what the site is, and the one control the page carries.
// It stands outside the layout rather than in a region of it, so the row itself is the `header`
// the page is headed by
const HomeHeader = () => {
    const { colorScheme, setColorMode } = useTheme();
    const isNight = colorScheme === "dark";

    return (
        <>
            <Header style={colors}>
                {/* What the site is takes whatever room the row leaves, so the control after it
                    is held to the far end */}
                <Header.Item full>
                    <Header.Link href="/">
                        {/* The weight is said rather than left to the link to pass down, since
                            text carries a weight of its own and would otherwise draw the name
                            of the site lighter than the row means it to be read */}
                        <Text weight="semibold">Base UI</Text>
                    </Header.Link>
                </Header.Item>
                <Header.Item className={classes.lastItem}>
                    <IconButton
                        aria-label={
                            isNight ? "Switch to the day scheme" : "Switch to the night scheme"
                        }
                        icon={isNight ? WeatherSunnyRegular : WeatherMoonRegular}
                        variant="default"
                        onClick={() => setColorMode(isNight ? "day" : "night")}
                    />
                </Header.Item>
            </Header>
            {/* The row is drawn in the same white the page is, so where one ends and the other
                begins is said by a line rather than left to the colours to say */}
            <Separator />
        </>
    );
};

export default HomeHeader;
