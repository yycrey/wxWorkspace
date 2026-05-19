/**
 * 导航栏适配工具
 * 根据微信胶囊按钮（右上角三个点+关闭）位置，动态计算导航栏高度
 * 确保导航栏内容不高于胶囊按钮，适配不同机型（刘海屏、灵动岛、普通屏等）
 */

/**
 * 获取导航栏计算样式
 * 返回对象包含 navBarStyle 和 navContentStyle，可直接用于 WXML 内联 style
 *
 * 计算逻辑：
 *   nav-bar 从屏幕顶部延伸到胶囊按钮下方
 *   padding-top = 状态栏高度（避开状态栏）
 *   总高度 = 状态栏 + 胶囊上方间距 + 胶囊高度 + 胶囊下方间距（对称）
 *   nav-content 高度 = 胶囊高度
 */
function getNavBarStyle() {
  try {
    const systemInfo = wx.getSystemInfoSync()
    const menuButton = wx.getMenuButtonBoundingClientRect()

    const statusBarHeight = systemInfo.statusBarHeight || 20
    const capsuleTop = menuButton.top
    const capsuleHeight = menuButton.height || 32

    // 胶囊上方到状态栏底部的间距
    const gap = capsuleTop - statusBarHeight
    // 导航栏总高度 = 顶部间距 + 胶囊区域 + 底部对称间距
    const navBarHeight = statusBarHeight + gap + capsuleHeight + gap

    return {
      navBarStyle: `padding-top: ${statusBarHeight}px; height: ${navBarHeight}px;`,
      navContentStyle: `height: ${capsuleHeight}px;`
    }
  } catch (e) {
    // 兜底：开发者工具中可能获取失败
    console.warn('getNavBarStyle 获取失败，使用默认值', e)
    return {
      navBarStyle: 'padding-top: 44px; height: 88px;',
      navContentStyle: 'height: 32px;'
    }
  }
}

module.exports = { getNavBarStyle }
