import type { ReactNode } from "react";

// What a page says about the examples it shows. An example is the one thing said twice: drawn, so
// it can be seen working, and written, so it can be copied out. Neither is worked out from the
// other, since nothing on the page runs what a reader is handed, so the two are written side by
// side and kept in step by hand

export type ComponentExample = {
    name: string;
    // What the example is showing, where the name alone does not say it
    description?: string;
    // The example as it is drawn, which is the component itself rather than a picture of it
    preview: ReactNode;
    // The same example as it is written. It is one string, with its line breaks and its
    // indentation kept as they were written, so what is read is what would have been typed
    code: string;
};
