import { useMemo, useState } from 'react';
import { Button } from '../components/Button';
import { ChallengeCard } from '../components/ChallengeCard';
import { MonsterAvatar } from '../components/MonsterAvatar';
import { ProgressBar } from '../components/ProgressBar';
import { RewardBadge } from '../components/RewardBadge';
import { challenges, gentleRetryMessages, positiveMessages } from '../data/challenges';
import { badges } from '../data/rewards';
import type { Monster } from '../types';

interface ClinicRoomPageProps {
  monster: Monster;
  onBack: () => void;
  onPatientComplete: (monster: Monster) => void;
  onChallengeComplete: (monster: Monster) => void;
  onStages: () => void;
  onCorrectSound: () => void;
  onRetrySound: () => void;
  onHintSound: () => void;
  onCompleteSound: () => void;
}

function randomItem(items: string[]) {
  return items[Math.floor(Math.random() * items.length)];
}

export function ClinicRoomPage({
  monster,
  onBack,
  onPatientComplete,
  onChallengeComplete,
  onStages,
  onCorrectSound,
  onRetrySound,
  onHintSound,
  onCompleteSound,
}: ClinicRoomPageProps) {
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const monsterChallenges = useMemo(
    () => challenges.filter((challenge) => challenge.monsterId === monster.id),
    [monster.id],
  );
  const currentChallenge = monsterChallenges[step];
  const badge = badges.find((item) => item.id === monster.badgeId);

  function handleCorrect() {
    onChallengeComplete(monster);

    if (step + 1 >= monsterChallenges.length) {
      setFinished(true);
      onCompleteSound();
      onPatientComplete(monster);
      return;
    }

    setStep((current) => current + 1);
  }

  if (finished && badge) {
    return (
      <main className="page clinic-page">
        <section className="recovery">
          <MonsterAvatar monster={monster} mood="happy" large />
          <div>
            <p className="eyebrow">Consulta completa</p>
            <h1>¡Paciente recuperado!</h1>
            <p>{monster.name} se siente mucho mejor.</p>
          </div>
          <RewardBadge badge={badge} />
          <Button onClick={onBack} variant="success" icon="➕" aria-label="Atender otro monstruito">
            Atender otro monstruito
          </Button>
          <Button onClick={onStages} variant="secondary" icon="🗺" aria-label="Ver mapa de etapas">
            Ver etapas
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className="page clinic-page">
      <header className="topbar">
        <Button variant="ghost" icon="←" onClick={onBack} aria-label="Volver a selección de paciente">
          Pacientes
        </Button>
      </header>

      <section className="clinic-layout">
        <aside className="patient-panel" aria-label={`Paciente ${monster.name}`}>
          <MonsterAvatar monster={monster} large />
          <h1>{monster.name}</h1>
          <p>{monster.problem}</p>
          <small>{monster.skill}</small>
        </aside>

        <div className="challenge-panel">
          <ProgressBar current={step + 1} total={monsterChallenges.length} />
          {currentChallenge ? (
            <ChallengeCard
              key={currentChallenge.id}
              challenge={currentChallenge}
              onCorrect={handleCorrect}
              feedback={randomItem(positiveMessages)}
              retryFeedback={randomItem(gentleRetryMessages)}
              onCorrectSound={onCorrectSound}
              onRetrySound={onRetrySound}
              onHintSound={onHintSound}
            />
          ) : null}
        </div>
      </section>
    </main>
  );
}
