Scaling & Operational Recommendations

1. Connection and Pooling
- Use PgBouncer in transaction pooling mode. Keep max connections low per application instance.

2. Read replicas & caching
- Use read-replicas for analytics-heavy queries.
- Cache heavy query results in Redis (e.g., project lists, permissions) with short TTLs.

3. Partitioning
- Partition `activity_logs` and `api_usage` by time (monthly/quarterly) or by workspace for very large tenants.

4. Indexing
- Monitor slow queries and add covering indexes. Use partial indexes for active (non-deleted) rows.

5. Monitor & Alerting
- Track slow queries, long-running transactions, replication lag, connection saturation, and table bloat.

6. Archival
- Provide data-retention and archival jobs that move old audit/activity logs to cheaper storage.

7. Security
- Encrypt sensitive fields at application layer if needed. Use HSM/KMS for key management.

8. Observability
- Add DB metrics to Prometheus/Grafana. Collect pg_stat_activity and pg_stat_statements.

9. Backups
- Daily logical backups + PITR windows. Test restores regularly.

10. Multi-tenant considerations
- For very large tenants, consider isolated schemas or dedicated DBs.
- Implement rate-limiting and resource quotas per workspace.
