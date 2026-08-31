import { BrowserRouter, Route, Routes } from "react-router";
import { Layout } from "../components";
import {
    Accordion,
    ActionBar,
    ActionList,
    ActionMenu,
    Alert,
    AnchoredOverlay,
    AspectRatio,
    Changelog,
    Home,
    Installation,
    MCPServer,
    NotFound,
    PrimitivesColor,
    PrimitivesSize,
    PrimitivesTypography,
    Storybook,
} from "../features";

// What the site is driven by from the address bar: the path is read from the browser's own history,
// so a link is followed by redrawing the page rather than by asking the server for another one.
//
// It is a piece of its own rather than part of the mount, so what the app is drawn under is settled
// in one place and where it can be gone in another, and neither has to be read to change the other
const Router = () => (
    <BrowserRouter>
        {/* Which page stands at which path. Every one of them is drawn inside the layout rather
            than beside it, so the row across the top and the column of links are drawn once and
            stay where they are as the reader moves between pages.

            A component is named here as every other page is, since each one stands on its own and
            says what is true of it rather than being handed a name to answer under. The column
            beside the page names every component the library exports and is written up ahead of
            them, so a path it names that has yet to be written lands on the page for a path with
            nothing behind it, inside the layout, with the column still there to be gone on from */}
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="getting-started/installation" element={<Installation />} />
                <Route path="getting-started/changelog" element={<Changelog />} />
                <Route path="guides/mcp-server" element={<MCPServer />} />
                <Route path="primitives/color" element={<PrimitivesColor />} />
                <Route path="primitives/size" element={<PrimitivesSize />} />
                <Route path="primitives/typography" element={<PrimitivesTypography />} />
                <Route path="components/accordion" element={<Accordion />} />
                <Route path="components/action-bar" element={<ActionBar />} />
                <Route path="components/action-list" element={<ActionList />} />
                <Route path="components/action-menu" element={<ActionMenu />} />
                <Route path="components/alert" element={<Alert />} />
                <Route path="components/anchored-overlay" element={<AnchoredOverlay />} />
                <Route path="components/aspect-ratio" element={<AspectRatio />} />
                {/* The Storybook is read at the path itself and nowhere under it: what stands
                    under it in a build is the Storybook's own files, answered as files before
                    the site is reached, so a path written here would never be read */}
                <Route path="storybook" element={<Storybook />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    </BrowserRouter>
);

export default Router;
