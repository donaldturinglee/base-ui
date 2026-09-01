import { Outlet } from "react-router";
import { PageLayout } from "@gamecrafters/base-ui/react";
import Header from "./Header";
import Sidebar from "./Sidebar";

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
const Layout = ({ sidebar = true }: { sidebar?: boolean }) => (
    <>
        {/* A page drawn without the column of links has nothing beside it leading into the
            library, so the row across the top carries the way in instead */}
        <Header menu={!sidebar} />
        <PageLayout className={classes.layout} containerWidth="full" rowGap="none" padding="none">
            {/* The column of links stands outside the page container rather than in a region of
                it, and is taken away on a narrow screen, where it would otherwise be as wide as
                the page and leave nothing for what is meant to be read.

                It names every component the library exports, so it is far longer than the
                viewport and longer than most of the pages beside it. Left to scroll with the
                page it would be gone by the time the reader had read anything, so it is held to
                the viewport and scrolled on its own, and where else the reader can go stays
                within reach however far down a page they are */}
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
            {/* The container still runs the full width of the viewport, so the column of links
                stays at the edge it is read from. What is read is capped instead, and centres
                itself in whatever the column leaves, since a line of prose run the width of a
                wide screen is lost track of halfway across.

                What holds a page off the edge of the viewport is the gap the column is set apart
                from it by, so a page drawn without the column would be read from the very edge.
                It is set off by that same measure itself instead, and the two read alike */}
            <PageLayout.Content width="xlarge" padding={sidebar ? "none" : "normal"}>
                <Outlet />
            </PageLayout.Content>
        </PageLayout>
    </>
);

export default Layout;
