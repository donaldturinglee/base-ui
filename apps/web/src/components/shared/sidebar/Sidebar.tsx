import { NavigationList, Stack } from "@gamecrafters/base-ui/react";
import type { SidebarLink, SidebarProps } from "./Sidebar.types";

// What a link leading off the site is opened with. One that stays on it is left to the browser,
// so there is nothing to say about it here
const externalLinkProps = {
    target: "_blank",
    rel: "noreferrer",
} as const;

// One row of the list. The link standing for the page being read is the one marked current, and
// the list is what draws it as such
const renderLink = ({ label, href, icon: Icon, current, external }: SidebarLink) => (
    <NavigationList.Item
        key={href}
        href={href}
        aria-current={current ? "page" : undefined}
        {...(external ? externalLinkProps : {})}
    >
        {Icon ? (
            <NavigationList.LeadingVisual>
                <Icon />
            </NavigationList.LeadingVisual>
        ) : null}
        {label}
    </NavigationList.Item>
);

// What stands in the column beside the page: where else the reader can go, collected under the
// headings that tell one part of the site from the next. `PageLayout` picks its regions out of
// its children by the component they were written as, so a column standing in one is a
// `PageLayout.Sidebar` the page writes itself, and this is what is put inside it
const Sidebar = ({ heading, hideHeading = false, sections, children, ...rest }: SidebarProps) => (
    <Stack gap="normal" {...rest}>
        <NavigationList>
            {/* The list copies the heading to put an id on it, and stands what it copied
                beside the rest in a list of its own, so the heading is given a key here for
                the copy to carry into it */}
            <NavigationList.Heading key="heading" visuallyHidden={hideHeading}>
                {heading}
            </NavigationList.Heading>
            {/* Every group but the first is set apart from what comes before by a line, and
                the first has nothing above it to be set apart from */}
            {sections.map(({ title, links }, index) => (
                <NavigationList.Group key={title} title={title} hideDivider={index === 0}>
                    {links.map(renderLink)}
                </NavigationList.Group>
            ))}
        </NavigationList>
        {children}
    </Stack>
);

export default Sidebar;
