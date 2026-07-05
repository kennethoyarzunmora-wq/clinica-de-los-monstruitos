import { useState } from 'react';
import { HomePage } from './pages/HomePage';
import { PatientSelectionPage } from './pages/PatientSelectionPage';
import { ClinicRoomPage } from './pages/ClinicRoomPage';
import { ProgressPage } from './pages/ProgressPage';
import { StageSelectionPage } from './pages/StageSelectionPage';
import { StageGamePage } from './pages/StageGamePage';
import { SoundToggle } from './components/SoundToggle';
import { useCalmSound } from './hooks/useCalmSound';
import { useGameProgress } from './hooks/useGameProgress';
import type { LearningStage, Monster, View } from './types';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
  const [selectedStage, setSelectedStage] = useState<LearningStage | null>(null);
  const { progress, completionPercent, completeChallenge, completePatient, completeStage, resetProgress } = useGameProgress();
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

  function openStage(stage: LearningStage) {
    setSelectedStage(stage);
    if (stage.kind === 'clinic') {
      setView('patients');
      return;
    }
    setView('stage-game');
  }

  if (view === 'home') {
    return (
      <>
        {soundControl}
        <HomePage onPlay={() => setView('stages')} onProgress={() => setView('progress')} />
      </>
    );
  }

  if (view === 'stages') {
    return (
      <>
        {soundControl}
        <StageSelectionPage
          progress={progress}
          onBack={() => setView('home')}
          onProgress={() => setView('progress')}
          onOpenStage={openStage}
        />
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
          onStages={() => setView('stages')}
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

  if (view === 'stage-game' && selectedStage) {
    return (
      <>
        {soundControl}
        <StageGamePage
          stage={selectedStage}
          onBack={() => setView('stages')}
          onComplete={(stage, stars) => {
            completeStage(stage.id, stars, stage.skill);
            setView('stages');
          }}
          onCorrectSound={calmSound.playCorrect}
          onRetrySound={calmSound.playRetry}
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
        onStages={() => setView('stages')}
      />
    </>
  );
}
