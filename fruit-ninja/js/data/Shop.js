/**
 * Shop.js
 * Cosmetic blade-skin catalogue + purchase/equip logic. Skins are purely visual
 * (no pay-to-win) — they change the colour of the blade ribbon and its glow.
 * The economy uses soft currency (coins) earned through play.
 */
export const BLADE_SKINS = [
  { id: 'classic',  name: 'Classic Steel', price: 0,    outer: '#ffffff', inner: '#cfe9ff', glow: '#9fd0ff' },
  { id: 'ember',    name: 'Ember',         price: 150,  outer: '#ffd27a', inner: '#ff6a3c', glow: '#ff7a36' },
  { id: 'toxic',    name: 'Toxic',         price: 200,  outer: '#d6ff7a', inner: '#56e000', glow: '#9bff3c' },
  { id: 'frost',    name: 'Frostbite',     price: 250,  outer: '#eafaff', inner: '#7fd4ff', glow: '#bdeaff' },
  { id: 'plasma',   name: 'Plasma',        price: 400,  outer: '#ffb3ff', inner: '#a64bff', glow: '#d36bff' },
  { id: 'gold',     name: 'Midas',         price: 750,  outer: '#fff4b0', inner: '#ffcc33', glow: '#ffd84d' },
  { id: 'rainbow',  name: 'Prismatic',     price: 1200, outer: '#ffffff', inner: '#ff5e8a', glow: '#7ad0ff', rainbow: true },
];

export class Shop {
  constructor(storage, bus) {
    this.storage = storage;
    this.bus = bus;
  }

  catalogue() {
    return BLADE_SKINS.map(s => ({
      ...s,
      owned: this.storage.data.ownedSkins.includes(s.id),
      equipped: this.storage.data.equippedSkin === s.id,
    }));
  }

  getSkin(id) { return BLADE_SKINS.find(s => s.id === id) || BLADE_SKINS[0]; }
  equippedSkin() { return this.getSkin(this.storage.data.equippedSkin); }

  buy(id) {
    const skin = this.getSkin(id);
    if (this.storage.data.ownedSkins.includes(id)) return { ok: false, reason: 'owned' };
    if (!this.storage.spendCoins(skin.price)) return { ok: false, reason: 'funds' };
    this.storage.data.ownedSkins.push(id);
    this.storage.save();
    this.bus.emit('shop:bought', skin);
    return { ok: true };
  }

  equip(id) {
    if (!this.storage.data.ownedSkins.includes(id)) return { ok: false, reason: 'locked' };
    this.storage.data.equippedSkin = id;
    this.storage.save();
    this.bus.emit('shop:equipped', this.getSkin(id));
    return { ok: true };
  }
}
