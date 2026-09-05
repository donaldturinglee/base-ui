import type { Decorator, StoryFn, Meta } from "@storybook/react-vite";
import { NavigationMenu } from ".";
import type { NavigationMenuProps } from "./NavigationMenu.types";

const classes = {
    // Gives the panels room to open into, rather than against the edge of the frame
    container: "p-[var(--base-size-24)] pb-[var(--base-size-128)]",
    // A link in a panel says more than its label, so the two are stood one over the other
    panelLink: "flex-col items-start gap-[var(--base-size-2)]",
    description: "text-body-small text-foreground-muted",
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

const menu = (args: Partial<NavigationMenuProps> = {}) => (
    <NavigationMenu aria-label="Main" {...args}>
        <NavigationMenu.List>
            <NavigationMenu.Item value="product">
                <NavigationMenu.Trigger>Product</NavigationMenu.Trigger>
                <NavigationMenu.Content>
                    {panels.product.map(({ href, label, description }) => (
                        <NavigationMenu.Link key={href} href={href} className={classes.panelLink}>
                            {label}
                            <span className={classes.description}>{description}</span>
                        </NavigationMenu.Link>
                    ))}
                </NavigationMenu.Content>
            </NavigationMenu.Item>

            <NavigationMenu.Item value="resources">
                <NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
                <NavigationMenu.Content>
                    {panels.resources.map(({ href, label, description }) => (
                        <NavigationMenu.Link key={href} href={href} className={classes.panelLink}>
                            {label}
                            <span className={classes.description}>{description}</span>
                        </NavigationMenu.Link>
                    ))}
                </NavigationMenu.Content>
            </NavigationMenu.Item>

            <NavigationMenu.Item value="changelog">
                <NavigationMenu.Link href="#changelog">Changelog</NavigationMenu.Link>
            </NavigationMenu.Item>
        </NavigationMenu.List>
    </NavigationMenu>
);

export default {
    title: "Components/NavigationMenu",
    component: NavigationMenu,
    decorators: [withContainer],
} as Meta<typeof NavigationMenu>;

export const Default: StoryFn<typeof NavigationMenu> = () => menu();

export const Playground: StoryFn<NavigationMenuProps> = (args) => menu(args);

Playground.args = {
    orientation: "horizontal",
    openDelay: 200,
    closeDelay: 300,
    disableClickTrigger: false,
    disableHoverTrigger: false,
    disablePointerLeaveClose: false,
};

Playground.argTypes = {
    orientation: {
        control: {
            type: "radio",
        },
        options: ["horizontal", "vertical"],
        description: "Which way the row of items runs",
    },
    openDelay: {
        control: {
            type: "number",
        },
        description: "How long the pointer has to rest on an item before its panel opens",
    },
    closeDelay: {
        control: {
            type: "number",
        },
        description: "How long a panel is left standing once the pointer has left",
    },
    disableClickTrigger: {
        control: {
            type: "boolean",
        },
        description: "Leaves a press on a trigger unanswered",
    },
    disableHoverTrigger: {
        control: {
            type: "boolean",
        },
        description: "Leaves the pointer resting on a trigger unanswered",
    },
    disablePointerLeaveClose: {
        control: {
            type: "boolean",
        },
        description: "Leaves a panel standing once the pointer has left it",
    },
    value: {
        table: {
            disable: true,
        },
    },
    defaultValue: {
        table: {
            disable: true,
        },
    },
    onValueChange: {
        table: {
            disable: true,
        },
    },
    children: {
        table: {
            disable: true,
        },
    },
};
