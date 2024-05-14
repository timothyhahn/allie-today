import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({params, fetch}) => {
	const slug = params.slug;
	if (!slug) {
		return {
			status: 404,
			error: new Error('Post not found')
		};
	}

	const post = await fetch(`/api/posts/${slug}`);
	if (!post.ok) {
		console.error('Failed to fetch post: ', post);
		error(500, 'Failed to fetch post');
	}

	const json = await post.json();
	return {
		post: json.post,
	};
};