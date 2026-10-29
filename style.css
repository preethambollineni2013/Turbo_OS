// Turbo OS - simple web desktop
// Version 1.0 - made by Preetham

var desktop = document.getElementById("desktop");
var menu = document.getElementById("menu");
var tasks = document.getElementById("tasks");

var topZ = 1;          // highest z-index so far (for bringing windows to front)
var openWindows = {};  // app name -> window element
var offset = 0;        // so new windows don't sit exactly on top of each other

// ---------- Taskbar date and time ----------
function updateDateTime() {
  var now = new Date();
  document.getElementById("datetime").innerHTML =
    now.toLocaleTimeString() + "<br>" + now.toLocaleDateString();
}
updateDateTime();
setInterval(updateDateTime, 1000);

// ---------- Start menu ----------
document.getElementById("turbo-btn").onclick = function (e) {
  e.stopPropagation();
  menu.classList.toggle("hidden");
};
// clicking anywhere else closes the menu
document.addEventListener("click", function () {
  menu.classList.add("hidden");
});

// ---------- Window handling ----------
function bringToFront(win) {
  topZ++;
  win.style.zIndex = topZ;
  // highlight the matching taskbar button
  for (var name in openWindows) {
    var btn = openWindows[name].taskBtn;
    btn.classList.toggle("active", openWindows[name] === win);
  }
}

function makeWindow(name, title, width, height) {
  // if the app is already open just show it again
  if (openWindows[name]) {
    openWindows[name].style.display = "flex";
    bringToFront(openWindows[name]);
    return null;
  }

  var win = document.createElement("div");
  win.className = "window";
  win.style.width = width + "px";
  win.style.height = height + "px";
  win.style.left = (60 + offset) + "px";
  win.style.top = (40 + offset) + "px";
  offset = (offset + 30) % 150;

  win.innerHTML =
    '<div class="titlebar"><span>' + title + '</span>' +
    '<span><button class="min">_</button><button class="close">X</button></span></div>' +
    '<div class="content"></div>';

  desktop.appendChild(win);

  // taskbar button for this window
  var btn = document.createElement("button");
  btn.className = "task";
  btn.textContent = title;
  btn.onclick = function () {
    win.style.display = "flex";
    bringToFront(win);
  };
  tasks.appendChild(btn);
  win.taskBtn = btn;
  openWindows[name] = win;

  // minimize and close
  win.querySelector(".min").onclick = function () { win.style.display = "none"; };
  win.querySelector(".close").onclick = function () {
    desktop.removeChild(win);
    tasks.removeChild(btn);
    delete openWindows[name];
    if (win.onClose) win.onClose();
  };

  // click on window = bring to front
  win.onmousedown = function () { bringToFront(win); };

  // dragging by the title bar
  var bar = win.querySelector(".titlebar");
  bar.onmousedown = function (e) {
    var startX = e.clientX - win.offsetLeft;
    var startY = e.clientY - win.offsetTop;

    document.onmousemove = function (e2) {
      var x = e2.clientX - startX;
      var y = e2.clientY - startY;
      if (y < 0) y = 0; // keep title bar on screen
      win.style.left = x + "px";
      win.style.top = y + "px";
    };
    document.onmouseup = function () {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };

  bringToFront(win);
  return win.querySelector(".content");
}

// ---------- Open an app by name ----------
function openApp(name) {
  if (name === "clock") openClock();
  if (name === "calculator") openCalculator();
  if (name === "terminal") openTerminal();
  if (name === "browser") openBrowser();
  if (name === "about") openAbout();
}

// ---------- App 1: Clock and Calendar ----------
function openClock() {
  var box = makeWindow("clock", "Clock & Calendar", 300, 380);
  if (!box) return;

  var today = new Date();
  var month = today.getMonth();
  var year = today.getFullYear();

  box.innerHTML =
    '<div class="big-clock"></div>' +
    '<div class="cal-head"><button id="prev">&lt;</button><b id="month-name"></b><button id="next">&gt;</button></div>' +
    '<table id="cal"></table>';

  var clockBox = box.querySelector(".big-clock");
  function tick() { clockBox.textContent = new Date().toLocaleTimeString(); }
  tick();
  var timer = setInterval(tick, 1000);
  openWindows["clock"].onClose = function () { clearInterval(timer); };

  function drawCalendar() {
    var names = ["January","February","March","April","May","June","July",
                 "August","September","October","November","December"];
    box.querySelector("#month-name").textContent = names[month] + " " + year;

    var firstDay = new Date(year, month, 1).getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();

    var html = "<tr><th>S</th><th>M</th><th>T</th><th>W</th><th>T</th><th>F</th><th>S</th></tr><tr>";
    for (var i = 0; i < firstDay; i++) html += "<td></td>";

    for (var d = 1; d <= daysInMonth; d++) {
      var isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      html += "<td" + (isToday ? ' class="today"' : "") + ">" + d + "</td>";
      if ((firstDay + d) % 7 === 0) html += "</tr><tr>";
    }
    box.querySelector("#cal").innerHTML = html + "</tr>";
  }

  box.querySelector("#prev").onclick = function () {
    month--;
    if (month < 0) { month = 11; year--; }
    drawCalendar();
  };
  box.querySelector("#next").onclick = function () {
    month++;
    if (month > 11) { month = 0; year++; }
    drawCalendar();
  };
  drawCalendar();
}

// ---------- App 2: Calculator ----------
function openCalculator() {
  var box = makeWindow("calculator", "Calculator", 250, 360);
  if (!box) return;

  var keys = ["7","8","9","/", "4","5","6","*", "1","2","3","-", "0",".","=","+", "C"];
  var html = '<div id="calc-screen">0</div><div class="calc-btns">';
  for (var i = 0; i < keys.length; i++) {
    html += "<button>" + keys[i] + "</button>";
  }
  box.innerHTML = html + "</div>";

  var screen = box.querySelector("#calc-screen");
  var first = null;     // first number
  var op = null;        // chosen operator
  var current = "";     // number being typed

  function calculate(a, b, o) {
    if (o === "+") return a + b;
    if (o === "-") return a - b;
    if (o === "*") return a * b;
    if (o === "/") return b === 0 ? "Error" : a / b;
  }

  var buttons = box.querySelectorAll("button");
  for (var j = 0; j < buttons.length; j++) {
    buttons[j].onclick = function () {
      var key = this.textContent;

      if (key >= "0" && key <= "9" || key === ".") {
        current += key;
        screen.textContent = current;
      } else if (key === "C") {
        first = null; op = null; current = "";
        screen.textContent = "0";
      } else if (key === "=") {
        if (first !== null && op && current !== "") {
          var result = calculate(first, parseFloat(current), op);
          screen.textContent = result;
          current = result === "Error" ? "" : String(result);
          first = null; op = null;
        }
      } else {
        // + - * /
        if (current !== "") {
          first = parseFloat(current);
          current = "";
        }
        op = key;
      }
    };
  }
}

// ---------- App 3: Terminal ----------
function openTerminal() {
  var box = makeWindow("terminal", "Terminal", 480, 320);
  if (!box) return;

  box.style.padding = "0";
  box.innerHTML =
    '<div class="terminal-out">Turbo OS terminal. Type "help" for commands.\n</div>' +
    '<div class="terminal-line"><span style="color:#0f0">turbo&gt;&nbsp;</span><input type="text"></div>';
  box.style.display = "flex";
  box.style.flexDirection = "column";

  var out = box.querySelector(".terminal-out");
  var input = box.querySelector("input");
  input.focus();

  function print(text) {
    out.textContent += text + "\n";
    out.scrollTop = out.scrollHeight;
  }

  input.onkeydown = function (e) {
    if (e.key !== "Enter") return;
    var line = input.value.trim();
    input.value = "";
    print("turbo> " + line);

    var parts = line.split(" ");
    var cmd = parts[0].toLowerCase();
    var rest = parts.slice(1).join(" ");

    if (cmd === "help") {
      print("help, date, time, echo <text>, clear, open <app>, about, reboot");
    } else if (cmd === "date") {
      print(new Date().toLocaleDateString());
    } else if (cmd === "time") {
      print(new Date().toLocaleTimeString());
    } else if (cmd === "echo") {
      print(rest);
    } else if (cmd === "clear") {
      out.textContent = "";
    } else if (cmd === "about") {
      print("Turbo OS v1.0 by Preetham");
    } else if (cmd === "open") {
      if (["clock", "calculator", "terminal", "browser", "about"].indexOf(rest) >= 0) {
        openApp(rest);
      } else {
        print("Apps: clock, calculator, terminal, browser, about");
      }
    } else if (cmd === "reboot") {
      print("Rebooting...");
      setTimeout(function () { location.reload(); }, 800);
    } else if (cmd !== "") {
      print("Unknown command: " + cmd);
    }
  };
}

// ---------- App 4: Browser (Wikipedia API) ----------
function openBrowser() {
  var box = makeWindow("browser", "Browser", 520, 400);
  if (!box) return;

  box.innerHTML =
    '<div class="browser-bar"><input type="text" placeholder="Search Wikipedia...">' +
    '<button>Go</button></div><div class="page"></div>';

  var input = box.querySelector("input");
  var page = box.querySelector(".page");
  var api = "https://en.wikipedia.org/w/api.php?format=json&origin=*&";

  // search for articles
  function search() {
    var text = input.value.trim();
    if (text === "") return;
    page.textContent = "Searching...";

    fetch(api + "action=query&list=search&srsearch=" + encodeURIComponent(text))
      .then(function (res) { return res.json(); })
      .then(function (data) {
        page.innerHTML = "";
        var results = data.query.search;
        if (results.length === 0) page.textContent = "Nothing found.";

        results.forEach(function (item) {
          var div = document.createElement("div");
          div.className = "result";
          // the snippet has html tags in it, so remove them
          var snippet = item.snippet.replace(/<[^>]+>/g, "");
          div.innerHTML = "<b></b><br><span></span>";
          div.querySelector("b").textContent = item.title;
          div.querySelector("span").textContent = snippet + "...";
          div.onclick = function () { openArticle(item.title); };
          page.appendChild(div);
        });
      })
      .catch(function () { page.textContent = "Could not reach Wikipedia."; });
  }

  // show the intro text of one article
  function openArticle(title) {
    page.textContent = "Loading...";
    fetch(api + "action=query&prop=extracts&exintro=1&explaintext=1&titles=" + encodeURIComponent(title))
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var pages = data.query.pages;
        var first = pages[Object.keys(pages)[0]];
        page.innerHTML = "<h3></h3><p></p><button>Back to results</button>";
        page.querySelector("h3").textContent = first.title;
        page.querySelector("p").textContent = first.extract;
        page.querySelector("button").onclick = search;
      })
      .catch(function () { page.textContent = "Could not load the article."; });
  }

  box.querySelector("button").onclick = search;
  input.onkeydown = function (e) { if (e.key === "Enter") search(); };
}

// ---------- App 5: About Me ----------
function openAbout() {
  var box = makeWindow("about", "About Me", 340, 260);
  if (!box) return;

  box.innerHTML =
    "<h2>Turbo OS</h2>" +
    "<p><b>Builder:</b> Preetham</p>" +
    "<p><b>Description:</b> A small black and classic styled web OS built with plain HTML, CSS and JavaScript.</p>" +
    "<p><b>Version:</b> 1.0</p>" +
    "<p><b>Copyright:</b> &copy; 2026 Preetham. All rights reserved.</p>";
}
