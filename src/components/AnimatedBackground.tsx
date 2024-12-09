import React, { useMemo } from 'react';
import { useCountdown } from '../hooks/useCountdown';
import { cn } from '../lib/utils';

type AnimatedBackgroundProps = {
  timeLeft: ReturnType<typeof useCountdown>;
  children: React.ReactNode;
  isMonochrome?: boolean;
};

export function AnimatedBackground({ timeLeft, children, isMonochrome = false }: AnimatedBackgroundProps) {
  const intensity = useMemo(() => {
    if (!timeLeft.totalSeconds) return 0;
    return Math.max(0, Math.min(1, 1 - (timeLeft.totalSeconds / (24 * 3600))));
  }, [timeLeft]);

  const pulseSpeed = useMemo(() => {
    if (!timeLeft.totalSeconds) return '0s';
    const baseSpeed = 4;
    const minSpeed = 1;
    const speedIncrease = Math.pow(intensity, 2) * 3;
    return `${Math.max(minSpeed, baseSpeed - speedIncrease)}s`;
  }, [timeLeft, intensity]);

  const colors = useMemo(() => {
    if (!timeLeft.totalSeconds) {
      return {
        primary: 'hsl(220, 20%, 97%)',
        secondary: 'hsl(220, 20%, 95%)',
        accent: 'hsl(220, 20%, 93%)'
      };
    }

    if (isMonochrome) {
      const value = 90 - (intensity * 20);
      return {
        primary: `hsl(0, 0%, ${value}%)`,
        secondary: `hsl(0, 0%, ${value - 3}%)`,
        accent: `hsl(0, 0%, ${value - 6}%)`
      };
    }

    const hue = 200 - (intensity * 160);
    const saturation = 30 + (intensity * 40);
    const lightness = 90 - (intensity * 10);

    return {
      primary: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
      secondary: `hsl(${hue + 10}, ${saturation + 5}%, ${lightness - 2}%)`,
      accent: `hsl(${hue - 10}, ${saturation + 10}%, ${lightness - 4}%)`
    };
  }, [intensity, isMonochrome, timeLeft]);

  const gradientStyle = useMemo(() => ({
    background: `linear-gradient(135deg, 
      ${colors.primary} 0%,
      ${colors.secondary} 50%,
      ${colors.accent} 100%
    )`,
    opacity: 0.8
  }), [colors]);

  const wavesStyle = useMemo(() => ({
    backgroundImage: `repeating-linear-gradient(
      45deg,
      ${colors.primary} 0%,
      ${colors.secondary} 10%,
      ${colors.accent} 20%,
      ${colors.primary} 30%
    )`,
    backgroundSize: '400% 400%',
    opacity: 0.1 + (intensity * 0.2),
    animation: `gradient ${pulseSpeed} ease infinite`
  }), [colors, intensity, pulseSpeed]);

  const pulseStyle = useMemo(() => ({
    '--pulse-speed': pulseSpeed,
    backgroundImage: `linear-gradient(45deg,
      ${colors.secondary}20 0%,
      ${colors.accent}40 100%
    )`,
    opacity: 0.3 + (intensity * 0.4)
  } as React.CSSProperties), [colors, intensity, pulseSpeed]);

  const shineStyle = useMemo(() => ({
    backgroundImage: `radial-gradient(
      circle at 50% 50%,
      ${colors.primary}40 0%,
      transparent 70%
    )`,
    opacity: 0.4,
    animation: `shine ${pulseSpeed} ease-in-out infinite`
  }), [colors, pulseSpeed]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-900">
      <div 
        className="absolute inset-0 transition-colors duration-1000"
        style={gradientStyle}
      />

      {timeLeft.totalSeconds > 0 && (
        <>
          <div 
            className="absolute inset-0 transition-opacity duration-300"
            style={wavesStyle}
          />

          <div 
            className={cn(
              "absolute inset-0 transition-opacity duration-300",
              "animate-[pulse_var(--pulse-speed)_cubic-bezier(0.4,0,0.6,1)_infinite]"
            )}
            style={pulseStyle}
          />

          <div
            className="absolute inset-0"
            style={shineStyle}
          />
        </>
      )}

      <div 
        className="absolute inset-0 backdrop-blur-[2px]"
        style={{
          opacity: timeLeft.totalSeconds ? 0.1 + (intensity * 0.2) : 0.05
        }}
      />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}