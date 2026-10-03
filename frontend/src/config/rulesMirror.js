/**
 * Quest Board — Rules Mirror
 * Display-only constants mirroring the backend's game config.
 * These are used ONLY for UI display (e.g. question stakes).
 * The server remains the single source of truth for all game logic.
 */

/** Display-only score stakes per difficulty */
export const QUESTION_STAKES = {
  easy:   { correct: '+100', wrong: '−50',  label: 'Easy' },
  medium: { correct: '+200', wrong: '−100', label: 'Medium' },
  hard:   { correct: '+350', wrong: '−150', label: 'Hard' },
  final:  { correct: 'Win!', wrong: 'No penalty', label: 'Final Trial' },
};

/** Board size constant — display only */
export const BOARD_SIZE = 30;

/** Tile type labels and icons for UI display */
export const TILE_TYPE_META = {
  start:            { label: 'Start',       icon: 'Flag' },
  question:         { label: 'Question',    icon: 'HelpCircle' },
  encounter:        { label: 'Encounter',   icon: 'Swords' },
  treasure:         { label: 'Treasure',    icon: 'Gem' },
  portal:           { label: 'Portal',      icon: 'Sparkles' },
  checkpoint:       { label: 'Checkpoint',  icon: 'Shield' },
  final_checkpoint: { label: 'Final Trial', icon: 'Crown' },
};

/** Encounter type display labels */
export const ENCOUNTER_LABELS = {
  trap:           'Trap! Lost points.',
  nothing:        'Nothing happened.',
  minor_blessing: 'A minor blessing!',
  move_back:      'Forced back!',
  move_forward:   'Pushed forward!',
};
