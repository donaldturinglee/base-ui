import type { PageHeaderHidden } from "./PageHeader.types";

// What `hidden` falls back to for a region that is only shown on a narrow viewport
export const hiddenOnRegularAndWide: PageHeaderHidden = {
    narrow: false,
    regular: true,
    wide: true,
};

// What `hidden` falls back to for a region that is only shown from the regular range up
export const hiddenOnNarrow: PageHeaderHidden = {
    narrow: true,
    regular: false,
    wide: false,
};
