import {
  Context,
  createContext as createContextOrig,
  PropsWithChildren,
  useContext as useContextOrig,
  useEffect,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
} from 'react';

const createStore = <T,>(value: T) => {
  const listeners = new Set();

  return {
    value,
    subscribe: (l: any) => { listeners.add(l); return () => listeners.delete(l); },
    notify: () => listeners.forEach((l: any) => l()),
  }
}

type Store<T> = ReturnType<typeof createStore<T>>

export const createSelectorContext = <T,>(defaultValue: T) => {
  const context = createContextOrig<Store<T> | null>(null);

  const ProviderOrig = context.Provider;

  //@ts-ignore
  context.Provider = ({
    value,
    children,
  }: PropsWithChildren<{ value: T }>) => {
    const storeRef = useRef<Store<T> | null>(null);

    let store = storeRef.current;

    if (!store) {
      store = createStore(value)

      storeRef.current = store;
    }

    useLayoutEffect(() => {
      if (!Object.is(store?.value, value)) {
        store.value = value;
        store.notify();
      }
    }, [value]);

    return <ProviderOrig value={store}>{children}</ProviderOrig>;
  };

  return context as unknown as Context<T>
}

export const useContextSelector = <T, U>(
  context: ReturnType<typeof createSelectorContext<T>>,
  selector: (value: T) => U
) => {
  const value = useContextOrig(context)

  if (!value) {
    throw new Error('useContextSelector must be used within a Provider');
  }

  const store = value as unknown as Store<T>

  if (!store.subscribe) {
    throw new Error('context must be made by createSelectorContext');
  }

  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.value),
  );
};
