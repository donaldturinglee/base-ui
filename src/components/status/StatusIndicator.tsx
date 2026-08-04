import * as React from "react";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { StatusContext } from "./StatusContext";
import type { StatusIndicatorProps, StatusSize, StatusVariant } from "./Status.types";

const statusIndicatorVariants = cva("status-indicator", {
    variants: {
        variant: {
            accent: "status-indicator-accent",
            success: "status-indicator-success",
            attention: "status-indicator-attention",
            severe: "status-indicator-severe",
            danger: "status-indicator-danger",
            done: "status-indicator-done",
            neutral: "status-indicator-neutral",
        } satisfies Record<StatusVariant, string>,
        size: {
            small: "status-indicator-small",
            medium: "status-indicator-medium",
            large: "status-indicator-large",
        } satisfies Record<StatusSize, string>,
    },
});

// The dot, which is the one part of a status that carries the colour. The colour and the size
// are taken from the status it is written in, so a caller names them again only to say something
// the words do not. They are named on the dot rather than only on the status around it, so a dot
// read where a status is not — beside an avatar, or in a cell too narrow for the words — is
// still painted
//
// The dot is drawn for the eye alone and kept from a screen reader, since whatever it is read
// beside is what says what it means
function StatusIndicator(
    props: StatusIndicatorProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, variant, size, ...rest } = props;
    const status = React.useContext(StatusContext);

    const resolvedVariant = variant ?? status.variant ?? "neutral";
    const resolvedSize = size ?? status.size ?? "medium";

    return (
        <span
            ref={ref}
            aria-hidden="true"
            className={classNames(
                statusIndicatorVariants({ variant: resolvedVariant, size: resolvedSize }),
                className,
            )}
            data-component="Status.Indicator"
            data-variant={resolvedVariant}
            data-size={resolvedSize}
            {...rest}
        />
    );
}

StatusIndicator.displayName = "Status.Indicator";

export default fixedForwardRef(StatusIndicator);
