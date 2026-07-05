import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { RewardBadge } from '../components/RewardBadge';
import { badges } from '../data/rewards';
import { monsters } from '../data/monsters';
import type { GameProgress } from '../types';

interface ProgressPageProps {
  progress: GameProgress;
  completionPercent: number;
  onBack: () => void;
  onReset: () => void;
}

function formatDate(date: string | null) {
  if (!date) return 'Aún no hay juego guardado';
  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function ProgressPage({ progress, completionPercent, onBack, onReset }: ProgressPageProps) {
  return (
    <main className="page page--soft">
      <header className="topbar">
        <Button variant="ghost" icon="←" onClick={onBack} aria-label="Volver">
          Volver
        </Button>
      </header>

      <section className="section-heading">
        <p className="eyebrow">Panel de progreso</p>
        <h1>Avances guardados</h1>
        <p>No se guardan datos personales.</p>
      </section>

      <section className="progress-summary">
        <ProgressBar current={progress.completedPatients.length} total={monsters.length} label={`${completionPercent}% de pacientes atendidos`} />
        <div className="stat-grid">
          <article>
            <strong>{progress.completedPatients.length}</strong>
            <span>Pacientes atendidos</span>
          </article>
          <article>
            <strong>{progress.earnedBadges.length}</strong>
            <span>Stickers ganados</span>
          </article>
          <article>
            <strong>{progress.completedChallenges}</strong>
            <span>Retos completados</span>
          </article>
          <article>
            <strong>{progress.completedStages.length}</strong>
            <span>Etapas completadas</span>
          </article>
        </div>
        <p className="last-played">Último juego: {formatDate(progress.lastPlayedAt)}</p>
      </section>

      <section className="progress-section">
        <h2>Stickers</h2>
        <div className="badge-grid">
          {badges.map((badge) => (
            <RewardBadge key={badge.id} badge={badge} locked={!progress.earnedBadges.includes(badge.id)} />
          ))}
        </div>
      </section>

      <section className="progress-section">
        <h2>Habilidades practicadas</h2>
        <div className="skill-list">
          {progress.practicedSkills.length ? (
            progress.practicedSkills.map((skill) => <span key={skill}>{skill}</span>)
          ) : (
            <p>Juega con un monstruito para empezar.</p>
          )}
        </div>
      </section>

      <section className="parent-panel" aria-label="Panel de adultos">
        <h2>Panel de adultos</h2>
        <p>Reinicia el progreso local de este dispositivo cuando lo necesites.</p>
        <Button variant="secondary" icon="↺" onClick={onReset} aria-label="Reiniciar progreso local">
          Reiniciar progreso
        </Button>
      </section>
    </main>
  );
}
