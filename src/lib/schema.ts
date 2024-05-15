import { uuid, text, timestamp, pgTable, pgEnum } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const postTypeEnum = pgEnum('post_type', ['image', 'video']);

export const post = pgTable('posts', {
	id: uuid('id').primaryKey(),
	description: text('description'),
	media_url: text('media_url').notNull(),
	type: postTypeEnum('post_type').notNull(),
	created_at: timestamp('created_at')
		.notNull()
		.default(sql`now()`)
});
