// 名片列表页面
const cardService = require('../../utils/cardService.js')
const i18n = require('../../utils/i18n.js')
const config = require('../../utils/config.js')
const { getNavBarStyle } = require('../../utils/navBar.js')
const app = getApp()

Page({
  data: {
    cardList: [],
    isLoading: false,
    i18nTexts: {},
    commonTexts: {}
  },

  onLoad() {
    this.setData(getNavBarStyle())
    this.initI18n()
    this.loadCardList()
  },

  onShow() {
    this.initI18n()
    this.loadCardList()
  },

  initI18n() {
    this.setData({
      i18nTexts: i18n.getTexts('index'),
      commonTexts: i18n.getCommonTexts()
    })
  },

  // 加载名片列表
  async loadCardList() {
    this.setData({ isLoading: true })

    try {
      const cards = await cardService.getCardList()
      this.setData({
        cardList: Array.isArray(cards) ? cards : [],
        isLoading: false
      })
    } catch (err) {
      console.error('加载名片列表失败', err)
      this.setData({
        cardList: [],
        isLoading: false
      })
    }
  },

  // 创建名片
  onCreateCard() {
    // 检查登录状态（仅当 REQUIRE_LOGIN 开启时）
    if (config.REQUIRE_LOGIN) {
      const globalHasLogin = app.globalData.hasLogin
      const globalUserInfo = app.globalData.userInfo

      if (!globalHasLogin || !globalUserInfo) {
        wx.switchTab({
          url: '/pages/mine/mine'
        })
        wx.showToast({
          title: i18n.tChinese('common.pleaseLogin'),
          icon: 'none',
          duration: 2000
        })
        return
      }
    }

    wx.navigateTo({
      url: '/pages/card-edit/card-edit'
    })
  },

  // 点击名片跳转详情页
  onGoToDetail(e) {
    const { id } = e.currentTarget.dataset
    if (id) {
      wx.navigateTo({
        url: `/pages/card-detail/card-detail?id=${id}`
      })
    }
  },

  // 编辑名片
  onEditCard(e) {
    const { id } = e.currentTarget.dataset
    if (id) {
      wx.navigateTo({
        url: `/pages/card-edit/card-edit?id=${id}`
      })
    }
    // 阻止事件冒泡，避免触发onGoToDetail
  },

  // 删除名片
  onDeleteCard(e) {
    const { id, name } = e.currentTarget.dataset
    if (!id) return

    wx.showModal({
      title: '删除确认',
      content: `确定要删除「${name || '未命名名片'}」吗？删除后不可恢复。`,
      cancelText: '取消',
      confirmText: '删除',
      confirmColor: '#e53e3e',
      success: async (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '删除中...' })
          try {
            await cardService.deleteCard(id)
            wx.hideLoading()
            wx.showToast({ title: '删除成功', icon: 'success' })
            this.loadCardList()
          } catch (err) {
            wx.hideLoading()
            wx.showToast({ title: '删除失败', icon: 'none' })
          }
        }
      }
    })
  },

  // 预览图片
  onPreviewImage(e) {
    const { src } = e.currentTarget.dataset
    wx.previewImage({
      current: src,
      urls: [src]
    })
  }
})
