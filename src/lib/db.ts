import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { env } from '$env/dynamic/private';
import * as schema from './schema';

let _db: ReturnType<typeof drizzle>;

export function getDb() {
	if (!_db) {
		const client = postgres({
			host: env.DATABASE_HOST!,
			database: env.DATABASE_NAME!,
			username: env.DATABASE_USERNAME!,
			password: env.DATABASE_PASSWORD!,
			ssl: 'require'
		});
		_db = drizzle(client, { schema });
	}
	return _db;
}
