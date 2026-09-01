import { Stack } from "@gamecrafters/base-ui/react";
import {
    HomeContributors,
    HomeFigures,
    HomeFooter,
    HomeFrameworks,
    HomeHero,
    HomeShowcase,
    HomeSponsors,
} from "./components";

const classes = {
    // Room alone says where one section has been finished with and the next has begun, and the
    // step the stack is asked for by name stops at the room two paragraphs are set apart by,
    // which between whole sections reads as one running into the next. It is said in a step of
    // the size scale instead, at twice what the last of the named ones is worth
    page: "gap-[var(--base-size-48)]",
};

// The page the site opens on. The row across the top stands around every page rather than
// belonging to this one, so it is the layout's and what is written here is only what is read
// under it. The column of links is left off this page by the route that draws it, since what the
// library holds is worth naming once the reader has been told what the library is.
//
// It is read down in one pass rather than looked up, so it is written as sections in the order a
// reader would come to them: what the library is, what its components are like to use, how far it
// has got, who pays for it, who writes it, and last of all where it can be built. The foot of the
// page stands under all of them, since what it holds is where the page can be left for rather than
// another thing it has to say. Each of them is held together by the page rather than holding
// itself apart, so the room between them and the room around them is given here and once, and it
// is that room alone that says where one has been finished with and the next has begun
const Home = () => (
    <Stack className={classes.page} paddingBlock="spacious">
        <HomeHero />
        <HomeShowcase />
        <HomeFigures />
        <HomeSponsors />
        <HomeContributors />
        <HomeFrameworks />
        <HomeFooter />
    </Stack>
);

export default Home;
