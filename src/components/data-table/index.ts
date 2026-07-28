import TableBase from "./Table";
import TableActions from "./TableActions";
import TableBody from "./TableBody";
import TableCell from "./TableCell";
import TableCellPlaceholder from "./TableCellPlaceholder";
import TableContainer from "./TableContainer";
import TableDivider from "./TableDivider";
import TableErrorDialog from "./TableErrorDialog";
import TableHead from "./TableHead";
import TableHeader from "./TableHeader";
import TablePagination from "./TablePagination";
import TableRow from "./TableRow";
import TableSkeleton from "./TableSkeleton";
import TableSortHeader from "./TableSortHeader";
import TableSubtitle from "./TableSubtitle";
import TableTitle from "./TableTitle";

export const Table = Object.assign(TableBase, {
    Container: TableContainer,
    Title: TableTitle,
    Subtitle: TableSubtitle,
    Actions: TableActions,
    Divider: TableDivider,
    Skeleton: TableSkeleton,
    Head: TableHead,
    Body: TableBody,
    Header: TableHeader,
    SortHeader: TableSortHeader,
    Row: TableRow,
    Cell: TableCell,
    CellPlaceholder: TableCellPlaceholder,
    Pagination: TablePagination,
    ErrorDialog: TableErrorDialog,
});

export { default as DataTable } from "./DataTable";
export {
    TableContainer,
    TableTitle,
    TableSubtitle,
    TableActions,
    TableDivider,
    TableSkeleton,
    TableHead,
    TableBody,
    TableHeader,
    TableSortHeader,
    TableRow,
    TableCell,
    TableCellPlaceholder,
    TablePagination,
    TableErrorDialog,
};
export { DEFAULT_TABLE_SKELETON_ROWS } from "./TableSkeleton";
export { DEFAULT_TABLE_PAGE_SIZE } from "./TablePagination";
export { createColumnHelper } from "./column";
export { sortStrategies, transitionSortDirection, DEFAULT_SORT_DIRECTION } from "./sorting";
export * from "./DataTable.types";
