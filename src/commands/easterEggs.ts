import { CommandHandler, CommandResult } from '../types'
import { c } from '../utils/formatOutput'

export const easterEggs: Record<string, CommandHandler> = {
  'sudo party': (): CommandResult => ({
    output: `\r\n${c.yellow}🎉 PARTY MODE ACTIVATED${c.reset}\r\n${c.magenta}Launching confetti cannon...${c.reset}\r\n`,
    action: { type: 'easter_egg', effect: 'confetti' },
  }),

  matrix: (): CommandResult => ({
    output: `\r\n${c.green}Entering the Matrix...${c.reset}\r\n`,
    action: { type: 'easter_egg', effect: 'matrix' },
  }),

  sl: (): CommandResult => ({
    output: [
      '',
      `${c.yellow}      ====        ________                ___________${c.reset}`,
      `${c.yellow}  _D _|  |_______/        \\__I_I_____===__|_________|${c.reset}`,
      `${c.yellow}   |(_)---  |   H\\________/ |   |        =|___ ___|${c.reset}`,
      `${c.yellow}   /     |  |   H  |  |     |   |         ||_| |_||${c.reset}`,
      `${c.yellow}  |      |  |   H  |__--------------------| [___] |${c.reset}`,
      `${c.yellow}  | ________|___H__/__|_____/[][]~\\_______|       |${c.reset}`,
      `${c.yellow}  |/ |   |-----------I_____I [][] []  D   |=======|__${c.reset}`,
      `${c.cyan}__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__${c.reset}`,
      `${c.cyan} |/-=|___|=    ||    ||    ||    |_____/~\\___/     |${c.reset}`,
      `${c.cyan}  \\_/      \\O=====O=====O=====O_/      \\_/         |${c.reset}`,
      '',
      `${c.gray}You meant 'ls', didn't you?${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  cowsay: (args: string[]): CommandResult => {
    const text = args.join(' ') || 'Moo! SlashDot rocks!'
    const len = text.length + 2
    const top = ` ${'_'.repeat(len)}`
    const mid = `< ${text} >`
    const bot = ` ${'-'.repeat(len)}`
    return {
      output: [
        '',
        `${c.white}${top}`,
        mid,
        bot,
        `        \\   ^__^`,
        `         \\  (oo)\\_______`,
        `            (__)\\       )\\/\\`,
        `                ||----w |`,
        `                ||     ||${c.reset}`,
        '',
      ].join('\r\n'),
    }
  },

  'sudo rm -rf /': (): CommandResult => ({
    output: [
      '',
      `${c.red}rm: it is dangerous to operate recursively on '/'${c.reset}`,
      `${c.red}rm: use --no-preserve-root to override this failsafe${c.reset}`,
      `${c.gray}(Nice try though 😄)${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  clear: (): CommandResult => ({
    output: '',
    action: { type: 'clear' },
  }),

  panic: (): CommandResult => ({
    output: `\r\n${c.red}KERNEL PANIC — initiating...${c.reset}\r\n`,
    action: { type: 'easter_egg', effect: 'panic' },
  }),

  reboot: (): CommandResult => ({
    output: `\r\n${c.green}Rebooting SlashDot OS...${c.reset}\r\n`,
    action: { type: 'easter_egg', effect: 'reboot' },
  }),

  // ── THEME ───────────────────────────────────────────────────────────────────
  theme: (args: string[]): CommandResult => {
    const name = args[0]?.toLowerCase()

    const themes: Record<string, {
      primary: string
      secondary: string
      bg: string
      label: string
    }> = {
      green: {
        primary:   '\x1b[38;2;0;255;70m',
        secondary: '\x1b[38;2;0;200;100m',
        bg:        '#00ff4610',
        label:     'Terminal Green (default)',
      },
      amber: {
        primary:   '\x1b[38;2;255;176;0m',
        secondary: '\x1b[38;2;255;140;0m',
        bg:        '#ffb00010',
        label:     'Phosphor Amber',
      },
      blue: {
        primary:   '\x1b[38;2;0;180;255m',
        secondary: '\x1b[38;2;0;120;220m',
        bg:        '#00b4ff10',
        label:     'Cyan Blue',
      },
      red: {
        primary:   '\x1b[38;2;255;80;80m',
        secondary: '\x1b[38;2;220;50;50m',
        bg:        '#ff505010',
        label:     'Red Alert',
      },
      purple: {
        primary:   '\x1b[38;2;180;100;255m',
        secondary: '\x1b[38;2;140;70;220m',
        bg:        '#b464ff10',
        label:     'Purple Haze',
      },
    }

    if (!name || !themes[name]) {
      return {
        output: [
          '',
          `${c.cyan}Available themes:${c.reset}`,
          '',
          ...Object.entries(themes).map(([key, t]) => {
            const current = (window as any).__slashdotTheme?.name === key
            return `  ${t.primary}${key.padEnd(10)}${c.reset}  ${c.gray}${t.label}${current ? `  ${c.green}← active${c.reset}` : ''}${c.reset}`
          }),
          '',
          `${c.gray}Usage: theme <name>${c.reset}`,
          `${c.gray}Example: theme amber${c.reset}`,
          '',
        ].join('\r\n'),
      }
    }

    const t = themes[name]

    // Store theme globally
    ;(window as any).__slashdotTheme = { name, ...t }

    // Update CSS variables on root
    document.documentElement.style.setProperty('--terminal-primary', t.bg)

    // Update xterm theme via custom event
    window.dispatchEvent(new CustomEvent('slashdot-theme', { detail: { name, theme: t } }))

    return {
      output: [
        '',
        `${t.primary}✓ Theme changed to: ${t.label}${c.reset}`,
        `${c.gray}Prompt and accent colors updated.${c.reset}`,
        '',
      ].join('\r\n'),
    }
  },

  // ── SANDWICH ────────────────────────────────────────────────────────────────
  'sudo make me a sandwich': (): CommandResult => ({
    output: [
      '',
      `${c.green}✓ Okay.${c.reset}`,
      '',
      `${c.white}┌─────────────────────────────┐${c.reset}`,
      `${c.white}│                             │${c.reset}`,
      `${c.white}│   🥪  Your sandwich, sir.   │${c.reset}`,
      `${c.white}│                             │${c.reset}`,
      `${c.white}│   Bread    : Sourdough      │${c.reset}`,
      `${c.white}│   Filling  : Bug-free code  │${c.reset}`,
      `${c.white}│   Sauce    : Stack Overflow │${c.reset}`,
      `${c.white}│   Side     : Fries (crispy) │${c.reset}`,
      `${c.white}│   Drink    : Black coffee   │${c.reset}`,
      `${c.white}│                             │${c.reset}`,
      `${c.white}└─────────────────────────────┘${c.reset}`,
      '',
      `${c.gray}(xkcd.com/149 — because sudo makes it happen)${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  // ── MAKE ME A CGPA ──────────────────────────────────────────────────────────
  'sudo make me a cgpa': (): CommandResult => ({
    output: [
      '',
      `${c.cyan}Connecting to academic server...${c.reset}`,
      `${c.green}✓ Connected${c.reset}`,
      '',
      `${c.cyan}Overriding grade calculation algorithm...${c.reset}`,
      `${c.green}✓ Override successful${c.reset}`,
      '',
      `${c.cyan}Injecting marks...${c.reset}`,
      `${c.green}✓ Done${c.reset}`,
      '',
      `${c.white}┌─────────────────────────────────┐${c.reset}`,
      `${c.white}│   🎓 CGPA Update — 25MS Batch   │${c.reset}`,
      `${c.white}├─────────────────────────────────┤${c.reset}`,
      `${c.white}│   Previous CGPA : ${c.red}¯\\_(ツ)_/¯${c.white}    │${c.reset}`,
      `${c.white}│   New CGPA      : ${c.green}10.0 / 10.0${c.white} │${c.reset}`,
      `${c.white}│   Status        : ${c.green}Dean's List${c.white}  │${c.reset}`,
      `${c.white}│   Scholarship   : ${c.green}Full ride${c.white}    │${c.reset}`,
      `${c.white}└─────────────────────────────────┘${c.reset}`,
      '',
      `${c.green}✓ CGPA updated successfully!${c.reset}`,
      `${c.gray}(Still fake. Please attend your classes.)${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  // ── TOP ─────────────────────────────────────────────────────────────────────

  top: (): CommandResult => {
    const uptime = Math.floor(Math.random() * 60) + 10
    const processes = [
      { pid: 1,    cpu: 0.0,  mem: 0.1,  cmd: 'init' },
      { pid: 42,   cpu: 0.0,  mem: 0.2,  cmd: 'slashdot-kernel' },
      { pid: 108,  cpu: 12.4, mem: 8.3,  cmd: 'browser-tabs (too many)' },
      { pid: 204,  cpu: 8.1,  mem: 12.1, cmd: 'node_modules (growing)' },
      { pid: 312,  cpu: 6.3,  mem: 4.2,  cmd: 'anxiety-daemon' },
      { pid: 420,  cpu: 5.5,  mem: 3.1,  cmd: 'procrastination.exe' },
      { pid: 512,  cpu: 4.2,  mem: 2.8,  cmd: 'vite-dev-server' },
      { pid: 613,  cpu: 3.8,  mem: 6.4,  cmd: 'typescript-checker' },
      { pid: 714,  cpu: 2.1,  mem: 1.2,  cmd: 'coffee-monitor' },
      { pid: 815,  cpu: 1.9,  mem: 0.9,  cmd: 'deadline-reminder' },
      { pid: 916,  cpu: 1.2,  mem: 0.7,  cmd: 'vim (never closes)' },
      { pid: 1024, cpu: 0.8,  mem: 0.4,  cmd: 'slashdot-os-terminal' },
      { pid: 1337, cpu: 0.4,  mem: 0.3,  cmd: 'ssh-iiserkol' },
      { pid: 2048, cpu: 0.2,  mem: 0.2,  cmd: 'matrix-screensaver' },
      { pid: 9999, cpu: 99.9, mem: 99.9, cmd: 'exam-stress (unkillable)' },
    ]
    const totalCpu = processes.reduce((a, p) => a + p.cpu, 0).toFixed(1)
    const totalMem = processes.reduce((a, p) => a + p.mem, 0).toFixed(1)

    return {
      output: [
        '',
        `${c.green}SlashDot OS${c.reset} - top`,
        `${c.white}Tasks: ${c.green}${processes.length} total${c.reset}  ${c.white}Uptime: ${uptime} min${c.reset}  ${c.white}Load avg: 4.20 3.14 2.71${c.reset}`,
        `${c.white}CPU usage: ${c.yellow}${totalCpu}%${c.reset}  ${c.white}Mem usage: ${c.yellow}${totalMem}%${c.reset}  ${c.white}Swap: 0% (we don't do that here)${c.reset}`,
        '',
        `${c.cyan}${'PID'.padEnd(6)}${'CPU%'.padEnd(8)}${'MEM%'.padEnd(8)}COMMAND${c.reset}`,
        `${c.gray}${'─'.repeat(52)}${c.reset}`,
        ...processes.map(p => {
          const cpuCol = p.cpu > 50 ? c.red : p.cpu > 10 ? c.yellow : c.white
          const memCol = p.mem > 50 ? c.red : p.mem > 10 ? c.yellow : c.white
          return `${c.gray}${String(p.pid).padEnd(6)}${c.reset}${cpuCol}${String(p.cpu).padEnd(8)}${c.reset}${memCol}${String(p.mem).padEnd(8)}${c.reset}${c.white}${p.cmd}${c.reset}`
        }),
        '',
        `${c.gray}Press Ctrl+C to stop (just kidding, type 'clear' instead)${c.reset}`,
        `${c.gray}PID 9999 cannot be killed. It never can.${c.reset}`,
        '',
      ].join('\r\n'),
    }
  },

  // ── GIT LOG ─────────────────────────────────────────────────────────────────
  'git': (args: string[]): CommandResult => {
    const sub = args[0]

    if (sub === 'log') {
      const commits = [
        { hash: 'a3f9d2c', author: 'Sankhadeep Bera',  date: 'Thu Apr 10 23:58:00 2026', msg: 'final final FINAL submission (for real this time)' },
        { hash: 'b2e1f8a', author: 'Sankhadeep Bera',  date: 'Thu Apr 10 23:30:00 2026', msg: 'fix: removed the thing that broke the other thing' },
        { hash: 'c9d4e7b', author: 'Sankhadeep Bera',  date: 'Thu Apr 10 22:15:00 2026', msg: 'feat: added ssh easter egg (very important)' },
        { hash: 'd1a6c3f', author: 'Sankhadeep Bera',  date: 'Thu Apr 10 20:00:00 2026', msg: 'fix: why was the logo broken AGAIN' },
        { hash: 'e8b2d9a', author: 'Sankhadeep Bera',  date: 'Thu Apr 10 18:45:00 2026', msg: 'feat: particles go brrr' },
        { hash: 'f4c7e1b', author: 'Sankhadeep Bera',  date: 'Thu Apr 10 16:30:00 2026', msg: 'chore: removed 47 console.log statements' },
        { hash: 'g3d8f2c', author: 'Sankhadeep Bera',  date: 'Thu Apr 10 14:00:00 2026', msg: 'feat: apt install friendship (it works)' },
        { hash: 'h1e9a4d', author: 'Sankhadeep Bera',  date: 'Wed Apr 09 23:00:00 2026', msg: 'fix: TypeScript errors (there were 47)' },
        { hash: 'i7f2b8e', author: 'Sankhadeep Bera',  date: 'Wed Apr 09 20:00:00 2026', msg: 'feat: boot screen now goes bleep bloop' },
        { hash: 'j5a1c9f', author: 'Sankhadeep Bera',  date: 'Wed Apr 09 15:00:00 2026', msg: 'init: initial commit (nothing works)' },
      ]
      return {
        output: [
          '',
          ...commits.map(commit => [
            `${c.yellow}commit ${commit.hash}${c.reset}`,
            `${c.white}Author: ${commit.author}${c.reset}`,
            `${c.white}Date:   ${commit.date}${c.reset}`,
            '',
            `    ${c.white}${commit.msg}${c.reset}`,
            '',
          ].join('\r\n')),
        ].join('\r\n'),
      }
    }

    if (sub === 'blame') {
      const lines = [
        { line: 1,  author: 'Sankhadeep',  code: 'const os = new SlashDotOS()' },
        { line: 2,  author: 'Sankhadeep',  code: 'os.boot() // this took 3 hours' },
        { line: 3,  author: 'Sankhadeep',  code: 'os.loadDesktop()' },
        { line: 4,  author: 'Sankhadeep',  code: 'os.openTerminal() // why is it broken' },
        { line: 5,  author: 'Sankhadeep',  code: 'os.pray() // please work' },
        { line: 6,  author: 'Sankhadeep',  code: '// TODO: fix this before deadline' },
        { line: 7,  author: 'Sankhadeep',  code: '// TODO: fix the other thing too' },
        { line: 8,  author: 'Sankhadeep',  code: 'os.submit() // fingers crossed' },
      ]
      return {
        output: [
          '',
          ...lines.map(l =>
            `${c.yellow}${String(l.line).padStart(3)}${c.reset} ${c.cyan}(${l.author.padEnd(12)})${c.reset} ${c.white}${l.code}${c.reset}`
          ),
          '',
          `${c.gray}git blame: All blame goes to Sankhadeep. As always.${c.reset}`,
          '',
        ].join('\r\n'),
      }
    }

    if (sub === 'status') {
      return {
        output: [
          '',
          `${c.cyan}On branch main${c.reset}`,
          `${c.cyan}Your branch is ahead of 'origin/main' by 1 commit.${c.reset}`,
          '',
          `${c.red}Changes not staged for commit:${c.reset}`,
          `  ${c.red}modified:   src/commands/easterEggs.ts${c.reset}`,
          `  ${c.red}modified:   src/data/team.ts${c.reset}`,
          `  ${c.red}modified:   README.md${c.reset}`,
          '',
          `${c.green}Untracked files:${c.reset}`,
          `  ${c.green}src/components/Desktop/Particles.tsx${c.reset}`,
          `  ${c.green}public/slashdot_logo.png${c.reset}`,
          '',
          `${c.gray}no changes added to commit (use "git add" and/or "git commit -a")${c.reset}`,
          '',
        ].join('\r\n'),
      }
    }

    if (sub === 'commit') {
      return {
        output: [
          '',
          `${c.green}[main a3f9d2c] ${args.slice(2).join(' ') || 'wip: changes'}${c.reset}`,
          `${c.white} 3 files changed, 42 insertions(+), 7 deletions(-)${c.reset}`,
          `${c.gray}(not really, this is a fake OS)${c.reset}`,
          '',
        ].join('\r\n'),
      }
    }

    if (sub === 'push') {
      return {
        output: [
          '',
          `${c.cyan}Enumerating objects: 5, done.${c.reset}`,
          `${c.cyan}Counting objects: 100% (5/5), done.${c.reset}`,
          `${c.cyan}Delta compression using up to 8 threads${c.reset}`,
          `${c.cyan}Compressing objects: 100% (3/3), done.${c.reset}`,
          `${c.green}To https://github.com/berasankhadeep20-lang/Interbatch-Coding-2026-25MS.git${c.reset}`,
          `${c.green}   b2e1f8a..a3f9d2c  main -> main${c.reset}`,
          '',
        ].join('\r\n'),
      }
    }

    return {
      output: [
        '',
        `${c.cyan}usage: git <command>${c.reset}`,
        '',
        `${c.white}Available commands:${c.reset}`,
        `  ${c.green}git log${c.reset}      ${c.gray}Show commit history${c.reset}`,
        `  ${c.green}git blame${c.reset}    ${c.gray}Blame someone for bugs${c.reset}`,
        `  ${c.green}git status${c.reset}   ${c.gray}Show working tree status${c.reset}`,
        `  ${c.green}git commit${c.reset}   ${c.gray}Record changes${c.reset}`,
        `  ${c.green}git push${c.reset}     ${c.gray}Push to remote${c.reset}`,
        '',
      ].join('\r\n'),
    }
  },

  // ── CHANGELOG ───────────────────────────────────────────────────────────────
  changelog: (): CommandResult => ({
    output: [
      '',
      `${c.cyan}┌─────────────────────────────────────────────────┐${c.reset}`,
      `${c.cyan}│         SlashDot OS — Changelog                 │${c.reset}`,
      `${c.cyan}└─────────────────────────────────────────────────┘${c.reset}`,
      '',
      `${c.yellow}v2026.1.0${c.reset} ${c.gray}(2026-04-11 — submission day)${c.reset}`,
      `  ${c.green}+${c.reset} Added everything at 3am`,
      `  ${c.green}+${c.reset} Added particles (very important)`,
      `  ${c.green}+${c.reset} Added sudo give me marks`,
      `  ${c.green}+${c.reset} Added 47 easter eggs`,
      `  ${c.red}-${c.reset} Removed sleep from developer's schedule`,
      `  ${c.red}-${c.reset} Removed sanity (see apt install sanity)`,
      '',
      `${c.yellow}v2026.0.9${c.reset} ${c.gray}(2026-04-10)${c.reset}`,
      `  ${c.green}+${c.reset} Boot screen now types itself dramatically`,
      `  ${c.green}+${c.reset} Added kernel panic (for the vibes)`,
      `  ${c.green}+${c.reset} SSH into IISER now works (fake)`,
      `  ${c.red}-${c.reset} Removed working sleep command`,
      `  ${c.gray}~${c.reset} Fixed TypeScript errors (introduced 12 more)`,
      '',
      `${c.yellow}v2026.0.5${c.reset} ${c.gray}(2026-04-08)${c.reset}`,
      `  ${c.green}+${c.reset} Added xterm.js terminal`,
      `  ${c.green}+${c.reset} Added draggable windows`,
      `  ${c.green}+${c.reset} Added vim (you can't exit it)`,
      `  ${c.gray}~${c.reset} Logos finally show up on GitHub Pages`,
      `  ${c.red}-${c.reset} Accidentally deleted node_modules 3 times`,
      '',
      `${c.yellow}v2026.0.1${c.reset} ${c.gray}(2026-03-22 — competition start)${c.reset}`,
      `  ${c.green}+${c.reset} Initial commit`,
      `  ${c.green}+${c.reset} Added README.md`,
      `  ${c.red}-${c.reset} Nothing works`,
      `  ${c.gray}~${c.reset} Decided to make an OS simulator at 11pm`,
      '',
      `${c.gray}For full history: git log${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  hack: (): CommandResult => ({
    output: [
      '',
      `${c.green}Initializing hack sequence...${c.reset}`,
      `${c.green}Bypassing firewall...${c.reset}`,
      `${c.green}████████████████████ 100%${c.reset}`,
      '',
      `${c.green}ACCESS GRANTED${c.reset}`,
      `${c.gray}Just kidding. This is a fake OS.${c.reset}`,
      '',
    ].join('\r\n'),
    action: { type: 'easter_egg', effect: 'matrix' },
  }),

  'npm install': (): CommandResult => ({
    output: [
      '',
      `${c.cyan}npm warn deprecated everything@1.0.0${c.reset}`,
      `${c.cyan}npm warn deprecated sanity@0.0.1${c.reset}`,
      `${c.cyan}npm warn deprecated sleep@2.0.0${c.reset}`,
      '',
      `${c.green}added 999 packages in 4.20s${c.reset}`,
      `${c.yellow}247 packages are looking for funding${c.reset}`,
      `${c.gray}  run \`npm fund\` to find out more${c.reset}`,
      `${c.red}3 critical vulnerabilities found${c.reset}`,
      `${c.gray}  run \`npm audit fix\` to fix them${c.reset}`,
      `${c.gray}(this is fine)${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  quote: (): CommandResult => {
    const quotes = [
      'IISER Kolkata: where sleep is a myth and coffee is a food group.',
      'SlashDot: we code, we design, we forget to eat.',
      '25MS batch: came for science, stayed for the existential dread.',
      'It works on my machine. — Every 25MS developer, ever.',
      'The deadline is April 11. It is currently April 11. We are fine.',
      'Our WiFi is down but our spirits are... also down.',
      '404: Work-life balance not found.',
      'In IISER we trust. In deadlines we panic.',
    ]
    const q = quotes[Math.floor(Math.random() * quotes.length)]
    return { output: `\r\n${c.yellow}"${q}"${c.reset}\r\n` }
  },

  'font+': (): CommandResult => {
    window.dispatchEvent(new CustomEvent('slashdot-font', { detail: { delta: 1 } }))
    return { output: `\r\n${c.green}✓ Font size increased${c.reset}\r\n` }
  },

  'font-': (): CommandResult => {
    window.dispatchEvent(new CustomEvent('slashdot-font', { detail: { delta: -1 } }))
    return { output: `\r\n${c.green}✓ Font size decreased${c.reset}\r\n` }
  },

  'crt': (args: string[]): CommandResult => {
    const on = args[0] === 'on'
    const off = args[0] === 'off'
    if (!on && !off) {
      return { output: `\r\n${c.gray}Usage: crt on / crt off${c.reset}\r\n` }
    }
    document.querySelector('.scanlines')?.setAttribute(
      'style', on ? 'opacity:1' : 'opacity:0'
    )
    return {
      output: `\r\n${c.green}✓ CRT effect ${on ? 'enabled' : 'disabled'}${c.reset}\r\n`,
    }
  },

  // ── NEW EASTER EGGS ─────────────────────────────────────────────────────────
  'ls -la': (): CommandResult => ({
    output: [
      '',
      `${c.cyan}total 42${c.reset}`,
      `${c.white}drwxr-xr-x  slashdot  staff   .${c.reset}`,
      `${c.white}drwxr-xr-x  slashdot  staff   ..${c.reset}`,
      `${c.red}-rw-------  slashdot  staff   .secrets${c.reset}`,
      `${c.red}-rw-------  slashdot  staff   .crush_name.txt${c.reset}`,
      `${c.red}-rw-------  slashdot  staff   .actual_cgpa.txt${c.reset}`,
      `${c.red}-rw-------  slashdot  staff   .number_of_bugs.log${c.reset}`,
      `${c.red}-rw-------  slashdot  staff   .times_cried_over_code.txt${c.reset}`,
      `${c.white}-rw-r--r--  slashdot  staff   about.txt${c.reset}`,
      `${c.white}-rw-r--r--  slashdot  staff   README.md${c.reset}`,
      `${c.white}-rwxr-xr-x  slashdot  staff   contact.sh${c.reset}`,
      `${c.white}-rw-r--r--  slashdot  staff   team.db${c.reset}`,
      `${c.white}-rw-r--r--  slashdot  staff   stack.log${c.reset}`,
      '',
      `${c.gray}Hint: try 'cat .secrets'${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  'cat .secrets': (): CommandResult => ({
    output: [
      '',
      `${c.red}Permission denied.${c.reset}`,
      `${c.gray}(some things are better left unknown)${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  'cat .actual_cgpa.txt': (): CommandResult => ({
    output: `\r\n${c.red}Permission denied. Even you don't want to know.${c.reset}\r\n`,
  }),

  'sudo apt-get install iiser-wifi': (): CommandResult => ({
    output: [
      '',
      `${c.cyan}Reading package lists...${c.reset} Done`,
      `${c.cyan}Building dependency tree...${c.reset} Done`,
      `${c.cyan}Selecting package iiser-wifi...${c.reset}`,
      `${c.yellow}Connecting to repository...${c.reset}`,
      `${c.yellow}Connecting to repository...${c.reset}`,
      `${c.yellow}Connecting to repository...${c.reset}`,
      `${c.red}E: Failed to connect. Connection timed out.${c.reset}`,
      `${c.red}E: Unable to locate package 'iiser-wifi'${c.reset}`,
      `${c.gray}(The WiFi itself is preventing you from installing WiFi.)${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  './run_exam.sh': (): CommandResult => ({
    output: [
      '',
      `${c.cyan}Loading exam...${c.reset}`,
      `${c.green}✓ Exam loaded${c.reset}`,
      '',
      `${c.white}┌─────────────────────────────────────────────────────┐${c.reset}`,
      `${c.white}│  IISER Kolkata — End Semester Examination 2026      │${c.reset}`,
      `${c.white}│  Subject: Everything You Never Studied              │${c.reset}`,
      `${c.white}│  Time: 3 hours    Max Marks: 100                    │${c.reset}`,
      `${c.white}├─────────────────────────────────────────────────────┤${c.reset}`,
      `${c.white}│                                                     │${c.reset}`,
      `${c.white}│  Q1. Explain the universe. (10 marks)               │${c.reset}`,
      `${c.white}│  Q2. Prove P = NP. Show all work. (20 marks)        │${c.reset}`,
      `${c.white}│  Q3. What is the meaning of life? (42 marks)        │${c.reset}`,
      `${c.white}│  Q4. Why did you join IISER? (28 marks)             │${c.reset}`,
      `${c.white}│                                                     │${c.reset}`,
      `${c.white}│  Note: All questions are compulsory.                │${c.reset}`,
      `${c.white}│  Note: No partial marking.                          │${c.reset}`,
      `${c.white}│  Note: Good luck. You'll need it.                   │${c.reset}`,
      `${c.white}└─────────────────────────────────────────────────────┘${c.reset}`,
      '',
      `${c.gray}Type 'sudo give me marks' to skip the exam.${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  'import antigravity': (): CommandResult => ({
    output: [
      '',
      `${c.cyan}import antigravity${c.reset}`,
      '',
      `${c.green}✓ antigravity module loaded${c.reset}`,
      `${c.yellow}Weee! I'm flying!${c.reset}`,
      '',
      `${c.white}        o${c.reset}`,
      `${c.white}       /|\\${c.reset}`,
      `${c.white}       / \\${c.reset}`,
      `${c.white}      ^^^^^${c.reset}`,
      '',
      `${c.gray}(xkcd.com/353)${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  'sudo chmod 777 life': (): CommandResult => ({
    output: [
      '',
      `${c.cyan}chmod: changing permissions of 'life'...${c.reset}`,
      `${c.green}✓ Done. You now have full permissions to life.${c.reset}`,
      '',
      `${c.white}rwxrwxrwx  you  life${c.reset}`,
      '',
      `${c.yellow}Warning: With great power comes great responsibility.${c.reset}`,
      `${c.gray}Also your parents may revoke these permissions.${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  'curl iiserkol.ac.in': (): CommandResult => ({
    output: [
      '',
      `${c.cyan}curl: connecting to iiserkol.ac.in...${c.reset}`,
      `${c.yellow}curl: (6) Could not resolve host: iiserkol.ac.in${c.reset}`,
      `${c.red}curl: (7) Failed to connect: Network unreachable${c.reset}`,
      `${c.gray}(Have you tried turning the WiFi off and on again?)${c.reset}`,
      `${c.gray}(Trick question — it was never on.)${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  nyan: (): CommandResult => ({
    output: [
      '',
      `${c.magenta}+      o     +              o   ${c.reset}`,
      `${c.magenta}    +             o     +       +${c.reset}`,
      `${c.cyan}+--+--+--+--+--+--+--+--+--+--+${c.reset}`,
      `${c.red}|  ${c.reset}${c.yellow}~(=^‥^)ノ彡☆${c.reset}             ${c.red}|${c.reset}`,
      `${c.cyan}+--+--+--+--+--+--+--+--+--+--+${c.reset}`,
      `${c.magenta}   +      +        +   o    +   ${c.reset}`,
      '',
      `${c.gray}Nyan nyan nyan nyan nyan! 🌈${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  yes: (): CommandResult => ({
    output: [
      '',
      `${c.green}yes${c.reset}`,
      `${c.green}yes${c.reset}`,
      `${c.green}yes${c.reset}`,
      `${c.green}yes${c.reset}`,
      `${c.green}yes${c.reset}`,
      `${c.green}yes${c.reset}`,
      `${c.green}yes${c.reset}`,
      `${c.green}yes${c.reset}`,
      `${c.green}yes${c.reset}`,
      `${c.green}yes${c.reset}`,
      `${c.gray}... (use Ctrl+C to stop, just kidding this already stopped)${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  banner: (args: string[]): CommandResult => {
    const text = args.join(' ') || 'SlashDot'
    const line = '█'.repeat(text.length + 4)
    return {
      output: [
        '',
        `${c.green}${line}${c.reset}`,
        `${c.green}█ ${c.yellow}${text.toUpperCase()} ${c.green}█${c.reset}`,
        `${c.green}${line}${c.reset}`,
        '',
      ].join('\r\n'),
    }
  },

  echo: (args: string[]): CommandResult => ({
    output: `\r\n${c.white}${args.join(' ')}${c.reset}\r\n`,
  }),

  'cat /etc/passwd': (): CommandResult => ({
    output: [
      '',
      `${c.cyan}root:x:0:0:root:/root:/bin/bash${c.reset}`,
      `${c.white}slashdot:x:1000:1000:SlashDot OS User:/home/slashdot:/bin/slashdot-sh${c.reset}`,
      `${c.white}sankhadeep:x:1001:1001:Sankhadeep Bera:/home/sankhadeep:/bin/bash${c.reset}`,
      `${c.white}shuvam:x:1002:1002:Shuvam Banerji Seal:/home/shuvam:/bin/bash${c.reset}`,
      `${c.white}anuprovo:x:1003:1003:Anuprovo Debnath:/home/anuprovo:/bin/bash${c.reset}`,
      `${c.white}abhinav:x:1004:1004:Abhinav Dhingra:/home/abhinav:/bin/bash${c.reset}`,
      `${c.white}exam_stress:x:9999:9999:unkillable:/proc/9999:/bin/panic${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  // ── TERMINAL POLISH ─────────────────────────────────────────────────────────
  uptime: (): CommandResult => {
    const mins = Math.floor(Math.random() * 120) + 10
    const hrs = Math.floor(mins / 60)
    const rem = mins % 60
    return {
      output: [
        '',
        `${c.white}System uptime: ${c.green}${hrs}h ${rem}m${c.reset}`,
        `${c.white}Users logged in: ${c.green}1${c.reset} ${c.gray}(just you, alone, at ${new Date().toLocaleTimeString()})${c.reset}`,
        `${c.white}Load average: ${c.yellow}4.20 3.14 2.71${c.reset}`,
        `${c.white}Coffee consumed: ${c.red}∞ cups${c.reset}`,
        `${c.white}Sleep hours: ${c.red}not enough${c.reset}`,
        `${c.white}Bugs introduced today: ${c.red}${Math.floor(Math.random() * 20) + 3}${c.reset}`,
        `${c.white}Bugs fixed today: ${c.green}${Math.floor(Math.random() * 5) + 1}${c.reset}`,
        '',
      ].join('\r\n'),
    }
  },

  cal: (): CommandResult => {
    const now = new Date()
    const month = now.toLocaleString('default', { month: 'long' })
    const year = now.getFullYear()
    const firstDay = new Date(year, now.getMonth(), 1).getDay()
    const daysInMonth = new Date(year, now.getMonth() + 1, 0).getDate()
    const today = now.getDate()

    let cal = `\r\n  ${c.cyan}${month} ${year}${c.reset}\r\n`
    cal += `  ${c.gray}Su Mo Tu We Th Fr Sa${c.reset}\r\n  `

    let day = 1
    for (let i = 0; i < firstDay; i++) cal += '   '
    for (let i = firstDay; i < 7; i++) {
      cal += day === today
        ? `${c.green}${String(day).padStart(2)}${c.reset} `
        : `${c.white}${String(day).padStart(2)}${c.reset} `
      day++
    }
    cal += '\r\n  '
    while (day <= daysInMonth) {
      for (let i = 0; i < 7 && day <= daysInMonth; i++) {
        cal += day === today
          ? `${c.green}${String(day).padStart(2)}${c.reset} `
          : `${c.white}${String(day).padStart(2)}${c.reset} `
        day++
      }
      cal += '\r\n  '
    }
    return { output: cal }
  },

  tree: (): CommandResult => ({
    output: [
      '',
      `${c.cyan}/home/slashdot${c.reset}`,
      `${c.white}├── about.txt${c.reset}`,
      `${c.white}├── README.md${c.reset}`,
      `${c.white}├── contact.sh${c.reset}`,
      `${c.white}├── team.db${c.reset}`,
      `${c.white}├── stack.log${c.reset}`,
      `${c.cyan}└── projects/${c.reset}`,
      `${c.white}    ├── web-terminal.exe${c.reset}`,
      `${c.white}    ├── particle-sim.bin${c.reset}`,
      `${c.white}    └── algo-visualizer.run${c.reset}`,
      '',
      `${c.gray}3 directories, 8 files${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  stats: (): CommandResult => {
    const hist = ((window as any).__slashdotHistory as string[]) ?? []
    const unique = new Set(hist).size
    const easter = hist.filter((c: string) =>
      ['sudo party','matrix','vim','sl','cowsay','nyan','hack'].some(e => c.includes(e))
    ).length
    return {
      output: [
        '',
        `${c.cyan}── Session Stats ──────────────────────${c.reset}`,
        '',
        `${c.white}Commands typed    ${c.reset}${c.green}${hist.length}${c.reset}`,
        `${c.white}Unique commands   ${c.reset}${c.green}${unique}${c.reset}`,
        `${c.white}Easter eggs found ${c.reset}${c.green}${easter}${c.reset}`,
        `${c.white}Time wasted       ${c.reset}${c.yellow}priceless${c.reset}`,
        `${c.white}Productivity      ${c.reset}${c.red}${Math.max(0, 100 - hist.length * 2)}%${c.reset}`,
        '',
      ].join('\r\n'),
    }
  },

  reset: (): CommandResult => ({
    output: '',
    action: { type: 'easter_egg', effect: 'reset' },
  }),

  // ── FUN COMMANDS ────────────────────────────────────────────────────────────
  'sudo give me a job': (): CommandResult => ({
    output: [
      '',
      `${c.cyan}Sending resume to top tech companies...${c.reset}`,
      '',
      `${c.green}✓ Google    — Offer received: $450,000/yr + free food${c.reset}`,
      `${c.green}✓ Meta      — Offer received: $420,000/yr + VR headset${c.reset}`,
      `${c.green}✓ Apple     — Offer received: $400,000/yr + MacBook Pro${c.reset}`,
      `${c.green}✓ Microsoft — Offer received: $380,000/yr + free Windows${c.reset}`,
      `${c.green}✓ Anthropic — Offer received: work with Claude all day${c.reset}`,
      `${c.green}✓ IISER     — Offer received: PhD stipend ₹37,000/month${c.reset}`,
      '',
      `${c.yellow}Recommended: Take the Anthropic offer.${c.reset}`,
      `${c.gray}(All offers are fake. Please update your LinkedIn.)${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  'sudo make me coffee': (): CommandResult => ({
    output: [
      '',
      `${c.cyan}Initializing coffee module...${c.reset}`,
      `${c.green}✓ Water heated to 94°C${c.reset}`,
      `${c.green}✓ Beans ground (medium-fine)${c.reset}`,
      `${c.green}✓ Espresso extracted (28 seconds)${c.reset}`,
      `${c.green}✓ Milk steamed to 65°C${c.reset}`,
      '',
      `${c.white}    ( (${c.reset}`,
      `${c.white}     ) )${c.reset}`,
      `${c.white}  ........${c.reset}`,
      `${c.white}  |      |]${c.reset}`,
      `${c.white}  \\      /${c.reset}`,
      `${c.white}   \`----'${c.reset}`,
      '',
      `${c.green}☕ Your coffee is ready!${c.reset}`,
      `${c.gray}Caution: May cause inability to sleep and sudden urge to code.${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  leetcode: (): CommandResult => ({
    output: [
      '',
      `${c.cyan}┌─────────────────────────────────────────────────────┐${c.reset}`,
      `${c.cyan}│  LeetCode — Daily Challenge                         │${c.reset}`,
      `${c.cyan}├─────────────────────────────────────────────────────┤${c.reset}`,
      `${c.white}│                                                     │${c.reset}`,
      `${c.white}│  Problem #420: Graduate Without Crying              │${c.reset}`,
      `${c.yellow}│  Difficulty: IMPOSSIBLE                             │${c.reset}`,
      `${c.white}│                                                     │${c.reset}`,
      `${c.white}│  Given: 4 years of IISER                            │${c.reset}`,
      `${c.white}│  Find: Work-life balance                            │${c.reset}`,
      `${c.white}│                                                     │${c.reset}`,
      `${c.white}│  Constraints:                                       │${c.reset}`,
      `${c.white}│  - Sleep ≤ 4 hours                                  │${c.reset}`,
      `${c.white}│  - Coffee ≥ 5 cups/day                              │${c.reset}`,
      `${c.white}│  - Deadlines are always tomorrow                    │${c.reset}`,
      `${c.white}│                                                     │${c.reset}`,
      `${c.red}│  Acceptance rate: 0.0%                              │${c.reset}`,
      `${c.white}│                                                     │${c.reset}`,
      `${c.cyan}└─────────────────────────────────────────────────────┘${c.reset}`,
      '',
      `${c.gray}Hint: There is no solution. This is the way.${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  'iiser wifi': (): CommandResult => ({
    output: [
      '',
      `${c.cyan}PING iiser-wifi (10.0.0.1) 56 bytes of data.${c.reset}`,
      `${c.red}Request timeout for icmp_seq 0${c.reset}`,
      `${c.red}Request timeout for icmp_seq 1${c.reset}`,
      `${c.red}Request timeout for icmp_seq 2${c.reset}`,
      `${c.red}Request timeout for icmp_seq 3${c.reset}`,
      '',
      `${c.gray}--- iiser-wifi ping statistics ---${c.reset}`,
      `${c.white}4 packets transmitted, 0 received, ${c.red}100% packet loss${c.reset}`,
      '',
      `${c.yellow}Diagnosis: WiFi is being WiFi.${c.reset}`,
      `${c.gray}Solution: Use mobile data. Or pray.${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  'exam physics': (args: string[]): CommandResult => {
    const subject = args[0] || 'physics'
    return {
      output: [
        '',
        `${c.cyan}Generating ${subject} exam...${c.reset}`,
        '',
        `${c.white}┌─────────────────────────────────────────────────────┐${c.reset}`,
        `${c.white}│  IISER Kolkata — ${subject.toUpperCase().padEnd(35)}│${c.reset}`,
        `${c.white}├─────────────────────────────────────────────────────┤${c.reset}`,
        `${c.white}│  Q1. Derive everything from first principles.(100m) │${c.reset}`,
        `${c.white}│  Q2. Prove your existence using ${subject}. (∞ marks)  │${c.reset}`,
        `${c.white}│  Q3. Why? (420 marks)                               │${c.reset}`,
        `${c.white}└─────────────────────────────────────────────────────┘${c.reset}`,
        '',
        `${c.gray}Type 'sudo give me marks' to auto-submit.${c.reset}`,
        '',
      ].join('\r\n'),
    }
  },

  exam: (args: string[]): CommandResult => {
    return easterEggs['exam physics'](args)
  },
  
  wallpaper: (args: string[]): CommandResult => {
    const color = args[0]?.toLowerCase()
    const wallpapers: Record<string, string> = {
      dark:    '#050505',
      green:   '#001a00',
      blue:    '#000d1a',
      purple:  '#0d0014',
      red:     '#1a0000',
      amber:   '#1a0f00',
      matrix:  '#001200',
      default: '#050505',
    }
    if (!color || !wallpapers[color]) {
      return {
        output: [
          '',
          `${c.cyan}Available wallpapers:${c.reset}`,
          `  ${c.white}dark, green, blue, purple, red, amber, matrix, default${c.reset}`,
          `${c.gray}Usage: wallpaper <name>${c.reset}`,
          '',
        ].join('\r\n'),
      }
    }
    document.querySelector('.desktop')?.setAttribute(
      'style', `background-color: ${wallpapers[color]}`
    )
    return {
      output: `\r\n${c.green}✓ Wallpaper changed to: ${color}${c.reset}\r\n`,
    }
  },
  
  // ── CURSOR ──────────────────────────────────────────────────────────────────

  cursor: (args: string[]): CommandResult => {
    const style = args[0]?.toLowerCase()
    const valid = ['block', 'bar', 'underline']

    if (!style || !valid.includes(style)) {
      return {
        output: [
          '',
          `${c.cyan}Usage: cursor <style>${c.reset}`,
          `${c.gray}Available: block, bar, underline${c.reset}`,
          '',
        ].join('\r\n'),
      }
    }

    window.dispatchEvent(new CustomEvent('slashdot-cursor', { detail: { style } }))

    return {
      output: [
        '',
        `${c.green}✓ Cursor style changed to: ${style}${c.reset}`,
        '',
      ].join('\r\n'),
    }
  },

  // ── MEMBERS ─────────────────────────────────────────────────────────────────
  members: (): CommandResult => ({
    output: [
      '',
      `${c.cyan}┌─────────────────────────────────────────────────┐${c.reset}`,
      `${c.cyan}│         SlashDot Club — Office Bearers          │${c.reset}`,
      `${c.cyan}│      Programming & Design Club, IISER Kolkata   │${c.reset}`,
      `${c.cyan}└─────────────────────────────────────────────────┘${c.reset}`,
      '',
      `${c.yellow}// Current Office Bearers${c.reset}`,
      '',
      `  ${c.green}[01]${c.reset} ${c.white}Shuvam Banerji Seal${c.reset}`,
      `       ${c.gray}✉  sbs22ms076@iiserkol.ac.in${c.reset}`,
      `       ${c.cyan}⚑  22MS Batch${c.reset}`,
      '',
      `  ${c.green}[02]${c.reset} ${c.white}Anuprovo Debnath${c.reset}`,
      `       ${c.gray}✉  ad23ms110@iiserkol.ac.in${c.reset}`,
      `       ${c.cyan}⚑  23MS Batch${c.reset}`,
      '',
      `  ${c.green}[03]${c.reset} ${c.white}Abhinav Dhingra${c.reset}`,
      `       ${c.gray}✉  ad24ms110@iiserkol.ac.in${c.reset}`,
      `       ${c.cyan}⚑  24MS Batch${c.reset}`,
      '',
      `${c.gray}─────────────────────────────────────────────────────${c.reset}`,
      `${c.yellow}// Competition Entry${c.reset}`,
      '',
      `  ${c.green}[04]${c.reset} ${c.white}Sankhadeep Bera${c.reset}`,
      `       ${c.gray}✉  berasankhadeep20-lang@github${c.reset}`,
      `       ${c.cyan}⚑  25MS Batch — SlashDot OS Developer${c.reset}`,
      '',
      `${c.gray}Type 'open team' to see the full 25MS team.${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  // ── WEATHER ─────────────────────────────────────────────────────────────────

  weather: (): CommandResult => {
    const conditions = [
      { icon: '☀', desc: 'Sunny', temp: 34, feel: 38, humidity: 65 },
      { icon: '⛅', desc: 'Partly Cloudy', temp: 30, feel: 33, humidity: 72 },
      { icon: '🌧', desc: 'Raining (again)', temp: 26, feel: 25, humidity: 95 },
      { icon: '🌩', desc: 'Thunderstorm', temp: 24, feel: 23, humidity: 98 },
      { icon: '🌫', desc: 'Foggy', temp: 22, feel: 21, humidity: 88 },
      { icon: '🔥', desc: 'Extremely Hot', temp: 42, feel: 47, humidity: 60 },
    ]
    const w = conditions[Math.floor(Math.random() * conditions.length)]
    const days = [
      { day: 'Tomorrow', icon: '⛅', temp: 31 },
      { day: 'Wednesday', icon: '🌧', temp: 27 },
      { day: 'Thursday', icon: '☀', temp: 35 },
      { day: 'Friday', icon: '🌩', temp: 25 },
    ]
    return {
      output: [
        '',
        `${c.cyan}┌─────────────────────────────────────────────┐${c.reset}`,
        `${c.cyan}│  Weather — IISER Kolkata Campus             │${c.reset}`,
        `${c.cyan}│  Mohanpur, West Bengal, India               │${c.reset}`,
        `${c.cyan}└─────────────────────────────────────────────┘${c.reset}`,
        '',
        `  ${w.icon}  ${c.yellow}${w.desc}${c.reset}`,
        '',
        `  ${c.white}Temperature   ${c.reset}${c.yellow}${w.temp}°C${c.reset}  ${c.gray}(feels like ${w.feel}°C)${c.reset}`,
        `  ${c.white}Humidity      ${c.reset}${c.cyan}${w.humidity}%${c.reset}`,
        `  ${c.white}Wind          ${c.reset}${c.white}12 km/h NE${c.reset}`,
        `  ${c.white}Visibility    ${c.reset}${c.white}8 km${c.reset}`,
        `  ${c.white}UV Index      ${c.reset}${c.red}Very High (protect your laptop)${c.reset}`,
        '',
        `  ${c.gray}── 4-Day Forecast ────────────────────────${c.reset}`,
        '',
        ...days.map(d =>
          `  ${d.icon}  ${c.white}${d.day.padEnd(12)}${c.reset}  ${c.yellow}${d.temp}°C${c.reset}`
        ),
        '',
        `  ${c.gray}── Campus Conditions ─────────────────────${c.reset}`,
        '',
        `  ${c.white}Canteen queue    ${c.reset}${c.red}Dangerously long${c.reset}`,
        `  ${c.white}Library AC       ${c.reset}${c.green}Working (miracle)${c.reset}`,
        `  ${c.white}Hostel WiFi      ${c.reset}${c.red}Down (as always)${c.reset}`,
        `  ${c.white}Exam stress      ${c.reset}${c.red}Maximum${c.reset}`,
        `  ${c.white}Coffee supply    ${c.reset}${c.yellow}Critical${c.reset}`,
        '',
        `  ${c.gray}Last updated: ${new Date().toLocaleTimeString()}${c.reset}`,
        '',
      ].join('\r\n'),
    }
  },

  sudo: (args: string[]): CommandResult => {
    if (args[0] === 'party') return easterEggs['sudo party']([])
    if (args[0] === 'rm')    return easterEggs['sudo rm -rf /']([])
    if (args[0] === 'apt')   return easterEggs['apt'](['install', ...args.slice(2)])
    if (args.join(' ') === 'give me marks') return easterEggs['sudo give me marks']([])
    if (args.join(' ') === 'make me a sandwich') return easterEggs['sudo make me a sandwich']([])
    if (args.join(' ') === 'make me a cgpa') return easterEggs['sudo make me a cgpa']([])
    return {
      output: `\r\n${c.red}sudo: ${args.join(' ')}: command not allowed${c.reset}\r\n${c.gray}This incident will be reported.${c.reset}\r\n`,
    }
  },


  fortune: (): CommandResult => {
    const quotes = [
      'Any sufficiently advanced technology is indistinguishable from magic. — Clarke',
      'Programs must be written for people to read, and only incidentally for machines to execute. — Abelson',
      'The best way to predict the future is to invent it. — Kay',
      'Talk is cheap. Show me the code. — Torvalds',
      'First, solve the problem. Then, write the code. — Johnson',
      'It works on my machine. — Every Developer Ever',
      'There are only two hard things in CS: cache invalidation and naming things. — Knuth',
    ]
    const q = quotes[Math.floor(Math.random() * quotes.length)]
    return { output: `\r\n${c.yellow}"${q}"${c.reset}\r\n` }
  },

  

  // ── VIM ─────────────────────────────────────────────────────────────────────
  vim: (args: string[]): CommandResult => {
    const file = args[0] || 'untitled'
    const fileContents: Record<string, string[]> = {
      'about.txt': [
        '# SlashDot OS — About',
        '',
        'SlashDot OS is a browser-based OS simulator',
        'built for the Inter-Batch Website Development',
        'Competition 2026, organized by SlashDot Club',
        'at IISER Kolkata.',
        '',
        'The theme: what if the club website WAS',
        'an operating system?',
      ],
      'README.md': [
        '# SlashDot OS — 25MS Batch',
        '',
        'Welcome to SlashDot OS.',
        'Type "help" to see available commands.',
        '',
        'Built with love by the 25MS batch.',
      ],
      'untitled': [''],
    }
    const lines = fileContents[file] ?? [`"${file}" [New File]`]
    return {
      output: [
        '',
        `${lines.map((l, i) => `${c.gray}${String(i + 1).padStart(3)} ${c.reset}${c.white}${l}`).join('\r\n')}${c.reset}`,
        '',
        `${c.gray}~\r\n~\r\n~\r\n~${c.reset}`,
        '',
        `${c.cyan}-- INSERT -- ${c.reset}${c.gray}(fake vim — type :q to quit, :wq to save & quit)${c.reset}`,
        '',
        `${c.green}"${file}" ${lines.length}L, ${lines.join('').length}C${c.reset}`,
        '',
        `${c.gray}Type  :q   to quit${c.reset}`,
        `${c.gray}Type  :wq  to save and quit${c.reset}`,
        `${c.gray}Type  :wq! to force save (still fake)${c.reset}`,
        '',
      ].join('\r\n'),
      action: { type: 'easter_egg', effect: 'vim' },
    }
  },

  ':q': (): CommandResult => ({
    output: `\r\n${c.yellow}Exiting vim...${c.reset}\r\n${c.green}Welcome back to reality.${c.reset}\r\n`,
  }),

  ':wq': (): CommandResult => ({
    output: `\r\n${c.green}File saved! (not really, this is a fake OS)${c.reset}\r\n${c.yellow}Exiting vim...${c.reset}\r\n`,
  }),

  ':wq!': (): CommandResult => ({
    output: `\r\n${c.green}Force saved! (still fake)${c.reset}\r\n${c.yellow}Exiting vim...${c.reset}\r\n`,
  }),

  ':q!': (): CommandResult => ({
    output: `\r\n${c.red}Discarding changes...${c.reset}\r\n${c.yellow}Exiting vim...${c.reset}\r\n`,
  }),

  // ── SUDO GIVE ME MARKS ──────────────────────────────────────────────────────
  'sudo give me marks': (): CommandResult => ({
    output: [
      '',
      `${c.cyan}Connecting to IISER Kolkata Academic Server...${c.reset}`,
      `${c.green}✓ Connected${c.reset}`,
      '',
      `${c.cyan}Authenticating as: slashdot-user${c.reset}`,
      `${c.green}✓ Authentication successful${c.reset}`,
      '',
      `${c.cyan}Fetching grade records...${c.reset}`,
      `${c.green}✓ Records found${c.reset}`,
      '',
      `${c.white}┌─────────────────────────────────────────┐${c.reset}`,
      `${c.white}│         25MS Grade Report 2026          │${c.reset}`,
      `${c.white}├──────────────────────┬──────────────────┤${c.reset}`,
      `${c.white}│ Course               │ Grade            │${c.reset}`,
      `${c.white}├──────────────────────┼──────────────────┤${c.reset}`,
      `${c.white}│ Mathematics I        │ ${c.green}A+${c.white}               │${c.reset}`,
      `${c.white}│ Physics I            │ ${c.green}A+${c.white}               │${c.reset}`,
      `${c.white}│ Chemistry I          │ ${c.green}A+${c.white}               │${c.reset}`,
      `${c.white}│ Biology I            │ ${c.green}A+${c.white}               │${c.reset}`,
      `${c.white}│ CS Fundamentals      │ ${c.green}A+${c.white}               │${c.reset}`,
      `${c.white}│ Web Dev Competition  │ ${c.green}A+ (obviously)${c.white}   │${c.reset}`,
      `${c.white}├──────────────────────┼──────────────────┤${c.reset}`,
      `${c.white}│ CGPA                 │ ${c.green}10.0 / 10.0${c.white}      │${c.reset}`,
      `${c.white}└──────────────────────┴──────────────────┘${c.reset}`,
      '',
      `${c.green}✓ Grades updated successfully!${c.reset}`,
      `${c.gray}(This is a fake OS. Please study for real exams.)${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  // ── PROCRASTINATE ───────────────────────────────────────────────────────────
  'procrastinate': (): CommandResult => ({
    output: [
      '',
      `${c.cyan}Opening SlashTube...${c.reset}`,
      `${c.gray}The video platform for people who should be studying${c.reset}`,
      '',
      `${c.white}┌─────────────────────────────────────────────────────┐${c.reset}`,
      `${c.red}│  ▶ SlashTube                          🔴 LIVE       │${c.reset}`,
      `${c.white}├─────────────────────────────────────────────────────┤${c.reset}`,
      `${c.white}│                                                     │${c.reset}`,
      `${c.white}│  🎬 Recommended for you:                            │${c.reset}`,
      `${c.white}│                                                     │${c.reset}`,
      `${c.yellow}│  ► "How to study effectively" — 2.3M views         │${c.reset}`,
      `${c.gray}│    Watched: 0% ████░░░░░░░░░░░░░░░░░░ 0:00/45:32   │${c.reset}`,
      `${c.white}│                                                     │${c.reset}`,
      `${c.yellow}│  ► "Top 10 VS Code extensions" — 890K views        │${c.reset}`,
      `${c.gray}│    Watched: 73% ████████████████░░░░░ 33:21/45:10  │${c.reset}`,
      `${c.white}│                                                     │${c.reset}`,
      `${c.yellow}│  ► "I coded for 24 hours straight" — 5.1M views    │${c.reset}`,
      `${c.gray}│    Watched: 100% ████████████████████ completed     │${c.reset}`,
      `${c.white}│                                                     │${c.reset}`,
      `${c.yellow}│  ► "Why you can't focus" — 12M views               │${c.reset}`,
      `${c.gray}│    Watched: 45% ████████░░░░░░░░░░░░ 18:02/40:15   │${c.reset}`,
      `${c.white}│                                                     │${c.reset}`,
      `${c.yellow}│  ► "Minecraft but every block is an exam" — 3M     │${c.reset}`,
      `${c.gray}│    Watched: 12% ██░░░░░░░░░░░░░░░░░░ 4:22/36:00   │${c.reset}`,
      `${c.white}│                                                     │${c.reset}`,
      `${c.white}│  ── Your subscriptions ─────────────────────────   │${c.reset}`,
      `${c.cyan}│  • Lo-fi hip hop radio — beats to study/relax to   │${c.reset}`,
      `${c.cyan}│  • Fireship                                         │${c.reset}`,
      `${c.cyan}│  • 3Blue1Brown                                      │${c.reset}`,
      `${c.cyan}│  • ThePrimeagen                                     │${c.reset}`,
      `${c.white}│                                                     │${c.reset}`,
      `${c.white}└─────────────────────────────────────────────────────┘${c.reset}`,
      '',
      `${c.red}⚠ Warning: ${c.reset}${c.white}You have ${c.yellow}3 assignments${c.reset}${c.white} due tomorrow.${c.reset}`,
      `${c.gray}Type 'clear' to pretend this never happened.${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  // ── APT ─────────────────────────────────────────────────────────────────────
  apt: (args: string[]): CommandResult => {
    const subcommand = args[0]
    const pkg = args[1] || ''
    if (subcommand !== 'install') {
      return {
        output: [
          '',
          `${c.yellow}apt ${subcommand}: unknown subcommand${c.reset}`,
          `${c.gray}Usage: apt install <package>${c.reset}`,
          '',
        ].join('\r\n'),
      }
    }
    const funPackages: Record<string, string[]> = {
      friendship: [
        `${c.green}✓ Successfully installed: friendship (1.0.0-25ms)${c.reset}`,
        `${c.gray}Now initialising warmth subsystem...${c.reset}`,
        `${c.green}✓ Warmth subsystem online.${c.reset}`,
      ],
      love: [
        `${c.green}✓ Successfully installed: love (∞.0-eternal)${c.reset}`,
        `${c.gray}Warning: love has no uninstall script.${c.reset}`,
      ],
      sleep: [
        `${c.red}E: Package 'sleep' has no installation candidate.${c.reset}`,
        `${c.gray}Hint: Have you tried closing your laptop?${c.reset}`,
      ],
      coffee: [
        `${c.green}✓ Successfully installed: coffee (4.2.0-espresso)${c.reset}`,
        `${c.yellow}Warning: May cause jitteriness and late-night commits.${c.reset}`,
      ],
      motivation: [
        `${c.red}E: Package 'motivation' is not available.${c.reset}`,
        `${c.gray}Try: apt install coffee${c.reset}`,
      ],
      vim: [
        `${c.green}✓ vim is already installed (fake-vim 2026.1)${c.reset}`,
        `${c.gray}Try typing: vim about.txt${c.reset}`,
      ],
      grades: [
        `${c.red}E: Package 'grades' has unmet dependencies.${c.reset}`,
        `${c.gray}Depends: study (>= 8h/day) — but study is not installable.${c.reset}`,
      ],
      sanity: [
        `${c.red}E: Unable to locate package 'sanity'${c.reset}`,
        `${c.gray}It was removed in the 3rd year semester update.${c.reset}`,
      ],
      brain: [
        `${c.green}✓ brain is already installed (v25MS-enhanced)${c.reset}`,
        `${c.gray}Current status: overclocked, undercooled.${c.reset}`,
      ],
      python: [
        `${c.green}✓ Successfully installed: python3 (3.12.0)${c.reset}`,
        `${c.gray}Note: This is still fake. Please use your real terminal.${c.reset}`,
      ],
    }
    const progressBar = (pkg: string) => [
      '',
      `${c.cyan}Reading package lists...${c.reset} Done`,
      `${c.cyan}Building dependency tree...${c.reset} Done`,
      `${c.cyan}Reading state information...${c.reset} Done`,
      `${c.white}The following NEW packages will be installed:${c.reset}`,
      `  ${c.green}${pkg}${c.reset}`,
      `${c.white}0 upgraded, 1 newly installed, 0 to remove and 0 not upgraded.${c.reset}`,
      `${c.white}Need to get 42 kB of archives.${c.reset}`,
      `${c.gray}Do you want to continue? [Y/n]${c.reset} Y`,
      '',
      `${c.cyan}Get:1${c.reset} http://slashdot.iiserkol.ac.in ${pkg} 1.0.0 [42 kB]`,
      `${c.cyan}Fetched 42 kB in 0s (∞ kB/s)${c.reset}`,
      `${c.white}Selecting previously unselected package ${pkg}.${c.reset}`,
      `${c.white}Preparing to unpack .../archives/${pkg}_1.0.0_amd64.deb ...${c.reset}`,
      `${c.white}Unpacking ${pkg} (1.0.0) ...${c.reset}`,
      `${c.white}Setting up ${pkg} (1.0.0) ...${c.reset}`,
      `${c.white}Processing triggers for slashdot-os...${c.reset}`,
    ]
    const extras = funPackages[pkg.toLowerCase()]
    return {
      output: [
        ...progressBar(pkg || 'unknown'),
        ...(extras ?? [
          `${c.green}✓ Successfully installed: ${pkg}${c.reset}`,
          `${c.gray}(This is a fake OS — nothing was actually installed)${c.reset}`,
        ]),
        '',
      ].join('\r\n'),
    }
  },

  // ── SSH ─────────────────────────────────────────────────────────────────────
  ssh: (args: string[]): CommandResult => {
    const target = args[0] || ''
    const isIISER = target.includes('iiserkol') || target.includes('iiser') || target.includes('25ms')

    if (!isIISER) {
      return {
        output: [
          '',
          `${c.cyan}ssh: connecting to ${target}...${c.reset}`,
          `${c.red}ssh: connect to host ${target} port 22: Connection refused${c.reset}`,
          `${c.gray}Hint: Try 'ssh batch@iiserkol'${c.reset}`,
          '',
        ].join('\r\n'),
      }
    }

    return {
      output: [
        '',
        `${c.cyan}ssh: connecting to ${target}...${c.reset}`,
        `${c.gray}The authenticity of host 'iiserkol.ac.in (10.0.0.2)' can't be established.${c.reset}`,
        `${c.gray}ECDSA key fingerprint is SHA256:25MS/SlashDotOS/2026/IISERKOL.${c.reset}`,
        `${c.yellow}Are you sure you want to continue connecting? (yes/no) yes${c.reset}`,
        `${c.green}Warning: Permanently added 'iiserkol.ac.in' to the list of known hosts.${c.reset}`,
        '',
        `${c.green}Connected to IISER Kolkata Internal Network${c.reset}`,
        `${c.gray}─────────────────────────────────────────────${c.reset}`,
        '',
        `${c.cyan}  ██╗██╗███████╗███████╗██████╗ ${c.reset}`,
        `${c.cyan}  ██║██║██╔════╝██╔════╝██╔══██╗${c.reset}`,
        `${c.cyan}  ██║██║███████╗█████╗  ██████╔╝${c.reset}`,
        `${c.cyan}  ██║██║╚════██║██╔══╝  ██╔══██╗${c.reset}`,
        `${c.cyan}  ██║██║███████║███████╗██║  ██║${c.reset}`,
        `${c.cyan}  ╚═╝╚═╝╚══════╝╚══════╝╚═╝  ╚═╝${c.reset}`,
        `${c.cyan}  KOLKATA${c.reset}`,
        '',
        `${c.gray}─────────────────────────────────────────────${c.reset}`,
        `${c.white}Last login: Sat Apr 11 23:59:59 2026${c.reset}`,
        '',
        `${c.yellow}  Welcome, 25MS Batch!${c.reset}`,
        `${c.gray}  You have accessed the IISER Kolkata internal server.${c.reset}`,
        '',
        `${c.white}  ── 25MS Batch Stats ──────────────────────${c.reset}`,
        `${c.cyan}  Students enrolled   ${c.reset}${c.white}:  ~150${c.reset}`,
        `${c.cyan}  Courses completed   ${c.reset}${c.white}:  6 semesters${c.reset}`,
        `${c.cyan}  Avg sleep per night ${c.reset}${c.white}:  4.2 hours${c.reset}`,
        `${c.cyan}  Coffee consumed     ${c.reset}${c.white}:  ∞ litres${c.reset}`,
        `${c.cyan}  Assignments pending ${c.reset}${c.white}:  always${c.reset}`,
        `${c.cyan}  Bugs fixed today    ${c.reset}${c.white}:  3 (introduced 7)${c.reset}`,
        `${c.cyan}  SlashDot members    ${c.reset}${c.white}:  the coolest ones${c.reset}`,
        '',
        `${c.white}  ── Upcoming Events ───────────────────────${c.reset}`,
        `${c.green}  ★ Inter-Batch Web Dev Competition 2026${c.reset}`,
        `${c.gray}    Submission deadline: April 11, 2026${c.reset}`,
        `${c.green}  ★ SlashDot Hackathon — coming soon${c.reset}`,
        `${c.green}  ★ End semester exams — pray for us${c.reset}`,
        '',
        `${c.white}  ── Message of the Day ────────────────────${c.reset}`,
        `${c.yellow}  "We didn't sleep, we deployed."${c.reset}`,
        `${c.gray}              — 25MS Batch, 2026${c.reset}`,
        '',
        `${c.gray}─────────────────────────────────────────────${c.reset}`,
        `${c.green}batch@iiserkol:~$${c.reset} ${c.gray}exit${c.reset}`,
        `${c.cyan}Connection to iiserkol.ac.in closed.${c.reset}`,
        '',
      ].join('\r\n'),
    }
  },
}