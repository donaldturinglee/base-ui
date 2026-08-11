import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { BubbleGroupContext } from "./BubbleGroupContext";
import type { BubbleGroupProps } from "./Bubble.types";

const classes = {
    root: "bubble-group",
};

// A run of turns from one voice, stacked close enough together to read as a single stretch of
// talk rather than as several separate ones.
//
//     <Bubble.Group align="end">
//         <Bubble>
//             <Bubble.Content>Thursday still works</Bubble.Content>
//         </Bubble>
//         <Bubble>
//             <Bubble.Content>Same place as last time?</Bubble.Content>
//         </Bubble>
//     </Bubble.Group>
//
// The side is named once, here, since a speaker does not change sides part way through a run.
// Each bubble takes it from the run unless it names one of its own
function BubbleGroup<As extends React.ElementType = "div">(
    props: BubbleGroupProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        align = "start",
        ...rest
    } = props as BubbleGroupProps<"div">;

    return (
        <BubbleGroupContext.Provider value={{ align }}>
            <Component
                ref={ref}
                className={classNames(classes.root, className)}
                data-component="Bubble.Group"
                data-align={align}
                {...rest}
            />
        </BubbleGroupContext.Provider>
    );
}

BubbleGroup.displayName = "Bubble.Group";

export default fixedForwardRef(BubbleGroup);
