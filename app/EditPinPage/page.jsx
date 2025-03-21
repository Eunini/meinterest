"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { db } from "../../Shared/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Image from "next/image";

function EditPinPage({ params }) {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [link, setLink] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pin, setPin] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const tagInputRef = useRef(null);
  const router = useRouter();
  const pinId = params.pinId;

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Fetch pin data
  useEffect(() => {
    const fetchPin = async () => {
      try {
        const pinDoc = await getDoc(doc(db, "meinterest-post", pinId));
        
        if (pinDoc.exists()) {
          const pinData = pinDoc.data();
          
          // Verify this pin belongs to the current user
          if (pinData.email !== session?.user?.email) {
            alert("You don't have permission to edit this pin");
            router.push("/");
            return;
          }
          
          setPin(pinData);
          setTitle(pinData.title || "");
          setDesc(pinData.desc || "");
          setLink(pinData.link || "");
          setTags(pinData.tags || []);
        } else {
          alert("Pin not found");
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching pin:", error);
        alert("Error loading pin data");
      }
    };
    
    if (session?.user?.email && pinId) {
      fetchPin();
    }
  }, [pinId, session, router]);

  // Handle adding tags
  const handleAddTag = (e) => {
    if (e.key === "Enter" || e.key === "," || e.type === "blur") {
      e.preventDefault();
      
      if (tagInput.trim() !== "") {
        // Split by comma and filter out empty strings
        const newTags = tagInput
          .split(",")
          .map(tag => tag.trim())
          .filter(tag => tag !== "");
        
        // Filter out duplicates
        const uniqueTags = [...new Set([...tags, ...newTags])];
        setTags(uniqueTags);
        setTagInput("");
      }
    }
  };

  // Remove a tag
  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
    // Focus back on the input after removing a tag
    tagInputRef.current.focus();
  };

  // Update pin function
  const updatePin = async () => {
    if (!session?.user?.email) {
      alert("You must be logged in to update a pin");
      return;
    }

    if (!title.trim()) {
      alert("Please enter a title for your pin");
      return;
    }

    setLoading(true);

    try {
      const pinRef = doc(db, "meinterest-post", pinId);
      
      // Update the pin data
      await updateDoc(pinRef, {
        title,
        desc,
        link,
        tags,
        updatedAt: new Date().toISOString(),
      });

      setLoading(false);
      router.push("/pin/" + pinId);
    } catch (error) {
      console.error("Error updating pin:", error);
      setLoading(false);
      alert("Failed to update pin. Please try again.");
    }
  };

  if (!pin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-3 md:p-5 rounded-2xl max-w-4xl mx-auto my-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Edit Your Pin</h1>
      
      <div className="flex justify-end mb-4 md:mb-6">
        <button
          onClick={updatePin}
          className="bg-red-500 p-2 text-white font-semibold px-3 rounded-lg"
          disabled={loading}
        >
          {loading ? (
            <div className="h-6 w-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
          ) : (
            <span>Update Pin</span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-10">
        {/* Image Preview */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-full aspect-square max-w-xs">
            <Image
              src={pin.image}
              alt={pin.title}
              fill={true}
              className="rounded-lg object-cover"
              sizes="(max-width: 768px) 100vw, 300px"
              priority={true}
            />
          </div>
        </div>

        <div className="col-span-2">
          <div className="w-full">
            <input
              type="text"
              value={title}
              placeholder="Add your title"
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl md:text-[35px] outline-none font-bold w-full border-b-[2px] border-gray-400 placeholder-gray-400"
            />
            <h2 className="text-[12px] mb-4 md:mb-8 w-full text-gray-400">
              The first 40 characters are what usually show up in feeds.
            </h2>

            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Tell everyone what your pin is about"
              className="outline-none w-full mt-4 md:mt-8 pb-1 text-[14px] border-b-[2px] border-gray-400 placeholder-gray-400 min-h-[100px]"
            />

            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Add a destination link"
              className="outline-none w-full pb-1 mt-4 md:mt-[40px] border-b-[2px] border-gray-400 placeholder-gray-400"
            />

            {/* Tags Input */}
            <div className="mt-4 md:mt-6">
              <div className="relative">
                <input
                  ref={tagInputRef}
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      handleAddTag(e);
                    }
                  }}
                  onBlur={handleAddTag}
                  placeholder={isMobile ? 
                    "Add tags (separate with comma or enter)" :
                    "Add tags (separate with comma or press Enter)"}
                  className="outline-none w-full pb-1 border-b-[2px] border-gray-400 placeholder-gray-400 text-sm md:text-base"
                />
                <div className="absolute right-0 bottom-2 text-xs text-gray-500">
                  {isMobile ? "Press , or Enter" : "Press Enter or ,"}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="bg-[#1e1e1e] text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(index)}
                      className="ml-1 text-white hover:text-red-300 font-bold"
                      aria-label={`Remove tag ${tag}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              
              {tags.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  Click × to remove tags
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditPinPage;