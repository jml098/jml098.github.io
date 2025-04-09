export interface Mob {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
  damage: number;
  armor: number;
  level: number;
  experience: number;
  dropTable: DropTableEntry[];
}

export interface DropTableEntry {
  itemId: string;
  chance: number;
  minQuantity: number;
  maxQuantity: number;
}

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  description: string;
  value: number;
  stats?: ItemStats;
  effects?: ItemEffect[];
}

export interface ItemStats {
  damage?: number;
  armor?: number;
  health?: number;
}

export interface ItemEffect {
  type: EffectType;
  value: number;
  duration?: number;
}

export enum ItemType {
  MATERIAL = 'material',
  EQUIPMENT = 'equipment',
  POTION = 'potion',
}

export enum EffectType {
  HEAL = 'heal',
  DAMAGE_BOOST = 'damage_boost',
  ARMOR_BOOST = 'armor_boost',
}

export interface InventorySlot {
  itemId: string;
  quantity: number;
}

export interface Player {
  health: number;
  maxHealth: number;
  damage: number;
  armor: number;
  level: number;
  experience: number;
  gold: number;
  inventory: InventorySlot[];
}

export interface Talent {
  id: string;
  name: string;
  description: string;
  cost: number;
  maxLevel: number;
  currentLevel: number;
  effects: TalentEffect[];
}

export interface TalentEffect {
  type: TalentEffectType;
  value: number;
}

export enum TalentEffectType {
  DAMAGE = 'damage',
  HEALTH = 'health',
  ARMOR = 'armor',
  CRIT_CHANCE = 'crit_chance',
  CRIT_DAMAGE = 'crit_damage',
} 