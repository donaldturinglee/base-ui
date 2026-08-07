import * as React from "react";
import { DismissCircleRegular, SearchRegular } from "@gamecrafters/base-ui-icons";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { TextInput } from "../text-input";
import { SelectPanelContext } from "./SelectPanelContext";
import type { SelectPanelSearchInputProps } from "./SelectPanel.types";

const classes = {
    root: "select-panel-search-input",
};

// The field that filters the list. What is typed into it is reported to the caller, which
// filters the items it hands back to the panel
function SelectPanelSearchInput(
    props: SelectPanelSearchInputProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, value, onChange, onKeyDown, ...rest } = props;

    const { searchQuery, setSearchQuery, searchInputRef, moveFocusToList } =
        React.useContext(SelectPanelContext);

    const inputRef = React.useRef<HTMLInputElement>(null);
    // The panel holds the field as well, so that it can open with focus already in it
    const panelInputRef = useMergedRefs(searchInputRef, inputRef);
    const mergedRef = useMergedRefs(ref, panelInputRef);

    // A field the caller is holding the value of takes the text from the prop; one that is
    // not takes the text the panel keeps for it
    const currentValue = value ?? searchQuery ?? "";

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery?.(event.currentTarget.value);
        onChange?.(event.currentTarget.value, event);
    };

    const handleClear = () => {
        setSearchQuery?.("");
        // There is no change event to hand back, since nothing was typed
        onChange?.("", null);
        inputRef.current?.focus();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "ArrowDown") {
            // Taking the event keeps the panel from scrolling away underneath the list
            event.preventDefault();
            moveFocusToList?.();
        }

        onKeyDown?.(event);
    };

    return (
        <TextInput
            ref={mergedRef}
            block
            leadingVisual={SearchRegular}
            placeholder="Search"
            value={currentValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            // There is nothing to clear while the field is empty
            trailingAction={
                currentValue ? (
                    <TextInput.Action
                        icon={DismissCircleRegular}
                        aria-label="Clear"
                        onClick={handleClear}
                    />
                ) : undefined
            }
            className={classNames(classes.root, className)}
            data-component="SelectPanel.SearchInput"
            {...rest}
        />
    );
}

SelectPanelSearchInput.displayName = "SelectPanel.SearchInput";

export default fixedForwardRef(SelectPanelSearchInput);
