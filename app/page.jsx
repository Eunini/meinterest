"use client"
// import Image from 'next/image'

// import { useSession, signIn, signOut } from "next-auth/react"
import { collection, getDocs, getFirestore,initializeFirestore, enableIndexedDbPersistence , query } from 'firebase/firestore';
import { db } from './Shared/firebaseConfig';
import { useEffect, useState } from 'react';
import PinList from './components/Pins/PinList';

export default function Home() {
  const [listOfPins, setListOfPins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPins();
  }, []);

  const getAllPins = async () => {
    try {
      const pinsRef = collection(db, "meinterest-post");
      const querySnapshot = await getDocs(pinsRef);

      const pins = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setListOfPins(pins);
    } catch (error) {
      console.error("Error fetching all pins:", error);
    } finally {
      setLoading(false);
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
