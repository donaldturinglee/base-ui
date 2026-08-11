import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { InfoRegular } from "@gamecrafters/base-ui-icons";
import { InlineMessage } from ".";
import type { InlineMessageProps, InlineMessageVariant } from "./InlineMessage.types";

const renderMessage = (props: Partial<InlineMessageProps> = {}) =>
    render(
        <InlineMessage data-testid="message" {...props}>
            {props.children ?? "An example inline message"}
        </InlineMessage>,
    );

const message = () => screen.getByTestId("message");

const icon = () => message().querySelector("[data-component='InlineMessage.Icon'] svg");

describe("InlineMessage", () => {
    it("renders a div element", () => {
        renderMessage();
        expect(message().tagName).toBe("DIV");
    });

    it("tags the elements with data-component attributes", () => {
        renderMessage();
        expect(message()).toHaveAttribute("data-component", "InlineMessage");
        expect(message().querySelector("[data-component='InlineMessage.Icon']")).not.toBeNull();
        expect(screen.getByText("An example inline message")).toHaveAttribute(
            "data-component",
            "InlineMessage.Content",
        );
    });

    it("renders what it is given to say", () => {
        renderMessage({ children: "The branch is behind main" });
        expect(screen.getByText("The branch is behind main")).toBeInTheDocument();
    });

    it("holds the message to its own column, clear of the icon", () => {
        renderMessage();
        expect(message()).toHaveClass("inline-message");
    });

    it("falls back to the medium size", () => {
        renderMessage();
        expect(message()).toHaveAttribute("data-size", "medium");
        expect(message()).toHaveClass("inline-message-medium");
    });

    it("respects the size prop", () => {
        const sizes = {
            small: "inline-message-small",
            medium: "inline-message-medium",
        } as const;

        for (const [size, expected] of Object.entries(sizes)) {
            const { unmount } = renderMessage({ size: size as keyof typeof sizes });
            expect(message()).toHaveAttribute("data-size", size);
            expect(message()).toHaveClass(expected);
            unmount();
        }
    });

    it("respects the variant prop", () => {
        const variants = {
            critical: "inline-message-critical",
            success: "inline-message-success",
            unavailable: "inline-message-unavailable",
            warning: "inline-message-warning",
        } as const;

        for (const [variant, expected] of Object.entries(variants)) {
            const { unmount } = renderMessage({ variant: variant as InlineMessageVariant });
            expect(message()).toHaveAttribute("data-variant", variant);
            expect(message()).toHaveClass(expected);
            unmount();
        }
    });

    it("leaves the variant unstated where it has not been given one", () => {
        // The message is then read in the colour of the text around it
        renderMessage();
        expect(message()).not.toHaveAttribute("data-variant");
        expect(message().className).not.toMatch(/\binline-message-(critical|success|warning)\b/);
    });

    it("carries the icon that belongs to the variant", () => {
        const icons = {
            critical: "icon-error-circle-regular",
            success: "icon-checkmark-circle-regular",
            unavailable: "icon-warning-regular",
            warning: "icon-warning-regular",
        } as const;

        for (const [variant, expected] of Object.entries(icons)) {
            const { unmount } = renderMessage({ variant: variant as InlineMessageVariant });
            expect(icon()).toHaveClass(expected);
            unmount();
        }
    });

    it("carries an information icon where it has no variant", () => {
        renderMessage();
        expect(icon()).toHaveClass("icon-info-regular");
    });

    it("keeps the icon out of the reading, since the message says it all", () => {
        renderMessage({ variant: "success" });
        expect(icon()).toHaveAttribute("aria-hidden", "true");
    });

    it("stands a visual it is given in place of the icon the variant carries", () => {
        // Anything that can stand as a component is called with no props of its own, which
        // covers a plain function, a memo and a forwarded ref alike
        const Memo = React.memo(() => <span data-testid="memo">Memo</span>);
        const Forwarded = React.forwardRef<HTMLSpanElement>((_props, ref) => (
            <span ref={ref} data-testid="forwarded">
                Forwarded
            </span>
        ));
        Forwarded.displayName = "Forwarded";

        render(
            <>
                <InlineMessage
                    variant="critical"
                    leadingVisual={<InfoRegular data-testid="element" />}
                >
                    Given as an element
                </InlineMessage>
                <InlineMessage variant="critical" leadingVisual={Memo}>
                    Given as a memo
                </InlineMessage>
                <InlineMessage variant="critical" leadingVisual={Forwarded}>
                    Given as a forwarded ref
                </InlineMessage>
            </>,
        );

        expect(screen.getByTestId("element")).toBeInTheDocument();
        expect(screen.getByTestId("memo")).toBeInTheDocument();
        expect(screen.getByTestId("forwarded")).toBeInTheDocument();
        // The icon the variant would have carried is not drawn as well
        expect(document.querySelectorAll("svg.icon-error-circle-regular")).toHaveLength(0);
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(
            <InlineMessage ref={ref} data-testid="message" variant="success">
                An example inline message
            </InlineMessage>,
        );
        expect(ref.current).toBe(message());
    });

    it("merges a custom className onto the root element", () => {
        renderMessage({ className: "custom" });
        expect(message()).toHaveClass("custom");
    });

    it("passes extra props onto the root element", () => {
        renderMessage({ "aria-label": "Status" });
        expect(message()).toHaveAttribute("aria-label", "Status");
    });
});
