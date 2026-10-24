var apps = {
  browser:{name:"Browser",icon:"🌐",w:520,h:430,build:browserApp},
  terminal:{name:"Terminal",icon:"⌨️",w:480,h:320,build:terminalApp},
  media:{name:"Media Player",icon:"🎞️",w:460,h:380,build:mediaApp},
  calc:{name:"Calculator",icon:"🧮",w:290,h:400,build:calcApp},
  calendar:{name:"Calendar",icon:"📅",w:340,h:350,build:calendarApp},
  clock:{name:"Clock",icon:"🕒",w:300,h:340,build:clockApp},
  about:{name:"About Me",icon:"👤",w:400,h:360,build:aboutApp}
};
var wins = [], z = 10, count = 0;
var $ = function(id){ return document.getElementById(id); };

/* ---------- boot / reboot ---------- */
function boot(msg){
  var b = $("boot"), bar = $("bar"), n = 0;
  b.style.display = "flex"; bar.style.width = "0";
  $("bmsg").textContent = msg || "Starting...";
  var t = setInterval(function(){
    n += 5; bar.style.width = n + "%";
    if(n > 40) $("bmsg").textContent = "Loading apps...";
    if(n >= 100){ clearInterval(t); b.style.display = "none"; }
  }, 100);
}
function reboot(){
  $("menu").classList.remove("open");
  while(wins.length) closeWin(wins[0]);
  boot("Rebooting...");
}

/* ---------- top clock ---------- */
function tick(){
  var d = new Date();
  $("t1").textContent = d.toLocaleTimeString();
  $("t2").textContent = d.toLocaleDateString(undefined,{weekday:"short",day:"numeric",month:"short",year:"numeric"});
}
setInterval(tick, 1000); tick();

/* ---------- desktop icons + start menu ---------- */
var rows = Math.max(1, Math.floor((innerHeight - 42 - 90) / 88));
Object.keys(apps).forEach(function(k, n){
  var a = apps[k];
  var i = document.createElement("div");
  i.className = "icon"; i.innerHTML = "<span>"+a.icon+"</span>"+a.name;
  i.style.left = (14 + Math.floor(n / rows) * 84) + "px";
  i.style.top = (78 + (n % rows) * 88) + "px";
  i.onclick = function(){ if(i.dataset.moved !== "1") openApp(k); };
  drag(i, i);
  $("icons").appendChild(i);
  var m = document.createElement("div");
  m.className = "item"; m.textContent = a.icon + "  " + a.name;
  m.onclick = function(){ openApp(k); };
  $("mitems").appendChild(m);
});
$("turbo").onclick = function(e){ e.stopPropagation(); $("menu").classList.toggle("open"); };
document.addEventListener("click", function(){ $("menu").classList.remove("open"); });

/* ---------- window manager ---------- */
function openApp(k){
  $("menu").classList.remove("open");
  var a = apps[k], w = {id:++count, key:k};
  var el = document.createElement("div");
  el.className = "win";
  var off = (wins.length % 6) * 28;
  el.style.width = Math.min(a.w, innerWidth - 20) + "px";
  el.style.height = Math.min(a.h, innerHeight - 140) + "px";
  el.style.left = Math.min(110 + off, Math.max(0, innerWidth - a.w - 10)) + "px";
  el.style.top = (80 + off) + "px";
  el.innerHTML = '<div class="bar"><b>'+a.icon+' '+a.name+'</b><span><button data-a="min">_</button><button data-a="x">X</button></span></div><div class="body"></div>';
  $("desktop").appendChild(el);
  w.el = el; w.body = el.querySelector(".body");
  var btn = document.createElement("button");
  btn.className = "btn task"; btn.textContent = a.icon + " " + a.name;
  btn.onclick = function(){
    if(el.style.display === "none"){ el.style.display = "flex"; focusWin(w); }
    else if(el.classList.contains("active")){ el.style.display = "none"; btn.classList.remove("on"); }
    else focusWin(w);
  };
  $("tasks").appendChild(btn); w.btn = btn;
  wins.push(w);
  el.addEventListener("pointerdown", function(){ focusWin(w); });
  el.querySelector('[data-a="x"]').onclick = function(){ closeWin(w); };
  el.querySelector('[data-a="min"]').onclick = function(){ el.style.display = "none"; btn.classList.remove("on"); el.classList.remove("active"); };
  drag(el, el.querySelector(".bar"));
  a.build(w.body, w);
  focusWin(w);
}
function focusWin(w){
  wins.forEach(function(x){ x.el.classList.remove("active"); x.btn.classList.remove("on"); });
  w.el.classList.add("active"); w.btn.classList.add("on");
  w.el.style.zIndex = ++z;
}
function closeWin(w){
  w.el.remove(); w.btn.remove();
  wins.splice(wins.indexOf(w), 1);
}
function drag(el, handle){
  handle.addEventListener("pointerdown", function(e){
    if(e.target.tagName === "BUTTON") return;
    var dx = e.clientX - el.offsetLeft, dy = e.clientY - el.offsetTop;
    el.dataset.moved = "0";
    handle.setPointerCapture(e.pointerId);
    function move(ev){
      var x = ev.clientX - dx, y = ev.clientY - dy;
      if(Math.abs(x - el.offsetLeft) + Math.abs(y - el.offsetTop) > 4) el.dataset.moved = "1";
      var area = el.parentNode;
      x = Math.min(Math.max(0, x), area.clientWidth - 50);
      y = Math.min(Math.max(0, y), area.clientHeight - 30);
      el.style.left = x + "px";
      el.style.top = y + "px";
    }
    function up(){
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", up);
    }
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", up);
  });
}

/* ---------- browser (Wikipedia) ---------- */
function browserApp(box){
  box.innerHTML = '<div class="row"><input type="text" placeholder="Search Wikipedia..."><button class="btn">Search</button></div><div class="view"><p>Type something above to search Wikipedia.</p></div>';
  var inp = box.querySelector("input"), view = box.querySelector(".view");
  var api = "https://en.wikipedia.org/w/api.php?origin=*&format=json&";
  function search(){
    var q = inp.value.trim(); if(!q) return;
    view.innerHTML = "<p>Searching...</p>";
    fetch(api + "action=query&list=search&srlimit=8&srsearch=" + encodeURIComponent(q))
      .then(function(r){ return r.json(); })
      .then(function(d){
        var list = d.query.search; view.innerHTML = "";
        if(!list.length){ view.innerHTML = "<p>No results found.</p>"; return; }
        list.forEach(function(item){
          var div = document.createElement("div"); div.className = "res";
          var h = document.createElement("h4"); h.textContent = item.title;
          var p = document.createElement("p"); p.textContent = item.snippet.replace(/<[^>]+>/g, "") + "...";
          div.appendChild(h); div.appendChild(p);
          div.onclick = function(){ openPage(item.title); };
          view.appendChild(div);
        });
      })
      .catch(function(){ view.innerHTML = "<p>Could not reach Wikipedia. Check your connection.</p>"; });
  }
  function openPage(title){
    view.innerHTML = "<p>Loading...</p>";
    fetch(api + "action=query&prop=extracts&explaintext=1&exintro=0&redirects=1&titles=" + encodeURIComponent(title))
      .then(function(r){ return r.json(); })
      .then(function(d){
        var pages = d.query.pages, page = pages[Object.keys(pages)[0]];
        view.innerHTML = '<div class="article"></div><div class="row"><button class="btn">Back to results</button></div>';
        var art = view.querySelector(".article");
        var h = document.createElement("h2"); h.textContent = page.title; art.appendChild(h);
        (page.extract || "No text available.").split("\n").slice(0, 25).forEach(function(t){
          if(!t.trim()) return;
          var p = document.createElement("p"); p.textContent = t; art.appendChild(p);
        });
        view.querySelector(".btn").onclick = search;
      })
      .catch(function(){ view.innerHTML = "<p>Could not load that page.</p>"; });
  }
  box.querySelector(".btn").onclick = search;
  inp.onkeydown = function(e){ if(e.key === "Enter") search(); };
}

/* ---------- terminal ---------- */
function terminalApp(box, w){
  box.className += " term";
  box.innerHTML = '<div class="out">Turbo OS Terminal. Type "help" for commands.\n</div><div class="line"><span>turbo&gt;</span><input type="text" spellcheck="false"></div>';
  var out = box.querySelector(".out"), inp = box.querySelector("input");
  var history = [], hi = 0;
  function print(t){ out.textContent += t + "\n"; box.scrollTop = box.scrollHeight; }
  var cmds = {
    help:function(){ return "help      list commands\ndate      show date and time\nwhoami    show user\necho TEXT print text\nopen APP  open an app (" + Object.keys(apps).join(", ") + ")\nsysinfo   system details\nclear     clear the screen\nreboot    restart Turbo OS"; },
    date:function(){ return new Date().toString(); },
    whoami:function(){ return "preetham"; },
    sysinfo:function(){ return "Turbo OS 1.0\nOpen windows: " + wins.length + "\nBrowser: " + navigator.userAgent.split(" ").pop(); },
    clear:function(){ out.textContent = ""; return ""; },
    reboot:function(){ setTimeout(reboot, 400); return "Rebooting..."; }
  };
  inp.onkeydown = function(e){
    if(e.key === "ArrowUp" && history.length){ hi = Math.max(0, hi - 1); inp.value = history[hi]; return; }
    if(e.key !== "Enter") return;
    var line = inp.value.trim(); inp.value = "";
    if(!line) return;
    history.push(line); hi = history.length;
    print("turbo> " + line);
    var parts = line.split(" "), c = parts[0].toLowerCase(), arg = parts.slice(1).join(" ");
    var res;
    if(c === "echo") res = arg;
    else if(c === "open"){
      if(apps[arg.toLowerCase()]){ openApp(arg.toLowerCase()); res = "Opening " + arg; }
      else res = "No app called '" + arg + "'.";
    }
    else if(cmds[c]) res = cmds[c]();
    else res = "Unknown command: " + c;
    if(res) print(res);
  };
  box.onclick = function(){ inp.focus(); };
  setTimeout(function(){ inp.focus(); }, 50);
}

/* ---------- media player ---------- */
function mediaApp(box){
  box.innerHTML = '<div class="row"><input type="text" placeholder="Paste a direct link to a video or audio file"><button class="btn">Play</button></div><video controls></video><p style="font-size:12px;color:#999;margin-top:6px">Works with direct links (.mp4, .webm, .mp3, .ogg). Some sites block playback from other pages.</p>';
  var inp = box.querySelector("input"), v = box.querySelector("video");
  function play(){
    var u = inp.value.trim(); if(!u) return;
    v.src = u; v.play().catch(function(){});
  }
  box.querySelector(".btn").onclick = play;
  inp.onkeydown = function(e){ if(e.key === "Enter") play(); };
}

/* ---------- calculator ---------- */
function calcApp(box){
  var keys = ["C","(",")","/","7","8","9","*","4","5","6","-","1","2","3","+","0",".","DEL","="];
  box.innerHTML = '<div class="calc"><div class="scr">0</div><div class="keys"></div></div>';
  var scr = box.querySelector(".scr"), grid = box.querySelector(".keys"), expr = "";
  keys.forEach(function(k){
    var b = document.createElement("button"); b.className = "btn"; b.textContent = k;
    b.onclick = function(){
      if(k === "C") expr = "";
      else if(k === "DEL") expr = expr.slice(0, -1);
      else if(k === "="){
        try{
          if(!/^[0-9+\-*/.() ]+$/.test(expr)) throw 0;
          var r = Function('"use strict";return (' + expr + ')')();
          expr = String(Math.round(r * 1e10) / 1e10);
        }catch(e){ expr = ""; scr.textContent = "Error"; return; }
      }
      else expr += k;
      scr.textContent = expr || "0";
    };
    grid.appendChild(b);
  });
}

/* ---------- calendar ---------- */
function calendarApp(box){
  var now = new Date(), y = now.getFullYear(), m = now.getMonth();
  var names = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  function draw(){
    var first = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate();
    var h = '<div class="mh"><button class="btn" data-d="-1">&lt;</button><b>' + names[m] + ' ' + y + '</b><button class="btn" data-d="1">&gt;</button></div><table class="cal"><tr>';
    ["Su","Mo","Tu","We","Th","Fr","Sa"].forEach(function(d){ h += "<th>" + d + "</th>"; });
    h += "</tr><tr>";
    for(var i = 0; i < first; i++) h += "<td></td>";
    for(var d = 1; d <= days; d++){
      var isToday = d === now.getDate() && m === now.getMonth() && y === now.getFullYear();
      h += '<td' + (isToday ? ' class="today"' : '') + '>' + d + '</td>';
      if((first + d) % 7 === 0 && d < days) h += "</tr><tr>";
    }
    box.innerHTML = h + "</tr></table>";
    box.querySelectorAll("[data-d]").forEach(function(b){
      b.onclick = function(){
        m += Number(b.dataset.d);
        if(m < 0){ m = 11; y--; } if(m > 11){ m = 0; y++; }
        draw();
      };
    });
  }
  draw();
}

/* ---------- clock ---------- */
function clockApp(box){
  box.innerHTML = '<div class="clk"><canvas width="190" height="190"></canvas><div class="dig"></div></div>';
  var c = box.querySelector("canvas"), g = c.getContext("2d"), dig = box.querySelector(".dig");
  function hand(angle, len, width, color){
    g.beginPath(); g.lineWidth = width; g.strokeStyle = color; g.lineCap = "round";
    g.moveTo(95, 95);
    g.lineTo(95 + len * Math.sin(angle), 95 - len * Math.cos(angle));
    g.stroke();
  }
  function draw(){
    if(!document.body.contains(c)){ clearInterval(t); return; }
    var d = new Date();
    g.clearRect(0, 0, 190, 190);
    g.strokeStyle = "#c8963e";
    for(var i = 0; i < 12; i++){
      var a = i * Math.PI / 6;
      g.beginPath(); g.lineWidth = 2;
      g.moveTo(95 + 78 * Math.sin(a), 95 - 78 * Math.cos(a));
      g.lineTo(95 + 88 * Math.sin(a), 95 - 88 * Math.cos(a));
      g.stroke();
    }
    var s = d.getSeconds(), mi = d.getMinutes() + s / 60, h = (d.getHours() % 12) + mi / 60;
    hand(h * Math.PI / 6, 45, 4, "#e8e2d0");
    hand(mi * Math.PI / 30, 65, 3, "#e8e2d0");
    hand(s * Math.PI / 30, 72, 1, "#c8963e");
    dig.textContent = d.toLocaleTimeString();
  }
  var t = setInterval(draw, 1000); draw();
}

/* ---------- about ---------- */
function aboutApp(box){
  box.innerHTML = '<div class="about"><h1>TURBO OS</h1><p><b>Preetham</b></p><p>Turbo OS is a small operating system that runs inside a web page. I built it with plain HTML, CSS and JavaScript to see how far a browser tab can go: windows you can drag, a start menu, a terminal, a Wikipedia browser and a few everyday tools.</p><p>Version 1.0</p><p>&copy; 2026 Preetham. All rights reserved.</p></div>';
}

boot("Starting...");
    
