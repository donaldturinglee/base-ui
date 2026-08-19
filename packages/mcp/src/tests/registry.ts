import type { Registry } from "../registry/registry.types";

// A registry small enough to read in one go and shaped like the one a build writes: a component
// with parts, a component without, a provider, and tokens of both kinds. What is asked of the
// registry and what is answered out of it are both held to this rather than to the library,
// which is free to change without a suite having to be rewritten around it

export const registry: Registry = {
    package: "@gamecrafters/base-ui",
    import: "@gamecrafters/base-ui/react",
    version: "1.2.3",
    entries: [
        {
            name: "Button",
            directory: "button",
            section: "components",
            exports: ["Button"],
            parts: [],
            types: ["ButtonVariant", "ButtonProps"],
            props: [
                {
                    name: "ButtonProps",
                    inherits: ['ComponentPropsWithRef<"button">'],
                    props: [
                        {
                            name: "variant",
                            type: "ButtonVariant",
                            required: false,
                            description: "How much weight the button carries against the page",
                            options: ["default", "primary"],
                        },
                        {
                            name: "loadingAnnouncement",
                            type: "string",
                            required: false,
                        },
                    ],
                },
            ],
            examples: [
                { title: "Variant Scale", source: "const VariantScale = () => <Button />;" },
                { title: "Loading", source: "const Loading = () => <Button loading />;" },
            ],
        },
        {
            name: "Dialog",
            directory: "dialog",
            section: "components",
            exports: ["Dialog", "DialogHeader"],
            parts: ["Header", "Title"],
            types: ["DialogProps"],
            props: [
                {
                    name: "DialogProps",
                    inherits: [],
                    props: [{ name: "onClose", type: "() => void", required: true }],
                },
            ],
            examples: [],
        },
        {
            name: "ThemeProvider",
            directory: "theme",
            section: "providers",
            exports: ["ThemeProvider", "useTheme"],
            parts: [],
            types: ["ColorMode", "ThemeProviderProps"],
            props: [
                {
                    name: "ThemeProviderProps",
                    inherits: [],
                    props: [
                        {
                            name: "colorMode",
                            type: "ColorModeWithAuto",
                            required: false,
                            description: "Which mode the subtree is in",
                            options: ["day", "night", "auto"],
                        },
                    ],
                },
            ],
            examples: [{ title: "Nested", source: "const Nested = () => <ThemeProvider />;" }],
        },
    ],
    tokens: [
        {
            name: "--base-size-4",
            group: "Base size scale",
            values: { static: "0.25rem" },
        },
        {
            name: "--foreground-color-default",
            group: "foreground",
            description: "The colour body text is set in",
            values: { light: "#1f2328", dark: "#e6edf3" },
        },
    ],
};
