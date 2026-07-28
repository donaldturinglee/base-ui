import * as React from "react";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Button } from "../button";
import type { BannerSecondaryActionProps } from "./Banner.types";

function BannerSecondaryAction(
    props: BannerSecondaryActionProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    return (
        <Button
            ref={ref}
            variant="invisible"
            data-component="Banner.SecondaryAction"
            {...(props as React.ComponentPropsWithoutRef<typeof Button>)}
        />
    );
}

BannerSecondaryAction.displayName = "Banner.SecondaryAction";

export default fixedForwardRef(BannerSecondaryAction);
