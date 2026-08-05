import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { Steps, DEFAULT_CURRENT_STEP } from ".";
import type { StepsOrientation, StepsProps, StepsSize } from "./Steps.types";

const LABEL = "Set up your project";

const titles = ["Create an account", "Add your details", "Start building"];

const renderSteps = (props: Partial<StepsProps> = {}) =>
    render(
        <Steps {...props} aria-label={LABEL} data-testid="steps">
            {titles.map((title) => (
                <Steps.Item key={title}>
                    <Steps.Indicator />
                    <Steps.Body>
                        <Steps.Title>{title}</Steps.Title>
                    </Steps.Body>
                </Steps.Item>
            ))}
        </Steps>,
    );

const root = () => screen.getByTestId("steps");

const items = () => Array.from(root().querySelectorAll("[data-component='Steps.Item']"));

const indicators = () => Array.from(root().querySelectorAll("[data-component='Steps.Indicator']"));

const statuses = () => items().map((item) => item.getAttribute("data-status"));

describe("Steps", () => {
    it("renders a list tagged as Steps", () => {
        renderSteps();

        expect(root()).toHaveAttribute("data-component", "Steps");
        expect(screen.getByRole("list", { name: LABEL })).toBe(root());
        expect(root().tagName).toBe("OL");
    });

    it("keeps saying it is a list, which Safari would otherwise take away", () => {
        renderSteps();
        expect(root()).toHaveAttribute("role", "list");
    });

    it("says how many steps it holds", () => {
        renderSteps();

        expect(items()).toHaveLength(titles.length);
        expect(root()).toHaveAttribute("data-count", String(titles.length));
    });

    it("counts only the children there are, leaving out the ones there are not", () => {
        render(
            <Steps aria-label={LABEL} data-testid="steps">
                <Steps.Item>
                    <Steps.Indicator />
                </Steps.Item>
                {null}
                {false}
                <Steps.Item>
                    <Steps.Indicator />
                </Steps.Item>
            </Steps>,
        );

        expect(root()).toHaveAttribute("data-count", "2");
        expect(indicators().map((indicator) => indicator.textContent)).toEqual(["1", "2"]);
    });

    it("gives each step the number it stands at", () => {
        renderSteps({ currentStep: 0 });

        expect(items().map((item) => item.getAttribute("data-index"))).toEqual(["0", "1", "2"]);
        expect(indicators().map((indicator) => indicator.textContent)).toEqual(["1", "2", "3"]);
    });

    describe("how far along the flow is", () => {
        it("stands on the first step until it is told otherwise", () => {
            renderSteps();

            expect(DEFAULT_CURRENT_STEP).toBe(1);
            expect(statuses()).toEqual(["current", "incomplete", "incomplete"]);
        });

        it("counts the steps from one, so the count names the step it has reached", () => {
            renderSteps({ currentStep: 2 });
            expect(statuses()).toEqual(["complete", "current", "incomplete"]);
        });

        it("leaves every step still to come where it has reached none of them", () => {
            renderSteps({ currentStep: 0 });
            expect(statuses()).toEqual(["incomplete", "incomplete", "incomplete"]);
        });

        it("leaves the whole flow done where it has run past the last of them", () => {
            renderSteps({ currentStep: titles.length + 1 });
            expect(statuses()).toEqual(["complete", "complete", "complete"]);
        });

        it("marks the step being worked on as the one the reader is on", () => {
            renderSteps({ currentStep: 2 });

            const current = items().map((item) => item.getAttribute("aria-current"));
            expect(current).toEqual([null, "step", null]);
        });
    });

    describe("a step told where it stands", () => {
        it("keeps what it was told over what the count says", () => {
            render(
                <Steps currentStep={3} aria-label={LABEL} data-testid="steps">
                    <Steps.Item>
                        <Steps.Indicator />
                    </Steps.Item>
                    <Steps.Item status="incomplete">
                        <Steps.Indicator />
                    </Steps.Item>
                    <Steps.Item>
                        <Steps.Indicator />
                    </Steps.Item>
                </Steps>,
            );

            expect(statuses()).toEqual(["complete", "incomplete", "current"]);
        });

        it("hands what it was told to the circle beside it", () => {
            render(
                <Steps currentStep={1} aria-label={LABEL} data-testid="steps">
                    <Steps.Item status="complete">
                        <Steps.Indicator />
                    </Steps.Item>
                </Steps>,
            );

            expect(indicators()[0]).toHaveAttribute("data-status", "complete");
        });
    });

    describe("the circle", () => {
        it("draws a checkmark in place of the number once the step is done", () => {
            renderSteps({ currentStep: 2 });

            const [done, current] = indicators();
            expect(done.querySelector("svg")).not.toBeNull();
            expect(done.textContent).toBe("");
            expect(current).toHaveTextContent("2");
        });

        it("draws what it is given in place of both", () => {
            render(
                <Steps aria-label={LABEL} data-testid="steps">
                    <Steps.Item>
                        <Steps.Indicator>
                            <svg data-testid="custom-icon" />
                        </Steps.Indicator>
                    </Steps.Item>
                </Steps>,
            );

            expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
            expect(indicators()[0].textContent).toBe("");
        });

        it("is kept from a screen reader, being a picture of what the step already says", () => {
            renderSteps();

            for (const indicator of indicators()) {
                expect(indicator).toHaveAttribute("aria-hidden", "true");
            }
        });
    });

    describe("what a screen reader hears", () => {
        const hiddenText = (index: number) => items()[index].querySelector(".sr-only")?.textContent;

        it("says a step is done, which the checkmark alone would not", () => {
            renderSteps({ currentStep: 2 });
            expect(hiddenText(0)).toBe("Completed");
        });

        it("says a step is still to come", () => {
            renderSteps({ currentStep: 2 });
            expect(hiddenText(2)).toBe("Not completed");
        });

        it("says nothing again for the step being worked on, which `aria-current` says", () => {
            renderSteps({ currentStep: 2 });

            expect(items()[1].querySelector(".sr-only")).toBeNull();
            expect(items()[1]).toHaveAttribute("aria-current", "step");
        });

        it("says the state in words of its own where it is given them", () => {
            render(
                <Steps currentStep={2} aria-label={LABEL} data-testid="steps">
                    <Steps.Item statusLabel="Skipped">
                        <Steps.Indicator />
                    </Steps.Item>
                    <Steps.Item>
                        <Steps.Indicator />
                    </Steps.Item>
                </Steps>,
            );

            expect(hiddenText(0)).toBe("Skipped");
        });

        it("leaves the state unsaid where it is given nothing to say", () => {
            render(
                <Steps currentStep={2} aria-label={LABEL} data-testid="steps">
                    <Steps.Item statusLabel="">
                        <Steps.Indicator />
                    </Steps.Item>
                </Steps>,
            );

            expect(items()[0].querySelector(".sr-only")).toBeNull();
        });
    });

    describe("orientations", () => {
        const orientations: StepsOrientation[] = ["horizontal", "vertical"];

        it("runs across the page by default", () => {
            renderSteps();

            expect(root()).toHaveAttribute("data-orientation", "horizontal");
            expect(root()).toHaveClass("steps-horizontal");
        });

        it.each(orientations)("runs %s where it is told to", (orientation) => {
            renderSteps({ orientation });

            expect(root()).toHaveAttribute("data-orientation", orientation);
            expect(root()).toHaveClass(`steps-${orientation}`);
        });
    });

    describe("sizes", () => {
        const sizes: StepsSize[] = ["small", "medium"];

        it("is drawn at the medium size by default", () => {
            renderSteps();
            expect(root()).toHaveAttribute("data-size", "medium");
        });

        it.each(sizes)("is drawn at the %s size", (size) => {
            renderSteps({ size });
            expect(root()).toHaveAttribute("data-size", size);
        });

        it("takes the size the steps are already drawn at for a medium list", () => {
            renderSteps({ size: "small" });
            expect(root()).toHaveClass("steps-small");
        });
    });

    it("stops a step standing outside of a Steps rather than drawing it wrongly", () => {
        expect(() =>
            render(
                <Steps.Item>
                    <Steps.Indicator />
                </Steps.Item>,
            ),
        ).toThrow(/within a `Steps` component/);
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLOListElement>();

        render(
            <Steps ref={ref} aria-label={LABEL} data-testid="steps">
                <Steps.Item>
                    <Steps.Indicator />
                </Steps.Item>
            </Steps>,
        );

        expect(ref.current).toBe(root());
    });

    it("merges a custom className onto the root element", () => {
        renderSteps({ className: "custom" });
        expect(root()).toHaveClass("custom");
    });

    it("merges a custom className onto the parts it is drawn from", () => {
        render(
            <Steps aria-label={LABEL} data-testid="steps">
                <Steps.Item className="custom-item">
                    <Steps.Indicator className="custom-indicator" />
                    <Steps.Body className="custom-body">
                        <Steps.Title className="custom-title">Create an account</Steps.Title>
                        <Steps.Description className="custom-description">
                            Pick a name and a password
                        </Steps.Description>
                    </Steps.Body>
                </Steps.Item>
            </Steps>,
        );

        expect(items()[0]).toHaveClass("steps-item", "custom-item");
        expect(indicators()[0]).toHaveClass("steps-indicator", "custom-indicator");
        expect(root().querySelector("[data-component='Steps.Body']")).toHaveClass(
            "steps-body",
            "custom-body",
        );
        expect(root().querySelector("[data-component='Steps.Title']")).toHaveClass(
            "steps-title",
            "custom-title",
        );
        expect(root().querySelector("[data-component='Steps.Description']")).toHaveClass(
            "steps-description",
            "custom-description",
        );
    });
});
