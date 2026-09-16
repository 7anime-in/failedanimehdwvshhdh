document.addEventListener("DOMContentLoaded", () => {
    initHeroBanner();
    renderTrending();
    renderContinueWatching();
    renderRecentlyAdded();
    renderGenres();
    setupSearchDebounce();
    checkWatchlistState();
});

// Hero Banner Dynamic Image Setup
function initHeroBanner() {
    const heroBanner = document.getElementById("heroBanner");
    const anime = ANIME_DATABASE[0];
    if (heroBanner && anime) {
        heroBanner.style.backgroundImage = `linear-gradient(to top, rgba(7,8,20,0.95), rgba(7,8,20,0.3)), url('${anime.image}')`;
        heroBanner.style.backgroundSize = "cover";
        heroBanner.style.backgroundPosition = "center";
    }
}

// Grid Render Logic
function renderTrending() {
    const container = document.getElementById("trendingGrid");
    if (!container) return;
    if (!ANIME_DATABASE || ANIME_DATABASE.length === 0) {
        container.innerHTML = `<div class="empty-msg">No content added yet</div>`;
        return;
    }
    container.innerHTML = ANIME_DATABASE.map(item => `
        <div class="anime-card" onclick="playAnime('${item.id}', 's1', 'ep1')">
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
    
    // Fetch progress from localStorage if available
    let savedProgress = [];
    ANIME_DATABASE.forEach(item => {
        const progressData = localStorage.getItem(`7anime_watch_progress_${item.id}_s1_ep1`);
        if (progressData) {
            const parsed = JSON.parse(progressData);
            savedProgress.push({ ...item, progress: Math.min(100, Math.round((parsed.lastPosition / parsed.totalDuration) * 100)) });
        }
    });

    const displayList = savedProgress.length > 0 ? savedProgress : ANIME_DATABASE;

    container.innerHTML = displayList.map(item => `
        <div class="cw-card" onclick="playAnime('${item.id}', 's1', 'ep1')">
            <div class="cw-thumb">
                <img src="${item.image || ''}" alt="${item.title}">
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${item.progress || 15}%"></div>
                </div>
            </div>
            <div class="card-info">
                <h4>${item.title || ''}</h4>
                <p style="font-size: 11px; color: var(--text-muted);">${item.episode || 'Progress: ' + (item.progress || 15) + '%'}</p>
            </div>
        </div>
    `).join('');
}

function renderRecentlyAdded() {
    const container = document.getElementById("recentlyAddedGrid");
    if (!container) return;
    if (!ANIME_DATABASE || ANIME_DATABASE.length === 0) {
        container.innerHTML = `<div class="empty-msg">No recent items</div>`;
        return;
    }
    container.innerHTML = ANIME_DATABASE.slice().reverse().map(item => `
        <div class="anime-card" onclick="playAnime('${item.id}', 's1', 'ep1')">
            <div class="card-thumb">
                <img src="${item.image || ''}" alt="${item.title}">
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

function renderGenres() {
    const container = document.getElementById("genresGrid");
    if (!container) return;
    if (!GENRES_LIST || GENRES_LIST.length === 0) {
        container.innerHTML = `<div class="empty-msg">No genres defined</div>`;
        return;
    }
    container.innerHTML = GENRES_LIST.map(g => `
        <div class="genre-card">
            <h4 style="font-size: 14px;">${g.name}</h4>
            <p style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">${g.count}</p>
        </div>
    `).join('');
}

// Search Debounce Engine
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
                const matches = (ANIME_DATABASE || []).filter(item => 
                    (item.title || '').toLowerCase().includes(query)
                );
                if (matches.length > 0) {
                    dropdown.innerHTML = matches.map(item => `
                        <div class="search-item" onclick="playAnime('${item.id}', 's1', 'ep1')">
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

// Watchlist Engine
function toggleHeroWatchlist() {
    let watchlist = JSON.parse(localStorage.getItem("7anime_watchlist") || "[]");
    const animeId = "1";
    const btn = document.getElementById("watchlistBtn");
    
    if (watchlist.includes(animeId)) {
        watchlist = watchlist.filter(id => id !== animeId);
        btn.innerText = "+ Add to Watchlist";
    } else {
        watchlist.push(animeId);
        btn.innerText = "✓ In Watchlist";
    }
    localStorage.setItem("7anime_watchlist", JSON.stringify(watchlist));
}

function checkWatchlistState() {
    let watchlist = JSON.parse(localStorage.getItem("7anime_watchlist") || "[]");
    const btn = document.getElementById("watchlistBtn");
    if (btn && watchlist.includes("1")) {
        btn.innerText = "✓ In Watchlist";
    }
}

// Navigation / Player Launch Handler
function playAnime(animeId, seasonId, episodeId) {
    window.location.href = `/watch/${animeId}/${seasonId}/${episodeId}`;
}

// Age Gate Modals
function openAgeGate() {
    document.getElementById("ageGateModal").classList.add("active");
}

function confirmAge(isAdult) {
    document.getElementById("ageGateModal").classList.remove("active");
    if (!isAdult) {
        alert("You must be 18 or older to view mature content.");
    }
}
