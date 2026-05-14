import { writable } from 'svelte/store';
import type { Variety } from '$lib/engine/varieties.js';
import type { Focus, Season } from '$lib/engine/focus.js';
import { DEFAULT_VARIETY, findVariety } from '$lib/engine/varieties.js';
import { DEFAULT_FOCUS, findFocus } from '$lib/engine/focus.js';
import type { CalcinitSource, FeSource, MgSource } from '$lib/engine/types.js';

export interface UserSettings {
  variety: Variety;
  focus: Focus;
  season: Season;
  calcinit: CalcinitSource;
  feSource: FeSource;
  mgSource: MgSource;
}

const STORAGE_KEY = 'fino_settings';

function loadSettings(): UserSettings {
  if (typeof localStorage === 'undefined') return defaults();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults();
    const s = JSON.parse(raw);
    return {
      variety:  findVariety(s.variety ?? 'seolhyang'),
      focus:    findFocus(s.focus ?? 'balanced'),
      season:   (s.season === 'winter' ? 'winter' : 'summer') as Season,
      calcinit: s.calcinit ?? 'agrogold155',
      feSource: s.feSource ?? 'feEddha',
      mgSource: s.mgSource ?? 'mgso4',
    };
  } catch { return defaults(); }
}

function defaults(): UserSettings {
  return {
    variety:  DEFAULT_VARIETY,
    focus:    DEFAULT_FOCUS,
    season:   'summer',
    calcinit: 'agrogold155',
    feSource: 'feEddha',
    mgSource: 'mgso4',
  };
}

export const settings = writable<UserSettings>(defaults());

// Persist on change (browser only)
if (typeof localStorage !== 'undefined') {
  settings.set(loadSettings());
  settings.subscribe(s => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      variety:  s.variety.id,
      focus:    s.focus.id,
      season:   s.season,
      calcinit: s.calcinit,
      feSource: s.feSource,
      mgSource: s.mgSource,
    }));
  });
}
