import {
    BookOpenRegular,
    BoxRegular,
    BranchForkRegular,
    BugRegular,
    ChatRegular,
    CodeRegular,
    HomeRegular,
} from "@gamecrafters/base-ui-icons";
import { Sidebar } from "../../../components";
import type { SidebarSection } from "../../../components";

// Where the reader can go from here. The site is the one page, so the only link that stays on it
// is the one standing for the page being read, and the rest lead off to where the library itself
// is kept and talked about
const sections: SidebarSection[] = [
    {
        title: "This site",
        links: [{ label: "Home", href: "/", icon: HomeRegular, current: true }],
    },
    {
        title: "The library",
        links: [
            {
                label: "Getting started",
                href: "https://github.com/donaldturinglee/base-ui#getting-started",
                icon: BookOpenRegular,
                external: true,
            },
            {
                label: "The package",
                href: "https://www.npmjs.com/package/@gamecrafters/base-ui",
                icon: BoxRegular,
                external: true,
            },
            {
                label: "The source",
                href: "https://github.com/donaldturinglee/base-ui",
                icon: CodeRegular,
                external: true,
            },
        ],
    },
    {
        title: "Taking part",
        links: [
            {
                label: "Contributing",
                href: "https://github.com/donaldturinglee/base-ui#contributing",
                icon: BranchForkRegular,
                external: true,
            },
            {
                label: "Open issues",
                href: "https://github.com/donaldturinglee/base-ui/issues",
                icon: BugRegular,
                external: true,
            },
            {
                label: "Discord",
                href: "https://discord.gg/YsteKRjrSH",
                icon: ChatRegular,
                external: true,
            },
        ],
    },
];

// The column of links standing beside the page. The row across the top already says what the site
// is, so the heading naming the list is left to a screen reader rather than said a second time
const HomeSidebar = () => <Sidebar heading="Base UI" hideHeading sections={sections} />;

export default HomeSidebar;
