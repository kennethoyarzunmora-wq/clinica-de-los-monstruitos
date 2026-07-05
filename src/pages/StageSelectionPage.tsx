import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { stages } from '../data/stages';
import type { GameProgress, LearningStage } from '../types';

interface StageSelectionPageProps {
  progress: GameProgress;
  onBack: () => void;
  onProgress: () => void;
  onOpenStage: (stage: LearningStage) => void;
}

function isStageUnlocked(stageId: number, progress: GameProgress) {
  if (stageId === 1) return true;
  return progress.completedStages.includes(stageId - 1);
}

export function StageSelectionPage({ progress, onBack, onProgress, onOpenStage }: StageSelectionPageProps) {
  return (
    <main className="page page--soft">
      <header className="topbar">
        <Button variant="ghost" icon="←" onClick={onBack} aria-label="Volver al inicio">
          Inicio
        </Button>
        <Button variant="secondary" icon="🏅" onClick={onProgress} aria-label="Ver progreso">
          Progreso
        </Button>
      </header>

      <section className="section-heading">
        <p className="eyebrow">Mapa de aventura</p>
        <h1>Elige una etapa</h1>
        <p>Completa una etapa para abrir la siguiente.</p>
      </section>

      <section className="stage-map" aria-label="Etapas del juego">
        {stages.map((stage) => {
          const unlocked = isStageUnlocked(stage.id, progress);
          const completed = progress.completedStages.includes(stage.id);
          const stars = progress.stageStars[stage.id] ?? 0;

          return (
            <article key={stage.id} className={`stage-card ${!unlocked ? 'stage-card--locked' : ''}`}>
              <div className="stage-card__icon" aria-hidden="true">{unlocked ? stage.icon : '🔒'}</div>
              <div className="stage-card__body">
                <span className="stage-card__level">Etapa {stage.id} · {stage.difficulty}</span>
                <h2>{stage.title}</h2>
                <p>{stage.subtitle}</p>
                <small>{stage.skill}</small>
                <div className="stage-stars" aria-label={`${stars} estrellas`}>
                  {Array.from({ length: 3 }, (_, index) => (
                    <span key={index} aria-hidden="true">{index < stars ? '★' : '☆'}</span>
                  ))}
                </div>
              </div>
              <Button
                variant={completed ? 'success' : 'primary'}
                icon={completed ? '✓' : '▶'}
                disabled={!unlocked}
                onClick={() => onOpenStage(stage)}
                aria-label={`${completed ? 'Repetir' : 'Jugar'} ${stage.title}`}
              >
                {completed ? 'Repetir' : unlocked ? 'Jugar' : 'Bloqueada'}
              </Button>
            </article>
          );
        })}
      </section>
    </main>
  );
}
