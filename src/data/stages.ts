import type { LearningStage } from '../types';

export const stages: LearningStage[] = [
  {
    id: 1,
    title: 'Consulta cariñosa',
    subtitle: 'Atiende a los 5 monstruitos',
    skill: 'Números, colores, emociones, secuencias y letras',
    icon: '🩺',
    difficulty: 'Inicio',
    kind: 'clinic',
  },
  {
    id: 2,
    title: 'Sacos de manzanas',
    subtitle: 'Llena primero 🔴 y después 🟡',
    skill: 'Control inhibitorio y colores',
    icon: '🍎',
    difficulty: 'Un poco más difícil',
    kind: 'snake-colors',
  },
  {
    id: 3,
    title: 'Memoria de emociones',
    subtitle: 'Encuentra las parejas de caritas',
    skill: 'Memoria visual y emociones',
    icon: '😊',
    difficulty: 'Atención',
    kind: 'emotion-memory',
  },
  {
    id: 4,
    title: 'Receta en orden',
    subtitle: 'Mira el patrón y toca el dibujo',
    skill: 'Patrones y planificación',
    icon: '🔴',
    difficulty: 'Secuencias',
    kind: 'sequence-builder',
  },
  {
    id: 5,
    title: 'Sonidos iniciales',
    subtitle: 'Mira el dibujo y toca la opción',
    skill: 'Conciencia fonológica y números hasta 20',
    icon: '🔤',
    difficulty: 'Desafío final',
    kind: 'sound-match',
  },
];
