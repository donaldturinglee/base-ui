import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { CheckboxGroupContext } from "./CheckboxGroupContext";
import type { CheckboxGroupCaptionProps } from "./CheckboxGroup.types";

const classes = {
    root: "block [font-size:var(--text-body-size-medium)] text-foreground-muted",
};

function CheckboxGroupCaption(
    props: CheckboxGroupCaptionProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;
    const { captionId } = React.useContext(CheckboxGroupContext);

    return (
        <span
            ref={ref}
            id={captionId}
            className={classNames(classes.root, className)}
            data-component="CheckboxGroup.Caption"
            {...rest}
        />
    );
}

CheckboxGroupCaption.displayName = "CheckboxGroup.Caption";

export default fixedForwardRef(CheckboxGroupCaption);
