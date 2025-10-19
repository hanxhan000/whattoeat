import './style.css'
import { createApp } from 'vue'
import App from './App.vue'
import { setupErrorHandler } from './utils/errorHandler'

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
  Overlay
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

// 挂载应用
app.mount('#app')

// 挂载完成后标记成功并清理看门狗，避免误降级
;(window as unknown as { __app_mounted?: boolean }).__app_mounted = true
try { 
  const timeoutId = (window as unknown as { __app_bootstrap_timeout?: number }).__app_bootstrap_timeout;
  if (timeoutId) clearTimeout(timeoutId);
} catch (_) {}