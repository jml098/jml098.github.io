import { defineStore } from 'pinia';
import type { Mob } from '../types/game';
import { MOBS } from '../data/mobs';
import { usePlayerStore } from './player';

export const useMobStore = defineStore('mob', {
  state: () => ({
    currentMob: null as Mob | null,
    selectedMobId: 'slime' as string
  }),

  actions: {
    selectMob(mobId: string) {
      this.selectedMobId = mobId;
      this.spawnMob();
    },

    spawnMob() {
      const mobTemplate = MOBS.find(mob => mob.id === this.selectedMobId);
      if (mobTemplate) {
        this.currentMob = { ...mobTemplate };
      }
    },

    attackMob(damage: number) {
      if (!this.currentMob) return;

      const playerStore = usePlayerStore();
      
      // Mob takes damage
      this.currentMob.health = Math.max(0, this.currentMob.health - damage);
      
      // Player takes damage from mob
      playerStore.takeDamage(this.currentMob.damage);

      // Check if mob is dead
      if (this.currentMob.health <= 0) {
        this.handleMobDeath();
      }
    },

    handleMobDeath() {
      if (!this.currentMob) return;

      const playerStore = usePlayerStore();
      
      // Add experience
      playerStore.addExperience(this.currentMob.experience);
      
      // Drop items
      this.currentMob.dropTable.forEach(drop => {
        if (Math.random() < drop.chance) {
          const quantity = Math.floor(
            Math.random() * (drop.maxQuantity - drop.minQuantity + 1) + drop.minQuantity
          );
          playerStore.addItem(drop.itemId, quantity);
        }
      });

      // Respawn mob
      this.spawnMob();
    }
  },

  getters: {
    isMobDead: (state) => state.currentMob?.health !== undefined && state.currentMob.health <= 0,
    mobHealthPercentage: (state) => 
      state.currentMob ? (state.currentMob.health / state.currentMob.maxHealth) * 100 : 0
  }
}); 