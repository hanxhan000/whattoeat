import { defineStore } from 'pinia';
import { useOrderStore, type Meal } from './order';
import { useMenuStore, type Ingredient } from './menu';

export type AggregatedItem = {
  name: string;
  quantity: number; // 汇总数量（若无单位，按份数汇总）
  unit?: string;
  fromDishes: string[]; // 来源菜品名称
};

function normalizeIngredient(ing: string | Ingredient): { name: string; quantity: number; unit?: string } {
  if (typeof ing === 'string') return { name: ing, quantity: 1 };
  return { name: ing.name, quantity: ing.quantity ?? 1, unit: ing.unit };
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    purchased: {} as Record<string, Record<string, boolean>> // date -> ingredientName -> purchased
  }),
  actions: {
    togglePurchased(date: string, name: string){
      if (!this.purchased[date]) this.purchased[date] = {};
      this.purchased[date][name] = !this.purchased[date][name];
    },
    clearPurchased(date: string){ this.purchased[date] = {}; },
    aggregate(date: string): AggregatedItem[] {
      const order = useOrderStore();
      const menu = useMenuStore();
      const meals: Meal[] = ['breakfast','lunch','dinner'];
      const agg = new Map<string, AggregatedItem>();
      for (const meal of meals) {
        const counts = order.getCounts(date, meal);
        for (const [dishId, count] of Object.entries(counts)) {
          if (count <= 0) continue;
          const dish = menu.dishes.find(d => d.id === dishId);
          if (!dish || !dish.ingredients || dish.ingredients.length === 0) continue;
          dish.ingredients.forEach(ing => {
            const { name, quantity, unit } = normalizeIngredient(ing);
            const addQty = quantity * count;
            const prev = agg.get(name);
            if (!prev) {
              agg.set(name, { name, quantity: addQty, unit, fromDishes: [dish.name] });
            } else {
              prev.quantity += addQty;
              if (prev.unit !== unit) prev.unit = undefined; // 单位不一致则不显示
              if (!prev.fromDishes.includes(dish.name)) prev.fromDishes.push(dish.name);
            }
          });
        }
      }
      return Array.from(agg.values()).sort((a,b) => a.name.localeCompare(b.name));
    }
  }
});