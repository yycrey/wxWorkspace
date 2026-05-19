/**
 * 应用全局配置
 * 统一管理功能开关，方便开发和测试
 */

const config = {
  // ===== 登录相关 =====
  // 保存名片时是否强制执行 wx.login 获取 token
  // true : 每次保存都重新登录（生产模式，确保 token 有效）
  // false: 跳过强制登录，使用已有 token（测试模式，方便调试）
  REQUIRE_LOGIN: false,
};

module.exports = config;
