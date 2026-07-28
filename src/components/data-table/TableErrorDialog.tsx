import * as React from "react";
import { fixedForwardRef } from "../../utilities/polymorphic";
import ConfirmationDialog from "../confirmation-dialog/ConfirmationDialog";
import type { TableErrorDialogProps } from "./DataTable.types";

// Asks whether to try the request again, for a table that could not load its data
function TableErrorDialog(
    props: TableErrorDialogProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { title = "Error", children, onRetry, onDismiss } = props;

    return (
        <ConfirmationDialog
            ref={ref}
            title={title}
            confirmButtonContent="Retry"
            cancelButtonContent="Dismiss"
            onClose={(gesture) => {
                if (gesture === "confirm") {
                    onRetry?.();
                    return;
                }

                onDismiss?.();
            }}
        >
            {children}
        </ConfirmationDialog>
    );
}

TableErrorDialog.displayName = "Table.ErrorDialog";

export default fixedForwardRef(TableErrorDialog);
