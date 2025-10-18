import { defineStore } from 'pinia';

export type Meal = 'breakfast'|'lunch'|'dinner';
export type CartKey = string; // `${date}::${meal}`

function makeKey(date: string, meal: Meal): CartKey { return `${date}::${meal}`; }

export const useOrderStore = defineStore('order', {
  state: () => ({
    carts: {} as Record<CartKey, Record<string, number>>, // dishId -> count
  }),
  actions: {
    getCounts(date: string, meal: Meal){
      const key = makeKey(date, meal);
      return { ...(this.carts[key] || {}) };
    },
    setCount(date: string, meal: Meal, dishId: string, count: number){
      const key = makeKey(date, meal);
      if (!this.carts[key]) this.carts[key] = {};
      if (count <= 0) delete this.carts[key][dishId]; else this.carts[key][dishId] = count;
    },
    clear(date: string, meal: Meal){
      const key = makeKey(date, meal);
      this.carts[key] = {};
    }
  }
});