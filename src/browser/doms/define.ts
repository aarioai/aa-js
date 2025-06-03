export type NodeSelector = Node | string
export type ElementSelector = Element | string
 
// React.BaseSyntheticEvent
export interface BaseSyntheticEvent<E = object, C = any, T = any> {
    nativeEvent: E;
    currentTarget: C;
    target: T;
    bubbles: boolean;
    cancelable: boolean;
    defaultPrevented: boolean;
    eventPhase: number;
    isTrusted: boolean;
    timeStamp: number;
    type: string;

    preventDefault(): void;

    isDefaultPrevented(): boolean;

    stopPropagation(): void;

    isPropagationStopped(): boolean;

    persist(): void;
}

// React.SyntheticEvent
export interface SyntheticEvent<T = Element, E = Event> extends BaseSyntheticEvent<E, EventTarget & T, EventTarget> {
}
