import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import type { Challenge } from '../types';
import { Button } from './Button';

interface ChallengeCardProps {
  challenge: Challenge;
  onCorrect: () => void;
  feedback: string;
  retryFeedback: string;
  onCorrectSound: () => void;
  onRetrySound: () => void;
  onHintSound: () => void;
}

export function ChallengeCard({
  challenge,
  onCorrect,
  feedback,
  retryFeedback,
  onCorrectSound,
  onRetrySound,
  onHintSound,
}: ChallengeCardProps) {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [message, setMessage] = useState('');
  const [showHint, setShowHint] = useState(false);
  const items = useMemo(() => {
    return Array.from({ length: challenge.totalItems ?? 0 }, (_, index) => index);
  }, [challenge.totalItems]);

  const isNumberChallenge = challenge.type === 'number';

  function chooseAnswer(answer: string) {
    if (answer === challenge.answer) {
      onCorrectSound();
      setMessage(feedback);
      window.setTimeout(onCorrect, 650);
      return;
    }

    onRetrySound();
    setMessage(retryFeedback);
    setShowHint(true);
  }

  function toggleItem(index: number) {
    setSelectedItems((current) => {
      if (current.includes(index)) return current.filter((item) => item !== index);
      return [...current, index];
    });
  }

  function checkCount() {
    if (selectedItems.length === challenge.targetCount) {
      onCorrectSound();
      setMessage(feedback);
      window.setTimeout(onCorrect, 650);
      return;
    }

    onRetrySound();
    setMessage(retryFeedback);
    setShowHint(true);
  }

  function toggleHint() {
    onHintSound();
    setShowHint((value) => !value);
  }

  return (
    <section className="challenge-card" aria-live="polite">
      <div className="challenge-card__header">
        <h2>{challenge.prompt}</h2>
        <Button
          variant="ghost"
          icon="💡"
          onClick={toggleHint}
          aria-label="Ver pista"
        >
          Pista
        </Button>
      </div>

      {showHint ? <p className="hint">{challenge.hint}</p> : null}

      {isNumberChallenge ? (
        <>
          <div className="count-area" role="group" aria-label="Gotitas para contar">
            {items.map((item) => {
              const selected = selectedItems.includes(item);
              return (
                <button
                  key={item}
                  className={`count-item ${selected ? 'count-item--selected' : ''}`}
                  onClick={() => toggleItem(item)}
                  aria-pressed={selected}
                  aria-label={`Gotita ${item + 1}`}
                  style={{ '--item-color': challenge.itemColor } as CSSProperties}
                >
                  <span aria-hidden="true">{challenge.itemIcon}</span>
                </button>
              );
            })}
          </div>
          <div className="challenge-card__actions">
            <span className="count-total">Tocaste {selectedItems.length}</span>
            <Button onClick={checkCount} icon="✓" aria-label="Revisar respuesta">
              Revisar
            </Button>
          </div>
        </>
      ) : (
        <div className={`choice-grid choice-grid--${challenge.type}`} role="group" aria-label="Opciones">
          {challenge.choices?.map((choice) => (
            <button
              key={choice.id}
              className="choice"
              onClick={() => chooseAnswer(choice.id)}
              aria-label={choice.ariaLabel ?? choice.label}
              style={{ '--choice-color': choice.color ?? '#ffffff' } as CSSProperties}
            >
              <span className="choice__icon" aria-hidden="true">{choice.icon}</span>
              <strong>{choice.label}</strong>
            </button>
          ))}
        </div>
      )}

      {message ? <p className="feedback">{message}</p> : null}
    </section>
  );
}
