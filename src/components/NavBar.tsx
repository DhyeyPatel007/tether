import React from 'react';

interface NavBarProps {
  activeSection: string;
  onJump: (id: string) => void;
  wifiOnline: boolean;
  onToggleWifi: () => void;
}

const LINKS = [
  { id: 'hero', label: 'CONSOLE' },
  { id: 'architecture', label: 'ENGINE' },
  { id: 'fence', label: 'FENCE' },
  { id: 'hard-problems', label: 'PROTOCOL' },
  { id: 'proof', label: 'CI PROOF' },
  { id: 'install', label: 'DEPLOY' },
];

export const NavBar: React.FC<NavBarProps> = ({ activeSection, onJump, wifiOnline, onToggleWifi }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-void border-b border-hairline">
      <div className="max-w-[1440px] mx-auto px-3 md:px-6 h-12 flex items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => onJump('hero')} className="flex items-center gap-2.5 text-left">
            <span className={`inline-block w-2.5 h-2.5 ${wifiOnline ? 'bg-lime' : 'bg-signal'}`} />
            <span className="font-display font-extrabold tracking-tight text-base text-bone">TETHER</span>
          </button>
          <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 bg-panel text-cyan border border-hairline">
            tetherd v0.9.4
          </span>
          <span className="hidden xl:inline-block text-[11px] text-muted">
            region:us-east-1a
          </span>
        </div>

        <nav className="hidden lg:flex items-center gap-0.5">
          {LINKS.map((link) => {
            const active = activeSection === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => onJump(link.id)}
                className={`px-3 py-1.5 transition-colors ${
                  active ? 'bg-lime text-void font-bold' : 'text-muted hover:text-bone hover:bg-panel'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleWifi}
            className={`px-2.5 py-1.5 font-bold border transition-colors ${
              wifiOnline
                ? 'bg-panel border-signal text-signal hover:bg-signal hover:text-bone'
                : 'bg-emerald border-emerald text-void hover:bg-lime'
            }`}
          >
            {wifiOnline ? 'KILL WI-FI' : 'RECONNECT'}
          </button>
          <button
            type="button"
            onClick={() => onJump('install')}
            className="hidden sm:inline-block px-3 py-1.5 bg-bone text-void font-bold hover:bg-lime transition-colors"
          >
            INSTALL CLI
          </button>
        </div>
      </div>
    </header>
  );
};
