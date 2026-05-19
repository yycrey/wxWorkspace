// 名片背景模板页面
const i18n = require('../../utils/i18n.js')
const { getNavBarStyle } = require('../../utils/navBar.js')

Page({
  data: {
    currentBg: '',
    presetBgs: [
      'https://picsum.photos/400/200?random=1',
      'https://picsum.photos/400/200?random=2',
      'https://picsum.photos/400/200?random=3',
      'https://picsum.photos/400/200?random=4',
      'https://picsum.photos/400/200?random=5',
      'https://picsum.photos/400/200?random=6'
    ],
    customBgs: [],
    i18nTexts: {},
    commonTexts: {}
  },

  onLoad() {
    this.setData(getNavBarStyle())
    this.initI18n()
    // 读取当前背景和自定义背景
    const currentBg = wx.getStorageSync('cardBackground') || ''
    const customBgs = wx.getStorageSync('customBackgrounds') || []
    this.setData({ currentBg, customBgs })
  },

  onShow() {
    this.initI18n()
  },

  initI18n() {
    this.setData({
      i18nTexts: i18n.getTexts('cardBg'),
      commonTexts: i18n.getCommonTexts()
    })
  },

  // 选择背景
  onSelectBg(e) {
    const { bg } = e.currentTarget.dataset
    const { currentBg } = this.data

    if (bg === currentBg) return

    wx.showModal({
      title: i18n.t('cardBg.changeBg'),
      content: i18n.t('cardBg.changeBgConfirm'),
      confirmText: i18n.t('common.confirm'),
      cancelText: i18n.t('common.cancel'),
      success: (res) => {
        if (res.confirm) {
          wx.setStorageSync('cardBackground', bg)
          this.setData({ currentBg: bg })
          wx.showToast({
            title: i18n.t('cardBg.changeSuccess'),
            icon: 'success'
          })
        }
      }
    })
  },

  // 上传自定义背景
  onUploadBg() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath
        const customBgs = [...this.data.customBgs, tempFilePath]
        
        wx.setStorageSync('customBackgrounds', customBgs)
        this.setData({ customBgs })
        
        wx.showToast({
          title: i18n.t('cardBg.uploadSuccess'),
          icon: 'success'
        })
      }
    })
  },

  // 删除自定义背景
  onDeleteCustomBg(e) {
    const { index } = e.currentTarget.dataset
    const { customBgs, currentBg } = this.data
    const deletedBg = customBgs[index]

    wx.showModal({
      title: i18n.t('cardBg.deleteBg'),
      content: i18n.t('cardBg.deleteBgConfirm'),
      confirmText: i18n.t('common.delete'),
      confirmColor: '#e53e3e',
      success: (res) => {
        if (res.confirm) {
          const newCustomBgs = customBgs.filter((_, i) => i !== index)
          wx.setStorageSync('customBackgrounds', newCustomBgs)
          
          // 如果删除的是当前使用的背景，清空当前背景
          if (deletedBg === currentBg) {
            wx.setStorageSync('cardBackground', '')
            this.setData({ currentBg: '' })
          }
          
          this.setData({ customBgs: newCustomBgs })
          wx.showToast({
            title: i18n.t('common.deleteSuccess'),
            icon: 'success'
          })
        }
      }
    })
  }
})
