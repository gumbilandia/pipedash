// game.js
// Juego infinito de un solo botón (tocar = volar), inspirado en el género
// "flappy" mezclado con la estética de un fontanero retro y tuberías verdes.
// Personaje y arte 100% originales, dibujados por código en <canvas>.

(() => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');

  const scoreEl = document.getElementById('score');
  const bestEl = document.getElementById('best');
  const startScreen = document.getElementById('startScreen');
  const gameOverScreen = document.getElementById('gameOverScreen');
  const finalScoreEl = document.getElementById('finalScore');
  const bestScoreTextEl = document.getElementById('bestScoreText');
  const muteBtn = document.getElementById('muteBtn');

  let W = 0, H = 0, DPR = 1;

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  // ---------- Estado ----------
  const STATE = { START: 0, PLAYING: 1, GAMEOVER: 2 };
  let state = STATE.START;

  const BEST_KEY = 'plumberDash_best';
  let best = parseInt(localStorage.getItem(BEST_KEY) || '0', 10);
  bestEl.textContent = 'Mejor: ' + best;

  // ---------- Mundo ----------
  const GRAVITY = 1900;       // px/s^2
  const FLAP_VELOCITY = -560; // px/s
  const MAX_FALL = 900;
  let PIPE_GAP = 200;
  let PIPE_SPEED = 190;
  const PIPE_WIDTH = 78;
  const GROUND_HEIGHT = 90;

  let groundOffset = 0;
  let bgOffset = 0;
  let score = 0;
  let elapsed = 0;

  // ---------- Personaje ----------
  const hero = {
    x: 0,
    y: 0,
    vy: 0,
    rot: 0,
    size: 46,
    animT: 0
  };

  function resetHero() {
    hero.x = Math.min(W * 0.28, 140);
    hero.y = H / 2;
    hero.vy = 0;
    hero.rot = 0;
  }

  // ---------- Tuberías ----------
  let pipes = [];
  let pipeTimer = 0;
  let PIPE_INTERVAL = 1.55; // segundos

  function spawnPipe() {
    const margin = 70;
    const usable = H - GROUND_HEIGHT - margin * 2 - PIPE_GAP;
    const gapY = margin + Math.random() * Math.max(usable, 40);
    pipes.push({ x: W + 40, gapY, passed: false });
  }

  function resetGame() {
    pipes = [];
    pipeTimer = 0;
    score = 0;
    elapsed = 0;
    PIPE_GAP = 200;
    PIPE_SPEED = 190;
    PIPE_INTERVAL = 1.55;
    resetHero();
    scoreEl.textContent = '0';
  }

  // ---------- Nubes decorativas ----------
  let clouds = [];
  function initClouds() {
    clouds = [];
    for (let i = 0; i < 5; i++) {
      clouds.push({
        x: Math.random() * W,
        y: 40 + Math.random() * (H * 0.35),
        s: 0.6 + Math.random() * 0.8,
        speed: 12 + Math.random() * 10
      });
    }
  }
  initClouds();

  // ---------- Entrada ----------
  function onPress() {
    SFX.unlock();
    if (state === STATE.START) {
      state = STATE.PLAYING;
      startScreen.classList.add('hidden');
      resetGame();
      hero.vy = FLAP_VELOCITY;
      SFX.startMusic();
    } else if (state === STATE.PLAYING) {
      hero.vy = FLAP_VELOCITY;
      SFX.jump();
    } else if (state === STATE.GAMEOVER) {
      state = STATE.PLAYING;
      gameOverScreen.classList.add('hidden');
      resetGame();
      hero.vy = FLAP_VELOCITY;
      SFX.startMusic();
    }
  }

  canvas.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    onPress();
  }, { passive: false });

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      e.preventDefault();
      onPress();
    }
  });

  let muted = false;
  muteBtn.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
  });
  muteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    muted = !muted;
    SFX.setMuted(muted);
    muteBtn.textContent = muted ? '🔇' : '🔊';
  });

  // ---------- Colisión ----------
  function checkCollision() {
    const hx1 = hero.x - hero.size * 0.32;
    const hx2 = hero.x + hero.size * 0.32;
    const hy1 = hero.y - hero.size * 0.38;
    const hy2 = hero.y + hero.size * 0.38;

    if (hy2 >= H - GROUND_HEIGHT) return true;
    if (hy1 <= 0) return true;

    for (const p of pipes) {
      const withinX = hx2 > p.x && hx1 < p.x + PIPE_WIDTH;
      if (withinX) {
        const gapTop = p.gapY;
        const gapBottom = p.gapY + PIPE_GAP;
        if (hy1 < gapTop || hy2 > gapBottom) return true;
      }
    }
    return false;
  }

  function gameOver() {
    state = STATE.GAMEOVER;
    SFX.stopMusic();
    SFX.hit();
    if (score > best) {
      best = score;
      localStorage.setItem(BEST_KEY, String(best));
    }
    finalScoreEl.textContent = 'Puntuación: ' + score;
    bestScoreTextEl.textContent = 'Mejor: ' + best;
    bestEl.textContent = 'Mejor: ' + best;
    gameOverScreen.classList.remove('hidden');
  }

  // ---------- Dibujo ----------
  function drawBackground() {
    // cielo
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#5C94FC');
    grad.addColorStop(1, '#8FC7FF');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // nubes
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    for (const c of clouds) {
      drawCloud(c.x, c.y, c.s);
    }

    // colinas traseras
    ctx.fillStyle = '#3FAE3A';
    const hillY = H - GROUND_HEIGHT;
    const hillW = 220;
    ctx.beginPath();
    ctx.moveTo(0, hillY);
    let x = -((bgOffset * 0.4) % hillW);
    while (x < W + hillW) {
      ctx.quadraticCurveTo(x + hillW / 2, hillY - 70, x + hillW, hillY);
      x += hillW;
    }
    ctx.lineTo(W, hillY + 60);
    ctx.lineTo(0, hillY + 60);
    ctx.closePath();
    ctx.fill();
  }

  function drawCloud(x, y, s) {
    ctx.beginPath();
    ctx.ellipse(x, y, 26 * s, 16 * s, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 22 * s, y + 4 * s, 20 * s, 13 * s, 0, 0, Math.PI * 2);
    ctx.ellipse(x - 22 * s, y + 6 * s, 18 * s, 12 * s, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawGround() {
    const y = H - GROUND_HEIGHT;
    ctx.fillStyle = '#DE9F4A';
    ctx.fillRect(0, y + 18, W, GROUND_HEIGHT - 18);
    ctx.fillStyle = '#3FAE3A';
    ctx.fillRect(0, y, W, 22);

    // pasto rayado con textura simple
    ctx.fillStyle = '#37A233';
    const tile = 30;
    let gx = -((groundOffset) % tile);
    while (gx < W) {
      ctx.fillRect(gx, y, 16, 8);
      gx += tile;
    }

    // ladrillos del suelo
    ctx.strokeStyle = 'rgba(0,0,0,0.12)';
    ctx.lineWidth = 2;
    let bx = -((groundOffset) % 40);
    while (bx < W) {
      ctx.beginPath();
      ctx.moveTo(bx, y + 28);
      ctx.lineTo(bx, H);
      ctx.stroke();
      bx += 40;
    }
  }

  function drawPipe(p) {
    const lipH = 34;
    ctx.fillStyle = '#3FAE3A';
    ctx.strokeStyle = '#2A7A28';
    ctx.lineWidth = 4;

    // tubo superior
    const topH = p.gapY;
    ctx.fillRect(p.x, 0, PIPE_WIDTH, topH - lipH);
    ctx.strokeRect(p.x, 0, PIPE_WIDTH, topH - lipH);
    ctx.fillRect(p.x - 6, topH - lipH, PIPE_WIDTH + 12, lipH);
    ctx.strokeRect(p.x - 6, topH - lipH, PIPE_WIDTH + 12, lipH);

    // tubo inferior
    const botY = p.gapY + PIPE_GAP;
    ctx.fillRect(p.x, botY + lipH, PIPE_WIDTH, H - GROUND_HEIGHT - (botY + lipH));
    ctx.strokeRect(p.x, botY + lipH, PIPE_WIDTH, H - GROUND_HEIGHT - (botY + lipH));
    ctx.fillRect(p.x - 6, botY, PIPE_WIDTH + 12, lipH);
    ctx.strokeRect(p.x - 6, botY, PIPE_WIDTH + 12, lipH);

    // brillo lateral
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fillRect(p.x + 8, 0, 10, topH - lipH);
    ctx.fillRect(p.x + 8, botY + lipH, 10, H - GROUND_HEIGHT - (botY + lipH));
  }

  function drawHero() {
    ctx.save();
    ctx.translate(hero.x, hero.y);
    ctx.rotate(hero.rot);
    const s = hero.size / 46;

    // sombra de rebote (animación de "carrera" con las piernas)
    const legSwing = Math.sin(hero.animT * 16) * 4;

    ctx.scale(s, s);

    // gorra
    ctx.fillStyle = '#D82820';
    ctx.fillRect(-16, -23, 32, 8);
    ctx.fillRect(-19, -17, 38, 6);
    ctx.fillStyle = '#fff';
    ctx.fillRect(-4, -22, 8, 6);

    // cara
    ctx.fillStyle = '#FFC996';
    ctx.fillRect(-15, -12, 30, 14);
    // bigote
    ctx.fillStyle = '#5A371E';
    ctx.fillRect(-15, -2, 30, 4);
    // ojos
    ctx.fillStyle = '#2c2c2c';
    ctx.fillRect(-9, -8, 4, 4);
    ctx.fillRect(5, -8, 4, 4);

    // cuerpo (overol azul)
    ctx.fillStyle = '#0060B8';
    ctx.fillRect(-15, 2, 30, 16);
    // mangas rojas
    ctx.fillStyle = '#D82820';
    ctx.fillRect(-19, 2, 6, 10);
    ctx.fillRect(13, 2, 6, 10);
    // botones
    ctx.fillStyle = '#FFD600';
    ctx.fillRect(-8, 5, 4, 4);
    ctx.fillRect(4, 5, 4, 4);

    // piernas (con animación)
    ctx.fillStyle = '#5A371E';
    ctx.fillRect(-13, 18 + Math.max(0, legSwing), 10, 8 - Math.max(0, legSwing));
    ctx.fillRect(3, 18 + Math.max(0, -legSwing), 10, 8 - Math.max(0, -legSwing));

    ctx.restore();
  }

  // ---------- Bucle principal ----------
  let lastTime = performance.now();

  function update(dt) {
    bgOffset += 30 * dt;

    if (state !== STATE.PLAYING) {
      // pequeña flotación en pantallas de inicio / game over
      hero.animT += dt;
      hero.y = H / 2 + Math.sin(hero.animT * 2.4) * 10;
      return;
    }

    elapsed += dt;
    hero.animT += dt;

    // dificultad progresiva suave (modo infinito)
    PIPE_SPEED = 190 + Math.min(elapsed * 3.2, 110);
    PIPE_GAP = Math.max(150, 200 - elapsed * 1.1);
    PIPE_INTERVAL = Math.max(1.05, 1.55 - elapsed * 0.01);

    groundOffset += PIPE_SPEED * dt;

    // física del héroe
    hero.vy += GRAVITY * dt;
    if (hero.vy > MAX_FALL) hero.vy = MAX_FALL;
    hero.y += hero.vy * dt;
    hero.rot = Math.max(-0.5, Math.min(1.2, hero.vy / 700));

    // nubes
    for (const c of clouds) {
      c.x -= c.speed * dt;
      if (c.x < -60) c.x = W + 60;
    }

    // tuberías
    pipeTimer += dt;
    if (pipeTimer >= PIPE_INTERVAL) {
      pipeTimer = 0;
      spawnPipe();
    }
    for (const p of pipes) {
      p.x -= PIPE_SPEED * dt;
      if (!p.passed && p.x + PIPE_WIDTH < hero.x) {
        p.passed = true;
        score++;
        scoreEl.textContent = String(score);
        SFX.score();
      }
    }
    pipes = pipes.filter(p => p.x > -PIPE_WIDTH - 20);

    if (checkCollision()) {
      gameOver();
    }
  }

  function render() {
    drawBackground();
    for (const p of pipes) drawPipe(p);
    drawGround();
    drawHero();
  }

  function loop(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.033);
    lastTime = now;
    update(dt);
    render();
    requestAnimationFrame(loop);
  }

  resetHero();
  requestAnimationFrame(loop);
})();
