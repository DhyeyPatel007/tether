import { useEffect, useState } from 'react';
import { useLenis } from './hooks/useLenis';
import { NavBar } from './components/NavBar';
import { HeroDemo } from './components/HeroDemo';
import { ArchitectureCorridor } from './components/ArchitectureCorridor';
import { FenceGate } from './components/FenceGate';
import { HardProblemsTrack } from './components/HardProblemsTrack';
import { ProofMosaic } from './components/ProofMosaic';
import { InstallFooter } from './components/InstallFooter';

const SECTION_IDS = ['hero', 'architecture', 'fence', 'hard-problems', 'proof', 'install'];

export default function App() {
  const { lenisRef, velocityRef } = useLenis();
  const [activeSection, setActiveSection] = useState('hero');
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { threshold: 0.25 }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleJump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: -48 });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const wifiOnline = phaseIdx === 0 || phaseIdx === 3;

  const handleGlobalWifiToggle = () => {
    setAutoPlay(false);
    setPhaseIdx((prev) => (prev === 0 || prev === 3 ? 1 : 3));
    handleJump('hero');
  };

  return (
    <div className="bg-void text-bone min-h-screen">
      <NavBar
        activeSection={activeSection}
        onJump={handleJump}
        wifiOnline={wifiOnline}
        onToggleWifi={handleGlobalWifiToggle}
      />
      <main>
        <HeroDemo
          phaseIdx={phaseIdx}
          setPhaseIdx={setPhaseIdx}
          autoPlay={autoPlay}
          setAutoPlay={setAutoPlay}
        />
        <ArchitectureCorridor />
        <FenceGate />
        <HardProblemsTrack velocityRef={velocityRef} />
        <ProofMosaic />
      </main>
      <InstallFooter />
    </div>
  );
}
