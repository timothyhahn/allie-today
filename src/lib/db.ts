import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { env } from '$env/dynamic/private';
import * as schema from './schema';

export function getDb() {
	const client = postgres({
		host: env.DATABASE_HOST!,
		database: env.DATABASE_NAME!,
		username: env.DATABASE_USERNAME!,
		password: env.DATABASE_PASSWORD!,
		ssl: 'require',
		max: 1
	});
	return drizzle(client, { schema });
}
