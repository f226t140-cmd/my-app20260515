// --- Configuration ---
const allPossibleDifferences = [
    { x: 15, y: 20, emoji: '👁️' }, { x: 45, y: 15, emoji: '🕸️' }, { x: 80, y: 30, emoji: '🕯️' },
    { x: 25, y: 65, emoji: '🗝️' }, { x: 65, y: 85, emoji: '🌒' }, { x: 85, y: 70, emoji: '🏺' },
    { x: 40, y: 45, emoji: '💀' }, { x: 20, y: 85, emoji: '🧿' }, { x: 60, y: 55, emoji: '📜' },
    { x: 10, y: 45, emoji: '🦋' }, { x: 30, y: 30, emoji: '🥀' }, { x: 75, y: 20, emoji: '💎' },
    { x: 50, y: 75, emoji: '👻' }, { x: 90, y: 40, emoji: '🪐' }, { x: 15, y: 60, emoji: '🌑' }
];

const difficultySettings = {
    easy: { count: 3, threshold: 15, label: '浅瀬' },
    normal: { count: 5, threshold: 10, label: '中層' },
    hard: { count: 12, threshold: 4, label: '深淵' }
};

// --- State ---
let currentDiffs = [];
let score = 0;
let timeElapsed = 0;
let timerInterval;
let isGameOver = true;
let currentLevel = 'normal';
let isMuted = false;
let hasInteracted = false;

// --- DOM Elements ---
const timerEl = document.getElementById('timer');
const scoreEl = document.getElementById('score');
const totalDiffsEl = document.getElementById('total-diffs');
const gameArea = document.getElementById('game-area');
const overlay = document.getElementById('overlay');
const resultTitle = document.getElementById('result-title');
const resultMessage = document.getElementById('result-message');
const resetBtn = document.getElementById('reset-btn');
const startBtn = document.getElementById('start-btn');
const muteBtn = document.getElementById('mute-btn');
const bgm = document.getElementById('bgm');
const diffSelection = document.querySelector('.difficulty-selection');
const layers = [document.getElementById('layer-1'), document.getElementById('layer-2')];

// --- Functions ---

function initGame(level) {
    if (!hasInteracted && bgm) {
        bgm.play().catch(err => console.warn("BGM play failed:", err));
        hasInteracted = true;
    }

    currentLevel = level || currentLevel;
    const settings = difficultySettings[currentLevel];
    if (!settings) return;

    score = 0;
    timeElapsed = 0;
    isGameOver = false;
    
    // Select random differences from the pool
    currentDiffs = [...allPossibleDifferences]
        .sort(() => 0.5 - Math.random())
        .slice(0, settings.count)
        .map(d => ({ ...d, found: false }));
    
    if (scoreEl) scoreEl.textContent = score;
    if (totalDiffsEl) totalDiffsEl.textContent = currentDiffs.length;
    if (timerEl) timerEl.textContent = timeElapsed;
    
    layers.forEach(layer => { if (layer) layer.innerHTML = ''; });
    if (overlay) overlay.classList.add('hidden');
    if (startBtn) startBtn.classList.add('hidden');
    if (diffSelection) diffSelection.classList.add('hidden');
    
    createDifferences();
    
    clearInterval(timerInterval);
    startTimer();
}

function createDifferences() {
    if (!layers[1]) return;
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
        timeElapsed++;
        if (timerEl) timerEl.textContent = timeElapsed;
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
                if (scoreEl) scoreEl.textContent = score;
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
        if (!layer) return;
        const marker = document.createElement('div');
        marker.className = 'marker';
        marker.style.left = `${x}%`;
        marker.style.top = `${y}%`;
        layer.appendChild(marker);
    });
}

function triggerShake() {
    if (gameArea) {
        gameArea.classList.add('shake');
        setTimeout(() => {
            gameArea.classList.remove('shake');
        }, 500);
    }
}

function endGame(isWin) {
    isGameOver = true;
    clearInterval(timerInterval);
    
    if (overlay) overlay.classList.remove('hidden');
    if (diffSelection) diffSelection.classList.remove('hidden');
    if (startBtn) startBtn.classList.remove('hidden');
    
    if (isWin && resultTitle && resultMessage) {
        resultTitle.textContent = "解明";
        resultMessage.textContent = `${difficultySettings[currentLevel].label}の真実を、${timeElapsed}拍で暴き出した。`;
    }
}

// --- Event Listeners ---

document.querySelectorAll('.image-wrapper').forEach(wrapper => {
    wrapper.addEventListener('click', handleImageClick);
});

if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        isGameOver = true;
        clearInterval(timerInterval);
        if (overlay) overlay.classList.remove('hidden');
        if (diffSelection) diffSelection.classList.remove('hidden');
        if (startBtn) startBtn.classList.add('hidden');
        if (resultTitle) resultTitle.textContent = "観測の儀";
        if (resultMessage) resultMessage.textContent = "深淵の深さを選べ";
    });
}

if (startBtn) {
    startBtn.addEventListener('click', () => initGame(currentLevel));
}

document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const level = btn.getAttribute('data-level');
        initGame(level);
    });
});

if (muteBtn && bgm) {
    muteBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        bgm.muted = isMuted;
        muteBtn.textContent = isMuted ? '🔇' : '🔊';
    });
}
