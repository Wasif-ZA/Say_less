import { useCallback, useEffect, useRef, useState } from "react";

interface UseCountdownOptions {
  initialSeconds: number;
  onComplete?: () => void;
  autoStart?: boolean;
}

export function useCountdown({
  initialSeconds,
  onComplete,
  autoStart = true,
}: UseCountdownOptions) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;

    const id = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          setIsRunning(false);
          setTimeout(() => onCompleteRef.current?.(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning, secondsLeft]);

  const pause = useCallback(() => setIsRunning(false), []);
  const resume = useCallback(() => {
    if (secondsLeft > 0) setIsRunning(true);
  }, [secondsLeft]);
  const reset = useCallback(
    (s?: number) => {
      setSecondsLeft(s ?? initialSeconds);
      setIsRunning(false);
    },
    [initialSeconds]
  );

  return { secondsLeft, isRunning, pause, resume, reset };
}
