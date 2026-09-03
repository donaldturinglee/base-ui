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
    Avatar,
    AvatarStack,
    Badge,
    Banner,
    Box,
    Button,
    Card,
    Changelog,
    Collapsible,
    Details,
    Em,
    Flow,
    Frame,
    Heading,
    Home,
    IconButton,
    Image,
    Installation,
    MCPServer,
    NotFound,
    PrimitivesColor,
    PrimitivesSize,
    PrimitivesTypography,
    Radio,
    Rating,
    Spinner,
    Stack,
    Storybook,
    Strong,
    Swap,
    Switch,
    Text,
} from "../features";

// What the site is driven by from the address bar: the path is read from the browser's own history,
// so a link is followed by redrawing the page rather than by asking the server for another one.
//
// It is a piece of its own rather than part of the mount, so what the app is drawn under is settled
// in one place and where it can be gone in another, and neither has to be read to change the other
const Router = () => (
    <BrowserRouter>
        {/* Which page stands at which path. Every one of them is drawn inside the layout rather
            than beside it, so the row across the top is drawn once and stays where it is as the
            reader moves between pages, and so does the column of links on the pages that carry it.

            A component is named here as every other page is, since each one stands on its own and
            says what is true of it rather than being handed a name to answer under. The column
            beside the page names every component the library exports and is written up ahead of
            them, so a path it names that has yet to be written lands on the page for a path with
            nothing behind it, inside the layout, with the column still there to be gone on from */}
        <Routes>
            {/* The page the site opens on is arrived at rather than looked up, and says what the
                library is before there is anything in it to look up, so it is drawn without the
                column of links. Which pages carry the column is said here, where which page
                stands at which path is settled already, rather than inside the layout, which
                would then have to know the paths as well as draw what stands at them */}
            <Route element={<Layout sidebar={false} />}>
                <Route index element={<Home />} />
            </Route>
            <Route element={<Layout />}>
                <Route path="overview/installation" element={<Installation />} />
                <Route path="overview/changelog" element={<Changelog />} />
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
                <Route path="components/avatar" element={<Avatar />} />
                <Route path="components/avatar-stack" element={<AvatarStack />} />
                <Route path="components/badge" element={<Badge />} />
                <Route path="components/banner" element={<Banner />} />
                <Route path="components/box" element={<Box />} />
                <Route path="components/button" element={<Button />} />
                <Route path="components/card" element={<Card />} />
                <Route path="components/collapsible" element={<Collapsible />} />
                <Route path="components/details" element={<Details />} />
                <Route path="components/em" element={<Em />} />
                <Route path="components/flow" element={<Flow />} />
                <Route path="components/frame" element={<Frame />} />
                <Route path="components/heading" element={<Heading />} />
                <Route path="components/icon-button" element={<IconButton />} />
                <Route path="components/image" element={<Image />} />
                <Route path="components/radio" element={<Radio />} />
                <Route path="components/rating" element={<Rating />} />
                <Route path="components/spinner" element={<Spinner />} />
                <Route path="components/stack" element={<Stack />} />
                <Route path="components/strong" element={<Strong />} />
                <Route path="components/swap" element={<Swap />} />
                <Route path="components/switch" element={<Switch />} />
                <Route path="components/text" element={<Text />} />
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
