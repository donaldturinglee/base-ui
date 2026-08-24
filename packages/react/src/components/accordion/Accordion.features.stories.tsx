import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { Button } from "../button";
import { Link } from "../link";
import { Stack } from "../stack";
import { Text } from "../text";
import { Accordion } from ".";

const classes = {
    // The accordion fills its container, so the stories give it one to fill
    container: "w-[28rem]",
};

const sections = [
    {
        value: "billing",
        heading: "Billing",
        body: "Change the card the account is billed to, and see what has been charged to it.",
    },
    {
        value: "notifications",
        heading: "Notifications",
        body: "Choose what you hear about, and whether it reaches you by email or on the site.",
    },
    {
        value: "security",
        heading: "Security",
        body: "Review the devices signed in to the account and the keys that can reach it.",
    },
];

export default {
    title: "Components/Accordion/Features",
    parameters: {
        layout: "centered",
    },
};

// Open To Start, which is the item the accordion opens on
export const OpenToStart: StoryFn<typeof Accordion> = () => (
    <div className={classes.container}>
        <Accordion defaultValue={["notifications"]}>
            {sections.map((section) => (
                <Accordion.Item key={section.value} value={section.value}>
                    <Accordion.Header>{section.heading}</Accordion.Header>
                    <Accordion.Panel>{section.body}</Accordion.Panel>
                </Accordion.Item>
            ))}
        </Accordion>
    </div>
);

// Multiple, where opening one item leaves the others as they were
export const Multiple: StoryFn<typeof Accordion> = () => (
    <div className={classes.container}>
        <Accordion multiple defaultValue={["billing", "security"]}>
            {sections.map((section) => (
                <Accordion.Item key={section.value} value={section.value}>
                    <Accordion.Header>{section.heading}</Accordion.Header>
                    <Accordion.Panel>{section.body}</Accordion.Panel>
                </Accordion.Item>
            ))}
        </Accordion>
    </div>
);

// Disabled, where nothing in the accordion can be opened or closed
export const Disabled: StoryFn<typeof Accordion> = () => (
    <div className={classes.container}>
        <Accordion disabled defaultValue={["billing"]}>
            {sections.map((section) => (
                <Accordion.Item key={section.value} value={section.value}>
                    <Accordion.Header>{section.heading}</Accordion.Header>
                    <Accordion.Panel>{section.body}</Accordion.Panel>
                </Accordion.Item>
            ))}
        </Accordion>
    </div>
);

// A Disabled Item, which stands closed while the rest of the accordion carries on
export const DisabledItem: StoryFn<typeof Accordion> = () => (
    <div className={classes.container}>
        <Accordion>
            {sections.map((section) => (
                <Accordion.Item
                    key={section.value}
                    value={section.value}
                    disabled={section.value === "security"}
                >
                    <Accordion.Header>{section.heading}</Accordion.Header>
                    <Accordion.Panel>{section.body}</Accordion.Panel>
                </Accordion.Item>
            ))}
        </Accordion>
    </div>
);

// Without Names, where the accordion works out an item's own for it
export const WithoutNames: StoryFn<typeof Accordion> = () => (
    <div className={classes.container}>
        <Accordion>
            {sections.map((section) => (
                <Accordion.Item key={section.value}>
                    <Accordion.Header>{section.heading}</Accordion.Header>
                    <Accordion.Panel>{section.body}</Accordion.Panel>
                </Accordion.Item>
            ))}
        </Accordion>
    </div>
);

// A Heading Level Of Its Own, so the accordion sits at the right depth in the outline
export const HeadingLevel: StoryFn<typeof Accordion> = () => (
    <div className={classes.container}>
        <Accordion headingLevel="h4">
            {sections.map((section) => (
                <Accordion.Item key={section.value} value={section.value}>
                    <Accordion.Header>{section.heading}</Accordion.Header>
                    <Accordion.Panel>{section.body}</Accordion.Panel>
                </Accordion.Item>
            ))}
        </Accordion>
    </div>
);

// Panels That Hold More Than Text
export const RichPanels: StoryFn<typeof Accordion> = () => (
    <div className={classes.container}>
        <Accordion defaultValue={["billing"]}>
            <Accordion.Item value="billing">
                <Accordion.Header>Billing</Accordion.Header>
                <Accordion.Panel>
                    <Stack gap="condensed" align="start">
                        <Text size="small">The account is billed on the first of every month.</Text>
                        <Button size="small">Change card</Button>
                    </Stack>
                </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="security">
                <Accordion.Header>Security</Accordion.Header>
                <Accordion.Panel>
                    <Stack gap="condensed" align="start">
                        <Text size="small">Two devices are signed in to the account.</Text>
                        <Link href="#devices">Review devices</Link>
                    </Stack>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    </div>
);

// Controlled, where the caller keeps hold of what is open
export const Controlled: StoryFn<typeof Accordion> = () => {
    const [open, setOpen] = React.useState<string[]>(["billing"]);

    return (
        <Stack gap="condensed" className={classes.container}>
            <Accordion multiple value={open} onChange={setOpen}>
                {sections.map((section) => (
                    <Accordion.Item key={section.value} value={section.value}>
                        <Accordion.Header>{section.heading}</Accordion.Header>
                        <Accordion.Panel>{section.body}</Accordion.Panel>
                    </Accordion.Item>
                ))}
            </Accordion>
            <Stack direction="horizontal" gap="condensed">
                <Button
                    size="small"
                    onClick={() => setOpen(sections.map((section) => section.value))}
                >
                    Open all
                </Button>
                <Button size="small" onClick={() => setOpen([])}>
                    Close all
                </Button>
            </Stack>
            <Text size="small">
                {open.length > 0 ? `Open: ${open.join(", ")}` : "Nothing open"}
            </Text>
        </Stack>
    );
};

// Panels Drawn Only Once They Are Asked For, where a closed panel is taken off the page rather
// than left there hidden. Its header stops pointing at it while it is gone
export const NotKeptMounted: StoryFn<typeof Accordion> = () => (
    <div className={classes.container}>
        <Accordion keepMounted={false}>
            {sections.map((section) => (
                <Accordion.Item key={section.value} value={section.value}>
                    <Accordion.Header>{section.heading}</Accordion.Header>
                    <Accordion.Panel>{section.body}</Accordion.Panel>
                </Accordion.Item>
            ))}
        </Accordion>
    </div>
);

// Found By The Browser, where find-in-page reaches a closed panel and what it turns up opens the
// item it was found in rather than being passed over
export const HiddenUntilFound: StoryFn<typeof Accordion> = () => (
    <div className={classes.container}>
        <Accordion hiddenUntilFound>
            {sections.map((section) => (
                <Accordion.Item key={section.value} value={section.value}>
                    <Accordion.Header>{section.heading}</Accordion.Header>
                    <Accordion.Panel>{section.body}</Accordion.Panel>
                </Accordion.Item>
            ))}
        </Accordion>
    </div>
);

// Nested, where an accordion stands inside the panel of another
export const Nested: StoryFn<typeof Accordion> = () => (
    <div className={classes.container}>
        <Accordion defaultValue={["notifications"]}>
            <Accordion.Item value="notifications">
                <Accordion.Header>Notifications</Accordion.Header>
                <Accordion.Panel>
                    <Accordion headingLevel="h4">
                        <Accordion.Item value="email">
                            <Accordion.Header>Email</Accordion.Header>
                            <Accordion.Panel>
                                Sent to the address the account was opened with.
                            </Accordion.Panel>
                        </Accordion.Item>
                        <Accordion.Item value="on-site">
                            <Accordion.Header>On the site</Accordion.Header>
                            <Accordion.Panel>
                                Kept in the inbox until they are read.
                            </Accordion.Panel>
                        </Accordion.Item>
                    </Accordion>
                </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="security">
                <Accordion.Header>Security</Accordion.Header>
                <Accordion.Panel>{sections[2].body}</Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    </div>
);
