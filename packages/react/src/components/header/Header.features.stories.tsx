import type { StoryFn } from "@storybook/react-vite";
import { CubeRegular } from "@gamecrafters/base-ui-icons";
import { Avatar } from "../avatar";
import { Header } from ".";

const source = "https://avatars.githubusercontent.com/u/7143434?v=4";

const classes = {
    icon: "size-[var(--base-size-24)] shrink-0 me-[var(--base-size-8)]",
    // The row ends where the page does, so the last item is not held off the end
    lastItem: "me-0",
};

export default {
    title: "Components/Header/Features",
};

// The Item That Takes The Rest Of The Row, which pushes what follows it to the far end
export const WithFullSizeItem: StoryFn<typeof Header> = () => (
    <Header>
        <Header.Item>Item 1</Header.Item>
        <Header.Item full>Item 2</Header.Item>
        <Header.Item className={classes.lastItem}>Item 3</Header.Item>
    </Header>
);

// Somewhere Each Item Leads To
export const WithLinks: StoryFn<typeof Header> = () => (
    <Header>
        <Header.Item>
            <Header.Link href="#">About</Header.Link>
        </Header.Item>
        <Header.Item>
            <Header.Link href="#">Releases</Header.Link>
        </Header.Item>
        <Header.Item>
            <Header.Link href="#">Team</Header.Link>
        </Header.Item>
    </Header>
);

// A Row Of More Than It Has Room For, which scrolls sideways rather than wrapping
export const WithManyItems: StoryFn<typeof Header> = () => (
    <Header>
        <Header.Item>
            <Header.Link href="#">
                <CubeRegular className={classes.icon} />
                <span>Base UI</span>
            </Header.Link>
        </Header.Item>
        {Array.from({ length: 10 }, (_, index) => (
            <Header.Item key={index}>Item</Header.Item>
        ))}
        <Header.Item className={classes.lastItem}>
            <Avatar shape="square">
                <Avatar.Image src={source} alt="mona" />
            </Avatar>
        </Header.Item>
    </Header>
);

// A Link That Is Not An Anchor, for a row built on a router's own link
export const CustomElement: StoryFn<typeof Header> = () => (
    <Header>
        <Header.Item>
            <Header.Link as="button" type="button" onClick={() => {}}>
                Base UI
            </Header.Link>
        </Header.Item>
    </Header>
);
