import StackBase from "./Stack";
import StackItem from "./StackItem";

export const Stack = Object.assign(StackBase, {
    Item: StackItem,
});

export { StackItem };
export * from "./Stack.types";
