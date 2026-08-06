import type { FlowOrientation, FlowRect } from "./Flow.types";

// A join shorter than this is drawn as a straight line. Turning a corner needs room either side
// of it, and below a couple of pixels there is none to be had
const MIN_TURN = 2;

const round = (value: number) => Math.round(value * 100) / 100;

// The line drawn from one step to the next: out of the side the flow leaves by, across to the
// halfway point, along to the row or column the next step stands in, and in to the side it is
// entered at. The two turns are rounded off, and the radius is held to half of either leg so a
// short join cannot turn back through itself.
//
// A join between two steps standing in the same row, or the same column, has nothing to turn for
// and is drawn straight
export const connectorPath = (
    from: FlowRect,
    to: FlowRect,
    orientation: FlowOrientation,
    cornerRadius: number,
): string => {
    if (orientation === "vertical") {
        const startX = round(from.x + from.width / 2);
        const startY = round(from.y + from.height);
        const endX = round(to.x + to.width / 2);
        const endY = round(to.y);

        const across = endX - startX;
        const along = endY - startY;

        if (Math.abs(across) <= MIN_TURN || Math.abs(along) <= MIN_TURN) {
            return `M ${startX} ${startY} L ${endX} ${endY}`;
        }

        const middle = round(startY + along / 2);
        const radius = round(Math.min(cornerRadius, Math.abs(across) / 2, Math.abs(along) / 2));
        const step = across > 0 ? radius : -radius;

        return [
            `M ${startX} ${startY}`,
            `V ${round(middle - radius)}`,
            `Q ${startX} ${middle} ${round(startX + step)} ${middle}`,
            `H ${round(endX - step)}`,
            `Q ${endX} ${middle} ${endX} ${round(middle + radius)}`,
            `V ${endY}`,
        ].join(" ");
    }

    const startX = round(from.x + from.width);
    const startY = round(from.y + from.height / 2);
    const endX = round(to.x);
    const endY = round(to.y + to.height / 2);

    const along = endX - startX;
    const across = endY - startY;

    if (Math.abs(across) <= MIN_TURN || Math.abs(along) <= MIN_TURN) {
        return `M ${startX} ${startY} L ${endX} ${endY}`;
    }

    const middle = round(startX + along / 2);
    const radius = round(Math.min(cornerRadius, Math.abs(along) / 2, Math.abs(across) / 2));
    const step = across > 0 ? radius : -radius;

    return [
        `M ${startX} ${startY}`,
        `H ${round(middle - radius)}`,
        `Q ${middle} ${startY} ${middle} ${round(startY + step)}`,
        `V ${round(endY - step)}`,
        `Q ${middle} ${endY} ${round(middle + radius)} ${endY}`,
        `H ${endX}`,
    ].join(" ");
};
