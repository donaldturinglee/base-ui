const nonInteractiveSelectors = ["[disabled]", "[hidden]", "[inert]", "[tabindex='-1']"];

const interactiveSelectors = [
    "a[href]",
    "button",
    "summary",
    "select",
    "input:not([type=hidden])",
    "textarea",
    "[tabindex='0']",
    "audio[controls]",
    "video[controls]",
    "[contenteditable]",
];

// One combined selector keeps the lookup to a single query
const interactiveSelector = interactiveSelectors
    .map((selector) => `${selector}:not(${nonInteractiveSelectors.join("):not(")})`)
    .join(", ");

const isHidden = (node: HTMLElement) => {
    // The attribute checks are cheap, so only fall through to a style recalculation when
    // they come back clean
    if (node.matches("[disabled], [hidden], [inert]")) {
        return true;
    }

    const style = getComputedStyle(node);
    return style.display === "none" || style.visibility === "hidden";
};

// Reports whether anything inside the node can take focus, so a container can decide
// whether it needs to be focusable itself
export const hasInteractiveNodes = (node: HTMLElement | null) => {
    if (!node || isHidden(node)) {
        return false;
    }

    for (const candidate of node.querySelectorAll<HTMLElement>(interactiveSelector)) {
        if (candidate !== node && !isHidden(candidate)) {
            return true;
        }
    }

    return false;
};
