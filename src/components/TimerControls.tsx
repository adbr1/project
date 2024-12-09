import React from 'react';
import { Palette, Menu, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

interface TimerControlsProps {
  isMonochrome: boolean;
  onToggleMonochrome: () => void;
  onOpenTimerList: () => void;
  onCreateTimer: () => void;
  className?: string;
}

export function TimerControls({
  isMonochrome,
  onToggleMonochrome,
  onOpenTimerList,
  onCreateTimer,
  className
}: TimerControlsProps) {
  return (
    <div className={cn(
      "fixed top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20",
      "bg-black/30 backdrop-blur-md rounded-full p-2 shadow-lg",
      "border border-white/10",
      className
    )}>
      <button
        onClick={onOpenTimerList}
        className="p-2 rounded-full hover:bg-white/10 transition-colors"
        title="Liste des compteurs"
      >
        <Menu className="w-5 h-5 text-white/80" />
      </button>

      <div className="w-px h-6 bg-white/10" />

      <button
        onClick={onToggleMonochrome}
        className={cn(
          "p-2 rounded-full hover:bg-white/10 transition-colors",
          isMonochrome && "bg-white/10"
        )}
        title={isMonochrome ? "Mode couleur" : "Mode monochrome"}
      >
        <Palette className="w-5 h-5 text-white/80" />
      </button>

      <div className="w-px h-6 bg-white/10" />

      <button
        onClick={onCreateTimer}
        className="p-2 rounded-full hover:bg-white/10 transition-colors"
        title="Nouveau compteur"
      >
        <Plus className="w-5 h-5 text-white/80" />
      </button>
    </div>
  );
}