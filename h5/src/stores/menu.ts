import { defineStore } from 'pinia';
import { fetchDishes } from '../services/cloud';

export type Ingredient = { name: string; quantity?: number; unit?: string };
export type Category = { id: string; name: string };
export type Dish = { 
  id: string; 
  name: string; 
  categoryId: string; 
  categoryName: string; 
  imageUrl: string;
  ingredients?: (string|Ingredient)[]; // 用料（兼容字符串或对象）
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
    categories: [
      { id: 'cate_main', name: '主食类' },
      { id: 'cate_protein', name: '蛋白质类' },
      { id: 'cate_vegs', name: '蔬菜类' },
      { id: 'cate_soup', name: '汤羹类' },
      { id: 'cate_dessert', name: '甜点类' },
    ] as Category[],
    dishes: [] as Dish[],
  }),
  actions: {
    next7Days(){ return genNext7Days(); },
    async loadFromCloud(){
      const cloud = await fetchDishes();
      if (!cloud || cloud.length === 0) return;
      // 生成分类
      const cateMap = new Map<string, string>();
      cloud.forEach(d => cateMap.set(d.categoryId, d.categoryName));
      this.categories = Array.from(cateMap.entries()).map(([id, name]) => ({ id, name }));
      // 生成菜品（保证 imageUrl 存在）
      this.dishes = cloud.map(d => ({
        id: d.id,
        name: d.name,
        categoryId: d.categoryId,
        categoryName: d.categoryName,
        imageUrl: d.imageUrl || '',
        ingredients: d.ingredients as (string|Ingredient)[] | undefined,
        instructions: d.instructions
      }));
    },
    search(keyword: string){
      const k = keyword.trim();
      if (!k) return this.dishes;
      const lower = k.toLowerCase();
      return this.dishes.filter(d => d.name.toLowerCase().includes(lower));
    }
  }
});