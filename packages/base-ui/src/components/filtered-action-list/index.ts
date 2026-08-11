import FilteredActionListBase from "./FilteredActionList";
import FilteredActionListInput from "./FilteredActionListInput";
import FilteredActionListItem from "./FilteredActionListItem";
import { FilteredActionListBodyLoader } from "./FilteredActionListLoaders";

export const FilteredActionList = Object.assign(FilteredActionListBase, {
    Input: FilteredActionListInput,
    Item: FilteredActionListItem,
    BodyLoader: FilteredActionListBodyLoader,
});

export { FilteredActionListInput, FilteredActionListItem, FilteredActionListBodyLoader };
export { useAnnouncements } from "./useAnnouncements";
export * from "./FilteredActionList.types";
