import type { StoryFn, Meta } from "@storybook/react-vite";
import { Breadcrumbs } from ".";
import type { BreadcrumbsProps } from "./Breadcrumbs.types";

const classes = {
    // The width the trail is given is what decides how much of it fits
    container: "w-[32rem]",
};

export default {
    title: "Components/Breadcrumbs",
    component: Breadcrumbs,
} as Meta<typeof Breadcrumbs>;

export const Default: StoryFn<typeof Breadcrumbs> = () => (
    <Breadcrumbs>
        <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
        <Breadcrumbs.Item href="#">About</Breadcrumbs.Item>
        <Breadcrumbs.Item href="#" selected>
            Team
        </Breadcrumbs.Item>
    </Breadcrumbs>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<BreadcrumbsProps> = (args) => (
    <div className={classes.container}>
        <Breadcrumbs {...args}>
            <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
            <Breadcrumbs.Item href="#">Products</Breadcrumbs.Item>
            <Breadcrumbs.Item href="#">Category</Breadcrumbs.Item>
            <Breadcrumbs.Item href="#">Subcategory</Breadcrumbs.Item>
            <Breadcrumbs.Item href="#">Item</Breadcrumbs.Item>
            <Breadcrumbs.Item href="#">Details</Breadcrumbs.Item>
            <Breadcrumbs.Item href="#" selected>
                Current page
            </Breadcrumbs.Item>
        </Breadcrumbs>
    </div>
);

Playground.args = {
    overflow: "wrap",
    variant: "normal",
};

Playground.argTypes = {
    overflow: {
        control: {
            type: "radio",
        },
        options: ["wrap", "menu", "menu-with-root"],
        description: "What becomes of the trail once it no longer fits across the page",
    },
    variant: {
        control: {
            type: "radio",
        },
        options: ["normal", "spacious"],
        description: "How much room each step of the trail is given",
    },
    children: {
        table: {
            disable: true,
        },
    },
};

Playground.parameters = {
    layout: "centered",
};
