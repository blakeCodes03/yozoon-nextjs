// src/hooks/useAnimatedCounter.ts

import { useEffect, useState } from 'react';

const useAnimatedCounter = (base: number, target: number) => {
  const [count, setCount] = useState<number>(base);

  useEffect(() => {
    if (base >= target) {
      setCount(target);
      return;
    }

    let current = base;
    const totalDuration = 2000; // Total duration of animation in ms
    const steps = target - base;
    const stepTime = Math.max(Math.floor(totalDuration / steps), 50); // At least 50ms per step

    const timer = setInterval(() => {
      current += 1;
      setCount(current);
      if (current >= target) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [base, target]);

  return count;
};

export default useAnimatedCounter;
