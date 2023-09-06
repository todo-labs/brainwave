import { env } from "@/env.mjs";
import { useEffect, useRef } from "react";
import { Progress } from "./ui/progress";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface TimerProps {
  completed: boolean;
}

const Timer = (props: TimerProps) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [timePassed, setTimePassed] = useLocalStorage<number>("timePassed", 0);

  const setupTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimePassed((prevTimePassed: number) =>
        prevTimePassed > env.NEXT_PUBLIC_MAX_TIME_PER_QUIZ
          ? env.NEXT_PUBLIC_MAX_TIME_PER_QUIZ
          : prevTimePassed + 1
      );
    }, 1000);
  };

  console.log(env.NEXT_PUBLIC_MAX_TIME_PER_QUIZ)

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    const minutesString = minutes.toString().padStart(2, "0");
    const secondsString = seconds.toString().padStart(2, "0");

    return `${minutesString}:${secondsString}`;
  };

  useEffect(() => {
    if (props.completed) {
      setTimePassed(0);
      return;
    }
    setupTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [props.completed]);

  return (
    <div className="my-10 flex w-full items-center justify-center">
      <span className="text-xs font-normal text-muted">
        {formatTime(timePassed)}
      </span>
      <Progress
        value={timePassed}
        max={env.NEXT_PUBLIC_MAX_TIME_PER_QUIZ}
        className="mx-4 w-full"
      />
      <span className="text-xs font-normal">
        {formatTime(env.NEXT_PUBLIC_MAX_TIME_PER_QUIZ)}
      </span>
    </div>
  );
};

export default Timer;
