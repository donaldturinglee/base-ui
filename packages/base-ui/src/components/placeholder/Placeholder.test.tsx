import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import Placeholder from "./Placeholder";

describe("Placeholder", () => {
    it("renders a div element by default", () => {
        render(<Placeholder height="64px" label="Placeholder" />);
        expect(screen.getByText("Placeholder").tagName).toBe("DIV");
    });

    it("renders the provided label", () => {
        render(<Placeholder height="64px" label="Placeholder" />);
        expect(screen.getByText("Placeholder")).toBeInTheDocument();
    });

    it("renders children in place of the label", () => {
        render(
            <Placeholder height="64px" label="Placeholder">
                Child content
            </Placeholder>,
        );
        expect(screen.getByText("Child content")).toBeInTheDocument();
        expect(screen.queryByText("Placeholder")).not.toBeInTheDocument();
    });

    it("renders as the element passed to the as prop", () => {
        render(<Placeholder as="section" height="64px" label="Placeholder" />);
        expect(screen.getByText("Placeholder").tagName).toBe("SECTION");
    });

    it("applies the height as a custom property", () => {
        render(<Placeholder height="4rem" label="Placeholder" />);
        expect(screen.getByText("Placeholder")).toHaveStyle({ "--placeholder-height": "4rem" });
    });

    it("applies the width as a custom property", () => {
        render(<Placeholder width="50%" height="64px" label="Placeholder" />);
        expect(screen.getByText("Placeholder")).toHaveStyle({ "--placeholder-width": "50%" });
    });

    it("leaves the width custom property unset when no width is provided", () => {
        render(<Placeholder height="64px" label="Placeholder" />);
        expect(screen.getByText("Placeholder").style.getPropertyValue("--placeholder-width")).toBe(
            "",
        );
    });

    it("merges a custom style onto the root element", () => {
        render(<Placeholder height="64px" label="Placeholder" style={{ opacity: 0.5 }} />);
        const placeholder = screen.getByText("Placeholder");
        expect(placeholder).toHaveStyle({ opacity: "0.5" });
        expect(placeholder).toHaveStyle({ "--placeholder-height": "64px" });
    });

    it("forwards element specific props to the element passed to the as prop", () => {
        render(<Placeholder height="64px" label="Placeholder" id="preview" />);
        expect(screen.getByText("Placeholder")).toHaveAttribute("id", "preview");
    });

    it("tags the root element with a data-component attribute", () => {
        render(<Placeholder height="64px" label="Placeholder" />);
        expect(screen.getByText("Placeholder")).toHaveAttribute("data-component", "Placeholder");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(<Placeholder ref={ref} height="64px" label="Placeholder" />);
        expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("merges a custom className onto the root element", () => {
        render(<Placeholder height="64px" label="Placeholder" className="custom" />);
        expect(screen.getByText("Placeholder")).toHaveClass("custom");
    });
});
