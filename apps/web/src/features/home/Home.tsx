import { HomeHero } from "./components";

// The page the site opens on. The row across the top stands around every page rather than
// belonging to this one, so it is the layout's and what is written here is only what is read
// under it. The column of links is left off this page by the route that draws it, since what the
// library holds is worth naming once the reader has been told what the library is
const Home = () => <HomeHero />;

export default Home;
