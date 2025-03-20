"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { HiSearch, HiBell, HiChat } from "react-icons/hi";
import { db } from "./../Shared/firebaseConfig";
import { getUserIdByEmail } from "./../Shared/firebaseUtils";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

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
  
      // Reference the "users" collection
      const usersRef = collection(db, "users");
      
      // Check if user already exists
      const q = query(usersRef, where("email", "==", session.user.email));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        // If no user document exists, add a new one
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
      console.log("Searching for:", searchQuery);
      // Implement your search functionality here
      // For example: router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
    
    // On mobile, hide the search input after search
    if (showMobileSearch) {
      setShowMobileSearch(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex justify-between gap-3 md:gap-2 items-center p-6">
      <Image
        src="/logo.png"
        alt="logo"
        width={100}
        height={100}
        onClick={() => router.push("/")}
        className="hover:bg-gray-300 py-2 px-4 rounded-full cursor-pointer"
      />
      <button className="bg-black text-white p-3 outline-0 rounded-md text-[18px] hidden md:block"
        onClick={() => router.push("/")}>
        Home
      </button>
      
      {/* Mobile search is expanded, hide Create button */}
      {!showMobileSearch && (
        <button className="font-semibold p-3 px-6 rounded-full text-[18px] md:block"
          onClick={() => onCreateClick()}>
          Create
        </button>
      )}
      
      {/* Desktop search */}
      <div className="bg-[#e9e9e9] p-3 gap-3 items-center rounded-full w-full hidden md:flex">
        <HiSearch className="text-[24px] text-gray-500" />
        <input 
          type="text" 
          placeholder="Search" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="bg-transparent outline-none w-full text-[18px]" 
        />
      </div>
      
      {/* Mobile search - controlled by showMobileSearch state */}
      {showMobileSearch ? (
        <div className="flex bg-[#e9e9e9] p-3 gap-3 items-center rounded-full flex-1 md:hidden">
          <HiSearch 
            className="text-[24px] text-gray-500 cursor-pointer" 
            onClick={handleSearch}
          />
          <input 
            type="text" 
            placeholder="Search" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
            className="bg-transparent outline-none w-full text-[18px]" 
          />
        </div>
      ) : (
        <div 
          className="bg-[#e9e9e9] p-3 rounded-full cursor-pointer md:hidden"
          onClick={() => setShowMobileSearch(true)}
        >
          <HiSearch className="text-[24px] text-gray-500" />
        </div>
      )}

      {status === "loading" ? (
        <div className="w-[60px] h-[60px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-500"></div>
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
          width={60}
          height={60}
          className="hover:bg-gray-300 p-2 rounded-full cursor-pointer"
        />
      ) : (
        <button
          className="font-semibold p-2 px-4 rounded-full bg-black text-white text-[16px]"
          onClick={() => signIn()}
        >
          Login
        </button>
      )}
    </div>
  );
}

export default Header;