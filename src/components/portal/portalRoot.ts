const PORTAL_ROOT_ID = "__baseUiPortalRoot__";

export const DEFAULT_PORTAL_CONTAINER_NAME = "__default__";

const classes = {
    // Spans the top of its parent so portaled content can position against the page
    root: "absolute top-0 left-0 w-full",
};

const portalRootRegistry: Partial<Record<string, Element>> = {};

// Registers a container to serve as a portal root. The name is the one passed to the
// `containerName` prop on Portal; leaving it out registers the default root.
export const registerPortalRoot = (root: Element, name = DEFAULT_PORTAL_CONTAINER_NAME) => {
    portalRootRegistry[name] = root;
};

export const ensureDefaultPortal = () => {
    const registered = portalRootRegistry[DEFAULT_PORTAL_CONTAINER_NAME];
    if (registered && document.body.contains(registered)) {
        return;
    }

    let container = document.getElementById(PORTAL_ROOT_ID);

    if (!container) {
        container = document.createElement("div");
        container.setAttribute("id", PORTAL_ROOT_ID);
        container.className = classes.root;
        // A `[data-portal-root]` element wins over the body, so an app can keep portals
        // inside a subtree that scopes theming or styles
        const preferredRoot = document.querySelector("[data-portal-root]");
        (preferredRoot ?? document.body).appendChild(container);
    }

    registerPortalRoot(container);
};

export const getPortalRoot = (name: string) => portalRootRegistry[name];
