# Publicar el juego para iPhone sin PC

El juego ya funciona como PWA. Para que no dependa del PC, debe estar publicado en una URL HTTPS. Después se instala en el iPhone desde Safari.

## Opción Recomendada: Netlify

1. Crea una cuenta en Netlify.
2. Sube este proyecto a GitHub.
3. En Netlify, elige Add new site > Import an existing project.
4. Selecciona el repositorio.
5. Netlify detectará esta configuración:

```txt
Build command: npm run build
Publish directory: dist
```

6. Publica el sitio.
7. Abre la URL de Netlify en Safari desde el iPhone.
8. Toca Compartir > Agregar a pantalla de inicio.

## Opción Recomendada: Vercel

1. Crea una cuenta en Vercel.
2. Sube este proyecto a GitHub.
3. En Vercel, importa el repositorio.
4. Vercel usará `vercel.json` y publicará `dist`.
5. Abre la URL publicada desde Safari en iPhone.
6. Toca Compartir > Agregar a pantalla de inicio.

## Modo Offline

Después de abrir el juego publicado una vez, el service worker guarda los archivos principales. El niño puede abrirlo desde el icono instalado aunque el PC esté apagado.

El progreso queda guardado en el iPhone usando `localStorage`.

## Importante Sobre iPhone

iOS exige HTTPS para instalar una PWA y permitir cache offline. Por eso `localhost` sirve solo para desarrollo. La versión independiente necesita una URL publicada.

## Qué Se Publica

Solo se publica la carpeta `dist/`, creada con:

```bash
npm run build
```

No se publica `node_modules`.
