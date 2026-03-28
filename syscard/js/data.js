// =============================================
// js/data.js — v0.2  Card DB + Type System
// =============================================

// ── Type weakness chart (attacker → x1.5 vs defender) ──
const TYPE_CHART = {
  Virus:    { strong: ["Protocol","Hardware"],  weak: ["Hacker","Command"] },
  Daemon:   { strong: ["Command","Distro"],     weak: ["Hacker","AI/Bot"] },
  Hacker:   { strong: ["Virus","Daemon"],       weak: ["Hardware","AI/Bot"] },
  Protocol: { strong: ["AI/Bot","Daemon"],      weak: ["Virus","Hacker"] },
  Distro:   { strong: ["Virus","Hardware"],     weak: ["Daemon","Command"] },
  Command:  { strong: ["Daemon","Distro"],      weak: ["Virus","Protocol"] },
  "AI/Bot": { strong: ["Hacker","Protocol"],    weak: ["Distro","Command"] },
  Hardware: { strong: ["Hacker","Command"],     weak: ["Virus","Distro"] },
};

const FAMILIES = [
  { name:"Virus",    icon:"🦠", color:"#ff2255", dark:"#3d0010", energyColor:"#ff2255" },
  { name:"Daemon",   icon:"👻", color:"#bf44ff", dark:"#1e0033", energyColor:"#bf44ff" },
  { name:"Hacker",   icon:"🕶️", color:"#00ff88", dark:"#003322", energyColor:"#00ff88" },
  { name:"Protocol", icon:"🌐", color:"#00cfff", dark:"#002233", energyColor:"#00cfff" },
  { name:"Distro",   icon:"🐧", color:"#ff8c00", dark:"#331a00", energyColor:"#ff8c00" },
  { name:"Command",  icon:"⌨️", color:"#ffe100", dark:"#333300", energyColor:"#ffe100" },
  { name:"AI/Bot",   icon:"🤖", color:"#ff6eb0", dark:"#33001a", energyColor:"#ff6eb0" },
  { name:"Hardware", icon:"🔩", color:"#aabbcc", dark:"#1a2233", energyColor:"#aabbcc" },
];

const RARITIES = [
  { name:"Common",    color:"#778899", glow:"rgba(119,136,153,0.3)",  border:"#334455", rate:0.60, mult:1.0, dustVal:10,   energyCost:1 },
  { name:"Uncommon",  color:"#00cc55", glow:"rgba(0,204,85,0.4)",     border:"#007733", rate:0.25, mult:1.5, dustVal:40,   energyCost:2 },
  { name:"Rare",      color:"#0099ff", glow:"rgba(0,153,255,0.5)",    border:"#005fcc", rate:0.10, mult:2.2, dustVal:150,  energyCost:3 },
  { name:"Epic",      color:"#aa33ff", glow:"rgba(170,51,255,0.65)",  border:"#7700cc", rate:0.04, mult:3.5, dustVal:500,  energyCost:4 },
  { name:"Legendary", color:"#ffbb00", glow:"rgba(255,187,0,0.85)",   border:"#cc8800", rate:0.01, mult:6.0, dustVal:2000, energyCost:5 },
];

// ── Special abilities with actual battle effects ──
const SPECIAL_ABILITIES = [
  { id:"poison",      name:"Poison.exe",       icon:"☠️", desc:"10 dmg/turn for 3 turns",     effect:"poison",    energyCost:2 },
  { id:"shield",      name:"Firewall UP",       icon:"🛡️", desc:"Block 15 dmg next hit",        effect:"shield",    energyCost:2 },
  { id:"double",      name:"Dual Strike",       icon:"⚡", desc:"Attack twice this turn",       effect:"double",    energyCost:3 },
  { id:"heal",        name:"Self-Repair",       icon:"💊", desc:"Restore 20 HP",                effect:"heal",      energyCost:2 },
  { id:"drain",       name:"Data Drain",        icon:"🩸", desc:"Steal 15 HP from enemy",       effect:"drain",     energyCost:3 },
  { id:"weaken",      name:"Root Override",     icon:"🔓", desc:"Enemy loses 10 ATK next turn", effect:"weaken",    energyCost:2 },
  { id:"stun",        name:"Kernel Panic",      icon:"💀", desc:"Enemy skips next turn",        effect:"stun",      energyCost:4 },
  { id:"reflect",     name:"Packet Mirror",     icon:"🔄", desc:"Reflect 50% dmg next hit",     effect:"reflect",   energyCost:3 },
  { id:"boost",       name:"Overclock",         icon:"🚀", desc:"+20 ATK this turn",            effect:"boost",     energyCost:2 },
  { id:"resurrect",   name:"Backup Restore",    icon:"♻️", desc:"Survive 1 fatal blow at 1HP",  effect:"resurrect", energyCost:5 },
];

const PASSIVE_ABILITIES = [
  "Zero-Day Aura","Persistent Threat","Stealth Mode","Code Injection","Memory Shield",
  "Packet Storm","Loop Unroll","Cache Poison","Heap Guard","Stack Canary",
  "ASLR Active","DEP Enabled","NX Bit Set","Sandbox Escape","Hypervisor",
  "Kernel Module","Firmware Lock","UEFI Secure","TPM Bound","SGX Enclave",
];

const CARD_NAMES = {
  Virus:    ["Ransomware.exe","Rootkit Ghost","SQL Injector","XSS Phantom","Buffer Overflow","Zero-Day Worm","Trojan.bat","Keylogger Shade","Botnet Swarm","Cryptominer","Spyware Agent","Adware Flood","Polymorphic Virus","Logic Bomb","Fileless Malware","Backdoor.dll","Heap Sprayer","Kernel Exploit","Memory Leak","Race Condition"],
  Daemon:   ["systemd Titan","cron Specter","nginx Guardian","sshd Sentinel","dbus Phantom","udev Watcher","journald Keeper","rsyslog Oracle","dhcpd Drifter","named Resolver","ftpd Shadow","smbd Relay","cupsd Printer","atd Scheduler","inetd Ancestor","xinetd Warden","avahi Beacon","acpid Sleeper","auditd Eye","polkitd Authority"],
  Hacker:   ["Phantom Root","Script Kiddie","Zero-Day Hunter","Elite Cracker","Social Engineer","Packet Sniffer","Port Scanner","Fuzzer Pro","Exploit Dev","Pen Tester","Red Team Ghost","Blue Team Shield","Bug Bounty Hunter","APT Shadow","Insider Threat","Nation State","Hacktivist","White Hat","Black Hat","Grey Hat"],
  Protocol: ["SSH Wraith","HTTP/3 Flash","DNS Manipulator","TCP/IP Core","UDP Blaster","ICMP Phantom","TLS Enforcer","BGP Hijacker","ARP Poisoner","DHCP Starver","SMTP Relay","FTP Bouncer","SNMP Walker","NTP Amplifier","LDAP Injector","Kerberos Ticket","OAuth Token","JWT Cracker","SSL Strip","WebSocket Ghost"],
  Distro:   ["Arch Purist","Kali Striker","Tails Shadow","Debian Stable","Ubuntu Recruit","Fedora Cutter","Gentoo Builder","NixOS Architect","Void Walker","Alpine Micro","Parrot OS","BlackArch","Whonix Anon","QubesOS Fortress","OpenBSD Puffer","FreeBSD Daemon","HardenedBSD","Clear Linux","Slackware Elder","LFS Crafter"],
  Command:  ["sudo God Mode","rm -rf Destroyer","grep Oracle","awk Sculptor","sed Transformer","curl Fetcher","wget Mirror","nc Netcat","nmap Scanner","tcpdump Watcher","strace Tracer","ltrace Linker","gdb Debugger","objdump Analyst","strings Extractor","xxd Hexer","base64 Encoder","openssl Cipher","gpg Signer","chmod Controller"],
  "AI/Bot": ["GPT Phantom","Neural Worm","DeepFake Agent","AutoML Bot","GAN Dreamer","RL Agent","Fuzzy Logic","Bayesian Net","Decision Tree","Random Forest","SVM Kernel","LSTM Memory","Transformer Core","Diffusion Model","VAE Encoder","CLIP Vision","Whisper Voice","Codex Writer","AlphaZero","Deepmind Ghost"],
  Hardware: ["Overclocked CPU","Broken BIOS","EMP Surge","Cold Boot Attack","GPU Miner","USB Rubber Ducky","LAN Turtle","WiFi Pineapple","HackRF SDR","Flipper Zero","Arduino Bot","Raspberry Spy","FPGA Cracker","Hardware Keylogger","Bad USB","PCIe Leech","DMA Attack","Rowhammer RAM","Spectre Chip","Meltdown Core"],
};

function generateAllCards() {
  const cards = []; let id = 1;
  FAMILIES.forEach(fam => {
    const names = CARD_NAMES[fam.name];
    names.forEach((name, ni) => {
      RARITIES.forEach((rar, ri) => {
        const baseHP  = 50 + ((ni * 7 + ri * 13) % 40);
        const baseATK = 12 + ((ni * 3 + ri * 9)  % 22);
        const baseDEF =  5 + ((ni * 5 + ri * 7)  % 14);
        // Assign 1 special ability based on rarity
        const specIdx = (ni + ri * 3 + id) % SPECIAL_ABILITIES.length;
        const special = ri >= 2 ? SPECIAL_ABILITIES[specIdx] : null;
        // Passive abilities
        const nbPassive = ri < 2 ? 1 : ri < 4 ? 2 : 3;
        const passives = [];
        for (let i = 0; i < nbPassive; i++) {
          const p = PASSIVE_ABILITIES[(ni * 2 + i * 7 + id) % PASSIVE_ABILITIES.length];
          if (!passives.includes(p)) passives.push(p);
        }
        cards.push({
          id, name,
          family: fam.name, familyIcon: fam.icon, familyColor: fam.color,
          familyDark: fam.dark, energyColor: fam.energyColor,
          rarity: rar.name, rarityColor: rar.color, rarityGlow: rar.glow,
          rarityBorder: rar.border, energyCost: rar.energyCost, dustVal: rar.dustVal,
          hp:  Math.round(baseHP  * rar.mult),
          atk: Math.round(baseATK * rar.mult),
          def: Math.round(baseDEF * rar.mult),
          maxHp: Math.round(baseHP * rar.mult),
          special, passives,
          typeChart: TYPE_CHART[fam.name],
        });
        id++;
      });
    });
  });
  return cards;
}

const ALL_CARDS = generateAllCards();

// ── Type multiplier lookup ──
function getTypeMultiplier(attackerFamily, defenderFamily) {
  const chart = TYPE_CHART[attackerFamily];
  if (!chart) return 1;
  if (chart.strong.includes(defenderFamily)) return 1.5;
  if (chart.weak.includes(defenderFamily))   return 0.7;
  return 1;
}

// ── Weighted pack draw ──
function drawPack(pityCounter = 0) {
  const drawn = []; const guaranteed = Math.random() < 0.20;
  for (let i = 0; i < 5; i++) {
    let pool;
    if (i === 4 && guaranteed) pool = ALL_CARDS.filter(c => ["Rare","Epic","Legendary"].includes(c.rarity));
    else if (pityCounter >= 50) pool = ALL_CARDS.filter(c => c.rarity === "Legendary");
    else {
      const r = Math.random();
      let rar = r < 0.01 ? "Legendary" : r < 0.05 ? "Epic" : r < 0.15 ? "Rare" : r < 0.40 ? "Uncommon" : "Common";
      pool = ALL_CARDS.filter(c => c.rarity === rar);
    }
    drawn.push(pool[Math.floor(Math.random() * pool.length)]);
  }
  return drawn;
}

// ── AI deck builder ──
function buildAiDeck(difficulty = "normal") {
  const rarities = difficulty === "easy"   ? ["Common","Uncommon"] :
                   difficulty === "hard"   ? ["Rare","Epic","Legendary"] :
                   ["Common","Uncommon","Rare"];
  const pool = ALL_CARDS.filter(c => rarities.includes(c.rarity));
  const deck = [];
  while (deck.length < 10) {
    const c = pool[Math.floor(Math.random() * pool.length)];
    if (!deck.some(d => d.id === c.id)) deck.push(c);
  }
  return deck;
}
