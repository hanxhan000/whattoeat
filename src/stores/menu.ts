import { defineStore } from 'pinia';

export type Category = { id: string; name: string };
export type Dish = { id: string; name: string; categoryId: string; categoryName: string; imageUrl: string };

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
  }),
  actions: {
    next7Days(){ return genNext7Days(); },
    ensureSeed(){
      if (this.categories.length > 0) return;
      this.categories = [
        { id: 'cate_main', name: '主食类' },
        { id: 'cate_protein', name: '蛋白质类' },
        { id: 'cate_vegs', name: '蔬菜类' },
        { id: 'cate_soup', name: '汤羹类' },
        { id: 'cate_dessert', name: '甜点类' },
      ];
      this.dishes = [
        { id: 'dish_1', name: '米饭', categoryId: 'cate_main', categoryName: '主食类', imageUrl: '' },
        { id: 'dish_2', name: '面条', categoryId: 'cate_main', categoryName: '主食类', imageUrl: '' },
        { id: 'dish_3', name: '馒头', categoryId: 'cate_main', categoryName: '主食类', imageUrl: '' },
        { id: 'dish_4', name: '炒饭', categoryId: 'cate_main', categoryName: '主食类', imageUrl: '' },
        { id: 'dish_5', name: '炒面', categoryId: 'cate_main', categoryName: '主食类', imageUrl: '' },

        { id: 'dish_6', name: '清蒸鱼', categoryId: 'cate_protein', categoryName: '蛋白质类', imageUrl: '' },
        { id: 'dish_7', name: '宫保鸡丁', categoryId: 'cate_protein', categoryName: '蛋白质类', imageUrl: '' },
        { id: 'dish_8', name: '红烧肉', categoryId: 'cate_protein', categoryName: '蛋白质类', imageUrl: '' },
        { id: 'dish_9', name: '可乐鸡翅', categoryId: 'cate_protein', categoryName: '蛋白质类', imageUrl: '' },
        { id: 'dish_10', name: '糖醋里脊', categoryId: 'cate_protein', categoryName: '蛋白质类', imageUrl: '' },
        { id: 'dish_11', name: '鱼香肉丝', categoryId: 'cate_protein', categoryName: '蛋白质类', imageUrl: '' },

        { id: 'dish_12', name: '西红柿炒鸡蛋', categoryId: 'cate_vegs', categoryName: '蔬菜类', imageUrl: '' },
        { id: 'dish_13', name: '清炒西兰花', categoryId: 'cate_vegs', categoryName: '蔬菜类', imageUrl: '' },
        { id: 'dish_14', name: '酸辣土豆丝', categoryId: 'cate_vegs', categoryName: '蔬菜类', imageUrl: '' },
        { id: 'dish_15', name: '麻婆豆腐', categoryId: 'cate_vegs', categoryName: '蔬菜类', imageUrl: '' },
        { id: 'dish_16', name: '炒时蔬', categoryId: 'cate_vegs', categoryName: '蔬菜类', imageUrl: '' },
        { id: 'dish_17', name: '凉拌黄瓜', categoryId: 'cate_vegs', categoryName: '蔬菜类', imageUrl: '' },

        { id: 'dish_18', name: '番茄蛋汤', categoryId: 'cate_soup', categoryName: '汤羹类', imageUrl: '' },
        { id: 'dish_19', name: '冬瓜排骨汤', categoryId: 'cate_soup', categoryName: '汤羹类', imageUrl: '' },
        { id: 'dish_20', name: '紫菜蛋花汤', categoryId: 'cate_soup', categoryName: '汤羹类', imageUrl: '' },
        { id: 'dish_21', name: '雪菜豆腐汤', categoryId: 'cate_soup', categoryName: '汤羹类', imageUrl: '' },

        { id: 'dish_22', name: '银耳羹', categoryId: 'cate_dessert', categoryName: '甜点类', imageUrl: '' },
        { id: 'dish_23', name: '红豆汤', categoryId: 'cate_dessert', categoryName: '甜点类', imageUrl: '' },
        { id: 'dish_24', name: '绿豆汤', categoryId: 'cate_dessert', categoryName: '甜点类', imageUrl: '' },
        { id: 'dish_25', name: '奶油蛋糕', categoryId: 'cate_dessert', categoryName: '甜点类', imageUrl: '' },
        { id: 'dish_26', name: '水果拼盘', categoryId: 'cate_dessert', categoryName: '甜点类', imageUrl: '' },
      ];
    }
  }
});