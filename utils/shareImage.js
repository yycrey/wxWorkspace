// 生成分享名片图片 - 简略居中版本
function generateShareCard(card, callback) {
  const ctx = wx.createCanvasContext('shareCanvas')
  const width = 400
  const height = 240

  // 清除画布
  ctx.clearRect(0, 0, width, height)

  // 绘制渐变背景
  const bgGrd = ctx.createLinearGradient(0, 0, width, height)
  bgGrd.addColorStop(0, '#f8faff')
  bgGrd.addColorStop(1, '#e8f0fe')
  ctx.setFillStyle(bgGrd)
  ctx.fillRect(0, 0, width, height)

  // 名片主体居中显示
  const cardWidth = 360
  const cardHeight = 180
  const cardX = (width - cardWidth) / 2
  const cardY = (height - cardHeight) / 2

  // 名片阴影
  ctx.setFillStyle('rgba(0, 0, 0, 0.08)')
  roundRect(ctx, cardX + 4, cardY + 4, cardWidth, cardHeight, 12)
  ctx.fill()

  // 名片背景
  ctx.setFillStyle('#ffffff')
  roundRect(ctx, cardX, cardY, cardWidth, cardHeight, 12)
  ctx.fill()

  // 左侧装饰条
  ctx.setFillStyle('#1a73e8')
  roundRectLeft(ctx, cardX, cardY, 6, cardHeight, 12, 12)
  ctx.fill()

  // 首字母圆形（替代头像）
  const initialSize = 60
  const initialX = cardX + 30
  const initialY = cardY + (cardHeight - initialSize) / 2

  ctx.beginPath()
  ctx.arc(initialX + initialSize / 2, initialY + initialSize / 2, initialSize / 2, 0, 2 * Math.PI)
  const avatarGrd = ctx.createLinearGradient(initialX, initialY, initialX + initialSize, initialY + initialSize)
  avatarGrd.addColorStop(0, '#667eea')
  avatarGrd.addColorStop(1, '#764ba2')
  ctx.setFillStyle(avatarGrd)
  ctx.fill()

  const initial = card.name ? card.name[0].toUpperCase() : '?'
  ctx.setFillStyle('#ffffff')
  ctx.setFontSize(24)
  ctx.setTextAlign('center')
  ctx.setTextBaseline('middle')
  ctx.fillText(initial, initialX + initialSize / 2, initialY + initialSize / 2)

  // 文字信息区域
  const textX = cardX + 110
  const textMaxWidth = cardWidth - 130

  // 姓名
  ctx.setFillStyle('#1a202c')
  ctx.setFontSize(20)
  ctx.setTextAlign('left')
  ctx.setTextBaseline('top')
  ctx.font = 'bold 20px sans-serif'
  ctx.fillText(card.name || '姓名', textX, cardY + 40)

  // 职位
  ctx.setFillStyle('#718096')
  ctx.setFontSize(14)
  ctx.font = '14px sans-serif'
  ctx.fillText(card.position || '', textX, cardY + 68)

  // 公司
  if (card.company) {
    ctx.setFillStyle('#1a73e8')
    ctx.setFontSize(12)
    ctx.font = '12px sans-serif'
    ctx.fillText(card.company, textX, cardY + 95)
  }

  // 电话
  if (card.phone) {
    ctx.setFillStyle('#4a5568')
    ctx.setFontSize(12)
    ctx.font = '12px sans-serif'
    ctx.fillText(card.phone, textX, cardY + 118)
  }

  // 绘制圆角矩形辅助函数
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
  }

  // 左侧圆角矩形（用于装饰条）
  function roundRectLeft(ctx, x, y, w, h, rTop, rBottom) {
    ctx.beginPath()
    ctx.moveTo(x + w, y)
    ctx.lineTo(x + w, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - rBottom)
    ctx.lineTo(x, y + rTop)
    ctx.quadraticCurveTo(x, y, x + w, y)
    ctx.closePath()
  }

  // 绘制到画布
  ctx.draw(false, () => {
    setTimeout(() => {
      wx.canvasToTempFilePath({
        canvasId: 'shareCanvas',
        success: (res) => {
          callback && callback(res.tempFilePath)
        },
        fail: (err) => {
          console.error('生成分享图片失败', err)
          callback && callback('')
        }
      })
    }, 100)
  })
}

// 生成带"点击查看"文字的分享图片（简略居中版本）
function generateShareCardWithHint(card, callback) {
  const ctx = wx.createCanvasContext('shareCanvas')
  const width = 400
  const height = 280

  // 清除画布
  ctx.clearRect(0, 0, width, height)

  // 绘制渐变背景
  const bgGrd = ctx.createLinearGradient(0, 0, width, height)
  bgGrd.addColorStop(0, '#f8faff')
  bgGrd.addColorStop(1, '#e8f0fe')
  ctx.setFillStyle(bgGrd)
  ctx.fillRect(0, 0, width, height)

  // 名片主体居中显示
  const cardWidth = 360
  const cardHeight = 180
  const cardX = (width - cardWidth) / 2
  const cardY = 30

  // 名片阴影
  ctx.setFillStyle('rgba(0, 0, 0, 0.08)')
  roundRect(ctx, cardX + 4, cardY + 4, cardWidth, cardHeight, 12)
  ctx.fill()

  // 名片背景
  ctx.setFillStyle('#ffffff')
  roundRect(ctx, cardX, cardY, cardWidth, cardHeight, 12)
  ctx.fill()

  // 左侧装饰条
  ctx.setFillStyle('#1a73e8')
  roundRectLeft(ctx, cardX, cardY, 6, cardHeight, 12, 12)
  ctx.fill()

  // 首字母圆形（替代头像）
  const initialSize = 60
  const initialX = cardX + 30
  const initialY = cardY + (cardHeight - initialSize) / 2

  ctx.beginPath()
  ctx.arc(initialX + initialSize / 2, initialY + initialSize / 2, initialSize / 2, 0, 2 * Math.PI)
  const avatarGrd = ctx.createLinearGradient(initialX, initialY, initialX + initialSize, initialY + initialSize)
  avatarGrd.addColorStop(0, '#667eea')
  avatarGrd.addColorStop(1, '#764ba2')
  ctx.setFillStyle(avatarGrd)
  ctx.fill()

  const initial = card.name ? card.name[0].toUpperCase() : '?'
  ctx.setFillStyle('#ffffff')
  ctx.setFontSize(24)
  ctx.setTextAlign('center')
  ctx.setTextBaseline('middle')
  ctx.fillText(initial, initialX + initialSize / 2, initialY + initialSize / 2)

  // 文字信息区域
  const textX = cardX + 110
  const textMaxWidth = cardWidth - 130

  // 姓名
  ctx.setFillStyle('#1a202c')
  ctx.setFontSize(20)
  ctx.setTextAlign('left')
  ctx.setTextBaseline('top')
  ctx.font = 'bold 20px sans-serif'
  ctx.fillText(card.name || '姓名', textX, cardY + 40)

  // 职位
  ctx.setFillStyle('#718096')
  ctx.setFontSize(14)
  ctx.font = '14px sans-serif'
  ctx.fillText(card.position || '', textX, cardY + 68)

  // 公司
  if (card.company) {
    ctx.setFillStyle('#1a73e8')
    ctx.setFontSize(12)
    ctx.font = '12px sans-serif'
    ctx.fillText(card.company, textX, cardY + 95)
  }

  // 电话
  if (card.phone) {
    ctx.setFillStyle('#4a5568')
    ctx.setFontSize(12)
    ctx.font = '12px sans-serif'
    ctx.fillText(card.phone, textX, cardY + 118)
  }

  // 点击查看提示框（居中）
  const btnWidth = 200
  const btnHeight = 36
  const btnX = (width - btnWidth) / 2
  const btnY = 230

  ctx.setFillStyle('#1a73e8')
  roundRect(ctx, btnX, btnY, btnWidth, btnHeight, 18)
  ctx.fill()

  ctx.setFillStyle('#ffffff')
  ctx.setFontSize(14)
  ctx.setTextAlign('center')
  ctx.setTextBaseline('middle')
  ctx.font = 'bold 14px sans-serif'
  ctx.fillText('👆 点击查看名片', width / 2, btnY + btnHeight / 2)

  // 绘制圆角矩形辅助函数
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
  }

  // 左侧圆角矩形（用于装饰条）
  function roundRectLeft(ctx, x, y, w, h, rTop, rBottom) {
    ctx.beginPath()
    ctx.moveTo(x + w, y)
    ctx.lineTo(x + w, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - rBottom)
    ctx.lineTo(x, y + rTop)
    ctx.quadraticCurveTo(x, y, x + w, y)
    ctx.closePath()
  }

  // 绘制到画布
  ctx.draw(false, () => {
    setTimeout(() => {
      wx.canvasToTempFilePath({
        canvasId: 'shareCanvas',
        success: (res) => {
          callback && callback(res.tempFilePath)
        },
        fail: (err) => {
          console.error('生成分享图片失败', err)
          callback && callback('')
        }
      })
    }, 100)
  })
}

// 同步版本
function generateShareCardSync(card) {
  return new Promise((resolve) => {
    generateShareCardWithHint(card, resolve)
  })
}

module.exports = {
  generateShareCard,
  generateShareCardWithHint,
  generateShareCardSync
}
