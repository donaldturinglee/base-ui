// How many places a number is written to. A step of a tenth has to be rounded back to one place
// after arithmetic, which would otherwise leave 0.30000000000000004 behind
const decimalPlaces = (value: number): number => {
    const text = String(value);
    const point = text.indexOf(".");

    return point === -1 ? 0 : text.length - point - 1;
};

// Holds a number inside the range it was given, where it was given one at all
export const clampToRange = (value: number, min?: number, max?: number): number => {
    if (min !== undefined && value < min) {
        return min;
    }

    if (max !== undefined && value > max) {
        return max;
    }

    return value;
};

// The number a field lands on when it is stepped up or down. A field with nothing in it steps
// onto the floor it was given rather than off it, so the first press lands somewhere the reader
// can see rather than a step away from nowhere
export const stepValue = (
    value: number | null,
    direction: 1 | -1,
    { step = 1, min, max }: { step?: number; min?: number; max?: number } = {},
): number => {
    if (value === null) {
        return clampToRange(min ?? 0, min, max);
    }

    const stepped = value + direction * step;
    const places = Math.max(decimalPlaces(step), decimalPlaces(value));
    // Rounded back to the places the step and the value were written to, so a run of tenths does
    // not drift into a tail of digits nobody asked for
    const rounded = places === 0 ? stepped : Number(stepped.toFixed(places));

    return clampToRange(rounded, min, max);
};

// What the field is holding. A field left empty, and one holding something the browser could
// make no number of, both count as holding nothing rather than as holding zero
export const readValue = (input: HTMLInputElement): number | null => {
    if (input.value === "") {
        return null;
    }

    const parsed = Number(input.value);

    return Number.isNaN(parsed) ? null : parsed;
};
