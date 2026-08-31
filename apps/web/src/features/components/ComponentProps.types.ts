// What a page says about the props it documents. It is written on the page itself rather than read
// out of anything the library generates, so the shape is the feature's own and there is nothing
// outside it that has to keep agreeing with it

export type ComponentProp = {
    name: string;
    // The type as the library writes it rather than as it resolves, since what a caller is held
    // to is the name in front of it
    type: string;
    // Whether the prop has to be given. Only one that has to says so: a prop is optional unless
    // it says otherwise, so the rest are left to say nothing rather than to answer "no", which
    // would be read as a value they carry
    required?: boolean;
    // What the prop comes to where the caller leaves it out, written as it would be given. A prop
    // that takes its value from whatever it stands in has none of its own to name, and neither has
    // one there is nothing to fall back to
    default?: string;
    description?: string;
    // The values the prop takes, where the type names them one by one rather than describing
    // a shape
    options?: string[];
};

// Props are kept under the part that takes them rather than flattened into one list, so that a
// part can be told from the component it hangs off
export type ComponentPropGroup = {
    // The part the props belong to, named as it is reached for rather than as the type they were
    // declared in, since it is the part a reader is looking up
    name: string;
    props: ComponentProp[];
};
