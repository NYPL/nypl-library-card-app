import { useCallback, Ref } from "react";

export function useMergedRef<T>(...refs: Array<Ref<T> | undefined | null>) {
  return useCallback(
    (value: T | null) => {
      refs.forEach((ref) => {
        if (!ref) return;

        if (typeof ref === "function") {
          ref(value);
        } else {
          (ref as any).current = value;
        }
      });
    },
    [...refs]
  );
}
