import { defineStore } from 'pinia';
import { mockAPI } from '../api/mockBackend';

export type Category = { id: string; name: string };
export type Dish = { 
  id: string; 
  name: string; 
  categoryId: string; 
  categoryName: string; 
  imageUrl: string;
  ingredients?: string[]; // 用料
  instructions?: string[]; // 做法
};

function genNext7Days() {
  const res: { value: string; label: string }[] = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now.getTime() + i * 86400000);
    const value = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const label = i === 0 ? `今天 ${d.getMonth()+1}/${d.getDate()}` : `${d.getMonth()+1}/${d.getDate()}`;
    res.push({ value, label });
  }
  return res;
}

export const useMenuStore = defineStore('menu', {
  state: () => ({
    categories: [] as Category[],
    dishes: [] as Dish[],
    loading: false,
  }),
  actions: {
    next7Days(){ return genNext7Days(); },
    async loadCategories() {
      this.loading = true;
      try {
        this.categories = await mockAPI.getCategories();
      } finally {
        this.loading = false;
      }
    },
    async loadDishes() {
      this.loading = true;
      try {
        this.dishes = await mockAPI.getDishes();
      } finally {
        this.loading = false;
      }
    },
    async loadAll() {
      await Promise.all([
        this.loadCategories(),
        this.loadDishes()
      ]);
    },
    ensureSeed(){
      // 不再需要本地种子数据，使用后端数据
      if (this.categories.length > 0) return;
      this.loadAll();
    }
  }
});