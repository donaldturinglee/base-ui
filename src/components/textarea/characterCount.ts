// Long enough that a reader hears the count once they pause, rather than on every keystroke
export const SCREEN_READER_DELAY = 500;

export type CharacterCount = {
    // How many characters are left, or how many the limit has been passed by
    count: number;
    isOverLimit: boolean;
    message: string;
};

// Pure, so the counter can be worked out while rendering rather than kept in state
export const getCharacterCount = (length: number, limit: number): CharacterCount => {
    const remaining = limit - length;

    if (remaining >= 0) {
        return {
            count: remaining,
            isOverLimit: false,
            message: `${remaining} ${remaining === 1 ? "character" : "characters"} remaining`,
        };
    }

    const over = -remaining;

    return {
        count: over,
        isOverLimit: true,
        message: `${over} ${over === 1 ? "character" : "characters"} over`,
    };
};
