import { classNames, cva } from "../../utilities/classnames";
import SkeletonBox from "../skeleton-box/SkeletonBox";
import type { SkeletonTextProps, SkeletonTextSize } from "./SkeletonText.types";

const classes = {
    wrapper: "skeleton-text-wrapper",
};

const skeletonTextVariants = cva("skeleton-text", {
    variants: {
        size: {
            display: "skeleton-text-display",
            titleLarge: "skeleton-text-title-large",
            titleMedium: "skeleton-text-title-medium",
            titleSmall: "skeleton-text-title-small",
            bodyLarge: "skeleton-text-body-large",
            bodyMedium: "skeleton-text-body-medium",
            bodySmall: "skeleton-text-body-small",
            subtitle: "skeleton-text-subtitle",
        } satisfies Record<SkeletonTextSize, string>,
        multiline: {
            true: "skeleton-text-multiline",
            false: "",
        },
    },
});

function SkeletonText({
    lines = 1,
    maxWidth,
    size = "bodyMedium",
    className,
    style,
    ...rest
}: SkeletonTextProps) {
    if (lines < 2) {
        return (
            <SkeletonBox
                width="100%"
                height="var(--skeleton-text-font-size)"
                className={classNames(skeletonTextVariants({ size }), className)}
                style={{ ...style, maxWidth }}
                data-size={size}
                {...rest}
                data-component="SkeletonText"
            />
        );
    }

    return (
        <div
            className={classes.wrapper}
            style={{ ...style, maxWidth }}
            data-component="SkeletonText"
        >
            {Array.from({ length: lines }, (_, index) => (
                <SkeletonBox
                    key={index}
                    height="var(--skeleton-text-font-size)"
                    className={classNames(
                        skeletonTextVariants({ size, multiline: true }),
                        className,
                    )}
                    data-size={size}
                    {...rest}
                />
            ))}
        </div>
    );
}

SkeletonText.displayName = "SkeletonText";

export default SkeletonText;
