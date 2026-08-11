import * as React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Textarea, getCharacterCount, SCREEN_READER_DELAY } from ".";

const field = () => screen.getByRole("textbox").parentElement;

describe("getCharacterCount", () => {
    it("counts down to the limit", () => {
        expect(getCharacterCount(4, 10)).toMatchObject({
            count: 6,
            isOverLimit: false,
            message: "6 characters remaining",
        });
    });

    it("says character in the singular", () => {
        expect(getCharacterCount(9, 10).message).toBe("1 character remaining");
        expect(getCharacterCount(11, 10).message).toBe("1 character over");
    });

    it("counts up once the limit is passed", () => {
        expect(getCharacterCount(13, 10)).toMatchObject({
            count: 3,
            isOverLimit: true,
            message: "3 characters over",
        });
    });

    it("treats the limit exactly as within it", () => {
        expect(getCharacterCount(10, 10)).toMatchObject({
            count: 0,
            isOverLimit: false,
            message: "0 characters remaining",
        });
    });
});

describe("Textarea", () => {
    it("renders a native textarea", () => {
        render(<Textarea aria-label="Notes" />);
        expect(screen.getByRole("textbox", { name: "Notes" }).tagName).toBe("TEXTAREA");
    });

    it("tags the field with a data-component attribute", () => {
        render(<Textarea aria-label="Notes" />);
        expect(field()).toHaveAttribute("data-component", "Textarea");
    });

    it("starts empty", () => {
        render(<Textarea aria-label="Notes" />);
        expect(screen.getByRole("textbox")).toHaveValue("");
    });

    it("falls back to seven rows and thirty columns", () => {
        render(<Textarea aria-label="Notes" />);
        const textarea = screen.getByRole("textbox");
        expect(textarea).toHaveAttribute("rows", "7");
        expect(textarea).toHaveAttribute("cols", "30");
    });

    it("takes a value it is given", () => {
        render(<Textarea aria-label="Notes" defaultValue="Hello" />);
        expect(screen.getByRole("textbox")).toHaveValue("Hello");
    });

    it("follows a controlled value", () => {
        render(<Textarea aria-label="Notes" value="Hello" onChange={() => {}} />);
        expect(screen.getByRole("textbox")).toHaveValue("Hello");
    });

    it("reports a change", () => {
        const onChange = vi.fn();
        render(<Textarea aria-label="Notes" onChange={onChange} />);

        fireEvent.change(screen.getByRole("textbox"), { target: { value: "Hello" } });
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("falls back to resizing on both axes", () => {
        render(<Textarea aria-label="Notes" />);
        const textarea = screen.getByRole("textbox");
        expect(textarea).toHaveAttribute("data-resize", "both");
        expect(textarea).toHaveClass("textarea-resize-both");
    });

    it("respects the resize prop", () => {
        const resizes = {
            none: "textarea-resize-none",
            both: "textarea-resize-both",
            horizontal: "textarea-resize-horizontal",
            vertical: "textarea-resize-vertical",
        } as const;

        for (const [resize, expected] of Object.entries(resizes)) {
            const { unmount } = render(
                <Textarea aria-label="Notes" resize={resize as keyof typeof resizes} />,
            );
            const textarea = screen.getByRole("textbox");
            expect(textarea).toHaveAttribute("data-resize", resize);
            expect(textarea).toHaveClass(expected);
            unmount();
        }
    });

    it("stops a disabled field being resized", () => {
        render(<Textarea aria-label="Notes" disabled />);
        expect(screen.getByRole("textbox")).toHaveClass("textarea");
    });

    it("fills its container when block", () => {
        render(<Textarea aria-label="Notes" block />);
        expect(field()).toHaveAttribute("data-block", "true");
        expect(field()).toHaveClass("textarea-field-block");
    });

    it("recesses itself when contrast", () => {
        render(<Textarea aria-label="Notes" contrast />);
        expect(field()).toHaveAttribute("data-contrast", "true");
        expect(field()).toHaveClass("textarea-field-contrast");
    });

    it("disables the control and dims the field", () => {
        render(<Textarea aria-label="Notes" disabled />);
        expect(screen.getByRole("textbox")).toBeDisabled();
        expect(field()).toHaveAttribute("data-disabled", "true");
        expect(field()).toHaveClass("textarea-field-disabled");
    });

    it("marks itself required for assistive technology", () => {
        render(<Textarea aria-label="Notes" required />);
        const textarea = screen.getByRole("textbox");
        expect(textarea).toBeRequired();
        expect(textarea).toHaveAttribute("aria-required", "true");
    });

    it("marks itself invalid for the error status", () => {
        render(<Textarea aria-label="Notes" validationStatus="error" />);
        expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
        expect(field()).toHaveAttribute("data-validation", "error");
    });

    it("does not mark itself invalid for the success status", () => {
        render(<Textarea aria-label="Notes" validationStatus="success" />);
        expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-invalid");
        expect(field()).toHaveAttribute("data-validation", "success");
    });

    it("takes a minimum and maximum height", () => {
        render(<Textarea aria-label="Notes" minHeight={100} maxHeight={200} />);
        expect(screen.getByRole("textbox")).toHaveStyle({
            minHeight: "100px",
            maxHeight: "200px",
        });
    });

    it("merges a custom style onto the control", () => {
        render(<Textarea aria-label="Notes" minHeight={100} style={{ opacity: 0.5 }} />);
        const textarea = screen.getByRole("textbox");
        expect(textarea).toHaveStyle({ opacity: "0.5" });
        expect(textarea).toHaveStyle({ minHeight: "100px" });
    });

    it("forwards a ref to the control", () => {
        const ref = React.createRef<HTMLTextAreaElement>();
        render(<Textarea ref={ref} aria-label="Notes" />);
        expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    });

    it("merges a custom className onto the field", () => {
        render(<Textarea aria-label="Notes" className="custom" />);
        expect(field()).toHaveClass("custom");
    });
});

describe("Textarea character limit", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("shows no counter without a limit", () => {
        render(<Textarea aria-label="Notes" />);
        expect(screen.queryByText(/remaining/)).not.toBeInTheDocument();
    });

    it("counts down from the limit", () => {
        render(<Textarea aria-label="Notes" characterLimit={10} />);
        expect(screen.getByText("10 characters remaining")).toBeInTheDocument();
    });

    it("counts from a starting value", () => {
        render(<Textarea aria-label="Notes" characterLimit={10} defaultValue="Hello" />);
        expect(screen.getByText("5 characters remaining")).toBeInTheDocument();
    });

    it("counts from a controlled value", () => {
        render(
            <Textarea aria-label="Notes" characterLimit={10} value="Hello" onChange={() => {}} />,
        );
        expect(screen.getByText("5 characters remaining")).toBeInTheDocument();
    });

    it("counts down as the reader types", () => {
        render(<Textarea aria-label="Notes" characterLimit={10} />);

        fireEvent.change(screen.getByRole("textbox"), { target: { value: "Hello" } });
        expect(screen.getByText("5 characters remaining")).toBeInTheDocument();
    });

    it("reports an error once the limit is passed", () => {
        const { container } = render(<Textarea aria-label="Notes" characterLimit={3} />);

        fireEvent.change(screen.getByRole("textbox"), { target: { value: "Hello" } });
        expect(screen.getByText("2 characters over")).toBeInTheDocument();
        expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
        expect(field()).toHaveAttribute("data-validation", "error");
        expect(container.querySelector("svg")).not.toBeNull();
    });

    it("clears the error once the reader is back within the limit", () => {
        render(<Textarea aria-label="Notes" characterLimit={3} />);
        const textarea = screen.getByRole("textbox");

        fireEvent.change(textarea, { target: { value: "Hello" } });
        expect(textarea).toHaveAttribute("aria-invalid", "true");

        fireEvent.change(textarea, { target: { value: "Hi" } });
        expect(textarea).not.toHaveAttribute("aria-invalid");
        expect(screen.getByText("1 character remaining")).toBeInTheDocument();
    });

    it("describes the limit before the reader starts", () => {
        render(<Textarea aria-label="Notes" characterLimit={10} />);
        const describedBy = screen.getByRole("textbox").getAttribute("aria-describedby");
        expect(describedBy).toBeTruthy();
        expect(document.getElementById(describedBy ?? "")).toHaveTextContent(
            "You can enter up to 10 characters",
        );
    });

    it("says character in the singular in the description", () => {
        render(<Textarea aria-label="Notes" characterLimit={1} />);
        const describedBy = screen.getByRole("textbox").getAttribute("aria-describedby");
        expect(document.getElementById(describedBy ?? "")).toHaveTextContent(
            "You can enter up to 1 character",
        );
    });

    it("keeps a caller's own description alongside its own", () => {
        render(
            <>
                <span id="hint">Keep it short</span>
                <Textarea aria-label="Notes" characterLimit={10} aria-describedby="hint" />
            </>,
        );
        const describedBy = screen.getByRole("textbox").getAttribute("aria-describedby");
        expect(describedBy?.split(" ")).toHaveLength(2);
        expect(describedBy).toContain("hint");
    });

    it("keeps the visible counter out of the accessibility tree", () => {
        render(<Textarea aria-label="Notes" characterLimit={10} />);
        expect(screen.getByText("10 characters remaining").closest("[aria-hidden]")).not.toBeNull();
    });

    it("says nothing in the live region until the reader has typed", () => {
        render(<Textarea aria-label="Notes" characterLimit={10} />);
        const live = screen.getByRole("status");
        expect(live).toBeEmptyDOMElement();

        act(() => {
            vi.advanceTimersByTime(SCREEN_READER_DELAY);
        });
        expect(live).toBeEmptyDOMElement();
    });

    it("announces the count once the reader pauses", () => {
        render(<Textarea aria-label="Notes" characterLimit={10} />);
        const live = screen.getByRole("status");

        fireEvent.change(screen.getByRole("textbox"), { target: { value: "Hello" } });
        expect(live).toBeEmptyDOMElement();

        act(() => {
            vi.advanceTimersByTime(SCREEN_READER_DELAY);
        });
        expect(live).toHaveTextContent("5 characters remaining");
    });

    it("only announces the last count in a run of typing", () => {
        render(<Textarea aria-label="Notes" characterLimit={10} />);
        const textarea = screen.getByRole("textbox");
        const live = screen.getByRole("status");

        fireEvent.change(textarea, { target: { value: "H" } });
        act(() => {
            vi.advanceTimersByTime(SCREEN_READER_DELAY / 2);
        });
        fireEvent.change(textarea, { target: { value: "Hello" } });
        act(() => {
            vi.advanceTimersByTime(SCREEN_READER_DELAY);
        });

        expect(live).toHaveTextContent("5 characters remaining");
    });
});
