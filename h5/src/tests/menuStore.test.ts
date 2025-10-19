// 简单的测试函数
function assertEquals(actual: any, expected: any, message: string = '') {
  if (actual !== expected) {
    throw new Error(`Assertion failed: ${message}. Expected ${expected}, but got ${actual}`);
  }
}

function assertContains(actual: string, expected: string, message: string = '') {
  if (actual.indexOf(expected) === -1) {
    throw new Error(`Assertion failed: ${message}. Expected ${actual} to contain ${expected}`);
  }
}

function assertLength(actual: any[], expected: number, message: string = '') {
  if (actual.length !== expected) {
    throw new Error(`Assertion failed: ${message}. Expected length ${expected}, but got ${actual.length}`);
  }
}

// 模拟Pinia的创建函数
function createPinia() {
  return {};
}

function setActivePinia(_pinia: any) {
  // 空实现
}

// 导入菜单存储
import { useMenuStore } from '../stores/menu';

// 测试函数
function testMenuStore() {
  // 创建一个新的 pinia 实例并使其处于激活状态
  setActivePinia(createPinia());
  
  const menuStore = useMenuStore();
  
  // 测试分类初始化
  if (menuStore.categories) {
    assertLength(menuStore.categories, 5, 'should initialize with default categories');
    if (menuStore.categories[0]) {
      assertEquals(menuStore.categories[0].id, 'cate_main', 'first category should have correct id');
      assertEquals(menuStore.categories[0].name, '主食类', 'first category should have correct name');
    }
  }
  
  // 测试生成未来7天
  const days = menuStore.next7Days();
  assertLength(days, 7, 'should generate next 7 days');
  if (days[0]) {
    assertContains(days[0].label, '今天', 'first day should contain "今天"');
  }
  
  // 测试菜品搜索
  // 添加一些测试菜品
  menuStore.dishes = [
    {
      id: '1',
      name: '白米饭',
      categoryId: 'cate_main',
      categoryName: '主食类',
      imageUrl: ''
    },
    {
      id: '2',
      name: '红烧肉',
      categoryId: 'cate_protein',
      categoryName: '蛋白质类',
      imageUrl: ''
    }
  ];
  
  const results = menuStore.search('白米');
  assertLength(results, 1, 'should find one dish');
  if (results[0]) {
    assertEquals(results[0].name, '白米饭', 'should find the correct dish');
  }
  
  console.log('All tests passed!');
}

// 运行测试
testMenuStore();