// What the server answers from. The design system already says everything about itself in its
// own sources, but a source tree is not what a question is answered against, so the sources are
// read once at the end of a build into the shape below and nothing is parsed again afterwards

// Where an entry was read from, which is also how it is reached: a component is drawn, and a
// provider is wrapped around the subtree that reads it
export type RegistrySection = "components" | "providers";

export type RegistryProp = {
    name: string;
    // The type as the library writes it rather than as it resolves, since what a caller is
    // held to is the name in front of it
    type: string;
    required: boolean;
    // The comment the prop was written under, or the description its playground control
    // carries where the type file left it unsaid
    description?: string;
    // The values the prop takes, where the type names them one by one rather than describing
    // a shape
    options?: string[];
};

// Props are kept under the type they were declared in rather than flattened into one list, so
// that a part can be told from the component it hangs off
export type RegistryProps = {
    name: string;
    props: RegistryProp[];
    // What the type reached for that the library did not declare itself, carried as it was
    // written: the props of the element being drawn, most of the time
    inherits: string[];
};

export type RegistryExample = {
    // The story's name said as words, taken from the comment above it where it has one
    title: string;
    source: string;
};

export type RegistryEntry = {
    name: string;
    // The directory the entry is written in, which its stylesheet is named after too
    directory: string;
    section: RegistrySection;
    // What the package exports for the entry, the entry itself first
    exports: string[];
    // What is hung off the entry rather than exported beside it, reached as `Dialog.Header`
    parts: string[];
    // The types the entry is written against, which a caller types its own props with
    types: string[];
    props: RegistryProps[];
    examples: RegistryExample[];
};

// A primitive holds the same value whichever scheme is in force, so it is kept once rather
// than answered by a second copy of itself
export type RegistryTokenScheme = "static" | "light" | "dark";

export type RegistryToken = {
    name: string;
    // The comment the token was written under where the stylesheet groups them, and otherwise
    // the namespace its name starts with
    group: string;
    description?: string;
    values: Partial<Record<RegistryTokenScheme, string>>;
};

export type Registry = {
    // The package an application installs, and the version it was read at
    package: string;
    version: string;
    entries: RegistryEntry[];
    tokens: RegistryToken[];
};
