import { Button } from '../components/Button';
import { MonsterCard } from '../components/MonsterCard';
import { monsters } from '../data/monsters';
import type { GameProgress, Monster } from '../types';

interface PatientSelectionPageProps {
  progress: GameProgress;
  onSelect: (monster: Monster) => void;
  onBack: () => void;
  onProgress: () => void;
}

export function PatientSelectionPage({ progress, onSelect, onBack, onProgress }: PatientSelectionPageProps) {
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
        <p className="eyebrow">Sala de espera</p>
        <h1>Elige un paciente</h1>
        <p>Todos los monstruitos reciben ayuda con calma y cariño.</p>
      </section>

      <section className="patient-grid" aria-label="Pacientes disponibles">
        {monsters.map((monster) => (
          <MonsterCard
            key={monster.id}
            monster={monster}
            completed={progress.completedPatients.includes(monster.id)}
            onSelect={onSelect}
          />
        ))}
      </section>
    </main>
  );
}
