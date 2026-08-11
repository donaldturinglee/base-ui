import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Avatar } from "../avatar";
import AvatarStack from "./AvatarStack";

const maskClass = "avatar-stack-item-mask";

const avatars = (count: number) =>
    Array.from({ length: count }, (_, index) => (
        <img key={index} src={`avatar-${index}.png`} alt="" data-testid={`avatar-${index}`} />
    ));

describe("AvatarStack", () => {
    it("renders a span element by default", () => {
        render(<AvatarStack data-testid="stack">{avatars(2)}</AvatarStack>);
        expect(screen.getByTestId("stack").tagName).toBe("SPAN");
    });

    it("renders as the element passed to the as prop", () => {
        render(
            <AvatarStack as="div" data-testid="stack">
                {avatars(2)}
            </AvatarStack>,
        );
        expect(screen.getByTestId("stack").tagName).toBe("DIV");
    });

    it("tags the stack and its body with data-component attributes", () => {
        render(<AvatarStack data-testid="stack">{avatars(2)}</AvatarStack>);
        const stack = screen.getByTestId("stack");
        expect(stack).toHaveAttribute("data-component", "AvatarStack");
        expect(stack.querySelector('[data-component="AvatarStack.Body"]')).toBeInstanceOf(
            HTMLElement,
        );
    });

    it("renders its children", () => {
        render(<AvatarStack>{avatars(3)}</AvatarStack>);
        expect(screen.getByTestId("avatar-0")).toBeInTheDocument();
        expect(screen.getByTestId("avatar-2")).toBeInTheDocument();
    });

    it("counts the avatars, capping the count at three or more", () => {
        const { unmount } = render(<AvatarStack data-testid="stack">{avatars(2)}</AvatarStack>);
        expect(screen.getByTestId("stack")).toHaveAttribute("data-avatar-count", "2");
        unmount();

        render(<AvatarStack data-testid="stack">{avatars(5)}</AvatarStack>);
        expect(screen.getByTestId("stack")).toHaveAttribute("data-avatar-count", "3+");
    });

    it("falls back to the cascade variant", () => {
        render(<AvatarStack data-testid="stack">{avatars(2)}</AvatarStack>);
        const stack = screen.getByTestId("stack");
        expect(stack).toHaveAttribute("data-variant", "cascade");
        expect(stack).toHaveClass("avatar-stack-cascade");
    });

    it("overlaps every avatar evenly in the stack variant", () => {
        render(
            <AvatarStack variant="stack" data-testid="stack">
                {avatars(2)}
            </AvatarStack>,
        );
        const stack = screen.getByTestId("stack");
        expect(stack).toHaveAttribute("data-variant", "stack");
        expect(stack).toHaveClass("avatar-stack-stack");
    });

    it("widens the track as avatars are added", () => {
        const { unmount } = render(<AvatarStack data-testid="stack">{avatars(1)}</AvatarStack>);
        expect(screen.getByTestId("stack")).not.toHaveClass("avatar-stack-cascade-three");
        unmount();

        render(<AvatarStack data-testid="stack">{avatars(3)}</AvatarStack>);
        expect(screen.getByTestId("stack")).toHaveClass("avatar-stack-cascade-three");
    });

    it("falls back to the circle shape", () => {
        render(<AvatarStack data-testid="stack">{avatars(2)}</AvatarStack>);
        expect(screen.getByTestId("stack")).toHaveAttribute("data-shape", "circle");
        expect(screen.getByTestId("avatar-1")).toHaveClass("avatar-stack-item-circle");
    });

    it("respects the square shape", () => {
        render(
            <AvatarStack shape="square" data-testid="stack">
                {avatars(2)}
            </AvatarStack>,
        );
        expect(screen.getByTestId("stack")).toHaveAttribute("data-shape", "square");
        expect(screen.getByTestId("avatar-1")).not.toHaveClass("avatar-stack-item-circle");
    });

    it("masks each overlapping circle out of the one before it", () => {
        render(<AvatarStack data-testid="stack">{avatars(2)}</AvatarStack>);
        expect(screen.getByTestId("avatar-0")).not.toHaveClass(maskClass);
        expect(screen.getByTestId("avatar-1")).toHaveClass(maskClass);
    });

    it("layers square avatars instead of masking them", () => {
        render(
            <AvatarStack shape="square" data-testid="stack">
                {avatars(3)}
            </AvatarStack>,
        );
        expect(screen.getByTestId("avatar-0")).toHaveClass("z-5");
        expect(screen.getByTestId("avatar-1")).toHaveClass("z-4");
        expect(screen.getByTestId("avatar-1")).not.toHaveClass(maskClass);
    });

    it("pulls every avatar past the first back over the one before it", () => {
        render(<AvatarStack data-testid="stack">{avatars(2)}</AvatarStack>);
        expect(screen.getByTestId("avatar-0")).toHaveClass("avatar-stack-item-first");
        expect(screen.getByTestId("avatar-1")).toHaveClass("avatar-stack-item-overlapped");
    });

    it("fades each avatar past the second in the cascade variant", () => {
        render(<AvatarStack data-testid="stack">{avatars(4)}</AvatarStack>);
        expect(screen.getByTestId("avatar-2")).toHaveClass("avatar-stack-item-fade-third");
        expect(screen.getByTestId("avatar-3")).toHaveClass("avatar-stack-item-fade-fourth");
    });

    it("does not fade the avatars in the stack variant", () => {
        render(
            <AvatarStack variant="stack" data-testid="stack">
                {avatars(4)}
            </AvatarStack>,
        );
        expect(screen.getByTestId("avatar-3")).not.toHaveClass("avatar-stack-item-fade-fourth");
    });

    it("hides every avatar past the fifth until the stack expands", () => {
        render(<AvatarStack data-testid="stack">{avatars(7)}</AvatarStack>);
        expect(screen.getByTestId("avatar-4")).not.toHaveClass("avatar-stack-item-overflow");
        expect(screen.getByTestId("avatar-5")).toHaveClass("avatar-stack-item-overflow");
        expect(screen.getByTestId("avatar-5")).toHaveClass("avatar-stack-item-expanded");
    });

    it("takes focus so the stack can be expanded from the keyboard", () => {
        render(<AvatarStack data-testid="stack">{avatars(2)}</AvatarStack>);
        const body = screen
            .getByTestId("stack")
            .querySelector('[data-component="AvatarStack.Body"]');
        expect(body).toHaveAttribute("tabindex", "0");
    });

    it("leaves focus to the children when they are already interactive", () => {
        render(
            <AvatarStack data-testid="stack">
                <button type="button">Contributor</button>
                <button type="button">Contributor</button>
            </AvatarStack>,
        );
        const body = screen
            .getByTestId("stack")
            .querySelector('[data-component="AvatarStack.Body"]');
        expect(body).not.toHaveAttribute("tabindex");
    });

    it("does not take focus when expanding is turned off", () => {
        render(
            <AvatarStack disableExpand data-testid="stack">
                {avatars(2)}
            </AvatarStack>,
        );
        const body = screen
            .getByTestId("stack")
            .querySelector('[data-component="AvatarStack.Body"]');
        expect(body).not.toHaveAttribute("tabindex");
        expect(body).toHaveAttribute("data-disable-expand", "true");
        expect(body).toHaveClass("avatar-stack-body");
        expect(body).not.toHaveClass("avatar-stack-body-expandable");
    });

    it("runs the stack right to left when aligned right", () => {
        render(
            <AvatarStack alignRight data-testid="stack">
                {avatars(2)}
            </AvatarStack>,
        );
        const stack = screen.getByTestId("stack");
        expect(stack).toHaveAttribute("data-align-right", "true");
        expect(stack).toHaveClass("avatar-stack-align-right");
    });

    it("sizes itself from a fixed size prop", () => {
        render(
            <AvatarStack size={48} data-testid="stack">
                {avatars(2)}
            </AvatarStack>,
        );
        const stack = screen.getByTestId("stack");
        expect(stack).toHaveStyle({ "--avatar-stack-size": "48px" });
        expect(stack).not.toHaveAttribute("data-responsive");
    });

    it("sizes itself per viewport from a responsive size prop", () => {
        render(
            <AvatarStack size={{ narrow: 16, regular: 24, wide: 32 }} data-testid="stack">
                {avatars(2)}
            </AvatarStack>,
        );
        const stack = screen.getByTestId("stack");
        expect(stack).toHaveAttribute("data-responsive", "true");
        expect(stack).toHaveStyle({ "--avatar-stack-size-narrow": "16px" });
        expect(stack).toHaveStyle({ "--avatar-stack-size-regular": "24px" });
        expect(stack).toHaveStyle({ "--avatar-stack-size-wide": "32px" });
    });

    it("takes the smallest avatar size when it has no size of its own", () => {
        render(
            <AvatarStack data-testid="stack">
                <Avatar src="a.png" size={48} />
                <Avatar src="b.png" size={32} />
            </AvatarStack>,
        );
        const stack = screen.getByTestId("stack");
        expect(stack).toHaveStyle({ "--avatar-stack-size-regular": "32px" });
    });

    it("falls back to the default avatar size when no child asks for one", () => {
        render(<AvatarStack data-testid="stack">{avatars(2)}</AvatarStack>);
        expect(screen.getByTestId("stack")).toHaveStyle({
            "--avatar-stack-size-regular": "20px",
        });
    });

    it("keeps a custom className on a child", () => {
        render(
            <AvatarStack data-testid="stack">
                <img src="a.png" alt="" className="custom" data-testid="avatar-0" />
            </AvatarStack>,
        );
        expect(screen.getByTestId("avatar-0")).toHaveClass("custom");
    });

    it("merges a custom style onto the root element", () => {
        render(
            <AvatarStack style={{ opacity: 0.5 }} data-testid="stack">
                {avatars(2)}
            </AvatarStack>,
        );
        expect(screen.getByTestId("stack")).toHaveStyle({ opacity: "0.5" });
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLSpanElement>();
        render(<AvatarStack ref={ref}>{avatars(2)}</AvatarStack>);
        expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });

    it("merges a custom className onto the root element", () => {
        render(
            <AvatarStack className="custom" data-testid="stack">
                {avatars(2)}
            </AvatarStack>,
        );
        expect(screen.getByTestId("stack")).toHaveClass("custom");
    });
});
