import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { Checkbox } from "../checkbox";
import { CheckboxGroup } from "../checkbox-group";
import { Radio } from "../radio";
import { Select } from "../select";
import { TextInput } from "../text-input";
import { Textarea } from "../textarea";
import { FormControl } from ".";
import { useFormControlForwardedProps } from "./useFormControlForwardedProps";

const CustomInput = (props: React.ComponentPropsWithoutRef<"input">) => {
    const inputProps = useFormControlForwardedProps(props);

    return <input type="text" {...inputProps} />;
};

describe("FormControl", () => {
    it("names the input from its label", () => {
        render(
            <FormControl>
                <FormControl.Label>Name</FormControl.Label>
                <TextInput />
            </FormControl>,
        );
        expect(screen.getByLabelText("Name")).toBeInTheDocument();
    });

    it("tags the field and its parts with data-component attributes", () => {
        const { container } = render(
            <FormControl>
                <FormControl.Label>Name</FormControl.Label>
                <TextInput />
                <FormControl.Caption>Hint</FormControl.Caption>
                <FormControl.Validation variant="error">Not valid</FormControl.Validation>
            </FormControl>,
        );

        for (const name of [
            "FormControl",
            "FormControl.Label",
            "FormControl.Caption",
            "FormControl.Validation",
        ]) {
            expect(container.querySelector(`[data-component="${name}"]`)).not.toBeNull();
        }
    });

    it("gives the input the field's id", () => {
        render(
            <FormControl id="customId">
                <FormControl.Label>Name</FormControl.Label>
                <TextInput />
            </FormControl>,
        );
        expect(screen.getByLabelText("Name")).toHaveAttribute("id", "customId");
    });

    it("describes the input with its caption", () => {
        render(
            <FormControl id="field">
                <FormControl.Label>Name</FormControl.Label>
                <TextInput />
                <FormControl.Caption>Hint</FormControl.Caption>
            </FormControl>,
        );

        expect(screen.getByText("Hint")).toHaveAttribute("id", "field-caption");
        expect(screen.getByLabelText("Name")).toHaveAttribute("aria-describedby", "field-caption");
    });

    it("describes the input with its validation message", () => {
        render(
            <FormControl id="field">
                <FormControl.Label>Name</FormControl.Label>
                <TextInput />
                <FormControl.Validation variant="error">Not valid</FormControl.Validation>
            </FormControl>,
        );

        expect(screen.getByText("Not valid")).toHaveAttribute("id", "field-validation");
        expect(screen.getByLabelText("Name")).toHaveAttribute(
            "aria-describedby",
            "field-validation",
        );
    });

    it("describes the input with the validation message before the caption", () => {
        render(
            <FormControl id="field">
                <FormControl.Label>Name</FormControl.Label>
                <TextInput />
                <FormControl.Caption>Hint</FormControl.Caption>
                <FormControl.Validation variant="error">Not valid</FormControl.Validation>
            </FormControl>,
        );

        expect(screen.getByLabelText("Name")).toHaveAttribute(
            "aria-describedby",
            "field-validation field-caption",
        );
    });

    it("hands the validation variant to the input", () => {
        const { container } = render(
            <FormControl>
                <FormControl.Label>Name</FormControl.Label>
                <TextInput />
                <FormControl.Validation variant="error">Not valid</FormControl.Validation>
            </FormControl>,
        );

        expect(container.querySelector('[data-component="TextInput"]')).toHaveAttribute(
            "data-validation",
            "error",
        );
        expect(screen.getByLabelText("Name")).toHaveAttribute("aria-invalid", "true");
    });

    it("colours the validation message by its variant", () => {
        const { container } = render(
            <FormControl>
                <FormControl.Label>Name</FormControl.Label>
                <TextInput />
                <FormControl.Validation variant="success">Looks good</FormControl.Validation>
            </FormControl>,
        );

        const validation = container.querySelector('[data-component="FormControl.Validation"]');
        expect(validation).toHaveAttribute("data-validation-status", "success");
        expect(validation).toHaveClass("[color:var(--foreground-color-success)]");
        expect(validation?.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    });

    it("disables the input", () => {
        render(
            <FormControl disabled>
                <FormControl.Label>Name</FormControl.Label>
                <TextInput />
            </FormControl>,
        );
        expect(screen.getByLabelText("Name")).toBeDisabled();
    });

    it("dims the label and the caption of a disabled field", () => {
        const { container } = render(
            <FormControl disabled>
                <FormControl.Label>Name</FormControl.Label>
                <TextInput />
                <FormControl.Caption>Hint</FormControl.Caption>
            </FormControl>,
        );

        for (const name of ["FormControl.Label", "FormControl.Caption"]) {
            expect(container.querySelector(`[data-component="${name}"]`)).toHaveClass(
                "[color:var(--control-foreground-color-disabled)]",
            );
        }
    });

    it("takes its disabled state from a group standing around it", () => {
        const { container } = render(
            <CheckboxGroup disabled>
                <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
                <FormControl>
                    <Checkbox value="one" />
                    <FormControl.Label>One</FormControl.Label>
                </FormControl>
            </CheckboxGroup>,
        );

        expect(container.querySelector('[data-component="FormControl"]')).toHaveAttribute(
            "data-disabled",
            "true",
        );
    });

    it("requires the input", () => {
        render(
            <FormControl required>
                <FormControl.Label>Name</FormControl.Label>
                <TextInput />
            </FormControl>,
        );
        expect(screen.getByRole("textbox")).toBeRequired();
    });

    it("marks a required field in its label", () => {
        render(
            <FormControl required>
                <FormControl.Label>Name</FormControl.Label>
                <TextInput />
            </FormControl>,
        );
        expect(screen.getByText("*")).toBeInTheDocument();
    });

    it("words the required mark, and can take it out of the accessibility tree", () => {
        render(
            <FormControl required>
                <FormControl.Label requiredText="(required)" requiredIndicator={false}>
                    Name
                </FormControl.Label>
                <TextInput />
            </FormControl>,
        );

        expect(screen.getByText("(required)")).toHaveAttribute("aria-hidden", "true");
    });

    it("hides the label from view while keeping it as the input's name", () => {
        const { container } = render(
            <FormControl>
                <FormControl.Label visuallyHidden>Name</FormControl.Label>
                <TextInput />
            </FormControl>,
        );

        expect(container.querySelector('[data-component="FormControl.Label"]')).toHaveClass(
            "sr-only",
        );
        expect(screen.getByLabelText("Name")).toBeInTheDocument();
    });

    it("wires up a select and a textarea the same way", () => {
        render(
            <>
                <FormControl id="pick">
                    <FormControl.Label>Pick one</FormControl.Label>
                    <Select>
                        <Select.Option value="one">One</Select.Option>
                    </Select>
                </FormControl>
                <FormControl id="say">
                    <FormControl.Label>Say something</FormControl.Label>
                    <Textarea />
                </FormControl>
            </>,
        );

        expect(screen.getByLabelText("Pick one")).toHaveAttribute("id", "pick");
        expect(screen.getByLabelText("Say something")).toHaveAttribute("id", "say");
    });

    it("lets the input keep whatever the caller set on it", () => {
        render(
            <FormControl id="field">
                <FormControl.Label htmlFor="own-id">Name</FormControl.Label>
                <TextInput id="own-id" />
            </FormControl>,
        );
        expect(screen.getByLabelText("Name")).toHaveAttribute("id", "own-id");
    });

    it("leaves anything that is not an input to stand where it was written", () => {
        render(
            <FormControl>
                <FormControl.Label>Name</FormControl.Label>
                <TextInput />
                <span>Extra</span>
            </FormControl>,
        );
        expect(screen.getByText("Extra")).toBeInTheDocument();
    });

    describe("choice inputs", () => {
        it("reads across, whatever layout was asked for", () => {
            const { container } = render(
                <FormControl>
                    <Checkbox value="one" />
                    <FormControl.Label>One</FormControl.Label>
                </FormControl>,
            );

            expect(container.querySelector('[data-component="FormControl"]')).toHaveAttribute(
                "data-layout",
                "horizontal",
            );
        });

        it("describes a checkbox with its caption alone", () => {
            render(
                <FormControl id="field">
                    <Checkbox value="one" />
                    <FormControl.Label>One</FormControl.Label>
                    <FormControl.Caption>Hint</FormControl.Caption>
                </FormControl>,
            );

            expect(screen.getByLabelText("One")).toHaveAttribute(
                "aria-describedby",
                "field-caption",
            );
        });

        it("requires a checkbox on its own", () => {
            render(
                <FormControl required>
                    <Checkbox value="one" />
                    <FormControl.Label>One</FormControl.Label>
                </FormControl>,
            );
            expect(screen.getByRole("checkbox")).toBeRequired();
        });

        it("never requires a radio on its own", () => {
            render(
                <FormControl required>
                    <Radio value="one" name="choices" />
                    <FormControl.Label>One</FormControl.Label>
                </FormControl>,
            );
            expect(screen.getByRole("radio")).not.toBeRequired();
        });

        it("renders a leading visual between the box and its name", () => {
            const { container } = render(
                <FormControl>
                    <Checkbox value="one" />
                    <FormControl.Label>One</FormControl.Label>
                    <FormControl.LeadingVisual>
                        <svg aria-label="Icon" />
                    </FormControl.LeadingVisual>
                </FormControl>,
            );

            expect(container.querySelector('[data-component="FormControl"]')).toHaveAttribute(
                "data-has-leading-visual",
                "true",
            );
            expect(
                container.querySelector('[data-component="FormControl.LeadingVisual"]'),
            ).not.toBeNull();
        });

        it("grows the leading visual where there is a caption to stand against", () => {
            const { container } = render(
                <FormControl>
                    <Checkbox value="one" />
                    <FormControl.Label>One</FormControl.Label>
                    <FormControl.LeadingVisual>
                        <svg aria-label="Icon" />
                    </FormControl.LeadingVisual>
                    <FormControl.Caption>Hint</FormControl.Caption>
                </FormControl>,
            );

            expect(
                container.querySelector('[data-component="FormControl.LeadingVisual"]'),
            ).toHaveClass("[--leading-visual-size:var(--base-size-24)]");
        });
    });

    describe("horizontal layout", () => {
        it("reads across when it is asked to", () => {
            const { container } = render(
                <FormControl layout="horizontal">
                    <TextInput />
                    <FormControl.Label>Name</FormControl.Label>
                </FormControl>,
            );

            expect(container.querySelector('[data-component="FormControl"]')).toHaveAttribute(
                "data-layout",
                "horizontal",
            );
        });

        it("renders the input once", () => {
            render(
                <FormControl layout="horizontal">
                    <TextInput />
                    <FormControl.Label>Name</FormControl.Label>
                </FormControl>,
            );
            expect(screen.getAllByRole("textbox")).toHaveLength(1);
        });
    });

    describe("label element", () => {
        it("points a label at the input", () => {
            const { container } = render(
                <FormControl id="field">
                    <FormControl.Label>Name</FormControl.Label>
                    <TextInput />
                </FormControl>,
            );
            expect(container.querySelector("label")).toHaveAttribute("for", "field");
        });

        it("gives a span nothing to point at", () => {
            const { container } = render(
                <FormControl id="field">
                    <FormControl.Label as="span">Name</FormControl.Label>
                    <TextInput />
                </FormControl>,
            );

            const label = container.querySelector('[data-component="FormControl.Label"]');
            expect(label?.tagName).toBe("SPAN");
            expect(label).not.toHaveAttribute("for");
        });

        it("names the label so it can be pointed at from elsewhere", () => {
            const { container } = render(
                <FormControl id="field">
                    <FormControl.Label>Name</FormControl.Label>
                    <TextInput />
                </FormControl>,
            );
            expect(container.querySelector("label")).toHaveAttribute("id", "field-label");
        });
    });

    describe("useFormControlForwardedProps", () => {
        it("wires an input of the caller's own into the field", () => {
            render(
                <FormControl id="field" required disabled>
                    <FormControl.Label>Name</FormControl.Label>
                    <CustomInput />
                    <FormControl.Caption>Hint</FormControl.Caption>
                </FormControl>,
            );

            const input = screen.getByRole("textbox");
            expect(input).toHaveAttribute("id", "field");
            expect(input).toBeRequired();
            expect(input).toBeDisabled();
            expect(input).toHaveAttribute("aria-describedby", "field-caption");
        });

        it("lets the caller's own props stand", () => {
            render(
                <FormControl id="field">
                    <FormControl.Label htmlFor="own-id">Name</FormControl.Label>
                    <CustomInput id="own-id" />
                </FormControl>,
            );
            expect(screen.getByLabelText("Name")).toHaveAttribute("id", "own-id");
        });

        it("hands back what it was given outside a field", () => {
            render(<CustomInput aria-label="Loose" />);

            const input = screen.getByLabelText("Loose");
            expect(input).not.toBeRequired();
            expect(input).not.toHaveAttribute("aria-describedby");
        });
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(
            <FormControl ref={ref}>
                <FormControl.Label>Name</FormControl.Label>
                <TextInput />
            </FormControl>,
        );
        expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("merges a custom className onto the root element", () => {
        render(
            <FormControl className="custom" data-testid="field">
                <FormControl.Label>Name</FormControl.Label>
                <TextInput />
            </FormControl>,
        );
        expect(screen.getByTestId("field")).toHaveClass("custom");
    });
});
