export default () => ({
  database: {
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    name: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    url: process.env.DATABASE_URL,
  },
});
