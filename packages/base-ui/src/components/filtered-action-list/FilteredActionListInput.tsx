import { TextInput } from "../text-input";
import type { FilteredActionListInputProps } from "./FilteredActionList.types";

const classes = {
    root: "filtered-action-list-input",
};

// The field the list is filtered by. It is read as a combobox standing against the list
// rather than as a field of its own, since typing in it is what narrows the list
function FilteredActionListInput(props: FilteredActionListInputProps) {
    const {
        inputRef,
        value,
        onInputChange,
        onInputKeyDown,
        placeholderText,
        listId,
        inputDescriptionId,
        loading = false,
        ...rest
    } = props;

    return (
        <div className={classes.root} data-component="FilteredActionList.Header">
            <TextInput
                ref={inputRef}
                block
                value={value}
                onChange={onInputChange}
                onKeyDown={onInputKeyDown}
                placeholder={placeholderText}
                role="combobox"
                aria-expanded="true"
                aria-autocomplete="list"
                aria-controls={listId}
                aria-label={placeholderText}
                aria-describedby={inputDescriptionId}
                loading={loading}
                loaderPosition="leading"
                {...rest}
            />
        </div>
    );
}

FilteredActionListInput.displayName = "FilteredActionList.Input";

export default FilteredActionListInput;
