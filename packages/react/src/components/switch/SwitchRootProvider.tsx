import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getStateAttributes, SwitchContext } from "./SwitchContext";
import type { SwitchRootProviderProps } from "./Switch.types";

const classes = {
    root: "switch",
};

// The switch drawn from state a hook of the caller's own is holding, for a switch that has to be
// turned from somewhere else on the page. The switch itself is drawn through this, so the two are
// drawn alike.
//
// The root is a label pointing at the input among its parts, so the whole of it is a target for
// the input: a press on the track or on the words beside it turns the switch, and the browser
// does the turning
function SwitchRootProvider(
    props: SwitchRootProviderProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, value: api, onClick, ...rest } = props;

    // Where the switch started out is where a form that is reset takes it back to, so it is kept
    // from the first render rather than read off wherever the switch has since been turned to
    const initialChecked = React.useRef(api.checked);

    const context = {
        ...api,
        initialChecked: initialChecked.current,
    };

    const handleClick = (event: React.MouseEvent<HTMLLabelElement>) => {
        onClick?.(event);

        // The browser answers a press on the label with a second click, on the input the label
        // points at, which would climb back out through the switch to whatever stands around it.
        // It is stopped here, so the switch is only ever seen to be clicked once
        if ((event.target as HTMLElement).id === api.ids.hiddenInput) {
            event.stopPropagation();
        }
    };

    return (
        <SwitchContext.Provider value={context}>
            <label
                ref={ref}
                id={api.ids.root}
                htmlFor={api.ids.hiddenInput}
                className={classNames(classes.root, className)}
                onClick={handleClick}
                data-component="Switch"
                {...getStateAttributes(api)}
                {...rest}
            />
        </SwitchContext.Provider>
    );
}

SwitchRootProvider.displayName = "Switch.RootProvider";

export default fixedForwardRef(SwitchRootProvider);
