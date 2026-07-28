import { createRoot } from "react-dom/client";
import ConfirmationDialog from "./ConfirmationDialog";
import type { ConfirmOptions } from "./ConfirmationDialog.types";

// The dialog is put up in a root of its own, hung off the end of the document, so that a
// caller can ask the question from anywhere without holding the dialog in its own tree.
// Nothing of the surrounding tree reaches it, so anything read from context is left at its
// default
const confirm = ({ content, ...props }: ConfirmOptions) =>
    new Promise<boolean>((resolve) => {
        const host = document.createElement("div");

        document.body.append(host);

        const root = createRoot(host);

        root.render(
            <ConfirmationDialog
                {...props}
                onClose={(gesture) => {
                    // React will not take a root down from inside an event of its own, so
                    // the teardown waits for that event to have been handled
                    queueMicrotask(() => {
                        root.unmount();
                        host.remove();
                    });

                    resolve(gesture === "confirm");
                }}
            >
                {content}
            </ConfirmationDialog>,
        );
    });

// Returns a function that puts up a confirmation and resolves with whether it was
// confirmed. The function never changes, so it is safe to depend on
export const useConfirm = () => confirm;
