import { getInteractiveNodes } from "../../utilities/interactive";

// Everything inside a panel the tab key can reach, in the order it reaches them. Nothing at all
// for a panel that is shut, since nothing in a shut panel can be reached
export const getTabbables = (container: HTMLElement | null) => getInteractiveNodes(container);

// Moves focus to the first of the candidates that will take it. Focusing is asked rather than
// assumed, since an element can refuse focus for reasons no selector can see
export const focusFirst = (candidates: HTMLElement[]) => {
    const previous = document.activeElement;

    return candidates.some((candidate) => {
        if (candidate === previous) {
            return true;
        }

        candidate.focus();

        return document.activeElement !== previous;
    });
};

// Takes the candidates out of the tab order without taking them off the page, and hands back
// the way to put them back. What each was set to before is kept on the element itself, so that
// putting it back needs nothing remembered here
export const removeFromTabOrder = (candidates: HTMLElement[]) => {
    candidates.forEach((candidate) => {
        candidate.dataset.tabindex = candidate.getAttribute("tabindex") ?? "";
        candidate.setAttribute("tabindex", "-1");
    });

    return () => {
        candidates.forEach((candidate) => {
            const previous = candidate.dataset.tabindex;

            if (previous) {
                candidate.setAttribute("tabindex", previous);
            } else {
                candidate.removeAttribute("tabindex");
            }

            delete candidate.dataset.tabindex;
        });
    };
};
