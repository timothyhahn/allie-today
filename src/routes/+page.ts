import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {

	const post = await fetch('/api/posts?offset=0', { redirect: 'follow' });
	if (!post.ok) {
		console.error('Failed to fetch posts: ', post);
		error(500, 'Failed to fetch posts');
	}

	const json = await post.json();
	return {
		posts: json.posts
	};
};
