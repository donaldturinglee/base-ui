import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import Truncate from "./Truncate";

describe("Truncate", () => {
    it("renders a div element by default", () => {
        render(
            <Truncate title="a-long-branch-name" data-testid="truncate">
                a-long-branch-name
            </Truncate>,
        );
        expect(screen.getByTestId("truncate").tagName).toBe("DIV");
    });

    it("renders as the element passed to the as prop", () => {
        render(
            <Truncate as="span" title="a-long-branch-name" data-testid="truncate">
                a-long-branch-name
            </Truncate>,
        );
        expect(screen.getByTestId("truncate").tagName).toBe("SPAN");
    });

    it("renders its children", () => {
        render(<Truncate title="a-long-branch-name">a-long-branch-name</Truncate>);
        expect(screen.getByText("a-long-branch-name")).toBeInTheDocument();
    });

    it("clips the overflow to a single line", () => {
        render(
            <Truncate title="a-long-branch-name" data-testid="truncate">
                a-long-branch-name
            </Truncate>,
        );
        expect(screen.getByTestId("truncate")).toHaveClass("truncate");
    });

    it("passes the title down so the full text stays reachable", () => {
        render(
            <Truncate title="a-long-branch-name" data-testid="truncate">
                a-long
            </Truncate>,
        );
        expect(screen.getByTestId("truncate")).toHaveAttribute("title", "a-long-branch-name");
    });

    it("falls back to a max width of 125px", () => {
        render(
            <Truncate title="a-long-branch-name" data-testid="truncate">
                a-long-branch-name
            </Truncate>,
        );
        expect(screen.getByTestId("truncate")).toHaveStyle({
            "--truncate-max-width": "125px",
        });
    });

    it("turns a numeric max width into pixels", () => {
        render(
            <Truncate title="a-long-branch-name" maxWidth={250} data-testid="truncate">
                a-long-branch-name
            </Truncate>,
        );
        expect(screen.getByTestId("truncate")).toHaveStyle({
            "--truncate-max-width": "250px",
        });
    });

    it("takes a max width given as a css length", () => {
        render(
            <Truncate title="a-long-branch-name" maxWidth="20rem" data-testid="truncate">
                a-long-branch-name
            </Truncate>,
        );
        expect(screen.getByTestId("truncate")).toHaveStyle({
            "--truncate-max-width": "20rem",
        });
    });

    it("takes its display from its surroundings by default", () => {
        render(
            <Truncate title="a-long-branch-name" data-testid="truncate">
                a-long-branch-name
            </Truncate>,
        );
        const truncate = screen.getByTestId("truncate");
        expect(truncate).toHaveClass("[display:inherit]");
        expect(truncate).not.toHaveAttribute("data-inline");
    });

    it("sits inline with the text around it when inline", () => {
        render(
            <Truncate title="a-long-branch-name" inline data-testid="truncate">
                a-long-branch-name
            </Truncate>,
        );
        const truncate = screen.getByTestId("truncate");
        expect(truncate).toHaveAttribute("data-inline", "true");
        expect(truncate).toHaveClass("inline-block", "align-top");
        expect(truncate).not.toHaveClass("[display:inherit]");
    });

    it("opens up on hover when expandable", () => {
        render(
            <Truncate title="a-long-branch-name" expandable data-testid="truncate">
                a-long-branch-name
            </Truncate>,
        );
        const truncate = screen.getByTestId("truncate");
        expect(truncate).toHaveAttribute("data-expandable", "true");
        expect(truncate).toHaveClass("hover:max-w-[10000px]");
    });

    it("stays clipped on hover by default", () => {
        render(
            <Truncate title="a-long-branch-name" data-testid="truncate">
                a-long-branch-name
            </Truncate>,
        );
        const truncate = screen.getByTestId("truncate");
        expect(truncate).not.toHaveAttribute("data-expandable");
        expect(truncate).not.toHaveClass("hover:max-w-[10000px]");
    });

    it("does not leak the layout props onto the element", () => {
        render(
            <Truncate title="a-long-branch-name" inline expandable data-testid="truncate">
                a-long-branch-name
            </Truncate>,
        );
        const truncate = screen.getByTestId("truncate");
        expect(truncate).not.toHaveAttribute("inline");
        expect(truncate).not.toHaveAttribute("expandable");
        expect(truncate).not.toHaveAttribute("maxWidth");
    });

    it("merges a custom style onto the root element", () => {
        render(
            <Truncate title="a-long-branch-name" style={{ opacity: 0.5 }} data-testid="truncate">
                a-long-branch-name
            </Truncate>,
        );
        const truncate = screen.getByTestId("truncate");
        expect(truncate).toHaveStyle({ opacity: "0.5" });
        expect(truncate).toHaveStyle({ "--truncate-max-width": "125px" });
    });

    it("forwards element specific props to the element passed to the as prop", () => {
        render(
            <Truncate title="a-long-branch-name" id="branch" data-testid="truncate">
                a-long-branch-name
            </Truncate>,
        );
        expect(screen.getByTestId("truncate")).toHaveAttribute("id", "branch");
    });

    it("tags the root element with a data-component attribute", () => {
        render(
            <Truncate title="a-long-branch-name" data-testid="truncate">
                a-long-branch-name
            </Truncate>,
        );
        expect(screen.getByTestId("truncate")).toHaveAttribute("data-component", "Truncate");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(
            <Truncate ref={ref} title="a-long-branch-name">
                a-long-branch-name
            </Truncate>,
        );
        expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("merges a custom className onto the root element", () => {
        render(
            <Truncate title="a-long-branch-name" className="custom" data-testid="truncate">
                a-long-branch-name
            </Truncate>,
        );
        expect(screen.getByTestId("truncate")).toHaveClass("custom");
    });
});
