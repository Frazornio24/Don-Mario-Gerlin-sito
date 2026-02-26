import { createRef, useEffect } from 'react';

interface ChartStyleProps {
  id: string;
  config: Record<string, { theme?: Record<string, string>; color?: string }>;
}

const ChartStyle = ({ id, config }: ChartStyleProps) => {
  const styleRef = createRef<HTMLStyleElement>();
  
  useEffect(() => {
    if (!styleRef.current) return;
    
    const colorConfig = Object.entries(config).filter(([_, config]) => config.theme || config.color);
    
    if (!colorConfig.length) return;

    const cssText = Object.entries({
      light: '[data-chart]',
      dark: '[data-chart].dark'
    })
      .map(
        ([theme, prefix]) => {
          const styles = colorConfig
            .map(([key, itemConfig]) => {
              const color = itemConfig.theme?.[theme] || itemConfig.color;
              return color ? `  --color-${key}: ${color};` : null;
            })
            .filter(Boolean)
            .join('\n');
          
          return `${prefix} [data-chart="${id}"] {\n${styles}\n}`;
        }
      )
      .join('\n');

    styleRef.current.textContent = cssText;
  }, [id, config]);

  return <style ref={styleRef} />;
};

export default ChartStyle;