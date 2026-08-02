import * as React from "react";
import { useId } from "../../hooks/useId";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { commandScore } from "./commandScore";
import { CommandPaletteContext } from "./CommandPaletteContext";
import type { CommandPaletteEntry, CommandPaletteProps } from "./CommandPalette.types";

const classes = {
    // The palette takes whatever room it is given, up to the width a single line of command
    // still reads across. Everything it holds is clipped to its own corners, so nothing
    // standing at either end of it rounds out past them. Nothing inside it can take focus, so
    // it gives up its own ring
    root: "flex w-full max-w-[var(--overlay-width-large)] flex-col overflow-hidden rounded-[var(--border-radius-medium)] border-solid border-[length:var(--border-width-thin)] border-[color:var(--border-color-default)] bg-[var(--overlay-background-color)] focus:outline-none",
    hidden: "sr-only",
};

// Everything the palette is showing, best answer first. Ties keep the order the items were
// written in, so nothing typed leaves the list exactly as the caller laid it out
const rankEntries = (entries: CommandPaletteEntry[], scores: Record<string, number>) =>
    entries
        .map((entry, index) => ({ entry, index }))
        .filter(({ entry }) => entry.forceMount || (scores[entry.value] ?? 0) > 0)
        .sort((one, other) => {
            const gap = (scores[other.entry.value] ?? 0) - (scores[one.entry.value] ?? 0);

            return gap === 0 ? one.index - other.index : gap;
        })
        .map(({ entry }) => entry.value);

// A list of things that can be done, narrowed by typing. The field keeps focus throughout and
// points at whichever item is in hand, so the arrow keys run down the list without focus ever
// leaving what is being typed into
function CommandPalette(
    props: CommandPaletteProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        search: searchProp,
        defaultSearch = "",
        onSearchChange,
        value: valueProp,
        defaultValue = "",
        onValueChange,
        onSelect,
        filter = commandScore,
        shouldFilter = true,
        loop = false,
        label = "Command palette",
        className,
        children,
        ...rest
    } = props;

    const listId = useId();
    const labelId = useId();

    // A palette the caller is holding what was typed for takes it from the prop; one that is
    // not keeps its own
    const isSearchControlled = searchProp !== undefined;
    const [selfSearch, setSelfSearch] = React.useState(defaultSearch);
    const search = isSearchControlled ? searchProp : selfSearch;

    const isValueControlled = valueProp !== undefined;
    const [selfValue, setSelfValue] = React.useState(defaultValue);
    const held = isValueControlled ? valueProp : selfValue;

    // The items are not known until they have drawn themselves, since an item can be written
    // anywhere inside the palette and says what it is called by its own text
    const [entries, setEntries] = React.useState<CommandPaletteEntry[]>([]);

    const register = React.useCallback((entry: CommandPaletteEntry) => {
        setEntries((current) => [...current.filter((item) => item.value !== entry.value), entry]);
    }, []);

    const unregister = React.useCallback((value: string) => {
        setEntries((current) => current.filter((item) => item.value !== value));
    }, []);

    const scores = React.useMemo(() => {
        const ranked: Record<string, number> = {};

        for (const entry of entries) {
            ranked[entry.value] = shouldFilter ? filter(entry.value, search, entry.keywords) : 1;
        }

        return ranked;
    }, [entries, filter, search, shouldFilter]);

    const order = React.useMemo(() => rankEntries(entries, scores), [entries, scores]);

    // An item that cannot be picked is still shown, but the arrows step over it rather than
    // stopping on something there is nothing to do with
    const navigable = React.useMemo(
        () => order.filter((value) => !entries.find((entry) => entry.value === value)?.disabled),
        [entries, order],
    );

    // The item in hand follows the list: where what was typed has left it out, the best answer
    // standing takes its place
    const value = navigable.includes(held) ? held : (navigable[0] ?? "");
    const activeId = entries.find((entry) => entry.value === value)?.id;

    const setValue = React.useCallback(
        (next: string) => {
            if (!isValueControlled) {
                setSelfValue(next);
            }

            onValueChange?.(next);
        },
        [isValueControlled, onValueChange],
    );

    // The caller is told when the item in hand changes underneath them, which is what happens
    // as the list narrows around whatever they were on
    const announced = React.useRef(value);

    React.useEffect(() => {
        if (announced.current !== value) {
            announced.current = value;
            onValueChange?.(value);
        }
    }, [onValueChange, value]);

    const setSearch = React.useCallback(
        (next: string) => {
            if (!isSearchControlled) {
                setSelfSearch(next);
            }

            onSearchChange?.(next);
        },
        [isSearchControlled, onSearchChange],
    );

    const handleSelect = React.useCallback(
        (picked: string) => {
            onSelect?.(picked);
        },
        [onSelect],
    );

    const move = (step: number) => {
        if (navigable.length === 0) {
            return;
        }

        const at = navigable.indexOf(value);
        const next = at + step;
        const landing = loop
            ? (next + navigable.length) % navigable.length
            : Math.min(Math.max(next, 0), navigable.length - 1);

        setValue(navigable[landing]);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) {
            return;
        }

        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            // Taking the event keeps the caret in the field from running to either end of what
            // was typed while the reader is going down the list
            event.preventDefault();
            move(event.key === "ArrowDown" ? 1 : -1);

            return;
        }

        if (event.key === "Enter" && value !== "") {
            event.preventDefault();
            handleSelect(value);
        }
    };

    const context = React.useMemo(
        () => ({
            search,
            setSearch,
            value,
            activeId,
            setValue,
            order,
            entries,
            scores,
            register,
            unregister,
            onSelect: handleSelect,
            listId,
            labelId,
            shouldFilter,
        }),
        [
            activeId,
            entries,
            handleSelect,
            labelId,
            listId,
            order,
            register,
            scores,
            search,
            setSearch,
            setValue,
            shouldFilter,
            unregister,
            value,
        ],
    );

    return (
        <CommandPaletteContext.Provider value={context}>
            <div
                ref={ref}
                className={classNames(classes.root, className)}
                onKeyDown={handleKeyDown}
                data-component="CommandPalette"
                {...rest}
            >
                <span id={labelId} className={classes.hidden}>
                    {label}
                </span>
                {children}
            </div>
        </CommandPaletteContext.Provider>
    );
}

CommandPalette.displayName = "CommandPalette";

export default fixedForwardRef(CommandPalette);
