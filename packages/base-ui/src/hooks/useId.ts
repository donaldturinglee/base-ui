import { useId as useReactId } from "react";

export const useId = (id?: string): string => {
    const uniqueId = useReactId();
    if (id) {
        return id;
    }
    return uniqueId;
};
