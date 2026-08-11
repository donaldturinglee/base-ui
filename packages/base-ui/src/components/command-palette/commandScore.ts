// How well one piece of text answers what was typed, from 1 for an outright match down to 0
// for none at all. Everything the palette shows is ranked this way, so the order the items
// come back in is the order they were the best answer in

// Letters that turn up in order but not together, which is what typing the initials of
// something amounts to. The further apart they are, the less it counts for
const scoreLoosely = (text: string, search: string) => {
    let from = 0;
    let gaps = 0;

    for (const letter of search) {
        const at = text.indexOf(letter, from);

        if (at === -1) {
            return 0;
        }

        gaps += at - from;
        from = at + 1;
    }

    return Math.max(0.5 - gaps * 0.01, 0.1);
};

const scoreText = (text: string, search: string) => {
    if (text === search) {
        return 1;
    }

    if (text.startsWith(search)) {
        return 0.9;
    }

    const at = text.indexOf(search);

    if (at > 0) {
        // Landing at the start of a word counts for more than landing in the middle of one
        return /\s|[-_/]/.test(text[at - 1]) ? 0.8 : 0.6;
    }

    return scoreLoosely(text, search);
};

// What an item is worth against what was typed. An item is answered for by its own text and by
// any word the caller has given it to be found under, and takes whichever answers best
export const commandScore = (value: string, search: string, keywords: string[] = []) => {
    const needle = search.trim().toLowerCase();

    // Nothing typed leaves every item as good as every other, so they keep the order they were
    // written in
    if (needle === "") {
        return 1;
    }

    return [value, ...keywords]
        .map((text) => scoreText(text.trim().toLowerCase(), needle))
        .reduce((best, score) => Math.max(best, score), 0);
};
