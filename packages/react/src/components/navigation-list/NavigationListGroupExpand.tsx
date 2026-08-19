import * as React from "react";
import { AddRegular } from "@gamecrafters/base-ui-icons";
import { isValidElementType } from "react-is";
import { useId } from "../../hooks/useId";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { ActionList } from "../action-list";
import NavigationListItem from "./NavigationListItem";
import type {
    NavigationListGroupExpandItem,
    NavigationListGroupExpandProps,
} from "./NavigationList.types";

// A trailing visual is given either as the component to draw, or as something already
// built: an element, or plain text such as a count
const renderTrailingVisual = (visual: NavigationListGroupExpandItem["trailingVisual"]) => {
    if (typeof visual === "string" || !isValidElementType(visual)) {
        return visual as React.ReactNode;
    }

    const Visual = visual;

    return <Visual />;
};

// Holds back the tail of a long group until it is asked for. The items are described
// rather than written out, so that the list can decide how many of them to draw
function NavigationListGroupExpand(
    props: NavigationListGroupExpandProps,
    ref: React.ForwardedRef<HTMLButtonElement>,
) {
    const { label = "Show more", pages = 0, items, renderItem, ...rest } = props;

    const [pagesShown, setPagesShown] = React.useState(0);
    const focusTargetId = useId();

    const perPage = items.length / pages;
    // Asked for no pages, the whole tail is shown at the first press
    const shown = pages === 0 ? items.length : Math.ceil(perPage * pagesShown);
    // The first of the items the last press brought in, which is where a reader who has
    // just asked for more expects to be
    const focusTargetIndex = pagesShown === 1 ? 0 : shown - Math.floor(perPage);

    useIsomorphicLayoutEffect(() => {
        if (pagesShown === 0) {
            return;
        }

        const target = document.querySelector<HTMLElement>(
            `[data-expand-focus-target="${focusTargetId}"]`,
        );

        target?.focus();
    }, [pagesShown, focusTargetId]);

    return (
        <>
            {pagesShown > 0
                ? items.slice(0, shown).map((item, index) => {
                      const {
                          text,
                          leadingVisual: LeadingVisual,
                          trailingVisual,
                          trailingAction,
                          ...itemProps
                      } = item;

                      // Only the first of the newly shown items is reached for, so the
                      // rest are left unmarked
                      const focusTarget = index === focusTargetIndex ? focusTargetId : undefined;

                      if (renderItem) {
                          return renderItem({ ...item, "data-expand-focus-target": focusTarget });
                      }

                      return (
                          <NavigationListItem
                              key={item.id ?? index}
                              data-expand-focus-target={focusTarget}
                              {...itemProps}
                          >
                              {LeadingVisual ? (
                                  <ActionList.LeadingVisual>
                                      <LeadingVisual />
                                  </ActionList.LeadingVisual>
                              ) : null}
                              {text}
                              {trailingVisual ? (
                                  <ActionList.TrailingVisual>
                                      {renderTrailingVisual(trailingVisual)}
                                  </ActionList.TrailingVisual>
                              ) : null}
                              {trailingAction ? (
                                  <ActionList.TrailingAction {...trailingAction} />
                              ) : null}
                          </NavigationListItem>
                      );
                  })
                : null}

            {pagesShown < pages || pagesShown === 0 ? (
                <ActionList.Item
                    ref={ref}
                    as="button"
                    aria-expanded={false}
                    onSelect={() => setPagesShown((page) => page + 1)}
                    data-component="NavigationList.GroupExpand"
                    {...rest}
                >
                    {label}
                    <ActionList.TrailingVisual>
                        <AddRegular />
                    </ActionList.TrailingVisual>
                </ActionList.Item>
            ) : null}
        </>
    );
}

NavigationListGroupExpand.displayName = "NavigationList.GroupExpand";

export default React.forwardRef(NavigationListGroupExpand);
