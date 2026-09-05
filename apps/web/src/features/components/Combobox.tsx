import * as React from "react";
import {
    Button,
    Combobox as ComboboxComponent,
    Heading,
    Stack,
    Text,
    Token,
} from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // The field is held to a column rather than run across the card. The list stands under the
    // whole of the field, so a field the width of the page would take the list with it
    field: "w-[var(--overlay-width-small)] max-w-full",
};

// What most of the examples are answered from. They are the ones the library's own stories use,
// and several of them begin the same way, which is what a field completing what is typed is worth
// reading against
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
];

const continents = ["North America", "Europe", "Asia"];

const skills = [
    { value: "js", label: "JavaScript" },
    { value: "ts", label: "TypeScript" },
    { value: "py", label: "Python" },
    { value: "go", label: "Go" },
    { value: "rs", label: "Rust" },
];

// One row of the list. It is written once and read out into each example, since what the examples
// are about is the field rather than what is listed under it
const item = (choice: { value: string; label: string }) => (
    <ComboboxComponent.Item key={choice.value} value={choice.value}>
        <ComboboxComponent.ItemText>{choice.label}</ComboboxComponent.ItemText>
        <ComboboxComponent.ItemIndicator />
    </ComboboxComponent.Item>
);

// What the examples have to have in hand before they can be drawn, written a line to the thing it
// settles so that an example takes only the lines it actually reaches for
const fruitSetup = `const fruit = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "cherry", label: "Cherry" },
    { value: "mango", label: "Mango" },
    { value: "orange", label: "Orange" },
    { value: "pineapple", label: "Pineapple" },
    { value: "strawberry", label: "Strawberry" },
];`;

const countriesSetup = `const countries = [
    { value: "ca", label: "Canada", continent: "North America" },
    { value: "us", label: "United States", continent: "North America" },
    { value: "mx", label: "Mexico", continent: "North America" },
    { value: "gb", label: "United Kingdom", continent: "Europe" },
    { value: "de", label: "Germany", continent: "Europe" },
    { value: "fr", label: "France", continent: "Europe" },
    { value: "jp", label: "Japan", continent: "Asia" },
    { value: "kr", label: "South Korea", continent: "Asia" },
];

const continents = ["North America", "Europe", "Asia"];`;

const skillsSetup = `const skills = [
    { value: "js", label: "JavaScript" },
    { value: "ts", label: "TypeScript" },
    { value: "py", label: "Python" },
    { value: "go", label: "Go" },
    { value: "rs", label: "Rust" },
];`;

// The rows every listing writes out, which is what an item is: what the combobox is left holding,
// what the item reads as, and the mark saying it is one of the ones being held
const rows = `{fruit.map((choice) => (
                    <Combobox.Item key={choice.value} value={choice.value}>
                        <Combobox.ItemText>{choice.label}</Combobox.ItemText>
                        <Combobox.ItemIndicator />
                    </Combobox.Item>
                ))}`;

// The plainest combobox there is, and the whole of it: every part is the caller's to place, since
// the combobox itself only says which of the items are still worth showing. The field is what is
// tabbed to and keeps the caret throughout, and the list is read from it with the arrow keys.
//
// The width it is held to is the page's own furniture, as the card around it is, so the listing
// beneath is of the combobox alone: standing in an application, it fills whatever it was put in.
//
// The page and the component it is about are both called Combobox, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Combobox, as an application
// importing it would
const defaultPreview = (
    <ComboboxComponent placeholder="e.g. Apple" className={classes.field}>
        <ComboboxComponent.Label>Favourite fruit</ComboboxComponent.Label>
        <ComboboxComponent.Control>
            <ComboboxComponent.Input />
            <ComboboxComponent.ClearTrigger />
            <ComboboxComponent.Trigger />
        </ComboboxComponent.Control>
        <ComboboxComponent.Positioner>
            <ComboboxComponent.Content>
                <ComboboxComponent.List>{fruit.map(item)}</ComboboxComponent.List>
                <ComboboxComponent.Empty />
            </ComboboxComponent.Content>
        </ComboboxComponent.Positioner>
    </ComboboxComponent>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Combobox placeholder="e.g. Apple">
    <Combobox.Label>Favourite fruit</Combobox.Label>
    <Combobox.Control>
        <Combobox.Input />
        <Combobox.ClearTrigger />
        <Combobox.Trigger />
    </Combobox.Control>
    <Combobox.Positioner>
        <Combobox.Content>
            <Combobox.List>
                ${rows}
            </Combobox.List>
            <Combobox.Empty />
        </Combobox.Content>
    </Combobox.Positioner>
</Combobox>`;

// Runs of items under names of their own. A group whose items have all been narrowed away stands
// down along with its name, so there is never a heading left standing over an empty space
const groupsPreview = (
    <ComboboxComponent placeholder="e.g. Canada" className={classes.field}>
        <ComboboxComponent.Label>Country</ComboboxComponent.Label>
        <ComboboxComponent.Control>
            <ComboboxComponent.Input />
            <ComboboxComponent.ClearTrigger />
            <ComboboxComponent.Trigger />
        </ComboboxComponent.Control>
        <ComboboxComponent.Positioner>
            <ComboboxComponent.Content>
                <ComboboxComponent.List>
                    {continents.map((continent) => (
                        <ComboboxComponent.ItemGroup key={continent}>
                            <ComboboxComponent.ItemGroupLabel>
                                {continent}
                            </ComboboxComponent.ItemGroupLabel>
                            {countries
                                .filter((country) => country.continent === continent)
                                .map(item)}
                        </ComboboxComponent.ItemGroup>
                    ))}
                </ComboboxComponent.List>
                <ComboboxComponent.Empty />
            </ComboboxComponent.Content>
        </ComboboxComponent.Positioner>
    </ComboboxComponent>
);

const groupsCode = `<Combobox placeholder="e.g. Canada">
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
                            .map((choice) => (
                                <Combobox.Item key={choice.value} value={choice.value}>
                                    <Combobox.ItemText>{choice.label}</Combobox.ItemText>
                                    <Combobox.ItemIndicator />
                                </Combobox.Item>
                            ))}
                    </Combobox.ItemGroup>
                ))}
            </Combobox.List>
            <Combobox.Empty />
        </Combobox.Content>
    </Combobox.Positioner>
</Combobox>`;

// More than one held at a time. The list stays standing as each is taken and the field is emptied
// so the next can be typed for straight away, which is what a combobox holding several comes to
// without being told either of those things.
//
// What is held is drawn beside the field rather than only kept, since holding several is the
// reason for reaching for this at all and there is nothing in the field left saying what they are
const MultiplePreview = () => {
    const [held, setHeld] = React.useState<string[]>(["ts"]);

    return (
        <Stack gap="condensed" align="start" className={classes.field}>
            <ComboboxComponent
                multiple
                value={held}
                onValueChange={setHeld}
                placeholder="e.g. TypeScript"
            >
                <ComboboxComponent.Label>Skills</ComboboxComponent.Label>
                <ComboboxComponent.Control>
                    <ComboboxComponent.Input />
                    <ComboboxComponent.ClearTrigger />
                    <ComboboxComponent.Trigger />
                </ComboboxComponent.Control>
                <ComboboxComponent.Positioner>
                    <ComboboxComponent.Content>
                        <ComboboxComponent.List>{skills.map(item)}</ComboboxComponent.List>
                        <ComboboxComponent.Empty />
                    </ComboboxComponent.Content>
                </ComboboxComponent.Positioner>
            </ComboboxComponent>
            <Stack direction="horizontal" gap="condensed" wrap="wrap">
                {held.length === 0 ? (
                    <Text>Nothing held yet</Text>
                ) : (
                    held.map((value) => (
                        <Token
                            key={value}
                            text={skills.find((skill) => skill.value === value)?.label ?? value}
                            onRemove={() =>
                                setHeld((current) => current.filter((one) => one !== value))
                            }
                        />
                    ))
                )}
            </Stack>
        </Stack>
    );
};

const multipleSetup = `${skillsSetup}

const [held, setHeld] = React.useState(["ts"]);`;

const multipleCode = `<Stack gap="condensed" align="start">
    <Combobox multiple value={held} onValueChange={setHeld} placeholder="e.g. TypeScript">
        <Combobox.Label>Skills</Combobox.Label>
        <Combobox.Control>
            <Combobox.Input />
            <Combobox.ClearTrigger />
            <Combobox.Trigger />
        </Combobox.Control>
        <Combobox.Positioner>
            <Combobox.Content>
                <Combobox.List>
                    {skills.map((choice) => (
                        <Combobox.Item key={choice.value} value={choice.value}>
                            <Combobox.ItemText>{choice.label}</Combobox.ItemText>
                            <Combobox.ItemIndicator />
                        </Combobox.Item>
                    ))}
                </Combobox.List>
                <Combobox.Empty />
            </Combobox.Content>
        </Combobox.Positioner>
    </Combobox>
    <Stack direction="horizontal" gap="condensed" wrap="wrap">
        {held.map((value) => (
            <Token
                key={value}
                text={skills.find((skill) => skill.value === value)?.label ?? value}
                onRemove={() => setHeld((current) => current.filter((one) => one !== value))}
            />
        ))}
    </Stack>
</Stack>`;

// How the list answers what is being typed. The three are drawn together rather than one to an
// example, since what is being shown is the choice between them: apart they are three fields that
// look alike, and only beside each other does typing the same letters into all three say what each
// of them does with it.
//
// Each is named for the value it was given, so what is read off the label is what drew it
const behaviourPreview = (
    <Stack gap="normal" align="start" className={classes.field}>
        <ComboboxComponent placeholder="Type an a">
            <ComboboxComponent.Label>none</ComboboxComponent.Label>
            <ComboboxComponent.Control>
                <ComboboxComponent.Input />
                <ComboboxComponent.ClearTrigger />
                <ComboboxComponent.Trigger />
            </ComboboxComponent.Control>
            <ComboboxComponent.Positioner>
                <ComboboxComponent.Content>
                    <ComboboxComponent.List>{fruit.map(item)}</ComboboxComponent.List>
                    <ComboboxComponent.Empty />
                </ComboboxComponent.Content>
            </ComboboxComponent.Positioner>
        </ComboboxComponent>
        <ComboboxComponent inputBehavior="autohighlight" placeholder="Type an a">
            <ComboboxComponent.Label>autohighlight</ComboboxComponent.Label>
            <ComboboxComponent.Control>
                <ComboboxComponent.Input />
                <ComboboxComponent.ClearTrigger />
                <ComboboxComponent.Trigger />
            </ComboboxComponent.Control>
            <ComboboxComponent.Positioner>
                <ComboboxComponent.Content>
                    <ComboboxComponent.List>{fruit.map(item)}</ComboboxComponent.List>
                    <ComboboxComponent.Empty />
                </ComboboxComponent.Content>
            </ComboboxComponent.Positioner>
        </ComboboxComponent>
        <ComboboxComponent inputBehavior="autocomplete" placeholder="Type an a">
            <ComboboxComponent.Label>autocomplete</ComboboxComponent.Label>
            <ComboboxComponent.Control>
                <ComboboxComponent.Input />
                <ComboboxComponent.ClearTrigger />
                <ComboboxComponent.Trigger />
            </ComboboxComponent.Control>
            <ComboboxComponent.Positioner>
                <ComboboxComponent.Content>
                    <ComboboxComponent.List>{fruit.map(item)}</ComboboxComponent.List>
                    <ComboboxComponent.Empty />
                </ComboboxComponent.Content>
            </ComboboxComponent.Positioner>
        </ComboboxComponent>
    </Stack>
);

const behaviourCode = `<Stack gap="normal" align="start">
    <Combobox placeholder="Type an a">
        <Combobox.Label>none</Combobox.Label>
        {/* The control, the list and everything in it, as the first example writes them */}
    </Combobox>
    <Combobox inputBehavior="autohighlight" placeholder="Type an a">
        <Combobox.Label>autohighlight</Combobox.Label>
    </Combobox>
    <Combobox inputBehavior="autocomplete" placeholder="Type an a">
        <Combobox.Label>autocomplete</Combobox.Label>
    </Combobox>
</Stack>`;

// A field allowed to keep a name that is nobody's, for the places what is typed is worth as much
// as what is listed. What the field is left holding is read back beside it, since a name that
// stands for no item is only worth allowing if something is going to be done with it
const CustomValuePreview = () => {
    const [typed, setTyped] = React.useState("");

    return (
        <Stack gap="condensed" align="start" className={classes.field}>
            <ComboboxComponent
                allowCustomValue
                onInputValueChange={setTyped}
                placeholder="e.g. Bug"
            >
                <ComboboxComponent.Label>Label</ComboboxComponent.Label>
                <ComboboxComponent.Control>
                    <ComboboxComponent.Input />
                    <ComboboxComponent.ClearTrigger />
                    <ComboboxComponent.Trigger />
                </ComboboxComponent.Control>
                <ComboboxComponent.Positioner>
                    <ComboboxComponent.Content>
                        <ComboboxComponent.List>
                            {[
                                { value: "bug", label: "Bug" },
                                { value: "feature", label: "Feature" },
                                { value: "docs", label: "Documentation" },
                            ].map(item)}
                        </ComboboxComponent.List>
                        <ComboboxComponent.Empty>
                            Nothing listed under that name yet
                        </ComboboxComponent.Empty>
                    </ComboboxComponent.Content>
                </ComboboxComponent.Positioner>
            </ComboboxComponent>
            <Text>{typed === "" ? "Nothing typed yet" : `The field is holding “${typed}”`}</Text>
        </Stack>
    );
};

const customValueSetup = `const labels = [
    { value: "bug", label: "Bug" },
    { value: "feature", label: "Feature" },
    { value: "docs", label: "Documentation" },
];

const [typed, setTyped] = React.useState("");`;

const customValueCode = `<Stack gap="condensed" align="start">
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
                    {labels.map((choice) => (
                        <Combobox.Item key={choice.value} value={choice.value}>
                            <Combobox.ItemText>{choice.label}</Combobox.ItemText>
                            <Combobox.ItemIndicator />
                        </Combobox.Item>
                    ))}
                </Combobox.List>
                <Combobox.Empty>Nothing listed under that name yet</Combobox.Empty>
            </Combobox.Content>
        </Combobox.Positioner>
    </Combobox>
    <Text>{typed === "" ? "Nothing typed yet" : \`The field is holding “\${typed}”\`}</Text>
</Stack>`;

// Items that cannot be picked. They are still shown, so a reader can see what is there and why it
// is out of reach, and the arrows step over them rather than resting on something there is nothing
// to do with
const disabledItemsPreview = (
    <ComboboxComponent placeholder="e.g. Apple" className={classes.field}>
        <ComboboxComponent.Label>Favourite fruit</ComboboxComponent.Label>
        <ComboboxComponent.Control>
            <ComboboxComponent.Input />
            <ComboboxComponent.ClearTrigger />
            <ComboboxComponent.Trigger />
        </ComboboxComponent.Control>
        <ComboboxComponent.Positioner>
            <ComboboxComponent.Content>
                <ComboboxComponent.List>
                    {fruit.map((choice) => (
                        <ComboboxComponent.Item
                            key={choice.value}
                            value={choice.value}
                            disabled={choice.value === "banana" || choice.value === "mango"}
                        >
                            <ComboboxComponent.ItemText>{choice.label}</ComboboxComponent.ItemText>
                            <ComboboxComponent.ItemIndicator />
                        </ComboboxComponent.Item>
                    ))}
                </ComboboxComponent.List>
                <ComboboxComponent.Empty />
            </ComboboxComponent.Content>
        </ComboboxComponent.Positioner>
    </ComboboxComponent>
);

const disabledItemsCode = `<Combobox placeholder="e.g. Apple">
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
</Combobox>`;

// The list narrowed somewhere the combobox cannot see. The items are left exactly as they were
// written, since what answers what was typed is being worked out elsewhere, and the field says it
// is waiting while the answer is on its way
const AsynchronousPreview = () => {
    const [query, setQuery] = React.useState("");
    const [results, setResults] = React.useState(fruit);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        setLoading(true);

        // Whatever a server would have taken to answer, so that the field can be typed into while
        // the last answer is still on its way
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
        <ComboboxComponent
            shouldFilter={false}
            onInputValueChange={setQuery}
            placeholder="Search the fruit"
            className={classes.field}
        >
            <ComboboxComponent.Label>Favourite fruit</ComboboxComponent.Label>
            <ComboboxComponent.Control>
                <ComboboxComponent.Input loading={loading} />
                <ComboboxComponent.ClearTrigger />
                <ComboboxComponent.Trigger />
            </ComboboxComponent.Control>
            <ComboboxComponent.Positioner>
                <ComboboxComponent.Content>
                    <ComboboxComponent.List>{results.map(item)}</ComboboxComponent.List>
                    <ComboboxComponent.Empty>Nothing matched “{query}”</ComboboxComponent.Empty>
                </ComboboxComponent.Content>
            </ComboboxComponent.Positioner>
        </ComboboxComponent>
    );
};

const asynchronousSetup = `${fruitSetup}

const [query, setQuery] = React.useState("");
const [results, setResults] = React.useState(fruit);
const [loading, setLoading] = React.useState(false);

React.useEffect(() => {
    setLoading(true);

    const timeout = window.setTimeout(() => {
        const lowered = query.toLowerCase();

        setResults(fruit.filter((choice) => choice.label.toLowerCase().includes(lowered)));
        setLoading(false);
    }, 300);

    return () => {
        window.clearTimeout(timeout);
    };
}, [query]);`;

const asynchronousCode = `<Combobox shouldFilter={false} onInputValueChange={setQuery} placeholder="Search the fruit">
    <Combobox.Label>Favourite fruit</Combobox.Label>
    <Combobox.Control>
        <Combobox.Input loading={loading} />
        <Combobox.ClearTrigger />
        <Combobox.Trigger />
    </Combobox.Control>
    <Combobox.Positioner>
        <Combobox.Content>
            <Combobox.List>
                {results.map((choice) => (
                    <Combobox.Item key={choice.value} value={choice.value}>
                        <Combobox.ItemText>{choice.label}</Combobox.ItemText>
                        <Combobox.ItemIndicator />
                    </Combobox.Item>
                ))}
            </Combobox.List>
            <Combobox.Empty>Nothing matched “{query}”</Combobox.Empty>
        </Combobox.Content>
    </Combobox.Positioner>
</Combobox>`;

// Shown without being changed, and switched off outright. The two are drawn together because what
// each of them stops is different: a field that is only being read from still opens its list,
// since there is nothing wrong with looking at what is there, and one that is switched off
// answers nothing at all
const statesPreview = (
    <Stack gap="normal" align="start" className={classes.field}>
        <ComboboxComponent readOnly defaultValue={["apple"]} defaultInputValue="Apple">
            <ComboboxComponent.Label>Read only</ComboboxComponent.Label>
            <ComboboxComponent.Control>
                <ComboboxComponent.Input />
                <ComboboxComponent.Trigger />
            </ComboboxComponent.Control>
            <ComboboxComponent.Positioner>
                <ComboboxComponent.Content>
                    <ComboboxComponent.List>{fruit.map(item)}</ComboboxComponent.List>
                </ComboboxComponent.Content>
            </ComboboxComponent.Positioner>
        </ComboboxComponent>
        <ComboboxComponent disabled defaultValue={["banana"]} defaultInputValue="Banana">
            <ComboboxComponent.Label>Disabled</ComboboxComponent.Label>
            <ComboboxComponent.Control>
                <ComboboxComponent.Input />
                <ComboboxComponent.Trigger />
            </ComboboxComponent.Control>
            <ComboboxComponent.Positioner>
                <ComboboxComponent.Content>
                    <ComboboxComponent.List>{fruit.map(item)}</ComboboxComponent.List>
                </ComboboxComponent.Content>
            </ComboboxComponent.Positioner>
        </ComboboxComponent>
    </Stack>
);

const statesCode = `<Stack gap="normal" align="start">
    <Combobox readOnly defaultValue={["apple"]} defaultInputValue="Apple">
        <Combobox.Label>Read only</Combobox.Label>
        {/* The control and the list, as the first example writes them */}
    </Combobox>
    <Combobox disabled defaultValue={["banana"]} defaultInputValue="Banana">
        <Combobox.Label>Disabled</Combobox.Label>
    </Combobox>
</Stack>`;

// Standing in a form. The field carries what was typed rather than what was picked, so what is
// held is submitted through fields of its own that the combobox writes for it
const InAFormPreview = () => {
    const [submitted, setSubmitted] = React.useState<string[]>([]);

    return (
        <Stack
            as="form"
            gap="normal"
            align="start"
            className={classes.field}
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                setSubmitted(new FormData(event.currentTarget).getAll("fruit").map(String));
            }}
        >
            <ComboboxComponent name="fruit" placeholder="e.g. Apple">
                <ComboboxComponent.Label>Favourite fruit</ComboboxComponent.Label>
                <ComboboxComponent.Control>
                    <ComboboxComponent.Input />
                    <ComboboxComponent.ClearTrigger />
                    <ComboboxComponent.Trigger />
                </ComboboxComponent.Control>
                <ComboboxComponent.Positioner>
                    <ComboboxComponent.Content>
                        <ComboboxComponent.List>{fruit.map(item)}</ComboboxComponent.List>
                        <ComboboxComponent.Empty />
                    </ComboboxComponent.Content>
                </ComboboxComponent.Positioner>
            </ComboboxComponent>
            <Button type="submit">Submit</Button>
            <Text>
                {submitted.length === 0
                    ? "Nothing submitted yet"
                    : `Submitted ${submitted.join(", ")}`}
            </Text>
        </Stack>
    );
};

const inAFormSetup = `${fruitSetup}

const [submitted, setSubmitted] = React.useState([]);`;

const inAFormCode = `<Stack
    as="form"
    gap="normal"
    align="start"
    onSubmit={(event) => {
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
                <Combobox.List>
                    ${rows}
                </Combobox.List>
                <Combobox.Empty />
            </Combobox.Content>
        </Combobox.Positioner>
    </Combobox>
    <Button type="submit">Submit</Button>
    <Text>{submitted.length === 0 ? "Nothing submitted yet" : \`Submitted \${submitted.join(", ")}\`}</Text>
</Stack>`;

// The combobox as it is reached for, drawn and written out one above the other. The plainest one
// comes first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        setup: fruitSetup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Groups",
        description:
            "Runs of items under names of their own. A group whose items have all been narrowed away stands down along with its name, so there is never a heading left standing over an empty space. A group that is to stay standing whatever was typed says so with forceMount.",
        setup: countriesSetup,
        preview: groupsPreview,
        code: groupsCode,
    },
    {
        name: "More than one at a time",
        description:
            "A combobox holding several items rather than one. The list stays standing as each is taken and the field is emptied so the next can be typed for straight away, neither of which has to be asked for: a combobox holding one item at a time closes and writes what was picked into the field instead. What is held is drawn beside the field, since there is nothing left in the field saying what it is.",
        setup: multipleSetup,
        preview: <MultiplePreview />,
        code: multipleCode,
    },
    {
        name: "How the list answers what is typed",
        description:
            "Nothing at all, the best answer taken in hand as it is typed so Enter takes it without the arrows ever being pressed, or that answer written into the field behind the caret so the rest of it can be taken by carrying on. Only the part that was not typed is selected, so typing on replaces the completion rather than following it, and rubbing it out is not answered with another one.",
        setup: fruitSetup,
        preview: behaviourPreview,
        code: behaviourCode,
    },
    {
        name: "A name that is nobody's",
        description:
            "A field allowed to keep text that names no item, for the places what is typed is worth as much as what is listed. Left to itself the field goes back to what is held once the reader has gone elsewhere, so that a name standing in it always stands for a choice.",
        setup: customValueSetup,
        preview: <CustomValuePreview />,
        code: customValueCode,
    },
    {
        name: "Items that cannot be picked",
        description:
            "An item that is still shown but cannot be taken, so a reader can see what is there and why it is out of reach. The arrows step over it rather than resting on something there is nothing to do with.",
        setup: fruitSetup,
        preview: disabledItemsPreview,
        code: disabledItemsCode,
    },
    {
        name: "Narrowed somewhere else",
        description:
            "The list narrowed against something the combobox cannot see, a server most often. The items are left exactly as they were written and what answers what was typed is worked out elsewhere, which is what shouldFilter turns off. The field says it is waiting while the answer is on its way, and what is said in place of an empty list can name what was searched for.",
        setup: asynchronousSetup,
        preview: <AsynchronousPreview />,
        code: asynchronousCode,
    },
    {
        name: "Shown without being changed, and switched off",
        description:
            "What each of the two stops is different. A field that is only being read from still opens its list, since there is nothing wrong with looking at what is there, and it draws no button for clearing what it holds. One that is switched off answers nothing at all and is taken out of the tab order.",
        setup: fruitSetup,
        preview: statesPreview,
        code: statesCode,
    },
    {
        name: "In a form",
        description:
            "The field carries what was typed rather than what was picked, so what is held is submitted through fields of its own that the combobox writes for it. A combobox holding several writes one for each, so they all arrive under the same name.",
        setup: inAFormSetup,
        preview: <InAFormPreview />,
        code: inAFormCode,
    },
];

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// A button standing inside the field is only ever an icon, and each carries one already, so what
// is said about the prop is the same for both of them
const triggerIcon = {
    name: "icon",
    type: "ButtonVisual",
    description:
        "What the button is drawn as, in place of the icon that stands for what it does. A button standing inside a field is never a stop of its own, so it is named by a label of its own rather than by anything on the page",
};

// Every prop the combobox and its parts take, under the part that takes it.
//
// The combobox comes first, since everything about what is held, what is showing and how what is
// typed is answered is settled there and every part reads it. The parts follow in the order they
// are written: what names the field, what holds it, the field itself and the buttons in it, then
// where the list stands and everything down to the row inside it
const groups: ComponentPropGroup[] = [
    {
        name: "Combobox",
        props: [
            {
                name: "value",
                type: "string[]",
                description:
                    "What has been picked, where the state is held by whoever is drawing the combobox. It is always a list, whether or not more than one can be held at a time",
            },
            {
                name: "defaultValue",
                type: "string[]",
                default: "[]",
                description: "What is held to start with, for a combobox keeping its own state",
            },
            {
                name: "onValueChange",
                type: "(value: string[]) => void",
                description: "Called with everything held whenever what is held changes",
            },
            {
                name: "onSelect",
                type: "(value: string) => void",
                description:
                    "Called with the value of the item that was picked, whether or not it was already being held",
            },
            {
                name: "inputValue",
                type: "string",
                description:
                    "What stands in the field, where the state is held by whoever is drawing the combobox",
            },
            {
                name: "defaultInputValue",
                type: "string",
                default: '""',
                description:
                    "What stands in the field to start with, for a combobox keeping its own state",
            },
            {
                name: "onInputValueChange",
                type: "(inputValue: string) => void",
                description:
                    "Called with what stands in the field whenever it changes, which is what a caller narrowing the items themselves listens to",
            },
            {
                name: "open",
                type: "boolean",
                description: "Whether the list is showing, where the caller holds the state",
            },
            {
                name: "defaultOpen",
                type: "boolean",
                default: "false",
                description: "Whether the list is showing to start with",
            },
            {
                name: "onOpenChange",
                type: "(open: boolean) => void",
                description: "Called with whether the list is showing whenever that changes",
            },
            {
                name: "highlightedValue",
                type: "string | null",
                description:
                    "The item in hand, which Enter takes and the field points at, where the caller holds the state",
            },
            {
                name: "defaultHighlightedValue",
                type: "string | null",
                default: "null",
                description: "The item in hand to start with",
            },
            {
                name: "onHighlightChange",
                type: "(highlightedValue: string | null) => void",
                description: "Called with the item in hand whenever it changes",
            },
            {
                name: "multiple",
                type: "boolean",
                default: "false",
                description: "Whether more than one item can be held at a time",
            },
            {
                name: "closeOnSelect",
                type: "boolean",
                default: "!multiple",
                description:
                    "Whether picking an item takes the list down. Left out, a combobox holding one item at a time closes and one holding several stays standing for the next",
            },
            {
                name: "selectionBehavior",
                type: '"replace" | "clear" | "preserve"',
                default: 'multiple ? "clear" : "replace"',
                options: ["replace", "clear", "preserve"],
                description:
                    "What becomes of what was typed once something has been picked: it is replaced by the name of what was picked, rubbed out so the next one can be typed for, or left exactly as it stands",
            },
            {
                name: "inputBehavior",
                type: '"none" | "autohighlight" | "autocomplete"',
                default: '"none"',
                options: ["none", "autohighlight", "autocomplete"],
                description:
                    "How the list answers what is being typed: not at all, with the best answer taken in hand as it is typed, or with that answer written into the field behind the caret so the rest of it can be taken by carrying on",
            },
            {
                name: "allowCustomValue",
                type: "boolean",
                default: "false",
                description:
                    "Whether the field may keep text that names no item. Left out, what was typed is put back to what is held once the reader goes elsewhere, so a name standing in the field always stands for a choice",
            },
            {
                name: "loopFocus",
                type: "boolean",
                default: "false",
                description:
                    "Whether stepping off either end of the list comes round to the other rather than stopping",
            },
            {
                name: "openOnClick",
                type: "boolean",
                default: "false",
                description:
                    "Whether clicking the field opens the list. The button beside it opens the list whatever this says",
            },
            {
                name: "openOnChange",
                type: "boolean",
                default: "true",
                description: "Whether typing opens the list",
            },
            {
                name: "openOnKeyPress",
                type: "boolean",
                default: "true",
                description: "Whether the arrow keys open the list",
            },
            {
                name: "filter",
                type: "(label: string, inputValue: string) => boolean",
                description:
                    "Stands in for the ranking the combobox does itself, for a caller who wants an item kept or dropped on terms of their own",
            },
            {
                name: "shouldFilter",
                type: "boolean",
                default: "true",
                description:
                    "Whether the combobox narrows the items at all. Turned off, they are left exactly as they were written, which is what a caller narrowing them against something the combobox cannot see wants",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description: "Stops the combobox being used, and takes it out of the tab order",
            },
            {
                name: "readOnly",
                type: "boolean",
                default: "false",
                description:
                    "Shows what is held without letting it be changed. The list still opens, since there is nothing wrong with looking at what is there",
            },
            {
                name: "invalid",
                type: "boolean",
                default: "false",
                description: "Colours the control and marks the field invalid to a screen reader",
            },
            {
                name: "required",
                type: "boolean",
                default: "false",
                description: "Says a choice has to be made, which a caller checks for itself",
            },
            {
                name: "placeholder",
                type: "string",
                description: "Stands in the field until something has been typed into it",
            },
            {
                name: "name",
                type: "string",
                description:
                    "The name what is held is submitted under with the form the combobox stands in. A combobox holding several submits one field for each, all under this name",
            },
            {
                name: "form",
                type: "string",
                description: "The form those values belong to, for a combobox standing outside it",
            },
            styling,
        ],
    },
    {
        name: "Combobox.Label",
        props: [styling],
    },
    {
        name: "Combobox.Control",
        props: [styling],
    },
    {
        name: "Combobox.Input",
        props: [styling],
    },
    {
        name: "Combobox.Trigger",
        props: [triggerIcon, styling],
    },
    {
        name: "Combobox.ClearTrigger",
        props: [triggerIcon, styling],
    },
    {
        name: "Combobox.Positioner",
        props: [
            {
                name: "side",
                type: '"outside-top" | "outside-right" | "outside-bottom" | "outside-left"',
                default: '"outside-bottom"',
                options: ["outside-top", "outside-right", "outside-bottom", "outside-left"],
                description:
                    "Which edge of the field the list stands off. It is turned to the other side where the viewport leaves no room for it there",
            },
            {
                name: "align",
                type: '"start" | "center" | "end"',
                default: '"start"',
                options: ["start", "center", "end"],
                description: "Where along that edge the list lines up",
            },
            {
                name: "portalContainerName",
                type: "string",
                description:
                    "The portal the list is drawn into, for a page that keeps more than one. The list is drawn out of the page so that a field standing in a region that clips or scrolls still has its list drawn whole",
            },
            styling,
        ],
    },
    {
        name: "Combobox.Content",
        props: [styling],
    },
    {
        name: "Combobox.List",
        props: [styling],
    },
    {
        name: "Combobox.ItemGroup",
        props: [
            {
                name: "forceMount",
                type: "boolean",
                default: "false",
                description:
                    "Keeps the group standing even where what was typed has left it with nothing in it. Left out, a group with nothing left to head stands down along with its name",
            },
            styling,
        ],
    },
    {
        name: "Combobox.ItemGroupLabel",
        props: [styling],
    },
    {
        name: "Combobox.Item",
        props: [
            {
                name: "value",
                type: "string",
                required: true,
                description: "What the combobox is left holding once the item is picked",
            },
            {
                name: "label",
                type: "string",
                description:
                    "What the item reads as, which is what typing at the field is matched against. Taken from the text the item is written with where it is left out, so it is only given where the item is drawn from more than words",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description:
                    "Stops the item being picked. It is still shown, so a reader can see what is there, and the arrows step over it",
            },
            {
                name: "onSelect",
                type: "(value: string) => void",
                description: "Called with the item's own value when it is picked",
            },
            styling,
        ],
    },
    {
        name: "Combobox.ItemText",
        props: [styling],
    },
    {
        name: "Combobox.ItemIndicator",
        props: [styling],
    },
    {
        name: "Combobox.Empty",
        props: [styling],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the combobox is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const Combobox = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Combobox
            </Heading>
            <Text as="p" size="large">
                A field that is answered from a list standing under it. What is typed narrows the
                list, the arrow keys run down what is left, and Enter takes whatever is in hand. The
                field keeps the caret throughout and points at whichever item it is holding, so the
                list is read without focus ever leaving what is being typed into. Every part is the
                caller's to place: the combobox itself only says which of the items are still worth
                showing.
            </Text>
        </Stack>
        <ComponentExamples component="Combobox" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Combobox;
