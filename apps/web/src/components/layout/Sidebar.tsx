import type { ElementType } from "react";
import { Link, useLocation } from "react-router";
import { NavigationList, Stack } from "@gamecrafters/base-ui/react";

// Somewhere the sidebar can send the reader. The icon stands beside the label rather than in
// place of it, so a link written without one is still read the same way
type SidebarLink = {
    label: string;
    href: string;
    icon?: ElementType;
    // Marks the link standing for the page being read, which is the one the list shows. It is
    // worked out from the path being read unless it is said here, for the link that stands for
    // a page the path alone does not name
    current?: boolean;
    // Leads off the site, so it is opened away from the page it was followed from
    external?: boolean;
};

// A run of links under a heading of its own. The title names the part of the site they belong
// to, which is what sets one section apart from the next
type SidebarSection = {
    title: string;
    links: SidebarLink[];
};

// What a link leading off the site is opened with. One that stays on it is left to the router,
// so there is nothing to say about it here
const externalLinkProps = {
    target: "_blank",
    rel: "noreferrer",
} as const;

// One row of the list. A link that stays on the site is followed by the router rather than by the
// browser, so the page it leads to is drawn in place of the one being read and the row across the
// top and the column of links are left where they are. One that leads off the site is an ordinary
// anchor, since there is nothing for the router to draw at the other end of it.
//
// The two are written out separately rather than as one item handed different props, since what
// the item is drawn as decides which props it takes and a single item would have to be both
const renderLink = (
    { label, href, icon: Icon, current, external }: SidebarLink,
    pathname: string,
) => {
    // The link standing for the page being read is worked out from the path rather than asked
    // for, since the page already says which one it is. A caller that knows better says so and
    // is taken at its word
    const ariaCurrent = (current ?? pathname === href) ? "page" : undefined;

    const content = (
        <>
            {Icon ? (
                <NavigationList.LeadingVisual>
                    <Icon />
                </NavigationList.LeadingVisual>
            ) : null}
            {label}
        </>
    );

    return external ? (
        <NavigationList.Item
            key={href}
            href={href}
            aria-current={ariaCurrent}
            {...externalLinkProps}
        >
            {content}
        </NavigationList.Item>
    ) : (
        <NavigationList.Item key={href} as={Link} to={href} aria-current={ariaCurrent}>
            {content}
        </NavigationList.Item>
    );
};

// Where the reader can go from here, in the order the library is learned: the one thing that has
// to be done before any of it can be used, the guides that are read through rather than looked
// up, the primitives everything else is drawn by, and then the components themselves. It is read
// down rather than picked over, so the links are written without icons, which would say nothing
// the labels have not already said
const sections: SidebarSection[] = [
    {
        title: "Overview",
        links: [
            { label: "Installation", href: "/overview/installation" },
            { label: "Changelog", href: "/overview/changelog" },
        ],
    },
    {
        // A guide is read through from the top rather than looked up, so it stands near the head
        // of the column where a reader arrives at it, rather than under the components, where the
        // length of that list would bury it
        title: "Guides",
        links: [{ label: "MCP Server", href: "/guides/mcp-server" }],
    },
    {
        title: "Primitives",
        links: [
            { label: "Color", href: "/primitives/color" },
            { label: "Size", href: "/primitives/size" },
            { label: "Typography", href: "/primitives/typography" },
        ],
    },
    {
        title: "Components",
        // Every component the library exports, named as it is imported
        links: [
            { label: "Accordion", href: "/components/accordion" },
            { label: "ActionBar", href: "/components/action-bar" },
            { label: "ActionList", href: "/components/action-list" },
            { label: "ActionMenu", href: "/components/action-menu" },
            { label: "Alert", href: "/components/alert" },
            { label: "AnchoredOverlay", href: "/components/anchored-overlay" },
            { label: "AspectRatio", href: "/components/aspect-ratio" },
            { label: "Attachment", href: "/components/attachment" },
            { label: "Autocomplete", href: "/components/autocomplete" },
            { label: "Avatar", href: "/components/avatar" },
            { label: "AvatarStack", href: "/components/avatar-stack" },
            { label: "Badge", href: "/components/badge" },
            { label: "Banner", href: "/components/banner" },
            { label: "Blankslate", href: "/components/blankslate" },
            { label: "Blockquote", href: "/components/blockquote" },
            { label: "Box", href: "/components/box" },
            { label: "Breadcrumbs", href: "/components/breadcrumbs" },
            { label: "Bubble", href: "/components/bubble" },
            { label: "Button", href: "/components/button" },
            { label: "Button Group", href: "/components/button-group" },
            { label: "Calendar", href: "/components/calendar" },
            { label: "Card", href: "/components/card" },
            { label: "Caret", href: "/components/caret" },
            { label: "Carousel", href: "/components/carousel" },
            { label: "Chart", href: "/components/chart" },
            { label: "Checkbox", href: "/components/checkbox" },
            { label: "Checkbox Card", href: "/components/checkbox-card" },
            { label: "Checkbox Group", href: "/components/checkbox-group" },
            { label: "Clipboard", href: "/components/clipboard" },
            { label: "Code", href: "/components/code" },
            { label: "Code Block", href: "/components/code-block" },
            { label: "Collapsible", href: "/components/collapsible" },
            { label: "Combobox", href: "/components/combobox" },
            { label: "Command Palette", href: "/components/command-palette" },
            { label: "Confirmation Dialog", href: "/components/confirmation-dialog" },
            { label: "Context Menu", href: "/components/context-menu" },
            { label: "Counter Label", href: "/components/counter-label" },
            { label: "Data Table", href: "/components/data-table" },
            { label: "Date Picker", href: "/components/date-picker" },
            { label: "Details", href: "/components/details" },
            { label: "Dialog", href: "/components/dialog" },
            { label: "Drawer", href: "/components/drawer" },
            { label: "Em", href: "/components/em" },
            { label: "Empty State", href: "/components/empty-state" },
            { label: "File Upload", href: "/components/file-upload" },
            { label: "Filtered Action List", href: "/components/filtered-action-list" },
            { label: "Floating Panel", href: "/components/floating-panel" },
            { label: "Flow", href: "/components/flow" },
            { label: "Form Control", href: "/components/form-control" },
            { label: "Format Byte", href: "/components/format-byte" },
            { label: "Format Number", href: "/components/format-number" },
            { label: "Frame", href: "/components/frame" },
            { label: "Header", href: "/components/header" },
            { label: "Heading", href: "/components/heading" },
            { label: "Hidden", href: "/components/hidden" },
            { label: "Highlight", href: "/components/highlight" },
            { label: "Hover Card", href: "/components/hover-card" },
            { label: "Icon Button", href: "/components/icon-button" },
            { label: "Image", href: "/components/image" },
            { label: "Inline Message", href: "/components/inline-message" },
            { label: "JSON Tree View", href: "/components/json-tree-view" },
            { label: "Keybinding Hint", href: "/components/keybinding-hint" },
            { label: "Label", href: "/components/label" },
            { label: "Label Group", href: "/components/label-group" },
            { label: "Layer Card", href: "/components/layer-card" },
            { label: "Link", href: "/components/link" },
            { label: "Link Button", href: "/components/link-button" },
            { label: "List", href: "/components/list" },
            { label: "Map", href: "/components/map" },
            { label: "Mark", href: "/components/mark" },
            { label: "Markdown", href: "/components/markdown" },
            { label: "Marquee", href: "/components/marquee" },
            { label: "Message", href: "/components/message" },
            { label: "Meter", href: "/components/meter" },
            { label: "Native Select", href: "/components/native-select" },
            { label: "Navigation List", href: "/components/navigation-list" },
            { label: "Navigation Menu", href: "/components/navigation-menu" },
            { label: "Number Input", href: "/components/number-input" },
            { label: "Page Layout", href: "/components/page-layout" },
            { label: "Pagination", href: "/components/pagination" },
            { label: "Password Input", href: "/components/password-input" },
            { label: "PIN Input", href: "/components/pin-input" },
            { label: "Placeholder", href: "/components/placeholder" },
            { label: "Popover", href: "/components/popover" },
            { label: "Portal", href: "/components/portal" },
            { label: "Progress Bar", href: "/components/progress-bar" },
            { label: "Progress Circle", href: "/components/progress-circle" },
            { label: "QR Code", href: "/components/qr-code" },
            { label: "Radio", href: "/components/radio" },
            { label: "Radio Card", href: "/components/radio-card" },
            { label: "Radio Group", href: "/components/radio-group" },
            { label: "Rating", href: "/components/rating" },
            { label: "Relative Time", href: "/components/relative-time" },
            { label: "Resizable", href: "/components/resizable" },
            { label: "Rich Text Editor", href: "/components/rich-text-editor" },
            { label: "Scrollable Region", href: "/components/scrollable-region" },
            { label: "Segmented Control", href: "/components/segmented-control" },
            { label: "Select", href: "/components/select" },
            { label: "Select Panel", href: "/components/select-panel" },
            { label: "Separator", href: "/components/separator" },
            { label: "Skeleton Avatar", href: "/components/skeleton-avatar" },
            { label: "Skeleton Box", href: "/components/skeleton-box" },
            { label: "Skeleton Text", href: "/components/skeleton-text" },
            { label: "Slider", href: "/components/slider" },
            { label: "Spinner", href: "/components/spinner" },
            { label: "Stack", href: "/components/stack" },
            { label: "State Label", href: "/components/state-label" },
            { label: "Statistic Card", href: "/components/statistic-card" },
            { label: "Status", href: "/components/status" },
            { label: "Steps", href: "/components/steps" },
            { label: "Swap", href: "/components/swap" },
            { label: "Table of Contents", href: "/components/table-of-contents" },
            { label: "Tabs", href: "/components/tabs" },
            { label: "Text", href: "/components/text" },
            { label: "Text Input", href: "/components/text-input" },
            { label: "Textarea", href: "/components/textarea" },
            { label: "Timeline", href: "/components/timeline" },
            { label: "Timer", href: "/components/timer" },
            { label: "Toast", href: "/components/toast" },
            { label: "Token", href: "/components/token" },
            { label: "Tooltip", href: "/components/tooltip" },
            { label: "Topic Tag", href: "/components/topic-tag" },
            { label: "Tour", href: "/components/tour" },
            { label: "Tree View", href: "/components/tree-view" },
            { label: "Truncate", href: "/components/truncate" },
        ],
    },
];

// What stands in the column beside the page: where else the reader can go, collected under the
// headings that tell one part of the site from the next. `PageLayout` picks its regions out of its
// children by the component they were written as, so the column itself is a `PageLayout.Sidebar`
// the layout writes, and this is what is put inside it.
//
// The row across the top already says what the site is, so the heading naming the list is left to
// a screen reader rather than said a second time
const Sidebar = () => {
    const { pathname } = useLocation();

    return (
        <Stack gap="normal">
            <NavigationList>
                {/* The list copies the heading to put an id on it, and stands what it copied
                    beside the rest in a list of its own, so the heading is given a key here for
                    the copy to carry into it */}
                <NavigationList.Heading key="heading" visuallyHidden>
                    Base UI
                </NavigationList.Heading>
                {/* Every group but the first is set apart from what comes before by a line, and
                    the first has nothing above it to be set apart from */}
                {sections.map(({ title, links }, index) => (
                    <NavigationList.Group key={title} title={title} hideDivider={index === 0}>
                        {links.map((link) => renderLink(link, pathname))}
                    </NavigationList.Group>
                ))}
            </NavigationList>
        </Stack>
    );
};

export default Sidebar;
