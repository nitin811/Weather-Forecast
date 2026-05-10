/* ═══════════════════════════════════════════════════
   ATMOSFERA — script.js
   Features: Aurora Canvas · WeatherAPI Forecast
             Unit Toggle · Geolocation
             Recent Searches · Dynamic Conditions
═══════════════════════════════════════════════════ */

'use strict';

/* ── Config ──────────────────────────────────────── */
const API_KEY    = 'd8abfc3446fc40ce91952814252108';
const MAX_RECENT = 6;

/* ── DOM ─────────────────────────────────────────── */
const $ = id => document.getElementById(id);

const locationInput  = $('locationInput');
const searchBtn      = $('searchBtn');
const gpsBtn         = $('gpsBtn');
const modeToggle     = $('modeToggle');
const modeIcon       = $('modeIcon');
const celsiusBtn     = $('celsiusBtn');
const fahrenheitBtn  = $('fahrenheitBtn');
const recentRow      = $('recentRow');

const emptyState     = $('emptyState');
const loadingState   = $('loadingState');
const errorState     = $('errorState');
const weatherOutput  = $('weatherOutput');

const cityName       = $('cityName');
const locationSub    = $('locationSub');
const locationDate   = $('locationDate');
const weatherEmoji   = $('weatherEmoji');
const condIcon       = $('condIcon');
const bigTemp        = $('bigTemp');
const conditionLabel = $('conditionLabel');
const feelsLike      = $('feelsLike');
const uvBadge        = $('uvBadge');
const tempHigh       = $('tempHigh');
const tempLow        = $('tempLow');
const dHumidity      = $('dHumidity');
const dWind          = $('dWind');
const windDir        = $('windDir');
const dVis           = $('dVis');
const dPressure      = $('dPressure');
const dSunrise       = $('dSunrise');
const dSunset        = $('dSunset');
const humidBar       = $('humidBar');
const hourlyScroll   = $('hourlyScroll');
const forecastList   = $('forecastList');
const heroTagline    = $('heroTagline');

/* ── State ───────────────────────────────────────── */
let currentData    = null;
let currentUnit    = 'C';
let recentSearches = [];

try {
  recentSearches = JSON.parse(localStorage.getItem('atmosfera_recent') || '[]');
} catch(_) { recentSearches = []; }

/* ══════════════════════════════════════════════════
   AURORA CANVAS ANIMATION
══════════════════════════════════════════════════ */
(function initAurora() {
  const canvas = $('auroraCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Aurora wave config
  const waves = [
    { amp: 0.18, freq: 0.0012, speed: 0.00032, phase: 0,    color: [56,  189, 248] },
    { amp: 0.14, freq: 0.0018, speed: 0.00024, phase: 2.1,  color: [124, 58,  237] },
    { amp: 0.12, freq: 0.0022, speed: 0.00038, phase: 4.3,  color: [16,  185, 129] },
    { amp: 0.10, freq: 0.0008, speed: 0.00018, phase: 1.5,  color: [236, 72,  153] },
  ];

  let W, H, t = 0, raf;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  function drawWave(wave) {
    const { amp, freq, speed, phase, color } = wave;
    const pts = 120;
    const step = W / pts;
    const baseY = H * 0.52;

    ctx.beginPath();
    for (let i = 0; i <= pts; i++) {
      const x = i * step;
      const y = baseY
        + Math.sin(x * freq + t * speed * 1000 + phase) * H * amp
        + Math.cos(x * freq * 0.6 + t * speed * 700 + phase * 1.3) * H * amp * 0.5;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();

    const alpha = document.body.classList.contains('day') ? 0.065 : 0.11;
    const [r,g,b] = color;
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0,   `rgba(${r},${g},${b},${alpha})`);
    grad.addColorStop(0.5, `rgba(${r},${g},${b},${alpha * 0.5})`);
    grad.addColorStop(1,   `rgba(${r},${g},${b},0)`);
    ctx.fillStyle = grad;
    ctx.fill();
  }

  // Floating particles
  const particles = Array.from({ length: 38 }, () => ({
    x: Math.random() * 1,
    y: Math.random() * 1,
    r: Math.random() * 2 + 0.5,
    vx: (Math.random() - 0.5) * 0.00008,
    vy: (Math.random() - 0.5) * 0.00006,
    alpha: Math.random() * 0.4 + 0.1,
    color: [[56,189,248],[124,58,237],[16,185,129],[236,72,153]][Math.floor(Math.random() * 4)],
  }));

  function drawParticles() {
    const isDay = document.body.classList.contains('day');
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
      if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
      const [r,g,b] = p.color;
      const a = isDay ? p.alpha * 0.35 : p.alpha;
      ctx.beginPath();
      ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
      ctx.fill();
    });
  }

  function render(ts) {
    t = ts;
    ctx.clearRect(0, 0, W, H);
    waves.forEach(drawWave);
    drawParticles();
    raf = requestAnimationFrame(render);
  }
  raf = requestAnimationFrame(render);
})();

/* ══════════════════════════════════════════════════
   UI STATE HELPERS
══════════════════════════════════════════════════ */
function showState(state) {
  emptyState.style.display    = state === 'empty'   ? 'block' : 'none';
  loadingState.style.display  = state === 'loading' ? 'block' : 'none';
  errorState.style.display    = state === 'error'   ? 'block' : 'none';
  weatherOutput.style.display = state === 'weather' ? 'block' : 'none';
  heroTagline.style.display   = state === 'empty'   ? 'block' : 'none';
}

/* ── Temperature ─────────────────────────────────── */
function T(c, f) { return currentUnit === 'C' ? Math.round(c) : Math.round(f); }
function deg()   { return currentUnit === 'C' ? '°C' : '°F'; }

/* ── Emoji mapping ───────────────────────────────── */
function codeToEmoji(code, isDay) {
  const d = isDay !== 0;
  const map = {
    1000: d ? '☀️' : '🌙',
    1003: d ? '🌤️': '🌙',
    1006: '🌥️', 1009: '☁️',
  };
  if (map[code]) return map[code];
  if ([1030,1135,1147].includes(code)) return '🌫️';
  if ([1063,1150,1153].includes(code)) return '🌦️';
  if ([1180,1183,1186,1189,1192,1195,1240,1243,1246].includes(code)) return '🌧️';
  if ([1087,1273,1276].includes(code)) return '⛈️';
  if ([1066,1114,1117,1210,1213,1216,1219,1222,1225,1255,1258].includes(code)) return '❄️';
  if ([1069,1072,1168,1171,1198,1201,1204,1207,1249,1252].includes(code)) return '🌨️';
  if ([1279,1282].includes(code)) return '🌩️';
  return '🌡️';
}

/* ── Condition theme ─────────────────────────────── */
const COND_CLASSES = ['cond-sunny','cond-rain','cond-cloud','cond-snow','cond-storm'];
function setCondTheme(code, isDay) {
  document.body.classList.remove(...COND_CLASSES);
  if (!isDay) return;
  if ([1000,1003].includes(code)) document.body.classList.add('cond-sunny');
  else if ([1087,1273,1276,1279,1282].includes(code)) document.body.classList.add('cond-storm');
  else if ([1063,1150,1153,1180,1183,1186,1189,1192,1195,1240,1243,1246].includes(code)) document.body.classList.add('cond-rain');
  else if ([1006,1009].includes(code)) document.body.classList.add('cond-cloud');
  else if ([1066,1114,1117,1210,1213,1216,1219,1222,1225].includes(code)) document.body.classList.add('cond-snow');
}

/* ── UV label ────────────────────────────────────── */
function uvLabel(uv) {
  const uv2 = Math.round(uv);
  if (uv2 <= 2)  return `UV ${uv2} · Low`;
  if (uv2 <= 5)  return `UV ${uv2} · Moderate`;
  if (uv2 <= 7)  return `UV ${uv2} · High`;
  if (uv2 <= 10) return `UV ${uv2} · Very High`;
  return `UV ${uv2} · Extreme`;
}

/* ── Date helpers ────────────────────────────────── */
function niceDate(localtime) {
  return new Date(localtime).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}
function dayLabel(dateStr, i) {
  if (i === 0) return 'Today';
  if (i === 1) return 'Tomorrow';
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long' });
}
function fmtHour(timeStr) {
  return new Date(timeStr).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
}

/* ══════════════════════════════════════════════════
   RENDER
══════════════════════════════════════════════════ */
function renderWeather(data) {
  const { current, location, forecast } = data;
  const isDay  = current.is_day;
  const code   = current.condition.code;
  const today  = forecast.forecastday[0];
  const astro  = today.astro;

  /* Hero */
  cityName.textContent       = location.name;
  locationSub.textContent    = [location.region, location.country].filter(Boolean).join(', ');
  locationDate.textContent   = niceDate(location.localtime);
  uvBadge.textContent        = uvLabel(current.uv);

  /* Emoji — re-trigger animation */
  weatherEmoji.style.animation = 'none';
  void weatherEmoji.offsetHeight;
  weatherEmoji.style.animation = '';
  weatherEmoji.textContent = codeToEmoji(code, isDay);

  /* API icon */
  if (current.condition.icon) {
    condIcon.src = 'https:' + current.condition.icon;
    condIcon.alt = current.condition.text;
  }

  bigTemp.textContent        = T(current.temp_c, current.temp_f) + deg();
  conditionLabel.textContent = current.condition.text;
  feelsLike.textContent      = `Feels like ${T(current.feelslike_c, current.feelslike_f)}${deg()}`;
  tempHigh.textContent       = T(today.day.maxtemp_c, today.day.maxtemp_f) + deg();
  tempLow.textContent        = T(today.day.mintemp_c, today.day.mintemp_f) + deg();

  /* Stats */
  dHumidity.textContent  = `${current.humidity}%`;
  dWind.textContent      = `${current.wind_kph} km/h`;
  windDir.textContent    = current.wind_dir;
  dVis.textContent       = `${current.vis_km} km`;
  dPressure.textContent  = `${current.pressure_mb} mb`;
  dSunrise.textContent   = astro.sunrise;
  dSunset.textContent    = astro.sunset;

  /* Humidity bar */
  requestAnimationFrame(() => {
    humidBar.style.width = current.humidity + '%';
  });

  /* Hourly */
  const nowHour    = new Date(location.localtime).getHours();
  const allHours   = today.hour;
  const laterHours = allHours.filter(h => new Date(h.time).getHours() >= nowHour).slice(0, 10);

  hourlyScroll.innerHTML = '';
  laterHours.forEach((h, i) => {
    const card = document.createElement('div');
    card.className = 'h-card' + (i === 0 ? ' is-now' : '');
    card.setAttribute('role', 'listitem');
    const rainHtml = h.chance_of_rain > 0
      ? `<span class="h-rain">💧${h.chance_of_rain}%</span>` : '';
    card.innerHTML = `
      <span class="h-time">${i === 0 ? 'Now' : fmtHour(h.time)}</span>
      <span class="h-emoji">${codeToEmoji(h.condition.code, h.is_day)}</span>
      <span class="h-temp">${T(h.temp_c, h.temp_f)}°</span>
      ${rainHtml}
    `;
    hourlyScroll.appendChild(card);
  });

  /* 3-Day forecast */
  forecastList.innerHTML = '';
  forecast.forecastday.forEach((day, i) => {
    const row = document.createElement('div');
    row.className = 'f-row';
    row.setAttribute('role', 'listitem');
    const rainHtml = day.day.daily_chance_of_rain > 0
      ? `<span class="f-rain">💧${day.day.daily_chance_of_rain}%</span>`
      : `<span class="f-rain"></span>`;
    row.innerHTML = `
      <span class="f-day">${dayLabel(day.date, i)}</span>
      <span class="f-emoji">${codeToEmoji(day.day.condition.code, 1)}</span>
      <span class="f-cond">${day.day.condition.text}</span>
      ${rainHtml}
      <div class="f-temps">
        <span class="f-hi">${T(day.day.maxtemp_c, day.day.maxtemp_f)}°</span>
        <span class="f-lo">${T(day.day.mintemp_c, day.day.mintemp_f)}°</span>
      </div>
    `;
    forecastList.appendChild(row);
  });

  setCondTheme(code, isDay);
  showState('weather');
}

/* ══════════════════════════════════════════════════
   FETCH
══════════════════════════════════════════════════ */
async function fetchWeather(query) {
  showState('loading');
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(query)}&days=3&aqi=no`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error?.message || 'Location not found. Try a different name.');
    }
    const data = await res.json();
    currentData = data;
    renderWeather(data);
    saveRecent(data.location.name);
  } catch (err) {
    $('errorText').textContent = err.message;
    showState('error');
  }
}

/* ══════════════════════════════════════════════════
   RECENT SEARCHES
══════════════════════════════════════════════════ */
function saveRecent(name) {
  recentSearches = recentSearches.filter(s => s.toLowerCase() !== name.toLowerCase());
  recentSearches.unshift(name);
  recentSearches = recentSearches.slice(0, MAX_RECENT);
  try { localStorage.setItem('atmosfera_recent', JSON.stringify(recentSearches)); } catch(_) {}
  renderRecent();
}

function renderRecent() {
  recentRow.innerHTML = recentSearches.map(s => {
    const safe = s.replace(/'/g, "\\'");
    return `<button class="recent-chip" role="listitem" onclick="fetchWeather('${safe}')">${s}</button>`;
  }).join('');
}

/* ══════════════════════════════════════════════════
   EVENT LISTENERS
══════════════════════════════════════════════════ */
function doSearch() {
  const q = locationInput.value.trim();
  if (q) fetchWeather(q);
}

searchBtn.addEventListener('click', doSearch);
locationInput.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });

gpsBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    $('errorText').textContent = 'Geolocation is not supported by your browser.';
    showState('error');
    return;
  }
  showState('loading');
  navigator.geolocation.getCurrentPosition(
    pos => fetchWeather(`${pos.coords.latitude},${pos.coords.longitude}`),
    ()  => {
      $('errorText').textContent = 'Unable to retrieve your location.';
      showState('error');
    }
  );
});

/* Day / Night toggle */
modeToggle.addEventListener('click', () => {
  document.body.classList.toggle('day');
  const isDay = document.body.classList.contains('day');
  modeIcon.textContent = isDay ? '🌙' : '☀️';
  modeToggle.setAttribute('aria-label', isDay ? 'Switch to dark mode' : 'Switch to light mode');
});

/* Unit toggle */
celsiusBtn.addEventListener('click', () => {
  if (currentUnit === 'C') return;
  currentUnit = 'C';
  celsiusBtn.classList.add('active');
  celsiusBtn.setAttribute('aria-pressed', 'true');
  fahrenheitBtn.classList.remove('active');
  fahrenheitBtn.setAttribute('aria-pressed', 'false');
  if (currentData) renderWeather(currentData);
});

fahrenheitBtn.addEventListener('click', () => {
  if (currentUnit === 'F') return;
  currentUnit = 'F';
  fahrenheitBtn.classList.add('active');
  fahrenheitBtn.setAttribute('aria-pressed', 'true');
  celsiusBtn.classList.remove('active');
  celsiusBtn.setAttribute('aria-pressed', 'false');
  if (currentData) renderWeather(currentData);
});

/* ══════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════ */
(function init() {
  showState('empty');
  renderRecent();

  /* Footer year */
  const fy = $('footerYear');
  if (fy) fy.textContent = new Date().getFullYear();

  /* Auto day/night from clock */
  const h = new Date().getHours();
  if (h >= 6 && h < 19) {
    document.body.classList.add('day');
    modeIcon.textContent = '🌙';
  }

  /* Scroll-based header transparency */
  const header = $('appHeader');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.background = window.scrollY > 20
        ? (document.body.classList.contains('day')
            ? 'rgba(212,233,247,0.85)'
            : 'rgba(6,9,18,0.85)')
        : '';
    }, { passive: true });
  }
})();