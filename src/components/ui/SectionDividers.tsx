// Onde da sezione bianca a sezione navy
export function WaveToNavy() {
  return (
    <div style={{ lineHeight: 0, background: 'var(--color-off-white)' }} className="w-full relative z-10">
      <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '50px' }}>
        <path d="M0,40 C320,80 1120,0 1440,40 L1440,80 L0,80 Z" fill="hsl(var(--primary))" />
      </svg>
    </div>
  );
}

// Onde da sezione navy a sezione bianca
export function WaveToWhite() {
  return (
    <div style={{ lineHeight: 0, background: 'hsl(var(--primary))' }} className="w-full relative z-10">
      <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '50px' }}>
        <path d="M0,40 C320,80 1120,0 1440,40 L1440,80 L0,80 Z" fill="hsl(var(--background))" />
      </svg>
    </div>
  );
}
