import { classNames } from "../../utilities/classnames";
import SkeletonBox from "../skeleton-box/SkeletonBox";
import type { SkeletonTextProps, SkeletonTextSize } from "./SkeletonText.types";

const classes = {
    root: "[--skeleton-text-leading:calc(var(--skeleton-text-font-size)*var(--skeleton-text-line-height)_-_var(--skeleton-text-font-size))] my-[calc(var(--skeleton-text-leading)/2)]",
    multiline:
        "mb-[calc(var(--skeleton-text-leading)*2)] last:mb-0 last:min-w-[50px] last:max-w-[65%]",
    wrapper: "[padding-block:0.1px]",
    size: {
        display:
            "[--skeleton-text-font-size:var(--text-display-size)] [--skeleton-text-line-height:var(--text-display-line-height)] rounded-[var(--border-radius-medium)]",
        titleLarge:
            "[--skeleton-text-font-size:var(--text-title-size-large)] [--skeleton-text-line-height:var(--text-title-line-height-large)] rounded-[var(--border-radius-medium)]",
        titleMedium:
            "[--skeleton-text-font-size:var(--text-title-size-medium)] [--skeleton-text-line-height:var(--text-title-line-height-medium)]",
        titleSmall:
            "[--skeleton-text-font-size:var(--text-title-size-small)] [--skeleton-text-line-height:var(--text-title-line-height-small)]",
        bodyLarge:
            "[--skeleton-text-font-size:var(--text-body-size-large)] [--skeleton-text-line-height:var(--text-body-line-height-large)]",
        bodyMedium:
            "[--skeleton-text-font-size:var(--text-body-size-medium)] [--skeleton-text-line-height:var(--text-body-line-height-medium)]",
        bodySmall:
            "[--skeleton-text-font-size:var(--text-body-size-small)] [--skeleton-text-line-height:var(--text-body-line-height-small)]",
        subtitle:
            "[--skeleton-text-font-size:var(--text-subtitle-size)] [--skeleton-text-line-height:var(--text-subtitle-line-height)]",
    } satisfies Record<SkeletonTextSize, string>,
};

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
                className={classNames(classes.root, classes.size[size], className)}
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
                        classes.root,
                        classes.multiline,
                        classes.size[size],
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
