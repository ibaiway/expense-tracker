import { Kysely, sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
        CREATE TABLE "expense" (
            "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            "project_id" UUID NOT NULL REFERENCES "project"("id") ON DELETE CASCADE,
            "title" text NOT NULL,
            "original_currency" char(3) NOT NULL,
            "original_amount" numeric(20, 3) NOT NULL,
            "converted_amount" numeric(20, 3) NOT NULL,
            "exchange_rate" numeric(20, 6) NOT NULL,
            "date" timestamp NOT NULL,
            "createdAt" timestamp NOT NULL DEFAULT now(),
            "updatedAt" timestamp NOT NULL DEFAULT now()
        );
`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`drop table "expense"`.execute(db)
}
