// Copying through a selection and a command run over it, which is how it was done before the
// clipboard was something a page could be handed outright. A field cannot be selected unless it
// has been laid out, so it is put out of sight rather than out of the page, and taken away again
// as soon as the command has run
const copyThroughSelection = (value: string): boolean => {
    if (typeof document === "undefined" || typeof document.execCommand !== "function") {
        return false;
    }

    const field = document.createElement("textarea");

    field.value = value;
    field.setAttribute("readonly", "");
    // Fixed rather than absolute, so selecting the field does not scroll the page back to the
    // top of itself to reach it
    field.style.position = "fixed";
    field.style.top = "0";
    field.style.insetInlineStart = "-9999px";
    field.style.opacity = "0";

    // Whatever the reader was on is given back once the command has run, so pressing the trigger
    // does not quietly move them somewhere they cannot see
    const previous = document.activeElement as HTMLElement | null;

    document.body.appendChild(field);
    field.select();

    try {
        return document.execCommand("copy");
    } finally {
        field.remove();
        previous?.focus?.();
    }
};

// Puts text on the clipboard.
//
// The asynchronous clipboard is what a browser offers now, and it is what is reached for first.
// It is only there on a secure origin, though, and a page that was refused it leaves nothing on
// the clipboard at all, so the older way stands behind it rather than in place of it
export const copyText = async (value: string): Promise<void> => {
    if (typeof navigator !== "undefined" && typeof navigator.clipboard?.writeText === "function") {
        try {
            await navigator.clipboard.writeText(value);
            return;
        } catch (error) {
            // A page that was refused the clipboard may still be allowed the older way, and
            // there is nothing to be gained by reporting the refusal until that has been tried
            if (copyThroughSelection(value)) {
                return;
            }

            throw error;
        }
    }

    if (!copyThroughSelection(value)) {
        throw new Error("The clipboard could not be reached");
    }
};
