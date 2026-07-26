import * as React from "react";
import { createPortal } from "react-dom";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { PortalContext } from "./PortalContext";
import { DEFAULT_PORTAL_CONTAINER_NAME, ensureDefaultPortal, getPortalRoot } from "./portalRoot";
import type { PortalProps } from "./Portal.types";

const classes = {
    // Portaled content gets its own stacking context so separate portals cannot interfere
    // with each other in unexpected ways. There is never a reason to raise this above 1.
    root: "relative z-1",
};

function Portal({ children, onMount, containerName }: PortalProps) {
    const { portalContainerName } = React.useContext(PortalContext);
    const elementRef = React.useRef<HTMLDivElement | null>(null);

    if (!elementRef.current) {
        const element = document.createElement("div");
        element.setAttribute("data-component", "Portal");
        element.className = classes.root;
        elementRef.current = element;
    }

    const element = elementRef.current;

    useIsomorphicLayoutEffect(() => {
        let name = containerName ?? portalContainerName;

        if (name === undefined) {
            name = DEFAULT_PORTAL_CONTAINER_NAME;
            ensureDefaultPortal();
        }

        const parentElement = getPortalRoot(name);

        if (!parentElement) {
            throw new Error(
                `Portal container '${name}' is not yet registered. Register it with registerPortalRoot before use.`,
            );
        }

        parentElement.appendChild(element);
        onMount?.();

        return () => {
            parentElement.removeChild(element);
        };
        // `onMount` is left out on purpose, so a fresh callback identity does not move the
        // portal out of and back into the DOM
    }, [element, containerName, portalContainerName]);

    return createPortal(children, element);
}

Portal.displayName = "Portal";

export default Portal;
