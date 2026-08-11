import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { Code } from ".";

const code = () => screen.getByText("npm install");

describe("Code", () => {
    it("renders a code element by default", () => {
        render(<Code>npm install</Code>);
        expect(code().tagName).toBe("CODE");
    });

    it("renders the source it was given", () => {
        render(<Code>npm install</Code>);
        expect(code()).toBeInTheDocument();
    });

    it("renders as the element passed to the as prop", () => {
        render(<Code as="span">npm install</Code>);
        expect(code().tagName).toBe("SPAN");
    });

    it("forwards element specific props to the element passed to the as prop", () => {
        render(
            <Code as="a" href="https://example.com">
                npm install
            </Code>,
        );
        expect(code()).toHaveAttribute("href", "https://example.com");
    });

    it("tags the root element with a data-component attribute", () => {
        render(<Code>npm install</Code>);
        expect(code()).toHaveAttribute("data-component", "Code");
    });

    it("sets the fragment in the face it is read in", () => {
        render(<Code>npm install</Code>);
        expect(code()).toHaveClass("code");
    });

    it("renders anything nested as it was given", () => {
        render(
            <Code>
                npm <em data-testid="emphasis">install</em>
            </Code>,
        );
        expect(screen.getByTestId("emphasis")).toBeInTheDocument();
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLElement>();
        render(<Code ref={ref}>npm install</Code>);
        expect(ref.current).toBe(code());
    });

    it("merges a custom className onto the root element", () => {
        render(<Code className="custom">npm install</Code>);
        expect(code()).toHaveClass("code", "custom");
    });

    it("passes extra props onto the root element", () => {
        render(<Code data-testid="code">npm install</Code>);
        expect(screen.getByTestId("code")).toBe(code());
    });
});
