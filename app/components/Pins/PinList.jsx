import Image from 'next/image'
import React from 'react'
import UserTag from '../UserTag'
import { useRouter } from 'next/navigation'

function PinItem({pin}) {
  const router = useRouter();
  const user = {
    name: pin?.userName,
    image: pin?.userImage,
  }
  
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
      >
        <Image 
          src={pin.image}
          alt={pin.title}
          width={0}
          height={0}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className='rounded-3xl w-full h-auto object-cover cursor-pointer relative z-0'
          priority={false}
          unoptimized={false}
        />
      </div>
      <h2 className='font-bold text-[18px] mb-1 mt-2 line-clamp-2'>{pin.title}</h2>
      <UserTag user={user} />
    </div>
  )
}

export default PinItem