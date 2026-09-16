/**
 * 7Anime - Player UI & Specification Logic Engine
 * Compatible with 7Anime_home_page_code.pdf and 7Anime_Player_UI_Logic_Specification.pdf
 */

// ==========================================
// 1. EXTENDED ANIME DATABASE (Player Spec Compliant)
// ==========================================
// Existing ANIME_DATABASE structure is extended safely without breaking home page structures
const PLAYER_ANIME_DATABASE = [
  {
    id: "solo-leveling",
    title: "Solo Leveling",
    type: "TV Series",
    status: "Ongoing",
    rating: "8.7",
    rank: 1,
    genres: ["Action", "Fantasy", "Sci-Fi"],
    duration: "24 min",
    releaseYear: "2024",
    studio: "A-1 Pictures",
    image: "assets/images/solo-leveling-cover.jpg",
    description: "Sung Jin-Woo continues his journey to become the strongest hunter in a world full of monsters and hidden secrets.",
    
    // Dynamic Season & Episode Structure
    seasons: [
      {
        seasonId: "s1",
        seasonName: "Season 1",
        episodesCount: 12,
        episodes: [
          {
            episodeId: "ep1",
            episodeNumber: 1,
            title: "I'm Used to It",
            description: "Sung Jin-Woo enters a low-rank dungeon with his party, unaware of the hidden danger.",
            duration: "24:18",
            thumbnail: "assets/images/episodes/s1_ep1.jpg",
            videoSources: {
              defaultQuality: "1080p",
              qualities: [
                { quality: "1080p", src: "https://cdn.example.com/videos/solo-leveling/s1/ep1/1080p.mp4", downloadUrl: "/download/solo-leveling/s1/ep1?q=1080p" },
                { quality: "720p", src: "https://cdn.example.com/videos/solo-leveling/s1/ep1/720p.mp4", downloadUrl: "/download/solo-leveling/s1/ep1?q=720p" }
              ]
            },
            availableAudio: ["SUB", "DUB"],
            availableSubtitles: [
              { label: "English", code: "en", src: "https://cdn.example.com/subs/s1/ep1_en.vtt" },
              { label: "Hindi", code: "hi", src: "https://cdn.example.com/subs/s1/ep1_hi.vtt" }
            ],
            introStart: 90,
            introEnd: 180,
            outroStart: 1350,
            outroEnd: 1440
          }
        ]
      },
      {
        seasonId: "s2",
        seasonName: "Season 2",
        episodesCount: 25,
        episodes: [
          {
            episodeId: "ep7",
            episodeNumber: 7,
            title: "Episode 7",
            description: "Sung Jin-Woo continues his journey to become the strongest hunter in a world full of monsters and hidden secrets.",
            duration: "24:18",
            thumbnail: "assets/images/episodes/s2_ep7.jpg",
            videoSources: {
              defaultQuality: "1080p",
              qualities: [
                { quality: "1080p", src: "https://cdn.example.com/videos/solo-leveling/s2/ep7/1080p.mp4", downloadUrl: "/download/solo-leveling/s2/ep7?q=1080p" },
                { quality: "720p", src: "https://cdn.example.com/videos/solo-leveling/s2/ep7/720p.mp4", downloadUrl: "/download/solo-leveling/s2/ep7?q=720p" }
              ]
            },
            availableAudio: ["SUB", "DUB"],
            availableSubtitles: [
              { label: "English", code: "en", src: "https://cdn.example.com/subs/s2/ep7_en.vtt" },
              { label: "Hindi", code: "hi", src: "https://cdn.example.com/subs/s2/ep7_hi.vtt" },
              { label: "Japanese", code: "ja", src: "https://cdn.example.com/subs/s2/ep7_ja.vtt" }
            ],
            introStart: 85,
            introEnd: 175,
            outroStart: 1360,
            outroEnd: 1440
          }
        ]
      },
      {
        seasonId: "specials",
        seasonName: "Specials",
        episodesCount: 1,
        episodes: [
          {
            episodeId: "sp1",
            episodeNumber: 1,
            title: "Recap Special",
            description: "Special summary episode.",
            duration: "23:00",
            thumbnail: "assets/images/episodes/sp1.jpg",
            videoSources: {
              defaultQuality: "1080p",
              qualities: [
                { quality: "1080p", src: "https://cdn.example.com/videos/solo-leveling/sp1/1080p.mp4", downloadUrl: "/download/solo-leveling/specials/sp1?q=1080p" }
              ]
            },
            availableAudio: ["SUB"],
            availableSubtitles: [
              { label: "English", code: "en", src: "https://cdn.example.com/subs/sp1_en.vtt" }
            ],
            introStart: 0,
            introEnd: 0,
            outroStart: 1300,
            outroEnd: 1380
          }
        ]
      }
    ]
  }
];

// Dynamic Genre Generator (Unique Function Name)
function buildDynamicGenresCatalog(database) {
  const map = {};
  database.forEach(item => {
    if (item.genres && Array.isArray(item.genres)) {
      item.genres.forEach(g => {
        map[g] = (map[g] || 0) + 1;
      });
    }
  });
  return Object.keys(map).map(name => ({
    name: name,
    count: `${map[name]} titles`
  }));
}

const PLAYER_GENRES_CATALOG = buildDynamicGenresCatalog(PLAYER_ANIME_DATABASE);

// ==========================================
// 2. RETRIEVAL API / UNIQUE HELPER FUNCTIONS
// ==========================================

function getAnimeMetadataById(animeId) {
  return PLAYER_ANIME_DATABASE.find(item => item.id === animeId) || null;
}

function fetchSeasonListForAnime(animeId) {
  const anime = getAnimeMetadataById(animeId);
  return anime && anime.seasons ? anime.seasons : [];
}

function fetchEpisodesListBySeason(animeId, seasonId) {
  const seasons = fetchSeasonListForAnime(animeId);
  const matchedSeason = seasons.find(s => s.seasonId === seasonId);
  return matchedSeason && matchedSeason.episodes ? matchedSeason.episodes : [];
}

function getDetailedEpisodeInfo(animeId, seasonId, episodeId) {
  const episodeList = fetchEpisodesListBySeason(animeId, seasonId);
  return episodeList.find(ep => ep.episodeId === episodeId) || null;
}

/**
 * PDF Section 5: Conditional UI Logic Calculator (Unique Function Name)
 */
function calculatePlayerUIStateFlags(animeId, seasonId, episodeId) {
  const anime = getAnimeMetadataById(animeId);
  const seasons = fetchSeasonListForAnime(animeId);
  const episodes = fetchEpisodesListBySeason(animeId, seasonId);
  const currentEp = getDetailedEpisodeInfo(animeId, seasonId, episodeId);

  if (!anime || !currentEp) {
    return { isMediaAvailable: false };
  }

  const epIndex = episodes.findIndex(e => e.episodeId === episodeId);

  return {
    isMediaAvailable: true,
    // Conditional Visibility Flags
    showSeasonSwitcher: seasons.length > 1,               // PDF Rule: >1 season then show
    showEpisodeListButton: episodes.length > 0,           // PDF Rule: >0 episode then show
    showQualitySelector: currentEp.videoSources.qualities.length > 1,
    showSubtitlesCC: currentEp.availableSubtitles && currentEp.availableSubtitles.length > 0,
    showAudioDub: currentEp.availableAudio.includes("DUB"),
    showDownloadLink: currentEp.videoSources.qualities.some(q => q.downloadUrl),

    // Navigation Bounds
    hasPreviousEpisode: epIndex > 0,
    hasNextEpisode: epIndex !== -1 && epIndex < episodes.length - 1,
    prevEpId: epIndex > 0 ? episodes[epIndex - 1].episodeId : null,
    nextEpId: (epIndex !== -1 && epIndex < episodes.length - 1) ? episodes[epIndex + 1].episodeId : null
  };
}

/**
 * Dynamic Episode Ranges Generator for long series (PDF Section 6)
 */
function generateEpisodeRangeChunks(totalEpisodesCount, chunkSize = 100) {
  const chunks = [];
  for (let start = 1; start <= totalEpisodesCount; start += chunkSize) {
    const end = Math.min(start + chunkSize - 1, totalEpisodesCount);
    chunks.push({ rangeLabel: `${start}-${end}`, start, end });
  }
  return chunks;
}

// ==========================================
// 3. SEPARATE WATCH POSITION & SETTINGS ENGINE
// ==========================================
const PlayerProgressStorageManager = {
  // Saves distinct progress key per anime + season + episode (PDF Section 8)
  writeWatchTime: (animeId, seasonId, episodeId, timeSeconds, durationSeconds) => {
    const storageKey = `7anime_progress_${animeId}_${seasonId}_${episodeId}`;
    const payload = {
      animeId,
      seasonId,
      episodeId,
      lastPosition: timeSeconds,
      totalDuration: durationSeconds,
      watchedAt: new Date().toISOString()
    };
    localStorage.setItem(storageKey, JSON.stringify(payload));
  },

  readWatchTime: (animeId, seasonId, episodeId) => {
    const storageKey = `7anime_progress_${animeId}_${seasonId}_${episodeId}`;
    const rawData = localStorage.getItem(storageKey);
    return rawData ? JSON.parse(rawData) : null;
  },

  writePlayerConfig: (configObj) => {
    localStorage.setItem('7anime_user_preferences', JSON.stringify(configObj));
  },

  readPlayerConfig: () => {
    const defaults = {
      autoplay: false,
      autoNext: true,
      skipIntro: false,
      preferredQuality: "1080p",
      playbackSpeed: 1.0
    };
    const stored = localStorage.getItem('7anime_user_preferences');
    return stored ? { ...defaults, ...JSON.parse(stored) } : defaults;
  }
};
