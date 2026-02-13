import { error, json, type RequestHandler } from '@sveltejs/kit';
import { getDb } from '$lib/db';
import * as schema from '$lib/schema';
import { count, desc } from 'drizzle-orm';

export const GET: RequestHandler = async ({ url }) => {
	const offset = parseInt(url.searchParams.get('offset') || '0');

	if (isNaN(offset)) {
		console.error('[GET /api/posts] Invalid offset:', url.searchParams.get('offset'));
		return error(400, 'Invalid offset');
	}

	let db;
	try {
		db = getDb();
	} catch (e) {
		console.error('[GET /api/posts] Failed to initialize database connection');
		console.error('[GET /api/posts] Error:', e instanceof Error ? e.message : e);
		console.error('[GET /api/posts] Stack:', e instanceof Error ? e.stack : 'N/A');
		return error(500, 'Failed to fetch posts');
	}

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
		console.error(`[GET /api/posts] Query failed (offset=${offset})`);
		console.error('[GET /api/posts] Error:', e instanceof Error ? e.message : e);
		if (e instanceof Error && e.cause) {
			const cause = e.cause;
			console.error(
				'[GET /api/posts] Cause:',
				cause instanceof Error ? cause.message : cause
			);
			if (cause instanceof Error && cause.stack) {
				console.error('[GET /api/posts] Cause stack:', cause.stack);
			}
		}
		if (e instanceof Error && e.stack) {
			console.error('[GET /api/posts] Stack:', e.stack);
		}
		return error(500, 'Failed to fetch posts');
	}
};
