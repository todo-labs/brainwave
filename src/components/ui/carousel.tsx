import React, { useState } from "react";
import { ArrowBigLeftDashIcon, ArrowBigRightDashIcon } from "lucide-react";

import { Button } from "./button";

interface CarouselProps<T> {
  items: T[] | undefined;
  renderItem: (item: T) => React.ReactNode;
}

export function Carousel<T>({
  items = [],
  renderItem,
}: CarouselProps<T>): JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((currentIndex - 1 + items.length) % items.length);
  };

  return (
    <section className="flex w-full flex-col">
      {items.length > 1 && (
        <div className="flex justify-between pb-4">
          <Button
            onClick={handlePrev}
            variant="outline"
            disabled={currentIndex === 1}
          >
            <ArrowBigLeftDashIcon />
          </Button>
          <Button
            onClick={handleNext}
            variant="outline"
            disabled={currentIndex === items.length}
          >
            <ArrowBigRightDashIcon />
          </Button>
        </div>
      )}
      <article>
        {items[currentIndex] !== undefined && renderItem(items[currentIndex]!)}
      </article>
    </section>
  );
}