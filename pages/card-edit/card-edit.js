// 名片编辑页面
const cardService = require('../../utils/cardService.js')
const i18n = require('../../utils/i18n.js')
const config = require('../../utils/config.js')
const { getNavBarStyle } = require('../../utils/navBar.js')

// 切换模式：true = 使用API, false = 使用本地存储
const USE_API = true

// 并发冲突错误码
const ERROR_CODE_CONFLICT = 409

// 预设名片背景
const PRESET_BGS = [
  'https://picsum.photos/400/300?random=1',
  'https://picsum.photos/400/300?random=2',
  'https://picsum.photos/400/300?random=3',
  'https://picsum.photos/400/300?random=4',
  'https://picsum.photos/400/300?random=5',
  'https://picsum.photos/400/300?random=6'
]

Page({
  data: {
    isEdit: false,
    cardId: '',
    version: null,
    name: '',
    position: '',
    company: '',
    industry: '机械设备',  // 行业，默认机械设备
    phone: '',
    wechat: '',
    email: '',
    address: '',
    avatar: '',
    avatarUrl: '',
    portrait: '',
    portraitUrl: '',
    personalIntro: '',
    businessIntro: '',
    background: '',
    attachments: [],  // [{name:'', url:''}]
    i18nTexts: {},
    commonTexts: {},
    presetBgs: PRESET_BGS
  },

  onLoad(options) {
    this.setData(getNavBarStyle())
    this.initI18n()
    if (options.id) {
      this.loadCard(options.id)
    }
  },

  initI18n() {
    this.setData({
      i18nTexts: i18n.getTexts('cardEdit'),
      commonTexts: i18n.getCommonTexts()
    })
  },

  async loadCard(id) {
    if (USE_API) {
      try {
        const card = await cardService.getCardById(id)
        if (card) {
          let attachments = []
          try { attachments = JSON.parse(card.attachments || '[]') } catch (e) {}
          this.setData({
            isEdit: true,
            cardId: card.id,
            version: card.version || 0,
            name: card.name || '',
            position: card.position || '',
            company: card.company || '',
            industry: card.industry || '机械设备',
            phone: card.phone || '',
            wechat: card.wechat || '',
            email: card.email || '',
            address: card.address || '',
            avatar: '',
            avatarUrl: '',
            portrait: card.portrait || '',
            portraitUrl: card.portrait || '',
            personalIntro: card.personalIntro || '',
            businessIntro: card.businessIntro || '',
            background: card.background || '',
            attachments,
          })
        }
      } catch (err) {
        wx.showToast({ title: i18n.t('common.loadFailed'), icon: 'none' })
      }
    } else {
      const card = cardService.getCardById(id)
      if (card) {
        let attachments = []
        try { attachments = JSON.parse(card.attachments || '[]') } catch (e) {}
        this.setData({
          isEdit: true,
          cardId: card.id,
          version: card.version || 0,
          name: card.name || '',
          position: card.position || '',
          company: card.company || '',
          industry: card.industry || '机械设备',
          phone: card.phone || '',
          wechat: card.wechat || '',
          email: card.email || '',
          address: card.address || '',
          avatar: '',
          avatarUrl: '',
          portrait: card.portrait || '',
          portraitUrl: card.portrait || '',
          personalIntro: card.personalIntro || '',
          businessIntro: card.businessIntro || '',
          background: card.background || '',
          attachments,
        })
      }
    }
  },

  onInput(e) {
    const { field } = e.currentTarget.dataset
    this.setData({ [field]: e.detail.value })
  },

  // ===== 形象照选择 =====
  onSelectPortrait() {
    const self = this
    // 首选 wx.chooseMedia (新统一API，兼容性更好，无 F.copyFileToTemp bug)
    wx.chooseMedia({
      count: 1, mediaType: ['image'], sourceType: ['album', 'camera'],
      success: (res) => {
        if (res.tempFiles && res.tempFiles.length > 0) {
          const file = res.tempFiles[0]
          const maxSize = 5 * 1024 * 1024
          if (file.size > maxSize) {
            wx.showToast({ title: '形象照大小不能超过5MB', icon: 'none' })
            return
          }
          self.setData({ portrait: file.tempFilePath, portraitUrl: '' })
        }
      },
      fail: (err) => {
        console.error('chooseMedia 选择形象照失败:', err)
        // 兜底：让用户输入URL，下载后转为本地临时文件，统一走上传流程
        wx.showModal({
          title: '输入图片地址',
          content: '无法打开文件选择器，请输入图片URL（支持 http/https）',
          editable: true,
          placeholderText: 'https://example.com/image.jpg',
          success: (modalRes) => {
            if (modalRes.confirm && modalRes.content) {
              self.downloadAndSetImage(modalRes.content.trim(), 'portrait')
            }
          }
        })
      }
    })
  },

  /**
   * 下载远程图片为临时文件，并设置到指定字段
   * 确保无论何种来源的图片都走统一的上传流程
   */
  downloadAndSetImage(url, field) {
    const self = this
    wx.showLoading({ title: '下载图片中...' })
    wx.downloadFile({
      url: url,
      success: (res) => {
        wx.hideLoading()
        if (res.statusCode === 200 && res.tempFilePath) {
          self.setData({ [field]: res.tempFilePath })
          wx.showToast({ title: '已添加图片', icon: 'success' })
        } else {
          wx.showToast({ title: '图片下载失败，请检查URL', icon: 'none' })
        }
      },
      fail: (err) => {
        wx.hideLoading()
        console.error('下载图片失败:', err)
        // 极端降级：直接用URL（后端无法存储，但可展示）
        self.setData({ [field]: url })
        wx.showToast({ title: '已使用URL（仅预览）', icon: 'none' })
      }
    })
  },

  // ===== 模版选择 =====

  onBack() { wx.navigateBack() },

  // ===== 名片背景 =====
  onSelectBackground(e) {
    this.setData({ background: e.currentTarget.dataset.bg })
  },

  onClearBackground() {
    this.setData({ background: '' })
  },

  onUploadBackground() {
    const self = this
    wx.chooseMedia({
      count: 1, mediaType: ['image'], sourceType: ['album', 'camera'],
      success: (res) => {
        if (res.tempFiles && res.tempFiles.length > 0) {
          self.setData({ background: res.tempFiles[0].tempFilePath })
        }
      },
      fail: (err) => {
        console.error('chooseMedia 选择背景图片失败:', err)
        wx.showModal({
          title: '输入背景图片地址',
          content: '无法打开文件选择器，请输入图片URL地址',
          editable: true,
          placeholderText: 'https://example.com/bg.jpg',
          success: (modalRes) => {
            if (modalRes.confirm && modalRes.content) {
              self.downloadAndSetImage(modalRes.content.trim(), 'background')
            }
          }
        })
      }
    })
  },

  // ===== 附件管理 =====
  onSelectAttachment() {
    wx.chooseMessageFile({
      count: 1, type: 'file',
      success: (res) => {
        const file = res.tempFiles[0]
        const attachments = [...this.data.attachments, { name: file.name, url: file.path }]
        this.setData({ attachments })
      }
    })
  },

  onDeleteAttachment(e) {
    const { index } = e.currentTarget.dataset
    const attachments = this.data.attachments.filter((_, i) => i !== index)
    this.setData({ attachments })
  },

  // ===== 并发冲突处理 =====
  handleConflict(err) {
    const { latestCard, message } = err.data || {}
    wx.showModal({
      title: i18n.t('cardEdit.dataUpdated'),
      content: message || i18n.t('cardEdit.dataUpdatedContent'),
      confirmText: i18n.t('cardEdit.viewLatest'),
      cancelText: i18n.t('common.cancel'),
      success: (res) => {
        if (res.confirm && latestCard) {
          let attachments = []
          try { attachments = JSON.parse(latestCard.attachments || '[]') } catch (e) {}
          this.setData({
            version: latestCard.version || 0,
            name: latestCard.name || '',
            position: latestCard.position || '',
            company: latestCard.company || '',
            industry: latestCard.industry || '机械设备',
            phone: latestCard.phone || '',
            wechat: latestCard.wechat || '',
            email: latestCard.email || '',
            address: latestCard.address || '',
            avatar: '',
            avatarUrl: '',
            portrait: latestCard.portrait || '',
            portraitUrl: latestCard.portrait || '',
            personalIntro: latestCard.personalIntro || '',
            businessIntro: latestCard.businessIntro || '',
            background: latestCard.background || '',
            attachments
          })
          wx.showToast({ title: i18n.t('cardEdit.updatedToLatest'), icon: 'none' })
        }
      }
    })
  },

  // ===== 保存名片 =====
  async onSave() {
    const { name, position, company, industry, phone, wechat, email, address, personalIntro, businessIntro, version } = this.data

    if (!name || !name.trim()) {
      wx.showToast({ title: i18n.t('cardEdit.pleaseEnterName'), icon: 'none' })
      return
    }

    // ====== 独立登录流程 ======
    if (config.REQUIRE_LOGIN) {
      const app = getApp()
      wx.showLoading({ title: i18n.t('common.loginProcessing') })
      try {
        const loginRes = await new Promise((resolve, reject) => { wx.login({ success: resolve, fail: reject }) })
        const tokenRes = await new Promise((resolve, reject) => {
          wx.request({
            url: 'http://127.0.0.1:8080/api/auth/login', method: 'POST',
            data: { code: loginRes.code },
            header: { 'Content-Type': 'application/json' },
            success: resolve, fail: reject
          })
        })
        if (!tokenRes.data || tokenRes.data.code !== 0 || !tokenRes.data.data || !tokenRes.data.data.token) {
          wx.hideLoading()
          wx.showToast({ title: i18n.t('common.loginFailed'), icon: 'none' })
          return
        }
        const newToken = tokenRes.data.data.token
        wx.setStorageSync('token', newToken)
        wx.setStorageSync('userInfo', tokenRes.data.data.userInfo || {})
        app.globalData.hasLogin = true
        app.globalData.userInfo = tokenRes.data.data.userInfo || null
        wx.hideLoading()
      } catch (e) {
        wx.hideLoading()
        wx.showToast({ title: i18n.t('common.loginFailed'), icon: 'none' })
        return
      }
    }
    // ========================================

    wx.showLoading({ title: i18n.t('cardEdit.saving') })

    try {
      // 获取当前名片ID（编辑模式下有ID，创建模式下为null）
      const uploadCardId = this.data.isEdit ? this.data.cardId : null

      // 形象照上传
      let portraitUrl = this.data.portraitUrl || ''
      if (this.data.portrait && !this.data.portrait.startsWith('http://') && !this.data.portrait.startsWith('https://')) {
        try { portraitUrl = await cardService.uploadImage(this.data.portrait, 'portrait', uploadCardId) } catch (e) {
          wx.hideLoading(); wx.showToast({ title: '形象照上传失败', icon: 'none' }); return
        }
      } else if (this.data.portrait && this.data.portrait.startsWith('http')) {
        // 已经是URL（编辑时未修改），直接复用
        portraitUrl = this.data.portrait
      }

      // 背景上传
      let backgroundUrl = this.data.background || ''
      if (backgroundUrl && !backgroundUrl.startsWith('http://') && !backgroundUrl.startsWith('https://')) {
        try { backgroundUrl = await cardService.uploadImage(backgroundUrl, 'background', uploadCardId) } catch (e) {
          wx.hideLoading(); wx.showToast({ title: '背景图片上传失败', icon: 'none' }); return
        }
      }

      // 附件上传
      const uploadedAttachments = []
      for (const att of this.data.attachments) {
        if (att.url && att.url.startsWith('http')) {
          uploadedAttachments.push(att)
        } else if (att.url) {
          try {
            const url = await cardService.uploadImage(att.url, 'attachment', uploadCardId)
            uploadedAttachments.push({ name: att.name, url })
          } catch (e) { console.warn('附件上传失败:', att.name) }
        }
      }

      const cardData = {
        name: name.trim(),
        position: position ? position.trim() : '',
        company: company ? company.trim() : '',
        industry: industry || '机械设备',
        phone: phone ? phone.trim() : '',
        wechat: wechat ? wechat.trim() : '',
        email: email ? email.trim() : '',
        address: address ? address.trim() : '',
        portrait: portraitUrl,
        personalIntro: personalIntro ? personalIntro.trim() : '',
        businessIntro: businessIntro ? businessIntro.trim() : '',
        background: backgroundUrl,
        attachments: JSON.stringify(uploadedAttachments)
      }

      if (this.data.isEdit) {
        cardData.version = version
        const result = await cardService.updateCard(this.data.cardId, cardData)
        if (result && result.version !== undefined) this.setData({ version: result.version })
        wx.hideLoading()
        wx.showToast({ title: i18n.t('common.saveSuccess'), icon: 'success' })
      } else {
        await cardService.addCard(cardData)
        wx.hideLoading()
        wx.showToast({ title: i18n.t('common.createSuccess'), icon: 'success' })
        setTimeout(() => { wx.switchTab({ url: '/pages/index/index' }) }, 1500)
        return
      }

      setTimeout(() => { wx.navigateBack() }, 1500)
    } catch (err) {
      wx.hideLoading()
      if (err && err.code === ERROR_CODE_CONFLICT) {
        this.handleConflict(err)
        return
      }
      const errMsg = (err && err.message) || i18n.t('common.saveFailed')
      wx.showToast({ title: errMsg.length > 15 ? errMsg.substring(0, 15) + '...' : errMsg, icon: 'none', duration: 3000 })
    }
  }
})
