import { Kysely, sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
        CREATE OR REPLACE FUNCTION update_project_total_sum()
        RETURNS TRIGGER AS $$
        BEGIN
            -- INSERT
            IF TG_OP = 'INSERT' THEN
                UPDATE project
                SET totalSum = totalSum + NEW.convertedAmount
                WHERE id = NEW."projectId";

            -- DELETE
            ELSIF TG_OP = 'DELETE' THEN
                UPDATE project
                SET totalSum = totalSum - OLD.convertedAmount
                WHERE id = OLD."projectId";

            -- UPDATE
            ELSIF TG_OP = 'UPDATE' THEN
                -- If projectId changes, subtract from old project and add to new
                IF NEW."projectId" != OLD."projectId" THEN
                    UPDATE project
                    SET totalSum = totalSum - OLD.convertedAmount
                    WHERE id = OLD."projectId";

                    UPDATE project
                    SET totalSum = totalSum + NEW.convertedAmount
                    WHERE id = NEW."projectId";

                -- If amount or rate changed, update same project total
                ELSE
                    UPDATE project
                    SET totalSum = totalSum - OLD.convertedAmount + NEW.convertedAmount
                    WHERE id = NEW."projectId";
                END IF;
            END IF;

            RETURN NULL; -- We're not modifying the row itself
        END;
        $$ LANGUAGE plpgsql;
`.execute(db)

  await sql`
        CREATE TRIGGER trigger_update_project_total_sum
        AFTER INSERT OR UPDATE OR DELETE ON expense
        FOR EACH ROW
        EXECUTE FUNCTION update_project_total_sum();
`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`DROP TRIGGER IF EXISTS trigger_update_project_total_sum ON expense;
`.execute(db)

  await sql`DROP FUNCTION IF EXISTS update_project_total_sum()`.execute(db)
}
