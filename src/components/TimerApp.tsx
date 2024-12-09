import React, { useState, useEffect } from 'react';
import { AnimatedBackground } from './AnimatedBackground';
import { DigitalClock } from './DigitalClock';
import { TimerControls } from './TimerControls';
import { TimerListDialog } from './TimerListDialog';
import { CreateTimerDialog } from './CreateTimerDialog';
import { EditTimerDialog } from './EditTimerDialog';
import { Toast, ToastTitle, ToastDescription, ToastViewport } from './ui/toast';
import { useTimerState } from '../hooks/useTimerState';
import { useCurrentTime } from '../hooks/useCurrentTime';
import { Timer } from '../types/timer';
import { motion, AnimatePresence } from 'framer-motion';

export function TimerApp() {
  const {
    timers,
    activeTimer,
    timeLeft,
    handleCreateTimer,
    handleEditTimer,
    handleDeleteTimer,
    setActiveTimerId
  } = useTimerState();

  const currentTime = useCurrentTime();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showTimerList, setShowTimerList] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isMonochrome, setIsMonochrome] = useState(false);
  const [timerToEdit, setTimerToEdit] = useState<Timer | null>(null);

  useEffect(() => {
    if (timeLeft.isFinished && activeTimer) {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Minuteur terminé !', {
          body: `Le minuteur "${activeTimer.name}" est terminé`,
          icon: '/icon.svg'
        });
      }
      setShowToast(true);
    }
  }, [timeLeft.isFinished, activeTimer]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <AnimatedBackground 
      timeLeft={activeTimer ? timeLeft : { hours: 0, minutes: 0, seconds: 0, isFinished: false, totalSeconds: 0 }} 
      isMonochrome={isMonochrome}
    >
      <TimerControls
        isMonochrome={isMonochrome}
        onToggleMonochrome={() => setIsMonochrome(!isMonochrome)}
        onOpenTimerList={() => setShowTimerList(true)}
        onCreateTimer={() => setShowCreateDialog(true)}
      />

      <div className="min-h-screen flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {!activeTimer ? (
            <motion.div
              key="current-time"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <DigitalClock
                hours={parseInt(currentTime.time.split(':')[0])}
                minutes={parseInt(currentTime.time.split(':')[1])}
                seconds={parseInt(currentTime.time.split(':')[2])}
                className="transform-gpu scale-75 sm:scale-100"
              />
            </motion.div>
          ) : timeLeft.isFinished ? (
            <motion.div
              key="finished"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-4xl sm:text-6xl font-bold text-white mb-4"
              >
                Temps écoulé !
              </motion.div>
              <div className="text-xl text-white/60">{activeTimer.name}</div>
            </motion.div>
          ) : (
            <motion.div
              key="counting"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <DigitalClock
                hours={timeLeft.hours}
                minutes={timeLeft.minutes}
                seconds={timeLeft.seconds}
                className="transform-gpu scale-75 sm:scale-100"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showTimerList && (
        <TimerListDialog
          timers={timers}
          activeTimerId={activeTimer?.id || null}
          onSelect={(timer) => setActiveTimerId(timer.id)}
          onEdit={setTimerToEdit}
          onDelete={handleDeleteTimer}
          onClose={() => setShowTimerList(false)}
        />
      )}

      {showCreateDialog && (
        <CreateTimerDialog
          onClose={() => setShowCreateDialog(false)}
          onCreate={(timer) => {
            handleCreateTimer(timer);
            setShowToast(true);
          }}
        />
      )}

      {timerToEdit && (
        <EditTimerDialog
          timer={timerToEdit}
          onClose={() => setTimerToEdit(null)}
          onSave={(timer) => {
            handleEditTimer(timer);
            setShowToast(true);
          }}
        />
      )}

      <Toast 
        open={showToast} 
        onOpenChange={setShowToast}
        className="bg-black/40 border-white/10 text-white"
      >
        <ToastTitle className="text-white">
          {timeLeft.isFinished ? 'Minuteur terminé !' : 'Compteur mis à jour'}
        </ToastTitle>
        <ToastDescription className="text-white/80">
          {timeLeft.isFinished
            ? `Le minuteur "${activeTimer?.name}" est terminé`
            : 'Le compteur a été mis à jour avec succès'}
        </ToastDescription>
      </Toast>
      <ToastViewport />
    </AnimatedBackground>
  );
}