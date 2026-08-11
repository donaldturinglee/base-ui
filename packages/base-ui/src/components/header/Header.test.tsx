import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Header, HeaderItem, HeaderLink } from ".";

describe("Header", () => {
    it("renders a header element by default", () => {
        render(<Header data-testid="header" />);
        expect(screen.getByTestId("header").tagName).toBe("HEADER");
    });

    it("renders as the element passed to the as prop", () => {
        render(<Header as="div" data-testid="header" />);
        expect(screen.getByTestId("header").tagName).toBe("DIV");
    });

    it("renders its children", () => {
        render(
            <Header>
                <span data-testid="children" />
            </Header>,
        );
        expect(screen.getByTestId("children")).toBeInTheDocument();
    });

    it("lays its children out as a flex container", () => {
        render(<Header data-testid="header" />);
        expect(screen.getByTestId("header")).toHaveClass("header");
    });

    it("labels the row with the aria-label it is given", () => {
        render(<Header aria-label="Global" data-testid="header" />);
        expect(screen.getByTestId("header")).toHaveAttribute("aria-label", "Global");
    });

    it("forwards element specific props to the element passed to the as prop", () => {
        render(<Header id="global" data-testid="header" />);
        expect(screen.getByTestId("header")).toHaveAttribute("id", "global");
    });

    it("tags the root element with a data-component attribute", () => {
        render(<Header data-testid="header" />);
        expect(screen.getByTestId("header")).toHaveAttribute("data-component", "Header");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLElement>();
        render(<Header ref={ref} data-testid="header" />);
        expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("merges a custom className onto the root element", () => {
        render(<Header className="custom" data-testid="header" />);
        expect(screen.getByTestId("header")).toHaveClass("custom");
    });

    it("exposes HeaderItem as Header.Item", () => {
        expect(Header.Item).toBe(HeaderItem);
    });

    it("exposes HeaderLink as Header.Link", () => {
        expect(Header.Link).toBe(HeaderLink);
    });
});

describe("HeaderItem", () => {
    it("renders a div element", () => {
        render(<HeaderItem data-testid="item" />);
        expect(screen.getByTestId("item").tagName).toBe("DIV");
    });

    it("renders its children", () => {
        render(
            <Header>
                <HeaderItem data-testid="item">Content</HeaderItem>
            </Header>,
        );
        expect(screen.getByTestId("item")).toHaveTextContent("Content");
    });

    it("keeps its own width by default", () => {
        const item = render(<HeaderItem data-testid="item" />).getByTestId("item");
        expect(item).toHaveClass("header-item");
        expect(item).not.toHaveAttribute("data-full");
        expect(item).not.toHaveClass("header-item-full");
    });

    it("takes the room the rest of the row leaves when full is true", () => {
        render(<HeaderItem full data-testid="item" />);
        const item = screen.getByTestId("item");
        expect(item).toHaveAttribute("data-full", "");
        expect(item).toHaveClass("header-item-full");
    });

    it("forwards element specific props to the root element", () => {
        render(<HeaderItem id="menu" data-testid="item" />);
        expect(screen.getByTestId("item")).toHaveAttribute("id", "menu");
    });

    it("tags the root element with a data-component attribute", () => {
        render(<HeaderItem data-testid="item" />);
        expect(screen.getByTestId("item")).toHaveAttribute("data-component", "Header.Item");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(<HeaderItem ref={ref} data-testid="item" />);
        expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("merges a custom className onto the root element", () => {
        render(<HeaderItem className="custom" data-testid="item" />);
        expect(screen.getByTestId("item")).toHaveClass("custom");
    });
});

describe("HeaderLink", () => {
    it("renders an anchor element by default", () => {
        render(<HeaderLink data-testid="link" />);
        expect(screen.getByTestId("link").tagName).toBe("A");
    });

    it("renders as the element passed to the as prop", () => {
        render(<HeaderLink as="button" data-testid="link" />);
        expect(screen.getByTestId("link").tagName).toBe("BUTTON");
    });

    it("renders its children", () => {
        render(<HeaderLink data-testid="link">Base UI</HeaderLink>);
        expect(screen.getByTestId("link")).toHaveTextContent("Base UI");
    });

    it("leads to the href it is given", () => {
        render(
            <HeaderLink href="#home" data-testid="link">
                Home
            </HeaderLink>,
        );
        expect(screen.getByTestId("link")).toHaveAttribute("href", "#home");
    });

    it("is drawn as the name of the site", () => {
        render(<HeaderLink data-testid="link" />);
        expect(screen.getByTestId("link")).toHaveClass("header-link");
    });

    it("tags the root element with a data-component attribute", () => {
        render(<HeaderLink data-testid="link" />);
        expect(screen.getByTestId("link")).toHaveAttribute("data-component", "Header.Link");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLAnchorElement>();
        render(<HeaderLink ref={ref} data-testid="link" />);
        expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    });

    it("merges a custom className onto the root element", () => {
        render(<HeaderLink className="custom" data-testid="link" />);
        expect(screen.getByTestId("link")).toHaveClass("custom");
    });
});
