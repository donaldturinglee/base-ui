import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { EmptyState } from ".";
import type { EmptyStateSize } from "./EmptyState.types";

const part = (name: string) =>
    document.querySelector(`[data-component="EmptyState.${name}"]`) as HTMLElement | null;

const root = () => document.querySelector('[data-component="EmptyState"]') as HTMLElement;

const Icon = () => <svg data-testid="icon" />;

describe("EmptyState", () => {
    it("renders a plain box by default", () => {
        render(<EmptyState title="No results found" />);
        expect(root().tagName).toBe("DIV");
    });

    it("renders as whatever it is told to", () => {
        render(<EmptyState as="li" title="No results found" />);
        expect(root().tagName).toBe("LI");
    });

    it("says what is not there", () => {
        render(<EmptyState title="No results found" />);

        expect(part("Title")).toHaveTextContent("No results found");
        expect(screen.getByText("No results found")).toBeInTheDocument();
    });

    it("says nothing more unless it is given something to say", () => {
        render(<EmptyState title="No results found" />);

        expect(part("Description")).toBeNull();
        expect(part("Icon")).toBeNull();
        expect(part("Actions")).toBeNull();
    });

    it("says why it is not there", () => {
        render(<EmptyState title="No results found" description="Try a different search term" />);
        expect(part("Description")).toHaveTextContent("Try a different search term");
    });

    describe("the icon", () => {
        it("draws a component it is handed", () => {
            render(<EmptyState title="No results found" icon={Icon} />);
            expect(screen.getByTestId("icon")).toBeInTheDocument();
        });

        it("draws something already built", () => {
            render(<EmptyState title="No results found" icon={<Icon />} />);
            expect(screen.getByTestId("icon")).toBeInTheDocument();
        });

        it("says nothing the title has not, so it is left out of the accessibility tree", () => {
            render(<EmptyState title="No results found" icon={Icon} />);
            expect(part("Icon")).toHaveAttribute("aria-hidden", "true");
        });
    });

    it("holds what can be done about it at its foot", () => {
        render(
            <EmptyState
                title="No results found"
                actions={<button type="button">Clear filters</button>}
            />,
        );

        expect(part("Actions")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Clear filters" })).toBeInTheDocument();
    });

    it("holds anything else it is given between the message and the actions", () => {
        render(
            <EmptyState title="No results found" description="Try again">
                <span data-testid="extra">Extra</span>
            </EmptyState>,
        );
        expect(screen.getByTestId("extra")).toBeInTheDocument();
    });

    describe("sizes", () => {
        const sizes: EmptyStateSize[] = ["small", "medium"];

        it("stands at the medium size by default", () => {
            render(<EmptyState title="No results found" />);
            expect(root()).toHaveAttribute("data-size", "medium");
        });

        it.each(sizes)("stands at the %s size", (size) => {
            render(<EmptyState title="No results found" size={size} />);
            expect(root()).toHaveAttribute("data-size", size);
        });

        it("sizes the type and the icon from the size it stands at", () => {
            render(<EmptyState title="No results found" size="small" />);

            expect(root()).toHaveClass("[--empty-state-title-size:var(--text-body-size-medium)]");
            expect(root()).toHaveClass("[--empty-state-icon-size:var(--base-size-20)]");
        });
    });

    it("is not announced on its own, since an empty list is what was asked for", () => {
        render(<EmptyState title="No results found" />);
        expect(root()).not.toHaveAttribute("role");
    });

    it("can be announced where the caller asks for it", () => {
        render(<EmptyState title="No results found" role="status" />);
        expect(screen.getByRole("status")).toBe(root());
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(<EmptyState ref={ref} title="No results found" />);
        expect(ref.current).toBe(root());
    });

    it("merges a custom className onto the root element", () => {
        render(<EmptyState title="No results found" className="custom" />);
        expect(root()).toHaveClass("custom");
    });

    it("passes the rest of its props through", () => {
        render(<EmptyState title="No results found" data-testid="empty" />);
        expect(screen.getByTestId("empty")).toBe(root());
    });
});
