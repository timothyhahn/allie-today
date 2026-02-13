import { error, json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
import * as schema from '$lib/schema';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ params }) => {
	const postId = params.slug;
	if (!postId) {
		return error(404, 'Post not found');
	}

	try {
		const post = await db.select().from(schema.post).where(eq(schema.post.id, postId)).limit(1);
		if (post.length !== 1) {
			return error(404, 'Post not found');
		}

		return json({
			post: post[0]
		});
	} catch (e) {
		console.error('Failed to fetch post: ', e);
		return error(500, 'Failed to fetch post');
	}
};
