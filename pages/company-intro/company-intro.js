// 公司简介编辑页面
const api = require('../../utils/api.js')
const i18n = require('../../utils/i18n.js')
const { getNavBarStyle } = require('../../utils/navBar.js')

// 切换模式：true = 使用API, false = 使用本地存储
const USE_API = true

Page({
  data: {
    companyIntro: '',
    i18nTexts: {},
    commonTexts: {}
  },

  onLoad() {
    this.setData(getNavBarStyle())
    this.initI18n()
    this.loadCompanyIntro()
  },

  initI18n() {
    this.setData({
      i18nTexts: i18n.getTexts('companyIntro'),
      commonTexts: i18n.getCommonTexts()
    })
  },

  // 加载公司简介
  async loadCompanyIntro() {
    if (USE_API) {
      try {
        const data = await api.getCompanyIntro()
        this.setData({ companyIntro: data.content || '' })
      } catch (err) {
        // 失败时使用本地缓存
        const companyIntro = wx.getStorageSync('companyIntro') || ''
        this.setData({ companyIntro })
      }
    } else {
      const companyIntro = wx.getStorageSync('companyIntro') || ''
      this.setData({ companyIntro })
    }
  },

  // 输入框绑定
  onInput(e) {
    this.setData({
      companyIntro: e.detail.value
    })
  },

  // 返回上一页
  onBack() {
    wx.navigateBack()
  },

  // 保存公司简介
  async onSave() {
    const { companyIntro } = this.data
    const content = companyIntro.trim()

    if (USE_API) {
      try {
        wx.showLoading({ title: i18n.t('common.saving') || '保存中...' })
        await api.saveCompanyIntro(content)
        wx.hideLoading()
        wx.showToast({
          title: i18n.t('common.saveSuccess'),
          icon: 'success'
        })
        // 同时保存到本地作为缓存
        wx.setStorageSync('companyIntro', content)
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      } catch (err) {
        wx.hideLoading()
        wx.showToast({
          title: i18n.t('common.saveFailed'),
          icon: 'none'
        })
      }
    } else {
      // 本地存储模式
      wx.setStorageSync('companyIntro', content)
      wx.showToast({
        title: i18n.t('common.saveSuccess'),
        icon: 'success'
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    }
  }
})
