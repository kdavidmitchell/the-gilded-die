// public/client.js

class AudioManager {
    constructor() {
        this.sounds = {
            ambience: '/audio/ambience.wav',
            roll: '/audio/roll.m4a',
            coin: '/audio/coin.wav',
            bust: '/audio/bust.wav',
            slam: '/audio/slam.wav'
        };
        this.musicNode = null;
        this.isMuted = false;
    }

    play(key) {
        if (this.isMuted || !this.sounds[key]) return;
        const audio = new Audio(this.sounds[key]);
        audio.volume = 0.5;
        if (key === 'roll') audio.volume = 0.4;
        if (key === 'slam') audio.volume = 0.8;
        if (key === 'ambience') audio.volume = 0.3;
        audio.play().catch(e => console.log("Audio play failed:", e));
        return audio;
    }

    startAmbience() {
        if (this.musicNode) return;
        this.musicNode = new Audio(this.sounds.ambience);
        this.musicNode.loop = true;
        this.musicNode.volume = 0.3;
        this.musicNode.play().catch(e => console.log("Ambience waiting for user interaction..."));
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.musicNode) this.musicNode.muted = this.isMuted;
        return this.isMuted;
    }
}
const audio = new AudioManager();

// ==========================================
// VARIABLES & SETUP
// ==========================================
let prevFavor = 0;
let prevTribute = 0;
let speechTimeout;
let typeWriterInterval;
let storyQueue = [];
let introData = null;
let moodTimeout;
let isGildedCageActive = false;

const els = {
    titheNumber: document.getElementById('tithe-number'),
    sessionFavor: document.getElementById('session-favor'),
    requiredFavor: document.getElementById('required-favor'),
    currentRound: document.getElementById('current-round'),
    totalRounds: document.getElementById('total-rounds'),
    tributeScore: document.getElementById('tribute-score'),
    logArea: document.getElementById('log-area'),
    diceContainer: document.getElementById('dice-display'),

    // Fortunes
    activeFortunesContainer: document.getElementById('active-fortunes-container'),
    fortunesList: document.getElementById('fortunes-list'),

    // Buttons
    takeTurnBtn: document.getElementById('take-turn-btn'),
    rollBtn: document.getElementById('roll-btn'),
    stopBtn: document.getElementById('stop-btn'),
    bargainBtn: document.getElementById('bargain-btn'),
    hoardBtn: document.getElementById('hoard-btn'),

    // Modals
    shopModal: document.getElementById('shop-modal'),
    shopContainer: document.getElementById('shop-container'),
    closeShopBtn: document.getElementById('close-shop-btn'),
    hoardModal: document.getElementById('hoard-modal'),
    hoardContainer: document.getElementById('hoard-container'),
    closeHoardBtn: document.getElementById('close-hoard-btn'),
    rewardModal: document.getElementById('reward-modal'),
    rewardContainer: document.getElementById('reward-container'),

    // Interaction Modal (New)
    interactionModal: document.getElementById('interaction-modal'),
    interactionPrompt: document.getElementById('interaction-prompt'),
    interactionControls: document.getElementById('interaction-controls'),

    // Intro
    introModal: document.getElementById('intro-modal'),
    storyText: document.getElementById('story-text'),
    storyNextBtn: document.getElementById('btn-story-next'),
    storyChoices: document.getElementById('story-choices'),
    choiceYes: document.getElementById('btn-choice-yes'),
    choiceNo: document.getElementById('btn-choice-no'),

    // Proprietor
    proprietorAvatar: document.getElementById('proprietor-avatar'),
    speechBubble: document.getElementById('speech-bubble'),
    speechText: document.getElementById('speech-text'),
};

// ==========================================
// 2. API LAYER
// ==========================================
const API = {
    getGameState: () => fetch('/api/gamestate').then(r => r.json()),
    getIntro: () => fetch('/api/intro').then(r => r.json()),
    takeTurn: () => fetch('/api/taketurn', { method: 'POST' }).then(r => r.json()),
    roll: () => fetch('/api/roll', { method: 'POST' }).then(r => r.json()),
    stop: () => fetch('/api/stop', { method: 'POST' }).then(r => r.json()),
    getShop: () => fetch('/api/shop').then(r => r.json()),
    buyItem: (itemId) => fetch('/api/shop/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId })
    }).then(r => r.json()),
    getHoard: () => fetch('/api/hoard').then(r => r.json()),
    claimReward: (prizeIndex) => fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prizeIndex })
    }).then(r => r.json()),

    // NEW: Generic Interaction (for FortuneInputState)
    interact: (handlerName, data) => fetch('/api/interact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handler: handlerName, ...data })
    }).then(r => r.json()),

    restart: () => fetch('/api/restart', { method: 'POST' }).then(r => r.json())
};

// ==========================================
// 3. UI LAYER
// ==========================================

function animateValue(element, start, end, duration) {
    if (start === end) return;
    const range = end - start;
    let current = start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    if (stepTime < 10) { element.textContent = end; return; }
    const timer = setInterval(function () {
        current += increment;
        element.textContent = current;
        if (current == end) clearInterval(timer);
    }, stepTime);
}

function spawnFloatingText(targetEl, text, type = 'float-gain') {
    const rect = targetEl.getBoundingClientRect();
    const el = document.createElement('div');
    el.className = `floating-text ${type}`;
    el.textContent = text;
    el.style.left = `${rect.left + (rect.width / 2) - 20}px`;
    el.style.top = `${rect.top}px`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1500);
}

function proprietorSpeak(text, emotion = 'normal') {
    els.speechBubble.className = '';
    clearTimeout(speechTimeout);
    clearInterval(typeWriterInterval);

    if (emotion === 'excited' || emotion === 'edict') {
        els.speechBubble.classList.add('edict-voice');
    }

    els.speechBubble.classList.remove('hidden');
    els.speechText.textContent = "";
    let charIndex = 0;
    const speed = emotion === 'excited' ? 20 : 35;

    typeWriterInterval = setInterval(() => {
        if (charIndex < text.length) {
            els.speechText.textContent += text.charAt(charIndex);
            charIndex++;
        } else {
            clearInterval(typeWriterInterval);
            speechTimeout = setTimeout(() => {
                els.speechBubble.classList.add('hidden');
            }, 4000);
        }
    }, speed);
}

function updateUI({ state, config }) {
    // 1. Game Over Check
    if (!state.currentTitheIndex && state.currentTitheIndex !== 0) {
        // Safety for game over state if object is partial
    }

    isGildedCageActive = state.isGildedCageActive;

    // 2. Render Text Values
    const currentTithe = config.TITHES[state.currentTitheIndex];
    if (currentTithe) {
        els.titheNumber.textContent = currentTithe.number;
        els.requiredFavor.textContent = currentTithe.requiredFavor;
        els.currentRound.textContent = state.currentRound;
        els.totalRounds.textContent = currentTithe.rounds;
    } else {
        els.titheNumber.textContent = "DONE";
    }

    // 3. Floating Text & Animation for Favor/Tribute
    const favorDiff = state.sessionFavor - prevFavor;
    if (favorDiff !== 0) {
        const type = favorDiff > 0 ? 'float-gain' : 'float-loss';
        const sign = favorDiff > 0 ? '+' : '';
        setTimeout(() => spawnFloatingText(els.sessionFavor, `${sign}${favorDiff}`, type), 200);
    }
    animateValue(els.sessionFavor, prevFavor, state.sessionFavor, 1000);
    prevFavor = state.sessionFavor;

    const tributeDiff = state.tribute - prevTribute;
    if (tributeDiff > 0) {
        setTimeout(() => spawnFloatingText(els.tributeScore, `+${tributeDiff}`, 'float-tribute'), 200);
    }
    animateValue(els.tributeScore, prevTribute, state.tribute, 500);
    prevTribute = state.tribute;

    // 4. Render Dice (Passive)
    // Only render if not actively rolling/interacting (handled by events)
    if (!els.diceContainer.classList.contains('shaking') && !els.interactionModal.classList.contains('active')) {
        renderDice(state.lastRoll, false, state.dieSize);
    }

    // 5. Render Active Fortunes
    renderFortunes(state.activeFortunes);

    // 6. Reward Modal Trigger
    if (state.isChoosingReward) {
        renderRewardModal(state, config);
    } else {
        els.rewardModal.classList.add('hidden');
    }
}

function renderFortunes(fortunes) {
    if (fortunes && fortunes.length > 0) {
        els.activeFortunesContainer.classList.remove('hidden');
        els.fortunesList.innerHTML = '';
        fortunes.forEach(f => {
            const chip = document.createElement('div');
            chip.className = 'fortune-chip';
            chip.innerHTML = `
                <span class="f-name">${f.name}</span>
                <span class="f-desc">${f.description}</span>
                <span class="f-duration">[ REMAINING: ${f.duration} ]</span>
            `;
            els.fortunesList.appendChild(chip);
        });
    } else {
        els.activeFortunesContainer.classList.add('hidden');
    }
}

function renderDice(diceArray, isRolling = false, maxVal = 6) {
    els.diceContainer.innerHTML = '';
    if (isRolling) {
        els.diceContainer.classList.add('shaking');
    } else {
        els.diceContainer.classList.remove('shaking');
    }

    if (!diceArray || diceArray.length === 0) {
        for (let i = 0; i < 5; i++) els.diceContainer.innerHTML += '<div class="die"></div>';
        return;
    }

    diceArray.forEach(val => {
        const die = document.createElement('div');
        die.className = `die die-${val}`;
        if (val === maxVal) die.classList.add('crit');
        for (let i = 0; i < val; i++) {
            const pip = document.createElement('span');
            pip.className = 'pip';
            die.appendChild(pip);
        }
        els.diceContainer.appendChild(die);
    });
}

function addToLog(message, type = 'normal') {
    const p = document.createElement('p');
    p.textContent = `> ${message}`;
    p.className = `log-${type}`;
    els.logArea.insertBefore(p, els.logArea.firstChild);
}

function setTurnActive(isActive) {
    els.rollBtn.disabled = !isActive;

    if (isActive && isGildedCageActive) {
        els.stopBtn.disabled = true;
        els.stopBtn.textContent = "[ LOCKED ]";
    } else {
        els.stopBtn.disabled = !isActive;
        els.stopBtn.textContent = "[ STOP_PROCESS ]";
    }

    els.takeTurnBtn.disabled = isActive;
    els.bargainBtn.disabled = isActive;
}

// ==========================================
// 4. EVENT HANDLING (The FSM Interpreter)
// ==========================================

function handleServerResponse(responseJson) {
    if (!responseJson) return;

    // 1. Update core UI data
    updateUI(responseJson);

    // 2. Process Event Queue
    if (responseJson.events && responseJson.events.length > 0) {
        responseJson.events.forEach(event => {

            console.log("Processing event:", event.type);

            // --- BANKING ---
            if (event.type === 'bank') {
                addToLog(event.text, 'info');
                audio.play('coin');
                if (event.amount >= 10) setProprietorMood('bored');
            }

            // --- SHOPPING ---
            else if (event.type === 'shop_buy') {
                addToLog(event.text, 'info');
                audio.play('coin');

                const isMalus = event.itemType === 'malus' || event.text.includes('Curse') || event.text.includes('Debt');
                setProprietorMood(isMalus ? 'excited' : 'bored');
            }

            // --- ROLLS (Money Gain) ---
            else if (event.type === 'roll') {
                if (event.text.includes('gain') || event.text.includes('claim')) {
                    audio.play('coin');
                }
            }

            // --- LOGGING ---
            else if (event.type === 'info' || event.type === 'mercy') {
                addToLog(event.text, event.type);
            }
            else if (event.type === 'bust') {
                addToLog(event.text, 'bust');
                audio.play('bust');
                setProprietorMood('excited');
                document.body.classList.add('impact-flash');
                setTimeout(() => document.body.classList.remove('impact-flash'), 500);
            }
            else if (event.type === 'edict') {
                addToLog(event.text, 'edict');
                if (event.description) {
                    const descP = document.createElement('p');
                    descP.textContent = `>>> EFFECT: ${event.description}`;
                    descP.className = 'log-edict-desc';
                    els.logArea.insertBefore(descP, els.logArea.firstChild);
                }
                proprietorSpeak(event.text, 'edict');
                setProprietorMood('excited');

                if (event.text.includes('Complete')) {
                    triggerTitheAlert('success');
                }
            }
            else if (event.type === 'quip') {
                proprietorSpeak(event.text.replace(/"/g, ''), 'normal');
                if (event.mood) setProprietorMood(event.mood);
            }

            // --- INTERACTIONS ---
            else if (event.type === 'input_req') {
                handleInputRequest(event);
            }

            // --- GAME OVER ---
            else if (event.type === 'gameover') {
                addToLog(event.text, 'error');
                els.takeTurnBtn.textContent = "GAME OVER";
                els.takeTurnBtn.disabled = true;
            }
        });
    }

    // 3. Determine Button State based on Context
    if (!els.interactionModal.classList.contains('hidden')) {
        setTurnActive(false);
        els.takeTurnBtn.disabled = true;
    }
}

// --- INPUT HANDLER ---
function handleInputRequest(event) {
    els.interactionModal.classList.remove('hidden');
    els.interactionPrompt.innerHTML = `<p>${event.text}</p>`;
    els.interactionControls.innerHTML = '';

    // 1. RENDER DICE IN MODAL
    if (event.dice) {
        const diceDisplay = document.createElement('div');
        diceDisplay.className = 'modal-dice-display';
        diceDisplay.style.display = 'flex';
        diceDisplay.style.justifyContent = 'center';
        diceDisplay.style.gap = '10px';
        diceDisplay.style.marginBottom = '20px';

        event.dice.forEach(val => {
            const die = document.createElement('div');
            die.className = `die die-${val}`;
            for (let i = 0; i < val; i++) {
                const pip = document.createElement('span');
                pip.className = 'pip';
                die.appendChild(pip);
            }
            diceDisplay.appendChild(die);
        });

        els.interactionPrompt.prepend(diceDisplay);
    }

    // 2. RENDER CONTROLS BASED ON INPUT TYPE
    if (event.inputType === 'face_selection') {
        const maxFace = event.dieSize || 6;

        for (let i = 1; i <= maxFace; i++) {
            const btn = document.createElement('button');
            btn.textContent = `[ ${i} ]`;
            btn.onclick = () => sendInputResponse(i);

            if (event.dice && event.dice.includes(i)) {
                btn.style.borderColor = '#fff';
                btn.style.boxShadow = '0 0 10px var(--gold-primary)';
            } else {
                btn.style.opacity = '0.5';
            }

            els.interactionControls.appendChild(btn);
        }
    }

    // 3. CANCELLATION OPTION
    if (event.cancellable) {
        const skipBtn = document.createElement('button');
        skipBtn.textContent = "[ SKIP ]";
        skipBtn.style.marginLeft = "20px";
        skipBtn.onclick = () => sendInputResponse(null, true);
        els.interactionControls.appendChild(skipBtn);
    }
}

async function sendInputResponse(value, skipped = false) {
    els.interactionModal.classList.add('hidden');

    try {
        const response = await fetch('/api/input', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'handleInput', payload: { value, skipped } })
        });
        const state = await response.json();
        handleServerResponse(state);
    } catch (e) {
        console.error("Input failed", e);
    }
}

// ==========================================
// 5. BUTTON LISTENERS
// ==========================================

document.getElementById('mute-btn').addEventListener('click', () => {
    audio.toggleMute();
});

els.takeTurnBtn.addEventListener('click', async () => {
    const state = await API.takeTurn();
    handleServerResponse(state);
    setTurnActive(true);
});

els.rollBtn.addEventListener('click', async () => {
    // 1. UI START
    setTurnActive(false); // Disable buttons immediately
    els.diceContainer.classList.add('shaking');

    // Play the full roll sound
    audio.play('roll');

    // 2. SLOT MACHINE EFFECT
    const tumbleInterval = setInterval(() => {
        const randomDice = Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
        renderDice(randomDice, true, 6);
    }, 100);

    try {
        // 3. FETCH & WAIT
        const [gameState] = await Promise.all([
            API.roll(),
            new Promise(resolve => setTimeout(resolve, 1000))
        ]);

        // 4. STOP ANIMATION
        clearInterval(tumbleInterval);
        els.diceContainer.classList.remove('shaking');

        // Render the actual result immediately
        renderDice(gameState.state.lastRoll, false, gameState.state.dieSize);

        // 5. THE LANDING BEAT & STATE CHECK
        setTimeout(() => {
            handleServerResponse(gameState);

            const hasBusted = gameState.events && gameState.events.some(e => e.type === 'bust');
            const isReward = gameState.state.isChoosingReward;

            if (hasBusted || isReward) {
                setTurnActive(false);
            } else {
                setTurnActive(true);
            }
        }, 300);

    } catch (err) {
        // Fail-safe: If network dies, stop shaking and let them try again
        clearInterval(tumbleInterval);
        els.diceContainer.classList.remove('shaking');
        console.error("Roll failed", err);
        setTurnActive(true);
    }
});

els.stopBtn.addEventListener('click', async () => {
    const state = await API.stop();
    handleServerResponse(state);
    setTurnActive(false);
});

els.stopBtn.nextElementSibling?.addEventListener('click', () => { /* Placeholder if needed */ });
document.getElementById('restart-btn').addEventListener('click', async () => {
    if (!confirm("Are you sure? This will wipe your current session.")) return;
    await API.restart();
    window.location.reload();
});

// Shop / Hoard / Rewards
els.bargainBtn.addEventListener('click', async () => {
    const options = await API.getShop();
    els.shopContainer.innerHTML = '';

    const renderItem = (item, type) => {
        const div = document.createElement('div');
        div.className = 'shop-item';
        div.innerHTML = `<div><h4>${item.name}</h4><p>${item.description}</p></div>`;

        const btn = document.createElement('button');
        btn.className = type === 'malus' ? 'shop-btn malus-btn' : 'shop-btn';
        btn.textContent = (type === 'boon' || type === 'upgrade') ? `Buy (${item.cost})` : `Accept (+${item.reward})`;

        btn.onclick = async () => {
            const newState = await API.buyItem(item.id);

            if (newState.error) {
                alert(newState.error);
            } else {
                handleServerResponse(newState);
                els.shopModal.classList.add('hidden');
            }
        };
        div.appendChild(btn);
        els.shopContainer.appendChild(div);
    };

    options.boons.forEach(i => renderItem(i, 'boon'));
    options.maluses.forEach(i => renderItem(i, 'malus'));
    options.upgrades.forEach(i => renderItem(i, 'upgrade'));

    if (els.shopContainer.children.length === 0) {
        els.shopContainer.innerHTML = "<p>The Ledger is empty for now...</p>";
    }
    els.shopModal.classList.remove('hidden');
});
els.closeShopBtn.onclick = () => els.shopModal.classList.add('hidden');

els.hoardBtn.addEventListener('click', async () => {
    const items = await API.getHoard();
    els.hoardContainer.innerHTML = items.length ? '' : '<p>Empty.</p>';
    items.forEach(i => {
        const d = document.createElement('div');
        d.className = i.isCorrupted ? 'hoard-item corrupted' : 'hoard-item';
        d.innerHTML = `<h4>${i.name}</h4><p>${i.description}</p>`;
        els.hoardContainer.appendChild(d);
    });
    els.hoardModal.classList.remove('hidden');
});
els.closeHoardBtn.onclick = () => els.hoardModal.classList.add('hidden');

els.storyNextBtn.addEventListener('click', () => {
    showNextLine();
});

els.choiceYes.addEventListener('click', () => {
    audio.startAmbience();
    els.storyChoices.classList.add('hidden');
    els.storyNextBtn.classList.remove('hidden');

    // Load the Veteran text path
    storyQueue = [...introData.veteran];
    showNextLine();
});

els.choiceNo.addEventListener('click', () => {
    audio.startAmbience();
    els.storyChoices.classList.add('hidden');
    els.storyNextBtn.classList.remove('hidden');

    // Load the Newcomer + Rules text path
    storyQueue = [...introData.newcomer_intro, ...introData.rules];
    showNextLine();
});

function renderRewardModal(state, config) {
    els.rewardContainer.innerHTML = '';
    const currentTithe = config.TITHES[state.currentTitheIndex];
    const prizeList = config.PRIZES[currentTithe.tier] || [];

    prizeList.forEach((prize, index) => {
        const div = document.createElement('div');
        div.className = 'shop-item';
        div.innerHTML = `<div><h4 style="color:#d4af37">${prize.name}</h4><p>${prize.description}</p></div>`;
        const btn = document.createElement('button');
        btn.className = 'shop-btn';
        btn.textContent = "CLAIM";
        btn.onclick = async () => {
            const res = await API.claimReward(index);
            handleServerResponse(res);
        };
        div.appendChild(btn);
        els.rewardContainer.appendChild(div);
    });
    els.rewardModal.classList.remove('hidden');
}

// --- UTILS: INTRO, MOOD, & ALERTS ---
function showNextLine() {
    if (storyQueue.length > 0) {
        els.storyText.textContent = storyQueue.shift();
    } else {
        handleEndOfQueue();
    }
}

function handleEndOfQueue() {
    if (introData && els.storyText.textContent === introData.opening[introData.opening.length - 1]) {
        els.storyText.textContent = introData.question;
        els.storyNextBtn.classList.add('hidden');
        els.storyChoices.classList.remove('hidden');
        return;
    }

    els.introModal.classList.add('hidden');
    addToLog("The game begins. Good luck.");
}

function setProprietorMood(mood) {
    const imgEl = els.proprietorAvatar.querySelector('img');

    // 1. Map moods to filenames
    const moodMap = {
        'neutral': '/images/proprietor_neutral.png',
        'excited': '/images/proprietor_excited.png',
        'bored': '/images/proprietor_bored.png'
    };

    const newSrc = moodMap[mood] || moodMap['neutral'];

    // 2. TIMEOUT LOGIC: Reset the timer so he stays excited if events keep happening
    if (typeof moodTimeout !== 'undefined') {
        clearTimeout(moodTimeout);
    }

    if (mood !== 'neutral') {
        moodTimeout = setTimeout(() => {
            setProprietorMood('neutral');
        }, 4000);
    }

    // 3. OPTIMIZATION: Don't animate if the image is already correct
    if (imgEl.src.endsWith(newSrc)) return;

    // 4. THE GLITCH SWAP EFFECT
    imgEl.classList.add('glitch-swap');
    setTimeout(() => {
        imgEl.src = newSrc;
        setTimeout(() => {
            imgEl.classList.remove('glitch-swap');
        }, 100);
    }, 50);
}

function triggerTitheAlert(type) {
    const alertBox = document.getElementById('tithe-seal').querySelector('.terminal-alert');
    document.getElementById('tithe-seal').classList.remove('hidden');
    alertBox.classList.add('alert-pop');
    setTimeout(() => {
        alertBox.classList.remove('alert-pop');
        document.getElementById('tithe-seal').classList.add('hidden');
    }, 2500);
}

// --- INIT ---
async function start() {
    try {
        // 1. Fetch and Init Intro
        introData = await API.getIntro();

        if (introData && introData.opening) {
            storyQueue = [...introData.opening];
            els.introModal.classList.remove('hidden');
            showNextLine();
        }

        // 2. Fetch Game State
        const state = await API.getGameState();
        updateUI(state);

    } catch (e) {
        console.error("Failed to start:", e);
        addToLog("System Error: Could not load narrative.", "error");
    }
}

start();