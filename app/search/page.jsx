"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../Shared/firebaseConfig";
import PinList from "../components/Pins/PinList";

const Search = () => {
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || ""; // Get search query from URL

  useEffect(() => {
    if (!searchQuery) return;

    const fetchSearchResults = async () => {
      setLoading(true);
      setNoResults(false);

      try {
        const formattedQuery = searchQuery.toLowerCase().trim();
        const pinsRef = collection(db, "meinterest-post");

        const q = query(pinsRef, where("tags", "array-contains", formattedQuery));
        const querySnapshot = await getDocs(q);

        const results = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSearchResults(results);
        setNoResults(results.length === 0);
      } catch (error) {
        console.error("Error searching pins:", error);
        setNoResults(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          {searchQuery ? `Search results for "${searchQuery}"` : "Search Results"}
        </h1>
        {noResults && !loading && (
          <p className="text-gray-600 mt-2">
            No pins found matching "{searchQuery}". Try searching for a different tag.
          </p>
        )}
      </div>
      {loading ? <p>Loading...</p> : <PinList listOfPins={searchResults} />}
    </div>
  );
};

export default Search;
