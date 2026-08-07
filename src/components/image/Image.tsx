import * as React from "react";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { ImageBorderRadius, ImageFit, ImageProps } from "./Image.types";

const imageVariants = cva("image", {
    variants: {
        fit: {
            contain: "image-fit-contain",
            cover: "image-fit-cover",
            fill: "image-fit-fill",
            none: "image-fit-none",
            "scale-down": "image-fit-scale-down",
        } satisfies Record<ImageFit, string>,
        borderRadius: {
            none: "image-radius-none",
            small: "image-radius-small",
            medium: "image-radius-medium",
            large: "image-radius-large",
            full: "image-radius-full",
        } satisfies Record<ImageBorderRadius, string>,
    },
});

function Image<As extends React.ElementType = "img">(
    props: ImageProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "img",
        className,
        // A picture with nothing of its own to tell a reader is decorative, and says as much
        // by saying nothing
        alt = "",
        borderRadius = "none",
        fit = "cover",
        fallbackSrc,
        // Holding off until the picture is near the viewport costs nothing where it is already
        // there, and a caller who needs it fetched at once can ask for `loading="eager"`
        loading = "lazy",
        src,
        onError,
        ...rest
    } = props as ImageProps<"img">;

    // What is remembered is the source that failed rather than the failure itself, so a source
    // put in its place afterwards is given a chance of its own instead of inheriting the
    // fallback the last one was answered with
    const [failedSrc, setFailedSrc] = React.useState<string | undefined>(undefined);

    const usesFallback = fallbackSrc !== undefined && src !== undefined && src === failedSrc;

    // A fallback that fails in its turn writes the same source down again, which React settles
    // without a further render, so the two cannot send each other round
    const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setFailedSrc(src);
        onError?.(event);
    };

    return (
        <Component
            ref={ref}
            alt={alt}
            src={usesFallback ? fallbackSrc : src}
            loading={loading}
            onError={handleError}
            className={classNames(imageVariants({ borderRadius, fit }), className)}
            data-component="Image"
            data-border-radius={borderRadius}
            data-fit={fit}
            data-fallback={usesFallback || undefined}
            {...rest}
        />
    );
}

Image.displayName = "Image";

export default fixedForwardRef(Image);
