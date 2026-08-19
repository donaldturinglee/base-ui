import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Avatar } from "../avatar";
import AvatarStack from "./AvatarStack";

const maskClass = "avatar-stack-item-mask";

const avatars = (count: number) =>
    Array.from({ length: count }, (_, index) => (
        <Avatar key={index} data-testid={`avatar-${index}`}>
            <Avatar.Image src={`avatar-${index}.png`} alt="" />
        </Avatar>
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
                <Avatar as="button" type="button">
                    <Avatar.Image src="a.png" alt="" />
                </Avatar>
                <Avatar as="button" type="button">
                    <Avatar.Image src="b.png" alt="" />
                </Avatar>
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

    it("deals the avatars from the left by default", () => {
        render(<AvatarStack data-testid="stack">{avatars(2)}</AvatarStack>);
        const stack = screen.getByTestId("stack");
        expect(stack).toHaveAttribute("data-align", "left");
        expect(stack).toHaveClass("avatar-stack-align-left");
    });

    it("runs the stack right to left when aligned right", () => {
        render(
            <AvatarStack align="right" data-testid="stack">
                {avatars(2)}
            </AvatarStack>,
        );
        const stack = screen.getByTestId("stack");
        expect(stack).toHaveAttribute("data-align", "right");
        expect(stack).toHaveClass("avatar-stack-align-right");
        expect(stack).not.toHaveClass("avatar-stack-align-left");
    });

    it("moves the hairline between square avatars to the far edge when aligned right", () => {
        render(
            <AvatarStack align="right" shape="square" data-testid="stack">
                {avatars(2)}
            </AvatarStack>,
        );
        const second = screen.getByTestId("avatar-1");
        expect(second).toHaveClass("avatar-stack-item-edge-align-right");
        expect(second).not.toHaveClass("avatar-stack-item-edge-square");
    });

    it("keeps the align prop off the element", () => {
        render(
            <AvatarStack align="right" data-testid="stack">
                {avatars(2)}
            </AvatarStack>,
        );
        expect(screen.getByTestId("stack")).not.toHaveAttribute("align");
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

    it("keeps the regular size for the viewport ranges a responsive size leaves out", () => {
        render(
            <AvatarStack size={{ regular: 40 }} data-testid="stack">
                {avatars(2)}
            </AvatarStack>,
        );
        const stack = screen.getByTestId("stack");
        expect(stack).toHaveStyle({ "--avatar-stack-size-narrow": "40px" });
        expect(stack).toHaveStyle({ "--avatar-stack-size-regular": "40px" });
        expect(stack).toHaveStyle({ "--avatar-stack-size-wide": "40px" });
    });

    it("reads an avatar's responsive size the way the avatar reads it", () => {
        render(
            <AvatarStack data-testid="stack">
                <Avatar size={{ regular: 40 }}>
                    <Avatar.Image src="a.png" />
                </Avatar>
                <Avatar size={{ regular: 40, wide: 64 }}>
                    <Avatar.Image src="b.png" />
                </Avatar>
            </AvatarStack>,
        );
        const stack = screen.getByTestId("stack");
        expect(stack).toHaveStyle({ "--avatar-stack-size-narrow": "40px" });
        expect(stack).toHaveStyle({ "--avatar-stack-size-regular": "40px" });
        expect(stack).toHaveStyle({ "--avatar-stack-size-wide": "40px" });
    });

    it("takes the smallest avatar size when it has no size of its own", () => {
        render(
            <AvatarStack data-testid="stack">
                <Avatar size={48}>
                    <Avatar.Image src="a.png" />
                </Avatar>
                <Avatar size={32}>
                    <Avatar.Image src="b.png" />
                </Avatar>
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

    // The avatar is the ground the stack lays a slot on, so the picture inside it is left alone
    it("lays its item classes onto the avatar rather than the picture inside it", () => {
        render(<AvatarStack data-testid="stack">{avatars(2)}</AvatarStack>);
        const second = screen.getByTestId("avatar-1");
        const picture = second.querySelector('[data-component="Avatar.Image"]');

        expect(second.tagName).toBe("SPAN");
        expect(second).toHaveClass("avatar", "avatar-stack-item", maskClass);
        expect(picture).toBeInstanceOf(HTMLElement);
        expect(picture).not.toHaveClass("avatar-stack-item");
    });

    // A bare picture carries neither the size the run is cut to nor the class its edge is drawn
    // on, so it is left out rather than laid down half dressed
    it("leaves out anything that is not an avatar", () => {
        render(
            <AvatarStack data-testid="stack">
                <Avatar data-testid="avatar-0">
                    <Avatar.Image src="a.png" alt="" />
                </Avatar>
                <img src="b.png" alt="" data-testid="picture" />
            </AvatarStack>,
        );
        expect(screen.getByTestId("avatar-0")).toBeInTheDocument();
        expect(screen.queryByTestId("picture")).not.toBeInTheDocument();
    });

    it("does not widen the track for what it left out", () => {
        render(
            <AvatarStack data-testid="stack">
                <Avatar data-testid="avatar-0">
                    <Avatar.Image src="a.png" alt="" />
                </Avatar>
                <img src="b.png" alt="" />
                <img src="c.png" alt="" />
            </AvatarStack>,
        );
        const stack = screen.getByTestId("stack");
        expect(stack).toHaveAttribute("data-avatar-count", "1");
        expect(stack).not.toHaveClass("avatar-stack-cascade-three");
    });

    // Avatars built from a list arrive wrapped in a fragment, which is not itself one of the run
    it("looks through a fragment for the avatars inside it", () => {
        render(<AvatarStack data-testid="stack">{<>{avatars(2)}</>}</AvatarStack>);
        expect(screen.getByTestId("stack")).toHaveAttribute("data-avatar-count", "2");
        expect(screen.getByTestId("avatar-1")).toHaveClass("avatar-stack-item", maskClass);
    });

    it("keeps the fallback of an avatar whose picture has not arrived", () => {
        render(
            <AvatarStack>
                <Avatar>
                    <Avatar.Image src="a.png" alt="" />
                    <Avatar.Fallback name="Mona Lisa Octocat" />
                </Avatar>
            </AvatarStack>,
        );
        const fallback = screen.getByLabelText("Mona Lisa Octocat");
        expect(fallback).toHaveClass("avatar-fallback");
        expect(fallback).toHaveTextContent("MO");
    });

    it("keeps a custom className on a child", () => {
        render(
            <AvatarStack data-testid="stack">
                <Avatar className="custom" data-testid="avatar-0">
                    <Avatar.Image src="a.png" alt="" />
                </Avatar>
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
