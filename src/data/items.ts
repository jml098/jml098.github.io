export type ItemType = 'weapon' | 'armor' | 'accessory' | 'consumable' | 'material';

export interface Item {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  value: number;
  damage?: number;
  armor?: number;
  health?: number;
}

export const ITEMS: Item[] = [
  {
    id: 'slime_jelly',
    name: 'Slime Jelly',
    description: 'A sticky, gooey substance from a slime.',
    type: 'material',
    value: 5
  },
  {
    id: 'goblin_ear',
    name: 'Goblin Ear',
    description: 'A trophy from defeating a goblin.',
    type: 'material',
    value: 10
  },
  {
    id: 'health_potion',
    name: 'Health Potion',
    description: 'Restores 50 health.',
    type: 'consumable',
    health: 50,
    value: 15
  },
  {
    id: 'rusty_sword',
    name: 'Rusty Sword',
    description: 'A basic sword that has seen better days.',
    type: 'weapon',
    value: 25,
    damage: 3
  },
  {
    id: 'iron_sword',
    name: 'Iron Sword',
    description: 'A basic iron sword',
    type: 'weapon',
    value: 50,
    damage: 5
  },
  {
    id: 'wooden_shield',
    name: 'Wooden Shield',
    description: 'A basic wooden shield',
    type: 'armor',
    value: 30,
    armor: 3
  },
  {
    id: 'wooden_ring',
    name: 'Wooden Ring',
    description: 'A ring that increases health',
    type: 'accessory',
    value: 40,
    health: 20
  },
  {
    id: 'orc_tusk',
    name: 'Orc Tusk',
    description: 'A large tusk from an orc warrior, used in crafting.',
    type: 'material',
    value: 20
  },
  {
    id: 'steel_sword',
    name: 'Steel Sword',
    description: 'A well-crafted steel sword with good balance.',
    type: 'weapon',
    value: 100,
    damage: 8
  },
  {
    id: 'troll_blood',
    name: 'Troll Blood',
    description: 'A vial of thick, regenerating troll blood.',
    type: 'material',
    value: 40
  },
  {
    id: 'ogre_tooth',
    name: 'Ogre Tooth',
    description: 'A massive tooth from an ogre, highly valued by collectors.',
    type: 'material',
    value: 60
  },
  {
    id: 'ogre_club',
    name: 'Ogre Club',
    description: 'A massive club that only the strongest can wield.',
    type: 'weapon',
    value: 150,
    damage: 12
  },
  {
    id: 'dragon_scale',
    name: 'Dragon Scale',
    description: 'A shimmering scale from a dragon whelp.',
    type: 'material',
    value: 100
  },
  {
    id: 'dragon_fang',
    name: 'Dragon Fang',
    description: 'A sharp fang from a dragon whelp.',
    type: 'material',
    value: 120
  },
  {
    id: 'dragon_sword',
    name: 'Dragon Sword',
    description: 'A powerful sword forged with dragon materials.',
    type: 'weapon',
    value: 500,
    damage: 45
  },
  {
    id: 'enchanted_ring',
    name: 'Enchanted Ring',
    description: 'A ring imbued with magical properties.',
    type: 'accessory',
    value: 300,
    health: 50
  },
  {
    id: 'dragon_armor',
    name: 'Dragon Armor',
    description: 'Armor crafted from dragon scales.',
    type: 'armor',
    value: 400,
    armor: 30
  },
  {
    id: 'leather_armor',
    name: 'Leather Armor',
    description: 'Basic armor made from animal hides.',
    type: 'armor',
    value: 50,
    armor: 3
  },
  {
    id: 'chainmail_armor',
    name: 'Chainmail Armor',
    description: 'Flexible armor made of interlocking metal rings.',
    type: 'armor',
    value: 150,
    armor: 6
  },
  {
    id: 'plate_armor',
    name: 'Plate Armor',
    description: 'Heavy armor made of metal plates.',
    type: 'armor',
    value: 300,
    armor: 10
  },
  {
    id: 'ring_of_strength',
    name: 'Ring of Strength',
    description: 'Increases damage dealt.',
    type: 'accessory',
    value: 200,
    damage: 5
  },
  {
    id: 'ring_of_protection',
    name: 'Ring of Protection',
    description: 'Reduces damage taken.',
    type: 'accessory',
    value: 200,
    armor: 3
  },
  {
    id: 'ring_of_vitality',
    name: 'Ring of Vitality',
    description: 'Increases maximum health.',
    type: 'accessory',
    value: 200,
    health: 30
  },
  {
    id: 'ring_of_power',
    name: 'Ring of Power',
    description: 'A powerful ring that increases both damage and health.',
    type: 'accessory',
    value: 400,
    damage: 8,
    health: 40
  },
  {
    id: 'ring_of_guardian',
    name: 'Ring of Guardian',
    description: 'A defensive ring that increases both armor and health.',
    type: 'accessory',
    value: 400,
    armor: 5,
    health: 40
  }
]; 