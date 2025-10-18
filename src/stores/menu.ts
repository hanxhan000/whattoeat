import { defineStore } from 'pinia';

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
    categories: [
      { id: 'cate_main', name: '主食类' },
      { id: 'cate_protein', name: '蛋白质类' },
      { id: 'cate_vegs', name: '蔬菜类' },
      { id: 'cate_soup', name: '汤羹类' },
      { id: 'cate_dessert', name: '甜点类' },
    ] as Category[],
    dishes: [
      { 
        id: 'dish_1', 
        name: '米饭', 
        categoryId: 'cate_main', 
        categoryName: '主食类', 
        imageUrl: '', 
        ingredients: ['大米'],
        instructions: ['淘洗大米', '加水煮制', '焖制10分钟']
      },
      { 
        id: 'dish_2', 
        name: '面条', 
        categoryId: 'cate_main', 
        categoryName: '主食类', 
        imageUrl: '',
        ingredients: ['面条', '青菜', '鸡蛋'],
        instructions: ['烧开水下面条', '煮制面条', '加入青菜和鸡蛋', '调味']
      },
      { 
        id: 'dish_3', 
        name: '馒头', 
        categoryId: 'cate_main', 
        categoryName: '主食类', 
        imageUrl: '',
        ingredients: ['面粉', '酵母', '水'],
        instructions: ['和面发酵', '揉面', '蒸制']
      },
      { 
        id: 'dish_4', 
        name: '炒饭', 
        categoryId: 'cate_main', 
        categoryName: '主食类', 
        imageUrl: '',
        ingredients: ['米饭', '鸡蛋', '火腿', '青豆', '胡萝卜'],
        instructions: ['热锅下油', '炒鸡蛋', '加入米饭和配菜', '调味炒匀']
      },
      { 
        id: 'dish_5', 
        name: '炒面', 
        categoryId: 'cate_main', 
        categoryName: '主食类', 
        imageUrl: '',
        ingredients: ['面条', '豆芽', '胡萝卜', '鸡蛋'],
        instructions: ['煮面条', '热锅下油', '炒配菜', '加入面条和调料', '炒匀']
      },

      { 
        id: 'dish_6', 
        name: '清蒸鱼', 
        categoryId: 'cate_protein', 
        categoryName: '蛋白质类', 
        imageUrl: '',
        ingredients: ['鲈鱼', '姜丝', '葱丝', '蒸鱼豉油'],
        instructions: ['处理鱼洗净', '放姜丝', '蒸制', '淋热油和蒸鱼豉油']
      },
      { 
        id: 'dish_7', 
        name: '宫保鸡丁', 
        categoryId: 'cate_protein', 
        categoryName: '蛋白质类', 
        imageUrl: '',
        ingredients: ['鸡胸肉', '花生米', '干辣椒', '花椒', '葱姜蒜'],
        instructions: ['鸡肉切丁腌制', '炸花生米', '爆炒调料', '加入鸡肉和花生米', '调味炒匀']
      },
      { 
        id: 'dish_8', 
        name: '红烧肉', 
        categoryId: 'cate_protein', 
        categoryName: '蛋白质类', 
        imageUrl: '',
        ingredients: ['五花肉', '冰糖', '生抽', '老抽', '料酒'],
        instructions: ['五花肉切块焯水', '炒糖色', '加入肉块翻炒', '加调料和水', '炖煮收汁']
      },
      { 
        id: 'dish_9', 
        name: '可乐鸡翅', 
        categoryId: 'cate_protein', 
        categoryName: '蛋白质类', 
        imageUrl: '',
        ingredients: ['鸡翅', '可乐', '生抽', '老抽', '姜片'],
        instructions: ['鸡翅洗净划刀', '煎至两面金黄', '加入调料和可乐', '炖煮收汁']
      },
      { 
        id: 'dish_10', 
        name: '糖醋里脊', 
        categoryId: 'cate_protein', 
        categoryName: '蛋白质类', 
        imageUrl: '',
        ingredients: ['猪里脊', '番茄酱', '白糖', '白醋', '淀粉'],
        instructions: ['里脊肉切条腌制', '裹淀粉炸制', '调糖醋汁', '倒入炸好的里脊翻炒']
      },
      { 
        id: 'dish_11', 
        name: '鱼香肉丝', 
        categoryId: 'cate_protein', 
        categoryName: '蛋白质类', 
        imageUrl: '',
        ingredients: ['猪里脊', '木耳', '胡萝卜', '青椒', '豆瓣酱'],
        instructions: ['里脊肉切丝腌制', '配菜切丝', '调鱼香汁', '爆炒肉丝和配菜', '倒入鱼香汁炒匀']
      },

      { 
        id: 'dish_12', 
        name: '西红柿炒鸡蛋', 
        categoryId: 'cate_vegs', 
        categoryName: '蔬菜类', 
        imageUrl: '',
        ingredients: ['西红柿', '鸡蛋', '葱花'],
        instructions: ['鸡蛋打散炒熟', '西红柿切块炒出汁', '加入鸡蛋翻炒', '调味']
      },
      { 
        id: 'dish_13', 
        name: '清炒西兰花', 
        categoryId: 'cate_vegs', 
        categoryName: '蔬菜类', 
        imageUrl: '',
        ingredients: ['西兰花', '蒜', '盐'],
        instructions: ['西兰花焯水', '热锅下油爆香蒜', '加入西兰花翻炒', '调味']
      },
      { 
        id: 'dish_14', 
        name: '酸辣土豆丝', 
        categoryId: 'cate_vegs', 
        categoryName: '蔬菜类', 
        imageUrl: '',
        ingredients: ['土豆', '青椒', '干辣椒', '醋', '盐'],
        instructions: ['土豆切丝泡水', '热锅下油爆香辣椒', '加入土豆丝翻炒', '调味']
      },
      { 
        id: 'dish_15', 
        name: '麻婆豆腐', 
        categoryId: 'cate_vegs', 
        categoryName: '蔬菜类', 
        imageUrl: '',
        ingredients: ['嫩豆腐', '牛肉末', '豆瓣酱', '花椒', '葱花'],
        instructions: ['豆腐切块焯水', '炒牛肉末', '加入豆瓣酱和调料', '加入豆腐煮制', '撒花椒粉和葱花']
      },
      { 
        id: 'dish_16', 
        name: '炒时蔬', 
        categoryId: 'cate_vegs', 
        categoryName: '蔬菜类', 
        imageUrl: '',
        ingredients: ['时令蔬菜', '蒜', '盐'],
        instructions: ['蔬菜洗净', '热锅下油爆香蒜', '加入蔬菜翻炒', '调味']
      },
      { 
        id: 'dish_17', 
        name: '凉拌黄瓜', 
        categoryId: 'cate_vegs', 
        categoryName: '蔬菜类', 
        imageUrl: '',
        ingredients: ['黄瓜', '蒜泥', '醋', '生抽', '香油'],
        instructions: ['黄瓜拍碎', '加入调料拌匀']
      },

      { 
        id: 'dish_18', 
        name: '番茄蛋汤', 
        categoryId: 'cate_soup', 
        categoryName: '汤羹类', 
        imageUrl: '',
        ingredients: ['番茄', '鸡蛋', '葱花', '盐'],
        instructions: ['番茄炒出汁', '加水煮开', '倒入蛋花', '调味撒葱花']
      },
      { 
        id: 'dish_19', 
        name: '冬瓜排骨汤', 
        categoryId: 'cate_soup', 
        categoryName: '汤羹类', 
        imageUrl: '',
        ingredients: ['排骨', '冬瓜', '姜片', '盐'],
        instructions: ['排骨焯水', '加水和姜片炖煮', '加入冬瓜', '炖至软烂调味']
      },
      { 
        id: 'dish_20', 
        name: '紫菜蛋花汤', 
        categoryId: 'cate_soup', 
        categoryName: '汤羹类', 
        imageUrl: '',
        ingredients: ['紫菜', '鸡蛋', '葱花', '盐', '香油'],
        instructions: ['水烧开', '加入紫菜', '倒入蛋花', '调味撒葱花']
      },
      { 
        id: 'dish_21', 
        name: '雪菜豆腐汤', 
        categoryId: 'cate_soup', 
        categoryName: '汤羹类', 
        imageUrl: '',
        ingredients: ['雪菜', '嫩豆腐', '肉丝', '姜丝'],
        instructions: ['肉丝腌制', '炒香雪菜和肉丝', '加水煮开', '加入豆腐煮制']
      },

      { 
        id: 'dish_22', 
        name: '银耳羹', 
        categoryId: 'cate_dessert', 
        categoryName: '甜点类', 
        imageUrl: '',
        ingredients: ['银耳', '冰糖', '枸杞'],
        instructions: ['银耳泡发撕小朵', '加水炖煮', '加入冰糖和枸杞']
      },
      { 
        id: 'dish_23', 
        name: '红豆汤', 
        categoryId: 'cate_dessert', 
        categoryName: '甜点类', 
        imageUrl: '',
        ingredients: ['红豆', '冰糖'],
        instructions: ['红豆浸泡', '加水煮制', '加入冰糖']
      },
      { 
        id: 'dish_24', 
        name: '绿豆汤', 
        categoryId: 'cate_dessert', 
        categoryName: '甜点类', 
        imageUrl: '',
        ingredients: ['绿豆', '冰糖'],
        instructions: ['绿豆洗净', '加水煮制', '加入冰糖']
      },
      { 
        id: 'dish_25', 
        name: '奶油蛋糕', 
        categoryId: 'cate_dessert', 
        categoryName: '甜点类', 
        imageUrl: '',
        ingredients: ['鸡蛋', '面粉', '奶油', '糖'],
        instructions: ['打发蛋液', '加入面粉拌匀', '烘烤', '涂抹奶油']
      },
      { 
        id: 'dish_26', 
        name: '水果拼盘', 
        categoryId: 'cate_dessert', 
        categoryName: '甜点类', 
        imageUrl: '',
        ingredients: ['时令水果'],
        instructions: ['水果洗净切块', '摆盘']
      },
    ] as Dish[],
  }),
  actions: {
    next7Days(){ return genNext7Days(); },
  }
});