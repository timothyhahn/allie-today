import { error, json, type RequestHandler } from '@sveltejs/kit';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '$lib/schema';
import { count, desc } from 'drizzle-orm';
import { DB_SERVERLESS_URL } from '$env/static/private';

export const GET: RequestHandler = async ({ url }) => {
	const offset = parseInt(url.searchParams.get('offset') || '0');

	if (isNaN(offset)) {
		return error(400, 'Invalid offset');
	}

	const sql = neon(DB_SERVERLESS_URL);
	const db = drizzle(sql, { schema });

	try {
		const totalNum = await db.select({ value: count() }).from(schema.post);
		const result = await db.select().from(schema.post).orderBy(desc(schema.post.created_at)).limit(10).offset(offset);

		return json({ posts: result, total: totalNum[0].value });
	} catch (e) {
		console.error('Failed to fetch posts: ', e);
		return error(500, 'Failed to fetch posts');
	}
};