const allPossibleDifferences = [
    { x: 15, y: 20, emoji: '🍎' },
    { x: 45, y: 15, emoji: '⭐️' },
    { x: 80, y: 30, emoji: '🎈' },
    { x: 25, y: 65, emoji: '🐱' },
    { x: 65, y: 85, emoji: '🍭' },
    { x: 85, y: 70, emoji: '🍄' },
    { x: 40, y: 45, emoji: '🐥' },
    { x: 20, y: 85, emoji: '🍦' },
    { x: 60, y: 55, emoji: '🚀' },
    { x: 10, y: 45, emoji: '🦋' }
];

const difficultySettings = {
    easy: { time: 100, count: 3, threshold: 15, label: 'かんたん' },
    normal: { time: 60, count: 5, threshold: 10, label: 'ふつう' },
    hard: { time: 30, count: 8, threshold: 6, label: 'むずかしい' }
};

let currentDiffs = [];
let score = 0;
let timeLeft = 60;
let timerInterval;
let isGameOver = true;
let currentLevel = 'normal';

const timerEl = document.getElementById('timer');
const scoreEl = document.getElementById('score');
const totalDiffsEl = document.getElementById('total-diffs');
const gameArea = document.getElementById('game-area');
const overlay = document.getElementById('overlay');
const resultTitle = document.getElementById('result-title');
const resultMessage = document.getElementById('result-message');
const resetBtn = document.getElementById('reset-btn');
const startBtn = document.getElementById('start-btn');
const diffSelection = document.querySelector('.difficulty-selection');
const layers = [document.getElementById('layer-1'), document.getElementById('layer-2')];

function initGame(level) {
    currentLevel = level || currentLevel;
    const settings = difficultySettings[currentLevel];
    
    score = 0;
    timeLeft = settings.time;
    isGameOver = false;
    
    // Select random differences from the pool
    currentDiffs = [...allPossibleDifferences]
        .sort(() => 0.5 - Math.random())
        .slice(0, settings.count)
        .map(d => ({ ...d, found: false }));
    
    scoreEl.textContent = score;
    totalDiffsEl.textContent = currentDiffs.length;
    timerEl.textContent = timeLeft;
    
    layers.forEach(layer => layer.innerHTML = '');
    overlay.classList.add('hidden');
    startBtn.classList.add('hidden');
    diffSelection.classList.add('hidden');
    
    createDifferences();
    
    clearInterval(timerInterval);
    startTimer();
}

function createDifferences() {
    currentDiffs.forEach(diff => {
        const item = document.createElement('div');
        item.className = 'diff-item';
        item.textContent = diff.emoji;
        item.style.left = `${diff.x}%`;
        item.style.top = `${diff.y}%`;
        layers[1].appendChild(item);
    });
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
    const settings = difficultySettings[currentLevel];

    currentDiffs.forEach((diff) => {
        if (!diff.found) {
            const distance = Math.sqrt(Math.pow(diff.x - x, 2) + Math.pow(diff.y - y, 2));
            if (distance < settings.threshold) {
                diff.found = true;
                score++;
                scoreEl.textContent = score;
                addMarkers(diff.x, diff.y);
                foundAny = true;
                
                if (score === currentDiffs.length) {
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
    diffSelection.classList.remove('hidden');
    startBtn.classList.remove('hidden');
    
    if (isWin) {
        resultTitle.textContent = "おめでとう！";
        resultMessage.textContent = `${difficultySettings[currentLevel].label}をクリアしたよ！`;
    } else {
        resultTitle.textContent = "タイムアップ";
        resultMessage.textContent = "ざんねん！つぎはがんばろう！";
    }
}

document.querySelectorAll('.image-wrapper').forEach(wrapper => {
    wrapper.addEventListener('click', handleImageClick);
});

resetBtn.addEventListener('click', () => {
    isGameOver = true;
    clearInterval(timerInterval);
    overlay.classList.remove('hidden');
    diffSelection.classList.remove('hidden');
    startBtn.classList.add('hidden');
    resultTitle.textContent = "まちがいさがし！";
    resultMessage.textContent = "なんいどをえらんでね";
});

startBtn.addEventListener('click', () => initGame(currentLevel));

document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const level = btn.getAttribute('data-level');
        initGame(level);
    });
});
