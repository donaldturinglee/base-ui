import type { StoryFn, Meta } from "@storybook/react-vite";
import { NavigationMenu } from ".";
import type { NavigationMenuProps } from "./NavigationMenu.types";

const classes = {
    // Gives the panels room to open into, rather than against the edge of the frame
    container: "p-[var(--base-size-24)] pb-[var(--base-size-64)]",
};

export default {
    title: "Components/NavigationMenu",
    component: NavigationMenu,
} as Meta<typeof NavigationMenu>;

const menu = (args: Partial<NavigationMenuProps> = {}) => (
    <NavigationMenu aria-label="Main" {...args}>
        <NavigationMenu.List>
            <NavigationMenu.Item>
                <NavigationMenu.Trigger>Product</NavigationMenu.Trigger>
                <NavigationMenu.Content>
                    <NavigationMenu.Link href="#features">Features</NavigationMenu.Link>
                    <NavigationMenu.Link href="#integrations">Integrations</NavigationMenu.Link>
                    <NavigationMenu.Link href="#pricing">Pricing</NavigationMenu.Link>
                </NavigationMenu.Content>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
                <NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
                <NavigationMenu.Content>
                    <NavigationMenu.Link href="#docs">Documentation</NavigationMenu.Link>
                    <NavigationMenu.Link href="#guides">Guides</NavigationMenu.Link>
                    <NavigationMenu.Link href="#support">Support</NavigationMenu.Link>
                </NavigationMenu.Content>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
                <NavigationMenu.Link href="#changelog">Changelog</NavigationMenu.Link>
            </NavigationMenu.Item>
        </NavigationMenu.List>
    </NavigationMenu>
);

export const Default: StoryFn<typeof NavigationMenu> = () => (
    <div className={classes.container}>{menu()}</div>
);

export const Playground: StoryFn<NavigationMenuProps> = (args) => (
    <div className={classes.container}>{menu(args)}</div>
);

Playground.args = {
    orientation: "horizontal",
    openOn: "click",
    openDelay: 200,
    closeDelay: 300,
};

Playground.argTypes = {
    orientation: {
        control: {
            type: "radio",
        },
        options: ["horizontal", "vertical"],
        description: "Which way the row of items runs",
    },
    openOn: {
        control: {
            type: "radio",
        },
        options: ["click", "hover"],
        description: "What opens an item's panel, beyond the press and the keys it always answers",
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
    children: {
        table: {
            disable: true,
        },
    },
};
