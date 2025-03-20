import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import UserTag from '../UserTag'
import { useRouter } from 'next/navigation'

function PinItem({pin}) {
  const router = useRouter();
  const user = {
    name: pin?.userName,
    image: pin?.userImage,
  }
  
  // Generate a random height between min and max values
  const [randomHeight, setRandomHeight] = useState(0);
  
  useEffect(() => {
    // Pinterest-like proportions - some shorter, some taller
    const heights = [200, 250, 300, 350, 400, 450];
    setRandomHeight(heights[Math.floor(Math.random() * heights.length)]);
  }, []);
  
  return (
    <div className='mb-4 break-inside-avoid'>
      <div className="relative 
        before:absolute
        before:h-full
        before:w-full
        before:rounded-3xl
        before:z-10
        before:bg-black
        before:opacity-0
        hover:before:opacity-20
        cursor-pointer
        overflow-hidden"
        onClick={() => router.push("/pin/"+pin.id)}
        style={{ height: `${randomHeight}px` }}
      >
        <Image 
          src={pin.image}
          alt={pin.title}
          fill={true}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className='rounded-3xl object-cover cursor-pointer relative z-0'
          priority={false}
        />
      </div>
      <h2 className='font-bold text-[18px] mb-1 mt-2 line-clamp-2'>{pin.title}</h2>
      <UserTag user={user} />
    </div>
  )
}

export default PinItem