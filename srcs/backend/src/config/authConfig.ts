export default () => ({
  auth: {
    ft: {
      clientId: process.env.FT_CLIENT_ID,
      clientSecret: process.env.FT_CLIENT_SECRET,
      redirectUri: process.env.FT_REDIRECT_URI,
    },
  },
});
