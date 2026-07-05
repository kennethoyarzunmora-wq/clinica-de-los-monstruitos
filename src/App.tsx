import { useState } from 'react';
import { HomePage } from './pages/HomePage';
import { PatientSelectionPage } from './pages/PatientSelectionPage';
import { ClinicRoomPage } from './pages/ClinicRoomPage';
import { ProgressPage } from './pages/ProgressPage';
import { SoundToggle } from './components/SoundToggle';
import { useCalmSound } from './hooks/useCalmSound';
import { useGameProgress } from './hooks/useGameProgress';
import type { Monster, View } from './types';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
  const { progress, completionPercent, completeChallenge, completePatient, resetProgress } = useGameProgress();
  const calmSound = useCalmSound();

  const soundControl = (
    <SoundToggle isSoundOn={calmSound.isSoundOn} onToggle={calmSound.toggleSound} />
  );

  function openClinic(monster: Monster) {
    setSelectedMonster(monster);
    setView('clinic');
  }

  function goPatients() {
    setSelectedMonster(null);
    setView('patients');
  }

  if (view === 'home') {
    return (
      <>
        {soundControl}
        <HomePage onPlay={() => setView('patients')} onProgress={() => setView('progress')} />
      </>
    );
  }

  if (view === 'progress') {
    return (
      <>
        {soundControl}
        <ProgressPage
          progress={progress}
          completionPercent={completionPercent}
          onBack={() => setView('home')}
          onReset={resetProgress}
        />
      </>
    );
  }

  if (view === 'clinic' && selectedMonster) {
    return (
      <>
        {soundControl}
        <ClinicRoomPage
          monster={selectedMonster}
          onBack={goPatients}
          onPatientComplete={completePatient}
          onChallengeComplete={completeChallenge}
          onCorrectSound={calmSound.playCorrect}
          onRetrySound={calmSound.playRetry}
          onHintSound={calmSound.playHint}
          onCompleteSound={calmSound.playComplete}
        />
      </>
    );
  }

  return (
    <>
      {soundControl}
      <PatientSelectionPage
        progress={progress}
        onSelect={openClinic}
        onBack={() => setView('home')}
        onProgress={() => setView('progress')}
      />
    </>
  );
}
