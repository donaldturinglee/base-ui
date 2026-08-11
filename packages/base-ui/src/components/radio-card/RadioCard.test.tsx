import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { RadioGroup } from "../radio-group";
import { RadioCard } from ".";
import type { RadioCardProps, RadioCardValidationStatus } from "./RadioCard.types";

const renderCard = (props: Partial<RadioCardProps> = {}) =>
    render(
        <RadioCard name="plan" value="team" data-testid="card" {...props}>
            <RadioCard.Label>Team</RadioCard.Label>
            <RadioCard.Description>For a small group</RadioCard.Description>
        </RadioCard>,
    );

const root = () => screen.getByTestId("card");

const control = () => root().querySelector("input") as HTMLInputElement;

describe("RadioCard", () => {
    it("renders a label holding a native radio", () => {
        renderCard();

        expect(root()).toHaveAttribute("data-component", "RadioCard");
        expect(root().tagName).toBe("LABEL");
        expect(control()).toHaveAttribute("type", "radio");
        expect(root()).toContainElement(control());
    });

    it("carries its name and value on submission", () => {
        renderCard();

        expect(control()).toHaveAttribute("name", "plan");
        expect(control()).toHaveAttribute("value", "team");
    });

    it("draws the parts it is given", () => {
        renderCard();

        expect(screen.getByText("Team")).toHaveAttribute("data-component", "RadioCard.Label");
        expect(screen.getByText("For a small group")).toHaveAttribute(
            "data-component",
            "RadioCard.Description",
        );
    });

    it("stands anything else it is given beside the parts it knows", () => {
        render(
            <RadioCard name="plan" value="team" data-testid="card">
                <RadioCard.Label>Team</RadioCard.Label>
                <span>£4 a month</span>
            </RadioCard>,
        );

        expect(root()).toContainElement(screen.getByText("£4 a month"));
    });

    describe("where the radio stands", () => {
        it("draws it after the words, so it is the last thing in the card", () => {
            renderCard();

            const parts = Array.from(root().children);
            expect(parts[parts.length - 1]).toBe(control());
        });

        it("holds it at the end of the row", () => {
            renderCard();
            expect(control()).toHaveClass("radio-card-control");
        });
    });

    describe("picking a card", () => {
        it("checks the radio on a click anywhere in the card, since the card is its label", () => {
            renderCard();
            expect(control()).not.toBeChecked();

            fireEvent.click(screen.getByText("Team"));
            expect(control()).toBeChecked();
        });

        it("reports a change", () => {
            const onChange = vi.fn();
            renderCard({ onChange });

            fireEvent.click(control());
            expect(onChange).toHaveBeenCalledTimes(1);
        });

        it("starts picked from defaultChecked", () => {
            renderCard({ defaultChecked: true });
            expect(control()).toBeChecked();
        });

        it("follows a controlled checked prop", () => {
            renderCard({ checked: true, onChange: () => {} });
            expect(control()).toBeChecked();
        });

        it("lets only one card of a name be picked at a time", () => {
            render(
                <>
                    <RadioCard name="plan" value="free">
                        <RadioCard.Label>Free</RadioCard.Label>
                    </RadioCard>
                    <RadioCard name="plan" value="team">
                        <RadioCard.Label>Team</RadioCard.Label>
                    </RadioCard>
                </>,
            );

            const free = screen.getByRole("radio", { name: "Free" });
            const team = screen.getByRole("radio", { name: "Team" });

            fireEvent.click(free);
            expect(free).toBeChecked();
            expect(team).not.toBeChecked();

            fireEvent.click(team);
            expect(free).not.toBeChecked();
            expect(team).toBeChecked();
        });
    });

    describe("what names the radio", () => {
        it("names it after the card's own line rather than everything the card holds", () => {
            renderCard();
            expect(screen.getByRole("radio", { name: "Team" })).toBe(control());
        });

        it("describes it by the line below the name", () => {
            renderCard();

            expect(control()).toHaveAccessibleDescription("For a small group");
        });

        it("falls back to the label around it where the card names no line of its own", () => {
            render(
                <RadioCard name="plan" value="team" data-testid="card">
                    Team
                </RadioCard>,
            );

            expect(control()).not.toHaveAttribute("aria-labelledby");
            expect(screen.getByRole("radio", { name: "Team" })).toBe(control());
        });

        it("keeps a name the caller has given it", () => {
            renderCard({ "aria-label": "The team plan" });
            expect(screen.getByRole("radio", { name: "The team plan" })).toBe(control());
        });

        it("keeps an id the caller has named", () => {
            renderCard({ "aria-labelledby": "named-elsewhere" });
            expect(control()).toHaveAttribute("aria-labelledby", "named-elsewhere");
        });

        it("describes it by the caller's own line as well as its own", () => {
            render(
                <>
                    <span id="elsewhere">Billed yearly</span>
                    <RadioCard
                        name="plan"
                        value="team"
                        aria-describedby="elsewhere"
                        data-testid="card"
                    >
                        <RadioCard.Label>Team</RadioCard.Label>
                        <RadioCard.Description>For a small group</RadioCard.Description>
                    </RadioCard>
                </>,
            );

            expect(control()).toHaveAccessibleDescription("For a small group Billed yearly");
        });
    });

    describe("the id the card is hung off", () => {
        it("names the radio rather than the label around it", () => {
            renderCard({ id: "plan-team" });

            expect(control()).toHaveAttribute("id", "plan-team");
            expect(root()).not.toHaveAttribute("id");
        });

        it("hangs the ids of its parts off the radio's own", () => {
            renderCard({ id: "plan-team" });

            expect(screen.getByText("Team")).toHaveAttribute("id", "plan-team-label");
            expect(screen.getByText("For a small group")).toHaveAttribute(
                "id",
                "plan-team-description",
            );
        });

        it("gives way to an id a part was given", () => {
            render(
                <RadioCard name="plan" value="team" id="plan-team" data-testid="card">
                    <RadioCard.Label id="own-label">Team</RadioCard.Label>
                </RadioCard>,
            );

            expect(screen.getByText("Team")).toHaveAttribute("id", "own-label");
            expect(control()).toHaveAttribute("aria-labelledby", "plan-team-label");
        });
    });

    describe("disabled", () => {
        it("stops the radio being used and draws the card as turned off", () => {
            renderCard({ disabled: true });

            expect(control()).toBeDisabled();
            expect(root()).toHaveClass("radio-card-disabled");
            expect(root()).toHaveAttribute("data-disabled", "true");
        });

        it("answers the pointer while it can still be picked", () => {
            renderCard();

            expect(root()).toHaveClass("radio-card-interactive");
            expect(root()).not.toHaveClass("radio-card-disabled");
        });

        it("is turned off along with the group standing around it", () => {
            render(
                <RadioGroup name="plan" disabled>
                    <RadioCard value="team" data-testid="card">
                        <RadioCard.Label>Team</RadioCard.Label>
                    </RadioCard>
                </RadioGroup>,
            );

            expect(control()).toBeDisabled();
            expect(root()).toHaveClass("radio-card-disabled");
        });
    });

    describe("inside a radio group", () => {
        it("takes the group's name where it is given none of its own", () => {
            render(
                <RadioGroup name="plan">
                    <RadioCard value="team" data-testid="card">
                        <RadioCard.Label>Team</RadioCard.Label>
                    </RadioCard>
                </RadioGroup>,
            );

            expect(control()).toHaveAttribute("name", "plan");
        });

        it("reports the card that has just been picked to the group", () => {
            const onChange = vi.fn();

            render(
                <RadioGroup name="plan" onChange={onChange}>
                    <RadioCard value="free">
                        <RadioCard.Label>Free</RadioCard.Label>
                    </RadioCard>
                    <RadioCard value="team">
                        <RadioCard.Label>Team</RadioCard.Label>
                    </RadioCard>
                </RadioGroup>,
            );

            fireEvent.click(screen.getByRole("radio", { name: "Team" }));
            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange.mock.calls[0][0]).toBe("team");
        });
    });

    describe("validation", () => {
        const statuses: RadioCardValidationStatus[] = ["error", "success"];

        it.each(statuses)("draws the border for the %s status", (validationStatus) => {
            renderCard({ validationStatus });

            expect(root()).toHaveClass(`radio-card-${validationStatus}`);
            expect(root()).toHaveAttribute("data-validation", validationStatus);
        });

        it("marks the radio invalid for the error status", () => {
            renderCard({ validationStatus: "error" });
            expect(control()).toHaveAttribute("aria-invalid", "true");
        });

        it("does not mark the radio invalid for the success status", () => {
            renderCard({ validationStatus: "success" });
            expect(control()).not.toHaveAttribute("aria-invalid");
        });
    });

    it("marks the radio required for assistive technology", () => {
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
            <RadioCard ref={ref} name="plan" value="team" data-testid="card">
                <RadioCard.Label>Team</RadioCard.Label>
            </RadioCard>,
        );

        expect(ref.current).toBe(root());
    });

    it("merges a custom className onto the root element", () => {
        renderCard({ className: "custom" });
        expect(root()).toHaveClass("radio-card", "custom");
    });

    it("merges a custom className onto the parts", () => {
        render(
            <RadioCard name="plan" value="team" data-testid="card">
                <RadioCard.LeadingVisual className="custom-visual">
                    <svg />
                </RadioCard.LeadingVisual>
                <RadioCard.Label className="custom-label">Team</RadioCard.Label>
                <RadioCard.Description className="custom-description">
                    For a small group
                </RadioCard.Description>
            </RadioCard>,
        );

        expect(root().querySelector("[data-component='RadioCard.LeadingVisual']")).toHaveClass(
            "radio-card-leading-visual",
            "custom-visual",
        );
        expect(screen.getByText("Team")).toHaveClass("radio-card-label", "custom-label");
        expect(screen.getByText("For a small group")).toHaveClass(
            "radio-card-description",
            "custom-description",
        );
    });

    describe("the leading visual", () => {
        it("stays out of the accessibility tree while it is unlabelled", () => {
            render(
                <RadioCard name="plan" value="team" data-testid="card">
                    <RadioCard.LeadingVisual>
                        <svg />
                    </RadioCard.LeadingVisual>
                    <RadioCard.Label>Team</RadioCard.Label>
                </RadioCard>,
            );

            const visual = root().querySelector("[data-component='RadioCard.LeadingVisual']");
            expect(visual).toHaveAttribute("aria-hidden", "true");
            expect(visual).not.toHaveAttribute("role");
        });

        it("is read as an image once it has been named", () => {
            render(
                <RadioCard name="plan" value="team" data-testid="card">
                    <RadioCard.LeadingVisual aria-label="People">
                        <svg />
                    </RadioCard.LeadingVisual>
                    <RadioCard.Label>Team</RadioCard.Label>
                </RadioCard>,
            );

            expect(screen.getByRole("img", { name: "People" })).toBeInTheDocument();
        });

        it("leads the words rather than standing beside the radio", () => {
            render(
                <RadioCard name="plan" value="team" data-testid="card">
                    <RadioCard.LeadingVisual>
                        <svg />
                    </RadioCard.LeadingVisual>
                    <RadioCard.Label>Team</RadioCard.Label>
                </RadioCard>,
            );

            expect(root().children[0]).toHaveAttribute("data-component", "RadioCard.LeadingVisual");
        });
    });
});
