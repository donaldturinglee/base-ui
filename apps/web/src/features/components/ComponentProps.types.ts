// What a page says about the props it documents. It is written on the page itself rather than read
// out of anything the library generates, so the shape is the feature's own and there is nothing
// outside it that has to keep agreeing with it

export type ComponentProp = {
    name: string;
    // The type as the library writes it rather than as it resolves, since what a caller is held
    // to is the name in front of it
    type: string;
    required: boolean;
    description?: string;
    // The values the prop takes, where the type names them one by one rather than describing
    // a shape
    options?: string[];
};

// Props are kept under the type they were declared in rather than flattened into one list, so
// that a part can be told from the component it hangs off
export type ComponentPropGroup = {
    name: string;
    props: ComponentProp[];
};
