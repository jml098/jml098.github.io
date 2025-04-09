<template>
  <div class="game-container">
    <div class="game-header">
      <div class="mob-selector">
        <h2>Mobs</h2>
        <div class="mob-list">
          <button
            v-for="mob in MOBS"
            :key="mob.id"
            class="mob-button"
            :class="{ active: selectedMobId === mob.id }"
            @click="selectMob(mob.id)"
          >
            {{ mob.name }}
          </button>
        </div>
      </div>
      <div class="player-stats">
        <h2>Player</h2>
        <div class="stat-bar">
          <span>Health: {{ player.health }}/{{ player.baseMaxHealth }}</span>
          <div class="health-bar">
            <div
              class="health-fill"
              :style="{ width: `${(player.health / player.baseMaxHealth) * 100}%` }"
            ></div>
          </div>
        </div>
        <div class="stat">Damage: {{ player.damage }}</div>
        <div class="stat">Armor: {{ player.baseArmor }}</div>
        <div class="stat">Gold: {{ player.gold }}</div>
        <div class="stat">Level: {{ player.level }}</div>
        <div class="stat">XP: {{ player.experience }}</div>
        
        <div class="equipment-panel">
          <h3>Equipment</h3>
          <div class="equipment-grid">
            <div class="equipment-slot">
              <div class="slot-label">Weapon</div>
              <div 
                class="equipped-item" 
                v-if="player.equipment.weapon"
                @mouseenter="showTooltip($event, player.equipment.weapon)"
                @mouseleave="hideTooltip"
              >
                {{ getItemName(player.equipment.weapon) }}
              </div>
              <div class="empty-slot" v-else>Empty</div>
            </div>
            <div class="equipment-slot">
              <div class="slot-label">Armor</div>
              <div 
                class="equipped-item" 
                v-if="player.equipment.armor"
                @mouseenter="showTooltip($event, player.equipment.armor)"
                @mouseleave="hideTooltip"
              >
                {{ getItemName(player.equipment.armor) }}
              </div>
              <div class="empty-slot" v-else>Empty</div>
            </div>
            <div class="equipment-slot">
              <div class="slot-label">Accessory 1</div>
              <div 
                class="equipped-item" 
                v-if="player.equipment.accessory1"
                @mouseenter="showTooltip($event, player.equipment.accessory1)"
                @mouseleave="hideTooltip"
              >
                {{ getItemName(player.equipment.accessory1) }}
              </div>
              <div class="empty-slot" v-else>Empty</div>
            </div>
            <div class="equipment-slot">
              <div class="slot-label">Accessory 2</div>
              <div 
                class="equipped-item" 
                v-if="player.equipment.accessory2"
                @mouseenter="showTooltip($event, player.equipment.accessory2)"
                @mouseleave="hideTooltip"
              >
                {{ getItemName(player.equipment.accessory2) }}
              </div>
              <div class="empty-slot" v-else>Empty</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="game-content">
      <div class="mob-container" @click="attackMob">
        <div v-if="currentMob" class="mob">
          <div class="mob-name">{{ currentMob.name }}</div>
          <div class="mob-stats">
            <div class="stat-bar">
              <div class="health-bar">
                <div
                  class="health-fill enemy-health-fill"
                  :style="{ width: `${mobHealthPercentage}%` }"
                ></div>
              </div>
              <span>{{ currentMob.health }}/{{ currentMob.maxHealth }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="heal-button-container">
      <button 
        class="heal-button" 
        :class="{ disabled: !hasHealthPotion }"
        @click="useHealthPotion"
        :disabled="!hasHealthPotion"
      >
        <span class="heal-text">Heal</span>
        <span class="potion-count">x{{ healthPotionCount }}</span>
      </button>
    </div>

    <div class="bottom-nav">
      <button class="nav-button" @click="toggleInventory">
        Inventory
      </button>
      <button class="nav-button" @click="toggleShop">
        Shop
      </button>
      <button class="nav-button" @click="toggleCrafting">
        Crafting
      </button>
    </div>

    <div v-if="isInventoryOpen" class="inventory-panel">
      <div class="inventory-header">
        <h2>Inventory</h2>
        <button class="close-button" @click="toggleInventory">×</button>
      </div>
      <div class="inventory">
        <div class="inventory-grid">
          <div
            v-for="slot in player.inventory"
            :key="slot.itemId"
            class="inventory-slot"
            @contextmenu="handleContextMenu($event, slot)"
            @mouseenter="showTooltip($event, slot.itemId)"
            @mouseleave="hideTooltip"
          >
            <div class="item-name">{{ getItemName(slot.itemId) }}</div>
            <div class="item-quantity">x{{ slot.quantity }}</div>
          </div>
        </div>

        <div
          v-if="showContextMenu"
          class="context-menu"
          :style="{
            left: `${contextMenuPosition.x}px`,
            top: `${contextMenuPosition.y}px`
          }"
          @click.stop
        >
          <div
            v-if="selectedItem && isEquippable(selectedItem.itemId)"
            class="context-menu-items"
          >
            <template v-if="getItemType(selectedItem.itemId) === 'accessory'">
              <div class="context-menu-item" @click="handleEquip('accessory1')">
                Equip in Slot 1
              </div>
              <div class="context-menu-item" @click="handleEquip('accessory2')">
                Equip in Slot 2
              </div>
            </template>
            <div v-else class="context-menu-item" @click="handleEquip()">
              Equip
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isShopOpen" class="shop-panel">
      <div class="shop-header">
        <h2>Shop</h2>
        <button class="close-button" @click="toggleShop">×</button>
      </div>
      <div class="shop">
        <div class="shop-tabs">
          <button 
            class="shop-tab" 
            :class="{ active: activeTab === 'buy' }"
            @click="activeTab = 'buy'"
          >
            Buy
          </button>
          <button 
            class="shop-tab" 
            :class="{ active: activeTab === 'sell' }"
            @click="activeTab = 'sell'"
          >
            Sell
          </button>
        </div>

        <div v-if="activeTab === 'buy'" class="shop-grid">
          <div
            v-for="item in nonCraftableItems"
            :key="item.id"
            class="shop-slot"
          >
            <div class="item-info">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-description">{{ item.description }}</span>
              <span class="item-value">Price: {{ item.value }} gold</span>
            </div>
            <div class="quantity-buttons">
              <button 
                class="quantity-button" 
                @click="buyItem(item.id, 1)"
                :disabled="player.gold < item.value"
              >
                Buy 1
              </button>
              <button 
                class="quantity-button" 
                @click="buyItem(item.id, 10)"
                :disabled="player.gold < item.value * 10"
              >
                Buy 10
              </button>
              <button 
                class="quantity-button" 
                @click="buyItem(item.id, 25)"
                :disabled="player.gold < item.value * 25"
              >
                Buy 25
              </button>
              <button 
                class="quantity-button" 
                @click="buyItem(item.id, Math.floor(player.gold / item.value))"
                :disabled="player.gold < item.value"
              >
                Buy All
              </button>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'sell'" class="shop-grid">
          <div
            v-for="slot in player.inventory"
            :key="slot.itemId"
            class="shop-slot"
          >
            <div class="item-info">
              <span class="item-name">{{ getItemName(slot.itemId) }}</span>
              <span class="item-quantity">x{{ slot.quantity }}</span>
              <span class="item-value">Value: {{ getItemValue(slot.itemId) }} gold</span>
            </div>
            <div class="quantity-buttons">
              <button 
                class="quantity-button" 
                @click="sellItem(slot.itemId, 1)"
                :disabled="slot.quantity < 1"
              >
                Sell 1
              </button>
              <button 
                class="quantity-button" 
                @click="sellItem(slot.itemId, 10)"
                :disabled="slot.quantity < 10"
              >
                Sell 10
              </button>
              <button 
                class="quantity-button" 
                @click="sellItem(slot.itemId, 25)"
                :disabled="slot.quantity < 25"
              >
                Sell 25
              </button>
              <button 
                class="quantity-button" 
                @click="sellItem(slot.itemId, slot.quantity)"
                :disabled="slot.quantity < 1"
              >
                Sell All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isCraftingOpen" class="crafting-panel">
      <div class="crafting-header">
        <h2>Crafting</h2>
        <button class="close-button" @click="toggleCrafting">×</button>
      </div>
      <div class="crafting">
        <div class="crafting-grid">
          <div
            v-for="recipe in sortedCraftingRecipes"
            :key="recipe.id"
            class="crafting-slot"
            :class="{ disabled: !canCraft(recipe) }"
          >
            <div class="item-info">
              <span class="item-name">{{ getItemName(recipe.result) }}</span>
              <span class="item-description">{{ getItemDescription(recipe.result) }}</span>
            </div>
            <div class="recipe-requirements">
              <div 
                v-for="(quantity, material) in recipe.materials" 
                :key="material"
                class="requirement"
                :class="{ 'requirement-met': hasEnoughMaterial(material, quantity) }"
              >
                {{ getItemName(material) }} x{{ quantity }}
                <span class="inventory-count">
                  ({{ getMaterialCount(material) }}/{{ quantity }})
                </span>
              </div>
            </div>
            <button 
              class="craft-button"
              @click="craftItem(recipe)"
              :disabled="!canCraft(recipe)"
            >
              Craft
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add tooltip component -->
    <div 
      v-if="showItemTooltip" 
      class="tooltip-container"
      :style="{
        left: `${tooltipPosition.x}px`,
        top: `${tooltipPosition.y}px`
      }"
    >
      <div class="item-tooltip">
        <div class="tooltip-header">
          <span class="tooltip-name">{{ tooltipItem?.name }}</span>
        </div>
        <div class="tooltip-description">{{ tooltipItem?.description }}</div>
        <div class="tooltip-stats">
          <div v-if="tooltipItem?.damage" class="tooltip-stat">
            Damage: +{{ tooltipItem.damage }}
          </div>
          <div v-if="tooltipItem?.armor" class="tooltip-stat">
            Armor: +{{ tooltipItem.armor }}
          </div>
          <div v-if="tooltipItem?.health" class="tooltip-stat">
            Health: +{{ tooltipItem.health }}
          </div>
        </div>
      </div>

      <div 
        v-if="isEquippable(tooltipItem?.id || '') && getCurrentlyEquippedItem(tooltipItem)"
        class="item-tooltip equipped-tooltip"
      >
        <div class="tooltip-header">
          <span class="tooltip-name">Currently Equipped</span>
        </div>
        <div class="tooltip-description">{{ getCurrentlyEquippedItem(tooltipItem)?.name }}</div>
        <div class="tooltip-stats">
          <div v-if="getCurrentlyEquippedItem(tooltipItem)?.damage" class="tooltip-stat">
            Damage: +{{ getCurrentlyEquippedItem(tooltipItem)?.damage }}
          </div>
          <div v-if="getCurrentlyEquippedItem(tooltipItem)?.armor" class="tooltip-stat">
            Armor: +{{ getCurrentlyEquippedItem(tooltipItem)?.armor }}
          </div>
          <div v-if="getCurrentlyEquippedItem(tooltipItem)?.health" class="tooltip-stat">
            Health: +{{ getCurrentlyEquippedItem(tooltipItem)?.health }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { usePlayerStore } from '../stores/player';
import { useMobStore } from '../stores/mob';
import { MOBS } from '../data/mobs';
import { ITEMS } from '../data/items';
import { CRAFTING_RECIPES, type CraftingRecipe } from '../data/crafting';
import type { Item } from '../data/items';
import type { InventorySlot } from '@/types/game';

const playerStore = usePlayerStore();
const mobStore = useMobStore();

const player = playerStore;
const currentMob = ref(mobStore.currentMob);
const selectedMobId = ref(mobStore.selectedMobId);
const mobHealthPercentage = ref(mobStore.mobHealthPercentage);
const isInventoryOpen = ref(false);
const isShopOpen = ref(false);
const activeTab = ref<'buy' | 'sell'>('buy');
const showContextMenu = ref(false);
const contextMenuPosition = ref({ x: 0, y: 0 });
const selectedItem = ref<InventorySlot | null>(null);
const showItemTooltip = ref(false);
const tooltipPosition = ref({ x: 0, y: 0 });
const tooltipItem = ref<Item | null>(null);
const isCraftingOpen = ref(false);

const hasHealthPotion = computed(() => {
  const potionSlot = player.inventory.find(slot => slot.itemId === 'health_potion');
  return potionSlot && potionSlot.quantity > 0;
});

const healthPotionCount = computed(() => {
  const potionSlot = player.inventory.find(slot => slot.itemId === 'health_potion');
  return potionSlot ? potionSlot.quantity : 0;
});

const useHealthPotion = () => {
  if (!hasHealthPotion.value) return;
  
  const potionSlot = player.inventory.find(slot => slot.itemId === 'health_potion');
  if (!potionSlot) return;

  // Use the potion
  playerStore.useItem('health_potion');
};

const selectMob = (mobId: string) => {
  mobStore.selectMob(mobId);
  selectedMobId.value = mobId;
  currentMob.value = mobStore.currentMob;
  mobHealthPercentage.value = mobStore.mobHealthPercentage;
};

const attackMob = () => {
  if (player.isDead) return;

  if (currentMob.value) {
    mobStore.attackMob(player.baseDamage);
    currentMob.value = mobStore.currentMob;
    mobHealthPercentage.value = mobStore.mobHealthPercentage;
  }
};

const toggleInventory = () => {
  isInventoryOpen.value = !isInventoryOpen.value;
  isShopOpen.value = false;
};

const toggleShop = () => {
  isShopOpen.value = !isShopOpen.value;
  isInventoryOpen.value = false;
};

const toggleCrafting = () => {
  isCraftingOpen.value = !isCraftingOpen.value;
  isInventoryOpen.value = false;
  isShopOpen.value = false;
};

const getItemName = (itemId: string) => {
  const item = ITEMS.find(item => item.id === itemId);
  return item ? item.name : 'Unknown Item';
};

const getItemValue = (itemId: string) => {
  const item = ITEMS.find(item => item.id === itemId);
  return item ? item.value : 0;
};

const buyItem = (itemId: string, quantity: number = 1) => {
  const item = ITEMS.find(item => item.id === itemId);
  if (item && player.gold >= item.value * quantity) {
    playerStore.removeGold(item.value * quantity);
    playerStore.addItem(itemId, quantity);
  }
};

const sellItem = (itemId: string, quantity: number = 1) => {
  const item = ITEMS.find(item => item.id === itemId);
  if (item) {
    const slot = player.inventory.find(slot => slot.itemId === itemId);
    if (slot && slot.quantity >= quantity) {
      playerStore.addGold(item.value * quantity);
      playerStore.removeItem(itemId, quantity);
    }
  }
};

const handleContextMenu = (event: MouseEvent, slot: InventorySlot) => {
  event.preventDefault();
  selectedItem.value = slot;
  
  // Get the inventory panel's position
  const inventoryPanel = document.querySelector('.inventory-panel') as HTMLElement;
  const rect = inventoryPanel.getBoundingClientRect();
  
  // Calculate position relative to the inventory panel
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  contextMenuPosition.value = { x, y };
  showContextMenu.value = true;
};

const closeContextMenu = () => {
  showContextMenu.value = false;
  selectedItem.value = null;
};

const isEquippable = (itemId: string) => {
  const item = ITEMS.find(item => item.id === itemId);
  return item?.type === 'weapon' || item?.type === 'armor' || item?.type === 'accessory';
};

const getItemType = (itemId: string) => {
  const item = ITEMS.find(item => item.id === itemId);
  return item?.type;
};

const handleEquip = (slot?: 'accessory1' | 'accessory2') => {
  if (selectedItem.value) {
    const item = ITEMS.find(item => item.id === selectedItem.value?.itemId);
    if (item) {
      if (item.type === 'accessory' && slot) {
        // For accessories, unequip the specific slot first
        if (player.equipment[slot]) {
          player.unequipItem(slot);
        }
        // Set the equipment slot directly
        player.equipment[slot] = selectedItem.value.itemId;
        // Apply the item effects
        player.baseMaxHealth += item.health || 0;
        player.health = Math.min(player.baseMaxHealth, player.health + (item.health || 0));
        // Remove from inventory
        player.removeItem(selectedItem.value.itemId, 1);
      } else {
        // For other items, use the default equip behavior
        if (player.equipItem(selectedItem.value.itemId)) {
          player.removeItem(selectedItem.value.itemId, 1);
        }
      }
    }
    closeContextMenu();
  }
};

const showTooltip = (event: MouseEvent, itemId: string) => {
  const item = ITEMS.find(item => item.id === itemId);
  if (item) {
    tooltipItem.value = item;
    tooltipPosition.value = {
      x: event.clientX + 10,
      y: event.clientY + 10
    };
    showItemTooltip.value = true;
  }
};

const hideTooltip = () => {
  showItemTooltip.value = false;
  tooltipItem.value = null;
};

const getCurrentlyEquippedItem = (item: Item | null) => {
  if (!item) return null;
  
  const equippedItemId = 
    item.type === 'weapon' ? player.equipment.weapon :
    item.type === 'armor' ? player.equipment.armor :
    item.type === 'accessory' ? (player.equipment.accessory1 || player.equipment.accessory2) :
    null;

  return equippedItemId ? ITEMS.find(i => i.id === equippedItemId) : null;
};

const getComparisonStat = (stat: 'damage' | 'armor' | 'health', item: Item) => {
  const equippedItem = getCurrentlyEquippedItem(item);
  if (!equippedItem) return null;

  const currentStat = equippedItem[stat] || 0;
  const newStat = item[stat] || 0;
  const difference = newStat - currentStat;

  if (difference === 0) return null;
  return difference > 0 ? `+${difference}` : `${difference}`;
};

const getComparisonClass = (stat: 'damage' | 'armor' | 'health', item: Item) => {
  const difference = getComparisonStat(stat, item);
  if (!difference) return '';
  return difference.startsWith('+') ? 'stat-better' : 'stat-worse';
};

const nonCraftableItems = computed(() => {
  return ITEMS.filter(item => item.id === 'health_potion');
});

const getItemDescription = (itemId: string) => {
  const item = ITEMS.find(item => item.id === itemId);
  return item ? item.description : '';
};

const getMaterialCount = (itemId: string) => {
  const slot = player.inventory.find(slot => slot.itemId === itemId);
  return slot ? slot.quantity : 0;
};

const hasEnoughMaterial = (itemId: string, requiredQuantity: number) => {
  return getMaterialCount(itemId) >= requiredQuantity;
};

const canCraft = (recipe: CraftingRecipe) => {
  return Object.entries(recipe.materials).every(([material, quantity]) => 
    hasEnoughMaterial(material, quantity)
  );
};

const craftItem = (recipe: CraftingRecipe) => {
  if (!canCraft(recipe)) return;

  // Remove materials
  Object.entries(recipe.materials).forEach(([material, quantity]) => {
    playerStore.removeItem(material, quantity);
  });

  // Add crafted item
  playerStore.addItem(recipe.result, 1);
};

const sortedCraftingRecipes = computed(() => {
  return [...CRAFTING_RECIPES].sort((a, b) => {
    const itemA = ITEMS.find(item => item.id === a.result);
    const itemB = ITEMS.find(item => item.id === b.result);
    
    if (!itemA || !itemB) return 0;
    
    // Calculate power value based on stats
    const powerA = (itemA.damage || 0) + (itemA.armor || 0) + (itemA.health || 0);
    const powerB = (itemB.damage || 0) + (itemB.armor || 0) + (itemB.health || 0);
    
    return powerA - powerB;
  });
});

onMounted(() => {
  mobStore.spawnMob();
  currentMob.value = mobStore.currentMob;
  document.addEventListener('click', closeContextMenu);
  document.addEventListener('keydown', handleKeyPress);
});

onUnmounted(() => {
  document.removeEventListener('click', closeContextMenu);
  document.removeEventListener('keydown', handleKeyPress);
});

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key.toLowerCase() === 'h' && hasHealthPotion.value) {
    useHealthPotion();
  }
};
</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background-color: #1a1a1a;
  color: #e6e6e6;
  font-family: 'Press Start 2P', cursive;
  padding: 20px;
  position: relative;
}

.game-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.mob-selector {
  background-color: #262626;
  padding: 10px;
  border: 4px solid #404040;
  border-radius: 8px;
}

.mob-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mob-button {
  background-color: #333333;
  border: none;
  padding: 8px 16px;
  color: #e6e6e6;
  cursor: pointer;
  font-family: 'Press Start 2P', cursive;
  font-size: 12px;
  transition: all 0.2s;
}

.mob-button:hover {
  background-color: #404040;
}

.mob-button.active {
  background-color: #4d4d4d;
}

.player-stats {
  background-color: #262626;
  padding: 10px;
  border: 4px solid #404040;
  border-radius: 8px;
}

.stat-bar {
  margin-bottom: 8px;
}

.health-bar {
  width: 100%;
  min-width: 200px;
  height: 20px;
  background-color: #1a1a1a;
  border: 2px solid #404040;
  margin-top: 4px;
}

.health-fill {
  height: 100%;
  background-color: #2ecc71;
  transition: width 0.3s;
}

.enemy-health-fill {
  background-color: #e74c3c;
}

.stat {
  margin-bottom: 4px;
  font-size: 12px;
}

.game-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mob-container {
  position: absolute;
  background-color: #262626;
  padding: 20px;
  border: 4px solid #404040;
  top: 40%;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.1s;
}

.mob-container:active {
  transform: scale(0.95);
}

.mob {
  text-align: center;
}

.mob-name {
  font-size: 24px;
  margin-bottom: 16px;
}

.mob-stats {
  margin-top: 16px;
}

.heal-button-container {
  position: fixed;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.heal-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 12px 24px;
  font-family: 'Press Start 2P', cursive;
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.heal-button:hover:not(.disabled) {
  background-color: #45a049;
  transform: scale(1.05);
}

.heal-button.disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.7;
}

.heal-text {
  font-size: 14px;
}

.potion-count {
  font-size: 12px;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  padding: 10px;
  background-color: #1a1a1a;
  border-top: 4px solid #404040;
}

.nav-button {
  background-color: #333333;
  border: 2px solid #404040;
  padding: 8px 16px;
  color: #e6e6e6;
  cursor: pointer;
  font-family: 'Press Start 2P', cursive;
  font-size: 12px;
  transition: all 0.2s;
}

.nav-button:hover {
  background-color: #404040;
}

.inventory-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #1a1a1a;
  border: 4px solid #404040;
  border-radius: 8px;
  width: 80%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  z-index: 1000;
}

.inventory-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 2px solid #404040;
}

.close-button {
  background: none;
  border: none;
  color: #e6e6e6;
  font-size: 24px;
  cursor: pointer;
  padding: 0 8px;
}

.close-button:hover {
  color: #ffffff;
}

.inventory {
  padding: 20px;
}

.inventory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 8px;
}

.inventory-slot {
  background-color: #262626;
  padding: 8px;
  border: 2px solid #404040;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.item-name {
  font-size: 10px;
  margin-bottom: 4px;
}

.item-quantity {
  font-size: 12px;
  color: #e6e6e6;
}

.shop-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #1a1a1a;
  border: 4px solid #404040;
  border-radius: 8px;
  width: 80%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  z-index: 1000;
}

.shop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 2px solid #404040;
}

.shop {
  padding: 20px;
}

.shop-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  padding: 0 20px;
}

.shop-tab {
  background-color: #333333;
  border: 2px solid #404040;
  padding: 8px 16px;
  color: #e6e6e6;
  cursor: pointer;
  font-family: 'Press Start 2P', cursive;
  font-size: 12px;
  transition: all 0.2s;
  flex: 1;
}

.shop-tab:hover {
  background-color: #404040;
}

.shop-tab.active {
  background-color: #4d4d4d;
}

.item-description {
  font-size: 8px;
  color: #999999;
  margin: 4px 0;
}

.shop-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.shop-slot {
  background-color: #262626;
  padding: 12px;
  border: 2px solid #404040;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-value {
  font-size: 10px;
  color: #f1c40f;
}

.quantity-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  margin-top: 8px;
}

.quantity-button {
  background-color: #333333;
  border: 2px solid #404040;
  padding: 4px 8px;
  color: #e6e6e6;
  cursor: pointer;
  font-family: 'Press Start 2P', cursive;
  font-size: 8px;
  transition: all 0.2s;
}

.quantity-button:hover:not(:disabled) {
  background-color: #404040;
}

.quantity-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.equipment-panel {
  margin-top: 16px;
  padding: 10px;
  background-color: #262626;
  border: 2px solid #404040;
  border-radius: 4px;
}

.equipment-panel h3 {
  font-size: 12px;
  margin-bottom: 8px;
  color: #e6e6e6;
}

.equipment-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.equipment-slot {
  background-color: #333333;
  border: 2px solid #404040;
  border-radius: 4px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 60px;
}

.slot-label {
  font-size: 8px;
  color: #999999;
  margin-bottom: 4px;
}

.equipped-item {
  font-size: 10px;
  color: #e6e6e6;
  text-align: center;
  word-break: break-word;
}

.empty-slot {
  font-size: 8px;
  color: #666666;
  font-style: italic;
}

.context-menu {
  position: absolute;
  background-color: #262626;
  border: 1px solid #404040;
  border-radius: 4px;
  padding: 4px 0;
  min-width: 120px;
  z-index: 1001;
}

.context-menu-item {
  padding: 6px 12px;
  color: #e6e6e6;
  font-size: 12px;
  cursor: pointer;
}

.context-menu-item:hover {
  background-color: #404040;
}

.tooltip-container {
  position: fixed;
  display: flex;
  gap: 8px;
  z-index: 1000;
  pointer-events: none;
}

.item-tooltip {
  background-color: #262626;
  border: 2px solid #404040;
  border-radius: 4px;
  padding: 8px;
  min-width: 200px;
}

.equipped-tooltip {
  border-color: #f1c40f;
}

.tooltip-header {
  margin-bottom: 4px;
}

.tooltip-name {
  font-size: 12px;
  color: #e6e6e6;
  font-weight: bold;
}

.tooltip-description {
  font-size: 10px;
  color: #999999;
  margin-bottom: 8px;
}

.tooltip-stats {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tooltip-stat {
  font-size: 10px;
  color: #f1c40f;
}

.tooltip-comparison {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #404040;
}

.comparison-header {
  font-size: 8px;
  color: #999999;
  margin-bottom: 4px;
}

.comparison-item {
  font-size: 10px;
  color: #e6e6e6;
}

.stat-better {
  color: #2ecc71;
}

.stat-worse {
  color: #e74c3c;
}

.crafting-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #1a1a1a;
  border: 4px solid #404040;
  border-radius: 8px;
  width: 80%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  z-index: 1000;
}

.crafting-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 2px solid #404040;
}

.crafting {
  padding: 20px;
}

.crafting-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.crafting-slot {
  background-color: #262626;
  padding: 12px;
  border: 2px solid #404040;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.crafting-slot.disabled {
  opacity: 0.7;
}

.recipe-requirements {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 8px 0;
}

.requirement {
  font-size: 10px;
  color: #e74c3c;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.requirement.requirement-met {
  color: #2ecc71;
}

.inventory-count {
  font-size: 8px;
  opacity: 0.8;
}

.craft-button {
  background-color: #4CAF50;
  border: none;
  padding: 8px;
  color: white;
  cursor: pointer;
  font-family: 'Press Start 2P', cursive;
  font-size: 12px;
  transition: all 0.2s;
  margin-top: 8px;
}

.craft-button:hover:not(:disabled) {
  background-color: #45a049;
  transform: scale(1.05);
}

.craft-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.7;
}
</style> 