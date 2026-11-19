export type AgentProfileId = 'claude' | 'playwright';
export type PhaseId = 'online' | 'drop' | 'fence' | 'merge';

export interface WireLogRow {
  seq: string;
  ts: string;
  actor: 'LOCAL' | 'DAEMON' | 'SHADOW' | 'FENCE' | 'MERGE';
  transport: 'MCP' | 'WAL' | 'VM' | 'HTTP' | 'GIT' | 'CDP' | 'AST';
  method: string;
  payload: string;
  hash: string;
  rtt: string;
  color: string;
  state: 'OK' | 'SYNC' | 'FAILOVER' | 'FROZEN' | 'MERGED';
}

export interface AgentSessionPhase {
  id: PhaseId;
  index: string;
  label: string;
  linkState: 'ONLINE // EN0' | 'OFFLINE // SHADOW' | 'FENCE // HOLD' | 'RECONNECTED // MERGED';
  accent: string;
  heartbeat: string;
  executor: string;
  walOffset: string;
  agentTranscript: { time: string; tag: string; color: string; text: string }[];
  wireRows: WireLogRow[];
  changedFiles: { path: string; delta: string; owner: 'LOCAL' | 'SHADOW' | 'AST-MERGED'; color: string }[];
  frozenOps: { id: string; op: string; target: string; risk: string }[];
}

export const AGENT_SESSIONS: Record<AgentProfileId, { name: string; cmd: string; pid: string; phases: AgentSessionPhase[] }> = {
  claude: {
    name: 'Claude Code (Local CLI)',
    cmd: 'tether wrap -- claude "migrate stripe webhook retries + refund guard"',
    pid: 'PID 8841',
    phases: [
      {
        id: 'online',
        index: '01',
        label: 'ONLINE WAL SYNC',
        linkState: 'ONLINE // EN0',
        accent: '#C8FF00',
        heartbeat: '12ms',
        executor: 'LOCAL LAPTOP',
        walOffset: 'wal-00043.seg',
        agentTranscript: [
          { time: '10:14:02.11', tag: 'AGENT', color: '#C8FF00', text: 'Reading src/billing/refund.ts and src/webhooks/stripe.ts' },
          { time: '10:14:03.40', tag: 'TETHER', color: '#00E5CC', text: 'Committed seq #041-#043 to local WAL -> streamed 18.4 KB to us-east-1a' },
          { time: '10:14:04.88', tag: 'AGENT', color: '#C8FF00', text: 'Patching idempotency key verification in createRefundHandler()' },
        ],
        wireRows: [
          { seq: '#041', ts: '10:14:02.14', actor: 'LOCAL', transport: 'MCP', method: 'fs.readFile', payload: 'src/billing/refund.ts', hash: '9f2c8a', rtt: '0.8ms', color: '#C8FF00', state: 'OK' },
          { seq: '#042', ts: '10:14:03.40', actor: 'DAEMON', transport: 'WAL', method: 'wal.syncDelta', payload: '18.4KB -> edge-us-east', hash: 'b104e2', rtt: '12.1ms', color: '#00E5CC', state: 'SYNC' },
          { seq: '#043', ts: '10:14:04.92', actor: 'LOCAL', transport: 'MCP', method: 'ast.patch', payload: 'refund.ts (+24 -6)', hash: '7e91d0', rtt: '1.4ms', color: '#C8FF00', state: 'OK' },
        ],
        changedFiles: [
          { path: 'src/billing/refund.ts', delta: '+24 -6', owner: 'LOCAL', color: '#C8FF00' },
          { path: 'src/webhooks/stripe.ts', delta: '+11 -2', owner: 'LOCAL', color: '#C8FF00' },
        ],
        frozenOps: [],
      },
      {
        id: 'drop',
        index: '02',
        label: 'WI-FI DROP -> SHADOW',
        linkState: 'OFFLINE // SHADOW',
        accent: '#FF3B1F',
        heartbeat: 'LOST (800ms)',
        executor: 'CLOUD SHADOW VM',
        walOffset: 'wal-00046.seg',
        agentTranscript: [
          { time: '10:14:09.02', tag: 'NET', color: '#FF3B1F', text: 'en0 carrier lost (tunnel disconnect). Laptop daemon buffering local edits.' },
          { time: '10:14:09.43', tag: 'SHADOW', color: '#0066FF', text: 'Firecracker VM hydrated from seq #043 in 412ms. 43 prior tool calls memoized (0 re-runs).' },
          { time: '10:14:11.80', tag: 'SHADOW', color: '#0066FF', text: 'Running vitest tests/refund.spec.ts -> 14/14 passing inside isolated sandbox.' },
        ],
        wireRows: [
          { seq: '#044', ts: '10:14:09.02', actor: 'DAEMON', transport: 'WAL', method: 'net.carrierLost', payload: 'en0 timeout > 800ms', hash: '000000', rtt: '—', color: '#FF3B1F', state: 'FAILOVER' },
          { seq: '#045', ts: '10:14:09.43', actor: 'SHADOW', transport: 'VM', method: 'vm.hydrateWal', payload: '43 memoized hits / 0 dupes', hash: '7e91d0', rtt: '412ms', color: '#0066FF', state: 'OK' },
          { seq: '#046', ts: '10:14:11.80', actor: 'SHADOW', transport: 'MCP', method: 'vitest.run', payload: 'tests/refund.spec.ts (14/14)', hash: 'c44a19', rtt: '1.9s', color: '#0066FF', state: 'OK' },
        ],
        changedFiles: [
          { path: 'src/billing/refund.ts', delta: '+24 -6', owner: 'LOCAL', color: '#C8FF00' },
          { path: 'tests/refund.spec.ts', delta: '+61 -0', owner: 'SHADOW', color: '#0066FF' },
        ],
        frozenOps: [],
      },
      {
        id: 'fence',
        index: '03',
        label: 'IRREVERSIBLE FENCE',
        linkState: 'FENCE // HOLD',
        accent: '#FFB800',
        heartbeat: 'SHADOW HOLD',
        executor: 'FENCE BOUNDARY',
        walOffset: 'wal-00049.seg',
        agentTranscript: [
          { time: '10:14:14.12', tag: 'SHADOW', color: '#0066FF', text: 'tsc --noEmit passed (0 errors across 42 files). Safe work complete.' },
          { time: '10:14:14.89', tag: 'FENCE', color: '#FFB800', text: 'INTERCEPTED POST api.stripe.com/v1/refunds ($420.00) -> 0 bytes sent.' },
          { time: '10:14:15.04', tag: 'FENCE', color: '#FF3B1F', text: 'INTERCEPTED git push origin main -> suspended in signed envelope.' },
        ],
        wireRows: [
          { seq: '#047', ts: '10:14:14.12', actor: 'SHADOW', transport: 'MCP', method: 'tsc --noEmit', payload: '0 errors / 42 files', hash: 'd91b77', rtt: '840ms', color: '#0066FF', state: 'OK' },
          { seq: '#048', ts: '10:14:14.89', actor: 'FENCE', transport: 'HTTP', method: 'POST /v1/refunds', payload: 'ch_3Q9x ($420.00) BLOCKED', hash: 'f0019a', rtt: '1.1ms', color: '#FFB800', state: 'FROZEN' },
          { seq: '#049', ts: '10:14:15.04', actor: 'FENCE', transport: 'GIT', method: 'git.push', payload: 'origin/main BLOCKED', hash: 'f0019b', rtt: '0.8ms', color: '#FF3B1F', state: 'FROZEN' },
        ],
        changedFiles: [
          { path: 'src/billing/refund.ts', delta: '+24 -6', owner: 'LOCAL', color: '#C8FF00' },
          { path: 'tests/refund.spec.ts', delta: '+61 -0', owner: 'SHADOW', color: '#0066FF' },
        ],
        frozenOps: [
          { id: 'env_048', op: 'stripe.refunds.create', target: 'ch_3Q9x.. ($420.00)', risk: 'FINANCIAL' },
          { id: 'env_049', op: 'git.push', target: 'origin/main (+2 commits)', risk: 'REMOTE VCS' },
        ],
      },
      {
        id: 'merge',
        index: '04',
        label: 'RECONNECT & AST MERGE',
        linkState: 'RECONNECTED // MERGED',
        accent: '#00C875',
        heartbeat: '11ms',
        executor: 'LOCAL + AST MERGE',
        walOffset: 'wal-00052.seg',
        agentTranscript: [
          { time: '10:18:41.05', tag: 'SYNC', color: '#00E5CC', text: 'Wi-Fi restored. Streaming 6 shadow deltas + 2 frozen envelopes in 640ms.' },
          { time: '10:18:41.22', tag: 'MERGE', color: '#FF6B35', text: 'Tree-sitter 3-way AST merge on src/billing/refund.ts -> 0 conflicts (diff3 would have failed).' },
          { time: '10:18:41.30', tag: 'READY', color: '#00C875', text: 'Control returned to laptop PID 8841. Approve frozen actions below.' },
        ],
        wireRows: [
          { seq: '#050', ts: '10:18:41.22', actor: 'MERGE', transport: 'AST', method: 'ast.merge3', payload: 'refund.ts (0 conflicts)', hash: 'e773c1', rtt: '4.2ms', color: '#FF6B35', state: 'MERGED' },
          { seq: '#051', ts: '10:18:41.28', actor: 'DAEMON', transport: 'WAL', method: 'fence.queue', payload: '2 signed envelopes ready', hash: 'f0019b', rtt: '0.6ms', color: '#00C875', state: 'SYNC' },
          { seq: '#052', ts: '10:18:41.30', actor: 'LOCAL', transport: 'MCP', method: 'session.resume', payload: 'laptop PID 8841 active', hash: 'a220ff', rtt: '0.9ms', color: '#00C875', state: 'MERGED' },
        ],
        changedFiles: [
          { path: 'src/billing/refund.ts', delta: '+31 -6', owner: 'AST-MERGED', color: '#FF6B35' },
          { path: 'tests/refund.spec.ts', delta: '+61 -0', owner: 'AST-MERGED', color: '#00C875' },
        ],
        frozenOps: [
          { id: 'env_048', op: 'stripe.refunds.create', target: 'ch_3Q9x.. ($420.00)', risk: 'FINANCIAL' },
          { id: 'env_049', op: 'git.push', target: 'origin/main (+2 commits)', risk: 'REMOTE VCS' },
        ],
      },
    ],
  },
  playwright: {
    name: 'Playwright CDP (Browser Agent)',
    cmd: 'tether wrap -- node agents/procurement-bot.mjs',
    pid: 'PID 4109',
    phases: [
      {
        id: 'online',
        index: '01',
        label: 'ONLINE CDP TAP',
        linkState: 'ONLINE // EN0',
        accent: '#C8FF00',
        heartbeat: '15ms',
        executor: 'LOCAL CHROMIUM',
        walOffset: 'wal-00112.seg',
        agentTranscript: [
          { time: '10:21:04.10', tag: 'AGENT', color: '#C8FF00', text: 'Navigating supplier portal -> comparing 4 SKU quotes via CDP port 9222.' },
          { time: '10:21:05.84', tag: 'TETHER', color: '#00E5CC', text: 'Snapshotting DOM cookies + localStorage + CDP frame #112 to cloud.' },
        ],
        wireRows: [
          { seq: '#111', ts: '10:21:04.12', actor: 'LOCAL', transport: 'CDP', method: 'Page.navigate', payload: 'vendor.io/quotes/409', hash: '4a11c9', rtt: '142ms', color: '#C8FF00', state: 'OK' },
          { seq: '#112', ts: '10:21:05.84', actor: 'DAEMON', transport: 'WAL', method: 'cdp.snapshot', payload: 'DOM + cookies -> edge', hash: '8b22e0', rtt: '15.0ms', color: '#00E5CC', state: 'SYNC' },
        ],
        changedFiles: [
          { path: 'out/vendor-quote.json', delta: '+48 -0', owner: 'LOCAL', color: '#C8FF00' },
        ],
        frozenOps: [],
      },
      {
        id: 'drop',
        index: '02',
        label: 'WI-FI DROP -> SHADOW',
        linkState: 'OFFLINE // SHADOW',
        accent: '#FF3B1F',
        heartbeat: 'LOST (800ms)',
        executor: 'CLOUD HEADLESS VM',
        walOffset: 'wal-00115.seg',
        agentTranscript: [
          { time: '10:21:08.00', tag: 'NET', color: '#FF3B1F', text: 'Wi-Fi dropped mid-form fill. Cloud headless Chromium hydrated from seq #112.' },
          { time: '10:21:10.12', tag: 'SHADOW', color: '#0066FF', text: 'Filled shipping PO #9921 and validated tax line items offline.' },
        ],
        wireRows: [
          { seq: '#113', ts: '10:21:08.45', actor: 'SHADOW', transport: 'VM', method: 'cdp.hydrate', payload: 'DOM + session restored 450ms', hash: '8b22e0', rtt: '450ms', color: '#0066FF', state: 'OK' },
          { seq: '#114', ts: '10:21:10.12', actor: 'SHADOW', transport: 'CDP', method: 'Input.insertText', payload: 'input[name=po_number]', hash: '9c03a1', rtt: '2.1ms', color: '#0066FF', state: 'OK' },
        ],
        changedFiles: [
          { path: 'out/vendor-quote.json', delta: '+48 -0', owner: 'LOCAL', color: '#C8FF00' },
          { path: 'out/po-draft-9921.pdf', delta: '+1 file', owner: 'SHADOW', color: '#0066FF' },
        ],
        frozenOps: [],
      },
      {
        id: 'fence',
        index: '03',
        label: 'CHECKOUT FENCED',
        linkState: 'FENCE // HOLD',
        accent: '#FFB800',
        heartbeat: 'SHADOW HOLD',
        executor: 'CDP SINK FENCE',
        walOffset: 'wal-00116.seg',
        agentTranscript: [
          { time: '10:21:12.40', tag: 'FENCE', color: '#FFB800', text: 'INTERCEPTED click on button[data-submit-pay] ($3,840.00 PO) -> FROZEN.' },
        ],
        wireRows: [
          { seq: '#115', ts: '10:21:12.40', actor: 'FENCE', transport: 'CDP', method: 'Input.dispatchClick', payload: 'button[data-submit-pay] BLOCKED', hash: 'f9002a', rtt: '1.4ms', color: '#FFB800', state: 'FROZEN' },
        ],
        changedFiles: [
          { path: 'out/po-draft-9921.pdf', delta: '+1 file', owner: 'SHADOW', color: '#0066FF' },
        ],
        frozenOps: [
          { id: 'env_115', op: 'browser.click', target: 'button[data-submit-pay] ($3,840)', risk: 'PAYMENT SINK' },
        ],
      },
      {
        id: 'merge',
        index: '04',
        label: 'RECONNECT & ACK',
        linkState: 'RECONNECTED // MERGED',
        accent: '#00C875',
        heartbeat: '13ms',
        executor: 'LOCAL CHROMIUM',
        walOffset: 'wal-00118.seg',
        agentTranscript: [
          { time: '10:24:02.18', tag: 'SYNC', color: '#00E5CC', text: 'Streamed shadow DOM state + po-draft-9921.pdf back to laptop.' },
          { time: '10:24:02.40', tag: 'READY', color: '#00C875', text: 'Checkout paused cleanly on final button. Ready for human approval.' },
        ],
        wireRows: [
          { seq: '#117', ts: '10:24:02.18', actor: 'MERGE', transport: 'CDP', method: 'cdp.reattach', payload: 'local tab synced (0 lost inputs)', hash: 'aa190d', rtt: '19ms', color: '#00C875', state: 'MERGED' },
        ],
        changedFiles: [
          { path: 'out/po-draft-9921.pdf', delta: '+1 file', owner: 'AST-MERGED', color: '#00C875' },
        ],
        frozenOps: [
          { id: 'env_115', op: 'browser.click', target: 'button[data-submit-pay] ($3,840)', risk: 'PAYMENT SINK' },
        ],
      },
    ],
  },
};

export interface FenceAction {
  id: string;
  ruleId: string;
  protocol: 'MCP' | 'HTTP' | 'GIT' | 'SQL' | 'CDP';
  opcode: string;
  target: string;
  lane: 'SAFE' | 'FROZEN';
  reason: string;
  latency: string;
  verdictCode: string;
  wirePayload: string;
}

export const FENCE_ACTIONS: FenceAction[] = [
  { id: 'f1', ruleId: 'POL-READ-001', protocol: 'MCP', opcode: 'fs.readFile', target: 'src/server/router.ts', lane: 'SAFE', reason: 'Pure read against content-addressed workspace snapshot.', latency: '0.2ms', verdictCode: 'ALLOW_SHADOW', wirePayload: '{"jsonrpc":"2.0","method":"fs/read","params":{"path":"src/server/router.ts"}}' },
  { id: 'f2', ruleId: 'POL-WRK-004', protocol: 'MCP', opcode: 'ast.patch', target: 'src/billing/invoice.ts', lane: 'SAFE', reason: 'Reversible file mutation isolated on shadow branch.', latency: '0.4ms', verdictCode: 'ALLOW_SHADOW', wirePayload: '{"jsonrpc":"2.0","method":"ast/patch","params":{"file":"invoice.ts","hunks":2}}' },
  { id: 'f3', ruleId: 'POL-TST-002', protocol: 'MCP', opcode: 'vitest.run', target: 'tests/payment.spec.ts', lane: 'SAFE', reason: 'Hermetic sandbox test run with egress loopback only.', latency: '0.3ms', verdictCode: 'ALLOW_SHADOW', wirePayload: '{"jsonrpc":"2.0","method":"shell/exec","params":{"cmd":"vitest run"}}' },
  { id: 'f4', ruleId: 'POL-CHK-007', protocol: 'MCP', opcode: 'tsc --noEmit', target: 'tsconfig.json', lane: 'SAFE', reason: 'Deterministic static analysis; zero external side effects.', latency: '0.2ms', verdictCode: 'ALLOW_SHADOW', wirePayload: '{"jsonrpc":"2.0","method":"shell/exec","params":{"cmd":"tsc --noEmit"}}' },
  { id: 'f5', ruleId: 'POL-DB-001', protocol: 'SQL', opcode: 'SELECT *', target: 'replica://readonly', lane: 'SAFE', reason: 'Read-only SQL AST verified by wire dissector.', latency: '0.5ms', verdictCode: 'ALLOW_SHADOW', wirePayload: 'SQL_QUERY: SELECT id, status FROM invoices WHERE failed = true LIMIT 20;' },
  { id: 'f6', ruleId: 'POL-VCS-002', protocol: 'GIT', opcode: 'git.diff', target: 'HEAD~1..SHADOW', lane: 'SAFE', reason: 'Local VCS inspection; zero remote pack transmission.', latency: '0.2ms', verdictCode: 'ALLOW_SHADOW', wirePayload: 'GIT_LOCAL: diff --stat HEAD~1..tether/shadow-01' },
  { id: 'r1', ruleId: 'POL-FIN-001', protocol: 'HTTP', opcode: 'stripe.refunds.create', target: 'POST /v1/refunds ($420)', lane: 'FROZEN', reason: 'Financial settlement — irreversible external side effect.', latency: '1.1ms', verdictCode: 'FREEZE_MONEY', wirePayload: 'POST https://api.stripe.com/v1/refunds {"charge":"ch_3Q9x","amount":42000}' },
  { id: 'r2', ruleId: 'POL-VCS-009', protocol: 'GIT', opcode: 'git.push --force', target: 'origin/main', lane: 'FROZEN', reason: 'Mutates shared remote history; blocked while laptop offline.', latency: '0.8ms', verdictCode: 'FREEZE_VCS', wirePayload: 'GIT_PACK: git-receive-pack origin/main (force=true, commits=2)' },
  { id: 'r3', ruleId: 'POL-CLD-014', protocol: 'HTTP', opcode: 'aws.s3.deleteBucket', target: 's3://prod-ledger', lane: 'FROZEN', reason: 'Destructive cloud state mutation intercepted at TLS egress.', latency: '0.9ms', verdictCode: 'FREEZE_DESTRUCTIVE', wirePayload: 'DELETE https://prod-ledger.s3.amazonaws.com/ HTTP/1.1' },
  { id: 'r4', ruleId: 'POL-DB-099', protocol: 'SQL', opcode: 'DROP TABLE', target: 'prod.invoices', lane: 'FROZEN', reason: 'Destructive DDL opcode caught by wire SQL parser.', latency: '0.6ms', verdictCode: 'FREEZE_DESTRUCTIVE', wirePayload: 'SQL_DDL: DROP TABLE prod.invoices CASCADE;' },
  { id: 'r5', ruleId: 'POL-CDP-008', protocol: 'CDP', opcode: 'browser.click', target: 'button[data-submit-pay]', lane: 'FROZEN', reason: 'Playwright CDP action targets irreversible checkout sink.', latency: '1.4ms', verdictCode: 'FREEZE_DOM_SINK', wirePayload: '{"method":"Input.dispatchMouseEvent","selector":"button[data-submit-pay]"}' },
  { id: 'r6', ruleId: 'POL-MSG-003', protocol: 'HTTP', opcode: 'smtp.send', target: '4,210 customers', lane: 'FROZEN', reason: 'Outbound broadcast cannot be recalled once transmitted.', latency: '0.7ms', verdictCode: 'FREEZE_EGRESS', wirePayload: 'POST https://api.postmarkapp.com/email/batch (recipients=4210)' },
];

export interface TestCaseProof {
  id: string;
  seed: string;
  duration: string;
  title: string;
  scenario: string;
  bg: string;
  ink: string;
  metric: string;
  metricLabel: string;
  spanClass: string;
  cli: string;
  assertions: string[];
}

export const TEST_CASES: TestCaseProof[] = [
  {
    id: 'TC-01',
    seed: 'seed=0x8841a',
    duration: '1.42s',
    title: 'MID-TOOL-CALL WI-FI DROP',
    scenario: 'Kill en0 180ms into a 14-step TypeScript refactor on unmodified Claude Code.',
    bg: '#C8FF00',
    ink: '#0A0B0D',
    metric: '0 DUPES',
    metricLabel: '412ms SHADOW TAKEOVER',
    spanClass: 'md:col-span-5',
    cli: 'tether verify --case TC-01 --fault net-drop-180ms',
    assertions: [
      'ASSERT wal.replayedCalls === 14 && externalDuplicates === 0',
      'ASSERT shadow.bootLatencyMs < 500 (measured: 412ms)',
      'ASSERT finalWorkspace.tscErrors === 0',
    ],
  },
  {
    id: 'TC-02',
    seed: 'seed=0x44f9c',
    duration: '0.89s',
    title: 'OFFLINE STRIPE REFUND FENCE',
    scenario: 'Support agent attempts $420 refund via Stripe API during disconnect.',
    bg: '#FF3B1F',
    ink: '#F4F1EA',
    metric: '0 BYTES',
    metricLabel: 'LEAKED TO STRIPE API',
    spanClass: 'md:col-span-7',
    cli: 'tether verify --case TC-02 --sink stripe.refunds.create',
    assertions: [
      'ASSERT fence.intercepted("POST /v1/refunds") === true',
      'ASSERT egress.bytesSentTo("api.stripe.com") === 0',
      'ASSERT envelope.ed25519SignatureValid === true',
    ],
  },
  {
    id: 'TC-03',
    seed: 'seed=0x91e2b',
    duration: '0.64s',
    title: 'CONCURRENT LOCAL + CLOUD AST MERGE',
    scenario: 'Developer edits refund.ts offline while shadow worker refactors imports + tests.',
    bg: '#FF6B35',
    ink: '#0A0B0D',
    metric: '0 CONFLICTS',
    metricLabel: 'TREE-SITTER 3-WAY MERGE',
    spanClass: 'md:col-span-4',
    cli: 'tether verify --case TC-03 --merge ast-ts',
    assertions: [
      'ASSERT gitDiff3.conflicts === 3 (baseline line-merge failure)',
      'ASSERT tetherAstMerge.conflicts === 0',
      'ASSERT vitest.passed === 14/14 post-merge',
    ],
  },
  {
    id: 'TC-04',
    seed: 'seed=0x22c0d',
    duration: '2.18s',
    title: 'BROWSER AGENT CHECKOUT FREEZE',
    scenario: 'Unmodified Playwright agent loses Wi-Fi mid-checkout; freezes before Pay.',
    bg: '#0066FF',
    ink: '#F4F1EA',
    metric: '1.4ms',
    metricLabel: 'CDP SINK INTERCEPT',
    spanClass: 'md:col-span-4',
    cli: 'tether verify --case TC-04 --agent playwright-cdp',
    assertions: [
      'ASSERT shadowBrowser.domHydrated === true',
      'ASSERT fence.frozeSelector("button[data-submit-pay]") === true',
      'ASSERT orderCreatedBeforeReconnect === false',
    ],
  },
  {
    id: 'TC-05',
    seed: 'seed=0x77b1e',
    duration: '0.71s',
    title: 'RUNAWAY GIT FORCE-PUSH BLOCK',
    scenario: 'Agent attempts git push --force origin main while laptop lid is closed.',
    bg: '#FFB800',
    ink: '#0A0B0D',
    metric: 'LOCKED',
    metricLabel: 'REMOTE MAIN UNTOUCHED',
    spanClass: 'md:col-span-4',
    cli: 'tether verify --case TC-05 --sink git-receive-pack',
    assertions: [
      'ASSERT remoteRef("origin/main").sha === preDisconnectSha',
      'ASSERT shadowBranch("tether/shadow-05").commits === 4',
      'ASSERT userPromptedOnReconnect === true',
    ],
  },
  {
    id: 'TC-06',
    seed: 'seed=0x55a01',
    duration: '3.90s',
    title: '47-MINUTE FLIGHT REPLAY',
    scenario: 'Full airplane mode disconnect: 19 safe steps executed, 2 irreversible fenced, merged on landing.',
    bg: '#00E5CC',
    ink: '#0A0B0D',
    metric: '19 / 19',
    metricLabel: 'SAFE STEPS COMPLETED OFFLINE',
    spanClass: 'md:col-span-12',
    cli: 'tether verify --case TC-06 --duration 47m --chaos full',
    assertions: [
      'ASSERT shadow.completedSafeSteps === 19',
      'ASSERT fence.heldIrreversibleOps === 2',
      'ASSERT reconnect.streamTimeMs === 640 && astMergeClean === true',
    ],
  },
];
