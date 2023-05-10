import React, { useEffect, useState } from "react";
import Confetti from "react-dom-confetti";

interface ConfettiProps {
  active: boolean;
}

const confettiConfig = {
  angle: 90,
  spread: 360,
  startVelocity: 45,
  elementCount: 70,
  dragFriction: 0.12,
  duration: 3000,
  stagger: 0,
  width: "10px",
  height: "10px",
  perspective: "500px",
  colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
};

const FullScreenConfetti: React.FC<ConfettiProps> = ({ active }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (active) {
      setShowConfetti(true);
      const timer = setTimeout(
        () => setShowConfetti(false),
        confettiConfig.duration
      );
      return () => clearTimeout(timer);
    }
  }, [active]);

  return (
    <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center">
      <Confetti active={showConfetti} config={confettiConfig} />
    </div>
  );
};

export default FullScreenConfetti;
