"use client"
// import Image from 'next/image'

// import { useSession, signIn, signOut } from "next-auth/react"
import { collection, getDocs, getFirestore,initializeFirestore, enableIndexedDbPersistence , query } from 'firebase/firestore';
import { db } from './Shared/firebaseConfig';
import { useEffect, useState } from 'react';
import PinList from './components/Pins/PinList';

export default function Home() {
  const [listOfPins,setListOfPins]=useState([]);
  
  useEffect(()=>{
    getAllPins();
  },[])

  const getAllPins = async () => {
    setListOfPins([]);
    try {
      const q = query(collection(db, "meinterest-post"));
      const querySnapshot = await getDocs(q);
      const pins = querySnapshot.docs.map(doc => doc.data());
      setListOfPins(pins);
    } catch (error) {
      console.error("Error fetching pins:", error);
    }
  };

  return (
    <>
    <div className='p-3'>
      <PinList listOfPins={listOfPins} />
      </div>
    </>
  )
}
