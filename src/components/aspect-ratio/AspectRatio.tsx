import * as React from "react";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { AspectRatioProps, AspectRatioRatio } from "./AspectRatio.types";

const aspectRatioVariants = cva(
    [
        // The box takes its height from the width it is given, so it holds its place on the page
        // before whatever goes in it has loaded
        "block relative overflow-hidden aspect-[var(--aspect-ratio)]",
        // Whatever is put inside is laid over the whole box and cropped to it, so an image of any
        // size sits where it should without a caller having to measure it first
        "[&>*]:absolute [&>*]:inset-0 [&>*]:w-full [&>*]:h-full [&>*]:object-cover",
    ],
    {
        variants: {
            ratio: {
                "1:1": "[--aspect-ratio:1/1]",
                "16:9": "[--aspect-ratio:16/9]",
                "4:3": "[--aspect-ratio:4/3]",
                // A custom shape comes from the width and height beside it, so there is nothing
                // for the class to say
                custom: "",
            } satisfies Record<AspectRatioRatio, string>,
        },
    },
);

function AspectRatio<As extends React.ElementType = "div">(
    props: AspectRatioProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        ratio = "1:1",
        // A custom ratio that comes without a width or a height of its own is square, the
        // same shape a box falls back to
        width = 1,
        height = 1,
        style,
        ...rest
    } = props as AspectRatioProps<"div">;

    return (
        <Component
            ref={ref}
            className={classNames(aspectRatioVariants({ ratio }), className)}
            style={
                {
                    ...style,
                    // The named ratios set this from their own class, so only a custom one is
                    // left with anything to say here
                    "--aspect-ratio": ratio === "custom" ? `${width}/${height}` : undefined,
                } as React.CSSProperties
            }
            data-component="AspectRatio"
            data-ratio={ratio}
            {...rest}
        />
    );
}

AspectRatio.displayName = "AspectRatio";

export default fixedForwardRef(AspectRatio);
