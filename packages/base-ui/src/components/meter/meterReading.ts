// Where a value stands between two ends, as a share of the distance between them. Ends that are
// the same leave no distance to stand in, so the value is read as standing at the start of it
export const valueToPercent = (value: number, min: number, max: number): number => {
    if (max === min) {
        return 0;
    }

    return ((value - min) / (max - min)) * 100;
};

// The reading in words. A meter given a shape to write its value in writes the value itself; one
// given none writes how far along it stands instead, since a bare number says nothing without the
// ends it was measured between.
//
// It is written under the conventions the runtime is set to, which are the reader's own. A page
// that has to write it under someone else's writes the reading itself, through Meter.Value
export const formatMeterValue = (
    value: number,
    percentage: number,
    format?: Intl.NumberFormatOptions,
): string =>
    format
        ? new Intl.NumberFormat(undefined, format).format(value)
        : new Intl.NumberFormat(undefined, { style: "percent" }).format(percentage / 100);
