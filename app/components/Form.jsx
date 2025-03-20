"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { db } from "../Shared/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
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
  const router = useRouter();
  const postId = Date.now().toString();

  // Handle file selection and preview
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
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

      // Save post data to Firestore
      const postData = {
        title,
        desc,
        link,
        image: imageUrl,
        userName: session?.user?.name,
        email: session?.user?.email,
        userImage: session?.user?.image,
        id: postId,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "meinterest-post", postId), postData);
      console.log("Post saved");

      setLoading(false);
      router.push("/");
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl">
      <div className="flex justify-end mb-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Image Upload Input */}
        <div className="flex flex-col items-center space-y-4">
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {preview && (
            <img src={preview} alt="Preview" className="w-32 h-32 rounded-lg" />
          )}
        </div>

        <div className="col-span-2">
          <div className="w-full">
            <input
              type="text"
              placeholder="Add your title"
              onChange={(e) => setTitle(e.target.value)}
              className="text-[35px] outline-none font-bold w-full border-b-[2px] border-gray-400 placeholder-gray-400"
            />
            <h2 className="text-[12px] mb-8 w-full text-gray-400">
              The first 40 characters are what usually show up in feeds.
            </h2>

            <textarea
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Tell everyone what your pin is about"
              className="outline-none w-full mt-8 pb-4 text-[14px] border-b-[2px] border-gray-400 placeholder-gray-400"
            />

            <input
              type="text"
              onChange={(e) => setLink(e.target.value)}
              placeholder="Add a Destination Link"
              className="outline-none w-full pb-4 mt-[90px] border-b-[2px] border-gray-400 placeholder-gray-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Form;
