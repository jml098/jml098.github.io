import { defineStore } from 'pinia';
import { ITEMS } from '../data/items';

interface InventorySlot {
  itemId: string;
  quantity: number;
}

interface Equipment {
  weapon: string | null;
  armor: string | null;
  accessory1: string | null;
  accessory2: string | null;
}

interface PlayerState {
  health: number;
  baseMaxHealth: number;
  baseDamage: number;
  armor: number;
  gold: number;
  level: number;
  experience: number;
  inventory: InventorySlot[];
  equipment: Equipment;
}

export const usePlayerStore = defineStore('player', {
  state: (): PlayerState => ({
    health: 100,
    baseMaxHealth: 100,
    baseDamage: 10,
    armor: 0,
    gold: 100,
    level: 1,
    experience: 0,
    inventory: [],
    equipment: {
      weapon: null,
      armor: null,
      accessory1: null,
      accessory2: null
    }
  }),

  actions: {
    addItem(itemId: string, quantity: number = 1) {
      const existingSlot = this.inventory.find(slot => slot.itemId === itemId);
      if (existingSlot) {
        existingSlot.quantity += quantity;
      } else {
        this.inventory.push({ itemId, quantity });
      }
    },

    removeItem(itemId: string, quantity: number = 1) {
      const existingSlot = this.inventory.find(slot => slot.itemId === itemId);
      if (existingSlot) {
        existingSlot.quantity -= quantity;
        if (existingSlot.quantity <= 0) {
          this.inventory = this.inventory.filter(slot => slot.itemId !== itemId);
        }
      }
    },

    addGold(amount: number) {
      this.gold += amount;
    },

    removeGold(amount: number) {
      if (this.gold >= amount) {
        this.gold -= amount;
        return true;
      }
      return false;
    },

    takeDamage(amount: number) {
      const actualDamage = Math.floor(amount * (100 / (100 + this.armor)))
      this.health = Math.max(0, this.health - actualDamage);
      return this.health === 0;
    },

    heal(amount: number) {
      this.health = Math.min(this.baseMaxHealth, this.health + amount);
    },

    addExperience(amount: number) {
      this.experience += amount;
      const experienceNeeded = this.level * 100;
      if (this.experience >= experienceNeeded) {
        this.levelUp();
      }
    },

    levelUp() {
      this.level += 1;
      this.experience = 0;
      this.baseMaxHealth += 20;
      this.health = this.baseMaxHealth;
      this.armor += 10;
      this.baseDamage += 5;
    },

    useItem(itemId: string) {
      const item = ITEMS.find(i => i.id === itemId);
      if (!item) return false;

      // Check if player has the item
      const slot = this.inventory.find(slot => slot.itemId === itemId);
      if (!slot || slot.quantity <= 0) return false;

      // Handle different item types
      switch (item.type) {
        case 'consumable':
          if (item.health) {
            this.heal(item.health);
          }
          this.removeItem(itemId, 1);

          return true;
        default:
          return false;
      }
    },

    equipItem(itemId: string) {
      const item = ITEMS.find(i => i.id === itemId);
      if (!item) return false;

      // Check if item is already equipped
      if (Object.values(this.equipment).includes(itemId)) {
        return false;
      }

      // Check if player has the item in inventory
      const inventorySlot = this.inventory.find(slot => slot.itemId === itemId);
      if (!inventorySlot) return false;

      // Equip based on item type
      switch (item.type) {
        case 'weapon':
          if (this.equipment.weapon) {
            this.unequipItem('weapon');
          }
          this.equipment.weapon = itemId;
          break;
        case 'armor':
          if (this.equipment.armor) {
            this.unequipItem('armor');
          }
          this.equipment.armor = itemId;
          break;
        case 'accessory':
          // For accessories, we need to handle the slot selection in the UI
          // The slot parameter is passed from the context menu
          if (!this.equipment.accessory1) {
            this.equipment.accessory1 = itemId;
          } else if (!this.equipment.accessory2) {
            this.equipment.accessory2 = itemId;
          } else {
            return false;
          }
          break;
        default:
          return false;
      }

      return true;
    },

    unequipItem(slot: keyof Equipment) {
      const itemId = this.equipment[slot];
      if (!itemId) return false;

      const item = ITEMS.find(i => i.id === itemId);
      if (!item) return false;

      // Add item back to inventory
      this.addItem(itemId, 1);
      this.equipment[slot] = null;

      return true;
    }
  },

  getters: {
    damage: (state) => state.baseDamage + (state.equipment.weapon ? ITEMS.find(i => i.id === state.equipment.weapon)?.damage || 0 : 0) + (state.equipment.armor ? ITEMS.find(i => i.id === state.equipment.armor)?.damage || 0 : 0) + (state.equipment.accessory1 ? ITEMS.find(i => i.id === state.equipment.accessory1)?.damage || 0 : 0) + (state.equipment.accessory2 ? ITEMS.find(i => i.id === state.equipment.accessory2)?.damage || 0 : 0),
    maxHealth: (state) => state.baseMaxHealth + (state.equipment.armor ? ITEMS.find(i => i.id === state.equipment.armor)?.health || 0 : 0) + (state.equipment.accessory1 ? ITEMS.find(i => i.id === state.equipment.accessory1)?.health || 0 : 0) + (state.equipment.accessory2 ? ITEMS.find(i => i.id === state.equipment.accessory2)?.health || 0 : 0),
    armor: (state) => state.armor + (state.equipment.armor ? ITEMS.find(i => i.id === state.equipment.armor)?.armor || 0 : 0) + (state.equipment.accessory1 ? ITEMS.find(i => i.id === state.equipment.accessory1)?.armor || 0 : 0) + (state.equipment.accessory2 ? ITEMS.find(i => i.id === state.equipment.accessory2)?.armor || 0 : 0),
    isDead: (state) => state.health <= 0,
    inventorySize: (state) => state.inventory.length,
    hasItem: (state) => (itemId: string) =>
      state.inventory.some(slot => slot.itemId === itemId),
    getItemQuantity: (state) => (itemId: string) =>
      state.inventory.find(slot => slot.itemId === itemId)?.quantity || 0
  }
}); 