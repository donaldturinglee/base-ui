import type { Registry } from "../registry/registry.types";
import { fence, reply } from "./format";
import type { RegisterTool } from "./tools.types";

const DESCRIPTION =
    "What an application does once, before any Base UI component is written into it: the " +
    "package it installs, the stylesheet it imports, and the providers it wraps itself in " +
    "for the design tokens to resolve under. Ask for this first when working against the " +
    "library for the first time in a codebase, since a component drawn without them comes " +
    "out unstyled.";

export const registerGetSetupGuide: RegisterTool = (server, registry) => {
    server.registerTool(
        "get_setup_guide",
        {
            title: "Get the Base UI setup guide",
            description: DESCRIPTION,
        },
        () => reply(guide(registry)),
    );
};

const guide = (registry: Registry): string => {
    const stylesheet = `${registry.package}/main.css`;

    const themed = [
        `import { ThemeProvider } from "${registry.package}";`,
        `import "${stylesheet}";`,
        "",
        "const App = ({ children }: { children: React.ReactNode }) => (",
        '    <ThemeProvider colorMode="auto">{children}</ThemeProvider>',
        ");",
    ].join("\n");

    return [
        `# ${registry.package} ${registry.version}`,
        "An implementation of GameCrafters' Base UI Design System in React. Every component " +
            "is imported by name from the package root, however deep inside the library it " +
            "is written.",

        "## Installing",
        fence("sh", `npm install ${registry.package}`),
        "React and `react-dom` are peer dependencies, asked for as `^18` or `^19` rather " +
            "than carried, so the components are drawn by the copy of React the application " +
            "already has.",

        "## The stylesheet",
        "One stylesheet stands behind the whole library and is imported once, at the root of " +
            "the application. It carries the design tokens both schemes are drawn from, the " +
            "styles every component is drawn by, and the layers those are built on.",
        fence("tsx", `import "${stylesheet}";`),

        "## The theme",
        "The tokens are scoped to `[data-theme]`, so importing the stylesheet is not on its " +
            "own enough: they resolve only once something has set the attribute, which is " +
            "what `ThemeProvider` is for. A component drawn outside one comes out unstyled.",
        fence("tsx", themed),
        "`colorMode` takes `day`, `night` or `auto`, and `auto` follows the operating " +
            "system. A nested `ThemeProvider` only has to say what it changes, so a subtree " +
            "can hold a scheme of its own.",

        "## Reading direction",
        "A subtree that is read right to left is wrapped in a `DirectionProvider`, which " +
            "takes `ltr` or `rtl`.",
        fence("tsx", '<DirectionProvider direction="rtl">{children}</DirectionProvider>'),

        "## Writing against the library",
        [
            "- `list_components` — what the library has, which is worth reading before " +
                "anything is built that it may already hold",
            "- `get_component` — every prop of one of them, with what it is for and the " +
                "values it takes",
            "- `get_component_examples` — the same component as it is already written, " +
                "which settles what nests inside what",
            "- `list_tokens` — the colours, sizes and durations to reach for in place of a " +
                "literal, so that anything written beside the library follows the scheme it " +
                "is already in",
        ].join("\n"),
    ].join("\n\n");
};
