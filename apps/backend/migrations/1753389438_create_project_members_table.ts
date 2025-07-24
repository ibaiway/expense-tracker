import { Kysely, sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
        CREATE TABLE "project_members" (
            "projectId" UUID REFERENCES "project"("id") ON DELETE CASCADE,
            "userId" text REFERENCES "user"("id") ON DELETE CASCADE,
            "role" text DEFAULT 'member',
            "createdAt" timestamp NOT NULL DEFAULT now(),
            "updatedAt" timestamp NOT NULL DEFAULT now(),
            PRIMARY KEY ("projectId", "userId")
        );

`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`drop table "project_members"`.execute(db)
}
