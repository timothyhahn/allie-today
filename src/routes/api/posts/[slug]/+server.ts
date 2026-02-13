import { error, json, type RequestHandler } from '@sveltejs/kit';
import { getDb } from '$lib/db';
import * as schema from '$lib/schema';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ params }) => {
	const postId = params.slug;
	if (!postId) {
		console.error('[GET /api/posts/:slug] No slug provided');
		return error(404, 'Post not found');
	}

	let db;
	try {
		db = getDb();
	} catch (e) {
		console.error(`[GET /api/posts/${postId}] Failed to initialize database connection`);
		console.error(`[GET /api/posts/${postId}] Error:`, e instanceof Error ? e.message : e);
		console.error(`[GET /api/posts/${postId}] Stack:`, e instanceof Error ? e.stack : 'N/A');
		return error(500, 'Failed to fetch post');
	}

	try {
		const post = await db.select().from(schema.post).where(eq(schema.post.id, postId)).limit(1);
		if (post.length !== 1) {
			console.error(`[GET /api/posts/${postId}] Post not found in database`);
			return error(404, 'Post not found');
		}

		return json({
			post: post[0]
		});
	} catch (e) {
		console.error(`[GET /api/posts/${postId}] Query failed`);
		console.error(`[GET /api/posts/${postId}] Error:`, e instanceof Error ? e.message : e);
		if (e instanceof Error && e.cause) {
			const cause = e.cause;
			console.error(
				`[GET /api/posts/${postId}] Cause:`,
				cause instanceof Error ? cause.message : cause
			);
			if (cause instanceof Error && cause.stack) {
				console.error(`[GET /api/posts/${postId}] Cause stack:`, cause.stack);
			}
		}
		if (e instanceof Error && e.stack) {
			console.error(`[GET /api/posts/${postId}] Stack:`, e.stack);
		}
		return error(500, 'Failed to fetch post');
	}
};
