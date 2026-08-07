import { NavigationMenuVisualContainer } from "./NavigationMenuVisual";
import type { NavigationMenuVisualProps } from "./NavigationMenu.types";

// An icon, or something like one, standing before the link's label
function NavigationMenuLeadingVisual(props: NavigationMenuVisualProps) {
    return (
        <NavigationMenuVisualContainer data-component="NavigationMenu.LeadingVisual" {...props} />
    );
}

NavigationMenuLeadingVisual.displayName = "NavigationMenu.LeadingVisual";

export default NavigationMenuLeadingVisual;
