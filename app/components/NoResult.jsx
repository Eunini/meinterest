import React from 'react';
import { HiSearch } from "react-icons/hi";

function NoResults({ query }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="bg-gray-200 rounded-full p-6 mb-4">
        <HiSearch className="text-4xl text-gray-500" />
      </div>
      <h2 className="text-2xl font-bold mb-2">No pins found</h2>
      <p className="text-gray-600 text-center max-w-md">
        We couldn't find any pins matching "{query}". 
        Try searching for a different tag or check your spelling.
      </p>
    </div>
  );
}

export default NoResults;