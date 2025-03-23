"use client";
import Image from "next/image";
import React, { useEffect, useState, useMemo } from "react";
import { useSession, signIn } from "next-auth/react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { HiSearch, HiBell, HiChat } from "react-icons/hi";
import { db } from "./../Shared/firebaseConfig";
import { getUserIdByEmail } from "./../Shared/firebaseUtils";
import { useRouter } from "next/navigation";

function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const userEmail = useMemo(() => session?.user?.email, [session]);

  useEffect(() => {
    if (userEmail) {
      saveUserInfo();
    }
  }, [userEmail]);

  const saveUserInfo = async () => {
    try {
      if (!session?.user?.email) {
        console.error("User not authenticated");
        return;
      }
  
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", session.user.email));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        await addDoc(usersRef, {
          userName: session.user.name,
          email: session.user.email,
          userImage: session.user.image,
          createdAt: new Date(),
        });
        console.log("New user added to Firestore");
      } else {
        console.log("User already exists in Firestore");
      }
    } catch (error) {
      console.error("Error saving user info:", error.message);
    }
  };
  
  const onCreateClick = () => {
    if (session) {
      router.push("/pin-builder");
    } else {
      signIn();
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to search results page with the query parameter
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      
      // Clear the search input after searching
      setSearchQuery("");
    }
    
    if (showMobileSearch) {
      setShowMobileSearch(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex justify-between items-center px-3 py-4 sm:px-4 md:px-6 w-full overflow-x-hidden">
      {/* Logo - reduced padding and sizing for mobile */}
      <div className="flex-shrink-0">
        <Image
          src="/logo.png"
          alt="logo"
          width={80}
          height={80}
          onClick={() => router.push("/")}
          className="hover:bg-gray-300 p-1 sm:p-2 rounded-full cursor-pointer"
        />
      </div>

      {/* Home button */}
      <button 
        className="bg-black text-white p-2 outline-0 rounded-md text-[16px] hidden md:block flex-shrink-0"
        onClick={() => router.push("/")}
      >
        Home
      </button>

      {/* Create button (only hides when mobile search is active) */}
      {!showMobileSearch && (
        <button 
          className="font-semibold p-2 sm:p-3 rounded-full text-[16px] flex-shrink-0"
          onClick={() => onCreateClick()}
        >
          Create
        </button>
      )}

      {/* Desktop Search */}
      <div className="bg-[#e9e9e9] p-3 gap-3 items-center rounded-full w-full max-w-xl hidden md:flex mx-4">
        <HiSearch 
          className="text-[20px] text-gray-500 cursor-pointer" 
          onClick={handleSearch}
        />
        <input 
          type="text" 
          placeholder="Search for tags..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="bg-transparent outline-none w-full text-[16px]" 
        />
      </div>

      {/* Mobile Search */}
      {showMobileSearch ? (
        <div className="flex bg-[#e9e9e9] p-2 gap-2 items-center rounded-full flex-1 mx-2 md:hidden">
          <HiSearch 
            className="text-[20px] text-gray-500 cursor-pointer" 
            onClick={handleSearch}
          />
          <input 
            type="text" 
            placeholder="Search for tags..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
            className="bg-transparent outline-none w-full text-[14px]" 
          />
        </div>
      ) : (
        <div 
          className="bg-[#e9e9e9] p-2 rounded-full cursor-pointer flex-shrink-0 md:hidden"
          onClick={() => setShowMobileSearch(true)}
        >
          <HiSearch className="text-[20px] text-gray-500" />
        </div>
      )}

      {/* User Profile & Login */}
      <div className="flex-shrink-0 ml-2">
        {status === "loading" ? (
          <div className="w-10 h-10 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
          </div>
        ) : session?.user ? (
          <Image
            src={session.user.image}
            onClick={async () => {
              const userId = await getUserIdByEmail(session.user.email);
              if (userId) {
                router.push("/" + userId);
              }
            }}
            alt="user-image"
            width={40}
            height={40}
            className="hover:bg-gray-300 p-1 rounded-full cursor-pointer"
          />
        ) : (
          <button
            className="font-semibold p-2 px-3 rounded-full bg-black text-white text-[14px]"
            onClick={() => signIn()}
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;