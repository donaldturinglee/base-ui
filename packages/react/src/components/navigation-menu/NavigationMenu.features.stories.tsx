import * as React from "react";
import type { Decorator, StoryFn } from "@storybook/react-vite";
import { Button } from "../button";
import { Text } from "../text";
import { NavigationMenu, useNavigationMenu } from ".";

const classes = {
    // Gives the panels room to open into, rather than against the edge of the frame
    container: "p-[var(--base-size-24)] pb-[var(--base-size-128)]",
    // A column of items runs the width of whatever it stands in, so it is given something to
    // run the width of
    column: "w-[var(--overlay-width-xsmall)]",
    // A link in a panel says more than its label, so the two are stood one over the other
    panelLink: "flex-col items-start gap-[var(--base-size-2)]",
    description: "text-body-small text-foreground-muted",
    // A wider panel, for a viewport with room to lay its links out in columns
    columns: "grid grid-cols-2 gap-x-[var(--base-size-24)]",
    // Names a column of links, quieter than the links it names
    heading:
        "px-[var(--control-medium-padding-inline-normal)] pb-[var(--base-size-4)] text-body-small text-foreground-muted",
    // What stands beside the menu to say what it is doing
    caption: "text-foreground-muted",
    row: "flex items-center gap-[var(--base-size-16)]",
};

const withContainer: Decorator = (Story) => (
    <div className={classes.container}>
        <Story />
    </div>
);

// What each panel holds: somewhere to go, and a line saying what is there
const panels = {
    product: [
        { href: "#features", label: "Features", description: "What the product does" },
        { href: "#integrations", label: "Integrations", description: "What it works with" },
        { href: "#pricing", label: "Pricing", description: "What it costs" },
    ],
    resources: [
        { href: "#docs", label: "Documentation", description: "How to use it" },
        { href: "#guides", label: "Guides", description: "How to get the most out of it" },
        { href: "#support", label: "Support", description: "Where to ask for help" },
    ],
};

const PanelLinks = ({ links }: { links: (typeof panels)["product"] }) =>
    links.map(({ href, label, description }) => (
        <NavigationMenu.Link key={href} href={href} className={classes.panelLink}>
            {label}
            <span className={classes.description}>{description}</span>
        </NavigationMenu.Link>
    ));

// The items every story is a row of, so what the stories are about is what is done around
// them rather than what they hold
const Items = () => (
    <>
        <NavigationMenu.Item value="product">
            <NavigationMenu.Trigger>Product</NavigationMenu.Trigger>
            <NavigationMenu.Content>
                <PanelLinks links={panels.product} />
            </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item value="resources">
            <NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
            <NavigationMenu.Content>
                <PanelLinks links={panels.resources} />
            </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item value="changelog">
            <NavigationMenu.Link href="#changelog">Changelog</NavigationMenu.Link>
        </NavigationMenu.Item>
    </>
);

export default {
    title: "Components/NavigationMenu/Features",
    decorators: [withContainer],
};

// One Surface For Every Panel, slid along the row to whichever item stands open and grown to
// fit its panel, with an arrow carried along to point up at the item
export const Viewport: StoryFn = () => (
    <NavigationMenu aria-label="Main">
        <NavigationMenu.List>
            <NavigationMenu.Item value="product">
                <NavigationMenu.Trigger>Product</NavigationMenu.Trigger>
                <NavigationMenu.Content>
                    <div className={classes.columns}>
                        <div>
                            <div className={classes.heading}>Build</div>
                            <PanelLinks links={panels.product} />
                        </div>
                        <div>
                            <div className={classes.heading}>Learn</div>
                            <PanelLinks links={panels.resources} />
                        </div>
                    </div>
                </NavigationMenu.Content>
            </NavigationMenu.Item>

            <NavigationMenu.Item value="resources">
                <NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
                <NavigationMenu.Content>
                    <PanelLinks links={panels.resources} />
                </NavigationMenu.Content>
            </NavigationMenu.Item>

            <NavigationMenu.Item value="changelog">
                <NavigationMenu.Link href="#changelog">Changelog</NavigationMenu.Link>
            </NavigationMenu.Item>

            <NavigationMenu.Indicator>
                <NavigationMenu.Arrow />
            </NavigationMenu.Indicator>
        </NavigationMenu.List>

        <NavigationMenu.Positioner align="start">
            <NavigationMenu.Viewport />
        </NavigationMenu.Positioner>
    </NavigationMenu>
);

// A Mark Sliding Along The Row to whichever item stands open, drawn under it as a line
export const Indicator: StoryFn = () => (
    <NavigationMenu aria-label="Main">
        <NavigationMenu.List>
            <Items />
            <NavigationMenu.Indicator />
        </NavigationMenu.List>
    </NavigationMenu>
);

// A Mark Under Each Item, drawn in place while that item's panel stands open rather than slid
// along the row from the last one
export const ItemIndicator: StoryFn = () => (
    <NavigationMenu aria-label="Main">
        <NavigationMenu.List>
            <NavigationMenu.Item value="product">
                <NavigationMenu.Trigger>Product</NavigationMenu.Trigger>
                <NavigationMenu.ItemIndicator />
                <NavigationMenu.Content>
                    <PanelLinks links={panels.product} />
                </NavigationMenu.Content>
            </NavigationMenu.Item>

            <NavigationMenu.Item value="resources">
                <NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
                <NavigationMenu.ItemIndicator />
                <NavigationMenu.Content>
                    <PanelLinks links={panels.resources} />
                </NavigationMenu.Content>
            </NavigationMenu.Item>
        </NavigationMenu.List>
    </NavigationMenu>
);

// Down A Column, where the panels stand beside the items and the keys turn onto the other axis:
// up and down move between items, and the key pointing the way the panel opens steps into it
export const Vertical: StoryFn = () => (
    <div className={classes.column}>
        <NavigationMenu aria-label="Main" orientation="vertical">
            <NavigationMenu.List>
                <Items />
            </NavigationMenu.List>
        </NavigationMenu>
    </div>
);

// The Page The Reader Is On, marked as the one link in the menu that goes nowhere
export const CurrentLink: StoryFn = () => (
    <NavigationMenu aria-label="Main">
        <NavigationMenu.List>
            <NavigationMenu.Item value="home">
                <NavigationMenu.Link href="#home" current>
                    Home
                </NavigationMenu.Link>
            </NavigationMenu.Item>
            <Items />
        </NavigationMenu.List>
    </NavigationMenu>
);

// Held By The Caller, where the menu asks to be opened and the caller says what opens
export const Controlled: StoryFn = () => {
    const [value, setValue] = React.useState("");

    return (
        <NavigationMenu
            aria-label="Main"
            value={value}
            onValueChange={(details) => setValue(details.value)}
        >
            <NavigationMenu.List>
                <Items />
            </NavigationMenu.List>
            <Text size="small" className={classes.caption}>
                Open: {value || "nothing"}
            </Text>
        </NavigationMenu>
    );
};

// An Item That Cannot Be Opened, passed over by the keys as well as the pointer
export const Disabled: StoryFn = () => (
    <NavigationMenu aria-label="Main">
        <NavigationMenu.List>
            <NavigationMenu.Item value="product">
                <NavigationMenu.Trigger>Product</NavigationMenu.Trigger>
                <NavigationMenu.Content>
                    <PanelLinks links={panels.product} />
                </NavigationMenu.Content>
            </NavigationMenu.Item>

            <NavigationMenu.Item value="resources" disabled>
                <NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
                <NavigationMenu.Content>
                    <PanelLinks links={panels.resources} />
                </NavigationMenu.Content>
            </NavigationMenu.Item>

            <NavigationMenu.Item value="changelog">
                <NavigationMenu.Link href="#changelog">Changelog</NavigationMenu.Link>
            </NavigationMenu.Item>
        </NavigationMenu.List>
    </NavigationMenu>
);

// Opened By A Press Alone, for a menu that would rather not answer a pointer crossing the row.
// A menu that does not open on the pointer does not close on it either, so a panel stays
// standing until it is pressed shut, put away with Escape, or left for elsewhere
export const ClickOnly: StoryFn = () => (
    <NavigationMenu aria-label="Main" disableHoverTrigger>
        <NavigationMenu.List>
            <Items />
        </NavigationMenu.List>
    </NavigationMenu>
);

// Stands in for a router's own link, which is what a link in an application is usually written
// as. The menu still puts itself away as the link is followed
const RouterLink = React.forwardRef<
    HTMLAnchorElement,
    React.ComponentPropsWithoutRef<"a"> & { to: string }
>(({ to, ...rest }, ref) => <a ref={ref} href={to} {...rest} />);

RouterLink.displayName = "RouterLink";

// Written As The Router's Link, so that following one is a change of page rather than a load
export const CustomLink: StoryFn = () => (
    <NavigationMenu aria-label="Main">
        <NavigationMenu.List>
            <NavigationMenu.Item value="product">
                <NavigationMenu.Trigger>Product</NavigationMenu.Trigger>
                <NavigationMenu.Content>
                    {panels.product.map(({ href, label, description }) => (
                        <NavigationMenu.Link
                            key={href}
                            as={RouterLink}
                            to={href}
                            className={classes.panelLink}
                        >
                            {label}
                            <span className={classes.description}>{description}</span>
                        </NavigationMenu.Link>
                    ))}
                </NavigationMenu.Content>
            </NavigationMenu.Item>

            <NavigationMenu.Item value="changelog">
                <NavigationMenu.Link as={RouterLink} to="#changelog">
                    Changelog
                </NavigationMenu.Link>
            </NavigationMenu.Item>
        </NavigationMenu.List>
    </NavigationMenu>
);

// Reads the menu from inside it, and opens a panel from somewhere other than the row
const Reader = () => {
    const { value, setValue } = useNavigationMenu();

    return (
        <div className={classes.row}>
            <Text size="small" className={classes.caption}>
                Open: {value || "nothing"}
            </Text>
            <Button size="small" onClick={() => setValue(value === "resources" ? "" : "resources")}>
                {value === "resources" ? "Close resources" : "Open resources"}
            </Button>
        </div>
    );
};

// Read From Inside, by something of the caller's own standing in the menu rather than in the row
export const Hook: StoryFn = () => (
    <NavigationMenu aria-label="Main">
        <NavigationMenu.List>
            <Items />
        </NavigationMenu.List>
        <Reader />
    </NavigationMenu>
);
