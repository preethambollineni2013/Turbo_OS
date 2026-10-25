// ==========================================================================
// Turbo OS Logic
// ==========================================================================

// Global Window Controls Setup
function openApp(windowId) {
    const targetWindow = document.getElementById(windowId);
    if (targetWindow) {
        targetWindow.classList.remove('hidden');
        
        // Simple trick to bring the newly opened app window forward
        targetWindow.style.zIndex = String(new Date().getTime()).substring(7);
    }
}

function closeApp(windowId) {
    const targetWindow = document.getElementById(windowId);
    if (targetWindow) {
        targetWindow.classList.add('hidden');
    }
}

// 🕒 Live Modular Clock Module
function runDigitalClock() {
    const clockElement = document.getElementById('live-clock-display');
    if (!clockElement) return;

    const currentData = new Date();
    let hours = currentData.getHours();
    let minutes = currentData.getMinutes();
    let seconds = currentData.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Transform into standard 12-hour structure
    hours = hours % 12;
    hours = hours ? hours : 12; 
    
    // Quick helper ternary patch for zero padding
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    clockElement.innerText = `${hours}:${minutes}:${seconds} ${ampm}`;
}
// Keep the ticker clock beating every second
setInterval(runDigitalClock, 1000);
runDigitalClock(); // Boot execution instantly

// 🎵 Media Deck Control Simulation
let dummyMusicPlaying = false;
function playDummyTrack() {
    const statusText = document.getElementById('track-status');
    dummyMusicPlaying = !dummyMusicPlaying;
    
    if (dummyMusicPlaying) {
        statusText.innerText = "▶ Now Playing: Lo-fi Beats Hack Session";
        statusText.style.color = "#60a5fa";
    } else {
        statusText.innerText = "⏸ Audio paused";
        statusText.style.color = "#f3f4f6";
    }
}

// 🌐 Turbo Simulated Browser Loader
function loadBrowserUrl() {
    const inputField = document.getElementById('url-input');
    const viewportFrame = document.getElementById('browser-viewport');
    
    let targetUrl = inputField.value.trim();
    
    // Fallback handling check for quick domain formatting inputs
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        targetUrl = 'https://' + targetUrl;
    }
    
    viewportFrame.src = targetUrl;
}

// 🧮 Calculator Evaluation Workspace
function pressCalcKey(valueValue) {
    const screen = document.getElementById('calc-screen');
    screen.value += valueValue;
}

function clearCalcScreen() {
    document.getElementById('calc-screen').value = '';
}

function runCalcExecution() {
    const screen = document.getElementById('calc-screen');
    const statementExpression = screen.value;
    
    // Quick clean validation block before performing basic eval execution
    if (!statementExpression) return;
    
    try {
        // Safe standard mathematical parsing approach fallback
        const computationResult = eval(statementExpression);
        screen.value = computationResult;
    } catch (error) {
        screen.value = "Error";
        setTimeout(clearCalcScreen, 1200); // Clear error after brief moment
    }
}
