import type { StoryFn, Meta } from "@storybook/react-vite";
import {
    AlertRegular,
    KeyRegular,
    PersonRegular,
    ShieldRegular,
} from "@gamecrafters/base-ui-icons";
import { NavigationList } from ".";
import type { NavigationListProps } from "./NavigationList.types";

const classes = {
    // Gives the list a column to stand in rather than the width of the page
    container: "w-[16rem]",
};

export default {
    title: "Components/NavigationList",
    component: NavigationList,
} as Meta<typeof NavigationList>;

export const Default: StoryFn<typeof NavigationList> = () => (
    <NavigationList aria-label="Settings" className={classes.container}>
        <NavigationList.Item href="#profile" aria-current="page">
            <NavigationList.LeadingVisual>
                <PersonRegular />
            </NavigationList.LeadingVisual>
            Profile
        </NavigationList.Item>
        <NavigationList.Item href="#account">
            <NavigationList.LeadingVisual>
                <KeyRegular />
            </NavigationList.LeadingVisual>
            Account
        </NavigationList.Item>
        <NavigationList.Item href="#notifications">
            <NavigationList.LeadingVisual>
                <AlertRegular />
            </NavigationList.LeadingVisual>
            Notifications
        </NavigationList.Item>
        <NavigationList.Item href="#security">
            <NavigationList.LeadingVisual>
                <ShieldRegular />
            </NavigationList.LeadingVisual>
            Security
        </NavigationList.Item>
    </NavigationList>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<NavigationListProps> = (args) => (
    <NavigationList {...args} className={classes.container}>
        <NavigationList.Heading>Settings</NavigationList.Heading>
        <NavigationList.Item href="#profile" aria-current="page">
            <NavigationList.LeadingVisual>
                <PersonRegular />
            </NavigationList.LeadingVisual>
            Profile
        </NavigationList.Item>
        <NavigationList.Item href="#account">
            <NavigationList.LeadingVisual>
                <KeyRegular />
            </NavigationList.LeadingVisual>
            Account
            <NavigationList.SubNavigation>
                <NavigationList.Item href="#email">Email</NavigationList.Item>
                <NavigationList.Item href="#password">Password</NavigationList.Item>
            </NavigationList.SubNavigation>
        </NavigationList.Item>
        <NavigationList.Item href="#notifications">
            <NavigationList.LeadingVisual>
                <AlertRegular />
            </NavigationList.LeadingVisual>
            Notifications
        </NavigationList.Item>
    </NavigationList>
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
