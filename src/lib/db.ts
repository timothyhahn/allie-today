import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import {
	DATABASE_HOST,
	DATABASE_NAME,
	DATABASE_USERNAME,
	DATABASE_PASSWORD
} from '$env/static/private';
import * as schema from './schema';

const client = postgres({
	host: DATABASE_HOST,
	database: DATABASE_NAME,
	username: DATABASE_USERNAME,
	password: DATABASE_PASSWORD,
	ssl: 'require'
});

export const db = drizzle(client, { schema });
