import type { StoryFn, Meta } from "@storybook/react-vite";
import { CubeRegular } from "@gamecrafters/base-ui-icons";
import { Avatar } from "../avatar";
import { Header } from ".";
import type { HeaderProps } from "./Header.types";

const source = "https://avatars.githubusercontent.com/u/7143434?v=4";

const classes = {
    icon: "size-[var(--base-size-24)] shrink-0 me-[var(--base-size-8)]",
    // The row ends where the page does, so the last item is not held off the end
    lastItem: "me-0",
};

export default {
    title: "Components/Header",
    component: Header,
} as Meta<typeof Header>;

export const Default: StoryFn<typeof Header> = () => (
    <Header>
        <Header.Item>
            <Header.Link href="#">
                <CubeRegular className={classes.icon} />
                <span>Base UI</span>
            </Header.Link>
        </Header.Item>
        <Header.Item full>Menu</Header.Item>
        <Header.Item className={classes.lastItem}>
            <Avatar shape="square" alt="mona" src={source} />
        </Header.Item>
    </Header>
);

export const Playground: StoryFn<HeaderProps> = (args) => (
    <Header {...args}>
        <Header.Item>
            <Header.Link href="#">
                <CubeRegular className={classes.icon} />
                <span>Base UI</span>
            </Header.Link>
        </Header.Item>
        <Header.Item full>Menu</Header.Item>
        <Header.Item className={classes.lastItem}>
            <Avatar shape="square" alt="mona" src={source} />
        </Header.Item>
    </Header>
);

Playground.args = {
    as: "header",
};

Playground.argTypes = {
    as: {
        control: {
            type: "radio",
        },
        options: ["header", "div", "nav"],
        description: "HTML element to render",
    },
    children: {
        table: {
            disable: true,
        },
    },
    ref: {
        table: {
            disable: true,
        },
    },
};
