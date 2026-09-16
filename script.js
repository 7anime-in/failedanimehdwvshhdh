document.addEventListener("DOMContentLoaded", () => {
    initHeroBanner();
    renderTrending();
    renderContinueWatching();
    renderGenres();
    setupSearchDebounce();
    checkWatchlistState();
});

// Setup Hero Background Image
function initHeroBanner() {
    const heroBanner = document.getElementById("heroBanner");
    const anime = ANIME_DATABASE[0];
    if (heroBanner && anime) {
        heroBanner.style.backgroundImage = `linear-gradient(to top, rgba(7,8,20,0.95), rgba(7,8,20,0.3)), url('${anime.image}')`;
        heroBanner.style.backgroundSize = "cover";
        heroBanner.style.backgroundPosition = "center";
    }
}

// Navigation Controllers
function showHomePage() {
    document.getElementById("homeView").classList.remove("hidden");
    document.getElementById("playerView").classList.add("hidden");
    window.scrollTo(0, 0);
}

function playAnime(animeId, seasonId, episodeId) {
    document.getElementById("homeView").classList.add("hidden");
    document.getElementById("playerView").classList.remove("hidden");
    window.scrollTo(0, 0);
    loadPlayerUI(animeId, seasonId, episodeId);
}

// Player Rendering Engine (Compliant with 7Anime Specs)
function loadPlayerUI(animeId, seasonId, episodeId) {
    const anime = ANIME_DATABASE.find(a => a.id === animeId);
    if (!anime) return;

    let season = anime.seasons.find(s => s.seasonId === seasonId) || anime.seasons[0];
    let episode = season.episodes.find(e => e.episodeId === episodeId) || season.episodes[0];

    const currentEpIndex = season.episodes.findIndex(e => e.episodeId === episode.episodeId);
    const prevEp = season.episodes[currentEpIndex - 1];
    const nextEp = season.episodes[currentEpIndex + 1];

    const container = document.getElementById("playerContainer");
    container.innerHTML = `
        <div class="player-wrapper" style="display: grid; grid-template-columns: 1fr; gap: 20px;">
            <div class="main-video-section">
                <!-- VIDEO IFRAME PLAYER -->
                <div class="video-screen-box" style="position: relative; aspect-ratio: 16/9; background: #000; border-radius: 12px; overflow: hidden;">
                    <iframe src="${episode.videoUrl}" style="width: 100%; height: 100%; border: none;" allowfullscreen></iframe>
                </div>

                <!-- CONTROLS & NAV -->
                <div class="player-controls-bar" style="display: flex; justify-content: space-between; align-items: center; background: #111326; padding: 12px; border-radius: 12px; margin-top: 12px;">
                    <button class="btn-primary" ${!prevEp ? 'disabled style="opacity:0.5;"' : ''} onclick="playAnime('${animeId}', '${season.seasonId}', '${prevEp?.episodeId}')">← Previous</button>
                    <span style="font-weight:700;">${season.seasonName} - ${episode.title}</span>
                    <button class="btn-primary" ${!nextEp ? 'disabled style="opacity:0.5;"' : ''} onclick="playAnime('${animeId}', '${season.seasonId}', '${nextEp?.episodeId}')">Next →</button>
                </div>

                <!-- DETAILS BOX -->
                <div class="sidebar-panel" style="background: #111326; padding: 16px; border-radius: 12px; margin-top: 16px;">
                    <h2 style="font-size: 20px; color: #fff;">${anime.title}</h2>
                    <p style="color: #8e95a5; font-size: 13px; margin-top: 8px;">${anime.description}</p>
                </div>
            </div>

            <!-- SIDEBAR: SEASON & EPISODE SELECTOR -->
            <div class="sidebar-section" style="background: #111326; padding: 16px; border-radius: 12px;">
                <h3>Select Season</h3>
                <select id="seasonDropdown" onchange="changeSeason('${animeId}', this.value)" style="width:100%; padding: 10px; margin: 10px 0; background: rgba(255,255,255,0.06); color: #fff; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
                    ${anime.seasons.map(s => `
                        <option value="${s.seasonId}" ${s.seasonId === season.seasonId ? 'selected' : ''}>${s.seasonName}</option>
                    `).join('')}
                </select>

                <h3 style="margin-top: 15px;">Episodes</h3>
                <div class="episodes-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(60px, 1fr)); gap: 8px; margin-top: 10px; max-height: 300px; overflow-y: auto;">
                    ${season.episodes.map(ep => `
                        <button class="ep-btn ${ep.episodeId === episode.episodeId ? 'active' : ''}" 
                            onclick="playAnime('${animeId}', '${season.seasonId}', '${ep.episodeId}')"
                            style="padding: 10px; background: ${ep.episodeId === episode.episodeId ? '#6c5ce7' : 'rgba(255,255,255,0.06)'}; color: #fff; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; cursor: pointer;">
                            ${ep.episodeNumber}
                        </button>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function changeSeason(animeId, seasonId) {
    const anime = ANIME_DATABASE.find(a => a.id === animeId);
    const season = anime.seasons.find(s => s.seasonId === seasonId);
    if (season && season.episodes.length > 0) {
        playAnime(animeId, seasonId, season.episodes[0].episodeId);
    }
}

// Renders
function renderTrending() {
    const container = document.getElementById("trendingGrid");
    if (!container) return;
    container.innerHTML = ANIME_DATABASE.map(item => `
        <div class="anime-card" onclick="playAnime('${item.id}', 's1', 'ep1')" style="cursor:pointer;">
            <div class="card-thumb">
                <img src="${item.image || ''}" alt="${item.title}">
                ${item.rank ? `<span class="rank-badge">${item.rank}</span>` : ''}
                ${item.rating ? `<span class="rating-badge">★ ${item.rating}</span>` : ''}
            </div>
            <div class="card-info">
                <h4>${item.title || ''}</h4>
                <div class="genre-tags">
                    ${(item.genres || []).map(g => `<span class="tag">${g}</span>`).join('')}
                </div>
                <span class="ep-tag">${item.episode || ''}</span>
            </div>
        </div>
    `).join('');
}

function renderContinueWatching() {
    const container = document.getElementById("continueGrid");
    if (!container) return;
    container.innerHTML = ANIME_DATABASE.map(item => `
        <div class="cw-card" onclick="playAnime('${item.id}', 's1', 'ep1')" style="cursor:pointer;">
            <div class="cw-thumb">
                <img src="${item.image || ''}" alt="${item.title}">
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: 30%"></div>
                </div>
            </div>
            <div class="card-info">
                <h4>${item.title || ''}</h4>
                <p style="font-size: 11px; color: var(--text-muted);">${item.episode}</p>
            </div>
        </div>
    `).join('');
}

function renderGenres() {
    const container = document.getElementById("genresGrid");
    if (!container) return;
    container.innerHTML = GENRES_LIST.map(g => `
        <div class="genre-card">
            <h4 style="font-size: 14px;">${g.name}</h4>
            <p style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">${g.count}</p>
        </div>
    `).join('');
}

// Search Algorithm
function setupSearchDebounce() {
    const inputs = document.querySelectorAll(".searchInput");
    let searchTimer;
    inputs.forEach(input => {
        input.addEventListener("input", (e) => {
            clearTimeout(searchTimer);
            const query = e.target.value.trim().toLowerCase();
            const dropdown = input.closest(".search-box-wrapper").querySelector(".searchDropdown");
            if (!query) {
                dropdown.classList.remove("active");
                return;
            }
            searchTimer = setTimeout(() => {
                const matches = (ANIME_DATABASE || []).filter(item => (item.title || '').toLowerCase().includes(query));
                if (matches.length > 0) {
                    dropdown.innerHTML = matches.map(item => `
                        <div class="search-item" onclick="playAnime('${item.id}', 's1', 'ep1')" style="cursor:pointer;">
                            <img src="${item.image || ''}" alt="">
                            <div>
                                <h4 style="font-size: 13px;">${item.title || ''}</h4>
                                <p style="font-size: 11px; color: var(--text-muted);">${item.type || ''} • ${item.episode || ''}</p>
                            </div>
                        </div>
                    `).join('');
                } else {
                    dropdown.innerHTML = `<div style="padding: 10px; font-size: 12px; color: var(--text-muted);">No results found</div>`;
                }
                dropdown.classList.add("active");
            }, 300);
        });
    });
}

function toggleHeroWatchlist() {
    let watchlist = JSON.parse(localStorage.getItem("7anime_watchlist") || "[]");
    const btn = document.getElementById("watchlistBtn");
    if (watchlist.includes("1")) {
        watchlist = watchlist.filter(id => id !== "1");
        btn.innerText = "+ Add to Watchlist";
    } else {
        watchlist.push("1");
        btn.innerText = "✓ In Watchlist";
    }
    localStorage.setItem("7anime_watchlist", JSON.stringify(watchlist));
}

function checkWatchlistState() {
    let watchlist = JSON.parse(localStorage.getItem("7anime_watchlist") || "[]");
    const btn = document.getElementById("watchlistBtn");
    if (btn && watchlist.includes("1")) btn.innerText = "✓ In Watchlist";
}

function openAgeGate() { document.getElementById("ageGateModal").classList.add("active"); }
function confirmAge(isAdult) { document.getElementById("ageGateModal").classList.remove("active"); }
