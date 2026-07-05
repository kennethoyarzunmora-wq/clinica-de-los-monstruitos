import { Button } from '../components/Button';

interface HomePageProps {
  onPlay: () => void;
  onProgress: () => void;
}

export function HomePage({ onPlay, onProgress }: HomePageProps) {
  return (
    <main className="page home-page">
      <section className="hero" aria-labelledby="game-title">
        <div className="hero__clinic" aria-hidden="true">
          <span className="clinic-shape clinic-shape--heart">💗</span>
          <span className="clinic-shape clinic-shape--star">⭐</span>
          <span className="clinic-shape clinic-shape--drop">💧</span>
        </div>
        <div className="hero__content">
          <p className="eyebrow">Juego educativo</p>
          <h1 id="game-title">Clínica de los Monstruitos</h1>
          <p>Ayuda a los monstruitos a sentirse mejor</p>
          <div className="hero__actions">
            <Button onClick={onPlay} icon="▶" aria-label="Jugar Clínica de los Monstruitos">
              Jugar
            </Button>
            <Button variant="secondary" onClick={onProgress} icon="🏅" aria-label="Ver progreso">
              Ver progreso
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
