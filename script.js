const input = document.getElementById('command-input');
const body = document.getElementById('terminal-body');

input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const cmd = input.value.trim();
        if (cmd === '') return;

        appendOutput(`turbo@os:~$ ${cmd}`);
        handleCommand(cmd);

        input.value = '';
        body.scrollTop = body.scrollHeight;
    }
});

function appendOutput(text) {
    const div = document.createElement('div');
    div.className = 'output';
    div.textContent = text;
    body.appendChild(div);
}

function handleCommand(cmd) {
    switch(cmd.toLowerCase()) {
        case 'help':
            appendOutput("Available commands:\n  help     - Show command list\n  clear    - Clear terminal\n  version  - Display OS version\n  neofetch - System info\n  reboot   - Restart system");
            break;
        case 'clear':
            body.innerHTML = '';
            break;
        case 'version':
            appendOutput("TurboOS v0.1 (x86 Prototype)");
            break;
        case 'neofetch':
            appendOutput("       /\\       turbo@turbo-os\n      /  \\      --------------\n     / /\\ \\     OS: TurboOS x86\n    /_/    \\_\\    Kernel: 0.1-alpha");
            break;
        case 'reboot':
            appendOutput("Rebooting system...");
            setTimeout(() => { body.innerHTML = '<div class="output">TurboOS booting up...</div>'; }, 1000);
            break;
        default:
            appendOutput(`Command not found: ${cmd}. Type 'help' for options.`);
    }
    }
