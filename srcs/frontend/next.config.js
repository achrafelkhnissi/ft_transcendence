const nextConfig = {};

module.exports = {
  env: {
    BACKEND: process.env.BACKEND,
  },
  images: {
    domains: [
      'cdn.intra.42.fr',
      'i.imgur.com',
      'localhost',
      `${process.env.DOMAIN_NAME}`,
    ],
  },
};
