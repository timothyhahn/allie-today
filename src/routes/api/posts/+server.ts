import { error, json, type RequestHandler } from '@sveltejs/kit';
import { getDb } from '$lib/db';
import * as schema from '$lib/schema';
import { count, desc } from 'drizzle-orm';

export const GET: RequestHandler = async ({ url }) => {
	const offset = parseInt(url.searchParams.get('offset') || '0');

	if (isNaN(offset)) {
		return error(400, 'Invalid offset');
	}

	const db = getDb();

	try {
		const totalNum = await db.select({ value: count() }).from(schema.post);
		const result = await db
			.select()
			.from(schema.post)
			.orderBy(desc(schema.post.created_at))
			.limit(12)
			.offset(offset);

		return json({ posts: result, total: totalNum[0].value });
	} catch (e) {
		console.error('Failed to fetch posts: ', e);
		return error(500, 'Failed to fetch posts');
	}
};
