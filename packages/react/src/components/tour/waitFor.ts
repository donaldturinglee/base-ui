// What a step's effect is given back when it waits on something: the promise to hang the rest of
// the step off, and the way to stop waiting where the reader leaves the step before it arrives.
//
// Nothing here ever rejects. A wait that runs out of time settles with nothing instead, so a step
// written the short way — `promise.then(() => next())` — cannot leave a rejection with nobody to
// answer it
export type TourWait<T> = [Promise<T | null>, () => void];

export type TourWaitOptions = {
    // How long to go on waiting before giving up
    timeout?: number;
};

export type TourWaitForEventOptions = AddEventListenerOptions & {
    // Says whether this is the happening that was being waited for, for an event that fires more
    // often than the step cares about
    predicate?: (element: HTMLElement) => boolean;
};

// Long enough for anything a page is fetching or animating into place, short enough that a step
// waiting on something that will never come does not wait for ever
const DEFAULT_TIMEOUT = 10_000;

// Asks again on every frame until the answer is something rather than nothing. Frames are used
// rather than watching the page for changes because what a step waits for is not always a change
// to the page — a field filled in, an element scrolled into view — and a wait that only wakes for
// one kind of change would sleep through the others
const waitFor = <T>(check: () => T | null, { timeout = DEFAULT_TIMEOUT }: TourWaitOptions = {}) => {
    let frame: number | null = null;
    let stopped = false;

    const stop = () => {
        stopped = true;

        if (frame !== null) {
            cancelAnimationFrame(frame);
            frame = null;
        }
    };

    const promise = new Promise<T | null>((resolve) => {
        const deadline = Date.now() + timeout;

        const look = () => {
            if (stopped) {
                return;
            }

            const found = check();

            if (found) {
                stop();
                resolve(found);
                return;
            }

            if (Date.now() >= deadline) {
                stop();
                resolve(null);
                return;
            }

            frame = requestAnimationFrame(look);
        };

        look();
    });

    return [promise, stop] as TourWait<T>;
};

// Waits for something to happen on the element a step points at, which is what a step that asks
// the reader to do something rather than read something needs:
//
//     effect({ next, target, show }) {
//         show();
//         const [pressed, stop] = waitForEvent(target, "click");
//         pressed.then(() => next());
//         return stop;
//     }
export const waitForEvent = <K extends keyof HTMLElementEventMap>(
    target: (() => HTMLElement | null) | undefined,
    event: K,
    options: TourWaitForEventOptions = {},
): TourWait<HTMLElementEventMap[K]> => {
    const { predicate, ...listenerOptions } = options;

    let stop = () => {};

    const promise = new Promise<HTMLElementEventMap[K] | null>((resolve) => {
        const element = target?.();

        // Nothing to listen to is a wait that will never end, so it is ended at once with
        // nothing rather than left hanging
        if (!element) {
            resolve(null);
            return;
        }

        const handler = (happening: HTMLElementEventMap[K]) => {
            if (predicate && !predicate(element)) {
                return;
            }

            stop();
            resolve(happening);
        };

        element.addEventListener(event, handler, listenerOptions);
        stop = () => element.removeEventListener(event, handler, listenerOptions);
    });

    return [promise, () => stop()];
};

// Waits for an element to arrive on the page, for a step speaking about something that is not
// drawn until the step before it has been done
export const waitForElement = (
    query: () => HTMLElement | null,
    options?: TourWaitOptions,
): TourWait<HTMLElement> => waitFor(query, options);

// Waits for a field to hold a given value, for a step that asks the reader to fill something in
export const waitForElementValue = (
    query: () => HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null,
    value: string,
    options?: TourWaitOptions,
): TourWait<HTMLElement> =>
    waitFor(() => {
        const element = query();

        return element && element.value === value ? element : null;
    }, options);
