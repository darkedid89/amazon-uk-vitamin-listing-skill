/**
 * FruitTypes.js
 * Data-driven definition of every spawnable object. Adding a new fruit is a
 * pure-data change here — no system code needs to be touched (Open/Closed).
 *
 * `kind` drives behaviour: 'fruit' scores, 'bomb' fails, 'freeze' slows time,
 * 'gold' rewards. Colours are used by the procedural SpriteFactory so the game
 * ships with zero binary asset dependencies (the matching SVGs live in
 * /assets/sprites for designers who want to swap in custom art).
 */
export const FruitTypes = {
  apple:      { id: 'apple',      kind: 'fruit', label: 'Apple',      radius: 70, weight: 22, body: '#e23b3b', bodyDark: '#a31d1d', juice: '#ff6b6b', leaf: '#3fae5a', score: 10 },
  banana:     { id: 'banana',     kind: 'fruit', label: 'Banana',     radius: 74, weight: 16, body: '#f5d130', bodyDark: '#c9a213', juice: '#fff3a0', leaf: '#6b5418', score: 10, shape: 'banana' },
  watermelon: { id: 'watermelon', kind: 'fruit', label: 'Watermelon', radius: 92, weight: 14, body: '#2f9e44', bodyDark: '#1c5e2a', juice: '#ff4d6d', leaf: '#1c5e2a', score: 15, shape: 'melon' },
  orange:     { id: 'orange',     kind: 'fruit', label: 'Orange',     radius: 72, weight: 20, body: '#ff922b', bodyDark: '#cc6a10', juice: '#ffb35c', leaf: '#3fae5a', score: 10 },
  kiwi:       { id: 'kiwi',       kind: 'fruit', label: 'Kiwi',       radius: 64, weight: 14, body: '#8a6d3b', bodyDark: '#5e4a26', juice: '#a3d65c', leaf: '#3fae5a', score: 12, shape: 'kiwi' },
  strawberry: { id: 'strawberry', kind: 'fruit', label: 'Strawberry', radius: 60, weight: 14, body: '#e63950', bodyDark: '#a31d34', juice: '#ff7b93', leaf: '#3fae5a', score: 12, shape: 'strawberry' },

  bomb:       { id: 'bomb',       kind: 'bomb',  label: 'Bomb',       radius: 76, weight: 0,  body: '#23262b', bodyDark: '#000000', juice: '#ff5a36', leaf: '#ff5a36', score: 0 },
  freezebomb: { id: 'freezebomb', kind: 'freeze',label: 'Frost Bomb', radius: 76, weight: 0,  body: '#3aa0d6', bodyDark: '#1b5e86', juice: '#bdeaff', leaf: '#bdeaff', score: 0 },
  goldbomb:   { id: 'goldbomb',   kind: 'gold',  label: 'Gold Bomb',  radius: 78, weight: 0,  body: '#ffce3a', bodyDark: '#c79b10', juice: '#fff3b0', leaf: '#fff3b0', score: 50 },
};

// Pre-computed weighted pool of fruit ids for O(1) random spawns.
export const FruitWeightedPool = (() => {
  const pool = [];
  for (const t of Object.values(FruitTypes)) {
    if (t.kind !== 'fruit') continue;
    for (let i = 0; i < t.weight; i++) pool.push(t.id);
  }
  return pool;
})();

export const FruitList = Object.values(FruitTypes).filter(t => t.kind === 'fruit');
