import type { HighlightChunk, HighlightMatch } from "./Highlight.types";

// The terms as they are looked for: the ones with something in them, longest first, so that a
// term standing inside another still leaves the longer of the two picked out whole
const getTerms = (match: HighlightMatch | undefined) =>
    (typeof match === "string" ? [match] : (match ?? []))
        .filter((term) => term.length > 0)
        .sort((a, b) => b.length - a.length);

// The text broken into the runs the terms stood for and the runs between them. Where no term
// was given, or none of them is anywhere in the text, the text comes back whole and unmatched,
// so that it is drawn exactly as it was written
export const splitHighlightChunks = (
    text: string,
    match?: HighlightMatch,
    caseSensitive = false,
): HighlightChunk[] => {
    const terms = getTerms(match);

    if (text.length === 0) {
        return [];
    }

    if (terms.length === 0) {
        return [{ text, matched: false }];
    }

    // The comparison is made against one folded copy of each rather than folding a run again
    // every time it is reached. The runs themselves are always cut from the text as it came in,
    // so what is drawn keeps the case it was written in
    const haystack = caseSensitive ? text : text.toLowerCase();
    const needles = caseSensitive ? terms : terms.map((term) => term.toLowerCase());

    const chunks: HighlightChunk[] = [];
    let index = 0;
    let unmatchedFrom = 0;

    const pushUnmatched = (until: number) => {
        if (until > unmatchedFrom) {
            chunks.push({ text: text.slice(unmatchedFrom, until), matched: false });
        }
    };

    while (index < text.length) {
        const needle = needles.find((term) => haystack.startsWith(term, index));

        if (needle === undefined) {
            index += 1;
            continue;
        }

        pushUnmatched(index);

        const end = index + needle.length;
        const previous = chunks[chunks.length - 1];

        // Two terms that meet are drawn as one run, since the seam between them would say
        // nothing a reader could see
        if (previous?.matched) {
            previous.text += text.slice(index, end);
        } else {
            chunks.push({ text: text.slice(index, end), matched: true });
        }

        index = end;
        unmatchedFrom = end;
    }

    pushUnmatched(text.length);

    return chunks;
};
