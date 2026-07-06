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

type Direction = 'up' | 'down' | 'left' | 'right';
type Point = { x: number; y: number };
type AppleColor = 'roja' | 'amarilla';
type SnakeItem = Point & { id: string; kind: 'apple' | 'bomb'; color?: AppleColor };
type VisualRound = {
  prompt: string;
  visual: string[];
  answer: string;
  options: { id: string; icon: string; label: string }[];
};

const boardSize = 5;
const bagGoal = 10;
const applesPerWave = 5;

const sequenceRounds: VisualRound[] = [
  {
    prompt: '¿Qué sigue?',
    visual: ['🔴', '🔵', '🔴', '🔵', '?'],
    answer: 'rojo',
    options: [
      { id: 'rojo', icon: '🔴', label: 'Rojo' },
      { id: 'verde', icon: '🟢', label: 'Verde' },
      { id: 'azul', icon: '🔵', label: 'Azul' },
    ],
  },
  {
    prompt: '¿Qué sigue?',
    visual: ['⬤', '●', '⬤', '●', '?'],
    answer: 'grande',
    options: [
      { id: 'pequeno', icon: '●', label: 'Pequeño' },
      { id: 'grande', icon: '⬤', label: 'Grande' },
      { id: 'estrella', icon: '⭐', label: 'Estrella' },
    ],
  },
  {
    prompt: '¿Qué sigue?',
    visual: ['1', '2', '3', '1', '2', '?'],
    answer: '3',
    options: [
      { id: '4', icon: '4', label: '4' },
      { id: '3', icon: '3', label: '3' },
      { id: '1', icon: '1', label: '1' },
    ],
  },
];

const soundRounds: VisualRound[] = [
  {
    prompt: 'Mira y elige',
    visual: ['☀️'],
    answer: 'S',
    options: [
      { id: 'S', icon: 'S', label: 'S' },
      { id: 'M', icon: 'M', label: 'M' },
      { id: 'N', icon: 'N', label: 'N' },
    ],
  },
  {
    prompt: 'Mira y elige',
    visual: ['💧', '💧', '💧', '💧', '💧', '💧', '💧', '💧', '💧', '💧', '💧', '💧', '💧', '💧', '💧', '💧', '💧', '💧'],
    answer: '18',
    options: [
      { id: '15', icon: '15', label: '15' },
      { id: '18', icon: '18', label: '18' },
      { id: '20', icon: '20', label: '20' },
    ],
  },
  {
    prompt: 'Mira y elige',
    visual: ['🟠'],
    answer: 'B',
    options: [
      { id: 'P', icon: 'P', label: 'P' },
      { id: 'B', icon: 'B', label: 'B' },
      { id: 'L', icon: 'L', label: 'L' },
    ],
  },
];

const memoryIcons = ['😊', '😢', '😮', '😠', '😌', '🤔', '💗', '⭐', '🌈', '🩺', '💧', '☀️'];

function makeMemoryCards(pairCount: number) {
  return memoryIcons.slice(0, pairCount).flatMap((icon, index) => [
    { id: `${icon}-${index}-a`, pair: icon, icon },
    { id: `${icon}-${index}-b`, pair: icon, icon },
  ]);
}

function makeWave(color: AppleColor, wave: number, snake: Point): SnakeItem[] {
  const slots: Point[] = [];

  for (let y = 0; y < boardSize; y += 1) {
    for (let x = 0; x < boardSize; x += 1) {
      if (x !== snake.x || y !== snake.y) slots.push({ x, y });
    }
  }

  const rotated = [...slots].sort(() => Math.random() - 0.5);
  const apples = rotated.slice(0, applesPerWave).map((slot, index) => ({
    ...slot,
    id: `${color}-${wave}-${index}`,
    kind: 'apple' as const,
    color,
  }));
  const bombSlot = rotated[applesPerWave + 2] ?? rotated[applesPerWave];

  return [
    ...apples,
    {
      ...bombSlot,
      id: `bomb-${color}-${wave}`,
      kind: 'bomb',
    },
  ];
}

function clampPoint(point: Point): Point {
  return {
    x: Math.min(boardSize - 1, Math.max(0, point.x)),
    y: Math.min(boardSize - 1, Math.max(0, point.y)),
  };
}

function starsFromAttempts(successes: number, attempts: number, total: number) {
  if (successes >= total && attempts <= total + 4) return 3;
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
  const [message, setMessage] = useState('Mira los dibujos y juega con calma.');
  const [finished, setFinished] = useState(false);
  const [wonStars, setWonStars] = useState(3);
  const [snake, setSnake] = useState<Point>({ x: 0, y: 0 });
  const [snakeMouthOpen, setSnakeMouthOpen] = useState(false);
  const [bagColor, setBagColor] = useState<AppleColor>('roja');
  const [redBag, setRedBag] = useState(0);
  const [yellowBag, setYellowBag] = useState(0);
  const [snakeAttempts, setSnakeAttempts] = useState(0);
  const [wave, setWave] = useState(0);
  const [snakeItems, setSnakeItems] = useState<SnakeItem[]>(() => makeWave('roja', 0, { x: 0, y: 0 }));
  const [memoryLevel, setMemoryLevel] = useState(0);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [memoryAttempts, setMemoryAttempts] = useState(0);
  const [round, setRound] = useState(0);
  const [roundAttempts, setRoundAttempts] = useState(0);

  const pairCount = memoryLevel === 0 ? 8 : 12;
  const visibleCards = useMemo(() => makeMemoryCards(pairCount), [pairCount]);
  const currentSequence = sequenceRounds[round];
  const currentSound = soundRounds[round];
  const currentBagCount = bagColor === 'roja' ? redBag : yellowBag;
  const memoryPairsFound = matched.length / 2;

  function finish(stars: number) {
    setWonStars(stars);
    setFinished(true);
    onCompleteSound();
  }

  function saveAndExit() {
    onComplete(stage, wonStars);
  }

  function openSnakeMouth() {
    setSnakeMouthOpen(true);
    window.setTimeout(() => setSnakeMouthOpen(false), 320);
  }

  function startNextWave(nextColor: AppleColor, nextWave: number, nextSnake: Point) {
    setSnakeItems(makeWave(nextColor, nextWave, nextSnake));
    setWave(nextWave);
  }

  function moveSnake(direction: Direction) {
    const next = clampPoint({
      x: snake.x + (direction === 'right' ? 1 : direction === 'left' ? -1 : 0),
      y: snake.y + (direction === 'down' ? 1 : direction === 'up' ? -1 : 0),
    });

    setSnake(next);
    setSnakeAttempts((value) => value + 1);

    const item = snakeItems.find((candidate) => candidate.x === next.x && candidate.y === next.y);
    if (!item) return;

    if (item.kind === 'bomb') {
      onRetrySound();
      openSnakeMouth();
      setSnakeItems((items) => items.filter((candidate) => candidate.id !== item.id));
      if (bagColor === 'roja') {
        setRedBag((value) => Math.max(0, value - 4));
      } else {
        setYellowBag((value) => Math.max(0, value - 4));
      }
      setMessage('¡Pum suave! La bomba quitó 4 manzanas del saco.');
      return;
    }

    if (item.color !== bagColor) {
      onRetrySound();
      setMessage(`Ahora llena el saco ${bagColor}. Busca ese color.`);
      return;
    }

    onCorrectSound();
    openSnakeMouth();
    const nextItems = snakeItems.filter((candidate) => candidate.id !== item.id);
    const nextCount = Math.min(bagGoal, currentBagCount + 1);

    if (bagColor === 'roja') {
      setRedBag(nextCount);
    } else {
      setYellowBag(nextCount);
    }

    setSnakeItems(nextItems);
    setMessage(`¡Ñam! Manzana ${bagColor} al saco.`);

    if (bagColor === 'roja' && nextCount >= bagGoal) {
      setBagColor('amarilla');
      startNextWave('amarilla', wave + 1, next);
      setMessage('Saco rojo completo. Ahora el saco amarillo.');
      return;
    }

    if (bagColor === 'amarilla' && nextCount >= bagGoal) {
      finish(starsFromAttempts(redBag + nextCount, snakeAttempts + 1, bagGoal * 2));
      return;
    }

    if (!nextItems.some((candidate) => candidate.kind === 'apple' && candidate.color === bagColor)) {
      startNextWave(bagColor, wave + 1, next);
      setMessage('Aparecieron más manzanas para el saco.');
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
      setFlipped([]);
      setMessage('Pareja encontrada.');

      if (nextMatched.length === visibleCards.length) {
        if (memoryLevel === 0) {
          setMemoryLevel(1);
          setMatched([]);
          setFlipped([]);
          setMessage('Ahora vienen más cartas.');
          return;
        }

        finish(starsFromAttempts(20, memoryAttempts + 1, 20));
      }
      return;
    }

    onRetrySound();
    setMessage('Mira otra vez. Sin apuro.');
    window.setTimeout(() => setFlipped([]), 750);
  }

  function chooseRoundAnswer(answer: string, rounds: VisualRound[]) {
    setRoundAttempts((value) => value + 1);
    if (answer !== rounds[round].answer) {
      onRetrySound();
      setMessage('Mira el dibujo y prueba otra vez.');
      return;
    }

    onCorrectSound();
    if (round + 1 >= rounds.length) {
      finish(starsFromAttempts(rounds.length, roundAttempts + 1, rounds.length));
      return;
    }

    setRound((value) => value + 1);
    setMessage('Bien. Mira el siguiente dibujo.');
  }

  if (finished) {
    return (
      <main className="page page--soft">
        <section className="stage-game stage-finale">
          <div className="confetti" aria-hidden="true">
            {Array.from({ length: 22 }, (_, index) => <span key={index} />)}
          </div>
          <div className="trophy" aria-hidden="true">🏆</div>
          <p className="eyebrow">Etapa completa</p>
          <h1>¡Lo lograste!</h1>
          <div className="stage-stars stage-stars--big" aria-label={`${wonStars} estrellas`}>
            {Array.from({ length: 3 }, (_, index) => (
              <span key={index} aria-hidden="true">{index < wonStars ? '★' : '☆'}</span>
            ))}
          </div>
          <Button variant="success" icon="✓" onClick={saveAndExit} aria-label="Guardar etapa">
            Guardar
          </Button>
        </section>
      </main>
    );
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
            <div className="bag-row" aria-label="Sacos de manzanas">
              <div className={`apple-bag ${bagColor === 'roja' ? 'apple-bag--active' : ''}`}>
                <span aria-hidden="true">🧺</span>
                <strong>🔴 {redBag}/{bagGoal}</strong>
              </div>
              <div className={`apple-bag ${bagColor === 'amarilla' ? 'apple-bag--active' : ''}`}>
                <span aria-hidden="true">🧺</span>
                <strong>🟡 {yellowBag}/{bagGoal}</strong>
              </div>
            </div>
            <ProgressBar current={redBag + yellowBag} total={bagGoal * 2} label={`Sacos ${redBag + yellowBag} de ${bagGoal * 2}`} />
            <div className="snake-board" aria-label="Tablero de culebrita">
              {Array.from({ length: boardSize * boardSize }, (_, index) => {
                const x = index % boardSize;
                const y = Math.floor(index / boardSize);
                const item = snakeItems.find((candidate) => candidate.x === x && candidate.y === y);
                const hasSnake = snake.x === x && snake.y === y;
                return (
                  <div key={`${x}-${y}`} className="snake-cell">
                    {hasSnake ? (
                      <span className={`snake-piece ${snakeMouthOpen ? 'snake-piece--munch' : ''}`} aria-label="Culebrita">
                        <span className="snake-mouth" />
                      </span>
                    ) : null}
                    {item?.kind === 'apple' ? <span className={`fruit fruit--${item.color}`}>●</span> : null}
                    {item?.kind === 'bomb' ? <span className="soft-bomb" aria-label="Bomba">●</span> : null}
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
            <ProgressBar current={memoryPairsFound} total={pairCount} label={`${visibleCards.length} cartas`} />
            <div className={`memory-grid ${visibleCards.length === 24 ? 'memory-grid--large' : ''}`}>
              {visibleCards.map((card) => {
                const open = flipped.includes(card.id) || matched.includes(card.id);
                return (
                  <button
                    key={card.id}
                    className={`memory-card ${open ? 'memory-card--open' : ''}`}
                    onClick={() => chooseMemory(card.id)}
                    aria-label={open ? `Carta ${card.icon}` : 'Carta tapada'}
                  >
                    <span aria-hidden="true">{open ? card.icon : '?'}</span>
                  </button>
                );
              })}
            </div>
          </>
        ) : null}

        {stage.kind === 'sequence-builder' && currentSequence ? (
          <>
            <ProgressBar current={round + 1} total={sequenceRounds.length} />
            <VisualPrompt round={currentSequence} />
            <VisualOptions round={currentSequence} onChoose={(answer) => chooseRoundAnswer(answer, sequenceRounds)} />
          </>
        ) : null}

        {stage.kind === 'sound-match' && currentSound ? (
          <>
            <ProgressBar current={round + 1} total={soundRounds.length} />
            <VisualPrompt round={currentSound} compact />
            <VisualOptions round={currentSound} onChoose={(answer) => chooseRoundAnswer(answer, soundRounds)} letterMode />
          </>
        ) : null}

        <p className="feedback">{message}</p>
      </section>
    </main>
  );
}

function VisualPrompt({ round, compact = false }: { round: VisualRound; compact?: boolean }) {
  return (
    <div className={`visual-prompt ${compact ? 'visual-prompt--compact' : ''}`} aria-label={round.prompt}>
      {round.visual.map((item, index) => (
        <span key={`${item}-${index}`} aria-hidden="true">{item}</span>
      ))}
    </div>
  );
}

function VisualOptions({
  round,
  onChoose,
  letterMode = false,
}: {
  round: VisualRound;
  onChoose: (answer: string) => void;
  letterMode?: boolean;
}) {
  return (
    <div className={`choice-grid ${letterMode ? 'choice-grid--letter' : ''}`} role="group" aria-label="Opciones con dibujos">
      {round.options.map((option) => (
        <button key={option.id} className="choice" onClick={() => onChoose(option.id)} aria-label={option.label}>
          <span className="choice__icon" aria-hidden="true">{option.icon}</span>
        </button>
      ))}
    </div>
  );
}
