// 应用入口
const api = require('./utils/api.js')
const i18n = require('./utils/i18n.js')

App({
  onLaunch() {
    console.log('电子名片展示系统已启动')
    // 强制使用中文显示（覆盖之前可能被设为英文的语言设置）
    i18n.setLocale('zh')
    // 初始化登录状态（从缓存恢复）
    this.initLoginStatus()
  },

  globalData: {
    userInfo: null,
    hasLogin: false
  },

  /**
   * 初始化登录状态：从缓存读取之前登录信息
   * 首次进入默认未登录，如果之前登录过则恢复状态
   */
  initLoginStatus() {
    // 优先从缓存读取用户信息
    const cachedUserInfo = wx.getStorageSync('userInfo')
    const cachedToken = wx.getStorageSync('token')

    if (cachedUserInfo && cachedToken) {
      // 之前登录过，恢复登录状态
      this.globalData.userInfo = cachedUserInfo
      this.globalData.hasLogin = true
      console.log('已恢复登录状态', cachedUserInfo)
      // 在后台静默验证 token 是否有效
      this.validateToken()
    } else {
      // 首次进入或已退出，默认未登录
      console.log('首次进入或已退出，默认未登录')
      this.globalData.userInfo = null
      this.globalData.hasLogin = false
    }
  },

  /**
   * 后台验证 token 是否有效（静默刷新）
   */
  async validateToken() {
    try {
      const userInfo = await api.getUserInfo()
      if (userInfo) {
        // token 有效，更新全局用户信息
        this.globalData.userInfo = userInfo
        this.globalData.hasLogin = true
        wx.setStorageSync('userInfo', userInfo)
        console.log('Token 验证成功', userInfo)
      } else {
        // token 失效，清除登录状态
        this.clearLoginStatus()
      }
    } catch (err) {
      // token 失效或网络错误，清除登录状态
      console.log('Token 验证失败，将清除登录状态')
      this.clearLoginStatus()
    }
  },

  /**
   * 静默登录：调用 wx.login 获取 code，发送到后端换取 token
   * 仅在用户主动点击登录或需要登录时调用
   */
  async silentLogin() {
    try {
      const loginRes = await new Promise((resolve, reject) => {
        wx.login({
          success: resolve,
          fail: reject
        })
      })

      if (!loginRes.code) {
        console.error('wx.login 未返回 code')
        return false
      }

      // 清除旧数据，防止新用户获取到旧用户信息
      this.clearLoginStatus()

      const result = await api.wxLogin(loginRes.code)
      if (result && result.token) {
        wx.setStorageSync('token', result.token)
        if (result.userInfo) {
          wx.setStorageSync('userInfo', result.userInfo)
          this.globalData.userInfo = result.userInfo
        }
        this.globalData.hasLogin = true
        console.log('登录成功', result.userInfo)
        return true
      }
      return false
    } catch (err) {
      console.error('登录失败:', err)
      // 登录失败时确保清除残留状态
      this.clearLoginStatus()
      return false
    }
  },

  /**
   * 带用户信息的登录：先获取 wx.login code，再连同昵称头像一起发送到后端
   * @param {string} nickname - 微信昵称
   * @param {string} avatarUrl - 微信头像URL
   */
  async silentLoginWithProfile(nickname, avatarUrl) {
    try {
      const loginRes = await new Promise((resolve, reject) => {
        wx.login({
          success: resolve,
          fail: reject
        })
      })

      if (!loginRes.code) {
        console.error('wx.login 未返回 code')
        return false
      }

      // 清除旧数据
      this.clearLoginStatus()

      const result = await api.wxLogin(loginRes.code, nickname, avatarUrl)
      if (result && result.token) {
        wx.setStorageSync('token', result.token)
        if (result.userInfo) {
          wx.setStorageSync('userInfo', result.userInfo)
          this.globalData.userInfo = result.userInfo
        }
        this.globalData.hasLogin = true
        console.log('登录成功', result.userInfo)
        return true
      }
      return false
    } catch (err) {
      console.error('登录失败:', err)
      this.clearLoginStatus()
      return false
    }
  },

  /**
   * 清除登录状态
   */
  clearLoginStatus() {
    wx.removeStorageSync('token')
    wx.removeStorageSync('userInfo')
    this.globalData.userInfo = null
    this.globalData.hasLogin = false
  },

  /**
   * 更新全局用户信息
   */
  setUserInfo(userInfo) {
    this.globalData.userInfo = userInfo
    if (userInfo) {
      wx.setStorageSync('userInfo', userInfo)
    }
  },

  /**
   * 保存登录 token
   */
  setToken(token) {
    if (token) {
      wx.setStorageSync('token', token)
    }
  }
})
