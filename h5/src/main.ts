import './style.css'
import { createApp } from 'vue'
import App from './App.vue'
import { setupErrorHandler } from './utils/errorHandler'
import { initMobileFix } from './utils/mobileFix'

// 创建应用实例
const app = createApp(App)

// 设置全局错误处理
setupErrorHandler(app)

// 导入并配置Pinia状态管理
import { createPinia } from 'pinia'
app.use(createPinia())

// 导入并配置Vue Router
import { router } from './router'
app.use(router)

// 导入Vant组件库样式
import 'vant/lib/index.css'

// 按需导入Vant组件
import {
  // 基础组件
  Button,
  Icon,
  Image,
  Cell,
  CellGroup,
  NavBar,
  Tabbar,
  TabbarItem,
  
  // 表单组件
  Field,
  Stepper,
  SubmitBar,
  
  // 反馈组件
  Toast,
  Notify,
  
  // 导航组件
  Tab,
  Tabs,
  Sidebar,
  SidebarItem,
  
  // 展示组件
  List,
  Card,
  
  // 操作反馈
  ActionSheet,
  Dialog,
  
  // 其他组件
  Empty,
  Loading,
  Popup,
  Overlay,
  Checkbox
} from 'vant'

// 注册Vant组件
app.use(Button)
app.use(Icon)
app.use(Image)
app.use(Cell)
app.use(CellGroup)
app.use(NavBar)
app.use(Tabbar)
app.use(TabbarItem)
app.use(Field)
app.use(Stepper)
app.use(SubmitBar)
app.use(Toast)
app.use(Notify)
app.use(Tab)
app.use(Tabs)
app.use(Sidebar)
app.use(SidebarItem)
app.use(List)
app.use(Card)
app.use(ActionSheet)
app.use(Dialog)
app.use(Empty)
app.use(Loading)
app.use(Popup)
app.use(Overlay)
app.use(Checkbox)

// 初始化移动端修复
const { isMobile, isWeChat } = initMobileFix()

console.log('设备信息:', {
  userAgent: navigator.userAgent,
  isMobile,
  isWeChat,
  viewport: {
    width: window.innerWidth,
    height: window.innerHeight
  }
})

// 预加载云端数据（菜单）
import { useMenuStore } from './stores/menu'
const menuStore = useMenuStore()
menuStore.loadFromCloud().catch(err => console.warn('loadFromCloud failed', err))

// 挂载应用
try {
  app.mount('#app')
  console.log('App mounted successfully')
  
  // 移动端特定调试
  if (isMobile) {
    console.log('移动端环境检测完成')
    // 确保Vant组件正确加载
    setTimeout(() => {
      const vanElements = document.querySelectorAll('[class*="van-"]')
      console.log('Vant组件数量:', vanElements.length)
    }, 1000)
  }
} catch (error) {
  console.error('Failed to mount app:', error)
  // 显示错误信息
  const appElement = document.getElementById('app')
  if (appElement) {
    appElement.innerHTML = `
      <div style="padding: 20px; text-align: center; color: #333;">
        <h2>应用加载失败</h2>
        <p>设备: ${isMobile ? '移动端' : '桌面端'}</p>
        <p>微信: ${isWeChat ? '是' : '否'}</p>
        <p>错误: ${error instanceof Error ? error.message : String(error)}</p>
        <button onclick="location.reload()" style="padding: 10px 20px; background: #1989fa; color: white; border: none; border-radius: 4px;">刷新页面</button>
      </div>
    `
  }
}

// 挂载完成后标记成功并清理看门狗，避免误降级
;(window as unknown as { __app_mounted?: boolean }).__app_mounted = true
try { 
  const timeoutId = (window as unknown as { __app_bootstrap_timeout?: number }).__app_bootstrap_timeout;
  if (timeoutId) clearTimeout(timeoutId);
} catch (_) {}