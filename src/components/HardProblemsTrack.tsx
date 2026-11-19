import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HardProblemsTrackProps {
  velocityRef: React.MutableRefObject<number>;
}

/**
 * Unique Scroll Motion #4 (Jesper Landberg Horizontal Track + Velocity Skew):
 * 3 dense engineering protocol workbenches gliding horizontally on scroll.
 */
export const HardProblemsTrack: React.FC<HardProblemsTrackProps> = ({ velocityRef }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current || !trackRef.current) return;
      const track = trackRef.current;

      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${Math.max(900, track.scrollWidth - window.innerWidth)}`,
          pin: true,
          scrub: 0.7,
          invalidateOnRefresh: true,
          onUpdate: () => {
            const skew = Math.max(-4.5, Math.min(4.5, velocityRef.current * 0.13));
            gsap.to(track, { skewX: skew, duration: 0.2, overwrite: 'auto' });
          },
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [velocityRef]);

  return (
    <section
      id="hard-problems"
      ref={sectionRef}
      className="relative h-screen bg-void border-b border-hairline overflow-hidden flex flex-col"
    >
      <div className="px-3 md:px-6 pt-16 pb-2.5 border-b border-hairline flex items-center justify-between font-mono text-xs shrink-0">
        <span className="bg-terracotta text-void px-2 py-0.5 font-bold">
          04 // THE THREE HARD PROTOCOL PROBLEMS
        </span>
        <span className="text-muted">HORIZONTAL ENGINEERING REEL // SCROLL -&gt;</span>
      </div>

      <div ref={trackRef} className="flex flex-1 w-max items-stretch will-change-transform">
        {/* Workbench 01 */}
        <article className="w-screen h-full px-3 md:px-10 py-6 flex flex-col justify-between border-r border-hairline shrink-0">
          <div className="max-w-[1380px] w-full mx-auto flex flex-col justify-between h-full gap-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
              <div className="lg:col-span-8">
                <span className="inline-block font-mono text-[11px] font-bold px-2 py-0.5 bg-cyan text-void mb-2">
                  HARD PROBLEM 01/03 // EXACT-ONCE WIRE RESUMPTION
                </span>
                <h2 className="font-display font-extrabold text-[clamp(1.7rem,3.8vw,3.4rem)] leading-[0.95] tracking-[-0.03em] text-bone">
                  Resume an unmodified agent from wire traffic without double-running tool calls.
                </h2>
              </div>
              <p className="lg:col-span-4 text-xs md:text-sm text-muted leading-snug">
                Every JSON-RPC/MCP request is keyed by causal sequence ID + SHA-256 argument digest.
                Shadow fast-forward serves cached results from the WAL until live step N.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 border border-hairline font-mono text-xs flex-1 max-h-[340px]">
              <div className="p-4 bg-panel border-b lg:border-b-0 lg:border-r border-hairline flex flex-col justify-between">
                <div className="text-signal font-bold border-b border-hairline pb-2">WITHOUT TETHER (NAIVE RETRY)</div>
                <div className="space-y-2 text-muted my-auto">
                  <div>seq #012  POST /tools/create_pr     <span className="text-signal">-&gt; DUPLICATE PR #89</span></div>
                  <div>seq #013  POST /tools/run_migration <span className="text-signal">-&gt; CORRUPT SCHEMA</span></div>
                  <div>seq #014  POST /tools/notify_slack  <span className="text-signal">-&gt; DOUBLE ALERT</span></div>
                </div>
                <div className="text-[11px] text-signal border-t border-hairline pt-2">STATUS: UNSAFE FOR PRODUCTION AGENTS</div>
              </div>
              <div className="p-4 bg-void flex flex-col justify-between">
                <div className="text-cyan font-bold border-b border-hairline pb-2">TETHER CAUSAL WAL REPLAY</div>
                <div className="space-y-2 text-bone my-auto">
                  <div>seq #012  sha=a81f.. <span className="text-cyan">-&gt; WAL HIT (0ms, 0 egress)</span></div>
                  <div>seq #013  sha=c04e.. <span className="text-cyan">-&gt; WAL HIT (0ms, 0 egress)</span></div>
                  <div>seq #014  sha=e92b.. <span className="text-lime font-bold">-&gt; LIVE EXECUTE IN SHADOW</span></div>
                </div>
                <div className="text-[11px] text-emerald border-t border-hairline pt-2">STATUS: 0 DUPLICATES · ZERO SDK CHANGES</div>
              </div>
            </div>
          </div>
        </article>

        {/* Workbench 02 */}
        <article className="w-screen h-full px-3 md:px-10 py-6 flex flex-col justify-between border-r border-hairline shrink-0">
          <div className="max-w-[1380px] w-full mx-auto flex flex-col justify-between h-full gap-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
              <div className="lg:col-span-8">
                <span className="inline-block font-mono text-[11px] font-bold px-2 py-0.5 bg-amber text-void mb-2">
                  HARD PROBLEM 02/03 // OFFLINE IRREVERSIBLE FENCING
                </span>
                <h2 className="font-display font-extrabold text-[clamp(1.7rem,3.8vw,3.4rem)] leading-[0.95] tracking-[-0.03em] text-bone">
                  Freeze refunds, payments, git push, and deletes at the protocol boundary.
                </h2>
              </div>
              <p className="lg:col-span-4 text-xs md:text-sm text-muted leading-snug">
                No prompt-engineering guardrails. TETHER enforces a kernel + proxy egress fence
                that suspends mutating HTTP, Git, SQL, and CDP frames into Ed25519-signed envelopes.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 border border-hairline font-mono text-xs flex-1 max-h-[340px]">
              <div className="p-4 bg-panel border-b lg:border-b-0 lg:border-r border-hairline flex flex-col justify-between">
                <div className="text-amber font-bold border-b border-hairline pb-2">INSPECTION PIPELINE (0.9ms TOTAL)</div>
                <div className="space-y-2 text-bone my-auto">
                  <div>[0.2ms] L4/TLS transparent proxy intercept</div>
                  <div>[0.3ms] Protocol dissector (HTTP / GIT / SQL / CDP)</div>
                  <div>[0.4ms] Deterministic side-effect rule match (POL-FIN-001)</div>
                </div>
                <div className="text-[11px] text-amber border-t border-hairline pt-2">POLICY: FAIL-CLOSED ON UNKNOWN MUTATIONS</div>
              </div>
              <div className="p-4 bg-void flex flex-col justify-between">
                <div className="text-signal font-bold border-b border-hairline pb-2">FROZEN ENVELOPE PAYLOAD</div>
                <div className="space-y-2 text-bone my-auto">
                  <div>envelope_id:  env_048_stripe_refund</div>
                  <div className="text-amber">egress_bytes: 0 (socket held before SYN-ACK write)</div>
                  <div className="text-emerald">release_cmd:  tether ack env_048 --sign-key ~/.tether/id</div>
                </div>
                <div className="text-[11px] text-emerald border-t border-hairline pt-2">STATUS: CRYPTOGRAPHICALLY GATED UNTIL RECONNECT</div>
              </div>
            </div>
          </div>
        </article>

        {/* Workbench 03 */}
        <article className="w-screen h-full px-3 md:px-10 py-6 flex flex-col justify-between shrink-0">
          <div className="max-w-[1380px] w-full mx-auto flex flex-col justify-between h-full gap-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
              <div className="lg:col-span-8">
                <span className="inline-block font-mono text-[11px] font-bold px-2 py-0.5 bg-terracotta text-void mb-2">
                  HARD PROBLEM 03/03 // CODE-STRUCTURE AST MERGE
                </span>
                <h2 className="font-display font-extrabold text-[clamp(1.7rem,3.8vw,3.4rem)] leading-[0.95] tracking-[-0.03em] text-bone">
                  Merge cloud shadow work with your offline local edits at AST level.
                </h2>
              </div>
              <p className="lg:col-span-4 text-xs md:text-sm text-muted leading-snug">
                Line-based git diff3 fails when you edit the same file offline while the shadow
                worker refactors imports or tests. Tree-sitter merges disjoint syntax nodes cleanly.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 border border-hairline font-mono text-xs flex-1 max-h-[340px]">
              <div className="p-4 bg-panel border-b lg:border-b-0 lg:border-r border-hairline flex flex-col justify-between">
                <div className="text-signal font-bold border-b border-hairline pb-2">GIT DIFF3 (3 CONFLICT MARKERS)</div>
                <div className="space-y-1 text-muted my-auto">
                  <div className="text-signal">&lt;&lt;&lt;&lt;&lt;&lt;&lt; LOCAL (offline train edit)</div>
                  <div>import &#123; retry, timeout &#125; from "./net";</div>
                  <div className="text-signal">=======</div>
                  <div>import &#123; retry, idempotencyKey &#125; from "./net";</div>
                  <div className="text-signal">&gt;&gt;&gt;&gt;&gt;&gt;&gt; SHADOW (cloud worker)</div>
                </div>
                <div className="text-[11px] text-signal border-t border-hairline pt-2">RESULT: MANUAL RESOLUTION REQUIRED</div>
              </div>
              <div className="p-4 bg-void flex flex-col justify-between">
                <div className="text-emerald font-bold border-b border-hairline pb-2">TETHER TREE-SITTER 3-WAY MERGE</div>
                <div className="space-y-2 text-bone my-auto">
                  <div className="text-lime">import &#123; retry, timeout, idempotencyKey &#125; from "./net";</div>
                  <div className="text-muted">// AST node union: ImportSpecifier[timeout, idempotencyKey]</div>
                  <div className="text-emerald">// tsc --noEmit: 0 errors · vitest: 14/14 pass</div>
                </div>
                <div className="text-[11px] text-emerald border-t border-hairline pt-2">RESULT: 0 CONFLICTS · 4.2ms MERGE TIME</div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};
