import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const INSTALL_TABS = [
  { id: 'curl', label: 'SH', cmd: 'curl -fsSL https://tether.sh | sh && tether wrap -- claude' },
  { id: 'brew', label: 'BREW', cmd: 'brew install tether-sh/tap/tether && tether wrap -- claude' },
  { id: 'cargo', label: 'CARGO', cmd: 'cargo install tetherd-cli && tether wrap -- claude' },
];

/**
 * Unique Scroll Motion #6: Curtain-Reveal Monolithic Poster Wordmark + Startup Ship Bar.
 */
export const InstallFooter: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState(INSTALL_TABS[0]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!wordmarkRef.current || !footerRef.current) return;
      gsap.fromTo(
        wordmarkRef.current,
        { yPercent: 105 },
        {
          yPercent: 0,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 82%',
            end: 'top 38%',
            scrub: 0.6,
          },
        }
      );
    }, footerRef);
    return () => ctx.revert();
  }, []);

  const handleCopy = () => {
    navigator.clipboard?.writeText(tab.cmd).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <footer id="install" ref={footerRef} className="pt-16 pb-8 px-3 md:px-6 bg-void">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch border-b border-hairline pb-12">
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <span className="inline-block font-mono text-[11px] font-bold px-2 py-0.5 bg-emerald text-void mb-3">
                06 // SHIP IN 30 SECONDS
              </span>
              <h2 className="font-display font-extrabold text-[clamp(1.9rem,4.4vw,3.8rem)] leading-[0.94] tracking-[-0.03em] text-bone">
                WRAP ANY AGENT IN ONE COMMAND.
              </h2>
            </div>

            <div className="mt-6 border-2 border-lime bg-panel">
              <div className="flex items-center justify-between border-b border-hairline bg-surface px-3 py-1.5 font-mono text-[11px]">
                <div className="flex items-center gap-1">
                  {INSTALL_TABS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTab(t)}
                      className={`px-2 py-0.5 font-bold ${
                        tab.id === t.id ? 'bg-lime text-void' : 'text-muted hover:text-bone'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-2.5 py-0.5 bg-lime text-void font-bold hover:bg-bone"
                >
                  {copied ? 'COPIED' : 'COPY CMD'}
                </button>
              </div>
              <div className="p-3.5 font-mono text-xs text-lime overflow-x-auto whitespace-nowrap">
                $ {tab.cmd}
              </div>
            </div>
          </div>

          {/* Startup Deployment Tiers — Flat Split Table (Not Cards) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 border border-hairline font-mono text-xs">
            <div className="p-5 bg-panel border-b sm:border-b-0 sm:border-r border-hairline flex flex-col justify-between">
              <div>
                <div className="text-cyan font-bold">OPEN-SOURCE CORE</div>
                <div className="font-display font-extrabold text-2xl text-bone mt-1">$0 / FOREVER</div>
                <div className="mt-3 space-y-1.5 text-muted">
                  <div>+ Local tetherd wire-tap daemon</div>
                  <div>+ Self-hosted Firecracker shadow runner</div>
                  <div>+ Full Tree-sitter AST merge engine</div>
                  <div>+ Apache-2.0 licensed protocol</div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-hairline text-cyan font-bold">SELF-HOST ANYWHERE</div>
            </div>

            <div className="p-5 bg-void flex flex-col justify-between">
              <div>
                <div className="text-lime font-bold">TETHER CLOUD SHADOW</div>
                <div className="font-display font-extrabold text-2xl text-bone mt-1">$29 / SEAT / MO</div>
                <div className="mt-3 space-y-1.5 text-bone">
                  <div>+ Instant warm micro-VMs (412ms SLA)</div>
                  <div>+ 7-region encrypted WAL edge sync</div>
                  <div>+ Signed fence audit log + Slack ACK</div>
                  <div>+ Unlimited Playwright &amp; CLI agents</div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-hairline text-lime font-bold">14-DAY FREE SHADOW CREDITS</div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden py-6 border-b border-hairline">
          <div
            ref={wordmarkRef}
            className="font-display font-extrabold text-[clamp(4.2rem,18vw,17rem)] leading-[0.82] tracking-[-0.05em] text-bone select-none"
          >
            TETHER
          </div>
        </div>

        <div className="pt-5 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] text-muted">
          <span>TETHER PROTOCOL v0.9.4 // LOCAL DAEMON · CLOUD SHADOW WORKER · AST MERGE</span>
          <span>APACHE-2.0 · ZERO SDK · ZERO GRADIENTS</span>
        </div>
      </div>
    </footer>
  );
};
