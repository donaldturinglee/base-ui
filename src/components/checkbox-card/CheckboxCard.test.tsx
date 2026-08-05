import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, jest } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { CheckboxGroup } from "../checkbox-group";
import { CheckboxCard } from ".";
import type { CheckboxCardProps, CheckboxCardValidationStatus } from "./CheckboxCard.types";

const renderCard = (props: Partial<CheckboxCardProps> = {}) =>
    render(
        <CheckboxCard value="email" data-testid="card" {...props}>
            <CheckboxCard.Label>Email</CheckboxCard.Label>
            <CheckboxCard.Description>A message to the account</CheckboxCard.Description>
        </CheckboxCard>,
    );

const root = () => screen.getByTestId("card");

const control = () => root().querySelector("input") as HTMLInputElement;

describe("CheckboxCard", () => {
    it("renders a label holding a native checkbox", () => {
        renderCard();

        expect(root()).toHaveAttribute("data-component", "CheckboxCard");
        expect(root().tagName).toBe("LABEL");
        expect(control()).toHaveAttribute("type", "checkbox");
        expect(root()).toContainElement(control());
    });

    it("carries its value on submission", () => {
        renderCard();

        expect(control()).toHaveAttribute("value", "email");
        expect(control()).toHaveAttribute("name", "email");
    });

    it("draws the parts it is given", () => {
        renderCard();

        expect(screen.getByText("Email")).toHaveAttribute("data-component", "CheckboxCard.Label");
        expect(screen.getByText("A message to the account")).toHaveAttribute(
            "data-component",
            "CheckboxCard.Description",
        );
    });

    it("stands anything else it is given beside the parts it knows", () => {
        render(
            <CheckboxCard value="email" data-testid="card">
                <CheckboxCard.Label>Email</CheckboxCard.Label>
                <span>Once a day</span>
            </CheckboxCard>,
        );

        expect(root()).toContainElement(screen.getByText("Once a day"));
    });

    describe("where the checkbox stands", () => {
        it("draws it after the words, so it is the last thing in the card", () => {
            renderCard();

            const parts = Array.from(root().children);
            expect(parts[parts.length - 1]).toBe(control());
        });

        it("holds it at the end of the row", () => {
            renderCard();
            expect(control()).toHaveClass("checkbox-card-control");
        });
    });

    describe("ticking a card", () => {
        it("ticks the checkbox on a click anywhere in the card, since the card is its label", () => {
            renderCard();
            expect(control()).not.toBeChecked();

            fireEvent.click(screen.getByText("Email"));
            expect(control()).toBeChecked();
        });

        it("clears a card that was already ticked", () => {
            renderCard({ defaultChecked: true });

            fireEvent.click(control());
            expect(control()).not.toBeChecked();
        });

        it("reports a change", () => {
            const onChange = jest.fn();
            renderCard({ onChange });

            fireEvent.click(control());
            expect(onChange).toHaveBeenCalledTimes(1);
        });

        it("starts ticked from defaultChecked", () => {
            renderCard({ defaultChecked: true });
            expect(control()).toBeChecked();
        });

        it("follows a controlled checked prop", () => {
            renderCard({ checked: true, onChange: () => {} });
            expect(control()).toBeChecked();
        });

        it("leaves the cards beside it alone, since each stands on its own", () => {
            render(
                <>
                    <CheckboxCard value="email">
                        <CheckboxCard.Label>Email</CheckboxCard.Label>
                    </CheckboxCard>
                    <CheckboxCard value="push">
                        <CheckboxCard.Label>Push</CheckboxCard.Label>
                    </CheckboxCard>
                </>,
            );

            const email = screen.getByRole("checkbox", { name: "Email" });
            const push = screen.getByRole("checkbox", { name: "Push" });

            fireEvent.click(email);
            fireEvent.click(push);

            expect(email).toBeChecked();
            expect(push).toBeChecked();
        });
    });

    describe("part ticked", () => {
        it("reads as mixed rather than as ticked or cleared", () => {
            renderCard({ indeterminate: true });

            expect(control()).toHaveAttribute("aria-checked", "mixed");
            expect(control().indeterminate).toBe(true);
        });

        it("draws the card as part ticked while the caller holds it there", () => {
            renderCard({ indeterminate: true, checked: true, onChange: () => {} });

            // A part ticked box is never also ticked, so the mark stays the dash
            expect(control()).not.toBeChecked();
            expect(control().indeterminate).toBe(true);
        });
    });

    describe("what names the checkbox", () => {
        it("names it after the card's own line rather than everything the card holds", () => {
            renderCard();
            expect(screen.getByRole("checkbox", { name: "Email" })).toBe(control());
        });

        it("describes it by the line below the name", () => {
            renderCard();

            expect(control()).toHaveAccessibleDescription("A message to the account");
        });

        it("falls back to the label around it where the card names no line of its own", () => {
            render(
                <CheckboxCard value="email" data-testid="card">
                    Email
                </CheckboxCard>,
            );

            expect(control()).not.toHaveAttribute("aria-labelledby");
            expect(screen.getByRole("checkbox", { name: "Email" })).toBe(control());
        });

        it("keeps a name the caller has given it", () => {
            renderCard({ "aria-label": "Notify me by email" });
            expect(screen.getByRole("checkbox", { name: "Notify me by email" })).toBe(control());
        });

        it("keeps an id the caller has named", () => {
            renderCard({ "aria-labelledby": "named-elsewhere" });
            expect(control()).toHaveAttribute("aria-labelledby", "named-elsewhere");
        });

        it("describes it by the caller's own line as well as its own", () => {
            render(
                <>
                    <span id="elsewhere">Sent once a day</span>
                    <CheckboxCard value="email" aria-describedby="elsewhere" data-testid="card">
                        <CheckboxCard.Label>Email</CheckboxCard.Label>
                        <CheckboxCard.Description>
                            A message to the account
                        </CheckboxCard.Description>
                    </CheckboxCard>
                </>,
            );

            expect(control()).toHaveAccessibleDescription(
                "A message to the account Sent once a day",
            );
        });
    });

    describe("the id the card is hung off", () => {
        it("names the checkbox rather than the label around it", () => {
            renderCard({ id: "notify-email" });

            expect(control()).toHaveAttribute("id", "notify-email");
            expect(root()).not.toHaveAttribute("id");
        });

        it("hangs the ids of its parts off the checkbox's own", () => {
            renderCard({ id: "notify-email" });

            expect(screen.getByText("Email")).toHaveAttribute("id", "notify-email-label");
            expect(screen.getByText("A message to the account")).toHaveAttribute(
                "id",
                "notify-email-description",
            );
        });

        it("gives way to an id a part was given", () => {
            render(
                <CheckboxCard value="email" id="notify-email" data-testid="card">
                    <CheckboxCard.Label id="own-label">Email</CheckboxCard.Label>
                </CheckboxCard>,
            );

            expect(screen.getByText("Email")).toHaveAttribute("id", "own-label");
            expect(control()).toHaveAttribute("aria-labelledby", "notify-email-label");
        });
    });

    describe("disabled", () => {
        it("stops the checkbox being used and draws the card as turned off", () => {
            renderCard({ disabled: true });

            expect(control()).toBeDisabled();
            expect(root()).toHaveClass("checkbox-card-disabled");
            expect(root()).toHaveAttribute("data-disabled", "true");
        });

        it("answers the pointer while it can still be ticked", () => {
            renderCard();

            expect(root()).toHaveClass("checkbox-card-interactive");
            expect(root()).not.toHaveClass("checkbox-card-disabled");
        });

        it("is turned off along with the group standing around it", () => {
            render(
                <CheckboxGroup disabled>
                    <CheckboxCard value="email" data-testid="card">
                        <CheckboxCard.Label>Email</CheckboxCard.Label>
                    </CheckboxCard>
                </CheckboxGroup>,
            );

            expect(control()).toBeDisabled();
            expect(root()).toHaveClass("checkbox-card-disabled");
        });
    });

    describe("inside a checkbox group", () => {
        it("reports every card that is ticked to the group", () => {
            const onChange = jest.fn();

            render(
                <CheckboxGroup onChange={onChange}>
                    <CheckboxCard value="email">
                        <CheckboxCard.Label>Email</CheckboxCard.Label>
                    </CheckboxCard>
                    <CheckboxCard value="push">
                        <CheckboxCard.Label>Push</CheckboxCard.Label>
                    </CheckboxCard>
                </CheckboxGroup>,
            );

            fireEvent.click(screen.getByRole("checkbox", { name: "Email" }));
            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange.mock.calls[0][0]).toEqual(["email"]);

            fireEvent.click(screen.getByRole("checkbox", { name: "Push" }));
            expect(onChange.mock.calls[1][0]).toEqual(["email", "push"]);
        });

        it("drops a card from the selection once it has been cleared", () => {
            const onChange = jest.fn();

            render(
                <CheckboxGroup onChange={onChange}>
                    <CheckboxCard value="email">
                        <CheckboxCard.Label>Email</CheckboxCard.Label>
                    </CheckboxCard>
                </CheckboxGroup>,
            );

            const email = screen.getByRole("checkbox", { name: "Email" });

            fireEvent.click(email);
            fireEvent.click(email);
            expect(onChange.mock.calls[1][0]).toEqual([]);
        });

        it("reports a change to the card as well as to the group", () => {
            const onChange = jest.fn();

            render(
                <CheckboxGroup>
                    <CheckboxCard value="email" onChange={onChange}>
                        <CheckboxCard.Label>Email</CheckboxCard.Label>
                    </CheckboxCard>
                </CheckboxGroup>,
            );

            fireEvent.click(screen.getByRole("checkbox", { name: "Email" }));
            expect(onChange).toHaveBeenCalledTimes(1);
        });
    });

    describe("validation", () => {
        const statuses: CheckboxCardValidationStatus[] = ["error", "success"];

        it.each(statuses)("draws the border for the %s status", (validationStatus) => {
            renderCard({ validationStatus });

            expect(root()).toHaveClass(`checkbox-card-${validationStatus}`);
            expect(root()).toHaveAttribute("data-validation", validationStatus);
        });

        it("marks the checkbox invalid for the error status", () => {
            renderCard({ validationStatus: "error" });
            expect(control()).toHaveAttribute("aria-invalid", "true");
        });

        it("does not mark the checkbox invalid for the success status", () => {
            renderCard({ validationStatus: "success" });
            expect(control()).not.toHaveAttribute("aria-invalid");
        });
    });

    it("marks the checkbox required for assistive technology", () => {
        renderCard({ required: true });

        expect(control()).toBeRequired();
        expect(control()).toHaveAttribute("aria-required", "true");
        expect(root()).toHaveAttribute("data-required", "true");
    });

    it("does not leak the control props onto the label", () => {
        renderCard({ validationStatus: "error", required: true, defaultChecked: true });

        expect(root()).not.toHaveAttribute("value");
        expect(root()).not.toHaveAttribute("name");
        expect(root()).not.toHaveAttribute("validationStatus");
        expect(root()).not.toHaveAttribute("required");
        expect(root()).not.toHaveAttribute("checked");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLLabelElement>();

        render(
            <CheckboxCard ref={ref} value="email" data-testid="card">
                <CheckboxCard.Label>Email</CheckboxCard.Label>
            </CheckboxCard>,
        );

        expect(ref.current).toBe(root());
    });

    it("merges a custom className onto the root element", () => {
        renderCard({ className: "custom" });
        expect(root()).toHaveClass("checkbox-card", "custom");
    });

    it("merges a custom className onto the parts", () => {
        render(
            <CheckboxCard value="email" data-testid="card">
                <CheckboxCard.LeadingVisual className="custom-visual">
                    <svg />
                </CheckboxCard.LeadingVisual>
                <CheckboxCard.Label className="custom-label">Email</CheckboxCard.Label>
                <CheckboxCard.Description className="custom-description">
                    A message to the account
                </CheckboxCard.Description>
            </CheckboxCard>,
        );

        expect(root().querySelector("[data-component='CheckboxCard.LeadingVisual']")).toHaveClass(
            "checkbox-card-leading-visual",
            "custom-visual",
        );
        expect(screen.getByText("Email")).toHaveClass("checkbox-card-label", "custom-label");
        expect(screen.getByText("A message to the account")).toHaveClass(
            "checkbox-card-description",
            "custom-description",
        );
    });

    describe("the leading visual", () => {
        it("stays out of the accessibility tree while it is unlabelled", () => {
            render(
                <CheckboxCard value="email" data-testid="card">
                    <CheckboxCard.LeadingVisual>
                        <svg />
                    </CheckboxCard.LeadingVisual>
                    <CheckboxCard.Label>Email</CheckboxCard.Label>
                </CheckboxCard>,
            );

            const visual = root().querySelector("[data-component='CheckboxCard.LeadingVisual']");
            expect(visual).toHaveAttribute("aria-hidden", "true");
            expect(visual).not.toHaveAttribute("role");
        });

        it("is read as an image once it has been named", () => {
            render(
                <CheckboxCard value="email" data-testid="card">
                    <CheckboxCard.LeadingVisual aria-label="Envelope">
                        <svg />
                    </CheckboxCard.LeadingVisual>
                    <CheckboxCard.Label>Email</CheckboxCard.Label>
                </CheckboxCard>,
            );

            expect(screen.getByRole("img", { name: "Envelope" })).toBeInTheDocument();
        });

        it("leads the words rather than standing beside the checkbox", () => {
            render(
                <CheckboxCard value="email" data-testid="card">
                    <CheckboxCard.LeadingVisual>
                        <svg />
                    </CheckboxCard.LeadingVisual>
                    <CheckboxCard.Label>Email</CheckboxCard.Label>
                </CheckboxCard>,
            );

            expect(root().children[0]).toHaveAttribute(
                "data-component",
                "CheckboxCard.LeadingVisual",
            );
        });
    });
});
