import Image from 'next/image';
import React, { useEffect, useState, useRef } from 'react';
import UserTag from '../UserTag';
import { useRouter } from 'next/navigation';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../Shared/firebaseConfig';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';

function PinItem({ pin, isOwner = false }) {
  const router = useRouter();
  const user = {
    name: pin?.userName,
    image: pin?.userImage,
  };
  
  // For the dropdown menu
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Generate a random height between min and max values
  const [randomHeight, setRandomHeight] = useState(0);
  
  useEffect(() => {
    // Pinterest-like proportions - some shorter, some taller
    const heights = [200, 250, 300, 350, 400, 450];
    setRandomHeight(heights[Math.floor(Math.random() * heights.length)]);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  // Handle pin deletion
  const handleDelete = async (e) => {
    e.stopPropagation(); // Prevent navigation to pin detail
    
    if (window.confirm("Are you sure you want to delete this pin?")) {
      try {
        await deleteDoc(doc(db, "meinterest-post", pin.id));
        // Refresh the page to show updated pins
        window.location.reload();
      } catch (error) {
        console.error("Error deleting pin:", error);
        alert("Failed to delete pin. Please try again.");
      }
    }
    
    setShowMenu(false);
  };

  // Handle pin edit
  const handleEdit = (e) => {
    e.stopPropagation(); // Prevent navigation to pin detail
    router.push(`/edit-pin/${pin.id}`);
    setShowMenu(false);
  };

  // Toggle menu visibility
  const toggleMenu = (e) => {
    e.stopPropagation(); // Prevent navigation to pin detail
    setShowMenu(!showMenu);
  };

  return (
    <div className='break-inside-avoid relative group'>
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
        
        {/* Three-dot menu button - only visible for owner */}
        {isOwner && (
          <button 
            onClick={toggleMenu}
            className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-1.5 z-20 
                     hover:bg-opacity-100 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Pin options"
          >
            <MoreVertical size={16} />
          </button>
        )}
        
        {/* Dropdown menu */}
        {isOwner && showMenu && (
          <div 
            ref={menuRef}
            className="absolute top-12 right-2 bg-white shadow-lg rounded-lg z-30 w-36 overflow-hidden"
          >
            <button 
              onClick={handleEdit}
              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-left text-sm"
            >
              <Edit size={16} />
              <span>Edit</span>
            </button>
            
            <button 
              onClick={handleDelete}
              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-red-600 text-left text-sm"
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
      
      <h2 className='font-bold text-[18px] mb-1 mt-2 line-clamp-2'>{pin.title}</h2>
      
      {/* Show tags if they exist */}
      {pin.tags && pin.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-1">
          {pin.tags.map((tag, index) => (
            <span key={index} className="text-xs bg-gray-200 px-2 py-0.5 rounded-full text-gray-700">
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <UserTag user={user} />
    </div>
  );
}

export default PinItem;