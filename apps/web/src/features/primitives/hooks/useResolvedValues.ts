import * as React from "react";
import { useTheme } from "@gamecrafters/base-ui/react";

// What a token actually resolves to under the scheme in force. A specimen is drawn correctly by
// naming the custom property and nothing more, but the value written beside it is a string React
// has to be given, and there is nowhere to read it from but the document itself.
//
// It is read off an element the section renders rather than off the root, since the attribute the
// scheme is carried on is the one `ThemeProvider` writes and that stands inside the page rather
// than above it. The scheme is a value the provider hands down, so the read is repeated when it
// changes rather than the attribute being watched for
const useResolvedValues = (names: string[]) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const { colorScheme } = useTheme();
    const [values, setValues] = React.useState<Record<string, string>>({});

    React.useEffect(() => {
        const element = ref.current;

        // An effect runs with the ref already filled, but the type it is read through allows for
        // it not to be
        if (!element) {
            return;
        }

        const style = getComputedStyle(element);

        setValues(
            Object.fromEntries(names.map((name) => [name, style.getPropertyValue(name).trim()])),
        );
    }, [names, colorScheme]);

    return [ref, values] as const;
};

export default useResolvedValues;
