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
 * ==========================================================================
 * OPENDOTA INTEGRATION: PLAYER SEARCH, SYNC & RECENT MATCHES
 * ==========================================================================
 */

// Player Search & Profile DOM Elements
const playerSearchForm = document.getElementById('playerSearchForm');
const playerQueryInput = document.getElementById('playerQueryInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const searchSubmitBtn = document.getElementById('searchSubmitBtn');
const searchBarContainer = document.getElementById('searchBarContainer');

const playerProfileBanner = document.getElementById('playerProfileBanner');
const playerAvatarImg = document.getElementById('playerAvatarImg');
const playerName = document.getElementById('playerName');
const playerSteamLink = document.getElementById('playerSteamLink');
const playerDotabuffLink = document.getElementById('playerDotabuffLink');
const playerOpendotaLink = document.getElementById('playerOpendotaLink');
const playerRankTag = document.getElementById('playerRankTag');
const playerMmrTag = document.getElementById('playerMmrTag');
const playerRangeTag = document.getElementById('playerRangeTag');
const playerIdTag = document.getElementById('playerIdTag');
const refreshPlayerBtn = document.getElementById('refreshPlayerBtn');
const switchPlayerBtn = document.getElementById('switchPlayerBtn');

// Ranked Stats Capsules
const playerRankedStats = document.getElementById('playerRankedStats');
const statRankedTotal = document.getElementById('statRankedTotal');
const statRankedWins = document.getElementById('statRankedWins');
const statRankedLosses = document.getElementById('statRankedLosses');
const statRankedWinrate = document.getElementById('statRankedWinrate');

// Top 10 Heroes DOM Elements
const topHeroesSection = document.getElementById('topHeroesSection');
const topHeroesGrid = document.getElementById('topHeroesGrid');
const heroesLoading = document.getElementById('heroesLoading');

// Modal Elements
const searchModalBackdrop = document.getElementById('searchModalBackdrop');
const modalResultsTitle = document.getElementById('modalResultsTitle');
const modalResultsSubtitle = document.getElementById('modalResultsSubtitle');
const modalCountBadge = document.getElementById('modalCountBadge');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const searchLoading = document.getElementById('searchLoading');
const searchEmpty = document.getElementById('searchEmpty');
const searchError = document.getElementById('searchError');
const searchErrorMessage = document.getElementById('searchErrorMessage');
const playersResultsGrid = document.getElementById('playersResultsGrid');

// Matches DOM Elements
const recentMatchesSection = document.getElementById('recentMatchesSection');
const matchesSummaryPill = document.getElementById('matchesSummaryPill');
const matchesWinLoss = document.getElementById('matchesWinLoss');
const matchesWinrate = document.getElementById('matchesWinrate');
const privateProfileNotice = document.getElementById('privateProfileNotice');
const matchesLoading = document.getElementById('matchesLoading');
const matchesList = document.getElementById('matchesList');
const limitBtn20 = document.getElementById('limitBtn20');
const limitBtn50 = document.getElementById('limitBtn50');

// Cache of Dota 2 Heroes
let dotaHeroesMap = {};

async function loadHeroesData() {
  try {
    const cached = localStorage.getItem('dota_heroes_cache');
    if (cached) {
      dotaHeroesMap = JSON.parse(cached);
      return;
    }
    const response = await fetch('https://api.opendota.com/api/heroes');
    if (response.ok) {
      const heroes = await response.json();
      heroes.forEach(h => {
        dotaHeroesMap[h.id] = {
          name: h.name.replace('npc_dota_hero_', ''),
          localized_name: h.localized_name
        };
      });
      localStorage.setItem('dota_heroes_cache', JSON.stringify(dotaHeroesMap));
    }
  } catch (e) {
    console.warn('Não foi possível carregar lista de heróis do OpenDota:', e);
  }
}

function getHeroDetails(heroId) {
  if (dotaHeroesMap[heroId]) {
    const h = dotaHeroesMap[heroId];
    return {
      name: h.localized_name,
      imgUrl: `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${h.name}.png`
    };
  }
  return {
    name: `Herói #${heroId}`,
    imgUrl: 'assets/images/rank_icon_0.png'
  };
}

// Relative Time Formatter (Portuguese / Dotabuff-style)
function formatRelativeTime(dateString) {
  if (!dateString) return 'Última partida: nunca jogou';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Última partida: desconhecida';
  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);

  if (diffSec < 60) return 'Última partida: agora mesmo';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `Última partida: há ${diffMin} ${diffMin === 1 ? 'minuto' : 'minutos'}`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `Última partida: há ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
  const diffDays = Math.floor(diffMin / 24);
  if (diffDays < 30) return `Última partida: há ${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `Última partida: há ${diffMonths} ${diffMonths === 1 ? 'mês' : 'meses'}`;
  const diffYears = Math.floor(diffMonths / 12);
  return `Última partida: há ${diffYears} ${diffYears === 1 ? 'ano' : 'anos'}`;
}

// Search Input Controls
if (playerQueryInput) {
  playerQueryInput.addEventListener('input', (e) => {
    if (clearSearchBtn) {
      clearSearchBtn.style.display = e.target.value.trim() ? 'block' : 'none';
    }
  });
}

if (clearSearchBtn) {
  clearSearchBtn.addEventListener('click', () => {
    playerQueryInput.value = '';
    clearSearchBtn.style.display = 'none';
    playerQueryInput.focus();
  });
}

// Modal Visibility Helpers
function openSearchModal(query) {
  searchModalBackdrop.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  modalResultsSubtitle.textContent = `Resultados para "${query}"`;
  modalCountBadge.textContent = 'BUSCANDO...';
  searchLoading.style.display = 'flex';
  searchEmpty.style.display = 'none';
  searchError.style.display = 'none';
  playersResultsGrid.innerHTML = '';
}

function closeSearchModal() {
  searchModalBackdrop.style.display = 'none';
  document.body.style.overflow = '';
}

if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeSearchModal);

if (searchModalBackdrop) {
  searchModalBackdrop.addEventListener('click', (e) => {
    if (e.target === searchModalBackdrop) closeSearchModal();
  });
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && searchModalBackdrop.style.display === 'flex') {
    closeSearchModal();
  }
});

// Perform Search Flow
if (playerSearchForm) {
  playerSearchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = playerQueryInput.value.trim();
    if (!query) return;

    // Check if query is directly a numeric ID (Account ID / Friend ID)
    if (/^\d{4,12}$/.test(query)) {
      loadPlayerData(query);
      return;
    }

    // Name search: Open Dotabuff-style modal and query OpenDota API
    openSearchModal(query);

    try {
      const response = await fetch(`https://api.opendota.com/api/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Falha na resposta da API');
      const results = await response.json();

      searchLoading.style.display = 'none';

      if (!Array.isArray(results) || results.length === 0) {
        searchEmpty.style.display = 'flex';
        modalCountBadge.textContent = '0 JOGADORES';
        return;
      }

      modalCountBadge.textContent = `${results.length} JOGADORES`;
      renderPlayersGrid(results);
    } catch (err) {
      console.error(err);
      searchLoading.style.display = 'none';
      searchError.style.display = 'flex';
      modalCountBadge.textContent = 'ERRO';
      searchErrorMessage.textContent = 'Não foi possível consultar os servidores do Dota 2. Tente novamente mais tarde.';
    }
  });
}

// Render Dotabuff-style Player Grid
function renderPlayersGrid(players) {
  playersResultsGrid.innerHTML = '';

  players.forEach(player => {
    const card = document.createElement('div');
    card.className = 'player-result-card';
    card.title = `Clique para carregar o perfil de ${player.personaname}`;

    const defaultAvatar = 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg';
    const avatarSrc = player.avatarfull || defaultAvatar;

    card.innerHTML = `
      <img class="player-card-avatar" src="${avatarSrc}" alt="${player.personaname}" onerror="this.src='${defaultAvatar}'">
      <div class="player-card-info">
        <span class="player-card-name">${escapeHtml(player.personaname)}</span>
        <span class="player-card-time">${formatRelativeTime(player.last_match_time)}</span>
      </div>
    `;

    card.addEventListener('click', () => {
      closeSearchModal();
      loadPlayerData(player.account_id);
    });

    playersResultsGrid.appendChild(card);
  });
}

// Utility: Escape HTML
function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Load Player Profile and Matches
let currentActiveAccountId = null;
let currentActivePlayerTierId = 0;

async function loadPlayerData(accountId) {
  if (!accountId) return;
  currentActiveAccountId = accountId;

  // Visual feedback on search button
  if (searchSubmitBtn) {
    searchSubmitBtn.disabled = true;
    searchSubmitBtn.innerHTML = '<span>Carregando...</span>';
  }

  try {
    // 1. Fetch Profile Info
    const playerRes = await fetch(`https://api.opendota.com/api/players/${accountId}`);
    if (!playerRes.ok) throw new Error('Não foi possível obter dados do jogador');
    const playerData = await playerRes.json();

    if (!playerData || !playerData.profile) {
      alert('Perfil não encontrado ou inválido. Verifique o ID do jogador.');
      return;
    }

    const profile = playerData.profile;

    // Populate Player Profile Banner
    playerAvatarImg.src = profile.avatarfull || 'assets/images/rank_icon_0.png';
    playerAvatarImg.alt = profile.personaname;
    playerName.textContent = profile.personaname;

    playerSteamLink.href = profile.profileurl || `https://steamcommunity.com/profiles/${profile.steamid}`;
    playerDotabuffLink.href = `https://www.dotabuff.com/players/${accountId}`;
    playerOpendotaLink.href = `https://www.opendota.com/players/${accountId}`;
    playerIdTag.textContent = `ID: ${accountId}`;

    // Precise Rank Tier & Bracket Resolution
    let detectedMmr = 2620; // Default fallback
    let medalNameText = 'Não calibrado';
    let minBracketMmr = 0;
    let maxBracketMmr = 0;
    currentActivePlayerTierId = 0;

    if (playerData.rank_tier) {
      const tierId = Math.floor(playerData.rank_tier / 10);
      const star = playerData.rank_tier % 10;
      currentActivePlayerTierId = tierId;
      const tierObj = TIERS.find(t => t.id === tierId);

      if (tierObj) {
        if (tierId === 8) {
          medalNameText = 'Imortal';
          detectedMmr = 5620;
          minBracketMmr = 5620;
          maxBracketMmr = 12000;
          if (playerData.leaderboard_rank) {
            medalNameText += ` #${playerData.leaderboard_rank}`;
          }
        } else {
          medalNameText = `${tierObj.name} ${star}`;
          const ladderIndex = LADDER.findIndex(item => item.tierId === tierId && item.star === star);
          if (ladderIndex !== -1) {
            const currentItem = LADDER[ladderIndex];
            const nextItem = LADDER[ladderIndex + 1];
            minBracketMmr = currentItem.mmr;
            maxBracketMmr = nextItem ? nextItem.mmr - 1 : currentItem.mmr + 153;
            detectedMmr = minBracketMmr;
          }
        }
      }
    }

    // MMR Selection: Strictly enforce the official medal's bracket
    if (minBracketMmr > 0) {
      // The player has an official calibrated medal in Dota 2
      if (playerData.computed_mmr && !isNaN(playerData.computed_mmr)) {
        const cMmr = Math.round(playerData.computed_mmr);
        // Only adopt computed_mmr if it legitimately falls inside this exact star bracket
        if (cMmr >= minBracketMmr && cMmr <= maxBracketMmr) {
          detectedMmr = cMmr;
          playerMmrTag.textContent = `MMR Estimado: ${detectedMmr}`;
        } else {
          // If OpenDota's computed_mmr is completely outside the official bracket (e.g. 3655 for Crusader 1 1540),
          // we use the official medal MMR so the calculator is 100% faithful to the in-game badge!
          detectedMmr = minBracketMmr;
          playerMmrTag.textContent = `MMR da Medalha: ${detectedMmr}`;
        }
      } else {
        detectedMmr = minBracketMmr;
        playerMmrTag.textContent = `MMR da Medalha: ${detectedMmr}`;
      }

      if (playerRangeTag) {
        playerRangeTag.style.display = 'inline-block';
        playerRangeTag.textContent = `Faixa: ${minBracketMmr}–${maxBracketMmr} MMR`;
      }
    } else {
      // Uncalibrated account
      if (playerData.computed_mmr && !isNaN(playerData.computed_mmr)) {
        detectedMmr = Math.round(playerData.computed_mmr);
        playerMmrTag.textContent = `MMR Estimado (Não calibrado): ${detectedMmr}`;
      } else {
        detectedMmr = 2620;
        playerMmrTag.textContent = `MMR Base: 2620`;
      }
      if (playerRangeTag) playerRangeTag.style.display = 'none';
    }

    playerRankTag.textContent = `Medalha: ${medalNameText}`;

    // Automatically set MMR in calculator!
    setMmr(detectedMmr);

    // Save to LocalStorage for seamless persistence
    localStorage.setItem('dota_saved_account_id', accountId);

    // Show Profile Banner and hide input form
    searchBarContainer.style.display = 'none';
    playerProfileBanner.style.display = 'flex';

    // 2. Fetch Ranked Stats (Win/Loss/Winrate)
    loadRankedStats(accountId);

    // 3. Fetch Top 10 Heroes
    loadTopHeroes(accountId);

    // 4. Fetch Recent Matches with Tier Context
    fetchAndRenderMatches(accountId, currentMatchLimit);

  } catch (err) {
    console.error('Erro ao carregar dados do jogador:', err);
    alert('Erro ao carregar dados do jogador. Verifique o ID e sua conexão.');
  } finally {
    if (searchSubmitBtn) {
      searchSubmitBtn.disabled = false;
      searchSubmitBtn.innerHTML = `<span>Buscar Jogador</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>`;
    }
  }
}

/**
 * Load Career Ranked Stats (Total, Wins, Losses, Winrate)
 */
async function loadRankedStats(accountId) {
  if (!playerRankedStats) return;

  try {
    const res = await fetch(`https://api.opendota.com/api/players/${accountId}/wl?lobby_type=7`);
    if (!res.ok) throw new Error('Falha ao obter W/L');
    const data = await res.json();

    const wins = Number(data.win) || 0;
    const losses = Number(data.lose) || 0;
    const total = wins + losses;

    if (total > 0) {
      const winrate = ((wins / total) * 100).toFixed(1);

      statRankedTotal.textContent = total.toLocaleString('pt-BR');
      statRankedWins.textContent = wins.toLocaleString('pt-BR');
      statRankedLosses.textContent = losses.toLocaleString('pt-BR');
      statRankedWinrate.textContent = `${winrate}%`;
      statRankedWinrate.style.color = Number(winrate) >= 50 ? '#4ade80' : '#f87171';

      playerRankedStats.style.display = 'flex';
    } else {
      playerRankedStats.style.display = 'none';
    }
  } catch (err) {
    console.warn('Erro ao carregar dados ranqueados W/L:', err);
    playerRankedStats.style.display = 'none';
  }
}

/**
 * Load Top 10 Most Played Heroes
 */
async function loadTopHeroes(accountId) {
  if (!topHeroesSection || !topHeroesGrid) return;

  topHeroesSection.style.display = 'block';
  if (heroesLoading) heroesLoading.style.display = 'flex';
  topHeroesGrid.innerHTML = '';

  try {
    const res = await fetch(`https://api.opendota.com/api/players/${accountId}/heroes`);
    if (!res.ok) throw new Error('Falha ao obter heróis');
    const heroes = await res.json();

    if (heroesLoading) heroesLoading.style.display = 'none';

    if (!Array.isArray(heroes) || heroes.length === 0) {
      topHeroesSection.style.display = 'none';
      return;
    }

    // Filter heroes with at least 1 match, sort by games descending, take top 10
    const top10 = heroes
      .filter(h => (h.games || 0) > 0)
      .sort((a, b) => (b.games || 0) - (a.games || 0))
      .slice(0, 10);

    if (top10.length === 0) {
      topHeroesSection.style.display = 'none';
      return;
    }

    renderTopHeroes(top10);
  } catch (err) {
    console.warn('Erro ao carregar top heróis:', err);
    if (heroesLoading) heroesLoading.style.display = 'none';
    topHeroesSection.style.display = 'none';
  }
}

function renderTopHeroes(heroes) {
  topHeroesGrid.innerHTML = '';

  heroes.forEach((h, index) => {
    const heroInfo = getHeroDetails(h.hero_id);
    const games = h.games || 0;
    const wins = h.win || 0;
    const losses = Math.max(0, games - wins);
    const winrate = games > 0 ? ((wins / games) * 100).toFixed(1) : '0.0';
    const isPositive = Number(winrate) >= 50;

    let rankClass = '';
    if (index === 0) rankClass = 'top-1';
    else if (index === 1) rankClass = 'top-2';
    else if (index === 2) rankClass = 'top-3';

    const card = document.createElement('div');
    card.className = 'hero-stat-card';
    card.innerHTML = `
      <div class="hero-card-left">
        <span class="hero-rank-pos ${rankClass}">#${index + 1}</span>
        <img class="hero-card-portrait" src="${heroInfo.imgUrl}" alt="${heroInfo.name}" onerror="this.src='assets/images/rank_icon_0.png'">
        <span class="hero-card-name" title="${heroInfo.name}">${heroInfo.name}</span>
      </div>

      <div class="hero-card-mid">
        <div class="hero-winrate-bar-bg" title="${winrate}% de Vitórias">
          <div class="hero-winrate-bar-fill" style="width: ${winrate}%; background: ${isPositive ? '#4ade80' : '#f87171'};"></div>
        </div>
      </div>

      <div class="hero-card-right">
        <div class="hero-winrate-pct ${isPositive ? 'positive' : 'negative'}">${winrate}%</div>
        <div class="hero-games-count"><strong>${games.toLocaleString('pt-BR')}</strong> partidas</div>
        <div class="hero-wl-ratio"><span class="win">${wins}V</span> - <span class="loss">${losses}D</span></div>
      </div>
    `;

    topHeroesGrid.appendChild(card);
  });
}

/**
 * Load and Render Matches (Configurable: 20 or 50)
 */
let currentMatchLimit = 20;

async function fetchAndRenderMatches(accountId, limit = 20) {
  currentMatchLimit = limit;
  recentMatchesSection.style.display = 'block';
  matchesLoading.style.display = 'flex';
  matchesList.innerHTML = '';
  privateProfileNotice.style.display = 'none';

  try {
    const endpoint = limit === 20
      ? `https://api.opendota.com/api/players/${accountId}/recentMatches`
      : `https://api.opendota.com/api/players/${accountId}/matches?limit=${limit}`;

    const matchesRes = await fetch(endpoint);
    if (!matchesRes.ok) throw new Error('Falha ao obter partidas');
    const matches = await matchesRes.json();

    matchesLoading.style.display = 'none';

    if (!Array.isArray(matches) || matches.length === 0) {
      privateProfileNotice.style.display = 'flex';
      matchesSummaryPill.style.display = 'none';
      return;
    }

    matchesSummaryPill.style.display = 'inline-flex';
    renderRecentMatches(matches, currentActivePlayerTierId);

  } catch (e) {
    console.error('Erro ao puxar partidas recentes:', e);
    matchesLoading.style.display = 'none';
    privateProfileNotice.style.display = 'flex';
  }
}

// Matches Limit Buttons Handler
if (limitBtn20 && limitBtn50) {
  limitBtn20.addEventListener('click', () => {
    if (currentMatchLimit === 20) return;
    limitBtn20.classList.add('active');
    limitBtn50.classList.remove('active');
    if (currentActiveAccountId) {
      fetchAndRenderMatches(currentActiveAccountId, 20);
    }
  });

  limitBtn50.addEventListener('click', () => {
    if (currentMatchLimit === 50) return;
    limitBtn50.classList.add('active');
    limitBtn20.classList.remove('active');
    if (currentActiveAccountId) {
      fetchAndRenderMatches(currentActiveAccountId, 50);
    }
  });
}

function renderRecentMatches(matches, playerTierId = 0) {
  matchesList.innerHTML = '';

  let wins = 0;
  let losses = 0;

  matches.forEach(match => {
    const isRadiant = match.player_slot < 128;
    const isWin = (isRadiant && match.radiant_win) || (!isRadiant && !match.radiant_win);

    if (isWin) wins++; else losses++;

    const hero = getHeroDetails(match.hero_id);
    const durationMin = Math.floor(match.duration / 60);
    const durationSec = match.duration % 60;
    const durationStr = `${durationMin}m ${durationSec < 10 ? '0' : ''}${durationSec}s`;

    let modeName = 'Normal';
    let isRanked = false;
    if (match.lobby_type === 7) {
      modeName = 'Ranqueada';
      isRanked = true;
    } else if (match.game_mode === 23) {
      modeName = 'Turbo';
    }

    // Dynamic Glicko MMR delta estimation:
    let deltaNumeric = 0;
    let deltaLabel = '';
    let deltaTooltip = '';
    const isCasual = !isRanked;

    if (isRanked) {
      if (playerTierId >= 1 && playerTierId <= 4) {
        // Lower bracket boost
        if (isWin) {
          deltaNumeric = 35;
          deltaLabel = '+35 MMR 🚀';
          deltaTooltip = 'Vitória ranqueada (brackets Arauto a Arconte recebem impulso Glicko de +30 a +40 MMR)';
        } else {
          deltaNumeric = -22;
          deltaLabel = '-22 MMR';
          deltaTooltip = 'Derrota ranqueada (brackets baixos sofrem atenuação: -20 a -25 MMR)';
        }
      } else {
        // Higher brackets
        if (isWin) {
          deltaNumeric = 25;
          deltaLabel = '+25 MMR';
          deltaTooltip = 'Vitória ranqueada (+25 a +30 MMR)';
        } else {
          deltaNumeric = -25;
          deltaLabel = '-25 MMR';
          deltaTooltip = 'Derrota ranqueada (-25 a -30 MMR)';
        }
      }
    } else {
      deltaNumeric = 0;
      deltaLabel = 'Casual (0 MMR)';
      deltaTooltip = 'Partidas casuais e Turbo não alteram o MMR competitivo ranqueado';
    }

    const matchCard = document.createElement('div');
    matchCard.className = `match-item-card ${isWin ? 'is-win' : 'is-loss'}`;

    // Show KDA only if kills is defined (matches endpoint vs recentMatches)
    const hasKda = match.kills !== undefined && match.deaths !== undefined && match.assists !== undefined;
    const kdaHtml = hasKda
      ? `<strong>${match.kills}</strong> / <strong style="color: #f87171;">${match.deaths}</strong> / <strong>${match.assists}</strong>`
      : `<span>ID ${match.match_id}</span>`;

    matchCard.innerHTML = `
      <div class="match-hero-group">
        <img class="match-hero-img" src="${hero.imgUrl}" alt="${hero.name}" onerror="this.src='assets/images/rank_icon_0.png'">
        <div>
          <div class="match-hero-name">${hero.name}</div>
          <div class="match-mode-tag">${modeName}</div>
        </div>
      </div>

      <div class="match-outcome-badge ${isWin ? 'win' : 'loss'}">
        ${isWin ? 'VITÓRIA' : 'DERROTA'}
      </div>

      <div class="match-stats-group">
        <div class="match-kda">${kdaHtml}</div>
        <div class="match-duration">${durationStr}</div>
        <div class="match-time-ago">${formatRelativeTime(match.start_time ? new Date(match.start_time * 1000).toISOString() : null)}</div>
      </div>

      <button class="match-delta-btn ${isCasual ? 'casual' : (isWin ? (deltaNumeric >= 35 ? 'win boost' : 'win') : 'loss')}" title="${deltaTooltip}">
        ${deltaLabel}
      </button>
    `;

    // Click on delta button simulates match on MMR calculator
    const deltaBtn = matchCard.querySelector('.match-delta-btn');
    if (!isCasual) {
      deltaBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const current = parseInt(mmrInput.value, 10) || 0;
        setMmr(Math.max(0, current + deltaNumeric));
        showToast(`Simulação: ${deltaNumeric > 0 ? '+' : ''}${deltaNumeric} MMR aplicado ao calculador!`);
      });
    }

    matchesList.appendChild(matchCard);
  });

  const total = wins + losses;
  const winrate = total > 0 ? Math.round((wins / total) * 100) : 0;

  matchesWinLoss.textContent = `${wins}V - ${losses}D`;
  matchesWinrate.textContent = `${winrate}% Winrate`;
  matchesWinrate.style.color = winrate >= 50 ? '#4ade80' : '#f87171';
}

// Profile Actions (Refresh / Switch)
if (refreshPlayerBtn) {
  refreshPlayerBtn.addEventListener('click', () => {
    if (currentActiveAccountId) {
      loadPlayerData(currentActiveAccountId);
      showToast('Dados do jogador atualizados com sucesso!');
    }
  });
}

if (switchPlayerBtn) {
  switchPlayerBtn.addEventListener('click', () => {
    localStorage.removeItem('dota_saved_account_id');
    currentActiveAccountId = null;
    currentActivePlayerTierId = 0;
    playerProfileBanner.style.display = 'none';
    if (playerRankedStats) playerRankedStats.style.display = 'none';
    if (topHeroesSection) topHeroesSection.style.display = 'none';
    searchBarContainer.style.display = 'flex';
    recentMatchesSection.style.display = 'none';
    if (playerQueryInput) {
      playerQueryInput.value = '';
      playerQueryInput.focus();
    }
  });
}

/**
 * Initialize on Page Load
 */
window.addEventListener('DOMContentLoaded', async () => {
  buildPresetChips();
  buildFullTable();

  // Load heroes cache in background
  loadHeroesData();

  // Check if a saved player exists in localStorage or query params
  const params = new URLSearchParams(window.location.search);
  const playerParam = params.get('player') || params.get('id');
  const savedAccountId = playerParam || localStorage.getItem('dota_saved_account_id');

  if (savedAccountId) {
    loadPlayerData(savedAccountId);
  } else {
    // Read initial MMR from URL param (?mmr=3450) or default to 2620
    const initialMmr = params.get('mmr') !== null ? parseInt(params.get('mmr'), 10) : 2620;
    setMmr(isNaN(initialMmr) ? 2620 : initialMmr);
  }
});

// Expose setMmr globally for inline table click handlers
window.setMmr = setMmr;

