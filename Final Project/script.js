const player = document.getElementById('player');
const container = document.getElementById('game-container');
const uiOverlay = document.getElementById('ui-overlay');
const uiMessage = document.getElementById('ui-message');
const actionBtn = document.getElementById('action-btn');
const scoreEl = document.getElementById('score');
const titleEl = document.querySelector('.title');

let isPlaying = false;
let score = 0;
let enemies = [];
let gameLoop;
let targetX = 200;
let currentX = 200;

container.addEventListener('mousemove', (e) => {
    if (isPlaying) {
        let rect = container.getBoundingClientRect();
        targetX = e.clientX - rect.left;
        if (targetX < 35) targetX = 35;
        if (targetX > 365) targetX = 365;
    }
});

actionBtn.addEventListener('click', startGame);

function startGame() {
    isPlaying = true;
    score = 0;
    scoreEl.innerText = "00";
    
    uiOverlay.classList.add('hidden');
    player.classList.remove('hidden');
    
    enemies.forEach(e => e.remove());
    enemies = [];
    targetX = 200;
    currentX = 200;
    
    spawnEnemy();
    update();
}

function spawnEnemy() {
    if (!isPlaying) return;
    
    const enemy = document.createElement('div');
    enemy.className = 'cloud';
    enemy.innerText = '☁️';
    enemy.style.left = Math.random() * 310 + 20 + 'px';
    enemy.style.top = '-60px';
    
    container.appendChild(enemy);
    enemies.push(enemy);
    
    let spawnRate = Math.max(160, 800 - (score * 12));
    setTimeout(spawnEnemy, spawnRate);
}

function update() {
    if (!isPlaying) return;
    
    currentX += (targetX - currentX) * 0.2;
    player.style.left = currentX + 'px';

    let pRect = player.getBoundingClientRect();
    let hitLeft = pRect.left + 15;
    let hitRight = pRect.right - 15;
    let hitTop = pRect.top + 15;
    let hitBottom = pRect.bottom - 10;

    for (let i = 0; i < enemies.length; i++) {
        let e = enemies[i];
        let top = parseFloat(e.style.top);
        
        top += 6 + (score * 0.2);
        e.style.top = top + 'px';

        let eRect = e.getBoundingClientRect();

        if (!(hitRight < eRect.left || hitLeft > eRect.right || hitBottom < eRect.top || hitTop > eRect.bottom)) {
            triggerSparkles(currentX, 500);
            gameOver();
            return;
        }

        if (top > 650) {
            e.remove();
            enemies.splice(i, 1);
            i--;
            score++;
            scoreEl.innerText = score < 10 ? '0' + score : score;
        }
    }
    
    gameLoop = requestAnimationFrame(update);
}

function triggerSparkles(x, y) {
    for (let i = 0; i < 12; i++) {
        let p = document.createElement('div');
        p.className = 'sparkle';
        p.style.left = x + 'px';
        p.style.top = y + 'px';
        container.appendChild(p);

        let angle = Math.random() * Math.PI * 2;
        let speed = Math.random() * 8 + 3;
        let velX = Math.cos(angle) * speed;
        let velY = Math.sin(angle) * speed;

        let frame = 0;
        function animateSparkle() {
            if (frame > 40) {
                p.remove();
                return;
            }
            x += velX;
            y += velY;
            p.style.left = x + 'px';
            p.style.top = y + 'px';
            p.style.opacity = 1 - (frame / 40);
            p.style.transform = `scale(${1 - (frame/40)})`;
            frame++;
            requestAnimationFrame(animateSparkle);
        }
        animateSparkle();
    }
}

function gameOver() {
    isPlaying = false;
    cancelAnimationFrame(gameLoop);
    player.classList.add('hidden');
    
    titleEl.innerHTML = "SYSTEM<br>CRASH";
    uiMessage.innerText = `FINAL SCORE: ${score < 10 ? '0' + score : score}`;
    actionBtn.innerText = "PLAY AGAIN ✨";
    
    setTimeout(() => {
        uiOverlay.classList.remove('hidden');
    }, 800);
}