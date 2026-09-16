/* SEARCH ENGINE & DEBOUNCE LOGIC (300ms) */
const searchInput = document.getElementById("searchInput");
const searchDropdown = document.getElementById("searchDropdown");
let searchDebounceTimer;

document.addEventListener("DOMContentLoaded", () => {
  renderTrending();
  renderContinueWatching();
  renderRecentlyAdded();
  renderGenres();
  checkWatchlistState();
});

// Scoring Engine Rule: Title starts (80), Title contains (50), Type (30), Desc (10)[span_1](start_span)[span_1](end_span)
function executeSearchScoring(query) {
  return ANIME_DATABASE.map(item => {
    let score = 0;
    const title = item.title.toLowerCase();
    const desc = item.description.toLowerCase();

    if (title.startsWith(query)) score += 80;
    else if (title.includes(query)) score += 50;
    if (item.type.toLowerCase().includes(query)) score += 30;
    if (desc.includes(query)) score += 10;

    return { ...item, score };
  })
  .filter(item => item.score > 0)
  .sort((a, b) => b.score - a.score);
}

searchInput.addEventListener("input", (e) => {
  clearTimeout(searchDebounceTimer);
  const query = e.target.value.trim().toLowerCase();

  if (!query) {
    searchDropdown.classList.remove("active");
    return;
  }

  // 300ms Debounce[span_2](start_span)[span_2](end_span)
  searchDebounceTimer = setTimeout(() => {
    const results = executeSearchScoring(query);
    displaySearchResults(results);
  }, 300);
});

function displaySearchResults(results) {
  if (results.length === 0) {
    searchDropdown.innerHTML = `<div style="padding: 15px; text-align: center; color: var(--text-muted); font-size: 13px;">No results found</div>`;
  } else {
    searchDropdown.innerHTML = results.map(item => `
      <div class="search-item">
        <img src="${item.image}" alt="${item.title}">
        <div>
          <h4 style="font-size: 14px; color: #fff;">${item.title}</h4>
          <p style="font-size: 12px; color: var(--text-muted);">${item.type} • ${item.episode}</p>
        </div>
      </div>
    `).join('');
  }
  searchDropdown.classList.add("active");
}

document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-box-wrapper")) {
    searchDropdown.classList.remove("active");
  }
});

/* RENDERERS */
function renderTrending() {
  const container = document.getElementById("trendingGrid");
  container.innerHTML = ANIME_DATABASE.map(item => `
    <div class="anime-card">
      <div class="card-thumb">
        <img src="${item.image}" alt="${item.title}">
        <span class="rank-badge">${item.rank}</span>
        <span class="rating-badge">★ ${item.rating}</span>
      </div>
      <div class="card-info">
        <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 6px;">${item.title}</h4>
        <div class="genre-tags">
          ${item.genres.map(g => `<span class="tag">${g}</span>`).join('')}
        </div>
        <span style="font-size: 11px; color: var(--text-muted);">${item.episode}</span>
      </div>
    </div>
  `).join('');
}

function renderContinueWatching() {
  const container = document.getElementById("continueGrid");
  container.innerHTML = ANIME_DATABASE.map(item => `
    <div class="cw-card">
      <div class="cw-thumb">
        <img src="${item.image}" alt="${item.title}">
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: ${item.progress}%"></div>
        </div>
      </div>
      <div class="card-info">
        <h4 style="font-size: 14px; font-weight: 700;">${item.title}</h4>
        <p style="font-size: 12px; color: var(--text-muted);">${item.episode} • ${item.progress}% watched</p>
      </div>
    </div>
  `).join('');
}

function renderRecentlyAdded() {
  const container = document.getElementById("recentlyAddedGrid");
  container.innerHTML = ANIME_DATABASE.slice().reverse().map(item => `
    <div class="anime-card">
      <div class="card-thumb">
        <img src="${item.image}" alt="${item.title}">
        <span class="rating-badge">★ ${item.rating}</span>
      </div>
      <div class="card-info">
        <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 6px;">${item.title}</h4>
        <div class="genre-tags">
          ${item.genres.map(g => `<span class="tag">${g}</span>`).join('')}
        </div>
        <span style="font-size: 11px; color: var(--text-muted);">${item.episode}</span>
      </div>
    </div>
  `).join('');
}

function renderGenres() {
  const container = document.getElementById("genresGrid");
  container.innerHTML = GENRES_LIST.map(g => `
    <div class="genre-card">
      <h4 style="font-size: 15px;">${g.name}</h4>
      <p style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">${g.count}</p>
    </div>
  `).join('');
}

/* LOCALSTORAGE WATCHLIST */
function toggleHeroWatchlist() {
  let watchlist = JSON.parse(localStorage.getItem("favorites") || "[]"); // favorites key[span_3](start_span)[span_3](end_span)
  if (watchlist.includes("1")) {
    watchlist = watchlist.filter(id => id !== "1");
  } else {
    watchlist.push("1");
  }
  localStorage.setItem("favorites", JSON.stringify(watchlist));
  checkWatchlistState();
}

function checkWatchlistState() {
  const watchlist = JSON.parse(localStorage.getItem("favorites") || "[]");
  const btn = document.getElementById("watchlistBtn");
  if (watchlist.includes("1")) {
    btn.innerText = "✓ In Watchlist";
  } else {
    btn.innerText = "+ Add to Watchlist";
  }
}

/* 18+ AGE GATE */
function openAgeGate() {
  document.getElementById("ageGateModal").classList.add("active");
}

function confirmAge(isAdult) {
  document.getElementById("ageGateModal").classList.remove("active");
  if (isAdult) {
    alert("Access Granted.");
  } else {
    alert("Access Denied.");
  }
}

