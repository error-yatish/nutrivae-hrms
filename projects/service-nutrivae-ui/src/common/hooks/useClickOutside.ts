import { useEffect, type RefObject } from "react";

export function useClickOutside<T extends Node>(
  refs: Array<RefObject<T> | null | undefined>,
  handler: (event: MouseEvent) => void,
  when = true
) {
  useEffect(() => {
    if (!when) return;
    const listener = (event: MouseEvent) => {
      const target = event.target as Node;
      const isInside = refs.some((ref) => ref?.current?.contains(target));
      if (!isInside) handler(event);
    };

    document.addEventListener("mousedown", listener, true);
    return () => document.removeEventListener("mousedown", listener, true);
  }, [handler, when, refs]);
}
