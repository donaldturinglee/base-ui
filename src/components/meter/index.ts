import MeterBase from "./Meter";
import MeterIndicator from "./MeterIndicator";
import MeterLabel from "./MeterLabel";
import MeterTrack from "./MeterTrack";
import MeterValue from "./MeterValue";

export const Meter = Object.assign(MeterBase, {
    Label: MeterLabel,
    Value: MeterValue,
    Track: MeterTrack,
    Indicator: MeterIndicator,
});

export { MeterLabel, MeterValue, MeterTrack, MeterIndicator };
export { MeterContext } from "./MeterContext";
export { formatMeterValue, valueToPercent } from "./meterReading";
export * from "./Meter.types";
