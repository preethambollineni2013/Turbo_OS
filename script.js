setInterval(() => {
    let now = new Date();
    let clockEl = document.getElementById('t-clock');
    let dateEl = document.getElementById('m-date');
    if (clockEl) clockEl.innerText = now.toLocaleTimeString();
    if (dateEl) dateEl.innerText = now.toLocaleDateString();
}, 1000);

let wins = {}, zIdx = 15;

function toggleMenu() {
    let m = document.getElementById('menu');
    if (m) m.classList.toggle('hidden');
}

window.onclick = e => {
    let m = document.getElementById('menu'), b = document.getElementById('s-btn');
    if (m && b && !m.contains(e.target) && !b.contains(e.target)) {
        m.classList.add('hidden');
    }
};

function launch(id) {
    let m = document.getElementById('menu');
    if (m) m.classList.add('hidden');

    if (wins[id]) {
        let w = document.getElementById('w-' + id);
        if (w) {
            w.classList.remove('min');
            w.style.zIndex = ++zIdx;
        }
        return;
    }

    let container = document.getElementById('win-area');
    if (!container) return;

    let w = document.createElement('div');
    w.className = 'win';
    w.id = 'w-' + id;
    w.style.zIndex = ++zIdx;
    w.style.top = (50 + Object.keys(wins).length * 28) + 'px';
    w.style.left = (100 + Object.keys(wins).length * 28) + 'px';

    let t = '', html = '';
    if (id === 'term') {
        t = 'Terminal';
        html = '<div id="out" class="term-out">TurboOS v1.0.0. Type help.</div><div class="term-in"><span style="color:#238636">root@turbo:~$</span><input type="text" id="tin" autofocus autocomplete="off"></div>';
    } else if (id === 'note') {
        t = 'Notepad';
        html = '<textarea class="note-ta" placeholder="Type notes here..."></textarea>';
    } else if (id === 'exp') {
        t = 'File Explorer';
        html = '<div class="readme-box" style="cursor:pointer;" onclick="launch(\'about\')">📁 <strong>README.md</strong> — Click to open OS info & About details</div>';
    } else if (id === 'brow') {
        t = 'Web Browser';
        html = '<div class="b-bar"><input type="text" id="burl" value="https://en.wikipedia.org"><button onclick="goWeb()">Go</button></div><iframe id="bfr" class="b-frame" src="https://en.wikipedia.org"></iframe>';
    } else if (id === 'play') {
        t = 'Media Player';
        html = '<div class="p-box"><div class="p-row"><input type="text" id="mlink" placeholder="Direct media URL (.mp3 / .mp4)"><button onclick="loadMedia()">Play</button></div><div class="p-art">🎵</div><audio id="aud" controls></audio></div>';
    } else if (id === 'calc') {
        t = 'Calculator';
        html = '<div class="c-grid"><input type="text" id="cs" class="c-disp" readonly value="0"><button class="c-btn" onclick="ck(7)">7</button><button class="c-btn" onclick="ck(8)">8</button><button class="c-btn" onclick="ck(9)">9</button><button class="c-btn op" onclick="ck(\'/\')">/</button><button class="c-btn" onclick="ck(4)">4</button><button class="c-btn" onclick="ck(5)">5</button><button class="c-btn" onclick="ck(6)">6</button><button class="c-btn op" onclick="ck(\'*\')">*</button><button class="c-btn" onclick="ck(1)">1</button><button class="c-btn" onclick="ck(2)">2</button><button class="c-btn" onclick="ck(3)">3</button><button class="c-btn op" onclick="ck(\'-\')">-</button><button class="c-btn" onclick="ck(0)">0</button><button class="c-btn" onclick="cc()">C</button><button class="c-btn op" onclick="ce()">=</button><button class="c-btn op" onclick="ck(\'+\')">+</button></div>';
    } else if (id === 'cal') {
        t = 'Calendar';
        html = '<div style="margin-bottom:10px;font-weight:bold;color:#58a6ff;text-align:center;" id="cal-title"></div><div class="cal-grid"><div class="cal-hdr">Su</div><div class="cal-hdr">Mo</div><div class="cal-hdr">Tu</div><div class="cal-hdr">We</div><div class="cal-hdr">Th</div><div class="cal-hdr">Fr</div><div class="cal-hdr">Sa</div></div><div class="cal-grid" id="cal-days" style="margin-top:6px;"></div>';
    } else if (id === 'about') {
        t = 'About TurboOS';
        html = '<div class="readme-box"><h2>TurboOS v1.0.0</h2><p><strong>Made by:</strong> Bollineni Preetham</p><p><strong>Copyright &copy; 2026 Bollineni Preetham. All rights reserved.</strong></p><hr style="border-color:#30363d;"><p>TurboOS is a custom-built operating system project showcasing low-level architecture and web desktop integration.</p></div>';
    }

    w.innerHTML = `<div class="w-head" onmousedown="focusW('${id}')"><span>${t}</span><div class="w-ctrl"><button class="wb wb-m" onclick="minW('${id}')"></button><button class="wb wb-x" onclick="closeW('${id}')"></button></div></div><div class="w-body">${html}</div>`;
    container.appendChild(w);
    wins[id] = w;

    let tb = document.getElementById('t-apps');
    if (tb) {
        let tbBtn = document.createElement('button');
        tbBtn.className = 't-btn act';
        tbBtn.id = 'tb-' + id;
        tbBtn.innerText = t;
        tbBtn.onclick = () => {
            let winElem = document.getElementById('w-' + id);
            if (winElem) {
                if (winElem.classList.contains('min')) {
                    winElem.classList.remove('min');
                    winElem.style.zIndex = ++zIdx;
                } else {
                    winElem.classList.add('min');
                }
            }
        };
        tb.appendChild(tbBtn);
    }

    if (id === 'term') {
        let tin = document.getElementById('tin');
        if (tin) {
            tin.onkeydown = e => {
                if (e.key === 'Enter') {
                    let v = tin.value.trim();
                    if (!v) return;
                    let out = document.getElementById('out');
                    if (out) {
                        out.innerText += '\nroot@turbo:~$ ' + v;
                        if (v === 'help') out.innerText += '\nCommands: help, clear, version, reboot, about';
                        else if (v === 'clear') out.innerText = '';
                        else if (v === 'version') out.innerText += '\nTurboOS v1.0.0';
                        else if (v === 'about') out.innerText += '\nTurboOS made by Bollineni Preetham.';
                        else if (v === 'reboot') reboot();
                        else out.innerText += '\nCommand not found: ' + v;
                        out.scrollTop = out.scrollHeight;
                    }
                    tin.value = '';
                }
            };
        }
    }

    if (id === 'cal') {
        buildCalendar();
    }

    makeDrag(w);
}

function focusW(id) {
    let w = document.getElementById('w-' + id);
    if (w) w.style.zIndex = ++zIdx;
}

function minW(id) {
    let w = document.getElementById('w-' + id);
    if (w) w.classList.add('min');
}

function closeW(id) {
    let w = document.getElementById('w-' + id);
    if (w) w.remove();
    let tb = document.getElementById('tb-' + id);
    if (tb) tb.remove();
    delete wins[id];
}

function reboot() {
    document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#000;color:#00ff66;font-family:monospace;font-size:18px;">Rebooting TurboOS v1.0.0...</div>';
    setTimeout(() => location.reload(), 1200);
}

function goWeb() {
    let burl = document.getElementById('burl');
    let bfr = document.getElementById('bfr');
    if (burl && bfr) bfr.src = burl.value;
}

function loadMedia() {
    let mlink = document.getElementById('mlink');
    let aud = document.getElementById('aud');
    if (mlink && aud && mlink.value.trim()) {
        aud.src = mlink.value.trim();
        aud.play().catch(() => alert('Failed to stream link'));
    }
}

function ck(v) {
    let s = document.getElementById('cs');
    if (s) {
        s.value = (s.value === '0' || s.value === 'Err') ? v : s.value + v;
    }
}

function cc() {
    let s = document.getElementById('cs');
    if (s) s.value = '0';
}

function ce() {
    let s = document.getElementById('cs');
    if (s) {
        try { s.value = eval(s.value); } catch { s.value = 'Err'; }
    }
}

function buildCalendar() {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth();
    let ct = document.getElementById('cal-title');
    if (ct) ct.innerText = now.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    let firstDay = new Date(year, month, 1).getDay();
    let totalDays = new Date(year, month + 1, 0).getDate();
    let grid = document.getElementById('cal-days');
    if (!grid) return;
    grid.innerHTML = '';
    
    for (let i = 0; i < firstDay; i++) {
        let cell = document.createElement('div');
        grid.appendChild(cell);
    }
    
    for (let d = 1; d <= totalDays; d++) {
        let cell = document.createElement('div');
        cell.className = 'cal-cell' + (d === now.getDate() ? ' today' : '');
        cell.innerText = d;
        grid.appendChild(cell);
    }
}

function makeDrag(el) {
    let h = el.querySelector('.w-head');
    if (!h) return;
    h.onmousedown = e => {
        if (e.target.closest('.w-ctrl')) return;
        e.preventDefault();
        
        let startX = e.clientX;
        let startY = e.clientY;
        let rect = el.getBoundingClientRect();
        let parentRect = document.getElementById('desktop').getBoundingClientRect();
        
        let startLeft = rect.left - parentRect.left;
        let startTop = rect.top - parentRect.top;
        
        focusW(el.id.replace('w-', ''));

        function onMouseMove(ev) {
            let dx = ev.clientX - startX;
            let dy = ev.clientY - startY;
            el.style.left = (startLeft + dx) + 'px';
            el.style.top = (startTop + dy) + 'px';
        }
        
        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };
                    }
        
