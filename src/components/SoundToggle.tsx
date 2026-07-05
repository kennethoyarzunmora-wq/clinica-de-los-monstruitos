import { Button } from './Button';

interface SoundToggleProps {
  isSoundOn: boolean;
  onToggle: () => void;
}

export function SoundToggle({ isSoundOn, onToggle }: SoundToggleProps) {
  return (
    <div className="sound-toggle">
      <Button
        variant="ghost"
        icon={isSoundOn ? '♪' : '○'}
        onClick={onToggle}
        aria-label={isSoundOn ? 'Desactivar sonido tranquilo' : 'Activar sonido tranquilo'}
      >
        {isSoundOn ? 'Sonido' : 'Silencio'}
      </Button>
    </div>
  );
}
