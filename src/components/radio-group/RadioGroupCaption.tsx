import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { RadioGroupContext } from "./RadioGroupContext";
import type { RadioGroupCaptionProps } from "./RadioGroup.types";

const classes = {
    root: "radio-group-caption",
};

function RadioGroupCaption(
    props: RadioGroupCaptionProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;
    const { captionId } = React.useContext(RadioGroupContext);

    return (
        <span
            ref={ref}
            id={captionId}
            className={classNames(classes.root, className)}
            data-component="RadioGroup.Caption"
            {...rest}
        />
    );
}

RadioGroupCaption.displayName = "RadioGroup.Caption";

export default fixedForwardRef(RadioGroupCaption);
