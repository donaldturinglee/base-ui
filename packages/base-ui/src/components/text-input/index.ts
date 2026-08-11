import TextInputBase from "./TextInput";
import TextInputAction from "./TextInputAction";

export const TextInput = Object.assign(TextInputBase, {
    Action: TextInputAction,
});

export { TextInputAction };
export * from "./TextInput.types";
