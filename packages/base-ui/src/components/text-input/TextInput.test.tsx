import * as React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { SearchRegular } from "@gamecrafters/base-ui-icons";
import { SCREEN_READER_DELAY } from "../textarea";
import { TextInput } from ".";

const input = () => screen.getByRole("textbox");

const field = () => input().parentElement as HTMLElement;

const part = (name: string) => field().querySelector(`[data-component='TextInput.${name}']`);

describe("TextInput", () => {
    it("renders a native input", () => {
        render(<TextInput aria-label="Name" />);
        const textbox = screen.getByRole("textbox", { name: "Name" });
        expect(textbox.tagName).toBe("INPUT");
        expect(textbox).toHaveAttribute("type", "text");
    });

    it("tags the field and the control with data-component attributes", () => {
        render(<TextInput aria-label="Name" />);
        expect(field()).toHaveAttribute("data-component", "TextInput");
        expect(input()).toHaveAttribute("data-component", "TextInput.Input");
    });

    it("takes the type it is given", () => {
        render(<TextInput aria-label="Site" type="url" />);
        expect(input()).toHaveAttribute("type", "url");
    });

    it("starts empty", () => {
        render(<TextInput aria-label="Name" />);
        expect(input()).toHaveValue("");
    });

    it("takes a value it is given", () => {
        render(<TextInput aria-label="Name" defaultValue="Ada" />);
        expect(input()).toHaveValue("Ada");
    });

    it("follows a controlled value", () => {
        render(<TextInput aria-label="Name" value="Ada" onChange={() => {}} />);
        expect(input()).toHaveValue("Ada");
    });

    it("reports a change", () => {
        const onChange = vi.fn();
        render(<TextInput aria-label="Name" onChange={onChange} />);

        fireEvent.change(input(), { target: { value: "Ada" } });
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("falls back to the medium size", () => {
        render(<TextInput aria-label="Name" />);
        expect(field()).toHaveAttribute("data-size", "medium");
        expect(field()).toHaveClass("input-medium");
    });

    it("respects the size prop", () => {
        const sizes = {
            small: "input-small",
            medium: "input-medium",
            large: "input-large",
        } as const;

        for (const [size, expected] of Object.entries(sizes)) {
            const { unmount } = render(
                <TextInput aria-label="Name" size={size as keyof typeof sizes} />,
            );
            expect(field()).toHaveAttribute("data-size", size);
            expect(field()).toHaveClass(expected);
            unmount();
        }
    });

    it("fills its container when block", () => {
        render(<TextInput aria-label="Name" block />);
        expect(field()).toHaveAttribute("data-block", "true");
        expect(field()).toHaveClass("input-block");
    });

    it("recesses itself when contrast", () => {
        render(<TextInput aria-label="Name" contrast />);
        expect(field()).toHaveAttribute("data-contrast", "true");
        expect(field()).toHaveClass("input-contrast");
    });

    it("sets the typing area in the monospace stack", () => {
        render(<TextInput aria-label="Name" monospace />);
        expect(field()).toHaveAttribute("data-monospace", "true");
        expect(field()).toHaveClass("input-monospace");
    });

    it("disables the control and dims the field", () => {
        render(<TextInput aria-label="Name" disabled />);
        expect(input()).toBeDisabled();
        expect(field()).toHaveAttribute("data-disabled", "true");
        expect(field()).toHaveClass("input-disabled");
    });

    it("marks itself required for assistive technology", () => {
        render(<TextInput aria-label="Name" required />);
        expect(input()).toBeRequired();
        expect(input()).toHaveAttribute("aria-required", "true");
    });

    it("marks itself invalid for the error status", () => {
        render(<TextInput aria-label="Name" validationStatus="error" />);
        expect(input()).toHaveAttribute("aria-invalid", "true");
        expect(field()).toHaveAttribute("data-validation", "error");
    });

    it("does not mark itself invalid for the success status", () => {
        render(<TextInput aria-label="Name" validationStatus="success" />);
        expect(input()).not.toHaveAttribute("aria-invalid");
        expect(field()).toHaveAttribute("data-validation", "success");
    });

    it("focuses the control when the field around it is clicked", () => {
        render(<TextInput aria-label="Name" />);

        fireEvent.click(field());
        expect(input()).toHaveFocus();
    });

    it("leaves a segmented control to the browser when it is clicked itself", () => {
        const { container } = render(<TextInput aria-label="When" type="date" />);
        const control = container.querySelector("input") as HTMLInputElement;

        // A date is filled in segment by segment, so focusing the whole control would take
        // the reader away from the part they aimed at
        fireEvent.click(control);
        expect(control).not.toHaveFocus();
    });

    it("marks itself focused while the control holds focus", () => {
        render(<TextInput aria-label="Name" />);

        fireEvent.focus(input());
        expect(field()).toHaveAttribute("data-focused", "true");

        fireEvent.blur(input());
        expect(field()).not.toHaveAttribute("data-focused");
    });

    it("still calls a caller's own focus and blur handlers", () => {
        const onFocus = vi.fn();
        const onBlur = vi.fn();
        render(<TextInput aria-label="Name" onFocus={onFocus} onBlur={onBlur} />);

        fireEvent.focus(input());
        fireEvent.blur(input());

        expect(onFocus).toHaveBeenCalledTimes(1);
        expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it("forwards a ref to the control", () => {
        const ref = React.createRef<HTMLInputElement>();
        render(<TextInput ref={ref} aria-label="Name" />);
        expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it("merges a custom className onto the field", () => {
        render(<TextInput aria-label="Name" className="custom" />);
        expect(field()).toHaveClass("custom");
    });
});

describe("TextInput visuals", () => {
    it("shows no visuals by default", () => {
        render(<TextInput aria-label="Name" />);
        expect(part("LeadingVisual")).toBeNull();
        expect(part("TrailingVisual")).toBeNull();
        expect(field()).not.toHaveAttribute("data-leading-visual");
        expect(field()).not.toHaveAttribute("data-trailing-visual");
    });

    it("renders a leading visual given as a component", () => {
        render(<TextInput aria-label="Search" leadingVisual={SearchRegular} />);
        expect(field()).toHaveAttribute("data-leading-visual", "true");
        expect(part("LeadingVisual")?.querySelector("svg")).not.toBeNull();
    });

    it("renders a leading visual given as an element", () => {
        render(<TextInput aria-label="Search" leadingVisual={<SearchRegular />} />);
        expect(part("LeadingVisual")?.querySelector("svg")).not.toBeNull();
    });

    it("renders a leading visual given as plain text", () => {
        render(<TextInput aria-label="Amount" leadingVisual="$" />);
        expect(part("LeadingVisual")).toHaveTextContent("$");
    });

    it("renders a leading visual given as a memoised component", () => {
        const Amount = React.memo(() => <span>$</span>);
        render(<TextInput aria-label="Amount" leadingVisual={Amount} />);
        expect(part("LeadingVisual")).toHaveTextContent("$");
    });

    it("treats a visual given as a string as a label rather than as a tag", () => {
        render(<TextInput aria-label="Amount" leadingVisual="span" />);
        const visual = part("LeadingVisual");
        expect(visual).toHaveTextContent("span");
        expect(visual?.querySelector("span")).toBeNull();
    });

    it("renders a visual given as anything else already built", () => {
        render(<TextInput aria-label="Duration" trailingVisual={20} />);
        expect(part("TrailingVisual")).toHaveTextContent("20");
    });

    it("renders a trailing visual", () => {
        render(<TextInput aria-label="Duration" trailingVisual="minutes" />);
        expect(field()).toHaveAttribute("data-trailing-visual", "true");
        expect(part("TrailingVisual")).toHaveTextContent("minutes");
    });

    it("keeps a visual out of the accessibility tree", () => {
        render(<TextInput aria-label="Amount" leadingVisual="$" />);
        expect(part("LeadingVisual")).toHaveAttribute("aria-hidden", "true");
    });

    it("describes the control by the visuals beside it", () => {
        render(<TextInput aria-label="Amount" leadingVisual="$" trailingVisual="per month" />);

        const describedBy = input().getAttribute("aria-describedby")?.split(" ") ?? [];
        expect(describedBy).toHaveLength(2);
        for (const id of describedBy) {
            expect(document.getElementById(id)).not.toBeNull();
        }
    });

    it("hands the padding to the field where there is a visual to stand in it", () => {
        render(<TextInput aria-label="Amount" leadingVisual="$" />);
        expect(field()).toHaveClass("input-leading-visual-padding");
        expect(input()).not.toHaveClass("input-control-pad-start");
        expect(input()).toHaveClass("input-control-pad-end");
    });

    it("keeps the padding on the typing area where there is no visual at all", () => {
        render(<TextInput aria-label="Name" />);
        expect(input()).toHaveClass("input-control-pad-start-wide");
        expect(input()).toHaveClass("input-control-pad-end-wide");
    });

    it("widens the field's padding at the large size", () => {
        render(<TextInput aria-label="Amount" size="large" leadingVisual="$" />);
        expect(field()).toHaveClass("input-leading-visual-padding-wide");
    });
});

describe("TextInput trailing action", () => {
    const clear = (onClick: () => void) => (
        <TextInput.Action icon={SearchRegular} aria-label="Clear the field" onClick={onClick} />
    );

    it("renders an action inside the field", () => {
        render(<TextInput aria-label="Name" trailingAction={clear(() => {})} />);
        expect(field()).toHaveAttribute("data-trailing-action", "true");
        expect(part("Action")).not.toBeNull();
        expect(screen.getByRole("button", { name: "Clear the field" })).toBeInTheDocument();
    });

    it("reports a press on the action", () => {
        const onClick = vi.fn();
        render(<TextInput aria-label="Name" trailingAction={clear(onClick)} />);

        fireEvent.click(screen.getByRole("button", { name: "Clear the field" }));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("draws the ring from the control rather than from anything the field holds", () => {
        render(<TextInput aria-label="Name" trailingAction={clear(() => {})} />);

        // A field with an action inside it cannot use focus-within, which the action would
        // light up as well
        expect(field()).not.toHaveClass("input-focus");

        fireEvent.focus(input());
        expect(field()).toHaveClass("input-focus-tracked");

        fireEvent.blur(input());
        expect(field()).not.toHaveClass("input-focus-tracked");
    });

    it("uses focus-within where there is no action to press", () => {
        render(<TextInput aria-label="Name" />);
        expect(field()).toHaveClass("input-focus");
    });

    it("leaves the field's trailing padding to the action", () => {
        render(
            <TextInput
                aria-label="Name"
                trailingVisual="minutes"
                trailingAction={clear(() => {})}
            />,
        );
        expect(field()).not.toHaveClass("input-trailing-visual-padding");
    });
});

describe("TextInput loading", () => {
    const spinner = (name: "LeadingVisual" | "TrailingVisual") =>
        part(name)?.querySelector("[data-component='Spinner']");

    it("shows no spinner by default", () => {
        const { container } = render(<TextInput aria-label="Name" />);
        expect(container.querySelector("[data-component='Spinner']")).toBeNull();
        expect(field()).not.toHaveAttribute("aria-busy");
    });

    it("marks the field busy while it waits", () => {
        render(<TextInput aria-label="Name" loading />);
        expect(field()).toHaveAttribute("aria-busy", "true");
    });

    it("stands the spinner after the typing area with nothing to take the place of", () => {
        render(<TextInput aria-label="Name" loading />);
        expect(part("LeadingVisual")).toBeNull();
        expect(spinner("TrailingVisual")).toHaveClass("visible");
    });

    it("stands the spinner in place of a leading visual", () => {
        render(<TextInput aria-label="Search" loading leadingVisual={SearchRegular} />);
        expect(spinner("LeadingVisual")).toHaveClass("visible");
        expect(spinner("TrailingVisual")).toHaveClass("invisible");
    });

    it("stands the spinner where the caller asks for it", () => {
        const { unmount } = render(
            <TextInput aria-label="Name" loading loaderPosition="leading" />,
        );
        expect(spinner("LeadingVisual")).toHaveClass("visible");
        unmount();

        render(
            <TextInput
                aria-label="Search"
                loading
                loaderPosition="trailing"
                leadingVisual={SearchRegular}
            />,
        );
        expect(spinner("LeadingVisual")).toHaveClass("invisible");
        expect(spinner("TrailingVisual")).toHaveClass("visible");
    });

    it("keeps room for the spinner before the wait starts", () => {
        render(<TextInput aria-label="Name" loading={false} />);

        // The field would otherwise change width the moment it began waiting
        expect(spinner("TrailingVisual")).toHaveClass("invisible");
        expect(field()).not.toHaveAttribute("data-trailing-visual");
    });

    it("tells a screen reader what it is waiting on", () => {
        render(<TextInput aria-label="Name" loading loaderText="Checking the name" />);

        const describedBy = input().getAttribute("aria-describedby")?.split(" ") ?? [];
        const described = describedBy.map((id) => document.getElementById(id)?.textContent);
        expect(described).toContain("Checking the name");
    });

    it("falls back to Loading for the waiting text", () => {
        render(<TextInput aria-label="Name" loading />);

        const describedBy = input().getAttribute("aria-describedby")?.split(" ") ?? [];
        const described = describedBy.map((id) => document.getElementById(id)?.textContent);
        expect(described).toContain("Loading");
    });
});

describe("TextInput character limit", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("shows no counter without a limit", () => {
        render(<TextInput aria-label="Username" />);
        expect(screen.queryByText(/remaining/)).not.toBeInTheDocument();
    });

    it("counts down from the limit", () => {
        render(<TextInput aria-label="Username" characterLimit={10} />);
        expect(screen.getByText("10 characters remaining")).toBeInTheDocument();
    });

    it("counts from a starting value", () => {
        render(<TextInput aria-label="Username" characterLimit={10} defaultValue="Ada" />);
        expect(screen.getByText("7 characters remaining")).toBeInTheDocument();
    });

    it("counts from a controlled value", () => {
        render(
            <TextInput aria-label="Username" characterLimit={10} value="Ada" onChange={() => {}} />,
        );
        expect(screen.getByText("7 characters remaining")).toBeInTheDocument();
    });

    it("counts down as the reader types", () => {
        render(<TextInput aria-label="Username" characterLimit={10} />);

        fireEvent.change(input(), { target: { value: "Ada" } });
        expect(screen.getByText("7 characters remaining")).toBeInTheDocument();
    });

    it("reports an error once the limit is passed", () => {
        render(<TextInput aria-label="Username" characterLimit={3} />);

        fireEvent.change(input(), { target: { value: "Lovelace" } });
        expect(screen.getByText("5 characters over")).toBeInTheDocument();
        expect(input()).toHaveAttribute("aria-invalid", "true");
        expect(field()).toHaveAttribute("data-validation", "error");
    });

    it("clears the error once the reader is back within the limit", () => {
        render(<TextInput aria-label="Username" characterLimit={3} />);

        fireEvent.change(input(), { target: { value: "Lovelace" } });
        expect(input()).toHaveAttribute("aria-invalid", "true");

        fireEvent.change(input(), { target: { value: "Ad" } });
        expect(input()).not.toHaveAttribute("aria-invalid");
        expect(screen.getByText("1 character remaining")).toBeInTheDocument();
    });

    it("describes the limit before the reader starts", () => {
        render(<TextInput aria-label="Username" characterLimit={10} />);

        const describedBy = input().getAttribute("aria-describedby");
        expect(describedBy).toBeTruthy();
        expect(document.getElementById(describedBy ?? "")).toHaveTextContent(
            "You can enter up to 10 characters",
        );
    });

    it("keeps a caller's own description alongside its own", () => {
        render(
            <>
                <span id="hint">Choose something unique</span>
                <TextInput aria-label="Username" characterLimit={10} aria-describedby="hint" />
            </>,
        );

        const describedBy = input().getAttribute("aria-describedby");
        expect(describedBy?.split(" ")).toHaveLength(2);
        expect(describedBy).toContain("hint");
    });

    it("keeps the visible counter out of the accessibility tree", () => {
        render(<TextInput aria-label="Username" characterLimit={10} />);
        expect(screen.getByText("10 characters remaining").closest("[aria-hidden]")).not.toBeNull();
    });

    it("says nothing in the live region until the reader has typed", () => {
        render(<TextInput aria-label="Username" characterLimit={10} />);
        const live = screen.getByRole("status");
        expect(live).toBeEmptyDOMElement();

        act(() => {
            vi.advanceTimersByTime(SCREEN_READER_DELAY);
        });
        expect(live).toBeEmptyDOMElement();
    });

    it("announces the count once the reader pauses", () => {
        render(<TextInput aria-label="Username" characterLimit={10} />);
        const live = screen.getByRole("status");

        fireEvent.change(input(), { target: { value: "Ada" } });
        expect(live).toBeEmptyDOMElement();

        act(() => {
            vi.advanceTimersByTime(SCREEN_READER_DELAY);
        });
        expect(live).toHaveTextContent("7 characters remaining");
    });
});
