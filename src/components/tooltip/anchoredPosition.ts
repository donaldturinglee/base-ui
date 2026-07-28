// Which edge of the anchor the floating element stands off, and where along that edge it
// lines up
export type AnchorSide = "outside-top" | "outside-right" | "outside-bottom" | "outside-left";

export type AnchorAlignment = "start" | "center" | "end";

export type AnchoredPositionOptions = {
    side: AnchorSide;
    align: AnchorAlignment;
    // How far the floating element stands clear of the anchor
    anchorOffset?: number;
};

export type AnchoredPosition = {
    top: number;
    left: number;
    // Where it ended up, which is not always where it was asked to go
    anchorSide: AnchorSide;
    anchorAlign: AnchorAlignment;
};

const DEFAULT_ANCHOR_OFFSET = 4;

const oppositeSide: Record<AnchorSide, AnchorSide> = {
    "outside-top": "outside-bottom",
    "outside-bottom": "outside-top",
    "outside-left": "outside-right",
    "outside-right": "outside-left",
};

const isVertical = (side: AnchorSide) => side === "outside-top" || side === "outside-bottom";

type Rect = {
    top: number;
    right: number;
    bottom: number;
    left: number;
    width: number;
    height: number;
};

// Where the floating element sits along the axis it stands off the anchor on
const positionOnSide = (side: AnchorSide, anchor: Rect, floating: Rect, offset: number) => {
    if (side === "outside-top") {
        return anchor.top - floating.height - offset;
    }

    if (side === "outside-bottom") {
        return anchor.bottom + offset;
    }

    if (side === "outside-left") {
        return anchor.left - floating.width - offset;
    }

    return anchor.right + offset;
};

// Where it sits along the other axis, which is what the alignment decides
const positionOnAlignment = (
    align: AnchorAlignment,
    anchorStart: number,
    anchorSize: number,
    floatingSize: number,
) => {
    if (align === "start") {
        return anchorStart;
    }

    if (align === "end") {
        return anchorStart + anchorSize - floatingSize;
    }

    return anchorStart + (anchorSize - floatingSize) / 2;
};

// Works out where a floating element should stand against an anchor, turning it to the
// other side or sliding it along where the viewport leaves no room. The coordinates are
// relative to the viewport, which is what the top layer a popover lives in is laid out
// against
export const getAnchoredPosition = (
    floating: HTMLElement,
    anchor: HTMLElement,
    { side, align, anchorOffset = DEFAULT_ANCHOR_OFFSET }: AnchoredPositionOptions,
): AnchoredPosition => {
    const anchorRect = anchor.getBoundingClientRect();
    const floatingRect = floating.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let anchorSide = side;
    let main = positionOnSide(anchorSide, anchorRect, floatingRect, anchorOffset);

    const mainSize = isVertical(anchorSide) ? floatingRect.height : floatingRect.width;
    const mainLimit = isVertical(anchorSide) ? viewportHeight : viewportWidth;

    // Turning it round is only worth it where the other side has the room this one lacks
    if (main < 0 || main + mainSize > mainLimit) {
        const flipped = positionOnSide(oppositeSide[side], anchorRect, floatingRect, anchorOffset);

        if (flipped >= 0 && flipped + mainSize <= mainLimit) {
            anchorSide = oppositeSide[side];
            main = flipped;
        }
    }

    const alongVerticalSide = isVertical(anchorSide);
    const anchorStart = alongVerticalSide ? anchorRect.left : anchorRect.top;
    const anchorSize = alongVerticalSide ? anchorRect.width : anchorRect.height;
    const floatingSize = alongVerticalSide ? floatingRect.width : floatingRect.height;
    const crossLimit = alongVerticalSide ? viewportWidth : viewportHeight;

    let anchorAlign = align;
    let cross = positionOnAlignment(align, anchorStart, anchorSize, floatingSize);

    // Running off one end is answered by lining up against the other, which is the most it
    // can be moved and still point at the anchor
    if (cross < 0) {
        anchorAlign = "start";
        cross = positionOnAlignment(anchorAlign, anchorStart, anchorSize, floatingSize);
    } else if (cross + floatingSize > crossLimit) {
        anchorAlign = "end";
        cross = positionOnAlignment(anchorAlign, anchorStart, anchorSize, floatingSize);
    }

    // Whatever is left over is simply held inside the viewport
    cross = Math.max(0, Math.min(cross, crossLimit - floatingSize));

    return {
        top: alongVerticalSide ? main : cross,
        left: alongVerticalSide ? cross : main,
        anchorSide,
        anchorAlign,
    };
};
