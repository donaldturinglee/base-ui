import type { SortDirection, SortStrategyName } from "./DataTable.types";

// The direction a column takes when it goes from unsorted to sorted
export const DEFAULT_SORT_DIRECTION: Exclude<SortDirection, "NONE"> = "ASC";

// A sorted table always has one column sorted, so a toggle only ever moves between the two
// directions and never back to "NONE"
export const transitionSortDirection = (
    direction: Exclude<SortDirection, "NONE">,
): Exclude<SortDirection, "NONE"> => (direction === "ASC" ? "DESC" : "ASC");

// Compares any two values of the same type
const basic = <T>(a: T, b: T) => (a === b ? 0 : a < b ? -1 : 1);

// Compares two dates, or the numbers Date.now() gives
const datetime = (a: Date | number, b: Date | number) => {
    const timeA = a instanceof Date ? a.getTime() : a;
    const timeB = b instanceof Date ? b.getTime() : b;

    return timeA > timeB ? 1 : timeA < timeB ? -1 : 0;
};

// Breaks a string into runs of text and runs of digits, so `item 2` orders before `item 10`
const getAlphaNumericGroups = (input: string) => {
    const groups: Array<string | number> = [];
    let index = 0;

    while (index < input.length) {
        let group = input[index];

        if (isNumeric(group)) {
            while (index + 1 < input.length && isNumeric(input[index + 1])) {
                group = group + input[index + 1];
                index++;
            }

            groups.push(parseInt(group, 10));
        } else {
            while (index + 1 < input.length && !isNumeric(input[index + 1])) {
                group = group + input[index + 1];
                index++;
            }

            groups.push(group);
        }

        index++;
    }

    return groups;
};

const isNumeric = (value: string) => !Number.isNaN(parseInt(value, 10));

// Compares two strings in natural order, taking each run of digits as a number rather than
// as text
// @see https://en.wikipedia.org/wiki/Natural_sort_order
const alphanumeric = (inputA: string, inputB: string) => {
    const groupsA = getAlphaNumericGroups(inputA);
    const groupsB = getAlphaNumericGroups(inputB);

    while (groupsA.length !== 0 && groupsB.length !== 0) {
        const a = groupsA.shift();
        const b = groupsB.shift();

        if (a === b) {
            continue;
        }

        if (typeof a === "string" && typeof b === "string") {
            return a.localeCompare(b);
        }

        if (typeof a === "number" && typeof b === "number") {
            return a > b ? 1 : -1;
        }

        // Numbers order before text
        if (typeof a === "number" && typeof b === "string") {
            return -1;
        }

        if (typeof a === "string" && typeof b === "number") {
            return 1;
        }

        if (a === undefined || b === undefined) {
            break;
        }
    }

    // Where everything else matches, the string made of fewer runs orders first
    return groupsA.length > groupsB.length ? 1 : -1;
};

export const sortStrategies = {
    alphanumeric,
    basic,
    datetime,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
} satisfies Record<SortStrategyName, (a: any, b: any) => number>;
