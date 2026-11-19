import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FENCE_ACTIONS, FenceAction } from '../data/tetherData';

gsap.registerPlugin(ScrollTrigger);

/**
 * Unique Scroll Motion #3: Counter-Moving Dual-Rail Kinetic Split + Pinned Gate Slam.
 * Upgraded with live protocol wire dissector + interactive policy enforcement toggle.
 */
export const FenceGate: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const safeRailRef = useRef<HTMLDivElement>(null);
  const frozenRailRef = useRef<HTMLDivElement>(null);
  const gateBarRef = useRef<HTMLDivElement>(null);

  const [selected, setSelected] = useState<FenceAction>(FENCE_ACTIONS[6]);
  const [simulatedAck, setSimulatedAck] = useState<Record<string, boolean>>({});

  const safeOps = FENCE_ACTIONS.filter((a) => a.lane === 'SAFE');
  const frozenOps = FENCE_ACTIONS.filter((a) => a.lane === 'FROZEN');

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          end: 'bottom 22%',
          scrub: 0.75,
        },
      });
      if (safeRailRef.current) tl.fromTo(safeRailRef.current, { xPercent: -8 }, { xPercent: 8, ease: 'none' }, 0);
      if (frozenRailRef.current) tl.fromTo(frozenRailRef.current, { xPercent: 10 }, { xPercent: -6, ease: 'none' }, 0);
      if (gateBarRef.current) tl.fromTo(gateBarRef.current, { scaleY: 0.15 }, { scaleY: 1, ease: 'power2.out' }, 0);
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const isAcked = Boolean(simulatedAck[selected.id]);

  return (
    <section
      id="fence"
      ref={sectionRef}
      className="relative py-16 px-3 md:px-6 bg-void border-b border-hairline overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-hairline pb-5">
          <div>
            <span className="inline-block font-mono text-[11px] font-bold px-2 py-0.5 bg-amber text-void mb-2">
              03 // EGRESS POLICY FIREWALL
            </span>
            <h2 className="font-display font-extrabold text-[clamp(2rem,4.8vw,4rem)] leading-[0.92] tracking-[-0.03em] text-bone">
              SAFE RUNS. <span className="text-signal">IRREVERSIBLE FREEZES.</span>
            </h2>
          </div>
          <p className="max-w-md text-muted text-sm leading-snug">
            Inspect any live protocol opcode below. Shadow workers run reversible ops freely and
            hard-freeze money, deletes, broadcasts, and remote pushes at the wire boundary.
          </p>
        </div>

        <div className="relative mt-6 border border-hairline bg-panel overflow-hidden">
          <div
            ref={gateBarRef}
            className="hidden md:block absolute top-0 bottom-0 right-[20%] w-2.5 bg-amber z-20 origin-top"
          />
          <div className="border-b border-hairline p-4">
            <div className="flex items-center justify-between font-mono text-[11px] mb-3">
              <span className="text-lime font-bold">LANE A // REVERSIBLE OPS — AUTO-EXECUTED IN SHADOW</span>
              <span className="text-muted">ALLOW_SHADOW -&gt;</span>
            </div>
            <div ref={safeRailRef} className="flex gap-2.5 will-change-transform">
              {safeOps.map((op) => {
                const isSel = selected.id === op.id;
                return (
                  <button
                    key={op.id}
                    type="button"
                    onClick={() => setSelected(op)}
                    className="shrink-0 px-3.5 py-2.5 font-mono text-xs text-left border transition-colors"
                    style={{
                      backgroundColor: isSel ? '#C8FF00' : '#0A0B0D',
                      color: isSel ? '#0A0B0D' : '#F4F1EA',
                      borderColor: '#C8FF00',
                    }}
                  >
                    <div className="flex items-center justify-between gap-3 text-[10px] opacity-75">
                      <span>{op.protocol}</span>
                      <span>{op.ruleId}</span>
                    </div>
                    <div className="font-bold mt-0.5">{op.opcode}</div>
                    <div className="text-[11px] opacity-75">{op.target}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-void">
            <div className="flex items-center justify-between font-mono text-[11px] mb-3">
              <span className="text-signal font-bold">LANE B // IRREVERSIBLE SINKS — FROZEN AT WIRE FENCE</span>
              <span className="text-amber font-bold">0 BYTES EGRESS</span>
            </div>
            <div ref={frozenRailRef} className="flex gap-2.5 will-change-transform">
              {frozenOps.map((op) => {
                const isSel = selected.id === op.id;
                return (
                  <button
                    key={op.id}
                    type="button"
                    onClick={() => setSelected(op)}
                    className="shrink-0 px-3.5 py-2.5 font-mono text-xs text-left border transition-colors"
                    style={{
                      backgroundColor: isSel ? '#FF3B1F' : '#111317',
                      color: '#F4F1EA',
                      borderColor: '#FF3B1F',
                    }}
                  >
                    <div className="flex items-center justify-between gap-3 text-[10px] opacity-80">
                      <span>{op.protocol}</span>
                      <span>{op.ruleId}</span>
                    </div>
                    <div className="font-bold mt-0.5">{op.opcode}</div>
                    <div className="text-[11px] opacity-80">{op.target}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dense Wire Dissector Panel */}
        <div
          className="mt-3 border-2 bg-panel font-mono text-xs"
          style={{ borderColor: selected.lane === 'SAFE' ? '#C8FF00' : isAcked ? '#00C875' : '#FFB800' }}
        >
          <div className="px-4 py-2 bg-surface border-b border-hairline flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <span className="text-bone font-bold">WIRE DISSECTOR // {selected.ruleId} ({selected.protocol})</span>
            <span className="text-cyan">INTERCEPT LATENCY: {selected.latency}</span>
          </div>
          <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <div className="lg:col-span-5">
              <div className="text-[10px] text-muted">CAPTURED WIRE FRAME</div>
              <code className="block mt-1 p-2 bg-void border border-hairline text-bone overflow-x-auto whitespace-nowrap">
                {selected.wirePayload}
              </code>
            </div>
            <div className="lg:col-span-4">
              <div className="text-[10px] text-muted">POLICY EVALUATION</div>
              <div className="text-bone mt-1">{selected.reason}</div>
            </div>
            <div className="lg:col-span-3 flex flex-wrap items-center lg:justify-end gap-2">
              <span
                className="px-2.5 py-1.5 font-bold text-void"
                style={{
                  backgroundColor:
                    selected.lane === 'SAFE' ? '#C8FF00' : isAcked ? '#00C875' : '#FFB800',
                }}
              >
                {isAcked ? 'SIGNED & RELEASED' : selected.verdictCode}
              </span>
              {selected.lane === 'FROZEN' && (
                <button
                  type="button"
                  onClick={() => setSimulatedAck((p) => ({ ...p, [selected.id]: !p[selected.id] }))}
                  className="px-2.5 py-1.5 border border-bone text-bone hover:bg-bone hover:text-void font-bold"
                >
                  {isAcked ? 'RE-FREEZE' : 'SIGN ACK'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
