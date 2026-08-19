import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { Text } from "../text";
import { Pagination } from ".";

export default {
    title: "Components/Pagination/Features",
    parameters: {
        layout: "centered",
    },
};

// Larger Page Count Margin
export const LargerPageCountMargin: StoryFn<typeof Pagination> = () => (
    <Pagination
        pageCount={15}
        currentPage={5}
        marginPageCount={4}
        onPageChange={(event) => event.preventDefault()}
    />
);

// Higher Surrounding Page Count
export const HigherSurroundingPageCount: StoryFn<typeof Pagination> = () => (
    <Pagination
        pageCount={15}
        currentPage={5}
        surroundingPageCount={4}
        onPageChange={(event) => event.preventDefault()}
    />
);

// Hide Page Numbers
export const HidePageNumbers: StoryFn<typeof Pagination> = () => (
    <Pagination
        pageCount={15}
        currentPage={5}
        showPages={false}
        onPageChange={(event) => event.preventDefault()}
    />
);

// Hide Page Numbers By Viewport
export const HidePageNumbersByViewport: StoryFn<typeof Pagination> = () => (
    <>
        <Pagination
            pageCount={15}
            currentPage={5}
            showPages={{ narrow: false }}
            onPageChange={(event) => event.preventDefault()}
        />
        <Text as="p">The page numbers are hidden below the medium breakpoint.</Text>
    </>
);

// Render Pages As Buttons, standing in for a router link
export const RenderPages: StoryFn<typeof Pagination> = () => {
    const [page, setPage] = React.useState(2);

    return (
        <Pagination
            pageCount={15}
            currentPage={page}
            onPageChange={(event, next) => {
                event.preventDefault();
                setPage(next);
            }}
            renderPage={({ key, number, children, ...pageProps }) => (
                <button key={key} type="button" data-page={number} {...pageProps}>
                    {children}
                </button>
            )}
        />
    );
};
