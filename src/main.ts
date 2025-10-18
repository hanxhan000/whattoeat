import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

// 新增：路由、Pinia、Vant样式
import { createPinia } from 'pinia'
import { router } from './router'
import 'vant/lib/index.css'
import { Button, NavBar, Cell, CellGroup, Field, Tabbar, TabbarItem, List, Search, Sidebar, SidebarItem, Stepper, SubmitBar, ActionSheet, Tabs, Tab, Image } from 'vant'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(Button)
app.use(NavBar)
app.use(Cell)
app.use(CellGroup)
app.use(Field)
app.use(Tabbar)
app.use(TabbarItem)
app.use(List)
app.use(Search)
// 新增
app.use(Sidebar)
app.use(SidebarItem)
app.use(Stepper)
app.use(SubmitBar)
app.use(ActionSheet)
app.use(Tabs)
app.use(Tab)
app.use(Image)
app.mount('#app')
