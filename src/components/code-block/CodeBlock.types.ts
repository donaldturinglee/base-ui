import type * as React from "react";
import type { BundledLanguage, BundledTheme, SpecialLanguage } from "shiki";
import type { PolymorphicProps } from "../../utilities/polymorphic";

// A grammar shiki carries in its bundle, together with the handful of names that stand for no
// grammar at all. The grammars are fetched by name as they are asked for, so a name outside
// the bundle is a name nothing could be fetched under
export type CodeBlockLanguage = BundledLanguage | SpecialLanguage;

// A theme shiki carries in its bundle, fetched by name on the same terms as the grammar above
export type CodeBlockTheme = BundledTheme;

// What becomes of a line too long for the block: it runs on to the next one, or it keeps the
// length it was written at and is left to be scrolled to
export type CodeBlockWrap = "wrap" | "nowrap";

// One run of a line, as the grammar found it. The colours both themes gave the run are custom
// properties rather than a colour, which React's own style type has no room for, so what goes
// onto the element is described by what is actually put in it
export type CodeBlockToken = {
    content: string;
    style?: Record<string, string>;
};

export type CodeBlockLine = CodeBlockToken[];

export type CodeBlockProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        // The grammar every listing in the block is read under
        language?: CodeBlockLanguage;
        // The theme the runs take their colour from under the light scheme
        lightTheme?: CodeBlockTheme;
        // And the one they take it from under the dark scheme
        darkTheme?: CodeBlockTheme;
        // Numbers the lines of every listing in the block
        showLineNumbers?: boolean;
        // Whether a line too long for the block runs on to the next one or is left to be
        // scrolled to
        wrap?: CodeBlockWrap;
        className?: string;
    }
>;

export type CodeBlockHeaderProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        className?: string;
    }
>;

export type CodeBlockTitleProps<As extends React.ElementType = "span"> = PolymorphicProps<
    As,
    "span",
    {
        className?: string;
    }
>;

export type CodeBlockContentProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        className?: string;
    }
>;

export type CodeBlockCodeProps = Omit<React.ComponentPropsWithoutRef<"pre">, "children"> & {
    // The listing itself, as one string. Its line breaks and its indentation are kept as they
    // were written, so what is drawn is what was passed
    children?: string;
    // The grammar this one listing is read under, where it is not the block's own
    language?: CodeBlockLanguage;
    className?: string;
};

export type CodeBlockContextValue = {
    language?: CodeBlockLanguage;
    lightTheme?: CodeBlockTheme;
    darkTheme?: CodeBlockTheme;
    showLineNumbers?: boolean;
    wrap?: CodeBlockWrap;
};
