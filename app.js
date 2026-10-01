/**
 * DOTA 2 MMR CALCULATOR & MEDAL PROGRESSION
 * Baseado nos dados oficiais da Dota 2 Wiki Fandom:
 * https://dota2.fandom.com/pt/wiki/Cria%C3%A7%C3%A3o_de_partidas/Classifica%C3%A7%C3%B5es_sazonais
 */

// Rank Tiers definitions
const TIERS = [
  {
    id: 1,
    name: "Arauto",
    nameEn: "Herald",
    icon: "assets/images/rank_icon_1.png",
    color: "#a87954",
    glow: "rgba(168, 121, 84, 0.45)",
    themeClass: "tier-herald",
    itemLore: "Tango",
    stars: [
      { star: 1, mmr: 10 },
      { star: 2, mmr: 154 },
      { star: 3, mmr: 308 },
      { star: 4, mmr: 462 },
      { star: 5, mmr: 616 }
    ]
  },
  {
    id: 2,
    name: "Guardião",
    nameEn: "Guardian",
    icon: "assets/images/rank_icon_2.png",
    color: "#5bb39e",
    glow: "rgba(91, 179, 158, 0.45)",
    themeClass: "tier-guardian",
    itemLore: "Broquel (Buckler)",
    stars: [
      { star: 1, mmr: 770 },
      { star: 2, mmr: 924 },
      { star: 3, mmr: 1078 },
      { star: 4, mmr: 1232 },
      { star: 5, mmr: 1386 }
    ]
  },
  {
    id: 3,
    name: "Cruzado",
    nameEn: "Crusader",
    icon: "assets/images/rank_icon_3.png",
    color: "#4da3db",
    glow: "rgba(77, 163, 219, 0.45)",
    themeClass: "tier-crusader",
    itemLore: "Anel de Áquila",
    stars: [
      { star: 1, mmr: 1540 },
      { star: 2, mmr: 1694 },
      { star: 3, mmr: 1850 },
      { star: 4, mmr: 2010 },
      { star: 5, mmr: 2170 }
    ]
  },
  {
    id: 4,
    name: "Arconte",
    nameEn: "Archon",
    icon: "assets/images/rank_icon_4.png",
    color: "#e5a93b",
    glow: "rgba(229, 169, 59, 0.45)",
    themeClass: "tier-archon",
    itemLore: "Cetro Divino de Eul",
    stars: [
      { star: 1, mmr: 2320 },
      { star: 2, mmr: 2470 },
      { star: 3, mmr: 2620 },
      { star: 4, mmr: 2785 },
      { star: 5, mmr: 2930 }
    ]
  },
  {
    id: 5,
    name: "Lenda",
    nameEn: "Legend",
    icon: "assets/images/rank_icon_5.png",
    color: "#f15045",
    glow: "rgba(241, 80, 69, 0.45)",
    themeClass: "tier-legend",
    itemLore: "Bastão Preto da Realeza (BKB)",
    stars: [
      { star: 1, mmr: 3080 },
      { star: 2, mmr: 3234 },
      { star: 3, mmr: 3388 },
      { star: 4, mmr: 3542 },
      { star: 5, mmr: 3696 }
    ]
  },
  {
    id: 6,
    name: "Ancestral",
    nameEn: "Ancient",
    icon: "assets/images/rank_icon_6.png",
    color: "#7952e4",
    glow: "rgba(121, 82, 228, 0.5)",
    themeClass: "tier-ancient",
    itemLore: "Machado Ilusório (Manta)",
    stars: [
      { star: 1, mmr: 3850 },
      { star: 2, mmr: 4004 },
      { star: 3, mmr: 4158 },
      { star: 4, mmr: 4312 },
      { star: 5, mmr: 4466 }
    ]
  },
  {
    id: 7,
    name: "Divino",
    nameEn: "Divine",
    icon: "assets/images/rank_icon_7.png",
    color: "#ffd043",
    glow: "rgba(255, 208, 67, 0.6)",
    themeClass: "tier-divine",
    itemLore: "Rapieira Divina",
    stars: [
      { star: 1, mmr: 4620 },
      { star: 2, mmr: 4820 },
      { star: 3, mmr: 5020 },
      { star: 4, mmr: 5220 },
      { star: 5, mmr: 5420 }
    ]
  },
  {
    id: 8,
    name: "Imortal",
    nameEn: "Immortal",
    icon: "assets/images/rank_icon_8.png",
    color: "#ff3344",
    glow: "rgba(255, 51, 68, 0.65)",
    themeClass: "tier-immortal",
    itemLore: "Égide do Imortal",
    stars: [
      { star: 0, mmr: 5620 }
    ]
  }
];

// Flat chronological ladder of all milestones
const LADDER = [];
TIERS.forEach(t => {
  t.stars.forEach(s => {
    LADDER.push({
      tierId: t.id,
      tierName: t.name,
      tierNameEn: t.nameEn,
      itemLore: t.itemLore,
      color: t.color,
      glow: t.glow,
      themeClass: t.themeClass,
      star: s.star,
      mmr: s.mmr
    });
  });
});

// DOM Elements
const mmrInput = document.getElementById('mmrInput');
const mmrSlider = document.getElementById('mmrSlider');
const resetBtn = document.getElementById('resetBtn');
const deltaButtons = document.querySelectorAll('.delta-btn[data-delta]');
const presetChipsContainer = document.getElementById('presetChips');
const copyShareBtn = document.getElementById('copyShareBtn');
const shareLinkBtn = document.getElementById('shareLinkBtn');
const copyNotification = document.getElementById('copyNotification');
const soundToggleBtn = document.getElementById('soundToggleBtn');
const soundIcon = document.getElementById('soundIcon');

// Result Showcase Elements
const rankBaseImg = document.getElementById('rankBaseImg');
const rankStarImg = document.getElementById('rankStarImg');
const rankTitle = document.getElementById('rankTitle');
const rankSubtitle = document.getElementById('rankSubtitle');
const itemLoreName = document.getElementById('itemLoreName');
const percentNumber = document.getElementById('percentNumber');
const nextRankName = document.getElementById('nextRankName');
const progressFill = document.getElementById('progressFill');
const progressTrack = document.getElementById('progressTrack');
const statCurrentBracket = document.getElementById('statCurrentBracket');
const statTargetBracket = document.getElementById('statTargetBracket');
const statRemainingMmr = document.getElementById('statRemainingMmr');
const forecastBanner = document.getElementById('forecastBanner');
const forecastText = document.getElementById('forecastText');
const progressSection = document.getElementById('progressSection');
const immortalBanner = document.getElementById('immortalBanner');
const journeySteps = document.getElementById('journeySteps');
const ranksTableBody = document.getElementById('ranksTableBody');
const searchTableInput = document.getElementById('searchTableInput');

// Audio Engine (Web Audio API Synthesizer)
let soundEnabled = localStorage.getItem('dota_mmr_sound') !== 'false';
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
}

function playRankChime(frequency = 587.33) {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, audioCtx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.35);
  } catch (e) {
    // Audio context maybe blocked before user interaction
  }
}

function updateSoundButton() {
  soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
  soundToggleBtn.title = soundEnabled ? 'Desativar sons' : 'Ativar sons';
}

soundToggleBtn.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  localStorage.setItem('dota_mmr_sound', soundEnabled);
  updateSoundButton();
  if (soundEnabled) {
    playRankChime(523.25);
  }
});
updateSoundButton();

/**
 * Calculation Core: Given MMR, calculate Medal, Star, and Percentage to Next Star
 */
function calculateRank(mmr) {
  const safeMmr = Math.max(0, Math.round(Number(mmr) || 0));

  // Case 0: Below 10 MMR (Sub-Herald / Non-calibrated)
  if (safeMmr < 10) {
    const pct = Math.floor((safeMmr / 10) * 100);
    return {
      tierId: 1,
      tierName: "Arauto",
      tierNameEn: "Herald",
      itemLore: "Tango",
      color: "#a87954",
      glow: "rgba(168, 121, 84, 0.45)",
      themeClass: "tier-herald",
      star: 1,
      isSubRank: true,
      currentMmr: safeMmr,
      bracketMmr: 0,
      nextMmr: 10,
      nextRankTitle: "Arauto 1",
      percent: pct,
      remaining: 10 - safeMmr,
      isImmortal: false
    };
  }

  // Case Immortal: 5620+ MMR
  const immortalThreshold = 5620;
  if (safeMmr >= immortalThreshold) {
    return {
      tierId: 8,
      tierName: "Imortal",
      tierNameEn: "Immortal",
      itemLore: "Égide do Imortal",
      color: "#ff3344",
      glow: "rgba(255, 51, 68, 0.65)",
      themeClass: "tier-immortal",
      star: 0,
      isSubRank: false,
      currentMmr: safeMmr,
      bracketMmr: immortalThreshold,
      nextMmr: null,
      nextRankTitle: "Tabela de Liderança",
      percent: 100,
      remaining: 0,
      isImmortal: true
    };
  }

  // Find index in LADDER
  let currentIndex = 0;
  for (let i = 0; i < LADDER.length; i++) {
    if (safeMmr >= LADDER[i].mmr) {
      currentIndex = i;
    } else {
      break;
    }
  }

  const current = LADDER[currentIndex];
  const next = LADDER[currentIndex + 1];

  const bracketMmr = current.mmr;
  const nextMmr = next.mmr;
  const span = nextMmr - bracketMmr;
  const gained = safeMmr - bracketMmr;
  const percent = Math.min(99, Math.max(0, Math.floor((gained / span) * 100)));
  const remaining = Math.max(0, nextMmr - safeMmr);

  const nextRankTitle = next.star === 0 
    ? next.tierName 
    : `${next.tierName} ${next.star}`;

  return {
    tierId: current.tierId,
    tierName: current.tierName,
    tierNameEn: current.tierNameEn,
    itemLore: current.itemLore,
    color: current.color,
    glow: current.glow,
    themeClass: current.themeClass,
    star: current.star,
    isSubRank: false,
    currentMmr: safeMmr,
    bracketMmr: bracketMmr,
    nextMmr: nextMmr,
    nextRankTitle: nextRankTitle,
    percent: percent,
    remaining: remaining,
    isImmortal: false
  };
}

/**
 * Update UI with calculated data
 */
let lastRenderedTier = null;
let lastRenderedStar = null;

function renderRank(info) {
  // Update Theme Colors & Glow
  document.documentElement.style.setProperty('--theme-color', info.color);
  document.documentElement.style.setProperty('--theme-glow', info.glow);

  // Set badge composite images
  rankBaseImg.src = `assets/images/rank_icon_${info.tierId}.png`;
  rankBaseImg.alt = `Medalha ${info.tierName}`;

  if (info.star > 0) {
    rankStarImg.style.display = 'block';
    rankStarImg.src = `assets/images/rank_star_${info.star}.png`;
    rankStarImg.alt = `${info.star} estrelas`;
  } else {
    rankStarImg.style.display = 'none';
  }

  // Check if rank or star leveled up for audio feedback
  if (lastRenderedTier !== null && (lastRenderedTier !== info.tierId || lastRenderedStar !== info.star)) {
    playRankChime(lastRenderedTier !== info.tierId ? 659.25 : 523.25);
  }
  lastRenderedTier = info.tierId;
  lastRenderedStar = info.star;

  // Texts
  if (info.isImmortal) {
    rankTitle.textContent = "IMORTAL";
    rankSubtitle.textContent = `Immortal • Nível Superior • Tabela de Liderança`;
  } else if (info.isSubRank) {
    rankTitle.textContent = "ARAUTO 1 (INICIAL)";
    rankSubtitle.textContent = `Abaixo do limiar de Arauto 1 (10 MMR)`;
  } else {
    rankTitle.textContent = `${info.tierName.toUpperCase()} ${info.star}`;
    rankSubtitle.textContent = `${info.tierNameEn} • Nível ${info.tierId} • ${info.star} ${info.star === 1 ? 'Estrela' : 'Estrelas'}`;
  }

  itemLoreName.textContent = info.itemLore;

  // Percentage & Bars
  if (info.isImmortal) {
    progressSection.style.display = 'none';
    immortalBanner.style.display = 'flex';
  } else {
    progressSection.style.display = 'block';
    immortalBanner.style.display = 'none';

    percentNumber.textContent = info.percent;
    nextRankName.textContent = info.nextRankTitle;
    progressFill.style.width = `${info.percent}%`;
    progressTrack.setAttribute('aria-valuenow', info.percent);

    statCurrentBracket.textContent = `${info.bracketMmr} MMR`;
    statTargetBracket.textContent = `${info.nextMmr} MMR`;
    statRemainingMmr.textContent = `${info.remaining} MMR`;

    const wins30 = Math.ceil(info.remaining / 30);
    const wins25 = Math.ceil(info.remaining / 25);
    forecastText.innerHTML = `Faltam <strong>${info.remaining} MMR</strong> para a próxima estrela (~<strong>${wins30}</strong> vitórias com +30 MMR ou <strong>${wins25}</strong> com +25 MMR).`;
  }

  // Update Journey Mini-Track (stars for current tier)
  renderJourneySteps(info);

  // Highlight active row in full table
  highlightTableRow(info);

  // Highlight active preset chip
  updatePresetChips(info.tierId);
}

/**
 * Render the 5 journey steps of current tier
 */
function renderJourneySteps(info) {
  const tierObj = TIERS.find(t => t.id === info.tierId);
  if (!tierObj) return;

  journeySteps.innerHTML = '';

  if (tierObj.id === 8) {
    // Immortal has no 5 stars
    const step = document.createElement('div');
    step.className = 'journey-step active';
    step.innerHTML = `
      <div class="journey-badge">
        <img class="journey-base-img" src="assets/images/rank_icon_8.png" alt="Imortal">
      </div>
      <div class="journey-star-label">Imortal</div>
      <div class="journey-mmr-label">5620+ MMR</div>
    `;
    journeySteps.appendChild(step);
    return;
  }

  tierObj.stars.forEach(s => {
    const isCurrentStar = (s.star === info.star && !info.isSubRank) || (info.isSubRank && s.star === 1);
    const step = document.createElement('div');
    step.className = `journey-step ${isCurrentStar ? 'active' : ''}`;
    step.title = `Clique para definir MMR para ${s.mmr} (${tierObj.name} ${s.star})`;
    step.innerHTML = `
      <div class="journey-badge">
        <img class="journey-base-img" src="assets/images/rank_icon_${tierObj.id}.png" alt="${tierObj.name}">
        <img class="journey-star-img" src="assets/images/rank_star_${s.star}.png" alt="${s.star} estrelas">
      </div>
      <div class="journey-star-label">${tierObj.name} ${s.star}</div>
      <div class="journey-mmr-label">${s.mmr} MMR</div>
    `;

    step.addEventListener('click', () => {
      setMmr(s.mmr);
    });

    journeySteps.appendChild(step);
  });
}

/**
 * Render the complete rank list table
 */
function buildFullTable() {
  ranksTableBody.innerHTML = '';

  LADDER.forEach((item, idx) => {
    const nextItem = LADDER[idx + 1];
    const isImmortal = item.tierId === 8;

    let rangeStr = '';
    if (isImmortal) {
      rangeStr = '5620+ (Infinito)';
    } else if (nextItem) {
      rangeStr = `${item.mmr} - ${nextItem.mmr - 1} MMR (+${nextItem.mmr - item.mmr})`;
    }

    const row = document.createElement('tr');
    row.id = `row-ladder-${idx}`;
    row.dataset.idx = idx;
    row.dataset.search = `${item.tierName} ${item.tierNameEn} ${item.star} ${item.mmr} ${item.itemLore}`.toLowerCase();

    row.innerHTML = `
      <td>
        <div class="table-medal-cell">
          <div class="table-mini-badge">
            <img src="assets/images/rank_icon_${item.tierId}.png" alt="${item.tierName}">
            ${item.star > 0 ? `<img class="table-star-overlay" src="assets/images/rank_star_${item.star}.png" alt="${item.star} estrelas">` : ''}
          </div>
          <strong>${item.tierName}</strong>
        </div>
      </td>
      <td>
        ${isImmortal ? 'Imortal (Sem estrelas)' : `Estrela ${item.star}`}
      </td>
      <td>
        <span class="table-mmr-badge">${item.mmr} MMR</span>
      </td>
      <td>
        <span class="table-range-text">${rangeStr}</span>
      </td>
      <td>
        ${item.itemLore}
      </td>
      <td>
        <button class="table-apply-btn" onclick="setMmr(${item.mmr})">Testar MMR</button>
      </td>
    `;

    ranksTableBody.appendChild(row);
  });
}

/**
 * Filter Table rows by search input
 */
searchTableInput.addEventListener('input', (e) => {
  const query = e.target.value.trim().toLowerCase();
  const rows = ranksTableBody.querySelectorAll('tr');

  rows.forEach(row => {
    const text = row.dataset.search || '';
    if (!query || text.includes(query)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
});

/**
 * Highlight Active Row in Table
 */
function highlightTableRow(info) {
  const rows = ranksTableBody.querySelectorAll('tr');
  rows.forEach(r => r.classList.remove('row-active'));

  if (info.isImmortal) {
    const immortalRow = document.getElementById(`row-ladder-${LADDER.length - 1}`);
    if (immortalRow) immortalRow.classList.add('row-active');
    return;
  }

  const activeIdx = LADDER.findIndex((item, i) => {
    const next = LADDER[i + 1];
    if (!next) return true;
    return info.currentMmr >= item.mmr && info.currentMmr < next.mmr;
  });

  if (activeIdx !== -1) {
    const row = document.getElementById(`row-ladder-${activeIdx}`);
    if (row) {
      row.classList.add('row-active');
    }
  }
}

/**
 * Render Preset Category Chips (Arauto, Guardião, Cruzado, etc.)
 */
function buildPresetChips() {
  presetChipsContainer.innerHTML = '';

  TIERS.forEach(tier => {
    const chip = document.createElement('button');
    chip.className = 'preset-chip';
    chip.dataset.tierId = tier.id;
    chip.innerHTML = `<span>${tier.name}</span> <small>(${tier.stars[0].mmr})</small>`;

    chip.addEventListener('click', () => {
      setMmr(tier.stars[0].mmr);
    });

    presetChipsContainer.appendChild(chip);
  });
}

function updatePresetChips(activeTierId) {
  const chips = presetChipsContainer.querySelectorAll('.preset-chip');
  chips.forEach(c => {
    if (Number(c.dataset.tierId) === activeTierId) {
      c.classList.add('active');
    } else {
      c.classList.remove('active');
    }
  });
}

/**
 * Synchronize input, slider, URL parameter and render
 */
function setMmr(value, updateInput = true, updateSlider = true) {
  let num = parseInt(value, 10);
  if (isNaN(num) || num < 0) num = 0;
  if (num > 15000) num = 15000;

  if (updateInput) {
    mmrInput.value = num;
  }
  if (updateSlider) {
    mmrSlider.value = Math.min(6500, num);
  }

  const info = calculateRank(num);
  renderRank(info);

  // Sync URL query without reloading
  const url = new URL(window.location);
  url.searchParams.set('mmr', num);
  window.history.replaceState({ mmr: num }, '', url);
}

// Input Handlers
mmrInput.addEventListener('input', (e) => {
  setMmr(e.target.value, false, true);
});

mmrInput.addEventListener('blur', (e) => {
  if (e.target.value === '' || isNaN(Number(e.target.value))) {
    setMmr(0, true, true);
  }
});

mmrSlider.addEventListener('input', (e) => {
  setMmr(e.target.value, true, false);
});

// Quick Match Simulation Deltas (+25, +30, -25, -30)
deltaButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const delta = parseInt(btn.dataset.delta, 10) || 0;
    const current = parseInt(mmrInput.value, 10) || 0;
    setMmr(Math.max(0, current + delta));
  });
});

resetBtn.addEventListener('click', () => {
  setMmr(2620); // Default to Archon 3
});

// Share / Copy Actions
function showToast(msg) {
  copyNotification.textContent = msg;
  copyNotification.style.display = 'block';
  setTimeout(() => {
    copyNotification.style.display = 'none';
  }, 2500);
}

copyShareBtn.addEventListener('click', () => {
  const mmr = mmrInput.value;
  const info = calculateRank(mmr);
  const text = info.isImmortal 
    ? `Dota 2: Meu MMR é ${mmr} (Classificação IMORTAL)! 👑`
    : `Dota 2: Meu MMR é ${mmr} (${info.tierName} ${info.star}) - ${info.percent}% para ${info.nextRankTitle}! ⚔️`;

  navigator.clipboard.writeText(text).then(() => {
    showToast("Resultado copiado para a área de transferência!");
  }).catch(() => {
    showToast("Erro ao copiar resultado.");
  });
});

shareLinkBtn.addEventListener('click', () => {
  const currentUrl = window.location.href;
  navigator.clipboard.writeText(currentUrl).then(() => {
    showToast("Link com este MMR copiado!");
  }).catch(() => {
    showToast("Erro ao copiar link.");
  });
});

/**
 * Initialize on Page Load
 */
window.addEventListener('DOMContentLoaded', () => {
  buildPresetChips();
  buildFullTable();

  // Read MMR from URL param (?mmr=3450) or default
  const params = new URLSearchParams(window.location.search);
  const initialMmr = params.get('mmr') !== null ? parseInt(params.get('mmr'), 10) : 2620;

  setMmr(isNaN(initialMmr) ? 2620 : initialMmr);
});

// Expose setMmr globally for inline table click handlers
window.setMmr = setMmr;
