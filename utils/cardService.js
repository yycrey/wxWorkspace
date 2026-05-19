/**
 * 名片数据服务
 * 支持本地存储和远程API两种模式
 */

const api = require('./api.js')

// 切换模式：true = 使用API, false = 使用本地存储
const USE_API = true

const CARD_LIST_KEY = 'card_list'

// ==================== 本地存储模式 ====================

function getCardListLocal() {
  const list = wx.getStorageSync(CARD_LIST_KEY)
  return list || []
}

function saveCardListLocal(list) {
  wx.setStorageSync(CARD_LIST_KEY, list)
}

function addCardLocal(card) {
  const list = getCardListLocal()
  const newCard = {
    ...card,
    id: Date.now().toString(),
    createTime: new Date().toISOString()
  }
  list.unshift(newCard)
  saveCardListLocal(list)
  return newCard
}

function updateCardLocal(id, card) {
  const list = getCardListLocal()
  const index = list.findIndex(item => item.id === id)
  if (index !== -1) {
    list[index] = { ...list[index], ...card, updateTime: new Date().toISOString() }
    saveCardListLocal(list)
    return list[index]
  }
  return null
}

function getCardByIdLocal(id) {
  const list = getCardListLocal()
  return list.find(item => item.id === id) || null
}

// ==================== API 模式 ====================

/**
 * 获取名片列表 (API)
 */
async function getCardListApi() {
  try {
    const list = await api.getCardList()
    // 缓存到本地（可选，用于离线查看）
    if (Array.isArray(list)) {
      saveCardListLocal(list)
    }
    return list || []
  } catch (err) {
    console.error('获取名片列表失败:', err)
    // 失败时返回本地缓存
    return getCardListLocal()
  }
}

/**
 * 获取单个名片 (API)
 */
async function getCardByIdApi(id) {
  try {
    return await api.getCardById(id)
  } catch (err) {
    console.error('获取名片详情失败:', err)
    return getCardByIdLocal(id)
  }
}

/**
 * 添加名片 (API)
 */
async function addCardApi(card) {
  try {
    const result = await api.createCard(card)
    return result
  } catch (err) {
    console.error('创建名片失败:', err)
    throw err
  }
}

/**
 * 更新名片 (API)
 * 返回完整响应，以便前端区分不同类型的错误
 */
async function updateCardApi(id, card) {
  try {
    const result = await api.updateCard(id, card)
    return result
  } catch (err) {
    console.error('更新名片失败:', err)
    throw err
  }
}

/**
 * 上传图片 (API)
 */
async function uploadImageApi(filePath, fileType = 'attachment', cardId = null) {
  try {
    return await api.uploadFile(filePath, fileType, cardId)
  } catch (err) {
    console.error('图片上传失败:', err)
    throw err
  }
}

/**
 * 删除名片 (API)
 */
async function deleteCardApi(id) {
  try {
    return await api.deleteCard(id)
  } catch (err) {
    console.error('删除名片失败:', err)
    throw err
  }
}

/**
 * 获取名片附件列表 (API)
 */
async function getCardAttachmentsApi(id) {
  try {
    return await api.getCardAttachments(id)
  } catch (err) {
    console.error('获取附件列表失败:', err)
    return []
  }
}

/**
 * 获取名片查看次数 (API)
 */
async function getViewCountApi(id) {
  try {
    return await api.getViewCount(id)
  } catch (err) {
    console.error('获取查看次数失败:', err)
    return 0
  }
}

/**
 * 增加名片查看次数 (本地模拟，仅记录)
 */
function incrementViewCountLocal(id) {
  // 本地模式无法真正统计，仅返回模拟值
  return Promise.resolve(0)
}

// ==================== 导出接口 ====================

module.exports = {
  // 切换使用哪个实现
  USE_API,

  // 获取名片列表
  getCardList() {
    if (USE_API) {
      return getCardListApi()
    }
    return getCardListLocal()
  },

  // 根据ID获取名片
  getCardById(id) {
    if (USE_API) {
      return getCardByIdApi(id)
    }
    return Promise.resolve(getCardByIdLocal(id))
  },

  // 添加名片
  addCard(card) {
    if (USE_API) {
      return addCardApi(card)
    }
    return Promise.resolve(addCardLocal(card))
  },

  // 更新名片
  updateCard(id, card) {
    if (USE_API) {
      return updateCardApi(id, card)
    }
    return Promise.resolve(updateCardLocal(id, card))
  },

  // 上传图片
  uploadImage(filePath, fileType, cardId) {
    return uploadImageApi(filePath, fileType, cardId)
  },

  // 删除名片
  deleteCard(id) {
    if (USE_API) {
      return deleteCardApi(id)
    }
    return Promise.resolve()
  },

  // 获取名片附件列表
  getCardAttachments(id) {
    return getCardAttachmentsApi(id)
  },

  // 获取查看次数
  getViewCount(id) {
    if (USE_API) {
      return getViewCountApi(id)
    }
    return incrementViewCountLocal(id)
  },

  // 增加查看次数（仅本地模式）
  incrementViewCount(id) {
    return Promise.resolve()
  }
}
