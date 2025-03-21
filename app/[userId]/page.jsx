"use client";

import React, { useEffect, useState } from "react";
import { db } from "../Shared/firebaseConfig";
import UserInfo from "./../components/UserInfo";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import PinList from "./../components/Pins/PinList";

function Profile({ params }) {
  const [userInfo, setUserInfo] = useState(null);
  const [listOfPins, setListOfPins] = useState([]);

  useEffect(() => {
    const userId = params.userId;
    if (userId) {
      getUserInfo(userId);
    }
  }, [params]);

  // Fetch user by Firestore-generated ID
  const getUserInfo = async (userId) => {
    try {
      const userRef = doc(db, "users", userId); 
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        setUserInfo({ id: userId, ...userSnapshot.data() });
      } else {
        console.warn("No such user found!");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    if (userInfo) {
      getUserPins();
    }
  }, [userInfo]);

  const getUserPins = async () => {
    setListOfPins([]);
    try {
      const pinsRef = collection(db, "meinterest-post");
      const q = query(pinsRef, where("userId", "==", userInfo.id)); // Query by userId
      const querySnapshot = await getDocs(q);

      const pins = querySnapshot.docs.map((doc) => doc.data());
      setListOfPins(pins);
    } catch (error) {
      console.error("Error fetching user pins:", error);
    }
  };

  return (
    <div>
      {userInfo ? (
        <div>
          <UserInfo userInfo={userInfo} />
          <PinList listOfPins={listOfPins} />
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
}

export default Profile;
