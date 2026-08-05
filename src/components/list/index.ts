import ListBase from "./List";
import ListItem from "./ListItem";

export const List = Object.assign(ListBase, {
    Item: ListItem,
});

export { ListItem };
export * from "./List.types";
