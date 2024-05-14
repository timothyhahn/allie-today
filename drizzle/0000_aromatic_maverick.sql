DO $$ BEGIN
 CREATE TYPE "public"."post_type" AS ENUM('image', 'video');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "posts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"description" text,
	"media_url" text NOT NULL,
	"post_type" "post_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
