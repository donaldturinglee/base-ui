import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel } from ".";
import type { AccordionProps } from "./Accordion.types";

const sections = ["One", "Two", "Three"];

const renderAccordion = (props: Partial<AccordionProps> = {}) =>
    render(
        <Accordion {...props} data-testid="accordion">
            {sections.map((section) => (
                <Accordion.Item key={section} value={section.toLowerCase()}>
                    <Accordion.Header>{section}</Accordion.Header>
                    <Accordion.Panel>{`${section} panel`}</Accordion.Panel>
                </Accordion.Item>
            ))}
        </Accordion>,
    );

const header = (name: string) => screen.getByRole("button", { name });

const panel = (name: string) => screen.getByText(`${name} panel`);

describe("Accordion", () => {
    it("renders a div element by default", () => {
        renderAccordion();
        expect(screen.getByTestId("accordion").tagName).toBe("DIV");
    });

    it("renders as the element passed to the as prop", () => {
        render(<Accordion as="section" data-testid="accordion" />);
        expect(screen.getByTestId("accordion").tagName).toBe("SECTION");
    });

    it("tags the root element with a data-component attribute", () => {
        renderAccordion();
        expect(screen.getByTestId("accordion")).toHaveAttribute("data-component", "Accordion");
    });

    it("starts with every panel closed", () => {
        renderAccordion();
        for (const section of sections) {
            expect(header(section)).toHaveAttribute("aria-expanded", "false");
            expect(panel(section)).not.toBeVisible();
        }
    });

    it("opens the panel whose header is clicked", () => {
        renderAccordion();
        fireEvent.click(header("One"));
        expect(header("One")).toHaveAttribute("aria-expanded", "true");
        expect(panel("One")).toBeVisible();
    });

    it("closes a panel that is open again", () => {
        renderAccordion();
        fireEvent.click(header("One"));
        fireEvent.click(header("One"));
        expect(header("One")).toHaveAttribute("aria-expanded", "false");
        expect(panel("One")).not.toBeVisible();
    });

    it("keeps only one panel open at a time", () => {
        renderAccordion();
        fireEvent.click(header("One"));
        fireEvent.click(header("Two"));
        expect(panel("One")).not.toBeVisible();
        expect(panel("Two")).toBeVisible();
    });

    it("leaves the other panels alone when more than one may stand open", () => {
        renderAccordion({ multiple: true });
        fireEvent.click(header("One"));
        fireEvent.click(header("Two"));
        expect(panel("One")).toBeVisible();
        expect(panel("Two")).toBeVisible();
    });

    it("opens the items it is told to start with", () => {
        renderAccordion({ defaultValue: ["two"] });
        expect(panel("Two")).toBeVisible();
        expect(panel("One")).not.toBeVisible();
    });

    it("takes what is open from the value prop when it is given one", () => {
        const { rerender } = renderAccordion({ value: ["one"] });
        expect(panel("One")).toBeVisible();

        // The caller holds the state, so the accordion does not close it on its own
        fireEvent.click(header("One"));
        expect(panel("One")).toBeVisible();

        rerender(
            <Accordion value={["two"]} data-testid="accordion">
                {sections.map((section) => (
                    <Accordion.Item key={section} value={section.toLowerCase()}>
                        <Accordion.Header>{section}</Accordion.Header>
                        <Accordion.Panel>{`${section} panel`}</Accordion.Panel>
                    </Accordion.Item>
                ))}
            </Accordion>,
        );
        expect(panel("Two")).toBeVisible();
        expect(panel("One")).not.toBeVisible();
    });

    it("calls onChange with everything that is open", () => {
        const onChange = vi.fn();
        renderAccordion({ onChange });

        fireEvent.click(header("One"));
        expect(onChange).toHaveBeenCalledWith(["one"]);

        fireEvent.click(header("Two"));
        expect(onChange).toHaveBeenLastCalledWith(["two"]);

        fireEvent.click(header("Two"));
        expect(onChange).toHaveBeenLastCalledWith([]);
    });

    it("adds to what is open when more than one may stand open", () => {
        const onChange = vi.fn();
        renderAccordion({ multiple: true, onChange });

        fireEvent.click(header("One"));
        fireEvent.click(header("Two"));
        expect(onChange).toHaveBeenLastCalledWith(["one", "two"]);
    });

    it("does not call onChange on arrival or when value changes elsewhere", () => {
        const onChange = vi.fn();
        const { rerender } = renderAccordion({ value: [], onChange });
        expect(onChange).not.toHaveBeenCalled();

        rerender(
            <Accordion value={["one"]} onChange={onChange} data-testid="accordion">
                <Accordion.Item value="one">
                    <Accordion.Header>One</Accordion.Header>
                    <Accordion.Panel>One panel</Accordion.Panel>
                </Accordion.Item>
            </Accordion>,
        );
        expect(onChange).not.toHaveBeenCalled();
    });

    it("stops every item being used when the accordion is disabled", () => {
        const onChange = vi.fn();
        renderAccordion({ disabled: true, onChange });

        for (const section of sections) {
            expect(header(section)).toBeDisabled();
        }
        fireEvent.click(header("One"));
        expect(onChange).not.toHaveBeenCalled();
    });

    it("stops a single item being used while the rest carry on", () => {
        render(
            <Accordion data-testid="accordion">
                <Accordion.Item value="one">
                    <Accordion.Header>One</Accordion.Header>
                    <Accordion.Panel>One panel</Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item value="two" disabled>
                    <Accordion.Header>Two</Accordion.Header>
                    <Accordion.Panel>Two panel</Accordion.Panel>
                </Accordion.Item>
            </Accordion>,
        );
        expect(header("One")).not.toBeDisabled();
        expect(header("Two")).toBeDisabled();

        fireEvent.click(header("One"));
        expect(panel("One")).toBeVisible();
    });

    it("names an item that was not given a name of its own", () => {
        render(
            <Accordion data-testid="accordion">
                <Accordion.Item>
                    <Accordion.Header>One</Accordion.Header>
                    <Accordion.Panel>One panel</Accordion.Panel>
                </Accordion.Item>
            </Accordion>,
        );
        fireEvent.click(header("One"));
        expect(panel("One")).toBeVisible();
    });

    it("forwards element specific props to the element passed to the as prop", () => {
        renderAccordion({ id: "settings" });
        expect(screen.getByTestId("accordion")).toHaveAttribute("id", "settings");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(<Accordion ref={ref} data-testid="accordion" />);
        expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("merges a custom className onto the root element", () => {
        renderAccordion({ className: "custom" });
        expect(screen.getByTestId("accordion")).toHaveClass("custom");
    });

    it("exposes the parts it is put together from", () => {
        expect(Accordion.Item).toBe(AccordionItem);
        expect(Accordion.Header).toBe(AccordionHeader);
        expect(Accordion.Panel).toBe(AccordionPanel);
    });
});

describe("Accordion header and panel", () => {
    it("puts each header in a heading", () => {
        renderAccordion();
        expect(header("One").parentElement?.tagName).toBe("H3");
    });

    it("respects the heading level the accordion was given", () => {
        renderAccordion({ headingLevel: "h4" });
        expect(header("One").parentElement?.tagName).toBe("H4");
    });

    it("lets a header take a heading level of its own", () => {
        render(
            <Accordion headingLevel="h4">
                <Accordion.Item value="one">
                    <Accordion.Header headingLevel="h2">One</Accordion.Header>
                    <Accordion.Panel>One panel</Accordion.Panel>
                </Accordion.Item>
            </Accordion>,
        );
        expect(header("One").parentElement?.tagName).toBe("H2");
    });

    it("points each header at the panel it opens", () => {
        renderAccordion();
        const controls = header("One").getAttribute("aria-controls");
        expect(controls).toBe(panel("One").getAttribute("id"));
    });

    it("names each panel from the header it belongs to", () => {
        renderAccordion({ defaultValue: ["one"] });
        const region = screen.getByRole("region", { name: "One" });
        expect(region).toHaveTextContent("One panel");
    });

    it("keeps a closed panel on the page so its header has something to point at", () => {
        renderAccordion();
        expect(panel("One")).toBeInTheDocument();
        expect(panel("One")).not.toBeVisible();
    });

    it("is a button rather than a submit", () => {
        renderAccordion();
        expect(header("One")).toHaveAttribute("type", "button");
    });

    it("tags the header and the panel with what they are and whether they are open", () => {
        renderAccordion({ defaultValue: ["one"] });
        expect(header("One")).toHaveAttribute("data-component", "Accordion.HeaderButton");
        expect(header("One")).toHaveAttribute("data-open", "true");
        expect(panel("One")).toHaveAttribute("data-component", "Accordion.Panel");
        expect(panel("One")).toHaveAttribute("data-open", "true");
    });

    it("turns the indicator over once the panel is open", () => {
        renderAccordion();
        const indicator = header("One").querySelector("svg");
        expect(indicator).not.toHaveClass("rotate-180");

        fireEvent.click(header("One"));
        expect(header("One").querySelector("svg")).toHaveClass("rotate-180");
    });

    it("merges a custom className onto the header button and the panel", () => {
        render(
            <Accordion>
                <Accordion.Item value="one">
                    <Accordion.Header className="custom-header">One</Accordion.Header>
                    <Accordion.Panel className="custom-panel">One panel</Accordion.Panel>
                </Accordion.Item>
            </Accordion>,
        );
        expect(header("One")).toHaveClass("custom-header");
        expect(panel("One")).toHaveClass("custom-panel");
    });

    it("forwards a ref to the header button and the panel", () => {
        const headerRef = React.createRef<HTMLButtonElement>();
        const panelRef = React.createRef<HTMLDivElement>();
        render(
            <Accordion>
                <Accordion.Item value="one">
                    <Accordion.Header ref={headerRef}>One</Accordion.Header>
                    <Accordion.Panel ref={panelRef}>One panel</Accordion.Panel>
                </Accordion.Item>
            </Accordion>,
        );
        expect(headerRef.current).toBeInstanceOf(HTMLButtonElement);
        expect(panelRef.current).toBeInstanceOf(HTMLDivElement);
    });
});

describe("Accordion keyboard behaviour", () => {
    // The arrow keys were taken back out of the APG pattern, so the headers are ordinary tab
    // stops and nothing moves focus between them but the reader's own Tab
    it("leaves the arrow keys to the page", () => {
        renderAccordion();
        header("One").focus();

        for (const key of ["ArrowDown", "ArrowUp", "Home", "End"]) {
            fireEvent.keyDown(header("One"), { key });
            expect(header("One")).toHaveFocus();
        }
    });

    it("leaves every header in the tab order", () => {
        renderAccordion();
        for (const section of sections) {
            expect(header(section)).not.toHaveAttribute("tabindex");
        }
    });

    it("calls a key handler it was given", () => {
        const onKeyDown = vi.fn();
        renderAccordion({ onKeyDown });
        header("One").focus();
        fireEvent.keyDown(header("One"), { key: "ArrowDown" });
        expect(onKeyDown).toHaveBeenCalled();
    });
});

describe("Accordion panels that are not kept", () => {
    it("measures how tall a panel opens to and writes it onto itself", () => {
        renderAccordion({ defaultValue: ["one"] });
        expect(panel("One").style.getPropertyValue("--accordion-panel-height")).toMatch(/^\d+px$/);
    });

    it("takes a closed panel off the page where it is not to be kept", () => {
        renderAccordion({ keepMounted: false });

        expect(screen.queryByText("One panel")).not.toBeInTheDocument();
        expect(header("One")).not.toHaveAttribute("aria-controls");

        fireEvent.click(header("One"));
        expect(panel("One")).toBeVisible();
        expect(header("One")).toHaveAttribute("aria-controls", panel("One").getAttribute("id"));
    });

    it("keeps panels on the page for the browser to find in, whatever it was told about keeping", () => {
        renderAccordion({ keepMounted: false, hiddenUntilFound: true });

        expect(panel("One")).toBeInTheDocument();
        expect(panel("One")).toHaveAttribute("hidden", "until-found");
    });

    it("opens the item that the browser's find-in-page turned up", () => {
        const onChange = vi.fn();
        renderAccordion({ hiddenUntilFound: true, onChange });

        fireEvent(panel("Two"), new Event("beforematch"));

        expect(onChange).toHaveBeenCalledWith(["two"]);
        expect(panel("Two")).toBeVisible();
    });

    it("hides a panel outright where the browser is not to find in it", () => {
        renderAccordion();
        expect(panel("One")).toHaveAttribute("hidden", "");
    });
});
