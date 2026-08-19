import * as React from "react";
import Control from "ol/control/Control";
import { classNames } from "../../classnames";
import { useMapControl } from "./useMapControl";

// OpenLayers places a control itself, in an element of its own choosing, and expects whatever
// the control draws to be written into that element. A control drawing more than an icon is
// therefore handed an empty element to place, and React draws into it through a portal, so its
// buttons are the same components the rest of the design system is drawn from.
//
// The classes OpenLayers positions a control by are always there; whatever a caller passes is
// settled against them rather than replacing them
const OL_CONTROL_CLASSES = "ol-unselectable ol-control";

export const useMapCustomControl = (
    component: string,
    className: string,
    target?: HTMLElement | string,
) => {
    const elementRef = React.useRef<HTMLDivElement | null>(null);

    if (!elementRef.current) {
        const element = document.createElement("div");
        element.setAttribute("data-component", component);
        elementRef.current = element;
    }

    const element = elementRef.current;

    useMapControl(() => new Control({ element, target }));

    React.useEffect(() => {
        element.className = classNames(OL_CONTROL_CLASSES, className);
    }, [element, className]);

    return element;
};
