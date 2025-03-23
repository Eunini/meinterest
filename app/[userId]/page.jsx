"use client";

import React, { useEffect, useState } from "react";
import { db } from "../Shared/firebaseConfig";
import UserInfo from "./../components/UserInfo";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import PinList from "./../components/Pins/PinList";
import { useSession } from "next-auth/react";

function Profile({ params }) {
  const { data: session } = useSession();
  const [userInfo, setUserInfo] = useState(null);
  const [listOfPins, setListOfPins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.userId) {
      getUserInfo(params.userId);
    }
  }, [params]);

  const getUserInfo = async (userId) => {
    try {
      const userRef = doc(db, "users", userId); 
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        setUserInfo({ id: userId, ...userSnapshot.data() });
      } else {
        console.warn("No such user found!");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user info:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.email) {
      getUserPins(userInfo.email);
    }
  }, [userInfo]);

  const getUserPins = async (email) => {
    try {
      const pinsRef = collection(db, "meinterest-post");
      const q = query(pinsRef, where("email", "==", email)); 
      const querySnapshot = await getDocs(q);

      const pins = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setListOfPins(pins);
    } catch (error) {
      console.error("Error fetching user pins:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4">
      {userInfo ? (
        <div>
          <UserInfo userInfo={userInfo} />
          <h2 className="text-2xl font-bold mt-10 mb-2">
            {userInfo.userName}'s Pins
          </h2>
          <PinList listOfPins={listOfPins} profileUserId={userInfo.id} profileUser={userInfo} />
        </div>
      ) : (
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold text-gray-800">User not found</h2>
          <p className="text-gray-600 mt-2">
            The user you're looking for doesn't exist or has been removed.
          </p>
        </div>
      )}
    </div>
  );
}

export default Profile;
