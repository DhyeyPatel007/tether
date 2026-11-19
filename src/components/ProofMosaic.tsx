import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TEST_CASES, TestCaseProof } from '../data/tetherData';

gsap.registerPlugin(ScrollTrigger);

/**
 * Unique Scroll Motion #5 (Vadim Carazan Tessera Mosaic Shutter):
 * CI Chaos Verification Matrix in a tessellated flat-colour grid.
 */
export const ProofMosaic: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeCase, setActiveCase] = useState<TestCaseProof>(TEST_CASES[0]);
  const [runningAll, setRunningAll] = useState(false);
  const [passedIds, setPassedIds] = useState<string[]>(TEST_CASES.map((t) => t.id));

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tiles = tileRefs.current.filter(Boolean);
      gsap.fromTo(
        tiles,
        { clipPath: 'inset(100% 0% 0% 0%)', y: 36 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 72%',
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleRunSuite = () => {
    if (runningAll) return;
    setRunningAll(true);
    setPassedIds([]);
    TEST_CASES.forEach((tc, i) => {
      window.setTimeout(() => {
        setPassedIds((prev) => [...prev, tc.id]);
        setActiveCase(tc);
        if (i === TEST_CASES.length - 1) setRunningAll(false);
      }, (i + 1) * 300);
    });
  };

  return (
    <section id="proof" ref={sectionRef} className="py-16 px-3 md:px-6 bg-void border-b border-hairline">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <span className="inline-block font-mono text-[11px] font-bold px-2 py-0.5 bg-cyan text-void mb-2">
              05 // DETERMINISTIC CI CHAOS SUITE
            </span>
            <h2 className="font-display font-extrabold text-[clamp(2rem,4.8vw,4rem)] leading-[0.92] tracking-[-0.03em] text-bone">
              SIX CHAOS TESTS. ZERO LEAKED SIDE EFFECTS.
            </h2>
          </div>

          <button
            type="button"
            onClick={handleRunSuite}
            className="font-mono text-xs font-bold px-4 py-2.5 bg-lime text-void hover:bg-bone transition-colors"
          >
            {runningAll
              ? `RUNNING CHAOS SUITE (${passedIds.length}/6)...`
              : `RUN ALL 6 SUITES (${passedIds.length}/6 PASS)`}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-[2px] bg-void border-2 border-hairline">
          {TEST_CASES.map((tc, idx) => {
            const isSelected = activeCase.id === tc.id;
            const isPassed = passedIds.includes(tc.id);
            return (
              <button
                key={tc.id}
                ref={(el) => { tileRefs.current[idx] = el; }}
                type="button"
                onClick={() => setActiveCase(tc)}
                className={`mosaic-tile ${tc.spanClass} p-5 md:p-6 text-left flex flex-col justify-between min-h-[185px] focus:outline-none`}
                style={{
                  backgroundColor: tc.bg,
                  color: tc.ink,
                  outline: isSelected ? '3px solid #F4F1EA' : 'none',
                  outlineOffset: '-3px',
                }}
              >
                <div className="flex items-center justify-between font-mono text-[11px] font-bold">
                  <span>{tc.id} · {tc.seed} · {tc.duration}</span>
                  <span className="px-1.5 py-0.5" style={{ backgroundColor: tc.ink, color: tc.bg }}>
                    {isPassed ? 'PASS' : 'RUN'}
                  </span>
                </div>
                <div className="my-3">
                  <div className="font-display font-extrabold text-3xl md:text-4xl tracking-tight leading-none">
                    {tc.metric}
                  </div>
                  <div className="font-mono text-[10px] font-bold uppercase mt-1 opacity-80">
                    {tc.metricLabel}
                  </div>
                </div>
                <div>
                  <div className="font-display font-bold text-base leading-snug">{tc.title}</div>
                  <p className="text-xs opacity-85 mt-0.5">{tc.scenario}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Live CI Runner Output Strip */}
        <div className="mt-3 border border-hairline bg-panel font-mono text-xs">
          <div className="px-4 py-2 bg-surface border-b border-hairline flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <span className="text-bone font-bold">CI LOG // {activeCase.id} — {activeCase.title}</span>
            <span className="text-cyan">$ {activeCase.cli}</span>
          </div>
          <div className="p-4 space-y-1.5">
            {activeCase.assertions.map((line, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-emerald font-bold shrink-0">[PASS {activeCase.duration}]</span>
                <span className="text-bone">{line}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
