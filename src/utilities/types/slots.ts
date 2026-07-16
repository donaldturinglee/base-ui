export interface SlotMarker {
    __SLOT__?: symbol;
}

export type WithSlotMarker<T> = T & SlotMarker;

export type FCWithSlotMarker<P> = WithSlotMarker<React.FC<P>>;
