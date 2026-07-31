import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getHiddenAttribute, getHiddenClassName, getHiddenViewports } from "./visibility";
import type { PageHeaderChildProps } from "./PageHeader.types";

// The box a part of the header is drawn in. Every part can be taken off the screen at
// whichever viewport ranges it names, so that is handled from here and the parts themselves
// only say where they stand and what they hold
function PageHeaderRegion<As extends React.ElementType = "div">(
    props: PageHeaderChildProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        hidden,
        ...rest
    } = props as PageHeaderChildProps<"div">;

    const hiddenViewports = getHiddenViewports(hidden);

    return (
        <Component
            ref={ref}
            // The hiding comes last, so that it stands over whatever the part was laid out
            // with rather than the other way round
            className={classNames(className, getHiddenClassName(hiddenViewports))}
            data-hidden={getHiddenAttribute(hiddenViewports)}
            {...rest}
        />
    );
}

export default fixedForwardRef(PageHeaderRegion);
