import * as React from "react";
import { createPortal } from "react-dom";
import { useId } from "../../hooks/useId";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import FrameContent from "./FrameContent";
import type { FrameProps } from "./Frame.types";

const classes = {
    root: "frame",
};

// Where the children are drawn. A node of the frame's own is written into the body rather than the
// body itself being drawn into, so that anything else the document holds stands beside them rather
// than being cleared away with them
export const FRAME_ROOT_CLASS = "frame-root";

// A document of its own carries none of the page's styles, so it starts from the margins and the
// box model browsers apply on their own. Those are taken away and nothing is put in their place:
// what the frame is to be read under is the caller's to hand over through `head`
const RESET_STYLE = "<style>*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}</style>";

const DEFAULT_SRC_DOC =
    `<!doctype html><html><head>${RESET_STYLE}</head>` +
    `<body><div class="${FRAME_ROOT_CLASS}"></div></body></html>`;

const getMountNode = (frame: HTMLIFrameElement) => {
    const document = frame.contentWindow?.document;

    if (!document) {
        return null;
    }

    // A caller writing a document of their own need not leave the node there, so the body stands
    // in for it rather than the children having nowhere to go
    return document.body.querySelector<HTMLElement>(`.${FRAME_ROOT_CLASS}`) ?? document.body;
};

// A document of its own, drawn into from this one. What is rendered inside is written with React
// as usual, but lands in a document that carries none of the page's styles and gives none of its
// own back, which is what makes a frame worth reaching for: previewing something the page must not
// restyle, or holding content that must not restyle the page.
//
//     <Frame head={<link rel="stylesheet" href="/preview.css" />}>
//         <p>Drawn inside the frame</p>
//     </Frame>
//
// Note that a Portal rendered inside a frame still lands in the page's document rather than the
// frame's, since the portal roots are registered against the page. A frame that needs its own
// should register a root inside it and name it through PortalContext
function Frame(
    props: FrameProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        children,
        head,
        onMount,
        onUnmount,
        srcDoc = DEFAULT_SRC_DOC,
        className,
        title,
        ...rest
    } = props;

    const uuid = useId();

    // The element is held as state rather than in a ref, because there is nothing to draw into
    // until it is there and a ref alone would not say when that happened
    const [frame, setFrame] = React.useState<HTMLIFrameElement | null>(null);
    const [mountNode, setMountNode] = React.useState<HTMLElement | null>(null);
    const [headNode, setHeadNode] = React.useState<HTMLHeadElement | null>(null);

    const setFrameElement = React.useCallback((element: HTMLIFrameElement | null) => {
        setFrame(element);
    }, []);

    const mergedRef = useMergedRefs(ref, setFrameElement);

    // The document is written rather than handed over as a `srcdoc` attribute. An attribute is
    // loaded whenever the browser gets round to it, which leaves no moment at which the children
    // are known to have somewhere to go; writing it settles the document before this returns
    useIsomorphicLayoutEffect(() => {
        if (!frame) {
            return;
        }

        const document = frame.contentWindow?.document;

        if (!document) {
            return;
        }

        document.open();
        document.write(srcDoc);
        document.close();

        setMountNode(getMountNode(frame));
        setHeadNode(document.head);
    }, [frame, srcDoc]);

    // A frame is sized by the element holding it rather than by what it holds, so what it holds is
    // measured from the inside and the readings are put on the element as custom properties. A
    // caller wanting a frame that fits its contents sizes it from those.
    //
    // The height is the reading worth having: a block fills the width it is given, so sizing the
    // frame's width from what it measured would be the frame asking itself how wide it is, and the
    // two would chase each other. The width only says something for contents that do not fill it
    React.useEffect(() => {
        if (!frame || !mountNode) {
            return;
        }

        // The observer has to be the frame's own rather than this document's, so that it reads the
        // sizes the frame's own layout settled. `contentWindow` is typed as a bare `Window`, which
        // leaves out the constructors that stand on the global, so it is named here as both
        const view = frame.contentWindow as (Window & typeof globalThis) | null;

        if (!view?.ResizeObserver) {
            return;
        }

        const measure = () => {
            frame.style.setProperty("--frame-content-width", `${mountNode.scrollWidth}px`);
            frame.style.setProperty("--frame-content-height", `${mountNode.scrollHeight}px`);
        };

        // Read on the frame after the one the change landed in, so that what has just been drawn
        // is what gets measured rather than what stood there before it
        const observer = new view.ResizeObserver(() => {
            view.requestAnimationFrame(measure);
        });

        measure();
        observer.observe(mountNode);

        return () => {
            observer.disconnect();
        };
    }, [frame, mountNode]);

    return (
        <iframe
            ref={mergedRef}
            // A frame carries no words of its own for a screen reader to read it by, so it is
            // named whether or not the caller thought to name it
            title={title ?? `Frame ${uuid}`}
            className={classNames(classes.root, className)}
            data-component="Frame"
            {...rest}
        >
            {mountNode
                ? createPortal(
                      <FrameContent onMount={onMount} onUnmount={onUnmount}>
                          {children}
                      </FrameContent>,
                      mountNode,
                  )
                : null}
            {head && headNode ? createPortal(head, headNode) : null}
        </iframe>
    );
}

Frame.displayName = "Frame";

export default fixedForwardRef(Frame);
