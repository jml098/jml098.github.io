import type { Item } from './items';

export interface CraftingRecipe {
  id: string;
  result: string;
  materials: Record<string, number>;
}

export const CRAFTING_RECIPES: CraftingRecipe[] = [
  {
    id: 'steel_sword',
    result: 'steel_sword',
    materials: {
      'iron_sword': 1,
      'troll_blood': 2,
      'goblin_ear': 5
    }
  },
  {
    id: 'dragon_sword',
    result: 'dragon_sword',
    materials: {
      'steel_sword': 1,
      'dragon_scale': 3,
      'dragon_fang': 2,
      'ogre_tooth': 4
    }
  },
  {
    id: 'enchanted_ring',
    result: 'enchanted_ring',
    materials: {
      'wooden_ring': 1,
      'dragon_scale': 2,
      'troll_blood': 3
    }
  },
  {
    id: 'dragon_armor',
    result: 'dragon_armor',
    materials: {
      'dragon_scale': 5,
      'dragon_fang': 3,
      'ogre_tooth': 2
    }
  },
  {
    id: 'leather_armor',
    result: 'leather_armor',
    materials: {
      'slime_jelly': 10,
      'goblin_ear': 5
    }
  },
  {
    id: 'chainmail_armor',
    result: 'chainmail_armor',
    materials: {
      'iron_sword': 2,
      'troll_blood': 3,
      'goblin_ear': 8
    }
  },
  {
    id: 'plate_armor',
    result: 'plate_armor',
    materials: {
      'steel_sword': 2,
      'troll_blood': 5,
      'ogre_tooth': 3
    }
  },
  {
    id: 'ring_of_strength',
    result: 'ring_of_strength',
    materials: {
      'goblin_ear': 8,
      'troll_blood': 2
    }
  },
  {
    id: 'ring_of_protection',
    result: 'ring_of_protection',
    materials: {
      'slime_jelly': 15,
      'troll_blood': 2
    }
  },
  {
    id: 'ring_of_vitality',
    result: 'ring_of_vitality',
    materials: {
      'slime_jelly': 10,
      'goblin_ear': 5,
      'troll_blood': 3
    }
  },
  {
    id: 'ring_of_power',
    result: 'ring_of_power',
    materials: {
      'dragon_scale': 2,
      'dragon_fang': 1,
      'ogre_tooth': 3
    }
  },
  {
    id: 'ring_of_guardian',
    result: 'ring_of_guardian',
    materials: {
      'dragon_scale': 3,
      'troll_blood': 5,
      'ogre_tooth': 2
    }
  }
]; 