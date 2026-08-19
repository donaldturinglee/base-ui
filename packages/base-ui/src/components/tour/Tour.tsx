import * as React from "react";
import { useId } from "../../hooks/useId";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { useOnEscapePress } from "../../hooks/useOnEscapePress";
import { TourContext } from "./TourContext";
import type {
    TourApi,
    TourContextValue,
    TourProps,
    TourRect,
    TourStep,
    TourStepEffectArgs,
    TourStepType,
    TourStepUpdate,
} from "./Tour.types";

// How far the spotlight stands clear of what it picks out, so the target is ringed rather than
// hemmed in
export const DEFAULT_SPOTLIGHT_OFFSET = 4;

// The corners of the spotlight, which are rounded a little more than a control's own so the
// ring reads as drawn around the target rather than as part of it
export const DEFAULT_SPOTLIGHT_RADIUS = 8;

// Which of the three a step is where it does not say: one that points at something stands
// against it, and one that points at nothing stands in the middle of the screen
const resolveStepType = (step: TourStep | null): TourStepType => {
    if (!step) {
        return "dialog";
    }

    return step.type ?? (step.target ? "tooltip" : "dialog");
};

// Whether a step is drawn the moment it is reached. Only one carrying an effect stays back, and
// only because an effect is the one thing that can ask for it to be drawn later
const isReadyAtOnce = (step: TourStep | null) => step !== null && step.effect === undefined;

const isSameRect = (one: TourRect, other: TourRect) =>
    one.top === other.top &&
    one.left === other.left &&
    one.width === other.width &&
    one.height === other.height;

// How far the step being read has got, held against the step it belongs to so that what it says
// is only taken while it is still speaking about that step
type TourReading = {
    stepId: string | null;
    ready: boolean;
    patch: TourStepUpdate | null;
};

// A way through a feature, read one step at a time, where each step points at the part of the
// page it is speaking about:
//
//     <Tour steps={steps} open={open} onOpenChange={setOpen}>
//         <Tour.Backdrop />
//         <Tour.Spotlight />
//         <Tour.Positioner>
//             <Tour.Content>
//                 <Tour.Arrow />
//                 <Tour.CloseTrigger />
//                 <Tour.ProgressText />
//                 <Tour.Title />
//                 <Tour.Description />
//                 <Tour.Control>
//                     <Tour.Actions>
//                         {(actions) =>
//                             actions.map((action) => (
//                                 <Tour.ActionTrigger key={action.label} action={action} />
//                             ))
//                         }
//                     </Tour.Actions>
//                 </Tour.Control>
//             </Tour.Content>
//         </Tour.Positioner>
//     </Tour>
//
// The steps are given as data rather than written out as elements, since a tour speaks about
// parts of the page that are nowhere near it in the tree and often not on it at all yet. Each
// step names what it points at by asking for it rather than holding it, so the element is
// looked for when the step is reached.
//
// The tour draws nothing of its own: it holds where the reader has come to and hands it down,
// and the parts below draw the dim, the ring around the target and the surface that speaks
function Tour(props: TourProps) {
    const {
        steps,
        step: stepProp,
        defaultStep = null,
        onStepChange,
        open: openProp,
        defaultOpen = false,
        onOpenChange,
        onStatusChange,
        keyboardNavigation = false,
        closeOnEscape = true,
        closeOnInteractOutside = true,
        spotlightOffset = DEFAULT_SPOTLIGHT_OFFSET,
        spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
        id: idProp,
        children,
    } = props;

    const id = useId(idProp);
    const titleId = `${id}-title`;
    const descriptionId = `${id}-description`;

    const contentRef = React.useRef<HTMLDivElement>(null);

    /* Where the reader has come to */

    // A tour the caller is holding takes whether it is open and which step is being read from
    // the props; one that is not keeps its own
    const isOpenControlled = openProp !== undefined;
    const [selfOpen, setSelfOpen] = React.useState(defaultOpen);
    const open = isOpenControlled ? openProp : selfOpen;

    const isStepControlled = stepProp !== undefined;
    const [selfStep, setSelfStep] = React.useState(defaultStep);
    const stepId = isStepControlled ? stepProp : selfStep;

    const count = steps.length;
    const stepIndex = steps.findIndex((item) => item.id === stepId);
    const definition = stepIndex === -1 ? null : steps[stepIndex];

    const changeStep = React.useCallback(
        (next: string | null) => {
            if (!isStepControlled) {
                setSelfStep(next);
            }

            onStepChange?.({
                stepId: next,
                stepIndex: steps.findIndex((item) => item.id === next),
                count: steps.length,
            });
        },
        [isStepControlled, onStepChange, steps],
    );

    const changeOpen = React.useCallback(
        (next: boolean) => {
            if (!isOpenControlled) {
                setSelfOpen(next);
            }

            onOpenChange?.(next);
        },
        [isOpenControlled, onOpenChange],
    );

    /* The ways through it */

    const start = React.useCallback(
        (from?: string) => {
            const landing = from ?? steps[0]?.id ?? null;

            changeStep(landing);
            changeOpen(true);
            onStatusChange?.({ status: "started" });
        },
        [changeOpen, changeStep, onStatusChange, steps],
    );

    const goto = React.useCallback(
        (to: string) => {
            if (!steps.some((item) => item.id === to)) {
                return;
            }

            changeStep(to);
        },
        [changeStep, steps],
    );

    // Closing puts the tour back to no step at all, so that starting it again begins at the
    // beginning rather than wherever it was left
    const close = React.useCallback(() => {
        changeStep(null);
        changeOpen(false);
    }, [changeOpen, changeStep]);

    const dismiss = React.useCallback(() => {
        close();
        onStatusChange?.({ status: "dismissed" });
    }, [close, onStatusChange]);

    // Stepping past the last of them is how a tour is finished, which is worth telling apart
    // from a tour that was closed part way through
    const next = React.useCallback(() => {
        const following = steps[stepIndex + 1];

        if (!following) {
            close();
            onStatusChange?.({ status: "completed" });
            return;
        }

        changeStep(following.id);
    }, [changeStep, close, onStatusChange, stepIndex, steps]);

    const prev = React.useCallback(() => {
        const preceding = stepIndex > 0 ? steps[stepIndex - 1] : undefined;

        if (!preceding) {
            return;
        }

        changeStep(preceding.id);
    }, [changeStep, stepIndex, steps]);

    /* What the step being read is */

    // Whether the step is ready to be drawn, and whatever its effect has since written into it.
    // One carrying an effect stays back until the effect says so, which is what lets a step wait
    // for something to happen on the page before it speaks.
    //
    // Both are held against the step they belong to, so that reading them can be told apart from
    // reading what the step before was left with
    const [reading, setReading] = React.useState<TourReading>(() => ({
        stepId,
        ready: isReadyAtOnce(definition),
        patch: null,
    }));

    // Put back while rendering rather than in an effect afterwards, so that a step carrying one
    // is never drawn for a frame before its effect has had a say
    if (reading.stepId !== stepId) {
        setReading({ stepId, ready: isReadyAtOnce(definition), patch: null });
    }

    // The state is a render behind while it is being put back, so what it says is only taken
    // where it is still speaking about the step being read
    const sameStep = reading.stepId === stepId ? reading : null;
    const ready = sameStep?.ready ?? isReadyAtOnce(definition);
    const patch = sameStep?.patch ?? null;

    const step = React.useMemo(
        () => (definition && patch ? { ...definition, ...patch } : definition),
        [definition, patch],
    );

    const stepType = resolveStepType(step);

    // The step's own effect, and the ways of moving the tour it is handed, read through a ref so
    // that they keep the same identity as the tour moves. Without this a caller writing their
    // steps out inline — a fresh set of functions on every render — would have the effect of the
    // step they are on torn down and run again underneath them.
    //
    // It is kept up to date before the browser paints rather than after, since what the step
    // points at is measured before then and has to be measured against the step being read
    const latest = React.useRef({ next, prev, goto, dismiss, step: definition });

    useIsomorphicLayoutEffect(() => {
        latest.current = { next, prev, goto, dismiss, step: definition };
    });

    const effectArgs = React.useMemo<TourStepEffectArgs>(
        () => ({
            next: () => latest.current.next(),
            prev: () => latest.current.prev(),
            goto: (to: string) => latest.current.goto(to),
            dismiss: () => latest.current.dismiss(),
            // A step that has since been left is past being shown or written into, so anything
            // its effect was still waiting on is dropped rather than laid over the step that
            // took its place
            show: () =>
                setReading((held) => (held.stepId === stepId ? { ...held, ready: true } : held)),
            update: (details: TourStepUpdate) =>
                setReading((held) =>
                    held.stepId === stepId
                        ? { ...held, patch: { ...held.patch, ...details } }
                        : held,
                ),
            target: () => latest.current.step?.target?.() ?? null,
        }),
        [stepId],
    );

    React.useEffect(() => {
        if (!open) {
            return;
        }

        return latest.current.step?.effect?.(effectArgs) ?? undefined;
    }, [effectArgs, open]);

    /* What the step points at */

    const getTarget = React.useCallback(() => latest.current.step?.target?.() ?? null, []);

    const [targetRect, setTargetRect] = React.useState<TourRect | null>(null);

    const measure = React.useCallback(() => {
        const element = getTarget();

        if (!element) {
            setTargetRect(null);
            return;
        }

        const { top, left, width, height } = element.getBoundingClientRect();
        const measured = { top, left, width, height };

        // Only a target that has actually moved is worth rendering the parts drawn around it
        // again for
        setTargetRect((current) => (current && isSameRect(current, measured) ? current : measured));
    }, [getTarget]);

    // Measured before the browser paints, so the ring and the surface are never seen standing
    // anywhere but against the target
    useIsomorphicLayoutEffect(() => {
        if (!open || !ready) {
            setTargetRect(null);
            return;
        }

        measure();

        const element = getTarget();

        // The reader is taken to what the step points at, since a step speaking about something
        // off the screen says nothing. jsdom has no scrolling to do, and no method to call
        element?.scrollIntoView?.({ block: "center", inline: "nearest" });

        // The target moves whenever the page is laid out again, and changes size with whatever
        // it is holding
        const observer = new ResizeObserver(measure);

        if (element) {
            observer.observe(element);
        }

        window.addEventListener("resize", measure);
        // Caught on the way down, so that a target standing in a scrolling region is followed
        // as the region is scrolled rather than only the page
        window.addEventListener("scroll", measure, true);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", measure);
            window.removeEventListener("scroll", measure, true);
        };
    }, [getTarget, measure, open, ready, stepId]);

    /* The ways out of it */

    useOnEscapePress((event) => {
        if (!open || !closeOnEscape) {
            return;
        }

        // Taking the event keeps a layer the tour was opened over from answering as well
        event.preventDefault();
        dismiss();
    });

    // A step that is still waiting has nothing on the screen, so the keys are left to the page
    // underneath rather than taken by a tour with nothing to step through
    React.useEffect(() => {
        if (!open || !ready || !keyboardNavigation) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.defaultPrevented) {
                return;
            }

            if (event.key === "ArrowRight") {
                event.preventDefault();
                next();
            } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                prev();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [keyboardNavigation, next, open, prev, ready]);

    // Only once the step is being read, for the same reason: while it waits there is nothing on
    // the screen for a press to have landed outside of, and what a step waits for is often the
    // reader pressing something elsewhere on the page
    React.useEffect(() => {
        if (!open || !ready || !closeOnInteractOutside) {
            return;
        }

        const handlePress = (event: MouseEvent | TouchEvent) => {
            // An auxiliary button — the right one, or the wheel — is not reaching for
            // anything, so it is left alone
            if (event instanceof MouseEvent && event.button > 0) {
                return;
            }

            const { target: pressed } = event;

            if (!(pressed instanceof Node)) {
                return;
            }

            // A press on the surface is the reader reading it, and a press on the very thing
            // the step is speaking about is the reader doing what the step asked of them.
            // Neither is a press outside the tour
            if (contentRef.current?.contains(pressed) || getTarget()?.contains(pressed)) {
                return;
            }

            dismiss();
        };

        document.addEventListener("mousedown", handlePress);
        document.addEventListener("touchstart", handlePress);

        return () => {
            document.removeEventListener("mousedown", handlePress);
            document.removeEventListener("touchstart", handlePress);
        };
    }, [closeOnInteractOutside, dismiss, getTarget, open, ready]);

    // Focus is handed back to whatever held it before the tour opened, since the reader was
    // somewhere on the page before they were taken through it
    React.useEffect(() => {
        if (!open) {
            return;
        }

        const returning = document.activeElement;

        return () => {
            if (returning instanceof HTMLElement) {
                returning.focus();
            }
        };
    }, [open]);

    /* What the parts are handed */

    const api = React.useMemo<TourApi>(
        () => ({
            open,
            step,
            stepIndex,
            steps,
            start,
            next,
            prev,
            goto,
            dismiss,
            progressText: `${stepIndex + 1} of ${count}`,
            progressPercent: count === 0 ? 0 : ((stepIndex + 1) / count) * 100,
            hasNext: stepIndex > -1 && stepIndex < count - 1,
            hasPrev: stepIndex > 0,
        }),
        [count, dismiss, goto, next, open, prev, start, step, stepIndex, steps],
    );

    const context = React.useMemo<TourContextValue>(
        () => ({
            ...api,
            titleId,
            descriptionId,
            stepType,
            ready,
            targetRect,
            getTarget,
            spotlightOffset,
            spotlightRadius,
            contentRef,
        }),
        [
            api,
            descriptionId,
            getTarget,
            ready,
            spotlightOffset,
            spotlightRadius,
            stepType,
            targetRect,
            titleId,
        ],
    );

    return <TourContext.Provider value={context}>{children}</TourContext.Provider>;
}

Tour.displayName = "Tour";

export default Tour;
