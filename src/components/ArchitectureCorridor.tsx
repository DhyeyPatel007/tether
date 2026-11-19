import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Unique Scroll Motion #2 (Dominik Fojcik 3D Fly-Through):
 * Three live subsystem inspectors flying through a Z-axis depth corridor.
 */
export const ArchitectureCorridor: React.FC = () => {
  const wrapperRef = useRef<HTMLElement>(null);
  const planeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [depthMm, setDepthMm] = useState(0);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!wrapperRef.current) return;
      const planes = planeRefs.current.filter(Boolean) as HTMLDivElement[];
      gsap.set(planes[0], { z: 0, opacity: 1, scale: 1 });
      gsap.set(planes[1], { z: -900, opacity: 0.14, scale: 0.72 });
      gsap.set(planes[2], { z: -1800, opacity: 0.04, scale: 0.5 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top top',
          end: '+=2400',
          pin: true,
          scrub: 0.9,
          onUpdate: (self) => {
            setDepthMm(Math.round(self.progress * 1800));
            setActiveStage(self.progress < 0.36 ? 0 : self.progress < 0.72 ? 1 : 2);
          },
        },
      });

      tl.to(planes[0], { z: 540, opacity: 0, scale: 1.24, ease: 'power1.inOut' }, 0)
        .to(planes[1], { z: 0, opacity: 1, scale: 1, ease: 'power1.inOut' }, 0)
        .to(planes[2], { z: -900, opacity: 0.18, scale: 0.72, ease: 'power1.inOut' }, 0)
        .to(planes[1], { z: 540, opacity: 0, scale: 1.24, ease: 'power1.inOut' }, 1)
        .to(planes[2], { z: 0, opacity: 1, scale: 1, ease: 'power1.inOut' }, 1);
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="architecture"
      ref={wrapperRef}
      className="relative h-screen bg-void border-b border-hairline overflow-hidden flex flex-col justify-between px-3 md:px-6 pt-16 pb-5"
    >
      <div className="max-w-[1440px] w-full mx-auto flex items-center justify-between border-b border-hairline pb-2.5 font-mono text-xs z-20">
        <div className="flex items-center gap-3">
          <span className="bg-cobalt text-bone px-2 py-0.5 font-bold">02 // SYSTEM ENGINE</span>
          <span className="text-muted hidden sm:inline">LOCAL DAEMON -&gt; SHADOW MICRO-VM -&gt; AST MERGE</span>
        </div>
        <div className="flex items-center gap-4 tabular-nums">
          <span className="text-cyan">Z-AXIS: {String(depthMm).padStart(4, '0')}mm</span>
          <span className="text-bone font-bold">SUBSYSTEM 0{activeStage + 1}/03</span>
        </div>
      </div>

      <div className="corridor-stage relative flex-1 w-full max-w-[1440px] mx-auto my-3 flex items-center justify-center">
        {/* Plane 01: Local Daemon */}
        <div
          ref={(el) => { planeRefs.current[0] = el; }}
          className="corridor-plane absolute inset-x-0 md:inset-x-4 top-1 bottom-1 bg-panel text-bone border-2 border-lime p-5 md:p-8 flex flex-col justify-between z-30"
        >
          <div className="flex items-center justify-between border-b border-hairline pb-3 font-mono text-xs">
            <span className="text-lime font-bold">[01] tetherd // LOCAL WIRE-TAP DAEMON</span>
            <span className="px-2 py-0.5 bg-lime text-void font-bold">OVERHEAD &lt; 1.8ms</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-auto">
            <div className="lg:col-span-5">
              <h2 className="font-display font-extrabold text-[clamp(2rem,4.6vw,4rem)] leading-[0.92] tracking-[-0.03em]">
                LOCAL DAEMON
              </h2>
              <p className="mt-3 text-sm md:text-base text-muted leading-relaxed">
                Sits transparently between your unmodified agent and the OS. Taps stdio, MCP sockets,
                and CDP port 9222 into an append-only WAL while syncing file deltas to cloud storage.
              </p>
            </div>
            <div className="lg:col-span-7 bg-void border border-hairline p-4 font-mono text-xs space-y-2">
              <div className="flex justify-between text-muted border-b border-hairline pb-1.5">
                <span>SOCKET BINDINGS</span><span>THROUGHPUT</span>
              </div>
              <div className="flex justify-between"><span className="text-lime">unix:///tmp/tether-mcp.sock</span><span className="text-bone">43 frames / 0 dropped</span></div>
              <div className="flex justify-between"><span className="text-cyan">tcp://127.0.0.1:9222 (CDP)</span><span className="text-bone">DOM delta every 250ms</span></div>
              <div className="flex justify-between"><span className="text-bone">fs.watch (fsevents/inotify)</span><span className="text-emerald">content-addressed sha256</span></div>
            </div>
          </div>
          <div className="grid grid-cols-4 border-t border-hairline pt-3 font-mono text-xs">
            <div><span className="text-muted block text-[10px]">SDK REQUIRED</span><strong className="text-lime">NONE</strong></div>
            <div><span className="text-muted block text-[10px]">WAL FSYNC</span><strong>1.4ms</strong></div>
            <div><span className="text-muted block text-[10px]">MEMORY RSS</span><strong>18 MB</strong></div>
            <div><span className="text-muted block text-[10px]">ENCRYPTION</span><strong className="text-cyan">E2E ChaCha20</strong></div>
          </div>
        </div>

        {/* Plane 02: Cloud Shadow Worker */}
        <div
          ref={(el) => { planeRefs.current[1] = el; }}
          className="corridor-plane absolute inset-x-0 md:inset-x-4 top-1 bottom-1 bg-cobalt text-void border-2 border-bone p-5 md:p-8 flex flex-col justify-between z-20"
        >
          <div className="flex items-center justify-between border-b border-void pb-3 font-mono text-xs">
            <span className="font-bold">[02] shadow-vm // EPHEMERAL FIRECRACKER WORKER</span>
            <span className="px-2 py-0.5 bg-void text-bone font-bold">FAILOVER: 412ms</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-auto">
            <div className="lg:col-span-5">
              <h2 className="font-display font-extrabold text-[clamp(2rem,4.6vw,4rem)] leading-[0.92] tracking-[-0.03em]">
                SHADOW WORKER
              </h2>
              <p className="mt-3 text-sm md:text-base font-medium leading-relaxed">
                Heartbeat misses at 800ms. A micro-VM hydrates your workspace snapshot, fast-forwards
                the agent from WAL cache without re-running prior tools, finishes safe work, and freezes at the fence.
              </p>
            </div>
            <div className="lg:col-span-7 bg-void text-bone border-2 border-void p-4 font-mono text-xs space-y-2">
              <div className="flex justify-between text-muted border-b border-hairline pb-1.5">
                <span>VM BOOT &amp; REPLAY TRACE</span><span>ELAPSED</span>
              </div>
              <div className="flex justify-between"><span className="text-cyan">1. firecracker microvm warm-clone</span><span>98ms</span></div>
              <div className="flex justify-between"><span className="text-lime">2. mount overlayfs + wal-00043.seg</span><span>142ms</span></div>
              <div className="flex justify-between"><span className="text-bone">3. replay 43 memoized tool responses</span><span>172ms</span></div>
              <div className="flex justify-between text-amber font-bold"><span>4. fence active on egress firewall</span><span>0 BYTES LEAKED</span></div>
            </div>
          </div>
          <div className="grid grid-cols-4 border-t border-void pt-3 font-mono text-xs font-bold">
            <div><span className="opacity-75 block text-[10px]">ISOLATION</span>FIRECRACKER</div>
            <div><span className="opacity-75 block text-[10px]">DUPLICATE CALLS</span>0 GUARANTEED</div>
            <div><span className="opacity-75 block text-[10px]">EGRESS POLICY</span>DENY-BY-DEFAULT</div>
            <div><span className="opacity-75 block text-[10px]">COLD FAILOVER</span>412ms P95</div>
          </div>
        </div>

        {/* Plane 03: AST Merge */}
        <div
          ref={(el) => { planeRefs.current[2] = el; }}
          className="corridor-plane absolute inset-x-0 md:inset-x-4 top-1 bottom-1 bg-panel text-bone border-2 border-emerald p-5 md:p-8 flex flex-col justify-between z-10"
        >
          <div className="flex items-center justify-between border-b border-hairline pb-3 font-mono text-xs">
            <span className="text-emerald font-bold">[03] ast-merge // TREE-SITTER 3-WAY RECONCILER</span>
            <span className="px-2 py-0.5 bg-emerald text-void font-bold">-91% CONFLICTS</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-auto">
            <div className="lg:col-span-5">
              <h2 className="font-display font-extrabold text-[clamp(2rem,4.6vw,4rem)] leading-[0.92] tracking-[-0.03em]">
                AST MERGE
              </h2>
              <p className="mt-3 text-sm md:text-base text-muted leading-relaxed">
                When Wi-Fi returns, shadow commits stream down and merge with your offline edits at
                syntax-tree granularity—aligning declarations by symbol identity before surfacing frozen ops.
              </p>
            </div>
            <div className="lg:col-span-7 bg-void border border-hairline p-4 font-mono text-xs space-y-2">
              <div className="flex justify-between text-muted border-b border-hairline pb-1.5">
                <span>NODE RECONCILIATION MATRIX</span><span>RESULT</span>
              </div>
              <div className="flex justify-between"><span className="text-terracotta">ImportSpecifier (refund.ts:1)</span><span className="text-emerald font-bold">UNION MERGED</span></div>
              <div className="flex justify-between"><span className="text-cyan">FunctionDeclaration (retryGuard)</span><span className="text-emerald font-bold">KEPT LOCAL + SHADOW</span></div>
              <div className="flex justify-between"><span className="text-lime">TestSuite (tests/refund.spec.ts)</span><span className="text-emerald font-bold">FAST-FORWARD</span></div>
            </div>
          </div>
          <div className="grid grid-cols-4 border-t border-hairline pt-3 font-mono text-xs">
            <div><span className="text-muted block text-[10px]">PARSER</span><strong className="text-terracotta">TREE-SITTER</strong></div>
            <div><span className="text-muted block text-[10px]">LANGUAGES</span><strong>TS/JS/PY/GO/RS</strong></div>
            <div><span className="text-muted block text-[10px]">MERGE TIME</span><strong className="text-emerald">4.2ms AVG</strong></div>
            <div><span className="text-muted block text-[10px]">FENCE ACK</span><strong>ED25519 SIGNED</strong></div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] w-full mx-auto grid grid-cols-3 gap-2 font-mono text-[11px] z-20">
        {[
          { label: '[01] tetherd', color: '#C8FF00', fg: '#0A0B0D' },
          { label: '[02] shadow-vm', color: '#0066FF', fg: '#F4F1EA' },
          { label: '[03] ast-merge', color: '#00C875', fg: '#0A0B0D' },
        ].map((item, idx) => (
          <div
            key={item.label}
            className="py-1.5 px-3 border border-hairline flex items-center justify-between font-bold"
            style={{
              backgroundColor: activeStage === idx ? item.color : '#111317',
              color: activeStage === idx ? item.fg : '#8B919A',
            }}
          >
            <span>{item.label}</span>
            <span className="hidden sm:inline">{activeStage === idx ? 'ACTIVE' : 'DEPTH'}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
