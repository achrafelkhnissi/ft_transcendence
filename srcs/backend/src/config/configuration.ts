export default () => ({
  ft_profile_url: process.env.FT_PROFILE_URL,
  backend: {
    port: parseInt(process.env.PORT, 10) || 3000,
    url: process.env.BACKEND_URL || 'http://localhost:' + process.env.PORT,
  },
});
