import * as React from "react";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { AvatarContext } from "./AvatarContext";
import type { AvatarImageProps, AvatarLoadingStatus } from "./Avatar.types";

const classes = {
    root: "avatar-image",
};

// The picture the avatar is of. It stays in the tree while it is still on its way, since a picture
// that is not there is never fetched, and is only kept out of sight until it has arrived, which is
// what leaves the fallback room to be read in the meantime
//
// How far it has got is kept here as well as told to the avatar around it, so a picture rendered
// on its own still knows when to show itself
function AvatarImage(
    props: AvatarImageProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        // A picture that stands for someone the words beside it already name is decorative, and
        // says as much by saying nothing
        alt = "",
        src,
        onLoad,
        onError,
        ...rest
    } = props;

    const { setStatus } = React.useContext(AvatarContext);
    const [status, setOwnStatus] = React.useState<AvatarLoadingStatus>("idle");
    const imageRef = React.useRef<HTMLImageElement>(null);
    const refs = useMergedRefs(imageRef, ref);

    // Both the picture and the avatar around it are told at once, so the fallback steps aside in
    // the same render the picture is shown in
    const report = React.useCallback(
        (next: AvatarLoadingStatus) => {
            setOwnStatus(next);
            setStatus?.(next);
        },
        [setStatus],
    );

    // A picture already in the cache is complete before the first effect runs, so its load event
    // never arrives. Asking the element itself spares the fallback a flash, and starts a source
    // put in place of another one over again rather than leaving it wearing the last one's answer
    useIsomorphicLayoutEffect(() => {
        const image = imageRef.current;

        if (!image || !src) {
            report("idle");
            return;
        }

        report(image.complete && image.naturalWidth > 0 ? "loaded" : "loading");
    }, [report, src]);

    const handleLoad = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        report("loaded");
        onLoad?.(event);
    };

    const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        report("error");
        onError?.(event);
    };

    return (
        <img
            ref={refs}
            alt={alt}
            src={src}
            onLoad={handleLoad}
            onError={handleError}
            className={classNames(classes.root, className)}
            data-component="Avatar.Image"
            data-status={status}
            {...rest}
        />
    );
}

AvatarImage.displayName = "Avatar.Image";

export default fixedForwardRef(AvatarImage);
