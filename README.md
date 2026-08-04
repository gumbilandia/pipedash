# 🚰 Plumber Dash — Pipe Kingdom

Juego infinito de **un solo botón** (toca la pantalla para "volar"), inspirado en la
mecánica de *Flappy Bird* mezclada con la estética de un fontanero retro que esquiva
tuberías verdes.

Todo — HTML, CSS, JavaScript, música, efectos de sonido e iconos — está **en un único
archivo `index.html`**, sin dependencias externas. Ábrelo con doble clic y funciona
directamente en el navegador, sin servidor, sin `npm install`, sin nada.

## 🐞 Corrección importante en esta versión

En la versión anterior (varios archivos), tocar la pantalla de inicio **no hacía nada**:
la pantalla "TOCA PARA JUGAR" estaba **encima** del `<canvas>` y absorbía el toque sin
avisarle al juego que empezara. En esta versión el toque se escucha en toda la ventana,
así que funciona sin importar qué pantalla esté visible encima.

## ▶️ Cómo jugar

1. Abre `index.html` (doble clic, o arrástralo a Chrome/Safari/Firefox).
2. Toca/haz clic en cualquier parte de la pantalla para que el personaje "aletee" hacia
   arriba (o pulsa `Espacio` / `↑` en escritorio).
3. Esquiva las tuberías verdes. El juego es infinito: la dificultad sube poco a poco.
4. Tu mejor puntuación se guarda en el navegador (`localStorage`).
5. Botón **⏸️ pausa** (arriba a la derecha, junto al de sonido): aparece solo mientras
   estás jugando. Congela toda la física, el fondo y la música. Vuelve a tocarlo, o toca
   la pantalla de "PAUSA", para continuar exactamente donde lo dejaste.

## 📲 Añadir a la pantalla de inicio (iPhone / Android)

El archivo incluye los metadatos de PWA (manifest e iconos embebidos como `data:` URIs),
así que puedes:

1. Subir `index.html` a cualquier hosting con HTTPS (GitHub Pages, Netlify, Vercel...).
2. Abrir esa URL en el móvil.
3. iPhone (Safari): botón compartir → **"Añadir a pantalla de inicio"**.
   Android (Chrome): menú (⋮) → **"Añadir a pantalla de inicio" / "Instalar app"**.
4. Se abrirá en pantalla completa, sin barra de direcciones ni enlaces visibles.

> ℹ️ Abierto directamente desde el disco (`file://`) el juego funciona igual de bien,
> pero el "Añadir a pantalla de inicio" en modo standalone completo (con caché offline)
> requiere que esté servido por HTTPS. Es un límite de los navegadores, no del juego.
> GitHub Pages te da ese HTTPS gratis en un par de clics.

## 🚀 Publicarlo en GitHub Pages

```bash
unzip plumber-dash.zip
cd plumber-dash
git init
git add .
git commit -m "Plumber Dash - juego infinito de un solo botón (archivo único)"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

Luego: **Settings → Pages → Source: rama `main`, carpeta `/root`**. GitHub te da una URL
`https://tu-usuario.github.io/tu-repo/` servida por HTTPS.

## 🛠️ Personalizar

Todo el código está comentado dentro de `index.html`:
- Física y dificultad: busca `GRAVITY`, `FLAP_VELOCITY`, `PIPE_SPEED`, `PIPE_GAP`.
- Dibujo del personaje: función `drawHero()`.
- Música: array `melody` (frecuencias) y el `setInterval(..., 150)` que marca el tempo.
- Iconos de la app: reemplaza los `data:image/png;base64,...` en el `<head>` por los
  tuyos (conviértelos a base64 y pégalos igual).

## ⚖️ Nota sobre el contenido

No se usan personajes, sprites, música ni marcas registradas de Nintendo. El personaje,
las tuberías y la música son creaciones originales inspiradas de forma genérica en el
género de plataformas retro con tuberías, para evitar cualquier infracción de derechos
de autor o marca.

¡Disfruta esquivando tuberías! 🟢
