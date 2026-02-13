import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/schema.ts',
	out: './drizzle',
	dbCredentials: {
		host: process.env.DATABASE_HOST!,
		database: process.env.DATABASE_NAME!,
		user: process.env.DATABASE_USERNAME!,
		password: process.env.DATABASE_PASSWORD!,
		ssl: 'require'
	}
});
