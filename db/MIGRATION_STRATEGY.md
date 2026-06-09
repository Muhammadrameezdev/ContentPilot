Migration Strategy — From Mock Mode to Production Postgres

Goals
- Safely introduce PostgreSQL-backed persistence without breaking API contracts.
- Keep Prisma-based code intact; simply switch configs and enable DB flows.

High-level steps
1. Prepare the database environment
   - Provision a managed Postgres instance (AWS RDS/Azure/Cloud SQL) with TLS and least-privilege users.
   - Create a migration DB user and a read-only reporting user.
   - Configure connection string in `DATABASE_URL` and ensure secure secrets in production.

2. Initialize schema migration
   - Use Prisma Migrate. Create an initial migration that mirrors `db/schema.sql` or use `prisma migrate diff` to generate migration from SQL.
   - Example:
     ```bash
     npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > db/init.sql
     # review db/init.sql, then apply to prod
     psql $DATABASE_URL -f db/init.sql
     npx prisma migrate deploy
     ```

3. Seed admin/test account(s)
   - Use `prisma/seed.ts` (existing in repo) or write a seed that creates an initial workspace and admin user with a secure password (hashed with bcrypt).
   - Ensure seed runs only in non-production by default or require a flag.

4. Switch application to DB
   - Update env: set `DATABASE_URL` and remove any mock flags.
   - Re-enable Prisma usage in code: uncomment the `REAL DB LOGIC (DISABLED)` blocks.
   - Restart services behind a load balancer.

5. Data migration (if migrating from existing datastore)
   - Export mock data (if needed) and import into Postgres following schemas.
   - For large imports, use COPY and disable triggers temporarily if required.

6. Post-deploy checks
   - Smoke test all auth flows (signup/login/reset/verify).
   - Check RLS behavior: application must call `SET LOCAL app.current_workspace = '<workspace_id>'` on DB session level for queries relying on RLS.
   - Validate background jobs, webhooks, and cron tasks.

7. Backups & Observability
   - Schedule automated backups and PITR if supported.
   - Monitor slow queries via pg_stat_statements and add indexes as needed.

Rollback Plan
- Keep the app version capable of running in mock mode.
- If schema changes cause issues, point app to read-replica or restore from snapshot.

Zero-downtime considerations
- Add new columns as nullable, backfill data, then switch code to use new columns.
- Avoid destructive operations during peak traffic; use rolling migrations.

Security
- Rotate keys and DB credentials regularly.
- Use least-privilege roles and separate migration privileges from runtime roles.

Notes for this repo
- We left Prisma DB logic commented. To switch:
  1. Re-enable `import { prisma } from "@/lib/db";` and uncomment `REAL DB LOGIC` blocks.
  2. Ensure `prisma generate` ran and `DATABASE_URL` is set.
  3. Run `npx prisma migrate deploy` and `npm run start`.
