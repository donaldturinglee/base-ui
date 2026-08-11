import * as React from "react";
import { fixedForwardRef } from "../../utilities/polymorphic";
import ButtonBase from "../button/ButtonBase";
import type { ButtonBaseRenderProps } from "../button/ButtonBase";
import type { LinkButtonProps } from "./LinkButton.types";

function LinkButton<As extends React.ElementType = "a">(
    props: LinkButtonProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "a", ...rest } = props as LinkButtonProps<"a">;

    return (
        <ButtonBase
            ref={ref}
            as={Component}
            data-component="LinkButton"
            // The base is typed for the button it usually renders, so the anchor's own
            // attributes are handed over here
            {...(rest as unknown as ButtonBaseRenderProps)}
        />
    );
}

LinkButton.displayName = "LinkButton";

export default fixedForwardRef(LinkButton);
