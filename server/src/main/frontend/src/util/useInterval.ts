import { useEffect, useRef } from "react";

const useInterval = (callback: () => void, delay: number) => {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => {
      if (typeof savedCallback.current !== "undefined") {
        savedCallback.current();
      }
    };
    if (delay !== null) {
      const intervalId = setInterval(tick, delay);
      return () => clearInterval(intervalId);
    }
  }, [delay]);
};

export default useInterval;
