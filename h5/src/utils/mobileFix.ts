// 移动端兼容性修复工具
export function initMobileFix() {
  // 检测移动端环境
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  const isWeChat = /MicroMessenger/i.test(navigator.userAgent)
  
  if (isMobile) {
    console.log('初始化移动端修复...')
    
    // 修复iOS Safari的100vh问题
    const setVH = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }
    
    setVH()
    window.addEventListener('resize', setVH)
    window.addEventListener('orientationchange', setVH)
    
    // 修复微信浏览器兼容性
    if (isWeChat) {
      console.log('微信浏览器环境检测')
      
      // 修复微信浏览器的点击延迟
      document.addEventListener('DOMContentLoaded', () => {
        const style = document.createElement('style')
        style.textContent = `
          * {
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
          
          input, textarea {
            -webkit-user-select: auto;
            -khtml-user-select: auto;
            -moz-user-select: auto;
            -ms-user-select: auto;
            user-select: auto;
          }
        `
        document.head.appendChild(style)
      })
    }
    
    // 修复移动端字体渲染
    const fontStyle = document.createElement('style')
    fontStyle.textContent = `
      body {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
        font-feature-settings: "liga" 1, "kern" 1;
      }
      
      /* 确保所有元素可见 */
      * {
        visibility: visible !important;
        opacity: 1 !important;
      }
      
      /* 修复可能的z-index问题 */
      .van-nav-bar,
      .van-tabbar,
      .van-popup,
      .van-overlay {
        z-index: 9999 !important;
      }
    `
    document.head.appendChild(fontStyle)
    
    // 监听页面加载完成
    document.addEventListener('DOMContentLoaded', () => {
      console.log('DOM加载完成，检查元素可见性')
      
      // 检查关键元素是否存在
      const app = document.getElementById('app')
      const routerView = document.querySelector('.home, .order, .plan')
      
      console.log('关键元素检查:', {
        app: !!app,
        routerView: !!routerView,
        appChildren: app?.children.length || 0
      })
      
      // 如果页面内容不可见，强制显示
      if (app && app.children.length === 0) {
        console.warn('应用内容为空，尝试重新渲染')
        setTimeout(() => {
          location.reload()
        }, 2000)
      }
    })
  }
  
  return { isMobile, isWeChat }
}
