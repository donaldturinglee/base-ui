import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { FormControl } from "../form-control";
import { Switch, useSwitch, useSwitchContext } from ".";
import type { SwitchProps } from "./Switch.types";

const parts = (
    <>
        <Switch.Control>
            <Switch.Thumb />
        </Switch.Control>
        <Switch.Label>Notifications</Switch.Label>
        <Switch.HiddenInput />
    </>
);

const renderSwitch = (props: Partial<SwitchProps> = {}) =>
    render(<Switch {...props}>{parts}</Switch>);

const input = () => screen.getByRole("switch", { name: "Notifications" });

const root = () => document.querySelector('[data-component="Switch"]') as HTMLElement;

const part = (name: string) =>
    document.querySelector(`[data-component="Switch.${name}"]`) as HTMLElement;

describe("Switch", () => {
    it("draws a switch over a checkbox, inside a label", () => {
        renderSwitch();

        expect(input().tagName).toBe("INPUT");
        expect(input()).toHaveAttribute("type", "checkbox");
        expect(root().tagName).toBe("LABEL");
    });

    it("tags the switch and its parts with data-component attributes", () => {
        renderSwitch();

        for (const name of [
            "Switch",
            "Switch.Control",
            "Switch.Thumb",
            "Switch.Label",
            "Switch.HiddenInput",
        ]) {
            expect(document.querySelector(`[data-component="${name}"]`)).not.toBeNull();
        }
    });

    it("points the label at the input, and names the input by the words beside the track", () => {
        renderSwitch();

        expect(root()).toHaveAttribute("for", input().id);
        expect(input()).toHaveAttribute("aria-labelledby", part("Label").id);
    });

    it("keeps the track and the thumb out of the accessibility tree", () => {
        renderSwitch();

        expect(part("Control")).toHaveAttribute("aria-hidden", "true");
        expect(part("Thumb")).toHaveAttribute("aria-hidden", "true");
    });

    it("names its parts from an id of the caller's own", () => {
        renderSwitch({ id: "notifications" });

        expect(root()).toHaveAttribute("id", "notifications");
        expect(input()).toHaveAttribute("id", "notifications-input");
        expect(part("Label")).toHaveAttribute("id", "notifications-label");
        expect(part("Control")).toHaveAttribute("id", "notifications-control");
        expect(part("Thumb")).toHaveAttribute("id", "notifications-thumb");
    });

    it("takes a name for any one part in place of the one worked out for it", () => {
        renderSwitch({ ids: { hiddenInput: "custom-input" } });

        expect(input()).toHaveAttribute("id", "custom-input");
        expect(root()).toHaveAttribute("for", "custom-input");
    });

    it("starts off, and says so on every part", () => {
        renderSwitch();

        expect(input()).not.toBeChecked();
        expect(root()).toHaveAttribute("data-state", "unchecked");
        for (const name of ["Control", "Thumb", "Label"]) {
            expect(part(name)).toHaveAttribute("data-state", "unchecked");
        }
    });

    it("starts on when it is told to", () => {
        renderSwitch({ defaultChecked: true });

        expect(input()).toBeChecked();
        expect(root()).toHaveAttribute("data-state", "checked");
        expect(part("Thumb")).toHaveAttribute("data-state", "checked");
    });

    it("turns on when the input is clicked, and off again", () => {
        renderSwitch();

        fireEvent.click(input());
        expect(input()).toBeChecked();
        expect(part("Control")).toHaveAttribute("data-state", "checked");

        fireEvent.click(input());
        expect(input()).not.toBeChecked();
        expect(part("Control")).toHaveAttribute("data-state", "unchecked");
    });

    it("turns when the words beside the track are clicked", () => {
        renderSwitch();

        fireEvent.click(screen.getByText("Notifications"));

        expect(input()).toBeChecked();
    });

    it("reports whether it is on as it changes", () => {
        const onCheckedChange = vi.fn();
        renderSwitch({ onCheckedChange });

        fireEvent.click(input());
        expect(onCheckedChange).toHaveBeenCalledWith(true);

        fireEvent.click(input());
        expect(onCheckedChange).toHaveBeenLastCalledWith(false);
    });

    it("leaves a switch the caller is holding the state of as it was", () => {
        const onCheckedChange = vi.fn();
        renderSwitch({ checked: false, onCheckedChange });

        fireEvent.click(input());

        expect(onCheckedChange).toHaveBeenCalledWith(true);
        expect(input()).not.toBeChecked();
    });

    it("follows the caller where they are holding the state", () => {
        const { rerender } = render(
            <Switch checked={false} onCheckedChange={() => {}}>
                {parts}
            </Switch>,
        );
        expect(input()).not.toBeChecked();

        rerender(
            <Switch checked onCheckedChange={() => {}}>
                {parts}
            </Switch>,
        );
        expect(input()).toBeChecked();
        expect(root()).toHaveAttribute("data-state", "checked");
    });

    it("is only seen to be clicked once for a press on the label", () => {
        const onClick = vi.fn();
        render(
            <div onClick={onClick}>
                <Switch>{parts}</Switch>
            </div>,
        );

        fireEvent.click(screen.getByText("Notifications"));

        expect(onClick).toHaveBeenCalledTimes(1);
        expect(input()).toBeChecked();
    });

    it("cannot be turned while it is disabled, and says so on every part", () => {
        renderSwitch({ disabled: true });

        expect(input()).toBeDisabled();
        expect(root()).toHaveAttribute("data-disabled", "true");
        for (const name of ["Control", "Thumb", "Label"]) {
            expect(part(name)).toHaveAttribute("data-disabled", "true");
        }
    });

    it("stays where it stands while it is read-only, without leaving the tab order", () => {
        const onCheckedChange = vi.fn();
        renderSwitch({ readOnly: true, onCheckedChange });

        expect(input()).not.toBeDisabled();
        expect(root()).toHaveAttribute("data-readonly", "true");

        fireEvent.click(input());

        expect(input()).not.toBeChecked();
        expect(onCheckedChange).not.toHaveBeenCalled();
    });

    it("marks itself required", () => {
        renderSwitch({ required: true });

        expect(input()).toBeRequired();
        expect(root()).toHaveAttribute("data-required", "true");
    });

    it("marks itself invalid", () => {
        renderSwitch({ invalid: true });

        expect(input()).toHaveAttribute("aria-invalid", "true");
        expect(part("Control")).toHaveAttribute("data-invalid", "true");
    });

    it("says nothing about the states it is not in", () => {
        renderSwitch();

        for (const state of ["data-disabled", "data-readonly", "data-required", "data-invalid"]) {
            expect(root()).not.toHaveAttribute(state);
            expect(part("Control")).not.toHaveAttribute(state);
        }
    });

    it("carries its name, value and form to the input", () => {
        renderSwitch({ name: "notifications", value: "email", form: "settings" });

        expect(input()).toHaveAttribute("name", "notifications");
        expect(input()).toHaveAttribute("value", "email");
        expect(input()).toHaveAttribute("form", "settings");
    });

    describe("in a form", () => {
        const renderForm = (props: Partial<SwitchProps> = {}) =>
            render(
                <form data-testid="form">
                    <Switch name="notifications" {...props}>
                        {parts}
                    </Switch>
                </form>,
            );

        const form = () => screen.getByTestId("form") as HTMLFormElement;

        it("is submitted under its name while it is on, and not at all while it is off", () => {
            renderForm();
            expect(new FormData(form()).get("notifications")).toBeNull();

            fireEvent.click(input());
            expect(new FormData(form()).get("notifications")).toBe("on");
        });

        it("goes back to where it started when the form is reset", () => {
            const onCheckedChange = vi.fn();
            renderForm({ defaultChecked: true, onCheckedChange });

            fireEvent.click(input());
            expect(input()).not.toBeChecked();

            fireEvent.reset(form());
            expect(input()).toBeChecked();
            expect(root()).toHaveAttribute("data-state", "checked");
            expect(onCheckedChange).toHaveBeenLastCalledWith(true);
        });
    });

    describe("in a form control", () => {
        it("is wired into the field around it", () => {
            render(
                <FormControl disabled required>
                    <FormControl.Label>Match alerts</FormControl.Label>
                    <Switch>{parts}</Switch>
                    <FormControl.Caption>Sent by email</FormControl.Caption>
                    <FormControl.Validation variant="error">Pick one</FormControl.Validation>
                </FormControl>,
            );

            const field = screen.getByText("Match alerts").closest("label");
            expect(input()).toHaveAttribute("id", field?.getAttribute("for"));
            expect(input()).toBeDisabled();
            expect(input()).toBeRequired();
            expect(input()).toHaveAttribute(
                "aria-describedby",
                `${screen.getByText("Pick one").id} ${screen.getByText("Sent by email").id}`,
            );
        });

        it("lets what the switch says of itself stand", () => {
            render(
                <FormControl disabled>
                    <Switch disabled={false}>{parts}</Switch>
                </FormControl>,
            );

            expect(input()).not.toBeDisabled();
        });
    });

    describe("drawn from a hook", () => {
        const Held = () => {
            const notifications = useSwitch();

            return (
                <>
                    <Switch.RootProvider value={notifications}>{parts}</Switch.RootProvider>
                    <button type="button" onClick={notifications.toggleChecked}>
                        Toggle
                    </button>
                </>
            );
        };

        it("is turned from wherever the hook is read, as well as from itself", () => {
            render(<Held />);

            fireEvent.click(screen.getByRole("button", { name: "Toggle" }));
            expect(input()).toBeChecked();
            expect(root()).toHaveAttribute("data-state", "checked");

            fireEvent.click(input());
            expect(input()).not.toBeChecked();
        });
    });

    it("hands its state to a control of the caller's own standing among the parts", () => {
        const Reading = () => {
            const { checked } = useSwitchContext();

            return <span>{checked ? "on" : "off"}</span>;
        };

        render(
            <Switch defaultChecked>
                {parts}
                <Reading />
            </Switch>,
        );

        expect(screen.getByText("on")).toBeInTheDocument();
    });

    it("still calls handlers of the caller's own on the input", () => {
        const onChange = vi.fn();
        const onClick = vi.fn();
        render(
            <Switch>
                <Switch.Control>
                    <Switch.Thumb />
                </Switch.Control>
                <Switch.Label>Notifications</Switch.Label>
                <Switch.HiddenInput onChange={onChange} onClick={onClick} />
            </Switch>,
        );

        fireEvent.click(input());

        expect(onClick).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(input()).toBeChecked();
    });

    it("leaves the switch alone where the caller has answered the press", () => {
        const onCheckedChange = vi.fn();
        render(
            <Switch onCheckedChange={onCheckedChange}>
                <Switch.Control>
                    <Switch.Thumb />
                </Switch.Control>
                <Switch.Label>Notifications</Switch.Label>
                <Switch.HiddenInput onClick={(event) => event.preventDefault()} />
            </Switch>,
        );

        fireEvent.click(input());

        // A browser puts the input back where it was once the press is answered; jsdom turns it
        // over again instead, so it is the switch's own state that is read here
        expect(onCheckedChange).not.toHaveBeenCalled();
        expect(root()).toHaveAttribute("data-state", "unchecked");
    });

    it("forwards a ref to the root and to the input", () => {
        const rootRef = React.createRef<HTMLLabelElement>();
        const inputRef = React.createRef<HTMLInputElement>();
        render(
            <Switch ref={rootRef}>
                <Switch.Control>
                    <Switch.Thumb />
                </Switch.Control>
                <Switch.Label>Notifications</Switch.Label>
                <Switch.HiddenInput ref={inputRef} />
            </Switch>,
        );

        expect(rootRef.current).toBe(root());
        expect(inputRef.current).toBe(input());
    });

    it("merges a custom className onto each part", () => {
        render(
            <Switch className="root">
                <Switch.Control className="control">
                    <Switch.Thumb className="thumb" />
                </Switch.Control>
                <Switch.Label className="label">Notifications</Switch.Label>
                <Switch.HiddenInput className="input" />
            </Switch>,
        );

        expect(root()).toHaveClass("switch", "root");
        expect(part("Control")).toHaveClass("switch-control", "control");
        expect(part("Thumb")).toHaveClass("switch-thumb", "thumb");
        expect(part("Label")).toHaveClass("switch-label", "label");
        expect(input()).toHaveClass("switch-hidden-input", "sr-only", "input");
    });
});
