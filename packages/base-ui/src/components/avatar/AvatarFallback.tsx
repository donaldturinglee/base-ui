import * as React from "react";
import { classNames } from "../../lib/classnames";
import { useLocaleContext } from "../../providers/locale";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { AvatarContext } from "./AvatarContext";
import type { AvatarFallbackProps } from "./Avatar.types";

const classes = {
    root: "avatar-fallback",
};

// The initials a name comes down to: the first letter of the first word and of the last, so that a
// middle name is passed over rather than crowding out the two words that say who someone is. A name
// of one word keeps the one letter it has rather than being padded out to two.
//
// The letters are taken a character at a time rather than by index, since a character written
// outside the basic plane is two code units long and cutting one in half leaves half a letter.
// They are put into capitals the way the locale does it, which is what turns the Turkish "i" into
// a dotted "İ" rather than into the "I" that English reads
const getInitials = (name: string, locale: string) => {
    const words = name.trim().split(/\s+/).filter(Boolean);

    if (words.length === 0) {
        return "";
    }

    const [first] = [...words[0]];
    const [last] = [...words[words.length - 1]];

    return (words.length > 1 ? `${first}${last}` : first).toLocaleUpperCase(locale);
};

// What stands where the picture cannot: the initials of whoever the avatar is of. It is shown
// while the picture is still on its way, where the picture never arrived, and where there was
// never one to begin with, so an avatar is never a hole in the page
//
// Once the picture has arrived it says everything the fallback stood in for, so the fallback is
// taken out of the tree rather than only hidden, and a screen reader is not left reading both
function AvatarFallback(
    props: AvatarFallbackProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, name, ...rest } = props;
    const { status = "idle" } = React.useContext(AvatarContext);
    const { locale } = useLocaleContext();

    if (status === "loaded") {
        return null;
    }

    return (
        <span
            ref={ref}
            // The letters stand for someone in the same way the picture would, so they are read as
            // one thing that has a name rather than spelled out a letter at a time
            role="img"
            aria-label={name}
            className={classNames(classes.root, className)}
            data-component="Avatar.Fallback"
            data-status={status}
            {...rest}
        >
            {getInitials(name, locale)}
        </span>
    );
}

AvatarFallback.displayName = "Avatar.Fallback";

export default fixedForwardRef(AvatarFallback);
