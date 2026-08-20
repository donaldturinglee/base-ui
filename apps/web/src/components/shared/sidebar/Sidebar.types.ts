import type * as React from "react";

// Somewhere the sidebar can send the reader. The icon stands beside the label rather than in
// place of it, so a link written without one is still read the same way
export type SidebarLink = {
    label: string;
    href: string;
    icon?: React.ElementType;
    // Marks the link standing for the page being read, which is the one the list shows
    current?: boolean;
    // Leads off the site, so it is opened away from the page it was followed from
    external?: boolean;
};

// A run of links under a heading of its own. The title names the part of the site they belong
// to, which is what sets one section apart from the next
export type SidebarSection = {
    title: string;
    links: SidebarLink[];
};

export type SidebarProps = Omit<React.ComponentPropsWithoutRef<"div">, "children"> & {
    // Names the navigation landmark, and heads the list unless it is kept from the page
    heading: string;
    // Leaves the heading to a screen reader, for a sidebar already named by what stands around it
    hideHeading?: boolean;
    sections: SidebarSection[];
    // Whatever stands under the links
    children?: React.ReactNode;
};
