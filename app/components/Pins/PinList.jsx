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
          Array(10)
            .fill(0)
            .map((_, index) => <SkeletonPin key={index} />)
        : // Render Pins when loaded
          listOfPins.map((item, index) => <PinItem key={index} pin={item} />)}
    </div>
  );
}

// Skeleton component for loading state
const SkeletonPin = () => {
  return (
    <div className="bg-gray-200 animate-pulse rounded-lg w-full h-[250px]"></div>
  );
};

export default PinList;