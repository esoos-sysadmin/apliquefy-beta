import { useSyncExternalStore } from "react";

type Listener = () => void;
type Updater<T> = T | ((state: T) => T);

export function createStore<T>(initialState: T) {
    let state = initialState;
    const listeners = new Set<Listener>();

    const getState = () => state;

    const setState = (updater: Updater<T>) => {
        state =
            typeof updater === "function"
                ? (updater as (currentState: T) => T)(state)
                : updater;

        listeners.forEach((listener) => listener());
    };

    const subscribe = (listener: Listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    };

    const useStore = <Selected,>(selector: (state: T) => Selected) =>
        useSyncExternalStore(subscribe, () => selector(getState()), () => selector(initialState));

    return {
        getState,
        setState,
        subscribe,
        useStore,
    };
}
