const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
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

const playerImg = new Image();
playerImg.src = "img/nave.png";

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

const menuBgImg = new Image();
menuBgImg.src = "img/fondo-menu.png";
menuBgImg.onload = () => {
    if (!gameRunning) {
        ctx.drawImage(menuBgImg, 0, 0, canvas.width, canvas.height);
    }
};

const shootSound = new Audio("sound/disparo.mp3");
const explosionSound = new Audio("sound/Explocion.mp3");
const gameOverSound = new Audio("sound/Game-Over.mp3");
const bgMusic = new Audio("sound/pista1.mp3");
bgMusic.loop = true;
const menuMusic = new Audio("sound/intro.mp3");
menuMusic.loop = true;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", () => {
    resize();
    if (typeof player !== "undefined") {
        player.y = canvas.height - 100;
        if (player.x > canvas.width - player.w) player.x = canvas.width - player.w;
    }
    if (!gameRunning && menuBgImg.complete) ctx.drawImage(menuBgImg, 0, 0, canvas.width, canvas.height);
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
    if ((e.code === "KeyP" || e.code === "Escape") && gameRunning) isPaused = !isPaused;
});
window.addEventListener("keyup", e => keys[e.code] = false);

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

// Disparo con clic del mouse
canvas.addEventListener("mousedown", e => {
    if (!gameRunning || isPaused || countdownText !== "") return;
    e.preventDefault();
    bullets.push({ x: player.x + player.w / 2 - 2, y: player.y, w: 4, h: 15 });
    if (soundOn) {
        shootSound.currentTime = 0;
        shootSound.play();
    }
});

// Jugador
const player = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 100,
    w: 80,
    h: 80,
    speed: 5,
    color: "#00d4ff"
};

const bullets = [];
const enemies = [];
const enemyBullets = [];
const explosions = [];

// Variables para los intervalos
let enemyInterval;
let shooterInterval;
let difficultyInterval;

function startEnemySpawners() {
    // Limpiar intervalos anteriores si existen
    if (enemyInterval) clearInterval(enemyInterval);
    if (shooterInterval) clearInterval(shooterInterval);

    // Crear enemigos normales
    enemyInterval = setInterval(() => {
        if (gameRunning && !isPaused) {
            const rand = Math.random();
            let spawnImg = enemyImg;
            let spawnHp = 1;
            let spawnScore = 10;
            let spawnSpeed = (2 + Math.random() * 3) * enemySpeedMultiplier;
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
                w: 60,
                h: 60,
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
                w: 60,
                h: 60,
                speed: 3 * enemySpeedMultiplier,
                type: 'shooter',
                img: enemy2Img,
                hp: 1,
                scoreValue: 20
            });
        }
    }, shooterSpawnRate);
}

function update() {
    if (!gameRunning || isPaused) return;

    // Calcular hitbox del jugador una sola vez por frame
    const playerHitbox = {
        x: player.x + 20,
        y: player.y + 10,
        w: player.w - 40,
        h: player.h - 20
    };

    // Actualizar explosiones
    for (let i = explosions.length - 1; i >= 0; i--) {
        explosions[i].timer--;
        if (explosions[i].timer <= 0) explosions.splice(i, 1);
    }

    // Mover balas
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= 7;
        if (bullets[i].y < 0) bullets.splice(i, 1);
    }

    // Mover balas enemigas
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        enemyBullets[i].y += enemyBullets[i].speed;
        
        if (rectIntersect(playerHitbox, enemyBullets[i])) {
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
                setTimeout(() => {
                    showGameOver();
                }, 500);
            }
        }
        if (enemyBullets[i].y > canvas.height) enemyBullets.splice(i, 1);
    }

    // Mover enemigos
    for (let i = enemies.length - 1; i >= 0; i--) {
        const en = enemies[i];
        en.y += en.speed;
        
        // Colisión con jugador
        if (rectIntersect(playerHitbox, en)) {
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
                setTimeout(() => {
                    showGameOver();
                }, 500);
            }
        }

        // Lógica de disparo para enemigo tipo 'shooter'
        if (level >= 5 && en.type === 'shooter' && !en.hasShot && Math.random() < 0.02) {
            enemyBullets.push({
                x: en.x + en.w / 2 - 5, y: en.y + en.h, w: 10, h: 20,
                speed: 5 * enemySpeedMultiplier
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
                    scoreElement.innerText = score;
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
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

    // Dibujar puntaje
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Puntos: " + score, 10, 30);
    ctx.fillText("Nivel: " + level, canvas.width - 120, 30);

    // Dibujar jugador (Nave sencilla)
    if (playerDestroyed) {
        ctx.drawImage(playerExplosionImg, player.x, player.y, player.w, player.h);
    } else {
        ctx.drawImage(playerImg, player.x, player.y, player.w, player.h);
    }

    // Dibujar balas
    ctx.fillStyle = "yellow";
    bullets.forEach(b => ctx.fillRect(b.x, b.y, b.w, b.h));

    // Dibujar balas enemigas
    ctx.fillStyle = "red";
    enemyBullets.forEach(eb => ctx.fillRect(eb.x, eb.y, eb.w, eb.h));

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
        ctx.font = "80px Arial";
        ctx.textAlign = "center";
        ctx.fillText(countdownText, canvas.width / 2, canvas.height / 2);
        ctx.textAlign = "start";
    }

    if (isPaused) {
        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.fillText("PAUSA", canvas.width / 2 - 60, canvas.height / 2);
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
    gameRunning = true;
    playerDestroyed = false;
    menuMusic.pause();
    level = 1;
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
                        let increase = 0.05;
                        if (currentDifficulty === 'easy') increase = 0.02;
                        if (currentDifficulty === 'hard') increase = 0.08;
                        enemySpeedMultiplier += increase;
                        level++;
                    }
                }, 15000);
            }
        }
    }, 1000);

    gameLoop();
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
