import * as React from "react";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { AttachmentContext } from "./AttachmentContext";
import type {
    AttachmentOrientation,
    AttachmentProps,
    AttachmentSize,
    AttachmentState,
} from "./Attachment.types";

const attachmentVariants = cva("attachment", {
    variants: {
        state: {
            idle: "attachment-state-idle",
            // A file on its way is drawn as the card it is about to become, and the wait is said
            // by the parts inside it rather than by the card being drawn differently
            uploading: "",
            processing: "",
            error: "attachment-state-error",
            done: "",
        } satisfies Record<AttachmentState, string>,
        size: {
            small: "attachment-size-small",
            medium: "attachment-size-medium",
            large: "attachment-size-large",
        } satisfies Record<AttachmentSize, string>,
        orientation: {
            horizontal: "attachment-horizontal",
            vertical: "attachment-vertical",
        } satisfies Record<AttachmentOrientation, string>,
    },
});

// One file standing on its own: what kind of thing it is, what it is called, and how far it has
// got. What the whole is doing is carried on the root, so the parts inside it are drawn from the
// state of the attachment rather than each having to be told what it is
function Attachment<As extends React.ElementType = "div">(
    props: AttachmentProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        state = "done",
        size = "medium",
        orientation = "horizontal",
        ...rest
    } = props as AttachmentProps<"div">;

    const context = React.useMemo(() => ({ state, size, orientation }), [state, size, orientation]);

    return (
        <AttachmentContext.Provider value={context}>
            <Component
                ref={ref}
                className={classNames(attachmentVariants({ state, size, orientation }), className)}
                data-component="Attachment"
                data-state={state}
                data-size={size}
                data-orientation={orientation}
                {...rest}
            />
        </AttachmentContext.Provider>
    );
}

Attachment.displayName = "Attachment";

export default fixedForwardRef(Attachment);
