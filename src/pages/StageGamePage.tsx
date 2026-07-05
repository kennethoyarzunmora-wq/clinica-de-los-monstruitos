import { useMemo, useState } from 'react';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import type { LearningStage } from '../types';

interface StageGamePageProps {
  stage: LearningStage;
  onBack: () => void;
  onComplete: (stage: LearningStage, stars: number) => void;
  onCorrectSound: () => void;
  onRetrySound: () => void;
  onCompleteSound: () => void;
}

type Point = { x: number; y: number };
type Fruit = Point & { id: string; color: 'azul' | 'verde' | 'amarillo' };

const fruits: Fruit[] = [
  { id: 'f1', x: 1, y: 0, color: 'azul' },
  { id: 'f2', x: 3, y: 0, color: 'amarillo' },
  { id: 'f3', x: 4, y: 2, color: 'verde' },
  { id: 'f4', x: 0, y: 3, color: 'azul' },
  { id: 'f5', x: 2, y: 4, color: 'amarillo' },
  { id: 'f6', x: 4, y: 4, color: 'verde' },
  { id: 'f7', x: 2, y: 1, color: 'azul' },
];

const emotionCards = [
  { id: 'happy-1', pair: 'feliz', icon: '😊', label: 'Feliz' },
  { id: 'happy-2', pair: 'feliz', icon: '😊', label: 'Feliz' },
  { id: 'sad-1', pair: 'triste', icon: '😢', label: 'Triste' },
  { id: 'sad-2', pair: 'triste', icon: '😢', label: 'Triste' },
  { id: 'calm-1', pair: 'calma', icon: '😌', label: 'Calma' },
  { id: 'calm-2', pair: 'calma', icon: '😌', label: 'Calma' },
];

const sequenceRounds = [
  { prompt: 'rojo, azul, rojo, azul...', answer: 'rojo', options: ['rojo', 'verde', 'azul'] },
  { prompt: 'grande, pequeño, grande, pequeño...', answer: 'grande', options: ['pequeño', 'grande', 'estrella'] },
  { prompt: '1, 2, 3, 1, 2...', answer: '3', options: ['4', '3', '1'] },
];

const soundRounds = [
  { prompt: '¿Con qué letra empieza Sol?', answer: 'S', options: ['S', 'M', 'N'] },
  { prompt: 'Cuenta 18 gotitas. ¿Qué número es dieciocho?', answer: '18', options: ['15', '18', '20'] },
  { prompt: '¿Con qué letra empieza Buba?', answer: 'B', options: ['P', 'B', 'L'] },
];

type Round = {
  prompt: string;
  answer: string;
  options: string[];
};

function colorLabel(color: Fruit['color']) {
  return color === 'azul' ? 'Azul' : color === 'verde' ? 'Verde' : 'Amarillo';
}

function starsFromAttempts(successes: number, attempts: number, total: number) {
  if (successes >= total && attempts <= total + 1) return 3;
  if (successes >= total) return 2;
  return 1;
}

export function StageGamePage({
  stage,
  onBack,
  onComplete,
  onCorrectSound,
  onRetrySound,
  onCompleteSound,
}: StageGamePageProps) {
  const [message, setMessage] = useState('Tú puedes hacerlo con calma.');
  const [snake, setSnake] = useState<Point>({ x: 0, y: 0 });
  const [collected, setCollected] = useState<string[]>([]);
  const [snakeAttempts, setSnakeAttempts] = useState(0);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [memoryAttempts, setMemoryAttempts] = useState(0);
  const [round, setRound] = useState(0);
  const [roundAttempts, setRoundAttempts] = useState(0);
  const targetGoodFruits = fruits.filter((fruit) => fruit.color !== 'amarillo').length;
  const currentSequence = sequenceRounds[round];
  const currentSound = soundRounds[round];

  const visibleCards = useMemo(() => emotionCards, []);

  function finish(stars: number) {
    onCompleteSound();
    onComplete(stage, stars);
  }

  function moveSnake(direction: 'up' | 'down' | 'left' | 'right') {
    const next = {
      x: Math.min(4, Math.max(0, snake.x + (direction === 'right' ? 1 : direction === 'left' ? -1 : 0))),
      y: Math.min(4, Math.max(0, snake.y + (direction === 'down' ? 1 : direction === 'up' ? -1 : 0))),
    };
    setSnake(next);
    setSnakeAttempts((value) => value + 1);

    const fruit = fruits.find((item) => item.x === next.x && item.y === next.y && !collected.includes(item.id));
    if (!fruit) return;

    if (fruit.color === 'amarillo') {
      onRetrySound();
      setMessage('La amarilla se queda afuera. Busca azul o verde.');
      return;
    }

    onCorrectSound();
    const nextCollected = [...collected, fruit.id];
    setCollected(nextCollected);
    setMessage(`Muy bien. ${colorLabel(fruit.color)} sí ayuda.`);

    if (nextCollected.length >= targetGoodFruits) {
      finish(starsFromAttempts(nextCollected.length, snakeAttempts + 1, targetGoodFruits));
    }
  }

  function chooseMemory(cardId: string) {
    if (matched.includes(cardId) || flipped.includes(cardId) || flipped.length >= 2) return;
    const nextFlipped = [...flipped, cardId];
    setFlipped(nextFlipped);

    if (nextFlipped.length < 2) return;

    setMemoryAttempts((value) => value + 1);
    const [first, second] = nextFlipped.map((id) => visibleCards.find((card) => card.id === id));
    if (first?.pair === second?.pair) {
      onCorrectSound();
      const nextMatched = [...matched, first!.id, second!.id];
      setMatched(nextMatched);
      setMessage('¡Encontraste una pareja de emociones!');
      setFlipped([]);
      if (nextMatched.length === visibleCards.length) {
        finish(starsFromAttempts(3, memoryAttempts + 1, 3));
      }
      return;
    }

    onRetrySound();
    setMessage('Casi. Mira las caritas otra vez.');
    window.setTimeout(() => setFlipped([]), 750);
  }

  function chooseRoundAnswer(answer: string, rounds: Round[]) {
    setRoundAttempts((value) => value + 1);
    if (answer !== rounds[round].answer) {
      onRetrySound();
      setMessage('Casi. Observa el patrón una vez más.');
      return;
    }

    onCorrectSound();
    if (round + 1 >= rounds.length) {
      finish(starsFromAttempts(rounds.length, roundAttempts + 1, rounds.length));
      return;
    }

    setRound((value) => value + 1);
    setMessage('¡Bien pensado! Vamos con el siguiente.');
  }

  return (
    <main className="page page--soft">
      <header className="topbar">
        <Button variant="ghost" icon="←" onClick={onBack} aria-label="Volver a etapas">
          Etapas
        </Button>
      </header>

      <section className="stage-game">
        <div className="stage-game__intro">
          <span className="stage-game__icon" aria-hidden="true">{stage.icon}</span>
          <div>
            <p className="eyebrow">Etapa {stage.id}</p>
            <h1>{stage.title}</h1>
            <p>{stage.subtitle}</p>
          </div>
        </div>

        {stage.kind === 'snake-colors' ? (
          <>
            <ProgressBar current={collected.length} total={targetGoodFruits} label={`Frutas correctas ${collected.length} de ${targetGoodFruits}`} />
            <div className="snake-board" aria-label="Tablero de culebrita">
              {Array.from({ length: 25 }, (_, index) => {
                const x = index % 5;
                const y = Math.floor(index / 5);
                const fruit = fruits.find((item) => item.x === x && item.y === y && !collected.includes(item.id));
                const hasSnake = snake.x === x && snake.y === y;
                return (
                  <div key={`${x}-${y}`} className="snake-cell">
                    {hasSnake ? <span className="snake-piece" aria-label="Culebrita">〰</span> : null}
                    {fruit ? <span className={`fruit fruit--${fruit.color}`}>{fruit.color === 'amarillo' ? '●' : '●'}</span> : null}
                  </div>
                );
              })}
            </div>
            <div className="direction-pad" aria-label="Controles de culebrita">
              <Button variant="secondary" icon="↑" onClick={() => moveSnake('up')} aria-label="Mover arriba">Arriba</Button>
              <Button variant="secondary" icon="←" onClick={() => moveSnake('left')} aria-label="Mover izquierda">Izquierda</Button>
              <Button variant="secondary" icon="→" onClick={() => moveSnake('right')} aria-label="Mover derecha">Derecha</Button>
              <Button variant="secondary" icon="↓" onClick={() => moveSnake('down')} aria-label="Mover abajo">Abajo</Button>
            </div>
          </>
        ) : null}

        {stage.kind === 'emotion-memory' ? (
          <>
            <ProgressBar current={matched.length / 2} total={3} label={`Parejas ${matched.length / 2} de 3`} />
            <div className="memory-grid">
              {visibleCards.map((card) => {
                const open = flipped.includes(card.id) || matched.includes(card.id);
                return (
                  <button
                    key={card.id}
                    className={`memory-card ${open ? 'memory-card--open' : ''}`}
                    onClick={() => chooseMemory(card.id)}
                    aria-label={open ? card.label : 'Carta tapada'}
                  >
                    <span aria-hidden="true">{open ? card.icon : '?'}</span>
                    <strong>{open ? card.label : 'Mira'}</strong>
                  </button>
                );
              })}
            </div>
          </>
        ) : null}

        {stage.kind === 'sequence-builder' && currentSequence ? (
          <>
            <ProgressBar current={round + 1} total={sequenceRounds.length} />
            <h2>{currentSequence.prompt}</h2>
            <div className="choice-grid">
              {currentSequence.options.map((option) => (
                <button key={option} className="choice" onClick={() => chooseRoundAnswer(option, sequenceRounds)}>
                  <span className="choice__icon" aria-hidden="true">{option === 'rojo' ? '🔴' : option === 'azul' ? '🔵' : option === 'verde' ? '🟢' : option}</span>
                  <strong>{option}</strong>
                </button>
              ))}
            </div>
          </>
        ) : null}

        {stage.kind === 'sound-match' && currentSound ? (
          <>
            <ProgressBar current={round + 1} total={soundRounds.length} />
            <h2>{currentSound.prompt}</h2>
            <div className="choice-grid choice-grid--letter">
              {currentSound.options.map((option) => (
                <button key={option} className="choice" onClick={() => chooseRoundAnswer(option, soundRounds)}>
                  <span className="choice__icon" aria-hidden="true">{option}</span>
                  <strong>{option}</strong>
                </button>
              ))}
            </div>
          </>
        ) : null}

        <p className="feedback">{message}</p>
      </section>
    </main>
  );
}
