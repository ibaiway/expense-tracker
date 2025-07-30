import { Kysely, sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
        CREATE TABLE "project" (
            "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            "name" text NOT NULL,
            "baseCurrency" char(3) NOT NULL,
            "totalSum" numeric(20, 6) NOT NULL DEFAULT 0,
            "createdAt" timestamp NOT NULL DEFAULT now(),
            "updatedAt" timestamp NOT NULL DEFAULT now()
        );

`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`drop table "project"`.execute(db)
}
