// 名片详情页面
const cardService = require('../../utils/cardService.js')
const api = require('../../utils/api.js')
const i18n = require('../../utils/i18n.js')
const { generateShareCardWithHint } = require('../../utils/shareImage.js')
const { getNavBarStyle } = require('../../utils/navBar.js')

Page({
  data: {
    card: null,
    shareImagePath: '',
    companyIntro: '',
    companyIntroHtml: '',
    isSharedView: false,           // 是否为分享进来的只读视图
    i18nTexts: {},
    commonTexts: {},
    // 名片内容翻译
    translateLang: 'zh',           // 当前翻译目标语言
    translated: null,              // 翻译后的内容 { name, position, company, address, introduction }
    isTranslating: false,          // 是否正在翻译
    showTranslatePicker: false,    // 是否显示翻译语言选择器
    supportedTransLangs: [
      { code: 'zh', nativeName: '中文' },
      { code: 'en', nativeName: 'English' },
      { code: 'ko', nativeName: '한국어' },
      { code: 'ru', nativeName: 'Русский' },
      { code: 'es', nativeName: 'Español' }
    ]
  },

  onLoad(options) {
    const navInfo = getNavBarStyle()
    // 让 top-bg 背景装饰延伸到导航栏下方
    const navBarHeightPx = parseFloat(navInfo.navBarStyle.match(/height:\s*([\d.]+)/)?.[1] || 88)
    const topBgStyle = `height: ${Math.max(260, navBarHeightPx + 100)}px;`
    this.setData({ ...navInfo, topBgStyle })
    this.initI18n()
    // 检测是否为分享进来的只读模式
    if (options.share === '1' || options.share === 'true') {
      this.setData({ isSharedView: true })
    }
    const companyIntro = wx.getStorageSync('companyIntro') || ''
    this.setData({
      companyIntro,
      companyIntroHtml: this.formatIntroHtml(companyIntro)
    })

    if (options.id) {
      // 优先使用 API 获取完整名片数据（含 translations）
      this.loadCardFromApi(options.id)
    }
  },

  onShow() {
    this.initI18n()
    const companyIntro = wx.getStorageSync('companyIntro') || ''
    this.setData({
      companyIntro,
      companyIntroHtml: this.formatIntroHtml(companyIntro)
    })
  },

  initI18n() {
    this.setData({
      i18nTexts: i18n.getTexts('cardDetail'),
      commonTexts: i18n.getCommonTexts()
    })
  },

  // 从 API 加载名片
  async loadCardFromApi(id) {
    try {
      const card = await cardService.getCardById(id)
      if (card) {
        this.setData({ card })
        this.prepareShareImage(card)
      } else {
        wx.showToast({
          title: i18n.t('cardDetail.cardNotExist'),
          icon: 'none'
        })
        setTimeout(() => wx.navigateBack(), 1500)
      }
    } catch (err) {
      // 降级：使用本地存储
      const card = cardService.getCardById(id)
      if (card) {
        this.setData({ card })
        this.prepareShareImage(card)
      } else {
        wx.showToast({ title: i18n.t('cardDetail.cardNotExist'), icon: 'none' })
        setTimeout(() => wx.navigateBack(), 1500)
      }
    }
  },

  // ===== 名片内容翻译 =====

  // 切换翻译语言选择器
  onToggleTranslate() {
    this.setData({
      showTranslatePicker: !this.data.showTranslatePicker
    })
  },

  // 选择翻译语言
  onSelectTranslateLang(e) {
    const lang = e.currentTarget.dataset.lang
    const { translateLang, card, translated } = this.data

    if (lang === translateLang) {
      this.setData({ showTranslatePicker: false })
      return
    }

    // 如果之前已经翻译过同一语言，直接切换显示
    if (translated && lang !== 'zh') {
      this.setData({
        translateLang: lang,
        showTranslatePicker: false
      })
      return
    }

    // 中文不需要翻译
    if (lang === 'zh') {
      this.setData({
        translateLang: 'zh',
        translated: null,
        showTranslatePicker: false
      })
      return
    }

    // 调用后端翻译接口
    this.doTranslate(card, lang)
  },

  // 执行翻译
  async doTranslate(card, lang) {
    this.setData({ isTranslating: true })
    try {
      const result = await api.translateCard(card.id, lang)
      this.setData({
        translated: result,
        translateLang: lang,
        isTranslating: false,
        showTranslatePicker: false
      })
    } catch (err) {
      this.setData({ isTranslating: false })
      wx.showToast({ title: i18n.t('common.saveFailed'), icon: 'none' })
    }
  },

  // 格式化公司简介，将换行符转换为HTML
  formatIntroHtml(text) {
    if (!text) return ''
    // 将换行符转换为 <br/> 标签
    return text.replace(/\n/g, '<br/>')
  },

  // 预先生成分享图片
  prepareShareImage(card) {
    generateShareCardWithHint(card, (tempPath) => {
      this.setData({ shareImagePath: tempPath })
    })
  },

  onShareAppMessage() {
    const { card, shareImagePath } = this.data
    if (card) {
      const title = card.position
        ? i18n.t('cardDetail.shareWithPosition', { name: card.name, position: card.position })
        : i18n.t('cardDetail.shareSimple', { name: card.name })
      return {
        title,
        path: `/pages/card-detail/card-detail?id=${card.id}&share=1`,
        imageUrl: shareImagePath || ''
      }
    }
  },

  onShareTimeline() {
    const { card, shareImagePath } = this.data
    if (card) {
      return {
        title: i18n.t('cardDetail.shareSimple', { name: card.name }),
        query: `id=${card.id}&share=1`,
        imageUrl: shareImagePath || ''
      }
    }
  },

  // 分享名片
  onShareCard() {
    const { card, shareImagePath } = this.data
    if (!card) return
    
    // 直接调起分享
    const title = card.position
      ? i18n.t('cardDetail.shareWithPosition', { name: card.name, position: card.position })
      : i18n.t('cardDetail.shareSimple', { name: card.name })
    wx.shareAppMessage({
      title,
      path: `/pages/card-detail/card-detail?id=${card.id}&share=1`,
      imageUrl: shareImagePath || ''
    })
  },

  // 拨打电话
  onCallPhone() {
    const { phone } = this.data.card
    if (phone) {
      wx.makePhoneCall({
        phoneNumber: phone
      })
    }
  },

  // 添加微信好友
  onAddWechat() {
    wx.showModal({
      title: i18n.t('cardDetail.addWechatTitle'),
      content: i18n.t('cardDetail.addWechatContent'),
      confirmText: i18n.t('cardDetail.copy'),
      success: (res) => {
        if (res.confirm) {
          wx.setClipboardData({
            data: this.data.card.wechat || '',
            success: () => {
              wx.showToast({
                title: i18n.t('cardDetail.wechatCopied'),
                icon: 'success'
              })
            }
          })
        }
      }
    })
  },

  // 复制信息
  onCopyInfo(e) {
    const { text } = e.currentTarget.dataset
    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({
          title: i18n.t('cardDetail.copied'),
          icon: 'success'
        })
      }
    })
  },

  // 预览图片
  onPreviewImage(e) {
    const { url } = e.currentTarget.dataset
    wx.previewImage({
      current: url,
      urls: this.data.card.images || [url]
    })
  },

  // 返回上一页
  onBack() {
    wx.navigateBack()
  },

  // 添加到通讯录
  onAddContact() {
    const { card } = this.data
    if (!card) return
    wx.showToast({
      title: i18n.t('cardDetail.savedToContacts'),
      icon: 'success'
    })
  },

  // 编辑名片
  onEditCard() {
    const { card } = this.data
    if (card && card.id) {
      wx.navigateTo({
        url: `/pages/card-edit/card-edit?id=${card.id}`
      })
    }
  }
})
