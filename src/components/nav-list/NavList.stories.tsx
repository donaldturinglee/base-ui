import type { StoryFn, Meta } from "@storybook/react-vite";
import {
    AlertRegular,
    KeyRegular,
    PersonRegular,
    ShieldRegular,
} from "@gamecrafters/base-ui-icons";
import { NavList } from ".";
import type { NavListProps } from "./NavList.types";

const classes = {
    // Gives the list a column to stand in rather than the width of the page
    container: "w-[16rem]",
};

export default {
    title: "Components/NavList",
    component: NavList,
} as Meta<typeof NavList>;

export const Default: StoryFn<typeof NavList> = () => (
    <NavList aria-label="Settings" className={classes.container}>
        <NavList.Item href="#profile" aria-current="page">
            <NavList.LeadingVisual>
                <PersonRegular />
            </NavList.LeadingVisual>
            Profile
        </NavList.Item>
        <NavList.Item href="#account">
            <NavList.LeadingVisual>
                <KeyRegular />
            </NavList.LeadingVisual>
            Account
        </NavList.Item>
        <NavList.Item href="#notifications">
            <NavList.LeadingVisual>
                <AlertRegular />
            </NavList.LeadingVisual>
            Notifications
        </NavList.Item>
        <NavList.Item href="#security">
            <NavList.LeadingVisual>
                <ShieldRegular />
            </NavList.LeadingVisual>
            Security
        </NavList.Item>
    </NavList>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<NavListProps> = (args) => (
    <NavList {...args} className={classes.container}>
        <NavList.Heading>Settings</NavList.Heading>
        <NavList.Item href="#profile" aria-current="page">
            <NavList.LeadingVisual>
                <PersonRegular />
            </NavList.LeadingVisual>
            Profile
        </NavList.Item>
        <NavList.Item href="#account">
            <NavList.LeadingVisual>
                <KeyRegular />
            </NavList.LeadingVisual>
            Account
            <NavList.SubNav>
                <NavList.Item href="#email">Email</NavList.Item>
                <NavList.Item href="#password">Password</NavList.Item>
            </NavList.SubNav>
        </NavList.Item>
        <NavList.Item href="#notifications">
            <NavList.LeadingVisual>
                <AlertRegular />
            </NavList.LeadingVisual>
            Notifications
        </NavList.Item>
    </NavList>
);

Playground.args = {
    "aria-label": undefined,
};

Playground.argTypes = {
    "aria-label": {
        control: {
            type: "text",
        },
        description: "Names the landmark, in place of the list's own heading",
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
