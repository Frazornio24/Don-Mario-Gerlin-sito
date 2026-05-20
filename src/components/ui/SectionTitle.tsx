interface SectionTitleProps {
  label?: string;     // Es. "La nostra storia"
  title: string;      // Es. "Chi siamo"
  subtitle?: string;
  center?: boolean;
  light?: boolean;    // Per sfondi navy (testo bianco/oro)
}

export function SectionTitle({ label, title, subtitle, center = true, light = false }: SectionTitleProps) {
  return (
    <div style={{ textAlign: center ? 'center' : 'left', marginBottom: '3rem' }}>
      {label && (
        <span style={{
          display: 'inline-block',
          color: 'var(--color-gold)',
          fontFamily: 'var(--font-body)',
          fontSize: '0.85rem',
          fontWeight: 700,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginBottom: '0.75rem',
        }}>
          {label}
        </span>
      )}
      <h2 style={{ color: light ? 'white' : 'var(--color-navy)' }}>{title}</h2>

      {/* Linea decorativa dorata */}
      <div style={{
        width: '60px',
        height: '3px',
        background: 'linear-gradient(to right, var(--color-gold), var(--color-gold-light))',
        borderRadius: '2px',
        margin: center ? '1rem auto' : '1rem 0',
      }} />

      {subtitle && (
        <p style={{
          maxWidth: '600px',
          margin: center ? '0 auto' : '0',
          color: light ? 'rgba(255,255,255,0.75)' : 'var(--color-text-muted)',
          fontSize: '1.1rem',
          lineHeight: 1.8,
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
export default SectionTitle;
