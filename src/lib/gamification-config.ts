// Client-safe gamification config — no server imports

export const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5500, 7500];

export const LEVEL_TITLES = [
  'Novice',
  'Apprentice',
  'Scribe',
  'Scholar',
  'Chronicler',
  'Archivist',
  'Sage',
  'Luminary',
  'Oracle',
  'Master',
  'Legend',
];

export const XP_VALUES: Record<string, number> = {
  create_note: 10,
  transcribe: 15,
  ai_action: 5,
  daily_active: 20,
};

export interface AchievementDef {
  name: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS: Record<string, AchievementDef> = {
  first_note:    { name: 'First Note',      description: 'Created your first note',         icon: '📝' },
  notes_10:      { name: 'Prolific',         description: 'Created 10 notes',                icon: '📚' },
  notes_50:      { name: 'Library',          description: 'Created 50 notes',                icon: '🏛️' },
  notes_100:     { name: 'Archive',          description: 'Created 100 notes',               icon: '🗄️' },
  streak_3:      { name: 'Hat Trick',        description: '3-day writing streak',            icon: '🔥' },
  streak_7:      { name: 'Week Warrior',     description: '7-day writing streak',            icon: '⚡' },
  streak_30:     { name: 'Monthly',          description: '30-day writing streak',           icon: '🌟' },
  words_1k:      { name: 'Writer',           description: 'Wrote 1,000 total words',         icon: '✍️' },
  words_10k:     { name: 'Author',           description: 'Wrote 10,000 total words',        icon: '📖' },
  words_100k:    { name: 'Novelist',         description: 'Wrote 100,000 total words',       icon: '🏆' },
  transcribe_1:  { name: 'Voice Notes',      description: 'Transcribed your first recording',icon: '🎙️' },
  transcribe_10: { name: 'Podcaster',        description: 'Transcribed 10 recordings',       icon: '🎧' },
  ai_10:         { name: 'AI Curious',       description: 'Used AI 10 times',                icon: '🤖' },
  ai_50:         { name: 'AI Power User',    description: 'Used AI 50 times',               icon: '⚡' },
  level_5:       { name: 'Leveled Up',       description: 'Reached level 5',                 icon: '🎯' },
  level_10:      { name: 'Master Scribe',    description: 'Reached level 10',                icon: '👑' },
};

export function getLevelFromXP(xp: number): number {
  let level = 1;
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
    else break;
  }
  return level;
}

export function getLevelTitle(level: number): string {
  return LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];
}

export function getXPForLevel(level: number): number {
  return LEVEL_THRESHOLDS[Math.min(level, LEVEL_THRESHOLDS.length - 1)] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
}
