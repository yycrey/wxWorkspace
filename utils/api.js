/**
 * API 服务层
 * 对接后端 REST API
 */

const API_BASE_URL = 'http://127.0.0.1:8080/api'  // 后端地址
const REQUEST_TIMEOUT = 15000  // 请求超时时间 15s

// 标记是否正在重新登录，防止并发重复登录
let isRelogining = false
// 记录最近一次静默重登录的结果
let lastReloginResult = null

/**
 * 静默重新登录：调用 wx.login 重新获取 token
 * 适用于 token 过期/后端重启导致缓存丢失的情况
 * 返回 true 表示重新登录成功（新 token 已存储）
 */
function silentRelogin() {
  return new Promise((resolve) => {
    if (isRelogining) {
      // 已有重登录在进行，等待它完成，直接使用其结果
      const check = setInterval(() => {
        if (!isRelogining) {
          clearInterval(check)
          resolve(lastReloginResult)
        }
      }, 200)
      return
    }
    isRelogining = true
    wx.login({
      success: (loginRes) => {
        if (!loginRes.code) {
          isRelogining = false
          lastReloginResult = false
          resolve(false)
          return
        }
        wx.request({
          url: API_BASE_URL + '/auth/simple-login',
          method: 'POST',
          data: JSON.stringify({ code: loginRes.code }),
          header: { 'Content-Type': 'application/json;charset=UTF-8' },
          success: (res) => {
            isRelogining = false
            const tokenObtained = !!(res.statusCode === 200 && res.data && res.data.code === 0 && res.data.data && res.data.data.token)
            if (tokenObtained) {
              const app = getApp()
              if (app) {
                app.setToken(res.data.data.token)
                if (res.data.data.userInfo) {
                  app.setUserInfo(res.data.data.userInfo)
                  app.globalData.hasLogin = true
                }
              }
            }
            lastReloginResult = tokenObtained
            resolve(tokenObtained)
          },
          fail: () => {
            isRelogining = false
            lastReloginResult = false
            resolve(false)
          }
        })
      },
      fail: () => {
        isRelogining = false
        lastReloginResult = false
        resolve(false)
      }
    })
  })
}

/**
 * 封装 wx.request 请求
 * @param {Object} options
 * @param {string} options.url - 请求路径（不含 base URL）
 * @param {string} [options.method='GET'] - 请求方法
 * @param {Object} [options.data] - 请求数据
 * @param {boolean} [options.noToast=false] - 是否禁止自动显示错误提示
 * @param {number} [options._retryCount=0] - 内部重试计数
 */
function request(options) {
  return new Promise((resolve, reject) => {
    const isWriteMethod = ['POST', 'PUT'].includes(options.method)
    const requestData = isWriteMethod ? JSON.stringify(options.data || {}) : (options.data || {})

    // 获取 token（不再清洗，保留原始内容）
    let token = wx.getStorageSync('token') || ''

    // 调试日志：打印请求的 token 信息
    console.log(`[API] ${options.method} ${options.url} | token:${token ? token.substring(0,15)+'...' : 'EMPTY'} | len:${token.length}`)

    wx.request({
      url: API_BASE_URL + options.url,
      method: options.method || 'GET',
      data: requestData,
      timeout: REQUEST_TIMEOUT,
      header: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': token
      },
      success: (res) => {
        if (res.statusCode === 200) {
          if (res.data.code === 0) {
            resolve(res.data.data)
          } else {
            const err = {
              code: res.data.code,
              message: res.data.message || '操作失败',
              data: res.data.data
            }
            // 检测"未登录"：可能是后端重启导致 token 缓存丢失，尝试静默重新登录
            // 最多重试2次（第1次和第2次）
            if ((res.data.message === '未登录' || res.data.message === '用户不存在或token已过期') && (options._retryCount || 0) < 2) {
              silentRelogin().then((loggedIn) => {
                if (loggedIn) {
                  // 重新登录成功，重试原始请求
                  request({ ...options, _retryCount: (options._retryCount || 0) + 1 }).then(resolve).catch(reject)
                } else {
                  // 重新登录失败，清除状态引导用户手动登录
                  try {
                    const app = getApp()
                    if (app) app.clearLoginStatus()
                  } catch (e) {}
                  wx.showModal({
                    title: '登录已过期',
                    content: '请重新登录',
                    confirmText: '去登录',
                    success: (modalRes) => {
                      if (modalRes.confirm) {
                        wx.switchTab({ url: '/pages/mine/mine' })
                      }
                    }
                  })
                  reject(err)
                }
              })
              return
            }
            if (!options.noToast) {
              wx.showToast({
                title: err.message,
                icon: 'none',
                duration: 2500
              })
            }
            reject(err)
          }
        } else if (res.statusCode === 401) {
          wx.showToast({
            title: '请先登录',
            icon: 'none'
          })
          reject({ code: 401, message: '未授权' })
        } else {
          const errMsg = `请求错误(${res.statusCode})`
          if (!options.noToast) {
            wx.showToast({ title: errMsg, icon: 'none' })
          }
          reject({ code: res.statusCode, message: errMsg })
        }
      },
      fail: (err) => {
        console.error('网络请求失败:', err)
        const errMsg = err.errMsg || '网络连接失败，请检查服务器是否启动'
        if (!options.noToast) {
          wx.showToast({
            title: errMsg.includes('timeout') ? '请求超时' : '网络连接失败',
            icon: 'none'
          })
        }
        reject({ code: -1, message: errMsg })
      }
    })
  })
}

/**
 * 图片上传
 * @param {string} filePath - 文件路径
 * @param {string} fileType - 文件类型(portrait/background/avatar/attachment)
 * @param {number} cardId - 关联名片ID(可选)
 */
function uploadFile(filePath, fileType = 'attachment', cardId = null) {
  return new Promise((resolve, reject) => {
    let token = wx.getStorageSync('token') || ''

    wx.uploadFile({
      url: API_BASE_URL + '/upload',
      filePath: filePath,
      name: 'file',
      formData: (() => {
        const fd = { fileType: fileType }
        if (cardId) fd.cardId = cardId
        return fd
      })(),
      timeout: REQUEST_TIMEOUT,
      header: {
        'Authorization': token
      },
      success: (res) => {
        let data
        try {
          data = JSON.parse(res.data)
        } catch (e) {
          wx.showToast({ title: '上传响应解析失败', icon: 'none' })
          reject({ code: -1, message: '上传响应解析失败' })
          return
        }
        if (data.code === 0) {
          resolve(data.data.url)
        } else {
          wx.showToast({
            title: data.message || '上传失败',
            icon: 'none'
          })
          reject({ code: data.code, message: data.message || '上传失败' })
        }
      },
      fail: (err) => {
        console.error('图片上传失败:', err)
        wx.showToast({
          title: '上传失败，请检查网络',
          icon: 'none'
        })
        reject({ code: -1, message: '上传失败' })
      }
    })
  })
}

// ==================== 名片 API ====================

function getCardList() {
  return request({ url: '/cards', method: 'GET', noToast: true })
}

function getCardById(id) {
  return request({ url: `/cards/${id}`, method: 'GET' })
}

function createCard(cardData) {
  return request({ url: '/cards', method: 'POST', data: cardData })
}

function updateCard(id, cardData) {
  return request({ url: `/cards/${id}`, method: 'PUT', data: cardData })
}

function getViewCount(id) {
  return request({ url: `/cards/${id}/views`, method: 'GET', noToast: true })
}

function deleteCard(id) {
  return request({ url: `/cards/${id}`, method: 'DELETE' })
}

function getCardAttachments(id) {
  return request({ url: `/cards/${id}/attachments`, method: 'GET', noToast: true })
}

// ==================== 公司简介 API ====================

function getCompanyIntro() {
  return request({ url: '/company/intro', method: 'GET' })
}

function saveCompanyIntro(content) {
  return request({ url: '/company/intro', method: 'POST', data: { content } })
}

// ==================== 用户/登录 API ====================

function wxLogin(code, nickname, avatarUrl) {
  return request({
    url: '/auth/login', method: 'POST',
    data: { code, nickname, avatarUrl },
    noToast: true
  })
}

function phoneLogin(loginData) {
  return request({
    url: '/auth/phone-login', method: 'POST',
    data: loginData,
    noToast: true
  })
}

function simpleLogin(code) {
  return request({
    url: '/auth/simple-login', method: 'POST',
    data: { code },
    noToast: true
  })
}

function getUserInfo() {
  return request({ url: '/auth/userinfo', method: 'GET', noToast: true })
}

function updateUserInfo(nickname, avatarUrl) {
  const data = {}
  if (nickname !== undefined) data.nickname = nickname
  if (avatarUrl !== undefined) data.avatarUrl = avatarUrl
  return request({ url: '/auth/userinfo', method: 'PUT', data })
}

// ==================== 翻译 API ====================

/**
 * 翻译名片内容（姓名、职位、公司、地址、简介）
 * @param {number} cardId - 名片ID
 * @param {string} lang - 目标语言代码: en/ko/ru/es
 * @returns {Object} { name, position, company, address, introduction }
 */
function translateCard(cardId, lang) {
  return request({
    url: `/cards/${cardId}/translate`,
    method: 'POST',
    data: { lang },
    noToast: true
  })
}

// ==================== 导出 ====================

module.exports = {
  API_BASE_URL,
  uploadFile,
  getCardList,
  getCardById,
  createCard,
  updateCard,
  deleteCard,
  getCardAttachments,
  getViewCount,
  getCompanyIntro,
  saveCompanyIntro,
  wxLogin,
  phoneLogin,
  simpleLogin,
  getUserInfo,
  updateUserInfo,
  translateCard
}
