/**
 * Puzzle/Piece Transformer for v2012 API
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
 * Transform piece to v2012 format
 */
function transformPiece(piece) {
  return {
    id: piece.id,
    x: piece.x || 0,
    y: piece.y || 0,
    width: piece.width || 1,
    height: piece.height || 1,
    file: piece.file ? `/Files/${piece.file}` : null,
    version: piece.version || 1,
    date: piece.date ? Math.floor(new Date(piece.date).getTime() / 1000) : 0,
    order: piece.order || 0
  };
}

/**
 * Transform puzzles with nested pieces to v2012 format
 * @param {Array} puzzles - Puzzle records with localized name
 * @param {Array} pieces - Piece records
 * @returns {Array} Transformed puzzles with nested pieces
 */
function transformPuzzles(puzzles, pieces) {
  const piecesByPuzzle = groupBy(pieces, 'puzzle_id');

  return puzzles.map(puzzle => ({
    id: puzzle.id,
    name: puzzle.name || '',
    width: puzzle.width || 3,
    height: puzzle.height || 3,
    order: puzzle.order || 0,
    pieces: (piecesByPuzzle[puzzle.id] || [])
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(transformPiece)
  }));
}

module.exports = {
  transformPuzzles,
  transformPiece
};
