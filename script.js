const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const mainMenu = document.getElementById("main-menu");
const startBtn = document.getElementById("start-btn");
const optionsBtn = document.getElementById("options-btn");
const optionsMenu = document.getElementById("options-menu");
const diffEasy = document.getElementById("diff-easy");
const diffNormal = document.getElementById("diff-normal");
const diffHard = document.getElementById("diff-hard");
const optionsBack = document.getElementById("options-back");
const btnMusic = document.getElementById("btn-music");
const btnSound = document.getElementById("btn-sound");
const menuMusicToggle = document.getElementById("menu-music-toggle");
const scoreBtn = document.getElementById("score-btn");
const creditsBtn = document.getElementById("credits-btn");
const creditsScreen = document.getElementById("credits-screen");
const creditsBackBtn = document.getElementById("credits-back-btn");
const gameOverScreen = document.getElementById("game-over-screen");
const finalScoreSpan = document.getElementById("final-score");
const highScoreInput = document.getElementById("high-score-input");
const playerNameInput = document.getElementById("player-name");
const saveScoreBtn = document.getElementById("save-score-btn");
const restartBtn = document.getElementById("restart-btn");
const menuBtn = document.getElementById("menu-btn");
const highScoresScreen = document.getElementById("high-scores-screen");
const highScoresList = document.getElementById("high-scores-list");
const closeScoresBtn = document.getElementById("close-scores-btn");
const instructionsBtn = document.getElementById("instructions-btn");
const instructionsScreen = document.getElementById("instructions-screen");
const instructionsBackBtn = document.getElementById("instructions-back-btn");
const shipSelectionScreen = document.getElementById("ship-selection-screen");
const ship1Btn = document.getElementById("ship-1-btn");
const ship2Btn = document.getElementById("ship-2-btn");
const shipSelectionBack = document.getElementById("ship-selection-back");
const pauseMenu = document.getElementById("pause-menu");
const resumeBtn = document.getElementById("resume-btn");
const pauseRestartBtn = document.getElementById("pause-restart-btn");
const pauseMenuBtn = document.getElementById("pause-menu-btn");
const sfxVolumeControl = document.getElementById("sfx-volume-control");
const sfxVolValue = document.getElementById("sfx-vol-value");

const playerImg = new Image();
playerImg.src = "img/player/player-1.png";
const enemyImg = new Image();
enemyImg.src = "img/enemigo.png";

const enemy2Img = new Image();
enemy2Img.src = "img/enemigo2.png";

const enemy3Img = new Image();
enemy3Img.src = "img/enemigo3.png";

const enemy4Img = new Image();
enemy4Img.src = "img/enemigo4.png";

const enemy5Img = new Image();
enemy5Img.src = "img/enemigo5.png";

const bgImg = new Image();
bgImg.src = "img/fondo.jpg";

const explosionImg = new Image();
explosionImg.src = "img/explocion.png";

const playerExplosionImg = new Image();
playerExplosionImg.src = "img/explocion-player.png";

// --- ASSETS POWER-UPS ---
const shieldImg = new Image();
shieldImg.src = "img/PowerUp/shield.png";
const weaponImg = new Image();
weaponImg.src = "img/PowerUp/weapon.png";

const menuBgImg = new Image();
menuBgImg.src = "img/fondo-menu.png";
menuBgImg.onload = () => {
    if (!gameRunning) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const scale = Math.min(canvas.width / menuBgImg.width, canvas.height / menuBgImg.height);
        const x = (canvas.width / 2) - (menuBgImg.width / 2) * scale;
        const y = (canvas.height / 2) - (menuBgImg.height / 2) * scale;
        ctx.drawImage(menuBgImg, x, y, menuBgImg.width * scale, menuBgImg.height * scale);
    }
};

const shootSound = new Audio("sound/disparo.mp3");
const explosionSound = new Audio("sound/Explocion.mp3");
const gameOverSound = new Audio("sound/Game-Over.mp3");
const bgMusic = new Audio("sound/pista1.mp3");
bgMusic.loop = true;
const menuMusic = new Audio("sound/intro.mp3");
menuMusic.loop = true;

let gameScale = 1;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gameScale = Math.min(canvas.width / 600, canvas.height / 800);

    try {
        if (typeof player !== "undefined") {
            player.w = 80 * gameScale;
            player.h = 80 * gameScale;
            player.y = canvas.height - 100 * gameScale;
            if (player.x > canvas.width - player.w) player.x = canvas.width - player.w;
        }
    } catch (e) {
        // Player no inicializado aún, ignorar error en la primera carga
    }
}
window.addEventListener("resize", () => {
    resize();
    if (!gameRunning && menuBgImg.complete) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const scale = Math.min(canvas.width / menuBgImg.width, canvas.height / menuBgImg.height);
        const x = (canvas.width / 2) - (menuBgImg.width / 2) * scale;
        const y = (canvas.height / 2) - (menuBgImg.height / 2) * scale;
        ctx.drawImage(menuBgImg, x, y, menuBgImg.width * scale, menuBgImg.height * scale);
    }
});
resize();

let score = 0;
let level = 1;
let gameRunning = false;
let isPaused = false;
let playerDestroyed = false;
let musicOn = true;
let soundOn = true;
let countdownText = "";

// Cargar mejores puntuaciones
let highScores = JSON.parse(localStorage.getItem('spaceShooterHighScores')) || [];

// Configuración de Dificultad (Por defecto Normal)
let spawnRate = 1000;
let shooterSpawnRate = 3000;
let enemySpeedMultiplier = 1;
let currentDifficulty = 'normal';

// Estado de las teclas
const keys = {};
window.addEventListener("keydown", e => {
    keys[e.code] = true;
    if ((e.code === "KeyP" || e.code === "Escape") && gameRunning) {
        togglePause();
    }
});
window.addEventListener("keyup", e => keys[e.code] = false);

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        pauseMenu.style.display = "block";
        if (musicOn) bgMusic.pause();
    } else {
        pauseMenu.style.display = "none";
        if (musicOn) bgMusic.play();
    }
}

resumeBtn.addEventListener("click", () => {
    togglePause();
});

pauseRestartBtn.addEventListener("click", () => {
    // Reinicio suave del juego
    isPaused = false;
    pauseMenu.style.display = "none";
    score = 0;
    level = 1;
    enemies.length = 0;
    // Corrección: Resetear multiplicador de velocidad y limpiar intervalo de dificultad
    enemySpeedMultiplier = 1;
    if (difficultyInterval) clearInterval(difficultyInterval);
    
    powerUps.length = 0; // Limpiar power-ups
    bullets.length = 0;
    enemyBullets.length = 0;
    explosions.length = 0;
    playerDestroyed = false;
    player.x = canvas.width / 2 - 40 * gameScale;
    player.y = canvas.height - 100 * gameScale;
    
    // Resetear estados de power-ups
    player.hasShield = false;
    player.weaponLevel = 1;

    startEnemySpawners();
    
    // Reiniciar el incremento de dificultad
    difficultyInterval = setInterval(() => {
        if (gameRunning && !isPaused) {
            increaseDifficulty();
        }
    }, 15000);

    if (musicOn) {
        bgMusic.currentTime = 0;
        bgMusic.play();
    }
});

pauseMenuBtn.addEventListener("click", () => {
    location.reload();
});

sfxVolumeControl.addEventListener("input", (e) => {
    const vol = parseFloat(e.target.value);
    shootSound.volume = vol;
    explosionSound.volume = vol;
    gameOverSound.volume = vol;
    sfxVolValue.innerText = Math.round(vol * 100) + "%";
});

// Control con Mouse
canvas.addEventListener("mousemove", e => {
    if (!gameRunning || isPaused || countdownText !== "") return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const mouseX = (e.clientX - rect.left) * scaleX;

    player.x = mouseX - player.w / 2;

    // Mantener dentro del canvas
    if (player.x < 0) player.x = 0;
    if (player.x > canvas.width - player.w) player.x = canvas.width - player.w;
});

// Control Táctil (Móvil)
canvas.addEventListener("touchmove", e => {
    if (!gameRunning || isPaused || countdownText !== "") return;
    e.preventDefault(); // Evitar scroll
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const scaleX = canvas.width / rect.width;
    const touchX = (touch.clientX - rect.left) * scaleX;

    player.x = touchX - player.w / 2;

    // Mantener dentro del canvas
    if (player.x < 0) player.x = 0;
    if (player.x > canvas.width - player.w) player.x = canvas.width - player.w;
}, { passive: false });

canvas.addEventListener("touchstart", e => {
    if (gameRunning && !isPaused && countdownText === "") playerShoot();
}, { passive: false });

// Disparo con clic del mouse
canvas.addEventListener("mousedown", e => {
    if (!gameRunning || isPaused || countdownText !== "") return;
    e.preventDefault();
    playerShoot();
});

// Función unificada de disparo para manejar Power-Ups
function playerShoot() {
    const bulletW = 4 * gameScale;
    const bulletH = 15 * gameScale;

    if (player.weaponLevel === 1) {
        // Disparo normal (central)
        bullets.push({ x: player.x + player.w / 2 - bulletW / 2, y: player.y, w: bulletW, h: bulletH });
    } else if (player.weaponLevel >= 2) {
        // Disparo Doble (izquierda y derecha)
        bullets.push({ x: player.x, y: player.y + player.h / 2, w: bulletW, h: bulletH });
        bullets.push({ x: player.x + player.w - bulletW, y: player.y + player.h / 2, w: bulletW, h: bulletH });
        
        // Si quisieras nivel 3 (Triple), podrías agregar otro 'if' aquí
    }

    if (soundOn) {
        shootSound.currentTime = 0;
        shootSound.play();
    }
}

// Jugador
const player = {
    x: canvas.width / 2 - 40 * gameScale,
    y: canvas.height - 100 * gameScale,
    w: 80 * gameScale,
    h: 80 * gameScale,
    speed: 5 * gameScale,
    color: "#00d4ff",
    // Estados de Power-Ups
    hasShield: false,
    weaponLevel: 1
};

const bullets = [];
const enemies = [];
const enemyBullets = [];
const explosions = [];
const powerUps = []; // Array para almacenar power-ups activos

// Variables para los intervalos
let enemyInterval;
let shooterInterval;
let difficultyInterval;
let powerUpInterval;

function startEnemySpawners() {
    // Limpiar intervalos anteriores si existen
    if (enemyInterval) clearInterval(enemyInterval);
    if (shooterInterval) clearInterval(shooterInterval);
    if (powerUpInterval) clearInterval(powerUpInterval);

    // Crear enemigos normales
    enemyInterval = setInterval(() => {
        if (gameRunning && !isPaused) {
            const rand = Math.random();
            let spawnImg = enemyImg;
            let spawnHp = 1;
            let spawnScore = 10;
            let spawnSpeed = (2 + Math.random() * 3) * enemySpeedMultiplier * gameScale;
            let spawnType = 'normal';

            if (rand < 0.5) {
                // Enemigo 1 (Normal)
            } else if (rand < 0.7) {
                spawnImg = enemy3Img;
                spawnScore = 15;
                spawnType = 'type3';
            } else if (rand < 0.85) {
                spawnImg = enemy4Img;
                spawnScore = 25;
                spawnSpeed *= 1.2;
                spawnType = 'type4';
            } else {
                spawnImg = enemy5Img;
                spawnHp = 3; // Enemigo 5 es más duro (3 disparos)
                spawnScore = 50;
                spawnSpeed *= 0.7;
                spawnType = 'type5';
            }

            enemies.push({
                x: Math.random() * (canvas.width - 60),
                y: -60,
                w: 60 * gameScale,
                h: 60 * gameScale,
                speed: spawnSpeed,
                color: "#ff4d4d",
                type: spawnType,
                img: spawnImg,
                hp: spawnHp,
                scoreValue: spawnScore
            });
        }
    }, spawnRate);

    // Crear enemigos que disparan
    shooterInterval = setInterval(() => {
        if (gameRunning && !isPaused) {
            enemies.push({
                x: Math.random() * (canvas.width - 60),
                y: -60,
                w: 60 * gameScale,
                h: 60 * gameScale,
                speed: 3 * enemySpeedMultiplier * gameScale,
                type: 'shooter',
                img: enemy2Img,
                hp: 1,
                scoreValue: 20
            });
        }
    }, shooterSpawnRate);

    // Crear Power-Ups (Aparecen cada 15-25 segundos aprox)
    powerUpInterval = setInterval(() => {
        if (gameRunning && !isPaused) {
            const type = Math.random() < 0.5 ? 'shield' : 'weapon';
            const img = type === 'shield' ? shieldImg : weaponImg;
            
            powerUps.push({
                x: Math.random() * (canvas.width - 40 * gameScale),
                y: -40 * gameScale,
                w: 40 * gameScale,
                h: 40 * gameScale,
                speed: 3 * gameScale,
                type: type,
                img: img
            });
        }
    }, 15000);
}

function handleGameOver() {
    gameRunning = false;
    playerDestroyed = true;
    bgMusic.pause();
    bgMusic.currentTime = 0;
    if (soundOn) {
        explosionSound.currentTime = 0;
        explosionSound.play();
        explosionSound.addEventListener("ended", () => {
            gameOverSound.currentTime = 0;
            gameOverSound.play();
            gameOverSound.addEventListener("ended", () => {
                showGameOver();
            }, { once: true });
        }, { once: true });
    } else {
        setTimeout(() => showGameOver(), 500);
    }
}

function update() {
    if (!gameRunning || isPaused) return;

    // Calcular hitbox del jugador una sola vez por frame
    const playerHitbox = {
        x: player.x + 20 * gameScale,
        y: player.y + 10 * gameScale,
        w: player.w - 40 * gameScale,
        h: player.h - 20 * gameScale
    };

    // Actualizar explosiones
    for (let i = explosions.length - 1; i >= 0; i--) {
        explosions[i].timer--;
        if (explosions[i].timer <= 0) explosions.splice(i, 1);
    }

    // Mover balas
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= 7 * gameScale;
        if (bullets[i].y < 0) bullets.splice(i, 1);
    }

    // Mover y gestionar Power-Ups
    for (let i = powerUps.length - 1; i >= 0; i--) {
        const p = powerUps[i];
        p.y += p.speed;

        // Colisión con jugador
        if (rectIntersect(playerHitbox, p)) {
            if (p.type === 'shield') {
                player.hasShield = true;
                // Desactivar escudo después de 5 segundos
                setTimeout(() => { player.hasShield = false; }, 5000);
            } else if (p.type === 'weapon') {
                player.weaponLevel = 2;
                // Desactivar arma mejorada después de 10 segundos
                setTimeout(() => { player.weaponLevel = 1; }, 10000);
            }
            
            // Sonido opcional de power-up (usamos shootSound bajito por ahora o nada)
            if (soundOn) {
                // Podrías agregar un sonido específico aquí
            }
            
            powerUps.splice(i, 1);
            continue;
        }

        if (p.y > canvas.height) powerUps.splice(i, 1);
    }

    // Mover balas enemigas
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        enemyBullets[i].y += enemyBullets[i].speed;
        
        // Solo matar si NO tiene escudo
        if (!player.hasShield && rectIntersect(playerHitbox, enemyBullets[i])) {
            handleGameOver();
        }
        if (enemyBullets[i].y > canvas.height) enemyBullets.splice(i, 1);
    }

    // Mover enemigos
    for (let i = enemies.length - 1; i >= 0; i--) {
        const en = enemies[i];
        en.y += en.speed;
        
        // Colisión con jugador
        // Solo matar si NO tiene escudo
        if (!player.hasShield && rectIntersect(playerHitbox, en)) {
            handleGameOver();
        }

        // Lógica de disparo para enemigo tipo 'shooter'
        if (level >= 5 && en.type === 'shooter' && !en.hasShot && Math.random() < 0.02) {
            enemyBullets.push({
                x: en.x + en.w / 2 - 5 * gameScale, y: en.y + en.h, w: 10 * gameScale, h: 20 * gameScale,
                speed: 5 * enemySpeedMultiplier * gameScale
            });
            en.hasShot = true;
        }

        let enemyDestroyed = false;
        // Colisión con balas
        for (let j = bullets.length - 1; j >= 0; j--) {
            if (rectIntersect(bullets[j], en)) {
                bullets.splice(j, 1);
                
                en.hp = en.hp || 1;
                en.hp--;

                if (en.hp <= 0) {
                    explosions.push({
                        x: en.x,
                        y: en.y,
                        w: en.w,
                        h: en.h,
                        timer: 20
                    });
                    enemies.splice(i, 1);
                    score += (en.scoreValue || 10);
                    if (soundOn) {
                        explosionSound.currentTime = 0;
                        explosionSound.play();
                    }
                    enemyDestroyed = true;
                }
                break;
            }
        }

        if (!enemyDestroyed && en.y > canvas.height) enemies.splice(i, 1);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar fondo
    if (bgImg.complete && bgImg.width > 0) {
        const scale = Math.max(canvas.width / bgImg.width, canvas.height / bgImg.height);
        const x = (canvas.width / 2) - (bgImg.width / 2) * scale;
        const y = (canvas.height / 2) - (bgImg.height / 2) * scale;
        ctx.drawImage(bgImg, x, y, bgImg.width * scale, bgImg.height * scale);
    }

    // Dibujar puntaje
    ctx.fillStyle = "white";
    ctx.font = `${20 * gameScale}px Arial`;
    ctx.fillText("Puntos: " + score, 10, 30);
    ctx.fillText("Nivel: " + level, canvas.width - 120, 30);

    // Dibujar jugador (Nave sencilla)
    if (playerDestroyed) {
        ctx.drawImage(playerExplosionImg, player.x, player.y, player.w, player.h);
    } else {
        ctx.drawImage(playerImg, player.x, player.y, player.w, player.h);
    }

    // Dibujar efecto de ESCUDO
    if (player.hasShield && !playerDestroyed) {
        ctx.save();
        ctx.strokeStyle = "#00d4ff";
        ctx.lineWidth = 3;
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#00d4ff";
        ctx.beginPath();
        ctx.arc(player.x + player.w / 2, player.y + player.h / 2, player.w / 1.2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }

    // Dibujar balas
    ctx.fillStyle = "yellow";
    bullets.forEach(b => ctx.fillRect(b.x, b.y, b.w, b.h));

    // Dibujar balas enemigas
    ctx.fillStyle = "red";
    enemyBullets.forEach(eb => ctx.fillRect(eb.x, eb.y, eb.w, eb.h));

    // Dibujar Power-Ups
    powerUps.forEach(p => {
        ctx.drawImage(p.img, p.x, p.y, p.w, p.h);
    });

    // Dibujar explosiones
    explosions.forEach(exp => ctx.drawImage(explosionImg, exp.x, exp.y, exp.w, exp.h));

    // Dibujar enemigos
    enemies.forEach(en => {
        if (en.img) {
            ctx.drawImage(en.img, en.x, en.y, en.w, en.h);
        } else if (en.type === 'shooter') {
            ctx.drawImage(enemy2Img, en.x, en.y, en.w, en.h);
        } else {
            ctx.drawImage(enemyImg, en.x, en.y, en.w, en.h);
        }
    });

    if (countdownText !== "") {
        ctx.fillStyle = "white";
        ctx.font = `${80 * gameScale}px Arial`;
        ctx.textAlign = "center";
        ctx.fillText(countdownText, canvas.width / 2, canvas.height / 2);
        ctx.textAlign = "start";
    }
}

function rectIntersect(r1, r2) {
    return !(r2.x > r1.x + r1.w || r2.x + r2.w < r1.x || r2.y > r1.y + r1.h || r2.y + r2.h < r1.y);
}

// Lógica del Menú de Opciones
optionsBtn.addEventListener("click", (e) => {
    e.preventDefault();
    mainMenu.style.display = "none";
    optionsMenu.style.display = "block";
});

optionsBack.addEventListener("click", (e) => {
    e.preventDefault();
    optionsMenu.style.display = "none";
    mainMenu.style.display = "block";
});

function increaseDifficulty() {
    let increase = 0.05;
    if (currentDifficulty === 'easy') increase = 0.02;
    if (currentDifficulty === 'hard') increase = 0.08;
    enemySpeedMultiplier += increase;
    level++;
}

function setDifficulty(level) {
    // Resetear estilos
    diffEasy.style.color = "white";
    diffNormal.style.color = "white";
    diffHard.style.color = "white";

    if (level === 'easy') {
        spawnRate = 1500;
        shooterSpawnRate = 4000;
        enemySpeedMultiplier = 0.8;
        currentDifficulty = 'easy';
        diffEasy.style.color = "#00d4ff";
    } else if (level === 'normal') {
        spawnRate = 1000;
        shooterSpawnRate = 3000;
        enemySpeedMultiplier = 1;
        currentDifficulty = 'normal';
        diffNormal.style.color = "#00d4ff";
    } else if (level === 'hard') {
        spawnRate = 600;
        shooterSpawnRate = 2000;
        enemySpeedMultiplier = 1.5;
        currentDifficulty = 'hard';
        diffHard.style.color = "#00d4ff";
    }
}

diffEasy.addEventListener("click", (e) => { e.preventDefault(); setDifficulty('easy'); });
diffNormal.addEventListener("click", (e) => { e.preventDefault(); setDifficulty('normal'); });
diffHard.addEventListener("click", (e) => { e.preventDefault(); setDifficulty('hard'); });

btnMusic.addEventListener("click", (e) => {
    e.preventDefault();
    musicOn = !musicOn;
    btnMusic.innerText = musicOn ? "ON" : "OFF";
    btnMusic.style.color = musicOn ? "#00d4ff" : "white";
    menuMusicToggle.innerText = musicOn ? "🔊" : "🔇";
    if (musicOn) {
        if (gameRunning) bgMusic.play();
        else menuMusic.play();
    } else {
        bgMusic.pause();
        menuMusic.pause();
    }
});

btnSound.addEventListener("click", (e) => {
    e.preventDefault();
    soundOn = !soundOn;
    btnSound.innerText = soundOn ? "ON" : "OFF";
    btnSound.style.color = soundOn ? "#00d4ff" : "white";
});

menuMusicToggle.addEventListener("click", (e) => {
    e.preventDefault();
    musicOn = !musicOn;
    menuMusicToggle.innerText = musicOn ? "🔊" : "🔇";
    btnMusic.innerText = musicOn ? "ON" : "OFF";
    btnMusic.style.color = musicOn ? "#00d4ff" : "white";
    if (musicOn) {
        menuMusic.play();
    } else {
        menuMusic.pause();
    }
});

startBtn.addEventListener("click", (e) => {
    e.preventDefault();
    mainMenu.style.display = "none";
    shipSelectionScreen.style.display = "flex";
});

shipSelectionBack.addEventListener("click", (e) => {
    e.preventDefault();
    shipSelectionScreen.style.display = "none";
    mainMenu.style.display = "block";
});

function launchGame() {
    shipSelectionScreen.style.display = "none";
    gameRunning = true;
    playerDestroyed = false;
    menuMusic.pause();
    level = 1;
    player.hasShield = false;
    player.weaponLevel = 1;
    menuMusic.currentTime = 0;
    if (musicOn) bgMusic.play();

    // Lógica de cuenta regresiva
    let count = 3;
    countdownText = count.toString();
    let countdownInterval = setInterval(() => {
        if (!isPaused) {
            count--;
            if (count > 0) {
                countdownText = count.toString();
            } else if (count === 0) {
                countdownText = "Go!!!";
            } else {
                clearInterval(countdownInterval);
                countdownText = "";
                startEnemySpawners(); // Iniciar enemigos al terminar la cuenta

                // Aumentar velocidad progresivamente
                if (difficultyInterval) clearInterval(difficultyInterval);
                difficultyInterval = setInterval(() => {
                    if (gameRunning && !isPaused) {
                        increaseDifficulty();
                    }
                }, 15000);
            }
        }
    }, 1000);

    gameLoop();
}

ship1Btn.addEventListener("click", () => {
    playerImg.src = "img/player/player-1.png";
    launchGame();
});

ship2Btn.addEventListener("click", () => {
    playerImg.src = "img/player/player-2.png";
    launchGame();
});

// Iniciar música del menú
if (musicOn) {
    menuMusic.play().catch(() => {
        window.addEventListener("click", () => {
            if (musicOn && !gameRunning && menuMusic.paused) menuMusic.play();
        }, { once: true });
    });
}

// Sonido al pasar el mouse por encima de cualquier opción del menú
document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("mouseenter", () => {
        if (soundOn) {
            shootSound.currentTime = 0;
            shootSound.play();
        }
    });
});

// Funciones para Game Over y High Scores
function showGameOver() {
    gameOverScreen.style.display = "block";
    finalScoreSpan.innerText = score;
    highScoreInput.style.display = "none";
    
    // Verificar si es un High Score (Top 10)
    const lowestScore = highScores.length < 10 ? 0 : highScores[highScores.length - 1].score;
    
    if (score > lowestScore || highScores.length < 10) {
        highScoreInput.style.display = "block";
        playerNameInput.value = "";
        playerNameInput.focus();
    }
}

saveScoreBtn.addEventListener("click", () => {
    const name = playerNameInput.value.trim() || "Anónimo";
    const newScore = { name, score };
    highScores.push(newScore);
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(10); // Mantener solo los 10 mejores
    localStorage.setItem('spaceShooterHighScores', JSON.stringify(highScores));
    highScoreInput.style.display = "none";
});

restartBtn.addEventListener("click", () => {
    location.reload();
});

menuBtn.addEventListener("click", () => {
    location.reload();
});

scoreBtn.addEventListener("click", (e) => {
    e.preventDefault();
    mainMenu.style.display = "none";
    highScoresScreen.style.display = "block";
    highScoresList.innerHTML = highScores.length 
        ? highScores.map(s => `<li>${s.name}: <span style="color: #00d4ff;">${s.score}</span></li>`).join('')
        : "<p>No hay puntuaciones aún.</p>";
});

closeScoresBtn.addEventListener("click", () => {
    highScoresScreen.style.display = "none";
    mainMenu.style.display = "block";
});

instructionsBtn.addEventListener("click", (e) => {
    e.preventDefault();
    mainMenu.style.display = "none";
    instructionsScreen.style.display = "flex";
});

instructionsBackBtn.addEventListener("click", (e) => {
    e.preventDefault();
    instructionsScreen.style.display = "none";
    mainMenu.style.display = "block";
});

creditsBtn.addEventListener("click", (e) => {
    e.preventDefault();
    mainMenu.style.display = "none";
    creditsScreen.style.display = "block";
});

creditsBackBtn.addEventListener("click", () => {
    creditsScreen.style.display = "none";
    mainMenu.style.display = "block";
});
