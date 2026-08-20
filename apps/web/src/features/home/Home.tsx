import { PageLayout } from "@gamecrafters/base-ui/react";
import { HomeHeader, HomeHero, HomeSidebar } from "./components";

// The page itself. The row across the top stands outside the layout so that it runs the width
// of the viewport, and what is meant to be read is held to the page container beneath it
const Home = () => (
    <>
        <HomeHeader />
        <PageLayout containerWidth="full" rowGap="none" padding="none">
            {/* The column of links stands outside the page container rather than in a region of
                it, and is taken away on a narrow screen, where it would otherwise be as wide as
                the page and leave nothing for what is meant to be read */}
            <PageLayout.Sidebar padding="condensed" divider="line" hidden={{ narrow: true }}>
                <HomeSidebar />
            </PageLayout.Sidebar>
            <PageLayout.Content>
                <HomeHero />
            </PageLayout.Content>
        </PageLayout>
    </>
);

export default Home;
