/**
 * Quest Board — API Types (JSDoc typedefs)
 * These are display-only type hints; the backend is authoritative.
 */

/**
 * @typedef {Object} HealthResponse
 * @property {string} status
 * @property {string} timestamp
 */

/**
 * @typedef {Object} TileEffect
 * @property {string} type - 'checkpoint'|'question'|'encounter'|'treasure'|'portal'|'final_checkpoint'
 * @property {number} tileNumber
 * @property {string} [difficulty]
 * @property {boolean} [pendingAnswer]
 * @property {number} [subRoll]
 * @property {string} [encounterType]
 * @property {number} [scoreDelta]
 * @property {number} [moveDelta]
 * @property {string} [direction]
 */

/**
 * @typedef {Object} MoveResponse
 * @property {string} runId
 * @property {number} roll
 * @property {number} newPosition
 * @property {number} previousTile
 * @property {TileEffect} effect
 * @property {number} currentScore
 * @property {boolean} [promptAnswer]
 * @property {string} [difficulty]
 * @property {number} [tileNumber]
 * @property {boolean} [portalApplied]
 */

/**
 * @typedef {Object} PlayerState
 * @property {string} runId
 * @property {string} playerName
 * @property {number} currentTile
 * @property {number} score
 * @property {string} status
 * @property {number[]} revealedTiles
 * @property {string} startedAt
 * @property {string} lastMoveAt
 * @property {string|null} pendingDifficulty
 * @property {number|null} pendingTile
 */

/**
 * @typedef {Object} AnswerResponse
 * @property {string} outcome - 'win'|'correct'|'wrong'
 * @property {string} [message]
 * @property {number} [finalScore]
 * @property {number} [scoreDelta]
 * @property {number} [newScore]
 * @property {number} [currentTile]
 * @property {number} [moveBack]
 * @property {number} [bonusForward]
 */

/**
 * @typedef {Object} LeaderboardEntry
 * @property {number} rank
 * @property {string} playerName
 * @property {number} score
 * @property {number} tileReached
 * @property {string} status
 * @property {string} completedAt
 * @property {string} startedAt
 */

/**
 * @typedef {Object} LeaderboardResponse
 * @property {LeaderboardEntry[]} leaderboard
 */

/**
 * @typedef {Object} AdminBoardTile
 * @property {number} tile
 * @property {string} type
 */

/**
 * @typedef {Object} AdminPlayerState
 * @property {string} runId
 * @property {string} playerName
 * @property {number} currentTile
 * @property {number} score
 * @property {string} status
 * @property {number[]} revealedTiles
 * @property {string} startedAt
 * @property {string} lastMoveAt
 * @property {string|null} completedAt
 */

/**
 * @typedef {Object} AdminDashboardResponse
 * @property {AdminBoardTile[]} boardLayout
 * @property {AdminPlayerState[]} players
 * @property {number} totalPlayers
 * @property {number} activePlayers
 */

/**
 * @typedef {Object} ForceEndResponse
 * @property {string} message
 * @property {number} forceEndedCount
 */
