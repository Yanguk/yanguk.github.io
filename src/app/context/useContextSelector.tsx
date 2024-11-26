import {
  createContext as createContextOrig,
  PropsWithChildren,
  useContext as useContextOrig,
  useRef,
  useSyncExternalStore,
} from 'react';

export const createContext = <T = undefined>(defaultValue: T) => {
  const context = createContextOrig<T>(defaultValue);

  const ProviderOrig = context.Provider;

    return {
      ...context,
      Provider: ({ value, children }: PropsWithChildren<{value: T}>) => {
    const storeRef = useRef();

    let store = storeRef.current;

    if (!store) {
      const listeners = new Set();

      store = {
        value,
        subscribe: (l) => { listeners.add(l); return () => listeners.delete(l); },
        notify: () => listeners.forEach((l) => l()),
      }

      storeRef.current = store;
    }

    useEffect(() => {
      if (!Object.is(store.value, value)) {
        store.value = value;
        store.notify();
      }
    });


    return <ProviderOrig value={store}>{children}</ProviderOrig>
      })
    }
  };

  return context;
}

export const useContextSelector = (context, selector) => {
  const store = useContextOrig(context);

  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.value),
  );
};
