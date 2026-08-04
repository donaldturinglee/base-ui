import StatusBase from "./Status";
import StatusIndicator from "./StatusIndicator";

export const Status = Object.assign(StatusBase, {
    Indicator: StatusIndicator,
});

export { StatusIndicator };
export * from "./Status.types";
