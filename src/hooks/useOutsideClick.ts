import { useEffect, useRef } from 'react';

export function useOutsideClick(
  handler: () => void,
  listenCapturing: boolean = true
) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
        handler();
      }
    }

    document.addEventListener('click', handleClick, listenCapturing);

    return () => {
      document.removeEventListener('click', handleClick, listenCapturing);
    };
  }, [handler, listenCapturing]);

  return { ref };
}
