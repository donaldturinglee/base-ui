import type { CSSProperties } from "react";
import { Link } from "react-router";
import {
    GithubRegular,
    WeatherMoonRegular,
    WeatherSunnyRegular,
} from "@gamecrafters/base-ui-icons";
import {
    Header as BaseHeader,
    IconButton,
    NavigationMenu,
    Separator,
    Text,
    useTheme,
} from "@gamecrafters/base-ui/react";

const classes = {
    // The page under the row is capped and set in the middle of what it is read in, so the row is
    // held to the same measure and centred in the same room, and the name at its start stands over
    // the first line of the page rather than out at the edge of the viewport. The measure and the
    // gap it is held off by are the ones `PageLayout.Content` gives an `xlarge` page: 1280px, and
    // 16px until there is room for 24, which is where the layout's own spacing steps up and
    // matches --breakpoint-large in the library's variables.css.
    //
    // It is held to this only where the menu is drawn, since a page that carries the column of
    // links begins where that column leaves off rather than in the middle of the viewport
    row: "mx-auto w-full max-w-[1280px] px-[var(--base-size-16)] min-[63.25rem]:px-[var(--base-size-24)]",
    // The menu is the item given the room the row leaves, so what it holds would otherwise be
    // read hard against the name. It is held to the far end of that room instead, where it comes
    // to rest beside the controls the row ends on rather than out on its own in the middle
    menu: "justify-end",
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

// Where the menu leads into the library: the page naming the one thing that has to be done before
// any of it can be used, which is also what the column of links opens on. A reader arrives at the
// same place whichever of the two they came by
const docsHref = "/overview/installation";

// Where the library itself is kept, which is somewhere else entirely rather than another page of
// the site, so it is written out in full and opened away from whatever was being read
const sourceHref = "https://github.com/donaldturinglee/base-ui";

// The row across the top of the page: what the site is, the way into the rest of it, and the one
// control the page carries. It stands outside the layout rather than in a region of it, so the row
// itself is the `header` every page is headed by.
//
// The menu is asked for rather than always drawn, since it is the way in for a page that has no
// column of links beside it. A page that has one is already standing in the library, and would be
// offered the way into it twice
const Header = ({ menu = false }: { menu?: boolean }) => {
    const { colorScheme, setColorMode } = useTheme();
    const isNight = colorScheme === "dark";

    return (
        <>
            <BaseHeader className={menu ? classes.row : undefined} style={colors}>
                {/* Whatever stands next to the name takes the room the row leaves, so the control
                    at the end is held to the far end of it: the menu where there is one, and the
                    name itself where there is not */}
                <BaseHeader.Item full={!menu}>
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
                {menu ? (
                    <BaseHeader.Item className={classes.menu} full>
                        {/* The menu is a landmark of its own, so it is named rather than left as
                            one more list of links in the row. It stands at the far end of the row
                            rather than in the middle of it, so the way into the library is come
                            upon where a reader is already looking for what the row can be asked
                            for */}
                        <NavigationMenu aria-label="Main">
                            <NavigationMenu.List>
                                <NavigationMenu.Item>
                                    {/* Followed by the router, the way the name of the site
                                        beside it and the links beside a page are */}
                                    <NavigationMenu.Link as={Link} to={docsHref}>
                                        Docs
                                    </NavigationMenu.Link>
                                </NavigationMenu.Item>
                            </NavigationMenu.List>
                        </NavigationMenu>
                    </BaseHeader.Item>
                ) : null}
                <BaseHeader.Item>
                    {/* The way out to the source, which is a link drawn as a button so that it
                        is read as one of the pair of controls the row ends on rather than as a
                        word standing among them. It leads away from the site rather than to
                        another page of it, so it is opened beside what was being read.

                        What it is drawn as is said to the compiler as well as to the component:
                        the icon button's props are written so that a name is always given, and
                        what that leaves cannot be read back to the element `as` names, so the
                        anchor's own attributes are refused until the type says `a` too */}
                    <IconButton<"a">
                        as="a"
                        href={sourceHref}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Read the source on GitHub"
                        icon={GithubRegular}
                        variant="default"
                    />
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
