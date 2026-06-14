const config = { datasource: { db: { provider: 'sqlite', url: process.env.DATABASE_URL || 'file:./dev.db', }, }, }; export default config;
