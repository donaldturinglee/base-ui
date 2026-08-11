import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { CodeRegular, EyeRegular, PeopleRegular } from "@gamecrafters/base-ui-icons";
import { SegmentedControl } from ".";
import type { SegmentedControlProps } from "./SegmentedControl.types";

const originalResizeObserver = window.ResizeObserver;

const views = ["Preview", "Raw", "Blame"];

const icons = [EyeRegular, CodeRegular, PeopleRegular];

type ControlProps = Partial<Omit<SegmentedControlProps, "aria-label" | "aria-labelledby">>;

const renderControl = (props: ControlProps = {}) =>
    render(
        <SegmentedControl aria-label="File view" {...props}>
            {views.map((view, index) => (
                <SegmentedControl.Button key={view} defaultSelected={index === 0}>
                    {view}
                </SegmentedControl.Button>
            ))}
        </SegmentedControl>,
    );

const control = () => screen.getByRole("list");

const segment = (name: string) => screen.getByRole("button", { name });

describe("SegmentedControl", () => {
    it("renders a list named for what it is for", () => {
        renderControl();

        expect(control()).toHaveAccessibleName("File view");
        expect(control()).toHaveAttribute("data-component", "SegmentedControl");
    });

    it("tags each kind of segment with a data-component attribute", () => {
        render(
            <SegmentedControl aria-label="File view">
                <SegmentedControl.Button defaultSelected>Preview</SegmentedControl.Button>
                <SegmentedControl.IconButton aria-label="Raw" icon={CodeRegular} />
            </SegmentedControl>,
        );

        expect(segment("Preview").closest("li")).toHaveAttribute(
            "data-component",
            "SegmentedControl.Button",
        );
        expect(segment("Raw").closest("li")).toHaveAttribute(
            "data-component",
            "SegmentedControl.IconButton",
        );
    });

    it("renders every segment it is given, in the order they were written", () => {
        renderControl();

        expect(screen.getAllByRole("button").map((button) => button.textContent)).toEqual(views);
    });

    it("rests on the first segment where nothing says otherwise", () => {
        render(
            <SegmentedControl aria-label="File view">
                {views.map((view) => (
                    <SegmentedControl.Button key={view}>{view}</SegmentedControl.Button>
                ))}
            </SegmentedControl>,
        );

        expect(segment("Preview")).toHaveAttribute("aria-pressed", "true");
        expect(segment("Raw")).toHaveAttribute("aria-pressed", "false");
    });

    it("rests on the segment it was told to start on", () => {
        render(
            <SegmentedControl aria-label="File view">
                {views.map((view, index) => (
                    <SegmentedControl.Button key={view} defaultSelected={index === 1}>
                        {view}
                    </SegmentedControl.Button>
                ))}
            </SegmentedControl>,
        );

        expect(segment("Raw")).toHaveAttribute("aria-pressed", "true");
    });

    it("rests on the segment the caller says it is on", () => {
        const { rerender } = render(
            <SegmentedControl aria-label="File view" onChange={() => {}}>
                {views.map((view, index) => (
                    <SegmentedControl.Button key={view} selected={index === 1}>
                        {view}
                    </SegmentedControl.Button>
                ))}
            </SegmentedControl>,
        );

        expect(segment("Raw")).toHaveAttribute("aria-pressed", "true");

        rerender(
            <SegmentedControl aria-label="File view" onChange={() => {}}>
                {views.map((view, index) => (
                    <SegmentedControl.Button key={view} selected={index === 2}>
                        {view}
                    </SegmentedControl.Button>
                ))}
            </SegmentedControl>,
        );

        expect(segment("Blame")).toHaveAttribute("aria-pressed", "true");
        expect(segment("Raw")).toHaveAttribute("aria-pressed", "false");
    });

    it("calls onChange with the index of the segment that was pressed", () => {
        const onChange = jest.fn();
        renderControl({ onChange });

        fireEvent.click(segment("Blame"));

        expect(onChange).toHaveBeenCalledWith(2);
    });

    it("moves its own selection where it is the one holding it", () => {
        renderControl();

        fireEvent.click(segment("Raw"));

        expect(segment("Raw")).toHaveAttribute("aria-pressed", "true");
        expect(segment("Preview")).toHaveAttribute("aria-pressed", "false");
    });

    it("calls the segment's own onClick as well", () => {
        const onClick = jest.fn();
        render(
            <SegmentedControl aria-label="File view">
                <SegmentedControl.Button defaultSelected>Preview</SegmentedControl.Button>
                <SegmentedControl.Button onClick={onClick}>Raw</SegmentedControl.Button>
            </SegmentedControl>,
        );

        fireEvent.click(segment("Raw"));

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("leaves a segment that cannot be picked where it is", () => {
        const onChange = jest.fn();
        render(
            <SegmentedControl aria-label="File view" onChange={onChange}>
                <SegmentedControl.Button defaultSelected>Preview</SegmentedControl.Button>
                <SegmentedControl.Button disabled>Raw</SegmentedControl.Button>
            </SegmentedControl>,
        );

        // Said rather than taken out of the tab order, so a reader can still be told why
        expect(segment("Raw")).toHaveAttribute("aria-disabled", "true");
        expect(segment("Raw")).not.toBeDisabled();

        fireEvent.click(segment("Raw"));

        expect(onChange).not.toHaveBeenCalled();
        expect(segment("Preview")).toHaveAttribute("aria-pressed", "true");
    });

    it("draws the visual that comes before the label", () => {
        render(
            <SegmentedControl aria-label="File view">
                <SegmentedControl.Button defaultSelected leadingVisual={EyeRegular}>
                    Preview
                </SegmentedControl.Button>
            </SegmentedControl>,
        );

        const visual = document.querySelector("[data-component='SegmentedControl.LeadingVisual']");

        expect(visual?.querySelector("svg")).toBeInTheDocument();
    });

    it("shows a counter after the label where it is given one", () => {
        render(
            <SegmentedControl aria-label="Issues by label">
                <SegmentedControl.Button defaultSelected count={5}>
                    Feature
                </SegmentedControl.Button>
            </SegmentedControl>,
        );

        expect(screen.getByRole("button")).toHaveTextContent("5");
    });

    it("names an icon segment from the tooltip it brings up", () => {
        render(
            <SegmentedControl aria-label="File view">
                {views.map((view, index) => (
                    <SegmentedControl.IconButton
                        key={view}
                        aria-label={view}
                        icon={icons[index]}
                        defaultSelected={index === 0}
                    />
                ))}
            </SegmentedControl>,
        );

        for (const view of views) {
            expect(segment(view)).toHaveAttribute("aria-labelledby", screen.getByText(view).id);
            expect(segment(view)).not.toHaveAttribute("aria-label");
        }
    });

    it("reads a description from the tooltip, and keeps the name it was given", () => {
        render(
            <SegmentedControl aria-label="File view">
                <SegmentedControl.IconButton
                    defaultSelected
                    aria-label="Preview"
                    description="Shows the file as it is rendered"
                    icon={EyeRegular}
                />
            </SegmentedControl>,
        );

        expect(segment("Preview")).toHaveAttribute("aria-label", "Preview");
        expect(segment("Preview")).toHaveAttribute(
            "aria-describedby",
            screen.getByText("Shows the file as it is rendered").id,
        );
    });

    it("tags how much room it takes and what it falls back to", () => {
        renderControl({
            size: "small",
            fullWidth: { narrow: true, regular: false },
            variant: { narrow: "hideLabels", regular: "default" },
        });

        expect(control()).toHaveAttribute("data-size", "small");
        expect(control()).toHaveAttribute("data-full-width-narrow", "true");
        expect(control()).toHaveAttribute("data-full-width-regular", "false");
        expect(control()).toHaveAttribute("data-variant-narrow", "hideLabels");
        expect(control()).toHaveAttribute("data-variant-regular", "default");
    });

    it("takes a class name of the caller's own", () => {
        renderControl({ className: "custom" });

        expect(control()).toHaveClass("custom");
    });

    describe("falling back to a menu", () => {
        // jsdom has no ResizeObserver, and the overlay under the menu watches its own size so
        // it can be placed again as it grows
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

        const renderDropdown = (props: ControlProps = {}) =>
            render(
                <SegmentedControl
                    aria-label="File view"
                    variant={{ narrow: "dropdown", regular: "default" }}
                    {...props}
                >
                    {views.map((view, index) => (
                        <SegmentedControl.Button
                            key={view}
                            leadingVisual={icons[index]}
                            defaultSelected={index === 0}
                        >
                            {view}
                        </SegmentedControl.Button>
                    ))}
                </SegmentedControl>,
            );

        const trigger = () => screen.getByRole("button", { name: "Preview, File view" });

        it("names the menu button after the segment being shown", () => {
            renderDropdown();

            expect(trigger()).toHaveAttribute("aria-haspopup", "true");
        });

        it("offers the same segments from the menu", () => {
            renderDropdown();

            fireEvent.click(trigger());

            expect(screen.getAllByRole("menuitemradio").map((item) => item.textContent)).toEqual(
                views,
            );
            expect(screen.getByRole("menuitemradio", { name: "Preview" })).toHaveAttribute(
                "aria-checked",
                "true",
            );
        });

        it("calls onChange with the index of the segment picked from the menu", () => {
            const onChange = jest.fn();
            renderDropdown({ onChange });

            fireEvent.click(trigger());
            fireEvent.click(screen.getByRole("menuitemradio", { name: "Raw" }));

            expect(onChange).toHaveBeenCalledWith(1);
        });

        it("keeps the row of segments as well, so CSS decides which of them is drawn", () => {
            renderDropdown();

            expect(control()).toHaveAttribute("data-variant-narrow", "dropdown");
            expect(
                document.querySelector("[data-component='SegmentedControl.Dropdown']"),
            ).toHaveAttribute("data-variant-narrow", "dropdown");
        });
    });
});
