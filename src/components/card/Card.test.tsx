import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { Card } from ".";

const TestIcon = () => <svg data-testid="test-icon" aria-hidden="true" />;

describe("Card", () => {
    it("renders a div element by default", () => {
        render(
            <Card data-testid="card">
                <Card.Heading>Heading</Card.Heading>
            </Card>,
        );
        expect(screen.getByTestId("card").tagName).toBe("DIV");
    });

    it("renders as the element passed to the as prop", () => {
        render(
            <Card as="section" aria-label="Standalone card" data-testid="card">
                <Card.Heading>Heading</Card.Heading>
            </Card>,
        );
        expect(screen.getByTestId("card").tagName).toBe("SECTION");
    });

    it("does not forward the as prop to the element", () => {
        render(
            <Card as="section" aria-label="Standalone card" data-testid="card">
                <Card.Heading>Heading</Card.Heading>
            </Card>,
        );
        expect(screen.getByTestId("card")).not.toHaveAttribute("as");
    });

    it("renders a heading and a description", () => {
        render(
            <Card>
                <Card.Heading>Test Heading</Card.Heading>
                <Card.Description>Test Description</Card.Description>
            </Card>,
        );
        expect(screen.getByRole("heading", { level: 3, name: "Test Heading" })).toBeInTheDocument();
        expect(screen.getByText("Test Description")).toBeInTheDocument();
    });

    it("renders the heading at the level passed to its as prop", () => {
        render(
            <Card>
                <Card.Heading as="h2">Heading</Card.Heading>
            </Card>,
        );
        expect(screen.getByRole("heading", { level: 2, name: "Heading" })).toBeInTheDocument();
    });

    it("renders an icon", () => {
        render(
            <Card>
                <Card.Icon icon={TestIcon} />
                <Card.Heading>With Icon</Card.Heading>
            </Card>,
        );
        expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    });

    it("hides an unlabelled icon from assistive technology", () => {
        render(
            <Card>
                <Card.Icon icon={TestIcon} data-testid="icon" />
                <Card.Heading>With Icon</Card.Heading>
            </Card>,
        );
        const icon = screen.getByTestId("icon");
        expect(icon).toHaveAttribute("aria-hidden", "true");
        expect(icon).not.toHaveAttribute("role");
    });

    it("exposes a labelled icon as an image", () => {
        render(
            <Card>
                <Card.Icon icon={TestIcon} aria-label="Repository" data-testid="icon" />
                <Card.Heading>With Icon</Card.Heading>
            </Card>,
        );
        const icon = screen.getByTestId("icon");
        expect(icon).toHaveAttribute("role", "img");
        expect(icon).toHaveAttribute("aria-label", "Repository");
        expect(icon).not.toHaveAttribute("aria-hidden");
    });

    it("renders an image", () => {
        render(
            <Card>
                <Card.Image src="https://example.com/image.png" alt="Example" />
                <Card.Heading>With Image</Card.Heading>
            </Card>,
        );
        const image = screen.getByRole("img", { name: "Example" });
        expect(image).toHaveAttribute("src", "https://example.com/image.png");
    });

    it("runs an image to the edges of the card", () => {
        const { container } = render(
            <Card>
                <Card.Image src="https://example.com/image.png" alt="" />
                <Card.Heading>Edge to Edge</Card.Heading>
            </Card>,
        );
        const header = container.querySelector('[data-component="Card.Image"]')?.parentElement;
        expect(header).toHaveClass("card-header-edge-to-edge");
    });

    it("keeps the padding around an icon", () => {
        const { container } = render(
            <Card>
                <Card.Icon icon={TestIcon} />
                <Card.Heading>With Icon</Card.Heading>
            </Card>,
        );
        const header = container.querySelector('[data-component="Card.Icon"]')?.parentElement;
        expect(header).not.toHaveClass("card-header-edge-to-edge");
    });

    it("renders metadata", () => {
        render(
            <Card>
                <Card.Heading>Metadata Card</Card.Heading>
                <Card.Metadata>Updated 2 hours ago</Card.Metadata>
            </Card>,
        );
        expect(screen.getByText("Updated 2 hours ago")).toBeInTheDocument();
    });

    it("renders an action", () => {
        render(
            <Card>
                <Card.Heading>Action Card</Card.Heading>
                <Card.Action>
                    <button type="button">Options</button>
                </Card.Action>
            </Card>,
        );
        expect(screen.getByRole("button", { name: "Options" })).toBeInTheDocument();
    });

    it("tags the card and its parts with data-component attributes", () => {
        const { container } = render(
            <Card>
                <Card.Icon icon={TestIcon} />
                <Card.Image src="https://example.com/image.png" alt="" />
                <Card.Heading>Heading</Card.Heading>
                <Card.Description>Description</Card.Description>
                <Card.Metadata>Metadata</Card.Metadata>
                <Card.Action>
                    <button type="button">Options</button>
                </Card.Action>
            </Card>,
        );

        for (const name of [
            "Card",
            "Card.Image",
            "Card.Heading",
            "Card.Description",
            "Card.Metadata",
            "Card.Action",
        ]) {
            expect(container.querySelector(`[data-component="${name}"]`)).toBeInstanceOf(
                HTMLElement,
            );
        }
    });

    it("falls back to normal padding, a large radius and the default layout", () => {
        render(
            <Card data-testid="card">
                <Card.Heading>Defaults</Card.Heading>
            </Card>,
        );
        const card = screen.getByTestId("card");
        expect(card).toHaveAttribute("data-padding", "normal");
        expect(card).toHaveAttribute("data-border-radius", "large");
        expect(card).toHaveAttribute("data-layout", "default");
        expect(card).toHaveClass("card-padding-normal");
        expect(card).toHaveClass("card-radius-large");
    });

    it("respects the padding prop", () => {
        render(
            <Card padding="none" data-testid="card">
                <Card.Heading>No padding</Card.Heading>
            </Card>,
        );
        const card = screen.getByTestId("card");
        expect(card).toHaveAttribute("data-padding", "none");
        expect(card).toHaveClass("card-padding-none");
    });

    it("respects the borderRadius prop", () => {
        render(
            <Card borderRadius="medium" data-testid="card">
                <Card.Heading>Medium radius</Card.Heading>
            </Card>,
        );
        const card = screen.getByTestId("card");
        expect(card).toHaveAttribute("data-border-radius", "medium");
        expect(card).toHaveClass("card-radius-medium");
    });

    it("lays a compact card out in a row with tighter padding", () => {
        render(
            <Card layout="compact" data-testid="card">
                <Card.Icon icon={TestIcon} />
                <Card.Heading>Compact</Card.Heading>
            </Card>,
        );
        const card = screen.getByTestId("card");
        expect(card).toHaveAttribute("data-layout", "compact");
        expect(card).toHaveClass("card-compact");
        expect(card).toHaveClass("card-compact-padding-normal");
    });

    it("drops the icon tile in a compact card", () => {
        const { container } = render(
            <Card layout="compact">
                <Card.Icon icon={TestIcon} />
                <Card.Heading>Compact</Card.Heading>
            </Card>,
        );
        expect(container.querySelector('[data-component="Card.Icon"]')).not.toHaveClass(
            "card-icon-tile",
        );
    });

    it("keeps the icon tile in the default layout", () => {
        const { container } = render(
            <Card>
                <Card.Icon icon={TestIcon} />
                <Card.Heading>Default</Card.Heading>
            </Card>,
        );
        expect(container.querySelector('[data-component="Card.Icon"]')).toHaveClass(
            "card-icon-tile",
        );
    });

    it("shrinks the heading in a compact card", () => {
        const { container } = render(
            <Card layout="compact">
                <Card.Heading>Compact</Card.Heading>
            </Card>,
        );
        expect(container.querySelector('[data-component="Card.Heading"]')).toHaveClass(
            "card-heading-compact",
        );
    });

    it("renders arbitrary content when no subcomponents are used", () => {
        render(
            <Card data-testid="card">
                <div data-testid="custom-content">
                    <p>Custom paragraph</p>
                </div>
            </Card>,
        );
        expect(screen.getByTestId("custom-content")).toBeInTheDocument();
        expect(screen.getByTestId("card")).toHaveAttribute("data-component", "Card");
    });

    it("keeps the layout props on a card built from arbitrary content", () => {
        render(
            <Card padding="none" layout="compact" data-testid="card">
                <p>Custom</p>
            </Card>,
        );
        const card = screen.getByTestId("card");
        expect(card).toHaveAttribute("data-padding", "none");
        expect(card).toHaveAttribute("data-layout", "compact");
    });

    it("renders nothing when it has no children", () => {
        const { container } = render(<Card />);
        expect(container).toBeEmptyDOMElement();
    });

    it("renders nothing when every child is falsy", () => {
        const { container } = render(<Card>{false}</Card>);
        expect(container).toBeEmptyDOMElement();
    });

    it("names a standalone card from its heading", () => {
        render(
            <Card as="section">
                <Card.Heading>Auto wired</Card.Heading>
                <Card.Description>No manual id needed.</Card.Description>
            </Card>,
        );
        expect(screen.getByRole("region", { name: "Auto wired" })).toBeInTheDocument();
    });

    it("lets an explicit aria-label name a standalone card", () => {
        render(
            <Card as="section" aria-label="Standalone card" data-testid="card">
                <Card.Heading>Heading</Card.Heading>
            </Card>,
        );
        const card = screen.getByTestId("card");
        expect(card).toHaveAttribute("aria-label", "Standalone card");
        expect(card).not.toHaveAttribute("aria-labelledby");
    });

    it("lets an explicit aria-labelledby name a standalone card", () => {
        render(
            <Card as="section" aria-labelledby="standalone-heading">
                <Card.Heading id="standalone-heading">Standalone</Card.Heading>
            </Card>,
        );
        expect(screen.getByRole("region", { name: "Standalone" })).toBeInTheDocument();
    });

    it("does not turn a plain card into a landmark", () => {
        render(
            <Card data-testid="card">
                <Card.Heading>Heading</Card.Heading>
            </Card>,
        );
        expect(screen.getByTestId("card")).not.toHaveAttribute("aria-labelledby");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(
            <Card ref={ref}>
                <Card.Heading>Ref Card</Card.Heading>
            </Card>,
        );
        expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("merges a custom className onto the root element", () => {
        render(
            <Card className="custom" data-testid="card">
                <Card.Heading>Custom</Card.Heading>
            </Card>,
        );
        expect(screen.getByTestId("card")).toHaveClass("custom");
    });
});
