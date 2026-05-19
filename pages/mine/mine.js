// 我的页面
const cardService = require('../../utils/cardService.js')
const api = require('../../utils/api.js')
const i18n = require('../../utils/i18n.js')
const { getNavBarStyle } = require('../../utils/navBar.js')
const app = getApp()

Page({
  data: {
    userInfo: null,
    hasLogin: false,
    // 头像临时路径（用于预览）
    tempAvatarPath: '',
    i18nTexts: {},
    commonTexts: {},
    supportedLangs: [],
    currentLang: 'zh',
    showLangPicker: false
  },

  onLoad() {
    this.setData(getNavBarStyle())
    this.initI18n()
  },

  onShow() {
    this.initI18n()
    this.loadUserInfo()
  },

  // 初始化多语言
  initI18n() {
    const currentLang = i18n.getLocale()
    this.setData({
      i18nTexts: i18n.getTexts('mine'),
      commonTexts: i18n.getCommonTexts(),
      supportedLangs: i18n.getSupportedLanguages(),
      currentLang
    })
  },

  // 切换语言
  onToggleLangPicker() {
    this.setData({ showLangPicker: !this.data.showLangPicker })
  },

  onSelectLang(e) {
    const code = e.currentTarget.dataset.lang
    if (code === this.data.currentLang) {
      this.setData({ showLangPicker: false })
      return
    }
    i18n.setLocale(code)
    this.setData({
      currentLang: code,
      showLangPicker: false
    })
    // 重新初始化各页面文本
    this.initI18n()
  },

  // 获取手机号授权登录
  async onGetPhoneNumber(e) {
    const { errMsg, code, encryptedData, iv } = e.detail

    if (errMsg !== 'getPhoneNumber:ok') {
      // 用户取消或拒绝授权
      if (errMsg === 'getPhoneNumber:fail user deny') {
        wx.showToast({ title: i18n.t('mine.authCanceled'), icon: 'none' })
      }
      return
    }

    wx.showLoading({ title: i18n.t('common.loginProcessing') })

    try {
      // 调用后端接口进行手机号登录
      const result = await api.phoneLogin({
        code: code,
        encryptedData: encryptedData,
        iv: iv
      })

      if (result && result.token && result.userInfo) {
        // 登录成功，保存用户信息
        // 清除旧登录状态
        app.clearLoginStatus()
        
        // 保存新的 token 和用户信息
        app.setToken(result.token)
        app.setUserInfo(result.userInfo)
        app.globalData.hasLogin = true

        this.setData({
          userInfo: result.userInfo,
          hasLogin: true
        })

        this.initI18n()
        wx.showToast({ title: i18n.t('common.loginSuccess'), icon: 'success' })
      } else {
        throw new Error(i18n.t('mine.loginFailedShort'))
      }
    } catch (err) {
      console.error('手机号登录失败:', err)
      wx.showToast({
        title: i18n.t('common.loginFailed'),
        icon: 'none'
      })
    }
  },

  loadUserInfo() {
    // 优先从全局数据获取（缓存）
    const globalUserInfo = app.globalData.userInfo
    const globalHasLogin = app.globalData.hasLogin

    if (globalHasLogin && globalUserInfo) {
      this.setData({
        userInfo: globalUserInfo,
        hasLogin: true
      })
    } else {
      // 未登录状态
      this.setData({
        userInfo: null,
        hasLogin: false
      })
    }
  },

  // 从服务器刷新用户信息
  async refreshUserInfo() {
    try {
      const userInfo = await api.getUserInfo()
      if (userInfo) {
        app.setUserInfo(userInfo)
        this.setData({
          userInfo: userInfo,
          hasLogin: true
        })
      }
    } catch (err) {
      // 未登录或 token 过期
      this.setData({ hasLogin: false })
    }
  },

  // 选择头像（使用微信 chooseAvatar 能力）
  onChooseAvatar(e) {
    const avatarUrl = e.detail.avatarUrl
    if (!avatarUrl) return

    this.setData({ tempAvatarPath: avatarUrl })

    // 上传头像到服务器
    this.uploadAndUpdateAvatar(avatarUrl)
  },

  // 上传头像并更新用户信息
  async uploadAndUpdateAvatar(tempPath) {
    wx.showLoading({ title: i18n.t('common.updating') })
    try {
      // 先上传图片到服务器
      const serverUrl = await cardService.uploadImage(tempPath)
      // 再更新用户信息
      const userInfo = await api.updateUserInfo(undefined, serverUrl)
      app.setUserInfo(userInfo)
      this.setData({
        userInfo: userInfo,
        tempAvatarPath: ''
      })
      wx.showToast({ title: i18n.t('common.updateSuccess'), icon: 'success' })
    } catch (err) {
      console.error('更新头像失败:', err)
      wx.showToast({ title: i18n.t('common.updateFailed'), icon: 'none' })
    }
    wx.hideLoading()
  },

  // 获取昵称回调
  onNicknameConfirm(e) {
    const nickname = e.detail.value
    if (!nickname || !nickname.trim()) return

    this.updateNickname(nickname.trim())
  },

  // 更新昵称
  async updateNickname(nickname) {
    try {
      const userInfo = await api.updateUserInfo(nickname, undefined)
      app.setUserInfo(userInfo)
      this.setData({ userInfo })
      wx.showToast({ title: i18n.t('common.updateSuccess'), icon: 'success' })
    } catch (err) {
      console.error('更新昵称失败:', err)
      wx.showToast({ title: i18n.t('common.updateFailed'), icon: 'none' })
    }
  },

  // 点击登录
  async onTapLogin() {
    if (this.data.hasLogin) return

    // 先获取微信用户信息（昵称和头像）
    const profileRes = await new Promise((resolve) => {
      wx.getUserProfile({
        desc: '用于完善您的个人资料',
        success: resolve,
        fail: () => resolve(null)
      })
    })

    if (!profileRes) {
      wx.showToast({ title: i18n.t('mine.loginRequired'), icon: 'none' })
      return
    }

    const { nickName, avatarUrl } = profileRes.userInfo

    wx.showLoading({ title: i18n.t('common.loginProcessing') })
    try {
      await app.silentLoginWithProfile(nickName, avatarUrl)
      this.loadUserInfo()
      wx.showToast({ title: i18n.t('common.loginSuccess'), icon: 'success' })
    } catch (err) {
      wx.showToast({ title: i18n.t('common.loginFailed'), icon: 'none' })
    }
    wx.hideLoading()
  },

  // 简化一键登录（无需授权，快速登录）
  async onTapSimpleLogin() {
    if (this.data.hasLogin) return

    wx.showLoading({ title: '登录中...' })
    
    try {
      // 静默登录：只获取 code，不获取用户信息
      const loginRes = await new Promise((resolve, reject) => {
        wx.login({
          success: resolve,
          fail: reject
        })
      })

      if (!loginRes.code) {
        throw new Error('获取登录凭证失败')
      }

      // 调用后端简化登录接口
      const result = await api.simpleLogin(loginRes.code)

      if (result && result.token && result.userInfo) {
        // 登录成功，保存用户信息
        app.clearLoginStatus()
        
        // 保存新的 token 和用户信息
        app.setToken(result.token)
        app.setUserInfo(result.userInfo)
        app.globalData.hasLogin = true

        this.setData({
          userInfo: result.userInfo,
          hasLogin: true
        })

        this.initI18n()
        wx.showToast({ title: '登录成功', icon: 'success' })
      } else {
        throw new Error('登录失败：返回数据不完整')
      }
    } catch (err) {
      console.error('简化登录失败:', err)
      // 网络错误（手机实际测试常见）：后端不可达
      const errMsg = err.message || err.errMsg || ''
      if (errMsg.includes('fail') || err.code === -1) {
        wx.showModal({
          title: '登录失败',
          content: '后端服务未启动或地址配置有误，请在 utils/api.js 中确认 API_BASE_URL 配置',
          confirmText: '知道了',
          showCancel: false
        })
      } else {
        wx.showToast({
          title: '登录失败，请重试',
          icon: 'none',
          duration: 3000
        })
      }
    } finally {
      wx.hideLoading()
    }
  },

  // 检查登录状态，未登录则弹窗提示
  checkLogin() {
    if (this.data.hasLogin && this.data.userInfo) {
      return true
    }
    wx.showModal({
      title: i18n.t('common.loading'),
      content: i18n.t('common.pleaseLoginFirst'),
      confirmText: i18n.t('common.confirm'),
      cancelText: i18n.t('common.no'),
      success: (res) => {
        if (res.confirm) {
          this.onTapLogin()
        }
      }
    })
    return false
  },

  // 创建名片
  onCreateCard() {
    const globalHasLogin = app.globalData.hasLogin
    const globalUserInfo = app.globalData.userInfo
    
    if (!globalHasLogin || !globalUserInfo) {
      // 未登录，跳转到我的页面并提示
      wx.switchTab({
        url: '/pages/mine/mine'
      })
      wx.showToast({
        title: '请登录！',
        icon: 'none',
        duration: 2000
      })
      return
    }
    
    // 已登录，直接进入名片详情页（如果有名片）或创建页
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  // 查看全部名片
  onViewAllCards() {
    if (!this.checkLogin()) return
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  // 编辑公司简介
  onEditCompanyIntro() {
    if (!this.checkLogin()) return
    wx.navigateTo({
      url: '/pages/company-intro/company-intro'
    })
  },

  // 切换账号
  onSwitchAccount() {
    wx.showModal({
      title: i18n.t('mine.switchAccountTitle'),
      content: i18n.t('mine.switchAccountContent'),
      confirmText: i18n.t('common.confirm'),
      cancelText: i18n.t('common.cancel'),
      success: (res) => {
        if (res.confirm) {
          this.doLogout(true)
        }
      }
    })
  },

  // 退出登录
  onLogout() {
    wx.showModal({
      title: i18n.t('mine.logoutTitle'),
      content: i18n.t('mine.logoutContent'),
      confirmText: i18n.t('common.confirm'),
      cancelText: i18n.t('common.cancel'),
      confirmColor: '#e53e3e',
      success: (res) => {
        if (res.confirm) {
          this.doLogout()
        }
      }
    })
  },

  // 执行退出登录
  // @param {boolean} relogin - 是否自动重新登录（切换账号时为 true）
  doLogout(relogin = false) {
    // 使用统一方法清除登录状态
    app.clearLoginStatus()
    // 重置页面数据
    this.setData({
      userInfo: null,
      hasLogin: false,
      tempAvatarPath: ''
    })
    wx.showToast({ title: i18n.t('mine.loggedOut'), icon: 'success' })

    // 切换账号：自动弹出登录
    if (relogin) {
      setTimeout(() => {
        this.onTapLogin()
      }, 1500)
    }
  }
})
