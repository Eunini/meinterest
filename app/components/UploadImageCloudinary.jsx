"use client";
import React, { useState } from "react";

const UploadImageCloudinary = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // Preview selected image
    }
  };

  const uploadFile = async () => {
    if (!file) {
      alert("Please select an image first.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "meinterest_upload");
    formData.append("folder", "meinterest");

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_CLOUDINARY_URL,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      const imageUrl = data.secure_url;

      console.log("Image uploaded:", imageUrl);

      if (onUpload) {
        onUpload(imageUrl);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      
      {preview && (
        <img src={preview} alt="Preview" className="w-32 h-32 rounded-lg" />
      )}

      <button
        onClick={uploadFile}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload to Cloudinary"}
      </button>
    </div>
  );
};

export default UploadImageCloudinary;
