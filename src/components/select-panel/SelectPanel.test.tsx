import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { ActionList } from "../action-list";
import { FormControl } from "../form-control";
import { SelectPanel } from ".";
import type { SelectPanelProps } from "./SelectPanel.types";

const originalResizeObserver = window.ResizeObserver;

const labels = ["bug", "enhancement", "documentation"];

const Fixture = (props: Partial<SelectPanelProps> = {}) => {
    const [selected, setSelected] = React.useState<string[]>(["bug"]);

    const toggle = (label: string) =>
        setSelected((current) =>
            current.includes(label)
                ? current.filter((value) => value !== label)
                : [...current, label],
        );

    return (
        <SelectPanel title="Select labels" {...props}>
            <SelectPanel.Button>Assign label</SelectPanel.Button>

            <ActionList>
                {labels.map((label) => (
                    <ActionList.Item
                        key={label}
                        onSelect={() => toggle(label)}
                        selected={selected.includes(label)}
                    >
                        {label}
                    </ActionList.Item>
                ))}
            </ActionList>

            <SelectPanel.Footer />
        </SelectPanel>
    );
};

const anchor = () => screen.getByRole("button", { name: /Assign label/ });

const panel = () => document.querySelector("[data-component='SelectPanel']");

const openPanel = () => {
    fireEvent.click(anchor());
};

describe("SelectPanel", () => {
    // jsdom has no ResizeObserver, and the panel watches its own size so it can be placed
    // again as it grows
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

    it("renders the button and nothing else while it is closed", () => {
        render(<Fixture />);

        expect(anchor()).toBeInTheDocument();
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    it("says that the button opens something, and whether it is open", () => {
        render(<Fixture />);

        expect(anchor()).toHaveAttribute("aria-haspopup", "true");
        expect(anchor()).toHaveAttribute("aria-expanded", "false");

        openPanel();
        expect(anchor()).toHaveAttribute("aria-expanded", "true");
    });

    it("opens the panel from its button", () => {
        render(<Fixture />);
        openPanel();

        expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("closes the panel from its button again", () => {
        render(<Fixture />);
        openPanel();
        fireEvent.click(anchor());

        expect(screen.queryByRole("dialog")).toBeNull();
    });

    it("opens on arrival when it is told to", () => {
        render(<Fixture defaultOpen />);
        expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("renders the panel outside the tree it was written in", () => {
        const { container } = render(<Fixture defaultOpen />);

        expect(document.body).toContainElement(panel() as HTMLElement);
        expect(container).not.toContainElement(panel() as HTMLElement);
    });

    it("names the panel by its title", () => {
        render(<Fixture defaultOpen />);
        expect(screen.getByRole("dialog", { name: "Select labels" })).toBeInTheDocument();
    });

    it("describes the panel by its description", () => {
        render(<Fixture defaultOpen description="Pick as many as you like" />);

        const describedBy = screen.getByRole("dialog").getAttribute("aria-describedby");
        expect(describedBy).toBeTruthy();
        expect(document.getElementById(describedBy ?? "")).toHaveTextContent(
            "Pick as many as you like",
        );
    });

    it("tags the panel and its parts with data-component attributes", () => {
        render(<Fixture defaultOpen onClearSelection={() => {}} />);

        for (const name of [
            "SelectPanel",
            "SelectPanel.Backdrop",
            "SelectPanel.Button",
            "SelectPanel.Header",
            "SelectPanel.Footer",
            "SelectPanel.CloseButton",
            "SelectPanel.ClearSelectionButton",
        ]) {
            expect(document.querySelector(`[data-component="${name}"]`)).not.toBeNull();
        }
    });

    it("gives a panel with no header of its own the default one", () => {
        render(<Fixture defaultOpen />);

        expect(screen.getByRole("heading", { name: "Select labels" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    });

    describe("dismissing", () => {
        it("closes and cancels from the close button", () => {
            const onCancel = jest.fn();
            render(<Fixture defaultOpen onCancel={onCancel} />);

            fireEvent.click(screen.getByRole("button", { name: "Close" }));

            expect(screen.queryByRole("dialog")).toBeNull();
            expect(onCancel).toHaveBeenCalledTimes(1);
        });

        it("closes and cancels from the Cancel button", () => {
            const onCancel = jest.fn();
            const onSubmit = jest.fn();
            render(<Fixture defaultOpen onCancel={onCancel} onSubmit={onSubmit} />);

            fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

            expect(screen.queryByRole("dialog")).toBeNull();
            expect(onCancel).toHaveBeenCalledTimes(1);
            expect(onSubmit).not.toHaveBeenCalled();
        });

        it("closes and submits from the Save button", () => {
            const onCancel = jest.fn();
            const onSubmit = jest.fn();
            render(<Fixture defaultOpen onCancel={onCancel} onSubmit={onSubmit} />);

            fireEvent.click(screen.getByRole("button", { name: "Save" }));

            expect(screen.queryByRole("dialog")).toBeNull();
            expect(onSubmit).toHaveBeenCalledTimes(1);
            expect(onCancel).not.toHaveBeenCalled();
        });

        it("closes and cancels on Escape", () => {
            const onCancel = jest.fn();
            render(<Fixture defaultOpen onCancel={onCancel} />);

            fireEvent.keyDown(document, { key: "Escape" });

            expect(screen.queryByRole("dialog")).toBeNull();
            expect(onCancel).toHaveBeenCalledTimes(1);
        });

        it("closes and cancels on a press that lands anywhere else", () => {
            const onCancel = jest.fn();
            render(<Fixture defaultOpen onCancel={onCancel} />);

            fireEvent.click(
                document.querySelector("[data-component='SelectPanel.Backdrop']") as HTMLElement,
            );

            expect(screen.queryByRole("dialog")).toBeNull();
            expect(onCancel).toHaveBeenCalledTimes(1);
        });

        it("leaves a panel the caller is holding the state of open", () => {
            const onCancel = jest.fn();
            render(<Fixture open onCancel={onCancel} />);

            fireEvent.click(screen.getByRole("button", { name: "Close" }));

            expect(screen.getByRole("dialog")).toBeInTheDocument();
            expect(onCancel).toHaveBeenCalledTimes(1);
        });
    });

    describe("the list", () => {
        it("reads the list as a listbox named by the panel", () => {
            render(<Fixture defaultOpen />);

            const listbox = screen.getByRole("listbox");
            expect(listbox).toBeInTheDocument();
            expect(
                document.getElementById(listbox.getAttribute("aria-labelledby") ?? ""),
            ).toHaveTextContent("Select labels");
        });

        it("reads the items as options, and says which are picked", () => {
            render(<Fixture defaultOpen />);

            const options = screen.getAllByRole("option");
            expect(options).toHaveLength(3);
            expect(options[0]).toHaveAttribute("aria-selected", "true");
            expect(options[1]).toHaveAttribute("aria-selected", "false");
        });

        it("picks an item without closing the panel", () => {
            const onSubmit = jest.fn();
            render(<Fixture defaultOpen onSubmit={onSubmit} />);

            fireEvent.click(screen.getAllByRole("option")[1]);

            expect(screen.getAllByRole("option")[1]).toHaveAttribute("aria-selected", "true");
            expect(screen.getByRole("dialog")).toBeInTheDocument();
            expect(onSubmit).not.toHaveBeenCalled();
        });

        it("opens on the list where there is no field to type in", () => {
            render(<Fixture defaultOpen />);
            expect(screen.getAllByRole("option")[0]).toHaveFocus();
        });
    });

    describe("instant selection", () => {
        it("submits and closes as soon as an item is picked", () => {
            const onSubmit = jest.fn();
            render(<Fixture defaultOpen selectionVariant="instant" onSubmit={onSubmit} />);

            fireEvent.click(screen.getAllByRole("option")[1]);

            expect(onSubmit).toHaveBeenCalledTimes(1);
            expect(screen.queryByRole("dialog")).toBeNull();
        });

        it("leaves out the footer actions, since there is nothing left to save", () => {
            render(<Fixture defaultOpen selectionVariant="instant" />);

            expect(screen.queryByRole("button", { name: "Save" })).toBeNull();
            expect(screen.queryByRole("button", { name: "Cancel" })).toBeNull();
        });
    });

    describe("clearing the selection", () => {
        it("shows no button where there is nothing to clear the selection with", () => {
            render(<Fixture defaultOpen />);
            expect(screen.queryByRole("button", { name: "Clear selection" })).toBeNull();
        });

        it("calls back without closing the panel", () => {
            const onClearSelection = jest.fn();
            render(<Fixture defaultOpen onClearSelection={onClearSelection} />);

            fireEvent.click(screen.getByRole("button", { name: "Clear selection" }));

            expect(onClearSelection).toHaveBeenCalledTimes(1);
            expect(screen.getByRole("dialog")).toBeInTheDocument();
        });
    });

    describe("the search field", () => {
        const WithSearch = ({ onChange }: { onChange?: (value: string) => void }) => (
            <SelectPanel title="Select labels" defaultOpen>
                <SelectPanel.Button>Assign label</SelectPanel.Button>
                <SelectPanel.Header>
                    <SelectPanel.SearchInput aria-label="Search labels" onChange={onChange} />
                </SelectPanel.Header>
                <ActionList selectionVariant="multiple">
                    {labels.map((label) => (
                        <ActionList.Item key={label}>{label}</ActionList.Item>
                    ))}
                </ActionList>
            </SelectPanel>
        );

        it("opens on the field where there is one to type in", () => {
            render(<WithSearch />);
            expect(screen.getByRole("textbox", { name: "Search labels" })).toHaveFocus();
        });

        it("reports what is typed into it", () => {
            const onChange = jest.fn();
            render(<WithSearch onChange={onChange} />);

            fireEvent.change(screen.getByRole("textbox", { name: "Search labels" }), {
                target: { value: "bug" },
            });

            expect(onChange.mock.calls[0][0]).toBe("bug");
        });

        it("clears the field, and reports that it is empty again", () => {
            const onChange = jest.fn();
            render(<WithSearch onChange={onChange} />);

            const input = screen.getByRole("textbox", { name: "Search labels" });
            fireEvent.change(input, { target: { value: "bug" } });
            fireEvent.click(screen.getByRole("button", { name: "Clear" }));

            expect(input).toHaveValue("");
            expect(onChange.mock.calls[1][0]).toBe("");
        });

        it("shows nothing to clear while the field is empty", () => {
            render(<WithSearch />);
            expect(screen.queryByRole("button", { name: "Clear" })).toBeNull();
        });

        it("moves focus onto the list from the down arrow", () => {
            render(<WithSearch />);

            fireEvent.keyDown(screen.getByRole("textbox", { name: "Search labels" }), {
                key: "ArrowDown",
            });

            expect(screen.getAllByRole("option")[0]).toHaveFocus();
        });
    });

    describe("standing in place of the list", () => {
        it("announces a wait", () => {
            render(
                <SelectPanel title="Select labels" defaultOpen>
                    <SelectPanel.Button>Assign label</SelectPanel.Button>
                    <SelectPanel.Loading />
                </SelectPanel>,
            );

            const status = screen.getByRole("status");
            expect(status).toHaveTextContent("Fetching items...");
            expect(status).toHaveAttribute("data-component", "SelectPanel.Loading");
        });

        it("renders an empty message in full, without announcing it", () => {
            render(
                <SelectPanel title="Select labels" defaultOpen>
                    <SelectPanel.Button>Assign label</SelectPanel.Button>
                    <SelectPanel.Message variant="empty" title="No labels found">
                        Try a different search term
                    </SelectPanel.Message>
                </SelectPanel>,
            );

            const message = document.querySelector("[data-component='SelectPanel.Message']");
            expect(message).toHaveAttribute("data-size", "full");
            expect(message).not.toHaveAttribute("role", "status");
            expect(message).toHaveTextContent("No labels found");
        });

        it("announces a warning, and stands it above the list", () => {
            render(
                <SelectPanel title="Select labels" defaultOpen>
                    <SelectPanel.Button>Assign label</SelectPanel.Button>
                    <SelectPanel.Message variant="warning">
                        Showing the first 10 labels
                    </SelectPanel.Message>
                </SelectPanel>,
            );

            const message = document.querySelector("[data-component='SelectPanel.Message']");
            expect(message).toHaveAttribute("data-size", "inline");
            expect(message).toHaveAttribute("role", "status");
        });
    });

    describe("secondary actions", () => {
        it("renders a button, a link and a checkbox", () => {
            render(
                <SelectPanel title="Select labels" defaultOpen>
                    <SelectPanel.Button>Assign label</SelectPanel.Button>
                    <SelectPanel.Footer>
                        <SelectPanel.SecondaryAction variant="button">
                            Edit labels
                        </SelectPanel.SecondaryAction>
                        <SelectPanel.SecondaryAction variant="link" href="/labels">
                            Manage labels
                        </SelectPanel.SecondaryAction>
                        <SelectPanel.SecondaryAction variant="checkbox">
                            Also close the issue
                        </SelectPanel.SecondaryAction>
                    </SelectPanel.Footer>
                </SelectPanel>,
            );

            expect(screen.getByRole("button", { name: "Edit labels" })).toBeInTheDocument();
            expect(screen.getByRole("link", { name: "Manage labels" })).toBeInTheDocument();
            expect(
                screen.getByRole("checkbox", { name: "Also close the issue" }),
            ).toBeInTheDocument();
        });
    });

    describe("inside a form control", () => {
        it("names the button by what is written on it and by the field", () => {
            render(
                <FormControl id="labels-field">
                    <FormControl.Label>Labels</FormControl.Label>
                    <Fixture />
                </FormControl>,
            );

            const button = screen.getByRole("button", { name: "Assign label Labels" });
            expect(button).toHaveAttribute("id", "labels-field");
        });

        it("leaves a button standing on its own to name itself", () => {
            render(<Fixture />);
            expect(anchor()).not.toHaveAttribute("aria-labelledby");
        });
    });

    it("forwards a ref to the panel element", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(
            <SelectPanel title="Select labels" defaultOpen ref={ref}>
                <SelectPanel.Button>Assign label</SelectPanel.Button>
                <ActionList>
                    <ActionList.Item>bug</ActionList.Item>
                </ActionList>
            </SelectPanel>,
        );

        expect(ref.current).toBe(screen.getByRole("dialog"));
    });

    it("merges a custom className onto the panel element", () => {
        render(<Fixture defaultOpen className="custom" />);
        expect(screen.getByRole("dialog")).toHaveClass("custom");
    });
});
