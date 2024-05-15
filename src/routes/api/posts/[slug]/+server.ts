import { error, json, type RequestHandler } from '@sveltejs/kit';
import { DB_SERVERLESS_URL } from '$env/static/private';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '$lib/schema';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ params }) => {
	const postId = params.slug;
	if (!postId) {
		return error(404, 'Post not found');
	}

	const sql = neon(DB_SERVERLESS_URL);
	const db = drizzle(sql, { schema });

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
