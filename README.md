# 🚰 Plumber Dash — Pipe Kingdom

Juego infinito de **un solo botón** (toca la pantalla para "volar"), inspirado en la
mecánica de *Flappy Bird* mezclada con la estética de un fontanero retro que esquiva
tuberías verdes. Todo el arte, la música y los efectos de sonido son **100% originales**,
generados por código (canvas + Web Audio API), sin usar ningún asset con copyright.

Es una **PWA (Progressive Web App)**: al añadirla a la pantalla de inicio en iPhone o
Android, se abre en pantalla completa como una app nativa, sin barra de direcciones ni
iconos del navegador.

## 📁 Estructura del repositorio

```
plumber-dash/
├── index.html          # Página principal + meta tags PWA
├── style.css            # Estilos, pantalla completa, sin gestos del navegador
├── game.js               # Lógica del juego, física, dibujo en canvas
├── audio.js              # Música y efectos de sonido sintetizados por código
├── manifest.json         # Manifiesto PWA (modo standalone)
├── service-worker.js     # Cache offline para arranque instantáneo como app
├── icons/
│   ├── icon-192.png
│   ├── icon-512.png
│   └── apple-touch-icon.png
└── README.md
```

## ▶️ Cómo jugar

- **Toca la pantalla** (o pulsa `Espacio` / `↑` en escritorio) para que el personaje
  "aletee" hacia arriba.
- Esquiva las tuberías verdes que aparecen sin parar (modo infinito).
- La dificultad aumenta poco a poco: las tuberías se mueven más rápido y el hueco se
  reduce ligeramente con el tiempo.
- Tu mejor puntuación se guarda en el dispositivo (`localStorage`).

## 🚀 Publicarlo en GitHub Pages

1. Crea un repositorio nuevo en GitHub y sube todos estos archivos a la raíz.
2. Ve a **Settings → Pages**.
3. En **Source**, selecciona la rama `main` y la carpeta `/ (root)`.
4. Guarda. GitHub te dará una URL tipo:
   `https://tu-usuario.github.io/tu-repositorio/`
5. Abre esa URL en el navegador del móvil (Safari en iPhone, Chrome en Android).

> ⚠️ Importante: las PWA (service worker, "Añadir a inicio" sin barra del navegador)
> **requieren HTTPS**. GitHub Pages ya sirve todo por HTTPS automáticamente, así que
> no necesitas configurar nada extra.

## 📲 Añadir a la pantalla de inicio

### iPhone (Safari)
1. Abre la URL del juego en Safari.
2. Pulsa el botón compartir (el cuadrado con la flecha hacia arriba).
3. Selecciona **"Añadir a pantalla de inicio"**.
4. Al abrir el icono desde el escritorio, el juego se abrirá **a pantalla completa**,
   sin la barra de Safari ni enlaces visibles.

### Android (Chrome)
1. Abre la URL del juego en Chrome.
2. Toca el menú (⋮) → **"Añadir a pantalla de inicio"** / **"Instalar app"**.
3. Confirma. El icono aparecerá como una app normal y se abrirá en modo standalone.

## 🛠️ Probarlo en local

No necesitas build ni dependencias, es HTML/CSS/JS puro. Solo necesitas servirlo con
un servidor local (el service worker no funciona con `file://`):

```bash
# con Python
python3 -m http.server 8080

# o con Node
npx serve .
```

Luego abre `http://localhost:8080` en el navegador de tu móvil (misma red Wi-Fi) o en
el escritorio.

## ⚖️ Nota sobre el contenido

Este proyecto **no utiliza personajes, sprites, música ni marcas registradas de
Nintendo**. El personaje, el arte de las tuberías y la música son creaciones originales
inspiradas de forma genérica en el género de plataformas retro con tuberías, para evitar
cualquier infracción de derechos de autor o marca. Si vas a publicar o distribuir el
juego, se recomienda mantener nombres y arte propios (como en este repositorio) en
lugar de usar directamente "Mario" o assets oficiales.

## 🧩 Personalizar

- **Velocidad / dificultad**: ajusta `PIPE_SPEED`, `PIPE_GAP` y `PIPE_INTERVAL` en `game.js`.
- **Colores del personaje**: modifica la función `drawHero()` en `game.js`.
- **Música**: la melodía es un array de frecuencias (`melody`) en `audio.js`, puedes
  cambiar las notas o el tempo (`setInterval(..., 150)`).
- **Icono de la app**: regenera `icons/icon-192.png` e `icons/icon-512.png` con tu
  propio diseño (mismo tamaño).

¡Disfruta esquivando tuberías! 🟢
