import DetailsBase from "./Details";
import DetailsSummary from "./DetailsSummary";

export const Details = Object.assign(DetailsBase, {
    Summary: DetailsSummary,
});

export { DetailsSummary };
export * from "./Details.types";
