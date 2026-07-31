import * as React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { Autocomplete } from ".";
import type { AutocompleteItem, AutocompleteMenuProps } from "./Autocomplete.types";

const originalResizeObserver = window.ResizeObserver;

const topics: AutocompleteItem[] = [
    { id: "css", text: "css" },
    { id: "css-in-js", text: "css-in-js" },
    { id: "javascript", text: "javascript" },
    { id: "react", text: "react" },
];

type FixtureProps = Partial<AutocompleteMenuProps> & { openOnFocus?: boolean };

const Fixture = ({ openOnFocus = false, ...menuProps }: FixtureProps = {}) => (
    <>
        <label id="topic-label" htmlFor="topic">
            Topic
        </label>
        <Autocomplete id="topic">
            <Autocomplete.Input placeholder="Search topics" openOnFocus={openOnFocus} />
            <Autocomplete.Overlay>
                <Autocomplete.Menu items={topics} aria-labelledby="topic-label" {...menuProps} />
            </Autocomplete.Overlay>
        </Autocomplete>
    </>
);

const field = () => screen.getByRole("combobox") as HTMLInputElement;

const listbox = () => screen.queryByRole("listbox");

const options = () => screen.queryAllByRole("option");

const optionNames = () => options().map((option) => option.textContent);

// Focus is put on the field for real, rather than only fired at it, so that the completion —
// which is only ever written into a field being typed into — is written
const focusField = () => {
    act(() => {
        field().focus();
    });
};

// The list is opened the way a reader opens it
const openList = () => {
    focusField();

    if (!listbox()) {
        fireEvent.keyDown(field(), { key: "ArrowDown" });
    }
};

describe("Autocomplete", () => {
    // jsdom has no ResizeObserver, and the surface the list stands on watches both itself and
    // the field so it can be placed again as either grows
    beforeEach(() => {
        window.ResizeObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
        } as unknown as typeof ResizeObserver;
    });

    afterEach(() => {
        window.ResizeObserver = originalResizeObserver;
    });

    it("renders the field as a combobox that says what it controls", () => {
        render(<Fixture />);

        expect(field()).toHaveAttribute("role", "combobox");
        expect(field()).toHaveAttribute("aria-haspopup", "listbox");
        expect(field()).toHaveAttribute("aria-autocomplete", "both");
        expect(field()).toHaveAttribute("aria-controls", "topic-listbox");
        expect(field()).toHaveAttribute("aria-expanded", "false");
    });

    it("tags the field and its parts with data-component attributes", () => {
        render(<Fixture />);

        for (const name of ["Autocomplete.Input", "Autocomplete.Overlay", "Autocomplete.Menu"]) {
            expect(document.querySelector(`[data-component="${name}"]`)).not.toBeNull();
        }
    });

    it("keeps the list off the page until the field is used", () => {
        render(<Fixture />);

        expect(listbox()).toBeNull();
        expect(options()).toHaveLength(0);
    });

    it("shows the list once something is typed", () => {
        render(<Fixture />);
        fireEvent.change(field(), { target: { value: "c" } });

        expect(listbox()).not.toBeNull();
        expect(field()).toHaveAttribute("aria-expanded", "true");
    });

    it("shows the list as the field takes focus when it is told to", () => {
        render(<Fixture openOnFocus />);
        focusField();

        expect(listbox()).not.toBeNull();
    });

    it("leaves the list closed on focus unless it is told otherwise", () => {
        render(<Fixture />);
        focusField();

        expect(listbox()).toBeNull();
    });

    it("shows the list from the arrow keys", () => {
        render(<Fixture />);
        fireEvent.keyDown(field(), { key: "ArrowDown" });

        expect(listbox()).not.toBeNull();
    });

    it("names the list by the label the field carries", () => {
        render(<Fixture openOnFocus />);
        openList();

        expect(listbox()).toHaveAttribute("id", "topic-listbox");
        expect(listbox()).toHaveAttribute("aria-labelledby", "topic-label");
    });

    it("renders the list outside the tree it was written in", () => {
        const { container } = render(<Fixture openOnFocus />);
        openList();

        const overlay = document.querySelector('[data-component="Autocomplete.Overlay"]');

        expect(document.body).toContainElement(overlay as HTMLElement);
        expect(container).not.toContainElement(overlay as HTMLElement);
    });

    describe("filtering", () => {
        it("keeps the options that begin with what has been typed", () => {
            render(<Fixture openOnFocus />);
            openList();
            fireEvent.change(field(), { target: { value: "css" } });

            expect(optionNames()).toEqual(["css", "css-in-js"]);
        });

        it("pays no attention to case", () => {
            render(<Fixture openOnFocus />);
            openList();
            fireEvent.change(field(), { target: { value: "CSS-IN" } });

            expect(optionNames()).toEqual(["css-in-js"]);
        });

        it("narrows the options with a filter of the caller's own", () => {
            render(<Fixture openOnFocus filter={(item) => item.text === "react"} />);
            openList();

            expect(optionNames()).toEqual(["react"]);
        });

        it("stands a line of text in place of a list with nothing left in it", () => {
            render(<Fixture openOnFocus />);
            openList();
            fireEvent.change(field(), { target: { value: "nothing matches this" } });

            expect(listbox()).toBeNull();
            expect(screen.getByText("No selectable options")).toBeInTheDocument();
        });

        it("says nothing at all where it is told not to", () => {
            render(<Fixture openOnFocus emptyStateText={false} items={[]} />);
            openList();

            expect(listbox()).toBeNull();
            expect(document.querySelector('[data-component="Autocomplete.EmptyState"]')).toBeNull();
        });
    });

    describe("moving through the options", () => {
        it("points the field at the option the arrow keys have reached", () => {
            render(<Fixture openOnFocus />);
            openList();
            fireEvent.keyDown(field(), { key: "ArrowDown" });

            expect(field()).toHaveAttribute("aria-activedescendant", options()[0].id);
            expect(options()[0]).toHaveAttribute("data-active", "");
        });

        it("moves on down the list, and back up it again", () => {
            render(<Fixture openOnFocus />);
            openList();

            fireEvent.keyDown(field(), { key: "ArrowDown" });
            fireEvent.keyDown(field(), { key: "ArrowDown" });
            expect(field()).toHaveAttribute("aria-activedescendant", options()[1].id);

            fireEvent.keyDown(field(), { key: "ArrowUp" });
            expect(field()).toHaveAttribute("aria-activedescendant", options()[0].id);
        });

        it("comes round to the other end of the list", () => {
            render(<Fixture openOnFocus />);
            openList();
            fireEvent.keyDown(field(), { key: "ArrowUp" });

            const last = options()[options().length - 1];
            expect(field()).toHaveAttribute("aria-activedescendant", last.id);
        });

        it("keeps the options out of the page's own tab order", () => {
            render(<Fixture openOnFocus />);
            openList();

            for (const option of options()) {
                expect(option).toHaveAttribute("tabindex", "-1");
            }
        });

        it("leaves focus in the field throughout", () => {
            render(<Fixture openOnFocus />);
            openList();
            fireEvent.keyDown(field(), { key: "ArrowDown" });

            expect(document.activeElement).toBe(field());
        });
    });

    describe("an option that says more about itself", () => {
        const described = (descriptionVariant?: "inline" | "block"): AutocompleteItem[] => [
            {
                id: "ada",
                text: "Ada Lovelace",
                description: "Analytical engine",
                descriptionVariant,
            },
        ];

        it("stands the description beside the label by default", () => {
            render(<Fixture openOnFocus items={described()} />);
            openList();

            expect(
                document.querySelector('[data-component="ActionList.Description"]'),
            ).toHaveAttribute("data-variant", "inline");
        });

        it("stands it below the label where it is told to", () => {
            render(<Fixture openOnFocus items={described("block")} />);
            openList();

            expect(
                document.querySelector('[data-component="ActionList.Description"]'),
            ).toHaveAttribute("data-variant", "block");
        });

        it("reads the description as part of the option", () => {
            render(<Fixture openOnFocus items={described("block")} />);
            openList();

            expect(
                screen.getByRole("option", { name: "Ada Lovelace" }),
            ).toHaveAccessibleDescription("Analytical engine");
        });
    });

    describe("pointing at an option", () => {
        it("makes whatever the pointer is over the highlighted option", () => {
            render(<Fixture openOnFocus />);
            openList();
            fireEvent.mouseMove(screen.getByRole("option", { name: "react" }));

            const pointedAt = screen.getByRole("option", { name: "react" });

            expect(field()).toHaveAttribute("aria-activedescendant", pointedAt.id);
            expect(pointedAt).toHaveAttribute("data-active", "");
        });

        it("leaves the list drawing a single highlight", () => {
            render(<Fixture openOnFocus />);
            openList();
            fireEvent.keyDown(field(), { key: "ArrowDown" });
            expect(options()[0]).toHaveAttribute("data-active", "");

            fireEvent.mouseMove(screen.getByRole("option", { name: "react" }));

            expect(options().filter((option) => option.hasAttribute("data-active"))).toEqual([
                screen.getByRole("option", { name: "react" }),
            ]);
        });

        it("leaves what has been typed as it stands", () => {
            render(<Fixture openOnFocus />);
            openList();
            fireEvent.change(field(), { target: { value: "cs" } });
            fireEvent.mouseMove(screen.getByRole("option", { name: "css-in-js" }));

            expect(field().value).toBe("cs");
        });

        it("completes it again once the keys take over", () => {
            render(<Fixture openOnFocus />);
            openList();
            fireEvent.change(field(), { target: { value: "cs" } });
            fireEvent.mouseMove(screen.getByRole("option", { name: "css-in-js" }));
            fireEvent.keyDown(field(), { key: "ArrowDown" });

            expect(field().value).toBe("css");
        });

        it("picks whatever it is over when Enter is pressed", () => {
            render(<Fixture openOnFocus />);
            openList();
            fireEvent.mouseMove(screen.getByRole("option", { name: "react" }));
            fireEvent.keyDown(field(), { key: "Enter" });

            expect(field().value).toBe("react");
        });
    });

    describe("an option that cannot be picked", () => {
        const withDisabled: AutocompleteItem[] = [
            { id: "css", text: "css" },
            { id: "css-in-js", text: "css-in-js", disabled: true },
            { id: "javascript", text: "javascript" },
        ];

        it("is passed over by the arrow keys", () => {
            render(<Fixture openOnFocus items={withDisabled} />);
            openList();
            fireEvent.keyDown(field(), { key: "ArrowDown" });
            fireEvent.keyDown(field(), { key: "ArrowDown" });

            expect(field()).toHaveAttribute(
                "aria-activedescendant",
                screen.getByRole("option", { name: "javascript" }).id,
            );
        });

        it("is not highlighted by the pointer", () => {
            render(<Fixture openOnFocus items={withDisabled} />);
            openList();
            fireEvent.mouseMove(screen.getByRole("option", { name: "css-in-js" }));

            expect(field()).not.toHaveAttribute("aria-activedescendant");
        });

        it("is not picked when it is pressed", () => {
            render(<Fixture openOnFocus items={withDisabled} />);
            openList();
            fireEvent.click(screen.getByRole("option", { name: "css-in-js" }));

            expect(field().value).toBe("");
            expect(listbox()).not.toBeNull();
        });
    });

    describe("completing what has been typed", () => {
        it("writes the highlighted option into the field, and selects the rest of it", () => {
            render(<Fixture openOnFocus />);
            openList();
            fireEvent.change(field(), { target: { value: "cs" } });
            fireEvent.keyDown(field(), { key: "ArrowDown" });

            expect(field().value).toBe("css");
            expect(field().selectionStart).toBe(2);
            expect(field().selectionEnd).toBe(3);
        });

        it("takes the completion back off again as the highlight moves away", () => {
            render(<Fixture openOnFocus />);
            openList();
            fireEvent.change(field(), { target: { value: "cs" } });
            fireEvent.keyDown(field(), { key: "ArrowDown" });
            expect(field().value).toBe("css");

            fireEvent.keyDown(field(), { key: "Escape" });
            expect(field().value).toBe("cs");
        });

        it("does not complete what is being rubbed out", () => {
            render(<Fixture openOnFocus />);
            openList();
            fireEvent.keyDown(field(), { key: "Backspace" });
            fireEvent.change(field(), { target: { value: "cs" } });
            fireEvent.keyDown(field(), { key: "ArrowDown" });

            expect(field().value).toBe("cs");
        });
    });

    describe("picking an option", () => {
        it("puts the option's text in the field and closes the list", () => {
            render(<Fixture openOnFocus />);
            openList();
            fireEvent.keyDown(field(), { key: "ArrowDown" });
            fireEvent.keyDown(field(), { key: "Enter" });

            expect(field().value).toBe("css");
            expect(listbox()).toBeNull();
        });

        it("picks the option that is pressed", () => {
            render(<Fixture openOnFocus />);
            openList();
            fireEvent.click(screen.getByRole("option", { name: "react" }));

            expect(field().value).toBe("react");
            expect(listbox()).toBeNull();
        });

        it("leaves the list alone where nothing is highlighted", () => {
            render(<Fixture openOnFocus />);
            openList();
            fireEvent.keyDown(field(), { key: "Enter" });

            expect(listbox()).not.toBeNull();
        });

        it("reports the picked option to a caller holding the selection", () => {
            const onSelectedChange = jest.fn();
            render(<Fixture openOnFocus onSelectedChange={onSelectedChange} />);
            openList();
            fireEvent.click(screen.getByRole("option", { name: "react" }));

            expect(onSelectedChange).toHaveBeenCalledWith([{ id: "react", text: "react" }]);
        });

        it("replaces what was picked where only one option can be", () => {
            const onSelectedChange = jest.fn();
            render(
                <Fixture
                    openOnFocus
                    selectedItemIds={["react"]}
                    onSelectedChange={onSelectedChange}
                />,
            );
            openList();
            fireEvent.click(screen.getByRole("option", { name: "css" }));

            expect(onSelectedChange).toHaveBeenCalledWith([{ id: "css", text: "css" }]);
        });

        it("says which options are picked", () => {
            render(<Fixture openOnFocus selectedItemIds={["react"]} />);
            openList();

            expect(screen.getByRole("option", { name: "react" })).toHaveAttribute(
                "aria-selected",
                "true",
            );
            expect(screen.getByRole("option", { name: "css" })).toHaveAttribute(
                "aria-selected",
                "false",
            );
        });
    });

    describe("picking several options", () => {
        const several = (props: FixtureProps = {}) => (
            <Fixture openOnFocus selectionVariant="multiple" {...props} />
        );

        it("empties the field and leaves the list showing", () => {
            render(several());
            openList();
            fireEvent.change(field(), { target: { value: "re" } });
            fireEvent.click(screen.getByRole("option", { name: "react" }));

            expect(field().value).toBe("");
            expect(listbox()).not.toBeNull();
        });

        it("adds to what was already picked", () => {
            const onSelectedChange = jest.fn();
            render(several({ selectedItemIds: ["css"], onSelectedChange }));
            openList();
            fireEvent.click(screen.getByRole("option", { name: "react" }));

            expect(onSelectedChange).toHaveBeenCalledWith([
                { id: "css", text: "css" },
                { id: "react", text: "react" },
            ]);
        });

        it("drops an option that was already picked", () => {
            const onSelectedChange = jest.fn();
            render(several({ selectedItemIds: ["react"], onSelectedChange }));
            openList();
            fireEvent.click(screen.getByRole("option", { name: "react" }));

            expect(onSelectedChange).toHaveBeenCalledWith([]);
        });

        it("brings the picked options to the top once the list has closed", () => {
            render(several({ selectedItemIds: ["react"] }));
            openList();

            expect(optionNames()).toEqual(["react", "css", "css-in-js", "javascript"]);
        });

        it("orders the options the way the caller asks once the list has closed", () => {
            render(
                several({
                    selectedItemIds: ["react"],
                    sortOnClose: (itemIdA, itemIdB) => itemIdA.localeCompare(itemIdB),
                }),
            );
            openList();

            expect(optionNames()).toEqual(["css", "css-in-js", "javascript", "react"]);
        });
    });

    describe("adding an option the list does not hold", () => {
        const addNewItem = (onAdd: (item: AutocompleteItem) => void) => ({
            item: { id: "graphql", text: 'Add "graphql"' },
            onAdd,
        });

        it("stands the new option at the end of the list", () => {
            render(<Fixture openOnFocus addNewItem={addNewItem(() => {})} />);
            openList();

            expect(optionNames()[options().length - 1]).toBe('Add "graphql"');
        });

        it("hands the new option back when it is picked", () => {
            const onAdd = jest.fn();
            render(<Fixture openOnFocus addNewItem={addNewItem(onAdd)} />);
            openList();
            fireEvent.click(screen.getByRole("option", { name: 'Add "graphql"' }));

            expect(onAdd).toHaveBeenCalledWith({ id: "graphql", text: 'Add "graphql"' });
        });

        it("leaves the options alone", () => {
            const onSelectedChange = jest.fn();
            render(
                <Fixture
                    openOnFocus
                    onSelectedChange={onSelectedChange}
                    addNewItem={addNewItem(() => {})}
                />,
            );
            openList();
            fireEvent.click(screen.getByRole("option", { name: 'Add "graphql"' }));

            expect(onSelectedChange).not.toHaveBeenCalled();
        });
    });

    describe("waiting on its options", () => {
        it("stands a spinner in place of the list", () => {
            render(<Fixture openOnFocus loading items={[]} />);
            openList();

            expect(listbox()).toBeNull();
            expect(
                document.querySelector('[data-component="Autocomplete.Loading"]'),
            ).not.toBeNull();
            expect(document.querySelector('[data-component="Spinner"]')).not.toBeNull();
        });
    });

    describe("dismissing the list", () => {
        it("closes it on Escape, and clears the field on a second press", () => {
            render(<Fixture openOnFocus />);
            openList();
            fireEvent.change(field(), { target: { value: "cs" } });

            fireEvent.keyDown(field(), { key: "Escape" });
            expect(listbox()).toBeNull();
            expect(field().value).toBe("cs");

            fireEvent.keyDown(field(), { key: "Escape" });
            expect(field().value).toBe("");
        });

        it("closes it as focus leaves the field", () => {
            render(<Fixture openOnFocus />);
            openList();
            fireEvent.blur(field());

            expect(listbox()).toBeNull();
        });

        it("closes it on a press that lands anywhere else", () => {
            render(<Fixture openOnFocus />);
            openList();
            fireEvent.mouseDown(document.body);

            expect(listbox()).toBeNull();
        });

        it("leaves it showing for a press that lands on the field", () => {
            render(<Fixture openOnFocus />);
            openList();
            fireEvent.mouseDown(field());

            expect(listbox()).not.toBeNull();
        });

        it("reports when it opens and when it closes", () => {
            const onOpenChange = jest.fn();
            render(<Fixture openOnFocus onOpenChange={onOpenChange} />);

            expect(onOpenChange).not.toHaveBeenCalled();

            openList();
            expect(onOpenChange).toHaveBeenCalledWith(true);

            fireEvent.blur(field());
            expect(onOpenChange).toHaveBeenLastCalledWith(false);
        });
    });

    describe("announcements", () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        // The list holds a spinner of its own, which is read as a status too, so the live
        // region is reached for by name rather than by role
        const announcement = () =>
            document.querySelector('[data-component="Autocomplete.Announcement"]');

        it("says nothing about a list that is not showing", () => {
            render(<Fixture />);

            act(() => {
                jest.runAllTimers();
            });

            expect(announcement()).toBeEmptyDOMElement();
        });

        it("says how many options are left once the list is showing", () => {
            render(<Fixture openOnFocus />);
            openList();

            act(() => {
                jest.runAllTimers();
            });

            expect(announcement()).toHaveTextContent("4 options available.");
        });
    });

    describe("without a surface for the list to stand on", () => {
        it("draws the list where it stands", () => {
            render(
                <>
                    <label id="inline-label" htmlFor="inline">
                        Topic
                    </label>
                    <Autocomplete id="inline">
                        <Autocomplete.Input />
                        <Autocomplete.Menu items={topics} aria-labelledby="inline-label" />
                    </Autocomplete>
                </>,
            );

            expect(screen.getByRole("listbox")).toBeInTheDocument();
            expect(screen.getAllByRole("option")).toHaveLength(topics.length);
        });
    });

    it("forwards a ref to the field", () => {
        const ref = React.createRef<HTMLInputElement>();
        render(
            <Autocomplete id="ref-topic">
                <Autocomplete.Input ref={ref} />
                <Autocomplete.Overlay>
                    <Autocomplete.Menu items={topics} aria-labelledby="ref-topic" />
                </Autocomplete.Overlay>
            </Autocomplete>,
        );

        expect(ref.current).toBe(field());
    });

    it("still calls the handlers the caller passed to the field", () => {
        const onChange = jest.fn();
        const onKeyDown = jest.fn();
        render(
            <Autocomplete id="handlers-topic">
                <Autocomplete.Input onChange={onChange} onKeyDown={onKeyDown} />
                <Autocomplete.Overlay>
                    <Autocomplete.Menu items={topics} aria-labelledby="handlers-topic" />
                </Autocomplete.Overlay>
            </Autocomplete>,
        );

        fireEvent.change(field(), { target: { value: "c" } });
        fireEvent.keyDown(field(), { key: "ArrowDown" });

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onKeyDown).toHaveBeenCalledTimes(1);
    });

    it("merges a custom className onto the surface and the list", () => {
        render(
            <Autocomplete id="class-topic">
                <Autocomplete.Input />
                <Autocomplete.Overlay className="surface">
                    <Autocomplete.Menu
                        items={topics}
                        className="list"
                        aria-labelledby="class-topic"
                    />
                </Autocomplete.Overlay>
            </Autocomplete>,
        );

        expect(document.querySelector('[data-component="Autocomplete.Overlay"]')).toHaveClass(
            "surface",
        );
        expect(document.querySelector('[data-component="Autocomplete.Menu"]')).toHaveClass("list");
    });
});
