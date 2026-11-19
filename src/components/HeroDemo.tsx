import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AGENT_SESSIONS, AgentProfileId } from '../data/tetherData';

gsap.registerPlugin(ScrollTrigger);

interface HeroDemoProps {
  phaseIdx: number;
  setPhaseIdx: React.Dispatch<React.SetStateAction<number>>;
  autoPlay: boolean;
  setAutoPlay: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Unique Scroll Motion #1: Split Aperture Header Scrub + Control Plane Compression.
 * Feels like watching the real TETHER daemon & shadow worker execute live.
 */
export const HeroDemo: React.FC<HeroDemoProps> = ({
  phaseIdx,
  setPhaseIdx,
  autoPlay,
  setAutoPlay,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftHeadRef = useRef<HTMLDivElement>(null);
  const rightMetaRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);

  const [agent, setAgent] = useState<AgentProfileId>('claude');
  const [packetCount, setPacketCount] = useState(1420);
  const [ackedOps, setAckedOps] = useState<Record<string, 'APPROVED' | 'REJECTED'>>({});

  useEffect(() => {
    const t = window.setInterval(() => {
      setPacketCount((c) => c + Math.floor(Math.random() * 5) + 1);
    }, 240);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    if (!autoPlay) return;
    const t = window.setInterval(() => {
      setPhaseIdx((i) => (i + 1) % 4);
    }, 3800);
    return () => window.clearInterval(t);
  }, [autoPlay, setPhaseIdx]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.7,
        },
      });
      if (leftHeadRef.current) tl.to(leftHeadRef.current, { xPercent: -10, ease: 'none' }, 0);
      if (rightMetaRef.current) tl.to(rightMetaRef.current, { xPercent: 10, ease: 'none' }, 0);
      if (workspaceRef.current) tl.to(workspaceRef.current, { y: -36, scale: 0.97, ease: 'none' }, 0);
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const session = AGENT_SESSIONS[agent];
  const phase = session.phases[phaseIdx];

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen pt-16 pb-8 px-3 md:px-6 border-b border-hairline bg-void flex flex-col justify-between overflow-hidden"
    >
      {/* Compact Startup Product Header Strip */}
      <div className="max-w-[1440px] w-full mx-auto py-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-end border-b border-hairline">
        <div ref={leftHeadRef} className="lg:col-span-7">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] mb-2">
            <span className="px-2 py-0.5 bg-lime text-void font-bold">PROTOCOL-LEVEL PERSISTENCE</span>
            <span className="px-2 py-0.5 bg-panel border border-hairline text-cyan">0 SDK CHANGES</span>
            <span className="px-2 py-0.5 bg-panel border border-hairline text-muted">APACHE-2.0</span>
          </div>
          <h1 className="font-display font-extrabold uppercase leading-[0.9] tracking-[-0.04em] text-[clamp(2.2rem,5.2vw,4.8rem)] text-bone">
            YOUR AGENT SURVIVES <span className="text-lime">WI-FI OFF.</span>
          </h1>
        </div>

        <div ref={rightMetaRef} className="lg:col-span-5 flex flex-col justify-between gap-2 lg:items-end">
          <p className="text-sm text-muted lg:text-right max-w-md leading-snug">
            A local daemon records wire frames while online. On disconnect, a cloud shadow worker
            finishes safe work, freezes irreversible actions, and AST-merges on reconnect.
          </p>
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
            <button
              type="button"
              onClick={() => { setAgent('claude'); setAckedOps({}); }}
              className={`px-2.5 py-1 border ${agent === 'claude' ? 'bg-bone text-void border-bone font-bold' : 'bg-panel text-muted border-hairline hover:text-bone'}`}
            >
              AGENT: CLAUDE CODE
            </button>
            <button
              type="button"
              onClick={() => { setAgent('playwright'); setAckedOps({}); }}
              className={`px-2.5 py-1 border ${agent === 'playwright' ? 'bg-bone text-void border-bone font-bold' : 'bg-panel text-muted border-hairline hover:text-bone'}`}
            >
              AGENT: PLAYWRIGHT CDP
            </button>
          </div>
        </div>
      </div>

      {/* LIVE PRODUCT WORKSPACE (Multi-Pane Control Plane) */}
      <div
        ref={workspaceRef}
        className="max-w-[1440px] w-full mx-auto mt-4 flex-1 border border-hairline bg-panel flex flex-col"
      >
        {/* Workspace Chrome Bar */}
        <div className="px-3 py-2 bg-surface border-b border-hairline flex flex-wrap items-center justify-between gap-3 font-mono text-[11px]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-2 py-0.5 font-bold text-void" style={{ backgroundColor: phase.accent }}>
              {phase.linkState}
            </span>
            <span className="text-bone font-bold">{session.pid}</span>
            <span className="text-muted hidden md:inline">{session.cmd}</span>
          </div>
          <div className="flex items-center gap-3 tabular-nums">
            <span className="text-muted">WAL: <strong className="text-cyan">{phase.walOffset}</strong></span>
            <span className="text-muted">RTT: <strong style={{ color: phase.accent }}>{phase.heartbeat}</strong></span>
            <span className="text-muted">FRAMES: <strong className="text-bone">{packetCount.toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Interactive Phase Stepper Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-hairline font-mono text-[11px]">
          {session.phases.map((p, i) => {
            const active = i === phaseIdx;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => { setAutoPlay(false); setPhaseIdx(i); }}
                className="px-3 py-2 text-left border-r border-b lg:border-b-0 border-hairline last:border-r-0 flex items-center justify-between transition-colors"
                style={{
                  backgroundColor: active ? p.accent : '#111317',
                  color: active ? '#0A0B0D' : '#8B919A',
                }}
              >
                <span className="font-bold">{p.index} // {p.label}</span>
                <span>{active ? 'ACTIVE' : 'STEP'}</span>
              </button>
            );
          })}
        </div>

        {/* 3-Pane Operational Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1">
          {/* Left Pane: Agent Execution Transcript & Controls */}
          <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-hairline flex flex-col justify-between bg-void">
            <div className="p-4">
              <div className="flex items-center justify-between font-mono text-[11px] text-muted border-b border-hairline pb-2 mb-3">
                <span>SESSION LOG // {session.name}</span>
                <span style={{ color: phase.accent }} className="font-bold">{phase.executor}</span>
              </div>
              <div className="space-y-2.5 font-mono text-xs">
                {phase.agentTranscript.map((row, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-start">
                    <span className="col-span-3 text-muted text-[11px] tabular-nums">{row.time}</span>
                    <span
                      className="col-span-2 text-[10px] font-bold px-1 py-0.5 text-center text-void"
                      style={{ backgroundColor: row.color }}
                    >
                      {row.tag}
                    </span>
                    <span className="col-span-7 text-bone leading-snug">{row.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hardware-style Action Controls */}
            <div className="p-3 bg-surface border-t border-hairline flex flex-wrap items-center gap-2 font-mono text-[11px]">
              <button
                type="button"
                onClick={() => { setAutoPlay(false); setPhaseIdx(1); }}
                className="px-3 py-1.5 bg-signal text-bone font-bold hover:bg-bone hover:text-void transition-colors"
              >
                KILL WI-FI
              </button>
              <button
                type="button"
                onClick={() => { setAutoPlay(false); setPhaseIdx(2); }}
                className="px-3 py-1.5 bg-amber text-void font-bold hover:bg-bone transition-colors"
              >
                TRIGGER FENCE
              </button>
              <button
                type="button"
                onClick={() => { setAutoPlay(false); setPhaseIdx(3); }}
                className="px-3 py-1.5 bg-emerald text-void font-bold hover:bg-lime transition-colors"
              >
                RECONNECT &amp; MERGE
              </button>
              <button
                type="button"
                onClick={() => setAutoPlay((a) => !a)}
                className="ml-auto px-2.5 py-1.5 border border-hairline text-muted hover:text-bone"
              >
                {autoPlay ? 'PAUSE' : 'AUTO'}
              </button>
            </div>
          </div>

          {/* Right Pane: Wire Tap Table + Workspace Delta + Frozen Approval Queue */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-panel">
            {/* Top: Live Wire Frame Table */}
            <div className="p-4 border-b border-hairline">
              <div className="flex items-center justify-between font-mono text-[11px] text-muted mb-2">
                <span>PROTOCOL WIRE TAP // MCP · WAL · HTTP · GIT · CDP</span>
                <span className="text-cyan">EXACT-ONCE MEMOIZED</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-[11px] border-collapse">
                  <thead>
                    <tr className="border-b border-hairline text-muted">
                      <th className="py-1.5 pr-2">SEQ</th>
                      <th className="py-1.5 pr-2">ACTOR</th>
                      <th className="py-1.5 pr-2">PROTO</th>
                      <th className="py-1.5 pr-2">METHOD</th>
                      <th className="py-1.5 pr-2">PAYLOAD</th>
                      <th className="py-1.5 pr-2 text-right">RTT</th>
                      <th className="py-1.5 text-right">STATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {phase.wireRows.map((r) => (
                      <tr key={r.seq} className="border-b border-hairline last:border-b-0">
                        <td className="py-2 pr-2 text-muted tabular-nums">{r.seq}</td>
                        <td className="py-2 pr-2">
                          <span className="px-1.5 py-0.5 text-[10px] font-bold text-void" style={{ backgroundColor: r.color }}>
                            {r.actor}
                          </span>
                        </td>
                        <td className="py-2 pr-2 text-cyan">{r.transport}</td>
                        <td className="py-2 pr-2 text-bone font-bold">{r.method}</td>
                        <td className="py-2 pr-2 text-muted">{r.payload}</td>
                        <td className="py-2 pr-2 text-right text-muted tabular-nums">{r.rtt}</td>
                        <td className="py-2 text-right font-bold" style={{ color: r.color }}>{r.state}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Split: Changed Files + Interactive Frozen Approval Queue */}
            <div className="grid grid-cols-1 md:grid-cols-2 flex-1">
              <div className="p-4 border-b md:border-b-0 md:border-r border-hairline font-mono text-xs">
                <div className="text-[11px] text-muted mb-2">WORKSPACE DELTAS</div>
                <div className="space-y-2">
                  {phase.changedFiles.map((f) => (
                    <div key={f.path} className="flex items-center justify-between gap-2 bg-void px-2.5 py-1.5 border border-hairline">
                      <span className="text-bone truncate">{f.path}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-muted text-[11px]">{f.delta}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 text-void" style={{ backgroundColor: f.color }}>
                          {f.owner}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 font-mono text-xs bg-void">
                <div className="flex items-center justify-between text-[11px] mb-2">
                  <span className="text-amber font-bold">FROZEN APPROVAL QUEUE</span>
                  <span className="text-muted">{phase.frozenOps.length} HELD</span>
                </div>
                {phase.frozenOps.length === 0 ? (
                  <div className="text-muted text-[11px] py-3 border border-dashed border-hairline text-center">
                    No irreversible actions intercepted in this step.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {phase.frozenOps.map((op) => {
                      const decision = ackedOps[op.id];
                      return (
                        <div key={op.id} className="p-2 bg-panel border border-amber flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <div className="text-bone font-bold truncate">{op.op}</div>
                            <div className="text-[10px] text-muted truncate">{op.target}</div>
                          </div>
                          {decision ? (
                            <span className={`px-2 py-1 text-[10px] font-bold ${decision === 'APPROVED' ? 'bg-emerald text-void' : 'bg-signal text-bone'}`}>
                              {decision}
                            </span>
                          ) : (
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => setAckedOps((prev) => ({ ...prev, [op.id]: 'APPROVED' }))}
                                className="px-2 py-1 text-[10px] font-bold bg-emerald text-void hover:bg-lime"
                              >
                                ACK
                              </button>
                              <button
                                type="button"
                                onClick={() => setAckedOps((prev) => ({ ...prev, [op.id]: 'REJECTED' }))}
                                className="px-2 py-1 text-[10px] font-bold bg-signal text-bone hover:bg-bone hover:text-void"
                              >
                                DROP
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
