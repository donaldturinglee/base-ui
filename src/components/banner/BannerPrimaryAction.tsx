import * as React from "react";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Button } from "../button";
import type { BannerPrimaryActionProps } from "./Banner.types";

function BannerPrimaryAction(
    props: BannerPrimaryActionProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    return (
        <Button
            ref={ref}
            variant="default"
            data-component="Banner.PrimaryAction"
            {...(props as React.ComponentPropsWithoutRef<typeof Button>)}
        />
    );
}

BannerPrimaryAction.displayName = "Banner.PrimaryAction";

export default fixedForwardRef(BannerPrimaryAction);
