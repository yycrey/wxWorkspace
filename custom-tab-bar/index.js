// 自定义TabBar组件（框架自动挂载）
const i18n = require('../utils/i18n.js')

Component({
  data: {
    selected: 0,
    tabList: [
      {
        icon: '📇',
        selectedIcon: '📇',
        text: '名片',
        pagePath: '/pages/index/index'
      },
      {
        icon: '👤',
        selectedIcon: '👤',
        text: '我的',
        pagePath: '/pages/mine/mine'
      }
    ]
  },

  lifetimes: {
    attached() {
      this.updateTabTexts()
      this.updateSelected()
    }
  },

  pageLifetimes: {
    show() {
      this.updateTabTexts()
      this.updateSelected()
    }
  },

  methods: {
    updateTabTexts() {
      const tabTexts = i18n.getTexts('tabBar')
      if (tabTexts && tabTexts.length === 2) {
        this.setData({
          'tabList[0].text': tabTexts[0].text,
          'tabList[1].text': tabTexts[1].text
        })
      }
    },

    updateSelected() {
      const pages = getCurrentPages()
      if (!pages || pages.length === 0) return

      const currentPage = pages[pages.length - 1]
      if (!currentPage) return

      const route = currentPage.route
      if (!route) return

      let selected = 0
      this.data.tabList.forEach((tab, index) => {
        if (tab.pagePath.includes(route)) {
          selected = index
        }
      })
      this.setData({ selected })
    },

    onTabChange(e) {
      const { index } = e.currentTarget.dataset
      const tab = this.data.tabList[index]

      wx.switchTab({
        url: tab.pagePath
      })
    }
  }
})
