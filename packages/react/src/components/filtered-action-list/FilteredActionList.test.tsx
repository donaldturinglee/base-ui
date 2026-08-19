import * as React from "react";
import { fireEvent, render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { PersonRegular } from "@gamecrafters/base-ui-icons";
import { FilteredActionList } from ".";
import type {
    FilteredActionListItemInput,
    FilteredActionListProps,
} from "./FilteredActionList.types";

const people = ["Monalisa Octocat", "Hubot", "Mona Lisa", "Octocat"];

const peopleItems: FilteredActionListItemInput[] = people.map((name, index) => ({
    id: index,
    text: name,
    leadingVisual: PersonRegular,
}));

type ListProps = Partial<Omit<FilteredActionListProps, "onFilterChange">> & {
    onFilterChange?: FilteredActionListProps["onFilterChange"];
};

const renderList = (props: ListProps = {}) =>
    render(
        <FilteredActionList
            placeholderText="Filter people"
            items={peopleItems}
            onFilterChange={() => {}}
            {...props}
        />,
    );

const list = () => screen.getByRole("listbox");

const field = () => screen.getByRole("combobox");

const options = () => screen.getAllByRole("option");

// The rows of the skeleton, which are the stacks standing directly within it
const skeletonRows = () =>
    document.querySelectorAll(
        "[data-component='FilteredActionList.Skeleton'] > [data-component='Stack']",
    );

const originalResizeObserver = window.ResizeObserver;

describe("FilteredActionList", () => {
    // jsdom has no ResizeObserver, and the list watches the box a loader stands in so that
    // the skeleton can be drawn at the size of it
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

    it("renders a field above the list it filters", () => {
        renderList();

        expect(field()).toHaveAccessibleName("Filter people");
        expect(field()).toHaveAttribute("aria-controls", list().id);
        expect(field()).toHaveAttribute("aria-autocomplete", "list");
    });

    it("tags the list and the parts around it with data-component attributes", () => {
        const { container } = renderList();

        expect(container.firstElementChild).toHaveAttribute("data-component", "FilteredActionList");
        expect(
            container.querySelector("[data-component='FilteredActionList.Header']"),
        ).toBeTruthy();
        expect(
            container.querySelector("[data-component='FilteredActionList.Container']"),
        ).toBeTruthy();
    });

    it("renders every item it is given, in the order they were written", () => {
        renderList();

        expect(options().map((option) => option.textContent)).toEqual(people);
    });

    it("says which item each option stands for", () => {
        renderList();

        expect(options()[1]).toHaveAttribute("data-id", "1");
    });

    it("draws the text, description and trailing visual of an item", () => {
        renderList({
            items: [{ id: "main", text: "main", description: "default", trailingVisual: "3d" }],
        });

        expect(options()[0]).toHaveTextContent("main");
        expect(options()[0]).toHaveTextContent("default");
        expect(options()[0]).toHaveTextContent("3d");
    });

    it("says which items are picked, where the items can be picked at all", () => {
        renderList({
            selectionVariant: "multiple",
            items: peopleItems.map((item, index) => ({ ...item, selected: index === 1 })),
        });

        expect(options()[0]).toHaveAttribute("aria-selected", "false");
        expect(options()[1]).toHaveAttribute("aria-selected", "true");
    });

    it("tells the caller what was typed into the field", () => {
        const onFilterChange = vi.fn();
        renderList({ onFilterChange });

        fireEvent.change(field(), { target: { value: "octo" } });

        expect(onFilterChange).toHaveBeenCalledWith("octo", expect.anything());
    });

    it("keeps the text itself where the caller is not holding it", () => {
        renderList();

        fireEvent.change(field(), { target: { value: "octo" } });

        expect(field()).toHaveValue("octo");
    });

    it("takes the text from the caller where it is being held", () => {
        renderList({ filterValue: "hubot" });

        fireEvent.change(field(), { target: { value: "octo" } });

        expect(field()).toHaveValue("hubot");
    });

    it("moves focus into the list when the down arrow is pressed in the field", () => {
        renderList();

        fireEvent.keyDown(field(), { key: "ArrowDown" });

        expect(options()[0]).toHaveFocus();
    });

    it("takes the first item when enter is pressed in the field", () => {
        const onAction = vi.fn();
        renderList({ items: peopleItems.map((item) => ({ ...item, onAction })) });

        fireEvent.keyDown(field(), { key: "Enter" });

        expect(onAction).toHaveBeenCalledTimes(1);
    });

    it("calls back with the item that was picked", () => {
        const onAction = vi.fn();
        renderList({ items: peopleItems.map((item) => ({ ...item, onAction })) });

        fireEvent.click(options()[2]);

        expect(onAction).toHaveBeenCalledWith(
            expect.objectContaining({ text: "Mona Lisa" }),
            expect.anything(),
        );
    });

    it("collects the items under the headings they were given", () => {
        renderList({
            items: [
                { id: "bug", text: "bug", groupId: "type" },
                { id: "help", text: "help wanted", groupId: "effort" },
            ],
            groupMetadata: [
                { groupId: "type", header: { title: "Type" } },
                { groupId: "effort", header: { title: "Effort" } },
            ],
        });

        expect(
            screen.getAllByRole("group").map((group) => group.getAttribute("aria-label")),
        ).toEqual(["Type", "Effort"]);
    });

    it("stands a spinner in place of the list while it waits", () => {
        const { container } = renderList({ loading: true, items: [] });

        expect(screen.queryByRole("listbox")).toBeNull();
        expect(
            container.querySelector("[data-component='FilteredActionList.Spinner']"),
        ).toBeTruthy();
    });

    it("stands a skeleton in place of the list where it was asked for", () => {
        const { container } = renderList({
            loading: true,
            loadingType: "body-skeleton",
            items: [],
        });

        expect(
            container.querySelector("[data-component='FilteredActionList.Skeleton']"),
        ).toBeTruthy();
    });

    it("draws a few skeleton rows where the box it stands in has no height", () => {
        renderList({ loading: true, loadingType: "body-skeleton", items: [] });

        expect(skeletonRows()).toHaveLength(3);
    });

    describe("a skeleton in a box that has been laid out", () => {
        const originalClientHeight = Object.getOwnPropertyDescriptor(
            HTMLElement.prototype,
            "clientHeight",
        );

        // jsdom lays nothing out, so without this the box the skeleton stands in has no
        // height for it to count its rows off
        beforeEach(() => {
            Object.defineProperty(HTMLElement.prototype, "clientHeight", {
                configurable: true,
                value: 288,
            });
        });

        afterEach(() => {
            if (originalClientHeight) {
                Object.defineProperty(HTMLElement.prototype, "clientHeight", originalClientHeight);
            }
        });

        it("draws as many rows as the box has room for", () => {
            renderList({ loading: true, loadingType: "body-skeleton", items: [] });

            // 288px of room, at a row every 24px
            expect(skeletonRows()).toHaveLength(12);
        });

        it("counts the rows off again when the box is given a size of its own", () => {
            const { rerender } = renderList({ items: [] });

            rerender(
                <FilteredActionList
                    placeholderText="Filter people"
                    items={[]}
                    loading
                    loadingType="body-skeleton"
                    onFilterChange={() => {}}
                />,
            );

            expect(skeletonRows()).toHaveLength(12);
        });
    });

    it("leaves the list where it is when the wait is shown in the field", () => {
        renderList({ loading: true, loadingType: "input" });

        expect(options()).toHaveLength(people.length);
    });

    it("stands a message in place of a list with nothing to show", () => {
        renderList({ items: [], message: <p>No people found</p> });

        expect(screen.queryByRole("listbox")).toBeNull();
        expect(screen.getByText("No people found")).toBeInTheDocument();
    });

    it("gives the message the room the list would have had", () => {
        const { container } = renderList({ items: [], message: <p>No people found</p> });
        const box = container.querySelector("[data-component='FilteredActionList.Message']");

        expect(box).toContainElement(screen.getByText("No people found"));
        // The box the message is laid out in is what a container query inside it measures
        // itself against, so it has to fill the list rather than sit at the width of its own
        // text
        expect(box).toHaveClass("filtered-action-list-message");
    });

    it("shows a box that picks every item at once, where the caller asks for one", () => {
        const onSelectAllChange = vi.fn();
        renderList({ selectionVariant: "multiple", onSelectAllChange });

        const selectAll = screen.getByLabelText("Select all");
        fireEvent.click(selectAll);

        expect(onSelectAllChange).toHaveBeenCalledWith(true);
    });

    it("says the box is part checked where only some of the items are picked", () => {
        renderList({
            selectionVariant: "multiple",
            onSelectAllChange: () => {},
            items: peopleItems.map((item, index) => ({ ...item, selected: index === 0 })),
        });

        expect(screen.getByLabelText("Select all")).toHaveAttribute("aria-checked", "mixed");
    });

    it("offers to clear the box once every item is picked", () => {
        renderList({
            selectionVariant: "multiple",
            onSelectAllChange: () => {},
            items: peopleItems.map((item) => ({ ...item, selected: true })),
        });

        expect(screen.getByLabelText("Deselect all")).toBeChecked();
    });

    it("leaves an item with a renderer of its own to it", () => {
        renderList({
            items: [{ id: "custom", text: "Hubot", renderItem: () => <li>Rendered by hand</li> }],
        });

        expect(screen.getByText("Rendered by hand")).toBeInTheDocument();
    });

    it("draws every item with the list's renderer where they have none of their own", () => {
        renderList({ renderItem: (item) => <li>{item.text} (custom)</li> });

        expect(screen.getByText("Monalisa Octocat (custom)")).toBeInTheDocument();
    });

    it("hands the caller the element the list is drawn as", () => {
        const onListContainerRefChanged = vi.fn();
        renderList({ onListContainerRefChanged });

        expect(onListContainerRefChanged).toHaveBeenCalledWith(list());
    });

    it("hands the caller the ref the field is held by", () => {
        const onInputRefChanged = vi.fn<(ref: React.RefObject<HTMLInputElement | null>) => void>();
        renderList({ onInputRefChanged });

        expect(onInputRefChanged.mock.calls[0][0].current).toBe(field());
    });

    it("takes a class name of the caller's own", () => {
        const { container } = renderList({ className: "custom" });

        expect(container.firstElementChild).toHaveClass("custom");
    });

    describe("announcements", () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        // The field holds a spinner of its own, which is read as a status too, so the live
        // region is reached for by name rather than by role
        const announcement = () =>
            document.querySelector("[data-component='FilteredActionList.Announcement']");

        it("says nothing about a list the reader has only just arrived at", () => {
            renderList();

            act(() => {
                vi.runAllTimers();
            });

            expect(announcement()).toBeEmptyDOMElement();
        });

        it("says how much is left once the list has been filtered", () => {
            const { rerender } = renderList();

            rerender(
                <FilteredActionList
                    placeholderText="Filter people"
                    items={peopleItems.slice(0, 2)}
                    onFilterChange={() => {}}
                />,
            );

            act(() => {
                vi.runAllTimers();
            });

            expect(announcement()).toHaveTextContent("2 items available, 0 selected.");
        });

        it("says what the caller asked for where the filter has left nothing", () => {
            const messageText = { title: "No people found", description: "Try another name." };
            const { rerender } = renderList({ messageText });

            rerender(
                <FilteredActionList
                    placeholderText="Filter people"
                    items={[]}
                    messageText={messageText}
                    onFilterChange={() => {}}
                />,
            );

            act(() => {
                vi.runAllTimers();
            });

            expect(announcement()).toHaveTextContent("No people found. Try another name.");
        });

        it("says nothing at all where the caller has turned announcements off", () => {
            const { rerender } = renderList({ announcementsEnabled: false });

            rerender(
                <FilteredActionList
                    placeholderText="Filter people"
                    items={peopleItems.slice(0, 2)}
                    announcementsEnabled={false}
                    onFilterChange={() => {}}
                />,
            );

            act(() => {
                vi.runAllTimers();
            });

            expect(announcement()).toBeEmptyDOMElement();
        });
    });

    describe("virtualised", () => {
        const manyItems: FilteredActionListItemInput[] = Array.from(
            { length: 500 },
            (_, index) => ({
                id: index,
                text: `Item ${index + 1}`,
            }),
        );

        // The box the list scrolls within is measured by its offset height, and the items
        // it holds by how tall their content stands
        const layout = {
            offsetHeight: 320,
            scrollHeight: 32,
        };

        const originalDescriptors = Object.keys(layout).map(
            (property) =>
                [
                    property,
                    Object.getOwnPropertyDescriptor(HTMLElement.prototype, property),
                ] as const,
        );

        // jsdom lays nothing out, so without these every element stands at no height at all
        // and the virtualiser has nothing to work out what is in view from
        beforeEach(() => {
            for (const [property, value] of Object.entries(layout)) {
                Object.defineProperty(HTMLElement.prototype, property, {
                    configurable: true,
                    value,
                });
            }
        });

        afterEach(() => {
            for (const [property, descriptor] of originalDescriptors) {
                if (descriptor) {
                    Object.defineProperty(HTMLElement.prototype, property, descriptor);
                }
            }
        });

        it("draws only the items in view rather than every one it is given", () => {
            renderList({ items: manyItems, virtualized: true });

            expect(options().length).toBeGreaterThan(0);
            expect(options().length).toBeLessThan(manyItems.length);
        });

        it("says where each drawn item stands in the whole of the list", () => {
            renderList({ items: manyItems, virtualized: true });

            expect(options()[0]).toHaveAttribute("data-index", "0");
        });

        it("stands the list as tall as the whole of it would be", () => {
            renderList({ items: manyItems, virtualized: true });

            expect(list()).toHaveClass("filtered-action-list-virtual-list");
            expect(list().style.height).not.toBe("");
        });

        it("draws the whole of a grouped list, since grouping and virtualising do not mix", () => {
            const { container } = renderList({
                items: manyItems.map((item) => ({ ...item, groupId: "all" })),
                groupMetadata: [{ groupId: "all", header: { title: "All" } }],
                virtualized: true,
            });

            expect(options()).toHaveLength(manyItems.length);
            expect(container.firstElementChild).not.toHaveAttribute("data-virtualized");
        });

        it("moves focus by index across the whole list rather than the drawn part of it", () => {
            renderList({ items: manyItems, virtualized: true });

            fireEvent.keyDown(field(), { key: "ArrowDown" });
            expect(options()[0]).toHaveFocus();

            fireEvent.keyDown(options()[0], { key: "ArrowDown" });
            expect(options()[1]).toHaveFocus();
        });
    });
});
