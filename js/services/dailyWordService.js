import { DISPLAY_NAMES, RELEASE_DATE } from '../config/constants.js';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

function getUtcDate(date) {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

function getDaysSinceRelease(referenceDate = new Date()) {
  const todayUtc = getUtcDate(referenceDate);
  const releaseUtc = getUtcDate(RELEASE_DATE);
  return Math.floor((todayUtc - releaseUtc) / DAY_IN_MS);
}

export function getWordOfToday(referenceDate = new Date()) {
  const daysSinceRelease = getDaysSinceRelease(referenceDate);
  const index = ((daysSinceRelease % DISPLAY_NAMES.length) + DISPLAY_NAMES.length) % DISPLAY_NAMES.length;
  return DISPLAY_NAMES[index];
}
