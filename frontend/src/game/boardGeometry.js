/**
 * Quest Board — Board Geometry
 *
 * Converts tile numbers (1-30) to grid positions on a 6×5 serpentine board.
 * Row 0 (bottom): tiles 1-6 left-to-right
 * Row 1:          tiles 12-7 right-to-left
 * Row 2:          tiles 13-18 left-to-right
 * Row 3:          tiles 24-19 right-to-left
 * Row 4 (top):    tiles 25-30 left-to-right
 */

export const COLS = 6;
export const ROWS = 5;

/**
 * Convert a 1-indexed tile number to { row, col } grid coordinates.
 * Row 0 is the bottom row on screen.
 *
 * @param {number} tile - Tile number 1-30
 * @returns {{ row: number, col: number }}
 */
export function tileToGrid(tile) {
  if (tile < 1 || tile > 30) {
    return { row: 0, col: 0 };
  }
  const index = tile - 1;             // 0-based
  const row = Math.floor(index / COLS); // 0-4
  const colInRow = index % COLS;       // 0-5

  // Even rows (0, 2, 4) go left-to-right; odd rows (1, 3) go right-to-left
  const col = row % 2 === 0 ? colInRow : COLS - 1 - colInRow;

  return { row, col };
}

/**
 * Convert grid coordinates to a tile number.
 * @param {number} row
 * @param {number} col
 * @returns {number}
 */
export function gridToTile(row, col) {
  const colInRow = row % 2 === 0 ? col : COLS - 1 - col;
  return row * COLS + colInRow + 1;
}

/**
 * Get the screen-oriented row for CSS grid placement.
 * Since row 0 is bottom on screen, we invert for CSS (where row 1 is top).
 * @param {number} tile
 * @returns {{ gridRow: number, gridCol: number }}
 */
export function tileToGridCSS(tile) {
  const { row, col } = tileToGrid(tile);
  return {
    gridRow: ROWS - row,   // Invert: bottom row → grid row 5, top → grid row 1
    gridCol: col + 1,       // CSS grid is 1-indexed
  };
}

/**
 * Get the center position of a tile as a fraction of the board dimensions.
 * Useful for positioning the player marker with transforms.
 * @param {number} tile
 * @returns {{ x: number, y: number }} - Percentages (0-100)
 */
export function tileCenterPercent(tile) {
  const { row, col } = tileToGrid(tile);
  const x = ((col + 0.5) / COLS) * 100;
  const y = ((ROWS - 1 - row + 0.5) / ROWS) * 100;  // Invert y for screen
  return { x, y };
}

/**
 * Generate the ordered list of all 30 tiles for rendering.
 * Returns tiles in visual order (top-left to bottom-right) for CSS grid.
 * @returns {number[]}
 */
export function getVisualTileOrder() {
  const tiles = [];
  for (let row = ROWS - 1; row >= 0; row--) {
    for (let col = 0; col < COLS; col++) {
      tiles.push(gridToTile(row, col));
    }
  }
  return tiles;
}
