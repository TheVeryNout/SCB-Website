# Parallel Agent Environment Specification

## Purpose

This document defines a production-grade parallel agent operating model for the `SCB` website project before implementation work begins.

It is designed to ensure we can run many migration and implementation chores concurrently without losing correctness, traceability, or security.

---

## Repo Runtime Artifacts

This specification is operationalized via concrete agent profiles in:

- `.codex/agents/00-orchestrator.md`
- `.codex/agents/10-foundation-architecture.md`
- `.codex/agents/20-content-cms.md`
- `.codex/agents/30-calendar-events.md`
- `.codex/agents/40-migration-ingestion.md`
- `.codex/agents/50-quality-security.md`
- `.codex/agents/TASK_BOARD.md`

Use those files for live delegation and shard tracking. This doc remains the policy/architecture reference.

---

## Scope

This document defines:

- orchestration model for parallel work
- protocol choices for tool and agent interoperability
- observability, evaluation, and QA controls
- security and governance requirements
- a repo-specific work partitioning strategy for `SCB`

This document does not define:

- product scope and priorities
- final page contracts
- calendar semantics
- migration content truth

Those remain governed by:

- `website-foundation.md`
- `routes-and-pages.md`
- `calendar.md`
- `public-data-register.md`
- `migration.md`

---

## Standards Baseline (Current)

Use these standards and guidance as the baseline:

1. **MCP for model↔tool interoperability**
   - adopt current MCP spec conventions
   - treat security guidance as mandatory for any remote MCP use
2. **A2A for agent↔agent collaboration**
   - use A2A capabilities for discovery, task lifecycle, and async/streaming multi-agent work
3. **OpenTelemetry for traces/metrics/logs**
   - instrument orchestrator and workers end-to-end with GenAI/agent-aware telemetry attributes
4. **NIST AI RMF GenAI Profile for governance**
   - map controls into design-time and run-time guardrails
5. **OWASP GenAI / LLM Top-10 for security hardening**
   - enforce controls against prompt injection, insecure outputs, excessive agency, and data disclosure

---

## Design Principles

1. **DAG-first execution**
   - all chores represented as a dependency graph
   - no hidden ordering in human memory
2. **Parallel by default, serialized by contract**
   - run independent nodes concurrently
   - serialize only when touching shared contracts or shared files
3. **Deterministic interfaces**
   - each worker receives validated typed input and emits typed output
4. **Idempotent tasks**
   - retries must not corrupt outputs
5. **Human-gated side effects**
   - high-impact operations require explicit approval/checkpoints
6. **Observability-native**
   - every run is traceable from root plan to single task artifact

---

## Reference Architecture

```text
Planner/Coordinator
  ├─ builds DAG from plan + repo constraints
  ├─ assigns shards to workers
  ├─ enforces locks/leases and merge policy
  └─ publishes status + gates

Task Queue / Broker
  ├─ priority queues (critical/core/secondary)
  ├─ retry + dead-letter queues
  └─ lease + heartbeat semantics

Worker Agents (N parallel)
  ├─ route/content worker
  ├─ CMS schema worker
  ├─ calendar logic worker
  ├─ migration capture worker
  ├─ QA/evals worker
  └─ docs/compliance worker

Shared Services
  ├─ Artifact store (run outputs, manifests)
  ├─ State store (task status, locks, checkpoints)
  ├─ Trace backend (OTel collector + backend)
  └─ Policy engine (guardrails, approvals)
```

---

## Protocol Strategy

### MCP usage

Use MCP for tool access (filesystem/git/shell/external systems) with strict approvals and scope minimization.

Hard rules:

- no token passthrough patterns
- no blind URL fetch in OAuth discovery paths
- strict redirect and origin validation

### A2A usage

Use A2A for worker-to-worker delegation and asynchronous long-running tasks.

Hard rules:

- declare supported protocol versions explicitly
- validate agent capabilities before delegation
- preserve task lifecycle state transitions for auditability

### Why both

- MCP solves **tool interoperability**
- A2A solves **peer agent collaboration**

Use both, not either/or.

---

## Task Contract (Required)

Each task record must include:

- `task_id`
- `run_id`
- `shard`
- `inputs` (typed, schema-validated)
- `expected_outputs`
- `dependencies`
- `lock_scope`
- `risk_level` (`low|medium|high`)
- `approval_required` (bool)
- `timeout_s`
- `retry_policy`
- `owner_agent`

Each completion payload must include:

- `status` (`success|retryable_error|terminal_error|blocked`)
- `artifacts`
- `trace_id`
- `checks`
- `diff_summary`
- `next_recommendation`

---

## Concurrency Model for This Repo

### Partitioning strategy

Partition by file/domain ownership to minimize merge contention:

- **Lane A (foundation scaffold):** Astro project skeleton and base routing shell
- **Lane B (content model):** `content-cms` and collection schema wiring
- **Lane C (calendar engine):** recurrence expansion and occurrence route generation
- **Lane D (migration ops):** manifest, raw capture, normalization pipeline
- **Lane E (quality/compliance):** evals, regression checks, policy checks

### Serialization points

Only serialize at these checkpoints:

1. shared schema contract freeze
2. route map freeze
3. global settings/shared data contract freeze
4. final merge and regression suite

---

## Reliability Controls

### Retries and idempotency

- all write tasks must be idempotent
- retries use exponential backoff + jitter
- send terminal failures to dead-letter queue with full context

### Timeouts and cancellation

- every task has explicit timeout
- coordinator can cancel downstream tasks when upstream fails

### Checkpointing

- checkpoint per DAG stage
- restore from last successful checkpoint, not from scratch

---

## Observability and Evaluation

### Telemetry minimum

Emit for every task:

- trace/span IDs
- model/tool calls
- token/cost counters
- latency by stage
- retry count
- policy/gate outcomes

### Quality gates

Define and enforce:

- build/test pass gates
- schema validation gates
- content integrity gates
- trace-based evaluation gates for agent behavior regressions

No promotion of run outputs unless gates pass.

---

## Security Controls

1. **Least privilege** for every worker and tool integration
2. **Prompt-injection containment**
   - treat external content as untrusted
   - parse to structured fields before action
3. **Insecure-output containment**
   - validate agent outputs before execution
4. **Approval barriers for destructive actions**
   - git history rewrite, secret changes, deployment, legal/financial text mutation
5. **Secrets discipline**
   - secret manager only, no plaintext in repo/artifacts
6. **Auditability**
   - immutable run logs and decision records

---

## Governance and Roles

- **Coordinator agent:** planning, scheduling, lock management, run-level decisions
- **Worker agents:** scoped execution only within assigned shard and permissions
- **Human reviewer:** approves high-risk operations and resolves blocked factual conflicts

Escalation rules:

- factual conflicts (`public-data-register`) escalate to human immediately
- security policy violations hard-fail the run
- non-critical content disputes are deprioritized behind core lanes

---

## Implementation Roadmap (Agent Environment First)

### Phase 0 — Contracts and guardrails

- define JSON schemas for task input/output
- define lock scopes and merge rules
- define approval policy matrix

### Phase 1 — Orchestration backbone

- stand up coordinator + queue + worker runtime skeleton
- implement heartbeat, lease, retry, cancel, dead-letter behavior

### Phase 2 — Observability and evals

- add OTel tracing/metrics/logs
- add regression eval suite and trace grading loop

### Phase 3 — Security hardening

- apply MCP/A2A security checks
- add output validation and high-risk action gates

### Phase 4 — SCB lane onboarding

- onboard Lane A–E in controlled rollout
- run parallel dry-runs on low-risk chores
- tune concurrency and gate thresholds

---

## Definition of Ready (before implementation chores)

The parallel environment is ready only when:

- DAG scheduler runs with retries and cancellation
- lock scopes prevent conflicting concurrent writes
- worker contracts validate inputs/outputs
- traces link plan -> task -> artifact end-to-end
- high-risk actions are approval-gated
- at least one full dry-run passes for each lane

---

## Definition of Done (environment milestone)

This environment milestone is complete when:

- all core lanes can execute in parallel safely
- shared checkpoints serialize correctly
- QA/eval gates block regressions
- audit trail is complete and queryable per run
- blocked factual conflicts are surfaced automatically for human decision

---

## Notes for SCB-specific execution

- unresolved public facts remain launch-signoff blockers, not foundation blockers
- do not let secondary polish work preempt Astro/CMS/calendar core lanes
- preserve migration evidence and manifest discipline during parallelization

---

## External References (audited 2026-04-09)

- Model Context Protocol specification key changes (latest protocol revision track)
  - https://modelcontextprotocol.io/specification/2025-11-25/changelog
- MCP security best practices
  - https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices
- Agent2Agent protocol specification (v1.0.0 latest release track)
  - https://a2a-protocol.org/latest/specification/
- A2A TCK (technology compatibility test suite)
  - https://github.com/a2aproject/a2a-tck
- OpenTelemetry: AI agent observability and evolving conventions
  - https://opentelemetry.io/blog/2025/ai-agent-observability/
- NIST AI RMF: Generative AI Profile (NIST AI 600-1)
  - https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence
- OWASP Top 10 for LLM Applications / GenAI Security Project
  - https://owasp.org/www-project-top-10-for-large-language-model-applications/
