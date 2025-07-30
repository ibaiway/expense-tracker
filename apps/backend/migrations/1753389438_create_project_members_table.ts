import { Kysely, sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
        CREATE TABLE "project_members" (
            "project_id" UUID REFERENCES "project"("id") ON DELETE CASCADE,
            "user_id" text REFERENCES "user"("id") ON DELETE CASCADE,
            "role" text NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin')),
            "created_at" timestamp NOT NULL DEFAULT now(),
            "updated_at" timestamp NOT NULL DEFAULT now(),
            PRIMARY KEY ("project_id", "user_id")
        );

`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`drop table "project_members"`.execute(db)
}
