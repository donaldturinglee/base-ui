import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import Portal from "./Portal";
import { PortalContext } from "./PortalContext";
import { registerPortalRoot } from "./portalRoot";

const PORTAL_ROOT_ID = "__baseUiPortalRoot__";

const getDefaultRoot = () => document.getElementById(PORTAL_ROOT_ID);

const getPortalNode = (root: Element | null) => root?.querySelector('[data-component="Portal"]');

describe("Portal", () => {
    // The registry outlives a single test, so drop the generated root to keep each test
    // starting from a document without one
    beforeEach(() => {
        getDefaultRoot()?.remove();
    });

    it("renders its children into a generated default portal root", () => {
        render(<Portal>portaled content</Portal>);
        const root = getDefaultRoot();
        expect(root).toBeInstanceOf(HTMLElement);
        expect(root).toHaveTextContent("portaled content");
    });

    it("tags the portal node with a data-component attribute", () => {
        render(<Portal>portaled content</Portal>);
        expect(getPortalNode(getDefaultRoot())).toBeInstanceOf(HTMLElement);
    });

    it("gives the portal node its own stacking context", () => {
        render(<Portal>portaled content</Portal>);
        expect(getPortalNode(getDefaultRoot())).toHaveClass("relative", "z-1");
    });

    it("appends the generated root to a data-portal-root element when one exists", () => {
        render(
            <div data-portal-root="" data-testid="host">
                <Portal>portaled content</Portal>
            </div>,
        );
        const root = screen.getByTestId("host").querySelector(`#${PORTAL_ROOT_ID}`);
        expect(root).toBeInstanceOf(HTMLElement);
        expect(root).toHaveTextContent("portaled content");
    });

    it("renders into an existing element carrying the default portal root id", () => {
        const root = document.createElement("div");
        root.setAttribute("id", PORTAL_ROOT_ID);
        document.body.appendChild(root);

        render(<Portal>declared root content</Portal>);
        expect(root).toHaveTextContent("declared root content");
        expect(getPortalNode(root)).toBeInstanceOf(HTMLElement);

        root.remove();
    });

    it("renders into a default portal root registered imperatively", () => {
        const root = document.createElement("div");
        document.body.appendChild(root);
        registerPortalRoot(root);

        render(<Portal>imperative root content</Portal>);
        expect(root).toHaveTextContent("imperative root content");

        root.remove();
    });

    it("renders into the container named by the containerName prop", () => {
        const first = document.createElement("div");
        const second = document.createElement("div");
        document.body.append(first, second);
        registerPortalRoot(first, "first-container");
        registerPortalRoot(second, "second-container");

        render(
            <>
                <Portal containerName="first-container">first content</Portal>
                <Portal containerName="second-container">second content</Portal>
            </>,
        );

        expect(first).toHaveTextContent("first content");
        expect(second).toHaveTextContent("second content");
        expect(getPortalNode(first)).toBeInstanceOf(HTMLElement);
        expect(getPortalNode(second)).toBeInstanceOf(HTMLElement);

        first.remove();
        second.remove();
    });

    it("renders into the container named by the portal context", () => {
        const container = document.createElement("div");
        document.body.appendChild(container);
        registerPortalRoot(container, "context-container");

        render(
            <PortalContext.Provider value={{ portalContainerName: "context-container" }}>
                <Portal>context content</Portal>
            </PortalContext.Provider>,
        );

        expect(container).toHaveTextContent("context content");

        container.remove();
    });

    it("falls back to the default root when the context leaves the name out", () => {
        render(
            <PortalContext.Provider value={{}}>
                <Portal>default content</Portal>
            </PortalContext.Provider>,
        );

        expect(getDefaultRoot()).toHaveTextContent("default content");
    });

    it("lets the containerName prop override the portal context", () => {
        const contextContainer = document.createElement("div");
        const propContainer = document.createElement("div");
        document.body.append(contextContainer, propContainer);
        registerPortalRoot(contextContainer, "overridden-container");
        registerPortalRoot(propContainer, "overriding-container");

        render(
            <PortalContext.Provider value={{ portalContainerName: "overridden-container" }}>
                <Portal containerName="overriding-container">overriding content</Portal>
            </PortalContext.Provider>,
        );

        expect(propContainer).toHaveTextContent("overriding content");
        expect(contextContainer).toBeEmptyDOMElement();

        contextContainer.remove();
        propContainer.remove();
    });

    it("calls onMount once the portal is added to the DOM", () => {
        const onMount = jest.fn();
        render(<Portal onMount={onMount}>portaled content</Portal>);
        expect(onMount).toHaveBeenCalledTimes(1);
    });

    it("removes the portal node from the root when unmounted", () => {
        const { unmount } = render(<Portal>portaled content</Portal>);
        const root = getDefaultRoot();
        expect(getPortalNode(root)).toBeInstanceOf(HTMLElement);

        unmount();
        expect(getPortalNode(root)).toBeNull();
    });

    it("throws when the named container has not been registered", () => {
        const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

        expect(() => render(<Portal containerName="unregistered">content</Portal>)).toThrow(
            /'unregistered' is not yet registered/,
        );

        consoleError.mockRestore();
    });
});
