# Clínica de los Monstruitos

Juego educativo infantil creado con React, Vite y TypeScript para niños de 5 a 6 años. La experiencia propone atender monstruitos pacientes en una clínica mágica mediante mini-retos breves de números, colores, emociones, secuencias y letras iniciales.

## Instalación

```bash
npm install
npm run dev
```

Vite mostrará una URL local. El proyecto usa `--host 0.0.0.0`, por lo que también puede probarse desde iPad o iPhone conectados a la misma red usando la IP del computador y el puerto indicado por Vite.

## Uso Independiente en iPhone

La app está preparada como PWA instalable y con cache offline. Para que no dependa del PC encendido ni de la misma red Wi-Fi, debe publicarse en una URL HTTPS.

Flujo recomendado:

1. Publica el proyecto en Netlify, Vercel, GitHub Pages o Firebase Hosting.
2. Abre la URL publicada en Safari desde el iPhone.
3. Toca Compartir.
4. Elige Agregar a pantalla de inicio.
5. Abre el juego desde el icono instalado.

Después de la primera carga, el juego queda disponible como app instalada y guarda sus archivos principales para uso offline. El progreso se guarda localmente en el iPhone.

Guía detallada:

```txt
DEPLOY.md
```

Para generar la versión publicable:

```bash
npm run build
```

## Scripts

```bash
npm run dev      # servidor de desarrollo
npm run build    # validación TypeScript y build de producción
npm run preview  # vista previa del build
```

## Estructura

```txt
src/
  components/
    Button.tsx
    ChallengeCard.tsx
    MonsterAvatar.tsx
    MonsterCard.tsx
    ProgressBar.tsx
    RewardBadge.tsx
  data/
    challenges.ts
    monsters.ts
    rewards.ts
  hooks/
    useGameProgress.ts
  pages/
    ClinicRoomPage.tsx
    HomePage.tsx
    PatientSelectionPage.tsx
    ProgressPage.tsx
  styles/
    global.css
  App.tsx
  main.tsx
  types.ts
```

## Contenido del juego

- 5 monstruitos: Lulo, Mimi, Toto, Buba y Nina.
- 3 mini-retos por paciente.
- Conteo de gotitas hasta 15, con base preparada para extender hasta 20.
- Reconocimiento de emociones, colores, secuencias y letras iniciales.
- Stickers desbloqueables al completar pacientes.
- Panel de progreso local.

## Progreso y privacidad

El progreso se guarda en `localStorage` con:

- Pacientes atendidos.
- Stickers ganados.
- Habilidades practicadas.
- Total de retos completados.
- Fecha de último juego.

No se solicitan ni guardan nombres reales, correos, ubicación u otros datos personales. No hay anuncios, compras, rankings ni temporizadores.

## Accesibilidad y UX infantil

- Botones grandes y cómodos para táctil.
- Navegación con teclado.
- `aria-label` en acciones importantes.
- Mensajes positivos y pistas amables.
- Diseño responsive para desktop, tablet, iPad y iPhone.
- Respeta `prefers-reduced-motion`.
- Manifest PWA, service worker offline e iconos para pantalla de inicio.
- Sonido opcional generado con Web Audio: ambiente muy suave, campanitas de acierto, pista y recuperación.

## Sonido tranquilo

El sonido viene apagado por defecto y se activa con el botón Sonido. Esto evita reproducción inesperada y permite que funcione correctamente en iPhone, donde Safari exige que el audio empiece después de un toque del usuario.

Los sonidos son sintetizados en el navegador, sin archivos externos:

- Ambiente lento y de bajo volumen.
- Aciertos con tonos ascendentes suaves.
- Reintentos con tonos breves y amables.
- Pistas con una señal clara, no agresiva.

## Ampliación

Para agregar más retos, edita `src/data/challenges.ts`. Para subir el conteo de Lulo hasta 20, agrega o ajusta un reto de tipo `number` con `targetCount: 20` y `totalItems: 20`.
