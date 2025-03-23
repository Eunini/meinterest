"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { db } from "../Shared/firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Image from "next/image";

function Form() {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [link, setLink] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const tagInputRef = useRef(null);
  const router = useRouter();
  const postId = Date.now().toString();
  const [isMobile, setIsMobile] = useState(false);

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

  // Handle file selection and preview
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

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

  // Function to upload image and save post
  const onSave = async () => {
    if (!session?.user?.email) {
      alert("User data is missing.");
      return;
    }
  
    if (!file) {
      alert("Please select an image first.");
      return;
    }
  
    setLoading(true);
  
    try {
      // Upload image to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "meinterest_upload");
      formData.append("folder", "meinterest");
  
      const response = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      const imageUrl = data.secure_url;
  
      if (!imageUrl) {
        throw new Error("Image upload failed.");
      }
  
      console.log("Image uploaded:", imageUrl);
  
      // Save post data to Firestore with tags
      const postData = {
        title,
        desc,
        link,
        tags: tags.map((tag) => tag.toLowerCase()),
        image: imageUrl,
        userName: session?.user?.name,
        email: session?.user?.email,
        userImage: session?.user?.image,
        id: postId,
        createdAt: serverTimestamp(),
      };
  
      await setDoc(doc(db, "meinterest-post", postId), postData);
      console.log("Post saved with tags");
  
      setLoading(false);
      router.push("/");
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };
  

  return (
    <div className="bg-white p-3 md:p-5 rounded-2xl">
      <div className="flex justify-end mb-4 md:mb-6">
        <button
          onClick={onSave}
          className="bg-red-500 p-2 text-white font-semibold px-3 rounded-lg"
          disabled={loading}
        >
          {loading ? (
            <Image
              src="/loading-indicator.png"
              width={30}
              height={30}
              alt="loading"
              className="animate-spin"
            />
          ) : (
            <span>Save</span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-10">
        {/* Image Upload Input */}
        <div className="flex flex-col items-center justify-center mx-auto space-y-4">
          <input type="file" accept="image/*" required onChange={handleFileChange} />
          {preview && (
            <img src={preview} alt="Preview" className="w-24 h-24 md:w-32 md:h-32 rounded-lg object-cover" />
          )}
        </div>

        <div className="col-span-2">
          <div className="w-full">
            <input
              type="text"
              required
              placeholder="Add your title"
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl md:text-[35px] outline-none font-bold w-full border-b-[2px] border-gray-400 placeholder-gray-400"
            />
            <h2 className="text-[12px] mb-4 md:mb-8 w-full text-gray-400">
              The first 40 characters are what usually show up in feeds.
            </h2>

            <textarea
              required
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Tell everyone what your pin is about"
              className="outline-none w-full pb-1 border-b-[2px] border-gray-400 placeholder-gray-400 text-sm md:text-base required required"
            />

            {/* Tags Input */}
            <div className="mt-4 md:mt-6">
              <div className="relative">
                <input
                  required
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
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Form;