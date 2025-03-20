/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'lh3.googleusercontent.com', 
            'firebasestorage.googleapis.com',
            'platform-lookaside.fbsbx.com',
            "res.cloudinary.com"
        ]
    }
};

module.exports = nextConfig;
