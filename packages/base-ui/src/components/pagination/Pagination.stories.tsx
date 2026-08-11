import * as React from "react";
import type { StoryFn, Meta } from "@storybook/react-vite";
import { Pagination } from ".";
import type { PaginationProps } from "./Pagination.types";

export default {
    title: "Components/Pagination",
    component: Pagination,
} as Meta<typeof Pagination>;

export const Default: StoryFn<typeof Pagination> = () => {
    const [page, setPage] = React.useState(5);

    return (
        <Pagination
            pageCount={15}
            currentPage={page}
            onPageChange={(event, next) => {
                event.preventDefault();
                setPage(next);
            }}
        />
    );
};

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<PaginationProps> = ({ currentPage, ...args }) => {
    const [page, setPage] = React.useState(currentPage);

    // The control sets the starting page, and clicking through takes over from there
    React.useEffect(() => {
        setPage(currentPage);
    }, [currentPage]);

    return (
        <Pagination
            {...args}
            currentPage={page}
            onPageChange={(event, next) => {
                event.preventDefault();
                setPage(next);
            }}
        />
    );
};

Playground.args = {
    pageCount: 15,
    currentPage: 5,
    marginPageCount: 1,
    surroundingPageCount: 2,
    showPages: true,
};

Playground.argTypes = {
    pageCount: {
        control: {
            type: "number",
            min: 0,
        },
        description: "Total number of pages",
    },
    currentPage: {
        control: {
            type: "number",
            min: 1,
        },
        description: "Page the reader is on",
    },
    marginPageCount: {
        control: {
            type: "number",
            min: 0,
        },
        description: "How many pages stay pinned at each end",
    },
    surroundingPageCount: {
        control: {
            type: "number",
            min: 0,
        },
        description: "How many pages sit either side of the current one",
    },
    showPages: {
        control: {
            type: "boolean",
        },
        description: "Shows the page numbers, or only the previous and next steps",
    },
    ref: {
        table: {
            disable: true,
        },
    },
};

Playground.parameters = {
    layout: "centered",
};
