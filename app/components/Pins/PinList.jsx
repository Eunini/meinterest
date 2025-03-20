import React, { useEffect, useState } from "react";
import PinItem from "./PinItem";

function PinList({ listOfPins }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust time as needed
  }, []);

  return (
    <div
      className="mt-7 px-2 md:px-5
     columns-2 md:columns-3
     lg:columns-4 mb-4
     xl:columns-5 space-y-6 mx-auto"
    >
      {loading
        ? // Render Skeleton while loading
          Array(15)
            .fill(0)
            .map((_, index) => <SkeletonPin key={index} />)
        : // Render Pins when loaded
          listOfPins.map((item, index) => <PinItem key={index} pin={item} />)}
    </div>
  );
}

// Skeleton component for loading state with varying heights
const SkeletonPin = () => {
  // Create random heights to mimic Pinterest's variable card sizes
  const getRandomHeight = () => {
    // Pinterest-like proportions - some shorter, some taller
    const heights = [150, 180, 220, 250, 280, 320, 350];
    return heights[Math.floor(Math.random() * heights.length)];
  };
  
  const height = getRandomHeight();
  
  return (
    <div 
      className="bg-gray-200 animate-pulse rounded-lg w-full mb-4 overflow-hidden"
      style={{ height: `${height}px` }}
    >
      {/* Optional: Add skeleton for pin details */}
      <div className="absolute bottom-0 w-full p-3">
        <div className="h-3 bg-gray-300 rounded-full w-2/3 mb-2"></div>
        <div className="h-2 bg-gray-300 rounded-full w-1/2"></div>
      </div>
    </div>
  );
};

export default PinList;