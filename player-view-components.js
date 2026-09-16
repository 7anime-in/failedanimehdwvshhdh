/**
 * 7Anime - Dynamic Video Player UI Renderer & Event Controller
 * Implements Design Identity & Responsive Layout (PDF Section 1 & 11)
 */

class AnimePlayerUIController {
  constructor(containerId, animeId, seasonId, episodeId) {
    this.container = document.getElementById(containerId);
    this.animeId = animeId;
    this.seasonId = seasonId;
    this.episodeId = episodeId;
    
    this.animeData = fetchAnimeMetadataById(animeId);
    this.episodeData = getDetailedEpisodeData(animeId, seasonId, episodeId);
    this.flags = evaluatePlayerUIStateFlags(animeId, seasonId, episodeId);
    this.userSettings = VideoPlayerStorageEngine.getUserSettings();

    this.initPlayer();
  }

  initPlayer() {
    if (!this.flags.isDataValid) {
      this.renderErrorState("Anime or Episode not found.");
      return;
    }

    this.injectStyles();
    this.renderLayout();
    this.bindEvents();
    this.restoreProgress();
  }

  injectStyles() {
    if (document.getElementById("7anime-player-styles")) return;
    const style = document.createElement("style");
    style.id = "7anime-player-styles";
    style.innerHTML = `
      .player-app-wrapper { background: #070814; color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; }
      .player-container { display: flex; flex-direction: column; gap: 16px; padding: 16px; max-width: 1400px; margin: 0 auto; }
      
      /* Desktop Two-Column Layout (PDF Spec Section 1 & 11) */
      @media (min-width: 992px) {
        .player-container { display: grid; grid-template-columns: 1fr 360px; gap: 24px; }
      }

      .video-screen-box { position: relative; width: 100%; aspect-ratio: 16/9; background: #000; border-radius: 14px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.08); }
      .video-screen-box video { width: 100%; height: 100%; object-fit: contain; }
      
      .player-controls-bar { display: flex; align-items: center; justify-content: space-between; padding: 12px; background: #111326; border-radius: 12px; margin-top: 12px; border: 1px solid rgba(255,255,255,0.08); }
      .btn-purple { background: linear-gradient(135deg, #6c5ce7, #8b78f6); color: #fff; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer; font-weight: 600; font-size: 13px; }
      .btn-purple:disabled { opacity: 0.4; cursor: not-allowed; }
      
      .sidebar-panel { background: #111326; border-radius: 14px; padding: 16px; border: 1px solid rgba(255,255,255,0.08); }
      .episodes-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-top: 12px; max-height: 280px; overflow-y: auto; }
      .ep-btn { background: rgba(255,255,255,0.06); color: #fff; border: 1px solid rgba(255,255,255,0.08); padding: 10px; border-radius: 8px; cursor: pointer; text-align: center; }
      .ep-btn.active { background: #6c5ce7; border-color: #ff3b70; font-weight: bold; }
      
      /* Conditional elements toggles */
      .hidden { display: none !important; }
    `;
    document.head.appendChild(style);
  }

  renderLayout() {
    const isDesktop = window.innerWidth >= 992;
    
    this.container.innerHTML = `
      <div class="player-app-wrapper">
        <div class="player-container">
          
          <!-- MAIN PLAYER COLUMN -->
          <div class="main-player-col">
            <div class="video-screen-box">
              <video id="mainVideoPlayer" src="${this.episodeData.videoSources.qualities[0].src}"></video>
            </div>

            <!-- Player Controls -->
            <div class="player-controls-bar">
              <button id="btnPrevEp" class="btn-purple" ${!this.flags.hasPreviousEpisode ? 'disabled' : ''}>← Previous</button>
              <span>${this.episodeData.title}</span>
              <button id="btnNextEp" class="btn-purple" ${!this.flags.hasNextEpisode ? 'disabled' : ''}>Next →</button>
            </div>

            <!-- Audio & Settings bar -->
            <div class="player-controls-bar" style="margin-top: 8px;">
              <div class="audio-toggles">
                <button class="btn-purple">SUB</button>
                <button class="btn-purple ${!this.flags.showAudioDub ? 'hidden' : ''}">DUB</button>
              </div>
              <div>
                <button id="btnCC" class="btn-purple ${!this.flags.showSubtitlesCC ? 'hidden' : ''}">CC</button>
                <button id="btnDownload" class="btn-purple ${!this.flags.showDownloadOption ? 'hidden' : ''}">Download</button>
              </div>
            </div>

            <!-- Anime Info Section -->
            <div class="sidebar-panel" style="margin-top: 16px;">
              <h2>${this.animeData.title} - ${this.seasonId.toUpperCase()} ${this.episodeData.title}</h2>
              <p style="color: #8e95a5; font-size: 13px; margin-top: 8px;">${this.episodeData.description}</p>
            </div>
          </div>

          <!-- SIDEBAR COLUMN (Desktop or Stacked Mobile) -->
          <div class="sidebar-col">
            <div class="sidebar-panel">
              <!-- Conditional Season Switcher (PDF Spec 5) -->
              <div class="${!this.flags.showSeasonSwitcher ? 'hidden' : ''}">
                <label>Select Season:</label>
                <select id="seasonSelectDropdown" style="width: 100%; padding: 8px; margin-top: 6px; background: rgba(255,255,255,0.06); color: #fff; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
                  ${fetchSeasonCatalogByAnime(this.animeId).map(s => `
                    <option value="${s.seasonId}" ${s.seasonId === this.seasonId ? 'selected' : ''}>${s.seasonName}</option>
                  `).join('')}
                </select>
              </div>

              <!-- Conditional Episode List (PDF Spec 5) -->
              <div class="${!this.flags.showEpisodeListButton ? 'hidden' : ''}" style="margin-top: 16px;">
                <h3>Episodes</h3>
                <div class="episodes-grid">
                  ${fetchEpisodesBySeasonId(this.animeId, this.seasonId).map(ep => `
                    <button class="ep-btn ${ep.episodeId === this.episodeId ? 'active' : ''}" data-epid="${ep.episodeId}">
                      ${ep.episodeNumber}
                    </button>
                  `).join('')}
                </div>
              </div>

              <!-- Quick Info Widget -->
              <div style="margin-top: 20px; font-size: 12px; color: #8e95a5;">
                <p>Status: <strong style="color: #fff;">${this.animeData.status}</strong></p>
                <p>Type: <strong style="color: #fff;">${this.animeData.type}</strong></p>
                <p>Duration: <strong style="color: #fff;">${this.animeData.duration}</strong></p>
              </div>
            </div>
          </div>

        </div>
      </div>
    `;
  }

  bindEvents() {
    const video = document.getElementById("mainVideoPlayer");

    // Continuously Save Watch Progress (PDF Section 8)
    if (video) {
      video.addEventListener("timeupdate", () => {
        if (video.currentTime > 0) {
          VideoPlayerStorageEngine.savePlaybackProgress(
            this.animeId, 
            this.seasonId, 
            this.episodeId, 
            video.currentTime, 
            video.duration
          );
        }
      });

      // Auto-Next Logic (PDF Section 8)
      video.addEventListener("ended", () => {
        if (this.userSettings.autoNext && this.flags.hasNextEpisode) {
          window.location.href = `/watch/${this.animeId}/${this.seasonId}/${this.flags.nextEpisodeId}`;
        }
      });
    }

    // Download Route Redirection (PDF Section 9)
    const btnDownload = document.getElementById("btnDownload");
    if (btnDownload) {
      btnDownload.addEventListener("click", () => {
        window.location.href = `/download/${this.animeId}/${this.seasonId}/${this.episodeId}`;
      });
    }

    // Previous / Next Episode Navigation
    const btnPrev = document.getElementById("btnPrevEp");
    if (btnPrev && this.flags.hasPreviousEpisode) {
      btnPrev.addEventListener("click", () => {
        window.location.href = `/watch/${this.animeId}/${this.seasonId}/${this.flags.prevEpisodeId}`;
      });
    }

    const btnNext = document.getElementById("btnNextEp");
    if (btnNext && this.flags.hasNextEpisode) {
      btnNext.addEventListener("click", () => {
        window.location.href = `/watch/${this.animeId}/${this.seasonId}/${this.flags.nextEpisodeId}`;
      });
    }
  }

  restoreProgress() {
    const saved = VideoPlayerStorageEngine.getPlaybackProgress(this.animeId, this.seasonId, this.episodeId);
    const video = document.getElementById("mainVideoPlayer");
    if (saved && video) {
      video.currentTime = saved.lastPosition || 0;
    }
  }

  renderErrorState(message) {
    this.container.innerHTML = `
      <div style="padding: 40px; text-align: center; color: #ff3b70;">
        <h2>Error Loading Media</h2>
        <p>${message}</p>
        <a href="/" style="color: #6c5ce7; text-decoration: underline; margin-top: 10px; display: inline-block;">Return to Home</a>
      </div>
    `;
  }
}
