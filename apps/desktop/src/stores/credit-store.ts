import type { RunnerCreditBalance } from "../../shared/runner-types";
import { createStore } from "./create-store";

type CreditStoreState = {
    creditBalance: RunnerCreditBalance;
    isLoading: boolean;
};

const store = createStore<CreditStoreState>({
    creditBalance: { balance: 0, canSend: false, plan: "free" },
    isLoading: true,
});

export const creditStore = {
    getState: store.getState,

    hydrate(creditBalance: RunnerCreditBalance) {
        store.setState({ creditBalance, isLoading: false });
    },

    setBalance(creditBalance: RunnerCreditBalance) {
        store.setState((state) => ({ ...state, creditBalance }));
    },

    setLoading(isLoading: boolean) {
        store.setState((state) => ({ ...state, isLoading }));
    },
};

export function useCreditStore<T>(selector: (state: CreditStoreState) => T) {
    return store.useStore(selector);
}
