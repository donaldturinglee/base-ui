import type { StoryFn } from "@storybook/react-vite";
import { Link } from "../link";
import { Text } from "../text";
import { List } from ".";
import type { ListSpacing } from "./List.types";

const classes = {
    // Gives the list a container to lay itself out against
    container: "w-[28rem]",
    // Sets one run of items apart from the next where several are shown together
    group: "flex flex-col gap-6",
};

const items = ["Fork the repository", "Create a branch for your change", "Open a pull request"];

const spacings: ListSpacing[] = ["condensed", "normal", "spacious"];

export default {
    title: "Components/List/Features",
};

// Numbered, which is drawn as an ordered list so the order is told rather than only shown
export const Numbered: StoryFn<typeof List> = () => (
    <div className={classes.container}>
        <List variant="number">
            {items.map((item) => (
                <List.Item key={item}>{item}</List.Item>
            ))}
        </List>
    </div>
);

// Plain, for a run that is a set of things rather than prose about them
export const Plain: StoryFn<typeof List> = () => (
    <div className={classes.container}>
        <List variant="plain">
            {items.map((item) => (
                <List.Item key={item}>
                    <Link href="#">{item}</Link>
                </List.Item>
            ))}
        </List>
    </div>
);

// Spacings, from a run read as prose to one given room to be counted
export const Spacings: StoryFn<typeof List> = () => (
    <div className={`${classes.container} ${classes.group}`}>
        {spacings.map((spacing) => (
            <div key={spacing}>
                <Text weight="semibold">{spacing}</Text>
                <List spacing={spacing}>
                    {items.map((item) => (
                        <List.Item key={item}>{item}</List.Item>
                    ))}
                </List>
            </div>
        ))}
    </div>
);

// Nested, where each run is marked differently from the one it hangs beneath
export const Nested: StoryFn<typeof List> = () => (
    <div className={classes.container}>
        <List>
            <List.Item>Fork the repository</List.Item>
            <List.Item>
                Create a branch for your change
                <List>
                    <List.Item>Name it after the change</List.Item>
                    <List.Item>
                        Keep it up to date
                        <List>
                            <List.Item>Rebase on the default branch</List.Item>
                        </List>
                    </List.Item>
                </List>
            </List.Item>
            <List.Item>Open a pull request</List.Item>
        </List>
    </div>
);

// A Numbered Run Under A Bulleted One, which keeps the marker each run is drawn by
export const MixedNesting: StoryFn<typeof List> = () => (
    <div className={classes.container}>
        <List>
            <List.Item>
                Before you start
                <List variant="number">
                    <List.Item>Install the dependencies</List.Item>
                    <List.Item>Run the tests</List.Item>
                </List>
            </List.Item>
            <List.Item>Open a pull request</List.Item>
        </List>
    </div>
);

// Drawn As Something Else, where the list keeps what it says but not what it is
export const DrawnAsSomethingElse: StoryFn<typeof List> = () => (
    <div className={classes.container}>
        <List as="ol" variant="plain">
            {items.map((item) => (
                <List.Item key={item}>{item}</List.Item>
            ))}
        </List>
    </div>
);
