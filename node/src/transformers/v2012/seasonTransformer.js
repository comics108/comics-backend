/**
 * Season/Episode Transformer for v2012 API
 * Transforms database records to mobile app format
 */

/**
 * Group array by key
 */
function groupBy(array, key) {
  return array.reduce((acc, item) => {
    const k = item[key];
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {});
}

/**
 * Transform episode to v2012 format
 */
function transformEpisode(episode) {
  return {
    id: episode.id,
    name: episode.name || '',
    image: episode.image ? `/Files/${episode.image}` : null,
    file: episode.file ? `/Files/${episode.file}` : null,
    version: episode.version || 1,
    product: episode.product || null,
    date: episode.date ? Math.floor(new Date(episode.date).getTime() / 1000) : 0,
    order: episode.order || 0
  };
}

/**
 * Transform seasons with nested episodes to v2012 format
 * @param {Array} seasons - Season records with localized name
 * @param {Array} episodes - Episode records with localized name
 * @returns {Array} Transformed seasons with nested episodes
 */
function transformSeasons(seasons, episodes) {
  const episodesBySeason = groupBy(episodes, 'season_id');

  return seasons.map(season => ({
    id: season.id,
    order: season.order || 0,
    name: season.name || '',
    image: season.image ? `/Files/${season.image}` : null,
    product: season.product || null,
    episodes: (episodesBySeason[season.id] || [])
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(transformEpisode)
  }));
}

module.exports = {
  transformSeasons,
  transformEpisode
};
