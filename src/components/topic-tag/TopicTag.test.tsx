import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, jest } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { TopicTag } from ".";

describe("TopicTag", () => {
    it("renders an anchor element by default", () => {
        render(<TopicTag href="/topics/react">react</TopicTag>);
        expect(screen.getByRole("link", { name: "react" }).tagName).toBe("A");
    });

    it("renders as the element passed to the as prop", () => {
        const onClick = jest.fn();
        render(
            <TopicTag as="button" onClick={onClick}>
                react
            </TopicTag>,
        );

        const button = screen.getByRole("button", { name: "react" });
        fireEvent.click(button);
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("renders its children", () => {
        render(<TopicTag href="#">react</TopicTag>);
        expect(screen.getByText("react")).toBeInTheDocument();
    });

    it("tags the root element with a data-component attribute", () => {
        render(
            <TopicTag href="#" data-testid="tag">
                react
            </TopicTag>,
        );
        expect(screen.getByTestId("tag")).toHaveAttribute("data-component", "TopicTag");
    });

    it("tints itself with the accent colours", () => {
        render(
            <TopicTag href="#" data-testid="tag">
                react
            </TopicTag>,
        );
        const tag = screen.getByTestId("tag");
        expect(tag).toHaveClass("bg-[var(--background-color-accent-muted)]");
        expect(tag).toHaveClass("[color:var(--foreground-color-accent)]");
    });

    it("fills in on hover", () => {
        render(
            <TopicTag href="#" data-testid="tag">
                react
            </TopicTag>,
        );
        const tag = screen.getByTestId("tag");
        expect(tag).toHaveClass("hover:bg-[var(--background-color-accent-emphasis)]");
        expect(tag).toHaveClass("hover:[color:var(--foreground-color-on-emphasis)]");
    });

    it("rounds itself into a pill", () => {
        render(
            <TopicTag href="#" data-testid="tag">
                react
            </TopicTag>,
        );
        expect(screen.getByTestId("tag")).toHaveClass("rounded-[var(--border-radius-full)]");
    });

    it("drops the underline an anchor brings with it", () => {
        render(
            <TopicTag href="#" data-testid="tag">
                react
            </TopicTag>,
        );
        expect(screen.getByTestId("tag")).toHaveClass("no-underline");
    });

    it("resets what a button brings with it", () => {
        render(
            <TopicTag as="button" data-testid="tag">
                react
            </TopicTag>,
        );
        const tag = screen.getByTestId("tag");
        expect(tag).toHaveClass("m-0", "appearance-none", "text-start");
        expect(tag).toHaveClass("[font-family:inherit]");
    });

    it("only reads as clickable when it leads somewhere", () => {
        render(
            <TopicTag href="#" data-testid="tag">
                react
            </TopicTag>,
        );
        expect(screen.getByTestId("tag")).toHaveClass("[&:is(a,button)]:cursor-pointer");
    });

    it("forwards element specific props to the element passed to the as prop", () => {
        render(
            <TopicTag href="/topics/react" id="react-tag" data-testid="tag">
                react
            </TopicTag>,
        );
        const tag = screen.getByTestId("tag");
        expect(tag).toHaveAttribute("href", "/topics/react");
        expect(tag).toHaveAttribute("id", "react-tag");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLAnchorElement>();
        render(
            <TopicTag ref={ref} href="#">
                react
            </TopicTag>,
        );
        expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    });

    it("merges a custom className onto the root element", () => {
        render(
            <TopicTag href="#" className="custom" data-testid="tag">
                react
            </TopicTag>,
        );
        expect(screen.getByTestId("tag")).toHaveClass("custom");
    });
});

describe("TopicTag.Group", () => {
    it("renders a div element by default", () => {
        render(
            <TopicTag.Group data-testid="group">
                <TopicTag href="#">react</TopicTag>
            </TopicTag.Group>,
        );
        expect(screen.getByTestId("group").tagName).toBe("DIV");
    });

    it("renders as the element passed to the as prop", () => {
        render(
            <TopicTag.Group as="ul" data-testid="group">
                <TopicTag as="li">react</TopicTag>
            </TopicTag.Group>,
        );
        expect(screen.getByTestId("group").tagName).toBe("UL");
    });

    it("tags the root element with a data-component attribute", () => {
        render(
            <TopicTag.Group data-testid="group">
                <TopicTag href="#">react</TopicTag>
            </TopicTag.Group>,
        );
        expect(screen.getByTestId("group")).toHaveAttribute("data-component", "TopicTag.Group");
    });

    it("wraps its tags onto as many lines as they need", () => {
        render(
            <TopicTag.Group data-testid="group">
                <TopicTag href="#">react</TopicTag>
            </TopicTag.Group>,
        );
        const group = screen.getByTestId("group");
        expect(group).toHaveClass("flex", "flex-wrap");
        expect(group).toHaveClass("gap-x-[var(--base-size-2)]", "gap-y-[var(--base-size-8)]");
    });

    it("renders its tags", () => {
        render(
            <TopicTag.Group>
                <TopicTag href="#">react</TopicTag>
                <TopicTag href="#">nodejs</TopicTag>
            </TopicTag.Group>,
        );
        expect(screen.getAllByRole("link")).toHaveLength(2);
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(
            <TopicTag.Group ref={ref}>
                <TopicTag href="#">react</TopicTag>
            </TopicTag.Group>,
        );
        expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("merges a custom className onto the root element", () => {
        render(
            <TopicTag.Group className="custom" data-testid="group">
                <TopicTag href="#">react</TopicTag>
            </TopicTag.Group>,
        );
        expect(screen.getByTestId("group")).toHaveClass("custom");
    });
});
