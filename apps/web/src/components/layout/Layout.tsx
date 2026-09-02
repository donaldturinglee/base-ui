import * as React from "react";
import { Outlet, useLocation } from "react-router";
import { Drawer, PageLayout } from "@gamecrafters/base-ui/react";
import Header from "./Header";
import Sidebar from "./Sidebar";

// The width the layout stops standing the column of links beside the page at, which is the one
// the library calls a narrow viewport. The column and the drawer that stands in for it are two
// halves of the one thing, so both are said against this rather than each against a measure of
// its own
const regularViewport = "(min-width: 48rem)";

const classes = {
    // The row across the top has taken what it needs, and what is left over is the layout's, so
    // the page reaches the foot of the viewport rather than stopping where its content does.
    // The column of links and the line marking it off are given the height from there by the
    // layout itself
    layout: "grow",
};

// What stands around a page rather than belonging to it: the row across the top, and the column
// of links on the pages that are looked up among the rest. The page the reader asked for is drawn
// in the region between them, so following a link redraws that region and leaves the rest of the
// site where it was.
//
// The column is asked for rather than always drawn. A page that is read on its own has nothing to
// be looked up beside, and a column naming every component the library has would take the eye
// before such a page had said what the library is. It stands unless the route says otherwise, so
// a page that is one of many keeps it without having to ask.
//
// The two are parts of the layout rather than pieces in their own right, so they are written
// beside it rather than anywhere the rest of the app can reach, and it is the one thing the
// directory lets out
const Layout = ({ sidebar = true }: { sidebar?: boolean }) => {
    const { pathname } = useLocation();
    const [isBrowsing, setBrowsing] = React.useState(false);

    // A link followed from the drawer draws the page behind it, and the drawer would otherwise
    // be left standing over what the reader asked for. It is closed as the page changes rather
    // than by every link having to say so
    React.useEffect(() => {
        setBrowsing(false);
    }, [pathname]);

    // A screen that grows past the narrow range gets the column itself back, and the button that
    // opened this goes with it. The drawer is closed rather than left standing over a page that
    // is already showing what it holds, which is what turning a tablet on its side would leave
    React.useEffect(() => {
        if (!isBrowsing) {
            return;
        }

        const regular = window.matchMedia(regularViewport);
        const close = () => {
            if (regular.matches) {
                setBrowsing(false);
            }
        };

        close();
        regular.addEventListener("change", close);

        return () => {
            regular.removeEventListener("change", close);
        };
    }, [isBrowsing]);

    return (
        <>
            {/* A page drawn without the column of links has nothing beside it leading into the
                library, so the row across the top carries the way in instead. A page that has a
                column carries the way to open it, for the screens the column is taken away on */}
            <Header
                menu={!sidebar}
                onOpenNavigation={sidebar ? () => setBrowsing(true) : undefined}
            />
            {/* The gap the column of links would hold on the side facing the page is given up,
                and the page is set off by its own padding instead. The two measures are the
                same, so what stands between the column and the page is what it always was, and
                the page is held off the edge of the viewport on the sides the column was never
                on */}
            <PageLayout
                className={classes.layout}
                containerWidth="full"
                rowGap="none"
                columnGap="none"
                padding="none"
            >
                {/* The column of links stands outside the page container rather than in a region
                    of it, and is taken away on a narrow screen, where it would otherwise be as
                    wide as the page and leave nothing for what is meant to be read. What stands
                    in for it there is the drawer below.

                    It names every component the library exports, so it is far longer than the
                    viewport and longer than most of the pages beside it. Left to scroll with the
                    page it would be gone by the time the reader had read anything, so it is held
                    to the viewport and scrolled on its own, and where else the reader can go
                    stays within reach however far down a page they are */}
                {sidebar ? (
                    <PageLayout.Sidebar
                        padding="condensed"
                        divider="line"
                        sticky
                        hidden={{ narrow: true }}
                    >
                        <Sidebar />
                    </PageLayout.Sidebar>
                ) : null}
                {/* The container still runs the full width of the viewport, so the column of
                    links stays at the edge it is read from. What is read is capped instead, and
                    centres itself in whatever the column leaves, since a line of prose run the
                    width of a wide screen is lost track of halfway across.

                    What holds a page off the edge of the viewport is its own padding rather than
                    the gap the column is set apart from it by. The column ends well short of the
                    far edge and is taken away altogether on a narrow screen, so a page leaning
                    on it for that was read hard against the edge on a phone and ran into the far
                    edge at every width. It is set off by the same measure on every side instead.
                    That measure is the condensed one, which is the same at every width: the row
                    across the top and the column of links are both held off the edge by it and
                    neither of them changes, so a page that stepped up to a wider one on a large
                    tablet was left standing further in from the far edge than the row above it */}
                <PageLayout.Content width="xlarge" padding="condensed">
                    <Outlet />
                </PageLayout.Content>
            </PageLayout>
            {/* The same links the column holds, on the screens there is no room to stand it
                beside the page. It is the column itself rather than a list written out again, so
                where else the reader can go is said in the one place however it is reached.

                It comes in from the side the column stands on, and holds the page still behind
                it: the list is longer than the viewport and is read by scrolling, which the page
                underneath would otherwise take */}
            {sidebar && isBrowsing ? (
                <Drawer
                    title="Browse"
                    position="left"
                    size="small"
                    onClose={() => setBrowsing(false)}
                >
                    <Sidebar />
                </Drawer>
            ) : null}
        </>
    );
};

export default Layout;
