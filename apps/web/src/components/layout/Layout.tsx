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

// What stands around every page rather than belonging to any one of them: the row across the top
// and the column of links. The page the reader asked for is drawn in the region between them, so
// following a link redraws that region and leaves the rest of the site where it was.
//
// The two are parts of the layout rather than pieces in their own right, so they are written
// beside it rather than anywhere the rest of the app can reach, and it is the one thing the
// directory lets out
const Layout = () => (
    <>
        <Header />
        <PageLayout className={classes.layout} containerWidth="full" rowGap="none" padding="none">
            {/* The column of links stands outside the page container rather than in a region of
                it, and is taken away on a narrow screen, where it would otherwise be as wide as
                the page and leave nothing for what is meant to be read.

                It names every component the library exports, so it is far longer than the
                viewport and longer than most of the pages beside it. Left to scroll with the
                page it would be gone by the time the reader had read anything, so it is held to
                the viewport and scrolled on its own, and where else the reader can go stays
                within reach however far down a page they are */}
            <PageLayout.Sidebar padding="condensed" divider="line" sticky hidden={{ narrow: true }}>
                <Sidebar />
            </PageLayout.Sidebar>
            {/* The container still runs the full width of the viewport, so the column of links
                stays at the edge it is read from. What is read is capped instead, and centres
                itself in whatever is left beside the column, since a line of prose run the width
                of a wide screen is lost track of halfway across */}
            <PageLayout.Content width="xlarge">
                <Outlet />
            </PageLayout.Content>
        </PageLayout>
    </>
);

export default Layout;
