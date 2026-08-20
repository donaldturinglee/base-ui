import { CubeRegular, WeatherMoonRegular, WeatherSunnyRegular } from "@gamecrafters/base-ui-icons";
import { Header, IconButton, useTheme } from "@gamecrafters/base-ui/react";

const classes = {
    brandIcon: "size-[var(--base-size-24)] shrink-0 me-[var(--base-size-8)]",
    // The row ends where the page does, so the last item is not held off the end
    lastItem: "me-0",
};

// The row across the top of the page: what the site is, and the one control the page carries.
// It stands outside the layout rather than in a region of it, so the row itself is the `header`
// the page is headed by
const HomeHeader = () => {
    const { colorScheme, setColorMode } = useTheme();
    const isNight = colorScheme === "dark";

    return (
        <Header>
            {/* What the site is takes whatever room the row leaves, so the control after it is
                held to the far end */}
            <Header.Item full>
                <Header.Link href="/">
                    <CubeRegular className={classes.brandIcon} />
                    <span>Base UI</span>
                </Header.Link>
            </Header.Item>
            <Header.Item className={classes.lastItem}>
                <IconButton
                    aria-label={isNight ? "Switch to the day scheme" : "Switch to the night scheme"}
                    icon={isNight ? WeatherSunnyRegular : WeatherMoonRegular}
                    variant="invisible"
                    onClick={() => setColorMode(isNight ? "day" : "night")}
                />
            </Header.Item>
        </Header>
    );
};

export default HomeHeader;
