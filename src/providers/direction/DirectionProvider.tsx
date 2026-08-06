import * as React from "react";
import { DirectionContext } from "./DirectionContext";
import { useDirection } from "./useDirection";
import type { DirectionProviderProps } from "./Direction.types";

// Settles on a reading direction and puts it within reach of everything below, both as the
// `dir` attribute the stylesheets are written against and as a value a component can read
function DirectionProvider({ children, className, contextOnly, ...props }: DirectionProviderProps) {
    // What the caller leaves out comes from a DirectionProvider further up, so a nested
    // provider only has to say what it changes
    const inheritedDirection = useDirection();
    const direction = props.direction ?? inheritedDirection;

    const context = React.useMemo(() => ({ direction }), [direction]);

    if (contextOnly) {
        return <DirectionContext.Provider value={context}>{children}</DirectionContext.Provider>;
    }

    return (
        <DirectionContext.Provider value={context}>
            <div
                className={className}
                data-component="DirectionProvider"
                // Logical properties and the `:dir()` selectors in `styles` read the direction
                // off the document rather than off context, so this attribute is what turns
                // the subtree around
                dir={direction}
            >
                {children}
            </div>
        </DirectionContext.Provider>
    );
}

DirectionProvider.displayName = "DirectionProvider";

export default DirectionProvider;
