import React, { useEffect, useState } from "react";
import PinItem from "./PinItem";
import { useSession } from "next-auth/react";

function PinList({ listOfPins = [], searchResults = [], profileUserId = null, profileUser = null }) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (profileUserId && session?.user) {
      setIsOwner(session.user.email === profileUser?.email);
    } else {
      setIsOwner(false);
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [profileUserId, session, profileUser]);

  // Determine which list to display (search results take priority)
  const displayedPins = searchResults.length > 0 ? searchResults : listOfPins;

  // Sort pins by `createdAt` in descending order (newest first)
  const sortedPins = displayedPins
    .slice()
    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

  if (!loading && sortedPins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <p className="text-xl font-medium mb-2 text-gray-500">No pins found</p>
        {profileUserId && isOwner && <p>Create your first pin to get started!</p>}
      </div>
    );
  }

  return (
    <div className="mt-7 px-2 md:px-5 columns-2 md:columns-3 lg:columns-4 xl:columns-5 space-y-6 mx-auto">
      {loading
        ? Array(15).fill(0).map((_, index) => <SkeletonPin key={index} />)
        : sortedPins.map((item, index) => (
            <PinItem key={item.id || index} pin={item} isOwner={isOwner} />
          ))}
    </div>
  );
}

// Skeleton Loader
const SkeletonPin = () => {
  const heights = [150, 180, 220, 250, 280, 320, 350];
  const height = heights[Math.floor(Math.random() * heights.length)];

  return (
    <div className="bg-gray-200 animate-pulse rounded-lg w-full mb-4" style={{ height }}>
      <div className="flex items-center mt-3 mx-2"></div>
    </div>
  );
};

export default PinList;
