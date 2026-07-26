import * as React from "react";
import { fixedForwardRef } from "../../utilities/polymorphic";
import Link from "../link/Link";
import BlankslateAction from "./BlankslateAction";
import type { BlankslateSecondaryActionProps } from "./Blankslate.types";

function BlankslateSecondaryAction(
    props: BlankslateSecondaryActionProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { href, children, ...rest } = props;

    return (
        <BlankslateAction ref={ref} data-component="Blankslate.SecondaryAction" {...rest}>
            {/* A secondary action is a link by convention, so an href is all it takes */}
            {href === undefined ? children : <Link href={href}>{children}</Link>}
        </BlankslateAction>
    );
}

BlankslateSecondaryAction.displayName = "Blankslate.SecondaryAction";

export default fixedForwardRef(BlankslateSecondaryAction);
