import React from "react";
import UserTag from "../UserTag";
import { HiOutlineShare, HiDownload } from "react-icons/hi";

function PinInfo({ pinDetail }) {
  const user = {
    name: pinDetail.userName,
    email: pinDetail.email,
    image: pinDetail.userImage,
  };

  // Function to share the pin link
  const sharePin = async () => {
    const pinUrl = `${window.location.origin}/pin/${pinDetail.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: pinDetail.title,
          text: "Check out this pin!",
          url: pinUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(pinUrl);
      alert("Link copied to clipboard!");
    }
  };

  // Function to download the image
  const downloadImage = async () => {
    try {
      const response = await fetch(pinDetail.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "pin-image.jpg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <div>
      <h2 className="text-[30px] font-bold mb-10">{pinDetail.title}</h2>
      <UserTag user={user} />
      <h2 className="mt-10">{pinDetail.desc}</h2>

      <div className="flex justify-between mt-10">
        {/* Share Button */}
        <button
          className="p-2 bg-[#e9e9e9] px-5 text-[18px] rounded-full flex items-center hover:scale-105 transition-all"
          onClick={sharePin}
        >
          <HiOutlineShare size={24} className="px-2" />
          Share
        </button>

        {/* Download Button */}
        <button
          className="p-2 bg-[#e9e9e9] px-5 text-[18px] mx-auto gap-2 rounded-full flex items-center hover:scale-105 transition-all"
          onClick={downloadImage}
        >
          <HiDownload size={24} />
          Download
        </button>
      </div>
    </div>
  );
}

export default PinInfo;
