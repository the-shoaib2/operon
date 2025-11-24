/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'www.google.com',
            },
            {
                protocol: 'https',
                hostname: 'github.com',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
        ],
    },
}

export default nextConfig;
