import { Kysely, sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
        CREATE TABLE "project" (
            "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            "name" text NOT NULL,
            "createdBy" text NOT NULL REFERENCES "user"("id"),
            "createdAt" timestamp NOT NULL DEFAULT now(),
            "updatedAt" timestamp NOT NULL DEFAULT now()
        );

`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`drop table "project"`.execute(db)
}
