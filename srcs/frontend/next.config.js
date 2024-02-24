const nextConfig = {};

module.exports = {
  env: {
    BACKEND: process.env.BACKEND,
    NEXT_PUBLIC_BACKEND: process.env.NEXT_PUBLIC_BACKEND,
  },
  images: {
    domains: [
      'cdn.intra.42.fr',
      'i.imgur.com',
      'localhost',
      `${process.env.DOMAIN_NAME}`,
    ],
  },
  output: "standalone",
};
