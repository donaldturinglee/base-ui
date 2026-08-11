import * as React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { ToggleSwitch, DEFAULT_TOGGLE_SWITCH_LOADING_LABEL_DELAY } from ".";
import type { ToggleSwitchProps } from "./ToggleSwitch.types";

const LABEL = "Toggle label";

const renderSwitch = (props: Partial<ToggleSwitchProps> = {}) =>
    render(
        <>
            <span id="switch-label">{LABEL}</span>
            <ToggleSwitch {...props} aria-labelledby="switch-label" data-testid="switch" />
        </>,
    );

const button = () => screen.getByRole("button", { name: LABEL });

const part = (name: string) =>
    screen.getByTestId("switch").querySelector(`[data-component='ToggleSwitch.${name}']`);

describe("ToggleSwitch", () => {
    it("renders a switch that is turned off", () => {
        renderSwitch();
        expect(button()).toHaveAttribute("aria-pressed", "false");
    });

    it("renders a switch that starts out turned on", () => {
        renderSwitch({ defaultChecked: true });
        expect(button()).toHaveAttribute("aria-pressed", "true");
    });

    it("tags the root element with a data-component attribute", () => {
        renderSwitch();
        expect(screen.getByTestId("switch")).toHaveAttribute("data-component", "ToggleSwitch");
    });

    it("tags the root element with the state it is in", () => {
        renderSwitch({ defaultChecked: true, size: "small", statusLabelPosition: "end" });
        const root = screen.getByTestId("switch");
        expect(root).toHaveAttribute("data-checked", "true");
        expect(root).toHaveAttribute("data-disabled", "false");
        expect(root).toHaveAttribute("data-size", "small");
        expect(root).toHaveAttribute("data-status-label-position", "end");
        expect(root).not.toHaveAttribute("data-loading");
    });

    it("lays the labels out after the switch when asked to", () => {
        renderSwitch({ statusLabelPosition: "end" });
        expect(screen.getByTestId("switch")).toHaveClass("toggle-switch-label-end");
    });

    it("says on and off beside the switch", () => {
        renderSwitch();
        expect(screen.getByText("On")).toBeInTheDocument();
        expect(screen.getByText("Off")).toBeInTheDocument();
    });

    it("hides the reading that does not apply", () => {
        renderSwitch();
        expect(screen.getByText("On")).toHaveClass("toggle-switch-status-text-hidden");
        expect(screen.getByText("Off")).not.toHaveClass("toggle-switch-status-text-hidden");
    });

    it("uses custom on and off text", () => {
        renderSwitch({ buttonLabelOn: "Show", buttonLabelOff: "Hide" });
        expect(screen.getByText("Show")).toBeInTheDocument();
        expect(screen.getByText("Hide")).toBeInTheDocument();
    });

    it("keeps the labels out of the accessibility tree", () => {
        renderSwitch();
        expect(screen.getByText("Off").closest("[aria-hidden='true']")).not.toBeNull();
    });

    it("centres each icon in its half of the track", () => {
        renderSwitch();
        for (const name of ["LineIcon", "CircleIcon"]) {
            const icon = part(name);
            // Laid out rather than left to sit on a baseline, where the descender space below
            // it would push it off centre
            expect(icon).toHaveClass("toggle-switch-icon");
        }
    });

    it("slides the icons across the track as the switch is turned on", () => {
        renderSwitch();
        expect(part("LineIcon")).toHaveClass("-translate-x-full");
        expect(part("CircleIcon")).toHaveClass("translate-x-0");
        expect(part("ToggleKnob")).toHaveClass("translate-x-0");

        fireEvent.click(button());
        expect(part("LineIcon")).toHaveClass("translate-x-0");
        expect(part("CircleIcon")).toHaveClass("translate-x-full");
        expect(part("ToggleKnob")).toHaveClass("toggle-switch-knob-checked");
    });

    it("is a button rather than a submit by default", () => {
        renderSwitch();
        expect(button()).toHaveAttribute("type", "button");
    });

    it("respects the button type", () => {
        renderSwitch({ buttonType: "submit" });
        expect(button()).toHaveAttribute("type", "submit");
    });

    it("turns on when it is clicked", () => {
        renderSwitch();
        fireEvent.click(button());
        expect(button()).toHaveAttribute("aria-pressed", "true");
    });

    it("turns off again when it is clicked twice", () => {
        renderSwitch();
        fireEvent.click(button());
        fireEvent.click(button());
        expect(button()).toHaveAttribute("aria-pressed", "false");
    });

    it("turns on when the label beside it is clicked", () => {
        renderSwitch();
        fireEvent.click(screen.getByText("Off"));
        expect(button()).toHaveAttribute("aria-pressed", "true");
    });

    it("calls onChange with the state the switch is moving to", () => {
        const onChange = jest.fn();
        renderSwitch({ onChange });

        fireEvent.click(button());
        expect(onChange).toHaveBeenCalledWith(true);

        fireEvent.click(button());
        expect(onChange).toHaveBeenLastCalledWith(false);
    });

    it("calls onClick when the switch is clicked", () => {
        const onClick = jest.fn();
        renderSwitch({ onClick });
        fireEvent.click(button());
        expect(onClick).toHaveBeenCalled();
    });

    it("takes its state from the checked prop when it is given one", () => {
        const { rerender } = renderSwitch({ checked: false });
        expect(button()).toHaveAttribute("aria-pressed", "false");

        // The caller holds the state, so the switch does not move on its own
        fireEvent.click(button());
        expect(button()).toHaveAttribute("aria-pressed", "false");

        rerender(
            <>
                <span id="switch-label">{LABEL}</span>
                <ToggleSwitch checked aria-labelledby="switch-label" data-testid="switch" />
            </>,
        );
        expect(button()).toHaveAttribute("aria-pressed", "true");
    });

    it("calls onChange from a switch the caller is holding the state of", () => {
        const onChange = jest.fn();
        renderSwitch({ checked: false, onChange });
        fireEvent.click(button());
        expect(onChange).toHaveBeenCalledWith(true);
    });

    it("does not call onChange on arrival or when checked changes elsewhere", () => {
        const onChange = jest.fn();
        const { rerender } = renderSwitch({ checked: false, onChange });
        expect(onChange).not.toHaveBeenCalled();

        rerender(
            <>
                <span id="switch-label">{LABEL}</span>
                <ToggleSwitch
                    checked
                    onChange={onChange}
                    aria-labelledby="switch-label"
                    data-testid="switch"
                />
            </>,
        );
        expect(onChange).not.toHaveBeenCalled();
    });

    it("cannot be used while it is disabled", () => {
        const onChange = jest.fn();
        renderSwitch({ disabled: true, onChange });

        expect(button()).toHaveAttribute("aria-disabled", "true");
        fireEvent.click(button());
        expect(button()).toHaveAttribute("aria-pressed", "false");
        expect(onChange).not.toHaveBeenCalled();
    });

    it("cannot be toggled by the label while it is disabled", () => {
        renderSwitch({ disabled: true });
        fireEvent.click(screen.getByText("Off"));
        expect(button()).toHaveAttribute("aria-pressed", "false");
    });

    it("stays in the tab order while it is disabled, so it can be explained", () => {
        renderSwitch({ disabled: true });
        expect(button()).not.toHaveAttribute("disabled");
    });

    it("cannot be used while it is loading", () => {
        const onChange = jest.fn();
        renderSwitch({ loading: true, onChange });

        expect(button()).toHaveAttribute("aria-disabled", "true");
        fireEvent.click(button());
        expect(button()).toHaveAttribute("aria-pressed", "false");
        expect(onChange).not.toHaveBeenCalled();
    });

    it("shows a spinner while it is loading", () => {
        renderSwitch({ loading: true });
        const root = screen.getByTestId("switch");
        expect(root).toHaveAttribute("data-loading", "true");
        expect(root.querySelector("[data-component='ToggleSwitch.LoadingSpinner']")).not.toBeNull();
    });

    it("shows no spinner while it is not loading", () => {
        renderSwitch();
        const root = screen.getByTestId("switch");
        expect(root.querySelector("[data-component='ToggleSwitch.LoadingSpinner']")).toBeNull();
    });

    it("describes the switch with a caption of its own", () => {
        renderSwitch({ "aria-describedby": "switch-caption" });
        expect(button()).toHaveAttribute("aria-describedby", "switch-caption");
    });

    it("forwards a ref to the inner button", () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(
            <>
                <span id="switch-label">{LABEL}</span>
                <ToggleSwitch ref={ref} aria-labelledby="switch-label" />
            </>,
        );
        expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("forwards element specific props to the root element", () => {
        renderSwitch({ id: "notifications" });
        expect(screen.getByTestId("switch")).toHaveAttribute("id", "notifications");
    });

    it("merges a custom className onto the root element", () => {
        renderSwitch({ className: "custom" });
        expect(screen.getByTestId("switch")).toHaveClass("custom");
    });
});

describe("ToggleSwitch loading label", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("says nothing while the switch is not loading", () => {
        renderSwitch();
        expect(screen.getByRole("status")).toBeEmptyDOMElement();
    });

    it("says nothing until the wait has gone on long enough", () => {
        renderSwitch({ loading: true });
        const live = screen.getByRole("status");
        expect(live).toBeEmptyDOMElement();

        act(() => {
            jest.advanceTimersByTime(DEFAULT_TOGGLE_SWITCH_LOADING_LABEL_DELAY - 1);
        });
        expect(live).toBeEmptyDOMElement();
    });

    it("says that it is loading once the wait has gone on long enough", () => {
        renderSwitch({ loading: true });

        act(() => {
            jest.advanceTimersByTime(DEFAULT_TOGGLE_SWITCH_LOADING_LABEL_DELAY);
        });
        expect(screen.getByRole("status")).toHaveTextContent("Loading");
    });

    it("respects a delay of its own", () => {
        renderSwitch({ loading: true, loadingLabelDelay: 0 });

        act(() => {
            jest.advanceTimersByTime(0);
        });
        expect(screen.getByRole("status")).toHaveTextContent("Loading");
    });

    it("respects a label of its own", () => {
        renderSwitch({ loading: true, loadingLabelDelay: 0, loadingLabel: "Enabling feature" });

        act(() => {
            jest.advanceTimersByTime(0);
        });
        expect(screen.getByRole("status")).toHaveTextContent("Enabling feature");
    });

    it("points the switch at the label while it is being said", () => {
        renderSwitch({ loading: true, loadingLabelDelay: 0 });
        expect(button()).not.toHaveAttribute("aria-describedby");

        act(() => {
            jest.advanceTimersByTime(0);
        });
        expect(button().getAttribute("aria-describedby")).toBe(
            screen.getByRole("status").getAttribute("id"),
        );
    });

    it("keeps a caption of its own alongside the label", () => {
        renderSwitch({
            loading: true,
            loadingLabelDelay: 0,
            "aria-describedby": "switch-caption",
        });

        act(() => {
            jest.advanceTimersByTime(0);
        });
        const describedBy = button().getAttribute("aria-describedby");
        expect(describedBy?.split(" ")).toHaveLength(2);
        expect(describedBy).toContain("switch-caption");
    });

    it("takes the label back once the switch has settled", () => {
        const { rerender } = renderSwitch({ loading: true, loadingLabelDelay: 0 });

        act(() => {
            jest.advanceTimersByTime(0);
        });
        expect(screen.getByRole("status")).toHaveTextContent("Loading");

        rerender(
            <>
                <span id="switch-label">{LABEL}</span>
                <ToggleSwitch
                    loadingLabelDelay={0}
                    aria-labelledby="switch-label"
                    data-testid="switch"
                />
            </>,
        );
        expect(screen.getByRole("status")).toBeEmptyDOMElement();
        expect(button()).not.toHaveAttribute("aria-describedby");
    });

    it("says nothing about a wait that settles before the delay is up", () => {
        const { rerender } = renderSwitch({ loading: true });

        act(() => {
            jest.advanceTimersByTime(DEFAULT_TOGGLE_SWITCH_LOADING_LABEL_DELAY / 2);
        });
        rerender(
            <>
                <span id="switch-label">{LABEL}</span>
                <ToggleSwitch aria-labelledby="switch-label" data-testid="switch" />
            </>,
        );
        act(() => {
            jest.advanceTimersByTime(DEFAULT_TOGGLE_SWITCH_LOADING_LABEL_DELAY);
        });
        expect(screen.getByRole("status")).toBeEmptyDOMElement();
    });
});
