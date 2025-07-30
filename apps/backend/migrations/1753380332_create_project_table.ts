import { Kysely, sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
        CREATE TABLE "project" (
            "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            "name" text NOT NULL,
            "base_currency" char(3) NOT NULL,
            "total_sum" numeric(20, 6) NOT NULL DEFAULT 0,
            "created_at" timestamp NOT NULL DEFAULT now(),
            "updated_at" timestamp NOT NULL DEFAULT now()
        );

`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`drop table "project"`.execute(db)
}
