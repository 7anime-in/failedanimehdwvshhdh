/**
 * 7Anime - Dynamic Video Player Logic Engine
 * Compliant with 7Anime_Player_UI_Logic_Specification.pdf
 */

// Isolated Player Database (Extends Schema without modifying home page data)
const VIDEO_PLAYER_DATABASE = [
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

// Data Retrieval Helpers
function fetchAnimeMetadataById(animeId) {
  return VIDEO_PLAYER_DATABASE.find(item => item.id === animeId) || null;
}

function fetchSeasonCatalogByAnime(animeId) {
  const anime = fetchAnimeMetadataById(animeId);
  return anime && anime.seasons ? anime.seasons : [];
}

function fetchEpisodesBySeasonId(animeId, seasonId) {
  const seasons = fetchSeasonCatalogByAnime(animeId);
  const matchedSeason = seasons.find(s => s.seasonId === seasonId);
  return matchedSeason && matchedSeason.episodes ? matchedSeason.episodes : [];
}

function getDetailedEpisodeData(animeId, seasonId, episodeId) {
  const episodeList = fetchEpisodesBySeasonId(animeId, seasonId);
  return episodeList.find(ep => ep.episodeId === episodeId) || null;
}

/**
 * Conditional UI Rules Engine (PDF Section 5)
 */
function evaluatePlayerUIStateFlags(animeId, seasonId, episodeId) {
  const anime = fetchAnimeMetadataById(animeId);
  const seasons = fetchSeasonCatalogByAnime(animeId);
  const episodes = fetchEpisodesBySeasonId(animeId, seasonId);
  const currentEp = getDetailedEpisodeData(animeId, seasonId, episodeId);

  if (!anime || !currentEp) {
    return { isDataValid: false };
  }

  const epIndex = episodes.findIndex(e => e.episodeId === episodeId);

  return {
    isDataValid: true,
    // Conditional Visibility Flags
    showSeasonSwitcher: seasons.length > 1,               // Hide if only 1 season
    showEpisodeListButton: episodes.length > 0,           // Hide if 0 episodes
    showQualitySelector: currentEp.videoSources.qualities.length > 1,
    showSubtitlesCC: currentEp.availableSubtitles && currentEp.availableSubtitles.length > 0,
    showAudioDub: currentEp.availableAudio.includes("DUB"),
    showDownloadOption: currentEp.videoSources.qualities.some(q => q.downloadUrl),

    // Navigation Flags
    hasPreviousEpisode: epIndex > 0,
    hasNextEpisode: epIndex !== -1 && epIndex < episodes.length - 1,
    prevEpisodeId: epIndex > 0 ? episodes[epIndex - 1].episodeId : null,
    nextEpisodeId: (epIndex !== -1 && epIndex < episodes.length - 1) ? episodes[epIndex + 1].episodeId : null
  };
}

/**
 * Dynamic Episode Ranges Generator for long series (PDF Section 6)
 */
function buildEpisodeRangeSegments(totalEpisodesCount, chunkSize = 100) {
  const segments = [];
  for (let start = 1; start <= totalEpisodesCount; start += chunkSize) {
    const end = Math.min(start + chunkSize - 1, totalEpisodesCount);
    segments.push({ label: `${start}-${end}`, start, end });
  }
  return segments;
}

// LocalStorage Engine (Progress & State Persistence - PDF Section 8)
const VideoPlayerStorageEngine = {
  savePlaybackProgress: (animeId, seasonId, episodeId, timeSeconds, durationSeconds) => {
    const key = `7anime_watch_progress_${animeId}_${seasonId}_${episodeId}`;
    const data = {
      animeId,
      seasonId,
      episodeId,
      lastPosition: timeSeconds,
      totalDuration: durationSeconds,
      watchedAt: new Date().toISOString()
    };
    localStorage.setItem(key, JSON.stringify(data));
  },

  getPlaybackProgress: (animeId, seasonId, episodeId) => {
    const key = `7anime_watch_progress_${animeId}_${seasonId}_${episodeId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },

  saveUserSettings: (settingsObj) => {
    localStorage.setItem('7anime_player_user_settings', JSON.stringify(settingsObj));
  },

  getUserSettings: () => {
    const defaults = {
      autoplay: false,
      autoNext: true,
      skipIntro: false,
      preferredQuality: "1080p",
      playbackSpeed: 1.0
    };
    const stored = localStorage.getItem('7anime_player_user_settings');
    return stored ? { ...defaults, ...JSON.parse(stored) } : defaults;
  }
};

