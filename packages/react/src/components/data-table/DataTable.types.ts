import type * as React from "react";
import type { ResponsiveValue } from "../../hooks/useResponsive";
import type { PolymorphicProps } from "../../utilities/polymorphic";

// Every row has to be told apart from the others, so the table can key them and keep their
// order as it sorts
export type UniqueRow = {
    id: string | number;
};

// An array type whose members are each their own index, used to bound `ObjectPaths` below
type ArrayOfLength<
    Length extends number,
    Sized extends unknown[] = [],
> = Sized["length"] extends Length ? Sized : ArrayOfLength<Length, [...Sized, Sized["length"]]>;

// The longest array `ObjectPaths` will walk into. Without a bound, a boundless array would
// take every number as a path
type MaxLength = ArrayOfLength<10>[number];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ArrayIndex<A extends ReadonlyArray<any>, Keys extends number = never> = A extends readonly []
    ? Keys
    : A extends readonly [infer _, ...infer Tail]
      ? ArrayIndex<Tail, Keys | Tail["length"]>
      : Keys;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ArrayWithinBounds<T> = T extends ReadonlyArray<any> & { length: infer Length }
    ? Length extends MaxLength
        ? T
        : never
    : never;

// Every path into an object, written the way a field is: `a`, `a.b`, `a.b.c`
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ObjectPaths<T> = T extends readonly any[] & ArrayWithinBounds<T>
    ? `${ArrayIndex<T>}` | PrefixPath<T, ArrayIndex<T>>
    : // eslint-disable-next-line @typescript-eslint/no-explicit-any
      T extends any[]
      ? never & "Unable to determine the keys of a boundless array"
      : T extends Date
        ? never
        : T extends object
          ? Extract<keyof T, string | number> | PrefixPath<T, Extract<keyof T, string | number>>
          : never;

type PrefixPath<T, Prefix> =
    Prefix extends Extract<keyof T, number | string>
        ? `${Prefix}.${ObjectPaths<T[Prefix]>}`
        : never;

// The type of the value a path leads to
export type ObjectPathValue<ObjectType extends object, Path extends string | number> =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ObjectType extends Record<string | number, any>
        ? Path extends `${infer Key}.${infer NestedPath}`
            ? ObjectPathValue<ObjectType[Key], NestedPath>
            : ObjectType[Path]
        : never;

// A sorted table always has exactly one column in a direction other than "NONE"
export type SortDirection = "ASC" | "DESC" | "NONE";

export type SortStrategyName = "alphanumeric" | "basic" | "datetime";

// A strategy of the caller's own, which compares whole rows rather than single fields
export type CustomSortStrategy<Data> = (a: Data, b: Data) => number;

export type CellAlignment = "start" | "end";

// - "grow": fills the room left over, and never narrower than its widest cell
// - "growCollapse": fills the room left over, and may shrink below its widest cell
// - "auto": as wide as its widest cell. A column whose content varies in length will shift
//   the layout as it changes
// - anything else: exactly that width, neither growing nor shrinking
export type ColumnWidth = "grow" | "growCollapse" | "auto" | React.CSSProperties["width"];

export type TableCellPadding = "condensed" | "normal" | "spacious";

export type Column<Data extends UniqueRow> = {
    // Identifies the column. Falls back to `field` where there is one
    id?: string;
    // Rendered as the column's header. A function where the header is more than text
    header: string | (() => React.ReactNode);
    // Which value in a row the column shows. A path such as `a.b.c` reaches into nested
    // objects. Leave it out only where `renderCell` builds the cell from the whole row
    field?: ObjectPaths<Data>;
    align?: CellAlignment;
    width?: ColumnWidth;
    minWidth?: React.CSSProperties["minWidth"];
    maxWidth?: React.CSSProperties["maxWidth"];
    // Builds the cell from the whole row, in place of showing the field as it stands
    renderCell?: (data: Data) => React.ReactNode;
    // Names the row to a screen reader, the way a header names a column
    rowHeader?: boolean;
    // Whether the table can be sorted by this column, and how its values compare
    sortBy?: boolean | SortStrategyName | CustomSortStrategy<Data>;
};

export type DataTableProps<Data extends UniqueRow> = {
    data: Data[];
    columns: Column<Data>[];
    cellPadding?: TableCellPadding;
    // The id or field of the column the data arrives sorted by, which must already be in
    // ascending order
    initialSortColumn?: ObjectPaths<Data> | string | number;
    initialSortDirection?: Exclude<SortDirection, "NONE">;
    // Leaves the sorting to the caller, who is expected to hand back sorted data. The
    // headers still report every toggle
    externalSorting?: boolean;
    // Tells the rows apart, in place of the `id` field
    getRowId?: (rowData: Data) => string | number;
    // Called every time a sortable header is toggled, with the column now sorted and the
    // direction it is sorted in
    onToggleSort?: (
        columnId: ObjectPaths<Data> | string | number,
        direction: Exclude<SortDirection, "NONE">,
    ) => void;
    "aria-labelledby"?: string;
    "aria-describedby"?: string;
};

export type TableProps = React.ComponentPropsWithoutRef<"table"> & {
    cellPadding?: TableCellPadding;
    // The grid template the columns are laid out on, worked out from their widths
    gridTemplateColumns?: React.CSSProperties["gridTemplateColumns"];
    "aria-labelledby"?: string;
    "aria-describedby"?: string;
    className?: string;
};

export type TableHeadProps = React.ComponentPropsWithoutRef<"thead"> & {
    className?: string;
};

export type TableBodyProps = React.ComponentPropsWithoutRef<"tbody"> & {
    className?: string;
};

export type TableRowProps = React.ComponentPropsWithoutRef<"tr"> & {
    className?: string;
};

// The native `align` attribute is dropped in favour of the column's own alignment
export type TableHeaderProps = Omit<React.ComponentPropsWithoutRef<"th">, "align"> & {
    align?: CellAlignment;
    className?: string;
};

export type TableSortHeaderProps = TableHeaderProps & {
    direction: SortDirection;
    // Called when the header is pressed, whether by pointer or by keyboard
    onToggleSort: () => void;
};

export type TableCellProps = Omit<React.ComponentPropsWithoutRef<"td">, "align"> & {
    align?: CellAlignment;
    // A cell scoped to its row names that row, the way a header names a column
    scope?: "row";
    className?: string;
};

export type TableCellPlaceholderProps = React.ComponentPropsWithoutRef<"span"> & {
    className?: string;
};

export type TableContainerProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        className?: string;
    }
>;

export type TableTitleProps<As extends React.ElementType = "h2"> = PolymorphicProps<
    As,
    "h2",
    {
        // Named so the table can point `aria-labelledby` at it
        id: string;
        className?: string;
    }
>;

export type TableSubtitleProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        // Named so the table can point `aria-describedby` at it
        id: string;
        className?: string;
    }
>;

export type TableActionsProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};

export type TableDividerProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};

export type TableSkeletonProps<Data extends UniqueRow> = React.ComponentPropsWithoutRef<"table"> & {
    columns: Column<Data>[];
    cellPadding?: TableCellPadding;
    // How many rows of placeholder text to stand in for the data
    rows?: number;
    className?: string;
};

export type TablePaginationState = {
    pageIndex: number;
};

// The native `onChange` is dropped so it cannot intersect with the pagination's own, which
// reports the page rather than an event
export type TablePaginationProps = Omit<React.ComponentPropsWithoutRef<"nav">, "onChange"> & {
    // Names the navigation landmark
    "aria-label": string;
    totalCount: number;
    pageSize?: number;
    defaultPageIndex?: number;
    onChange?: (state: TablePaginationState) => void;
    // Whether the page numbers stand between the two steps, and at which viewports
    showPages?: boolean | ResponsiveValue<boolean>;
    className?: string;
};

export type TableErrorDialogProps = React.PropsWithChildren<{
    title?: string;
    // Called when the reader asks to try again
    onRetry?: () => void;
    // Called when the reader dismisses the dialog
    onDismiss?: () => void;
}>;
