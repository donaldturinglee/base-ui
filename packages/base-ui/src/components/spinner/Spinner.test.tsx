import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import Spinner from "./Spinner";

describe("Spinner", () => {
    it("exposes a status role for assistive technology", () => {
        render(<Spinner />);
        expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("renders the default loading text", () => {
        render(<Spinner />);
        expect(screen.getByText("Loading")).toBeInTheDocument();
    });

    it("supports custom screen reader text", () => {
        render(<Spinner srText="Saving changes" />);
        expect(screen.getByText("Saving changes")).toBeInTheDocument();
    });

    it("omits the screen reader text when srText is null", () => {
        render(<Spinner srText={null} />);
        expect(screen.queryByText("Loading")).not.toBeInTheDocument();
    });

    it("does not duplicate the label when an aria-label is provided", () => {
        render(<Spinner aria-label="Loading content" />);
        expect(screen.queryByText("Loading")).not.toBeInTheDocument();
        expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Loading content");
    });

    it("applies the requested size to the icon", () => {
        const { container } = render(<Spinner size="large" />);
        expect(container.querySelector("svg")).toHaveClass("spinner-large");
    });

    it("defaults to the medium size", () => {
        const { container } = render(<Spinner />);
        expect(container.querySelector("svg")).toHaveClass("spinner-medium");
    });

    it("tags the root element with a data-component attribute", () => {
        render(<Spinner />);
        expect(screen.getByRole("status")).toHaveAttribute("data-component", "Spinner");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLSpanElement>();
        render(<Spinner ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });

    it("merges a custom className onto the root element", () => {
        const { container } = render(<Spinner className="custom" />);
        expect(container.firstChild).toHaveClass("custom");
    });
});
