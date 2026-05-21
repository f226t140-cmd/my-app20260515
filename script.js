const differences = [
    { x: 20, y: 30, found: false },
    { x: 50, y: 15, found: false },
    { x: 80, y: 45, found: false },
    { x: 35, y: 70, found: false },
    { x: 65, y: 85, found: false }
];

let score = 0;
let timeLeft = 60;
let timerInterval;
let isGameOver = false;

const timerEl = document.getElementById('timer');
const scoreEl = document.getElementById('score');
const totalDiffsEl = document.getElementById('total-diffs');
const gameArea = document.getElementById('game-area');
const overlay = document.getElementById('overlay');
const resultTitle = document.getElementById('result-title');
const resultMessage = document.getElementById('result-message');
const resetBtn = document.getElementById('reset-btn');
const startBtn = document.getElementById('start-btn');
const layers = [document.getElementById('layer-1'), document.getElementById('layer-2')];

function initGame() {
    score = 0;
    timeLeft = 60;
    isGameOver = false;
    differences.forEach(d => d.found = false);
    
    scoreEl.textContent = score;
    totalDiffsEl.textContent = differences.length;
    timerEl.textContent = timeLeft;
    
    layers.forEach(layer => layer.innerHTML = '');
    overlay.classList.add('hidden');
    
    clearInterval(timerInterval);
    startTimer();
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);
}

function handleImageClick(e) {
    if (isGameOver) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    let foundAny = false;
    const threshold = 5; // Click tolerance in percentage

    differences.forEach((diff, index) => {
        if (!diff.found) {
            const distance = Math.sqrt(Math.pow(diff.x - x, 2) + Math.pow(diff.y - y, 2));
            if (distance < threshold) {
                diff.found = true;
                score++;
                scoreEl.textContent = score;
                addMarkers(diff.x, diff.y);
                foundAny = true;
                
                if (score === differences.length) {
                    endGame(true);
                }
            }
        }
    });

    if (!foundAny) {
        triggerShake();
    }
}

function addMarkers(x, y) {
    layers.forEach(layer => {
        const marker = document.createElement('div');
        marker.className = 'marker';
        marker.style.left = `${x}%`;
        marker.style.top = `${y}%`;
        layer.appendChild(marker);
    });
}

function triggerShake() {
    gameArea.classList.add('shake');
    setTimeout(() => {
        gameArea.classList.remove('shake');
    }, 500);
}

function endGame(isWin) {
    isGameOver = true;
    clearInterval(timerInterval);
    
    overlay.classList.remove('hidden');
    if (isWin) {
        resultTitle.textContent = "おめでとう！";
        resultMessage.textContent = "すべての間違いをみつけました！";
    } else {
        resultTitle.textContent = "タイムアップ";
        resultMessage.textContent = "残念！時間切れです。";
    }
}

document.querySelectorAll('.image-wrapper').forEach(wrapper => {
    wrapper.addEventListener('click', handleImageClick);
});

resetBtn.addEventListener('click', initGame);
startBtn.addEventListener('click', initGame);

// Start game on load
window.addEventListener('load', initGame);
