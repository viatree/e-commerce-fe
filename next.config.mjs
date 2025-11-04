// import appConfig from "./src/appConfig/index.js";

// /** @type {import('next').NextConfig} */
// const { hostname, protocol } = new URL(`${appConfig.BASE_URL}`);

// const nextConfig = {
//   reactStrictMode: true,
//   images: {
//     remotePatterns: [
//       {
//         protocol: protocol.replace(":", ""),
//         hostname: hostname,
//       },
//     ],
//   },
// };

// export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: 'export', // ✅ ini ganti next export lama
//   images: {
//     unoptimized: true, // optional, supaya gak error di static export
//   },
// };

import appConfig from "./src/appConfig/index.js";

/** @type {import('next').NextConfig} */
const { hostname, protocol } = new URL(`${appConfig.BASE_URL}`);

const nextConfig = {
  reactStrictMode: true,

  // output: 'export',

  images: {
    unoptimized: true, // ✅ biar gak error pas export
    remotePatterns: [
      {
        protocol: protocol.replace(":", ""),
        hostname: hostname,
      },
    ],
  },
};

export default nextConfig;