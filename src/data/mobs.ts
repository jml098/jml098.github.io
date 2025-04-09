import type { Mob } from '../types/game';

export const MOBS: Mob[] = [
  {
    id: 'slime',
    name: 'Slime',
    health: 50,
    maxHealth: 50,
    damage: 5,
    armor: 0,
    level: 1,
    experience: 10,
    dropTable: [
      {
        itemId: 'slime_jelly',
        chance: 0.8,
        minQuantity: 1,
        maxQuantity: 3
      },
      {
        itemId: 'health_potion',
        chance: 0.2,
        minQuantity: 1,
        maxQuantity: 1
      }
    ]
  },
  {
    id: 'goblin',
    name: 'Goblin',
    health: 100,
    maxHealth: 100,
    damage: 10,
    armor: 2,
    level: 2,
    experience: 30,
    dropTable: [
      {
        itemId: 'goblin_ear',
        chance: 0.7,
        minQuantity: 1,
        maxQuantity: 2
      },
      {
        itemId: 'rusty_sword',
        chance: 0.3,
        minQuantity: 1,
        maxQuantity: 1
      },
      {
        itemId: 'health_potion',
        chance: 0.5,
        minQuantity: 1,
        maxQuantity: 3
      }
    ]
  },
  {
    id: 'orc_warrior',
    name: 'Orc Warrior',
    health: 200,
    maxHealth: 200,
    damage: 20,
    armor: 5,
    level: 3,
    experience: 80,
    dropTable: [
      {
        itemId: 'orc_tusk',
        chance: 0.8,
        minQuantity: 1,
        maxQuantity: 2
      },
      {
        itemId: 'iron_sword',
        chance: 0.4,
        minQuantity: 1,
        maxQuantity: 1
      },
      {
        itemId: 'health_potion',
        chance: 0.5,
        minQuantity: 1,
        maxQuantity: 2
      }
    ]
  },
  {
    id: 'troll',
    name: 'Troll',
    health: 400,
    maxHealth: 400,
    damage: 35,
    armor: 8,
    level: 4,
    experience: 200,
    dropTable: [
      {
        itemId: 'troll_blood',
        chance: 0.9,
        minQuantity: 1,
        maxQuantity: 3
      },
      {
        itemId: 'steel_sword',
        chance: 0.3,
        minQuantity: 1,
        maxQuantity: 1
      },
      {
        itemId: 'health_potion',
        chance: 0.6,
        minQuantity: 2,
        maxQuantity: 3
      }
    ]
  },
  {
    id: 'ogre',
    name: 'Ogre',
    health: 800,
    maxHealth: 800,
    damage: 60,
    armor: 12,
    level: 5,
    experience: 500,
    dropTable: [
      {
        itemId: 'ogre_tooth',
        chance: 0.9,
        minQuantity: 2,
        maxQuantity: 4
      },
      {
        itemId: 'ogre_club',
        chance: 0.4,
        minQuantity: 1,
        maxQuantity: 1
      },
      {
        itemId: 'health_potion',
        chance: 0.7,
        minQuantity: 3,
        maxQuantity: 5
      }
    ]
  },
  {
    id: 'dragon_whelp',
    name: 'Dragon Whelp',
    health: 1500,
    maxHealth: 1500,
    damage: 100,
    armor: 15,
    level: 6,
    experience: 1000,
    dropTable: [
      {
        itemId: 'dragon_scale',
        chance: 0.9,
        minQuantity: 3,
        maxQuantity: 5
      },
      {
        itemId: 'dragon_fang',
        chance: 0.5,
        minQuantity: 1,
        maxQuantity: 2
      },
      {
        itemId: 'health_potion',
        chance: 0.8,
        minQuantity: 4,
        maxQuantity: 6
      }
    ]
  }
]; 