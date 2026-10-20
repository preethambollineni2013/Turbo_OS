let highestZIndex = 100;
let windowCount = 0;

const appTemplates = {
    about: `
        <h2 style="margin-bottom:8px;">ABOUT Turbo OS</h2>
        <p>Welcome to Turbo OS, a lightweight Web Operating System environment built with web technologies.</p>
        
        <div class="bracket-box">[Bollineni Preetham]</div>
        <div class="bracket-box">[V - 1.0 ]</div>
        <div class="bracket-box">[This OS is designed to run on Web and performs Turbo fast.]</div>
        <div class="bracket-box">[All Charecters are reserved to Turbo Corporation]</div>
    `,
    calculator: `
        <input type="text" id="calc-screen" class="calc-display" readonly value="0">
        <div class="calc-grid">
            <button class="calc-btn" onclick="clearCalc()">C</button>
            <button class="calc-btn" onclick="appendCalc('(')">(</button>
            <button class="calc-btn" onclick="appendCalc(')')">)</button>
            <button class="calc-btn" onclick="appendCalc('/')">÷</button>
            <button class="calc-btn" onclick="appendCalc('7')">7</button>
            <button class="calc-btn" onclick="appendCalc('8')">8</button>
            <button class="calc-btn" onclick="appendCalc('9')">9</button>
            <button class="calc-btn" onclick="appendCalc('*')">×</button>
            <button class="calc-btn" onclick="appendCalc('4')">4</button>
            <button class="calc-btn" onclick="appendCalc('5')">5</button>
            <button class="calc-btn" onclick="appendCalc('6')">6</button>
            <button class="calc-btn" onclick="appendCalc('-')">−</button>
            <button class="calc-btn" onclick="appendCalc('1')">1</button>
            <button class="calc-btn" onclick="appendCalc('2')">2</button>
            <button class="calc-btn" onclick="appendCalc('3')">3</button>
            <button class="calc-btn" onclick="appendCalc('+')">+</button>
            <button class="calc-btn" onclick="appendCalc('0')">0</button>
            <button class="calc-btn" onclick="appendCalc('.')">.</button>
            <button class="calc-btn" style="grid-column: span 2; background:#3b82f6;" onclick="computeCalc()">=</button>
        </div>
    `,
    clock: `
        <h3>World Clock</h3>
        <div id="clock-app-time" class="clock-display">00:00:00</div>
        <hr style="border-color:rgba(255,255,255,0.1); margin:10px 0;">
        <h4>Stopwatch</h4>
        <div id="stopwatch-display" style="font-size:22px; text-align:center; margin:8px 0;">00:00:00</div>
        <div style="display:flex; justify-content:center; gap:8px;">
            <button class="browser-btn" onclick="startStopwatch()">Start</button>
            <button class="browser-btn" onclick="stopStopwatch()">Stop</button>
            <button class="browser-btn" onclick="resetStopwatch()">Reset</button>
        </div>
    `,
    media: `
        <h3>Turbo Media Player</h3>
        <div class="media-container" style="margin-top:10px;">
            <audio controls style="width:100%;">
                <source src="https://www.w3schools.com/html/horse.mp3" type="audio/mpeg">
                Your browser does not support the audio tag.
            </audio>
            <p style="font-size:12px;">Enter custom audio/video URL:</p>
            <div style="display:flex; gap:6px;">
                <input type="text" id="media-url" class="browser-input" placeholder="https://domain.com/file.mp3">
                <button class="browser-btn" onclick="loadMedia()">Load</button>
            </div>
            <div id="media-player-target"></div>
        </div>
    `,
    browser: `
        <div class="browser-nav">
            <input type="text" id="browser-url-input" class="browser-input" value="https://duckduckgo.com/?kae=t" placeholder="Search or type URL...">
            <button class="browser-btn" onclick="navigateBrowser(this)">Go</button>
            <button class="browser-btn-ext" onclick="openExternal('google')">Google ↗</button>
            <button class="browser-btn-ext" onclick="openExternal('bing')">Bing ↗</button>
        </div>
        <iframe class="browser-frame" src="https://duckduckgo.com/html/"></iframe>
    `
};


function updateTrayClock() {
    const now = new Date();
    document.getElementById('tray-time').innerText = now.toLocaleTimeString();
    document.getElementById('tray-date').innerText = now.toLocaleDateString();
    
    const clockAppTime = document.getElementById('clock-app-time');
    if (clockAppTime) {
        clockAppTime.innerText = now.toLocaleTimeString();
    }
}
setInterval(updateTrayClock, 1000);
updateTrayClock();


function toggleStartMenu() {
    const startMenu = document.getElementById('start-menu');
    startMenu.classList.toggle('hidden');
}


function openApp(appName) {
    windowCount++;
    const winId = `win-${appName}-${windowCount}`;
    const container = document.getElementById('windows-container');
    
    const win = document.createElement('div');
    win.className = 'app-window';
    win.id = winId;
    win.style.top = `${40 + (windowCount * 15) % 150}px`;
    win.style.left = `${120 + (windowCount * 15) % 200}px`;
    win.style.zIndex = ++highestZIndex;
    
    const titleMap = {
        about: 'About Turbo OS',
        calculator: 'Calculator',
        clock: 'Clock App',
        media: 'Media Player',
        browser: 'Turbo Browser'
    };

    win.innerHTML = `
        <div class="window-header" onmousedown="focusWindow('${winId}')">
            <span class="window-title">${titleMap[appName] || 'Application'}</span>
            <div class="window-controls">
                <button class="win-btn win-min" onclick="minimizeWindow('${winId}')">_</button>
                <button class="win-btn win-max" onclick="maximizeWindow('${winId}')">□</button>
                <button class="win-btn win-close" onclick="closeWindow('${winId}')">✕</button>
            </div>
        </div>
        <div class="window-body">
            ${appTemplates[appName]}
        </div>
    `;

    win.addEventListener('mousedown', () => focusWindow(winId));
    container.appendChild(win);
    
    makeDraggable(win);
    addTaskbarTab(winId, titleMap[appName]);
}

function focusWindow(winId) {
    const win = document.getElementById(winId);
    if (win) {
        highestZIndex++;
        win.style.zIndex = highestZIndex;
        
        document.querySelectorAll('.taskbar-tab').forEach(tab => tab.classList.remove('active'));
        const tab = document.getElementById(`tab-${winId}`);
        if (tab) tab.classList.add('active');
    }
}

function closeWindow(winId) {
    const win = document.getElementById(winId);
    if (win) win.remove();
    
    const tab = document.getElementById(`tab-${winId}`);
    if (tab) tab.remove();
}

function minimizeWindow(winId) {
    const win = document.getElementById(winId);
    if (win) win.classList.add('minimized');
}

function maximizeWindow(winId) {
    const win = document.getElementById(winId);
    if (win) win.classList.toggle('maximized');
}


function addTaskbarTab(winId, title) {
    const taskbarApps = document.getElementById('taskbar-apps');
    const tab = document.createElement('div');
    tab.className = 'taskbar-tab active';
    tab.id = `tab-${winId}`;
    tab.innerText = title;
    tab.onclick = () => {
        const win = document.getElementById(winId);
        if (win.classList.contains('minimized')) {
            win.classList.remove('minimized');
            focusWindow(winId);
        } else if (win.style.zIndex == highestZIndex) {
            win.classList.add('minimized');
        } else {
            focusWindow(winId);
        }
    };
    taskbarApps.appendChild(tab);
}


function makeDraggable(win) {
    const header = win.querySelector('.window-header');
    let isDragging = false;
    let offsetX = 0, offsetY = 0;

    header.addEventListener('mousedown', (e) => {
        if (win.classList.contains('maximized')) return;
        isDragging = true;
        offsetX = e.clientX - win.offsetLeft;
        offsetY = e.clientY - win.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            win.style.left = `${e.clientX - offsetX}px`;
            win.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

function appendCalc(val) {
    const screen = document.getElementById('calc-screen');
    if (screen.value === '0') screen.value = '';
    screen.value += val;
}

function clearCalc() {
    document.getElementById('calc-screen').value = '0';
}

function computeCalc() {
    const screen = document.getElementById('calc-screen');
    try {
        screen.value = eval(screen.value);
    } catch {
        screen.value = 'Error';
    }
}

let stopwatchTimer = null;
let stopwatchSeconds = 0;

function startStopwatch() {
    if (!stopwatchTimer) {
        stopwatchTimer = setInterval(() => {
            stopwatchSeconds++;
            const hrs = String(Math.floor(stopwatchSeconds / 3600)).padStart(2, '0');
            const mins = String(Math.floor((stopwatchSeconds % 3600) / 60)).padStart(2, '0');
            const secs = String(stopwatchSeconds % 60).padStart(2, '0');
            const disp = document.getElementById('stopwatch-display');
            if (disp) disp.innerText = `${hrs}:${mins}:${secs}`;
        }, 1000);
    }
}

function stopStopwatch() {
    clearInterval(stopwatchTimer);
    stopwatchTimer = null;
}

function resetStopwatch() {
    stopStopwatch();
    stopwatchSeconds = 0;
    const disp = document.getElementById('stopwatch-display');
    if (disp) disp.innerText = "00:00:00";
}


function navigateBrowser(btn) {
    const nav = btn.parentElement;
    const input = nav.querySelector('.browser-input');
    const iframe = nav.parentElement.querySelector('.browser-frame');
    let url = input.value;

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://duckduckgo.com/html/?q=' + encodeURIComponent(url);
    }
    iframe.src = url;
}

function openExternal(engine) {
    if (engine === 'google') window.open('https://www.google.com', '_blank');
    if (engine === 'bing') window.open('https://www.bing.com', '_blank');
}

function loadMedia() {
    const url = document.getElementById('media-url').value;
    const target = document.getElementById('media-player-target');
    if (url) {
        target.innerHTML = `<video controls style="width:100%; margin-top:10px;"><source src="${url}">Your browser does not support video.</video>`;
    }
}

window.onload = () => {
    openApp('about');
};