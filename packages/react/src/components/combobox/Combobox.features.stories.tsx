import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { Button } from "../button";
import { Stack } from "../stack";
import { Text } from "../text";
import { Token } from "../token";
import { Combobox } from ".";

const classes = {
    frame: "w-[var(--overlay-width-small)] max-w-full",
};

const fruit = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "cherry", label: "Cherry" },
    { value: "mango", label: "Mango" },
    { value: "orange", label: "Orange" },
    { value: "pineapple", label: "Pineapple" },
    { value: "strawberry", label: "Strawberry" },
];

const countries = [
    { value: "ca", label: "Canada", continent: "North America" },
    { value: "us", label: "United States", continent: "North America" },
    { value: "mx", label: "Mexico", continent: "North America" },
    { value: "gb", label: "United Kingdom", continent: "Europe" },
    { value: "de", label: "Germany", continent: "Europe" },
    { value: "fr", label: "France", continent: "Europe" },
    { value: "jp", label: "Japan", continent: "Asia" },
    { value: "kr", label: "South Korea", continent: "Asia" },
    { value: "cn", label: "China", continent: "Asia" },
];

const continents = ["North America", "Europe", "Asia"];

const skills = [
    { value: "js", label: "JavaScript" },
    { value: "ts", label: "TypeScript" },
    { value: "py", label: "Python" },
    { value: "go", label: "Go" },
    { value: "rs", label: "Rust" },
];

const item = (choice: { value: string; label: string }) => (
    <Combobox.Item key={choice.value} value={choice.value}>
        <Combobox.ItemText>{choice.label}</Combobox.ItemText>
        <Combobox.ItemIndicator />
    </Combobox.Item>
);

export default {
    title: "Components/Combobox/Features",
    parameters: {
        layout: "centered",
    },
};

// Written Out By Hand, which is how the combobox is composed: every part is the caller's to
// place, and the combobox only says which of the items are still worth showing
export const Composed: StoryFn = () => (
    <div className={classes.frame}>
        <Combobox placeholder="e.g. Apple">
            <Combobox.Label>Favourite fruit</Combobox.Label>
            <Combobox.Control>
                <Combobox.Input />
                <Combobox.ClearTrigger />
                <Combobox.Trigger />
            </Combobox.Control>
            <Combobox.Positioner>
                <Combobox.Content>
                    <Combobox.List>{fruit.map(item)}</Combobox.List>
                    <Combobox.Empty />
                </Combobox.Content>
            </Combobox.Positioner>
        </Combobox>
    </div>
);

// Runs Of Items Under Names Of Their Own. A group whose items have all been narrowed away
// stands down along with its name, so there is never a heading over an empty space
export const Grouping: StoryFn = () => (
    <div className={classes.frame}>
        <Combobox placeholder="e.g. Canada">
            <Combobox.Label>Country</Combobox.Label>
            <Combobox.Control>
                <Combobox.Input />
                <Combobox.ClearTrigger />
                <Combobox.Trigger />
            </Combobox.Control>
            <Combobox.Positioner>
                <Combobox.Content>
                    <Combobox.List>
                        {continents.map((continent) => (
                            <Combobox.ItemGroup key={continent}>
                                <Combobox.ItemGroupLabel>{continent}</Combobox.ItemGroupLabel>
                                {countries
                                    .filter((country) => country.continent === continent)
                                    .map(item)}
                            </Combobox.ItemGroup>
                        ))}
                    </Combobox.List>
                    <Combobox.Empty />
                </Combobox.Content>
            </Combobox.Positioner>
        </Combobox>
    </div>
);

// More Than One At A Time. The list stays standing as each is taken, and the field is emptied
// so the next one can be typed for straight away
export const Multiple: StoryFn = () => {
    const [held, setHeld] = React.useState<string[]>(["ts"]);

    return (
        <Stack gap="condensed" align="start" className={classes.frame}>
            <Combobox multiple value={held} onValueChange={setHeld} placeholder="e.g. TypeScript">
                <Combobox.Label>Skills</Combobox.Label>
                <Combobox.Control>
                    <Combobox.Input />
                    <Combobox.ClearTrigger />
                    <Combobox.Trigger />
                </Combobox.Control>
                <Combobox.Positioner>
                    <Combobox.Content>
                        <Combobox.List>{skills.map(item)}</Combobox.List>
                        <Combobox.Empty />
                    </Combobox.Content>
                </Combobox.Positioner>
            </Combobox>
            <Stack direction="horizontal" gap="condensed" wrap="wrap">
                {held.length === 0 ? (
                    <Text>Nothing held yet</Text>
                ) : (
                    held.map((value) => (
                        <Token
                            key={value}
                            text={skills.find((skill) => skill.value === value)?.label ?? value}
                            onRemove={() =>
                                setHeld((current) => current.filter((item) => item !== value))
                            }
                        />
                    ))
                )}
            </Stack>
        </Stack>
    );
};

// The Best Answer Taken In Hand As It Is Typed, so that Enter takes it without the arrows ever
// having to be pressed
export const AutoHighlight: StoryFn = () => (
    <div className={classes.frame}>
        <Combobox inputBehavior="autohighlight" placeholder="Type a letter or two">
            <Combobox.Label>Favourite fruit</Combobox.Label>
            <Combobox.Control>
                <Combobox.Input />
                <Combobox.ClearTrigger />
                <Combobox.Trigger />
            </Combobox.Control>
            <Combobox.Positioner>
                <Combobox.Content>
                    <Combobox.List>{fruit.map(item)}</Combobox.List>
                    <Combobox.Empty />
                </Combobox.Content>
            </Combobox.Positioner>
        </Combobox>
    </div>
);

// That Answer Written Into The Field Behind The Caret. Only the part that was not typed is
// selected, so carrying on typing replaces the completion rather than following it, and
// rubbing it out is not answered with another one
export const InlineAutocomplete: StoryFn = () => (
    <div className={classes.frame}>
        <Combobox inputBehavior="autocomplete" placeholder="Type an a">
            <Combobox.Label>Favourite fruit</Combobox.Label>
            <Combobox.Control>
                <Combobox.Input />
                <Combobox.ClearTrigger />
                <Combobox.Trigger />
            </Combobox.Control>
            <Combobox.Positioner>
                <Combobox.Content>
                    <Combobox.List>{fruit.map(item)}</Combobox.List>
                    <Combobox.Empty />
                </Combobox.Content>
            </Combobox.Positioner>
        </Combobox>
    </div>
);

// Narrowed Somewhere The Combobox Cannot See. The items are left exactly as the caller wrote
// them, since what answers what was typed is being worked out elsewhere
export const Asynchronous: StoryFn = () => {
    const [query, setQuery] = React.useState("");
    const [results, setResults] = React.useState(fruit);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        setLoading(true);

        // Whatever a server would have taken to answer, so that the field can be typed into
        // while the last answer is still on its way
        const timeout = window.setTimeout(() => {
            const lowered = query.toLowerCase();

            setResults(fruit.filter((choice) => choice.label.toLowerCase().includes(lowered)));
            setLoading(false);
        }, 300);

        return () => {
            window.clearTimeout(timeout);
        };
    }, [query]);

    return (
        <div className={classes.frame}>
            <Combobox
                shouldFilter={false}
                onInputValueChange={setQuery}
                placeholder="Search the fruit"
            >
                <Combobox.Label>Favourite fruit</Combobox.Label>
                <Combobox.Control>
                    <Combobox.Input loading={loading} />
                    <Combobox.ClearTrigger />
                    <Combobox.Trigger />
                </Combobox.Control>
                <Combobox.Positioner>
                    <Combobox.Content>
                        <Combobox.List>{results.map(item)}</Combobox.List>
                        <Combobox.Empty>Nothing matched “{query}”</Combobox.Empty>
                    </Combobox.Content>
                </Combobox.Positioner>
            </Combobox>
        </div>
    );
};

// A Field That May Keep A Name That Is Nobody's, for the places what is typed is worth as much
// as what is listed. Left to itself the field goes back to what is held once the reader has
// gone elsewhere, so that a name standing in it always stands for a choice
export const CustomValues: StoryFn = () => {
    const [typed, setTyped] = React.useState("");

    return (
        <Stack gap="condensed" align="start" className={classes.frame}>
            <Combobox allowCustomValue onInputValueChange={setTyped} placeholder="e.g. Bug">
                <Combobox.Label>Label</Combobox.Label>
                <Combobox.Control>
                    <Combobox.Input />
                    <Combobox.ClearTrigger />
                    <Combobox.Trigger />
                </Combobox.Control>
                <Combobox.Positioner>
                    <Combobox.Content>
                        <Combobox.List>
                            {[
                                { value: "bug", label: "Bug" },
                                { value: "feature", label: "Feature" },
                                { value: "docs", label: "Documentation" },
                            ].map(item)}
                        </Combobox.List>
                        <Combobox.Empty>Nothing listed under that name yet</Combobox.Empty>
                    </Combobox.Content>
                </Combobox.Positioner>
            </Combobox>
            <Text>{typed === "" ? "Nothing typed yet" : `The field is holding “${typed}”`}</Text>
        </Stack>
    );
};

// Items That Cannot Be Picked. They are still shown, so that a reader can see what is there
// and why it is out of reach, but the arrows step over them rather than resting on something
// there is nothing to do with
export const DisabledItems: StoryFn = () => (
    <div className={classes.frame}>
        <Combobox placeholder="e.g. Apple">
            <Combobox.Label>Favourite fruit</Combobox.Label>
            <Combobox.Control>
                <Combobox.Input />
                <Combobox.ClearTrigger />
                <Combobox.Trigger />
            </Combobox.Control>
            <Combobox.Positioner>
                <Combobox.Content>
                    <Combobox.List>
                        {fruit.map((choice) => (
                            <Combobox.Item
                                key={choice.value}
                                value={choice.value}
                                disabled={choice.value === "banana" || choice.value === "mango"}
                            >
                                <Combobox.ItemText>{choice.label}</Combobox.ItemText>
                                <Combobox.ItemIndicator />
                            </Combobox.Item>
                        ))}
                    </Combobox.List>
                    <Combobox.Empty />
                </Combobox.Content>
            </Combobox.Positioner>
        </Combobox>
    </div>
);

// Standing In A Form. The field carries what was typed rather than what was picked, so what is
// held is submitted through fields of its own
export const InAForm: StoryFn = () => {
    const [submitted, setSubmitted] = React.useState<string[]>([]);

    return (
        <Stack
            as="form"
            gap="normal"
            align="start"
            className={classes.frame}
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                setSubmitted(new FormData(event.currentTarget).getAll("fruit").map(String));
            }}
        >
            <Combobox name="fruit" placeholder="e.g. Apple">
                <Combobox.Label>Favourite fruit</Combobox.Label>
                <Combobox.Control>
                    <Combobox.Input />
                    <Combobox.ClearTrigger />
                    <Combobox.Trigger />
                </Combobox.Control>
                <Combobox.Positioner>
                    <Combobox.Content>
                        <Combobox.List>{fruit.map(item)}</Combobox.List>
                        <Combobox.Empty />
                    </Combobox.Content>
                </Combobox.Positioner>
            </Combobox>
            <Button type="submit">Submit</Button>
            <Text>
                {submitted.length === 0
                    ? "Nothing submitted yet"
                    : `Submitted ${submitted.join(", ")}`}
            </Text>
        </Stack>
    );
};

// Shown Without Being Changed, and switched off outright. A field that is only being read from
// still opens its list, since there is nothing wrong with looking at what is there
export const DisabledAndReadOnly: StoryFn = () => (
    <Stack gap="normal" align="start" className={classes.frame}>
        <Combobox readOnly defaultValue={["apple"]} defaultInputValue="Apple">
            <Combobox.Label>Read only</Combobox.Label>
            <Combobox.Control>
                <Combobox.Input />
                <Combobox.Trigger />
            </Combobox.Control>
            <Combobox.Positioner>
                <Combobox.Content>
                    <Combobox.List>{fruit.map(item)}</Combobox.List>
                </Combobox.Content>
            </Combobox.Positioner>
        </Combobox>
        <Combobox disabled defaultValue={["banana"]} defaultInputValue="Banana">
            <Combobox.Label>Disabled</Combobox.Label>
            <Combobox.Control>
                <Combobox.Input />
                <Combobox.Trigger />
            </Combobox.Control>
            <Combobox.Positioner>
                <Combobox.Content>
                    <Combobox.List>{fruit.map(item)}</Combobox.List>
                </Combobox.Content>
            </Combobox.Positioner>
        </Combobox>
    </Stack>
);

// Coming Round At Either End, so that running past the last item lands back on the first
export const Looping: StoryFn = () => (
    <div className={classes.frame}>
        <Combobox loopFocus placeholder="Press the up arrow to start at the end">
            <Combobox.Label>Favourite fruit</Combobox.Label>
            <Combobox.Control>
                <Combobox.Input />
                <Combobox.ClearTrigger />
                <Combobox.Trigger />
            </Combobox.Control>
            <Combobox.Positioner>
                <Combobox.Content>
                    <Combobox.List>{fruit.map(item)}</Combobox.List>
                    <Combobox.Empty />
                </Combobox.Content>
            </Combobox.Positioner>
        </Combobox>
    </div>
);
