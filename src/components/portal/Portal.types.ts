import type * as React from "react";

export type PortalProps = {
    onMount?: () => void;
    containerName?: string;
    children?: React.ReactNode;
};

export type PortalContextValue = {
    portalContainerName?: string;
};
