var apps = {
  browser: { name: "Browser", icon: "🌐", w: 520, h: 430, build: browserApp },
  terminal: { name: "Terminal", icon: "⌨️", w: 480, h: 320, build: terminalApp },
  media: { name: "Media Player", icon: "🎞️", w: 460, h: 380, build: mediaApp },
  calc: { name: "Calculator", icon: "🧮", w: 290, h: 400, build: calcApp },
  calendar: { name: "Calendar", icon: "📅", w: 340, h: 350, build: calendarApp },
  clock: { name: "Clock", icon: "🕒", w: 300, h: 340, build: clockApp },
  about: { name: "About Me", icon: "👤", w: 400, h: 360, build: aboutApp }
};

var wins = [];
var z = 10;
var count = 0;

var $ = function (id) {
  return document.getElementById(id);
};

function boot(msg) {
  var screen = $("boot");
  var bar = $("bar");
  var progress = 0;

  screen.style.display = "flex";
  bar.style.width = "0";
  $("bmsg").textContent = msg || "Starting...";

  var timer = setInterval(function () {
    progress += 5;
    bar.style.width = progress + "%";

    if (progress > 40) {
      $("bmsg").textContent = "Loading apps...";
    }

    if (progress >= 100) {
      clearInterval(timer);
      screen.style.display = "none";
    }
  }, 100);
}

function reboot() {
  $("menu").classList.remove("open");

  while (wins.length) {
    closeWin(wins[0]);
  }

  boot("Rebooting...");
}

function tick() {
  var now = new Date();

  $("t1").textContent = now.toLocaleTimeString();
  $("t2").textContent = now.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

setInterval(tick, 1000);
tick();

var rows = Math.max(1, Math.floor((innerHeight - 42 - 90) / 88));

Object.keys(apps).forEach(function (key, n) {
  var app = apps[key];

  var icon = document.createElement("div");
  icon.className = "icon";
  icon.innerHTML = "<span>" + app.icon + "</span>" + app.name;
  icon.style.left = (14 + Math.floor(n / rows) * 84) + "px";
  icon.style.top = (78 + (n % rows) * 88) + "px";
  icon.onclick = function () {
    if (icon.dataset.moved !== "1") {
      openApp(key);
    }
  };
  drag(icon, icon);
  $("icons").appendChild(icon);

  var item = document.createElement("div");
  item.className = "item";
  item.textContent = app.icon + "  " + app.name;
  item.onclick = function () {
    openApp(key);
  };
  $("mitems").appendChild(item);
});

$("turbo").onclick = function (e) {
  e.stopPropagation();
  $("menu").classList.toggle("open");
};

document.addEventListener("click", function () {
  $("menu").classList.remove("open");
});

function openApp(key) {
  $("menu").classList.remove("open");

  var app = apps[key];
  var win = { id: ++count, key: key };
  var el = document.createElement("div");
  var offset = (wins.length % 6) * 28;

  el.className = "win";
  el.style.width = Math.min(app.w, innerWidth - 20) + "px";
  el.style.height = Math.min(app.h, innerHeight - 140) + "px";
  el.style.left = Math.min(110 + offset, Math.max(0, innerWidth - app.w - 10)) + "px";
  el.style.top = (80 + offset) + "px";
  el.innerHTML =
    '<div class="bar">' +
      "<b>" + app.icon + " " + app.name + "</b>" +
      '<span><button data-a="min">_</button><button data-a="x">X</button></span>' +
    "</div>" +
    '<div class="body"></div>';

  $("desktop").appendChild(el);
  win.el = el;
  win.body = el.querySelector(".body");

  var taskButton = document.createElement("button");
  taskButton.className = "btn task";
  taskButton.textContent = app.icon + " " + app.name;
  taskButton.onclick = function () {
    if (el.style.display === "none") {
      el.style.display = "flex";
      focusWin(win);
    } else if (el.classList.contains("active")) {
      el.style.display = "none";
      taskButton.classList.remove("on");
    } else {
      focusWin(win);
    }
  };
  $("tasks").appendChild(taskButton);
  win.btn = taskButton;

  wins.push(win);

  el.addEventListener("pointerdown", function () {
    focusWin(win);
  });

  el.querySelector('[data-a="x"]').onclick = function () {
    closeWin(win);
  };

  el.querySelector('[data-a="min"]').onclick = function () {
    el.style.display = "none";
    taskButton.classList.remove("on");
    el.classList.remove("active");
  };

  drag(el, el.querySelector(".bar"));
  app.build(win.body, win);
  focusWin(win);
}

function focusWin(win) {
  wins.forEach(function (other) {
    other.el.classList.remove("active");
    other.btn.classList.remove("on");
  });

  win.el.classList.add("active");
  win.btn.classList.add("on");
  win.el.style.zIndex = ++z;
}

function closeWin(win) {
  win.el.remove();
  win.btn.remove();
  wins.splice(wins.indexOf(win), 1);
}

function drag(el, handle) {
  handle.addEventListener("pointerdown", function (e) {
    if (e.target.tagName === "BUTTON") {
      return;
    }

    var dx = e.clientX - el.offsetLeft;
    var dy = e.clientY - el.offsetTop;

    el.dataset.moved = "0";
    handle.setPointerCapture(e.pointerId);

    function move(ev) {
      var x = ev.clientX - dx;
      var y = ev.clientY - dy;

      if (Math.abs(x - el.offsetLeft) + Math.abs(y - el.offsetTop) > 4) {
        el.dataset.moved = "1";
      }

      var area = el.parentNode;
      x = Math.min(Math.max(0, x), area.clientWidth - 50);
      y = Math.min(Math.max(0, y), area.clientHeight - 30);

      el.style.left = x + "px";
      el.style.top = y + "px";
    }

    function up() {
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", up);
    }

    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", up);
  });
}

function browserApp(box) {
  box.innerHTML =
    '<div class="row">' +
      '<input type="text" placeholder="Search Wikipedia...">' +
      '<button class="btn">Search</button>' +
    "</div>" +
    '<div class="view"><p>Type something above to search Wikipedia.</p></div>';

  var input = box.querySelector("input");
  var view = box.querySelector(".view");
  var api = "https://en.wikipedia.org/w/api.php?origin=*&format=json&";

  function search() {
    var query = input.value.trim();
    if (!query) {
      return;
    }

    view.innerHTML = "<p>Searching...</p>";

    fetch(api + "action=query&list=search&srlimit=8&srsearch=" + encodeURIComponent(query))
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var results = data.query.search;
        view.innerHTML = "";

        if (!results.length) {
          view.innerHTML = "<p>No results found.</p>";
          return;
        }

        results.forEach(function (item) {
          var result = document.createElement("div");
          result.className = "res";

          var title = document.createElement("h4");
          title.textContent = item.title;

          var snippet = document.createElement("p");
          snippet.textContent = item.snippet.replace(/<[^>]+>/g, "") + "...";

          result.appendChild(title);
          result.appendChild(snippet);
          result.onclick = function () {
            openPage(item.title);
          };
          view.appendChild(result);
        });
      })
      .catch(function () {
        view.innerHTML = "<p>Could not reach Wikipedia. Check your connection.</p>";
      });
  }

  function openPage(title) {
    view.innerHTML = "<p>Loading...</p>";

    fetch(api + "action=query&prop=extracts&explaintext=1&exintro=0&redirects=1&titles=" + encodeURIComponent(title))
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var pages = data.query.pages;
        var page = pages[Object.keys(pages)[0]];

        view.innerHTML =
          '<div class="article"></div>' +
          '<div class="row"><button class="btn">Back to results</button></div>';

        var article = view.querySelector(".article");

        var heading = document.createElement("h2");
        heading.textContent = page.title;
        article.appendChild(heading);

        var paragraphs = (page.extract || "No text available.").split("\n").slice(0, 25);
        paragraphs.forEach(function (text) {
          if (!text.trim()) {
            return;
          }
          var p = document.createElement("p");
          p.textContent = text;
          article.appendChild(p);
        });

        view.querySelector(".btn").onclick = search;
      })
      .catch(function () {
        view.innerHTML = "<p>Could not load that page.</p>";
      });
  }

  box.querySelector(".btn").onclick = search;
  input.onkeydown = function (e) {
    if (e.key === "Enter") {
      search();
    }
  };
}

function terminalApp(box, win) {
  box.className += " term";
  box.innerHTML =
    '<div class="out">Turbo OS Terminal. Type "help" for commands.\n</div>' +
    '<div class="line"><span>turbo&gt;</span><input type="text" spellcheck="false"></div>';

  var out = box.querySelector(".out");
  var input = box.querySelector("input");
  var history = [];
  var historyIndex = 0;

  function print(text) {
    out.textContent += text + "\n";
    box.scrollTop = box.scrollHeight;
  }

  var commands = {
    help: function () {
      return (
        "help      list commands\n" +
        "date      show date and time\n" +
        "whoami    show user\n" +
        "echo TEXT print text\n" +
        "open APP  open an app (" + Object.keys(apps).join(", ") + ")\n" +
        "sysinfo   system details\n" +
        "clear     clear the screen\n" +
        "reboot    restart Turbo OS"
      );
    },
    date: function () {
      return new Date().toString();
    },
    whoami: function () {
      return "preetham";
    },
    sysinfo: function () {
      return (
        "Turbo OS 1.0\n" +
        "Open windows: " + wins.length + "\n" +
        "Browser: " + navigator.userAgent.split(" ").pop()
      );
    },
    clear: function () {
      out.textContent = "";
      return "";
    },
    reboot: function () {
      setTimeout(reboot, 400);
      return "Rebooting...";
    }
  };

  input.onkeydown = function (e) {
    if (e.key === "ArrowUp" && history.length) {
      historyIndex = Math.max(0, historyIndex - 1);
      input.value = history[historyIndex];
      return;
    }

    if (e.key !== "Enter") {
      return;
    }

    var line = input.value.trim();
    input.value = "";
    if (!line) {
      return;
    }

    history.push(line);
    historyIndex = history.length;
    print("turbo> " + line);

    var parts = line.split(" ");
    var command = parts[0].toLowerCase();
    var arg = parts.slice(1).join(" ");
    var result;

    if (command === "echo") {
      result = arg;
    } else if (command === "open") {
      if (apps[arg.toLowerCase()]) {
        openApp(arg.toLowerCase());
        result = "Opening " + arg;
      } else {
        result = "No app called '" + arg + "'.";
      }
    } else if (commands[command]) {
      result = commands[command]();
    } else {
      result = "Unknown command: " + command;
    }

    if (result) {
      print(result);
    }
  };

  box.onclick = function () {
    input.focus();
  };

  setTimeout(function () {
    input.focus();
  }, 50);
}

function mediaApp(box) {
  box.innerHTML =
    '<div class="row">' +
      '<input type="text" placeholder="Paste a direct link to a video or audio file">' +
      '<button class="btn">Play</button>' +
    "</div>" +
    "<video controls></video>" +
    '<p style="font-size:12px;color:#999;margin-top:6px">' +
      "Works with direct links (.mp4, .webm, .mp3, .ogg). Some sites block playback from other pages." +
    "</p>";

  var input = box.querySelector("input");
  var video = box.querySelector("video");

  function play() {
    var url = input.value.trim();
    if (!url) {
      return;
    }
    video.src = url;
    video.play().catch(function () {});
  }

  box.querySelector(".btn").onclick = play;
  input.onkeydown = function (e) {
    if (e.key === "Enter") {
      play();
    }
  };
}

function calcApp(box) {
  var keys = [
    "C", "(", ")", "/",
    "7", "8", "9", "*",
    "4", "5", "6", "-",
    "1", "2", "3", "+",
    "0", ".", "DEL", "="
  ];

  box.innerHTML =
    '<div class="calc"><div class="scr">0</div><div class="keys"></div></div>';

  var screen = box.querySelector(".scr");
  var grid = box.querySelector(".keys");
  var expr = "";

  keys.forEach(function (key) {
    var button = document.createElement("button");
    button.className = "btn";
    button.textContent = key;

    button.onclick = function () {
      if (key === "C") {
        expr = "";
      } else if (key === "DEL") {
        expr = expr.slice(0, -1);
      } else if (key === "=") {
        try {
          if (!/^[0-9+\-*/.() ]+$/.test(expr)) {
            throw 0;
          }
          var result = Function('"use strict";return (' + expr + ")")();
          expr = String(Math.round(result * 1e10) / 1e10);
        } catch (e) {
          expr = "";
          screen.textContent = "Error";
          return;
        }
      } else {
        expr += key;
      }

      screen.textContent = expr || "0";
    };

    grid.appendChild(button);
  });
}

function calendarApp(box) {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth();
  var monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  function draw() {
    var firstDay = new Date(year, month, 1).getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();

    var html =
      '<div class="mh">' +
        '<button class="btn" data-d="-1">&lt;</button>' +
        "<b>" + monthNames[month] + " " + year + "</b>" +
        '<button class="btn" data-d="1">&gt;</button>' +
      "</div>" +
      '<table class="cal"><tr>';

    ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].forEach(function (day) {
      html += "<th>" + day + "</th>";
    });

    html += "</tr><tr>";

    for (var i = 0; i < firstDay; i++) {
      html += "<td></td>";
    }

    for (var d = 1; d <= daysInMonth; d++) {
      var isToday =
        d === now.getDate() &&
        month === now.getMonth() &&
        year === now.getFullYear();

      html += "<td" + (isToday ? ' class="today"' : "") + ">" + d + "</td>";

      if ((firstDay + d) % 7 === 0 && d < daysInMonth) {
        html += "</tr><tr>";
      }
    }

    box.innerHTML = html + "</tr></table>";

    box.querySelectorAll("[data-d]").forEach(function (button) {
      button.onclick = function () {
        month += Number(button.dataset.d);

        if (month < 0) {
          month = 11;
          year--;
        }
        if (month > 11) {
          month = 0;
          year++;
        }

        draw();
      };
    });
  }

  draw();
}

function clockApp(box) {
  box.innerHTML =
    '<div class="clk"><canvas width="190" height="190"></canvas><div class="dig"></div></div>';

  var canvas = box.querySelector("canvas");
  var ctx = canvas.getContext("2d");
  var digital = box.querySelector(".dig");

  function drawHand(angle, length, width, color) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.lineCap = "round";
    ctx.moveTo(95, 95);
    ctx.lineTo(95 + length * Math.sin(angle), 95 - length * Math.cos(angle));
    ctx.stroke();
  }

  function draw() {
    if (!document.body.contains(canvas)) {
      clearInterval(timer);
      return;
    }

    var now = new Date();
    ctx.clearRect(0, 0, 190, 190);
    ctx.strokeStyle = "#c8963e";

    for (var i = 0; i < 12; i++) {
      var angle = i * Math.PI / 6;
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.moveTo(95 + 78 * Math.sin(angle), 95 - 78 * Math.cos(angle));
      ctx.lineTo(95 + 88 * Math.sin(angle), 95 - 88 * Math.cos(angle));
      ctx.stroke();
    }

    var seconds = now.getSeconds();
    var minutes = now.getMinutes() + seconds / 60;
    var hours = (now.getHours() % 12) + minutes / 60;

    drawHand(hours * Math.PI / 6, 45, 4, "#e8e2d0");
    drawHand(minutes * Math.PI / 30, 65, 3, "#e8e2d0");
    drawHand(seconds * Math.PI / 30, 72, 1, "#c8963e");

    digital.textContent = now.toLocaleTimeString();
  }

  var timer = setInterval(draw, 1000);
  draw();
}

function aboutApp(box) {
  box.innerHTML =
    '<div class="about">' +
      "<h1>TURBO OS</h1>" +
      "<p><b>Preetham</b></p>" +
      "<p>Turbo OS is a small operating system that runs inside a web page. " +
      "I built it with plain HTML, CSS and JavaScript to see how far a browser tab can go: " +
      "windows you can drag, a start menu, a terminal, a Wikipedia browser and a few everyday tools.</p>" +
      "<p>Version 1.0</p>" +
      "<p>&copy; 2026 Preetham. All rights reserved.</p>" +
    "</div>";
}

boot("Starting...");
    
