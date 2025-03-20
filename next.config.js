/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "res.cloudinary.com",
          pathname: "/**",
        },
        {
          protocol: "https",
          hostname: "lh3.googleusercontent.com",
          pathname: "/**",
        },
        {
          protocol: "https",
          hostname: "firebasestorage.googleapis.com",
          pathname: "/**",
        },
        {
          protocol: "https",
          hostname: "platform-lookaside.fbsbx.com",
          pathname: "/**",
        },
      ],
    },
  };
  
  module.exports = nextConfig;