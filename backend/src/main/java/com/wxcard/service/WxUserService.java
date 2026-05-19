package com.wxcard.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wxcard.dto.PhoneLoginDTO;
import com.wxcard.dto.WxLoginDTO;
import com.wxcard.dto.WxUserDTO;
import com.wxcard.entity.WxUser;
import com.wxcard.mapper.WxUserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class WxUserService {

    @Value("${wx.miniapp.appid:}")
    private String appId;

    @Value("${wx.miniapp.secret:}")
    private String appSecret;

    @Autowired(required = false)
    private WxUserMapper wxUserMapper;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * 微信登录
     * 1. 用 code 换取 openid 和 session_key（开发模式使用模拟 openid）
     * 2. 查找或创建用户
     * 3. 返回自定义 token（用 UUID 模拟，生产环境应用 JWT）
     */
    public Map<String, Object> login(WxLoginDTO loginDTO) {
        // 调用微信接口获取 openid
        String openid = getOpenidByCode(loginDTO.getCode());

        // 微信 API 调用失败时，使用模拟 openid（仅用于开发测试）
        if (openid == null) {
            System.out.println("[开发模式] 微信登录失败，使用模拟 openid");
            openid = "mock_openid_" + generateRandomString(10);
        }

        // 查找已有用户
        LambdaQueryWrapper<WxUser> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(WxUser::getOpenid, openid);
        WxUser user = wxUserMapper.selectOne(wrapper);

        if (user == null) {
            // 新用户，创建记录
            user = new WxUser();
            user.setOpenid(openid);
            // 使用用户提供的昵称，或从微信昵称字段获取
            String nickname = loginDTO.getNickname();
            if (nickname == null || nickname.isEmpty()) {
                nickname = "用户" + generateUuid8();
            }
            user.setNickname(nickname);
            user.setAvatarUrl(loginDTO.getAvatarUrl() != null ? loginDTO.getAvatarUrl() : "");
            user.setCreateTime(LocalDateTime.now());
            user.setUpdateTime(LocalDateTime.now());
            wxUserMapper.insert(user);
        } else {
            // 已有用户，更新昵称和头像（如果前端传了的话）
            boolean needUpdate = false;
            if (loginDTO.getNickname() != null && !loginDTO.getNickname().isEmpty()) {
                user.setNickname(loginDTO.getNickname());
                needUpdate = true;
            }
            if (loginDTO.getAvatarUrl() != null && !loginDTO.getAvatarUrl().isEmpty()) {
                user.setAvatarUrl(loginDTO.getAvatarUrl());
                needUpdate = true;
            }
            if (needUpdate) {
                user.setUpdateTime(LocalDateTime.now());
                wxUserMapper.updateById(user);
            }
        }

        // 从昵称获取魔法值（取前3位）
        String magicValue = getMagicValue(user.getNickname());

        // 生成10位随机数（类似UUID格式：字母+数字）
        String randomStr = generateRandomString(10);

        // 组合魔法值 + 随机数作为 token
        String token = magicValue + randomStr;

        // 缓存 token -> openid 的映射（简化版，生产环境应用 Redis）
        TokenCache.put(token, user.getId());

        // 返回用户信息和 token
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("userInfo", toDTO(user));
        return result;
    }

    /**
     * 手机号一键登录
     */
    public Map<String, Object> phoneLogin(PhoneLoginDTO loginDTO) {
        // 调用微信接口获取 openid 和 session_key
        Map<String, String> sessionInfo = getSessionInfoByCode(loginDTO.getCode());

        if (sessionInfo == null || sessionInfo.get("openid") == null) {
            // 微信 API 调用失败时，使用模拟 openid（仅用于开发测试）
            String mockOpenid = "mock_openid_" + generateRandomString(10);
            return createOrUpdateUser(mockOpenid, null);
        }

        String openid = sessionInfo.get("openid");
        String sessionKey = sessionInfo.get("session_key");

        // 解密获取手机号
        String phoneNumber = decryptPhoneNumber(
            loginDTO.getEncryptedData(),
            loginDTO.getIv(),
            sessionKey
        );

        return createOrUpdateUser(openid, phoneNumber);
    }

    /**
     * 简化登录（无需授权，直接用 code 登录）
     * 复用 login 方法逻辑，只是参数不同
     */
    public Map<String, Object> simpleLogin(String code) {
        WxLoginDTO loginDTO = new WxLoginDTO();
        loginDTO.setCode(code);
        // 不传昵称和头像，使用默认生成
        return login(loginDTO);
    }

    /**
     * 创建或更新用户
     */
    private Map<String, Object> createOrUpdateUser(String openid, String phoneNumber) {
        // 查找已有用户
        LambdaQueryWrapper<WxUser> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(WxUser::getOpenid, openid);
        WxUser user = wxUserMapper.selectOne(wrapper);

        if (user == null) {
            // 新用户，创建记录
            user = new WxUser();
            user.setOpenid(openid);
            user.setNickname("用户" + generateUuid8());
            user.setCreateTime(LocalDateTime.now());
            user.setUpdateTime(LocalDateTime.now());
            wxUserMapper.insert(user);
        }

        // 更新手机号
        if (phoneNumber != null && !phoneNumber.isEmpty()) {
            user.setPhone(phoneNumber);
            user.setUpdateTime(LocalDateTime.now());
            wxUserMapper.updateById(user);
        }

        // 生成 token
        String magicValue = getMagicValue(user.getNickname());
        String randomStr = generateRandomString(10);
        String token = magicValue + randomStr;

        TokenCache.put(token, user.getId());

        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("userInfo", toDTO(user));
        return result;
    }

    /**
     * 调用微信 code2Session 接口获取 openid 和 session_key
     */
    private Map<String, String> getSessionInfoByCode(String code) {
        String url = String.format(
            "https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code",
            appId, appSecret, code
        );

        try {
            String response = restTemplate.getForObject(url, String.class);
            JsonNode jsonNode = objectMapper.readTree(response);
            
            Map<String, String> result = new HashMap<>();
            if (jsonNode.has("openid")) {
                result.put("openid", jsonNode.get("openid").asText());
            }
            if (jsonNode.has("session_key")) {
                result.put("session_key", jsonNode.get("session_key").asText());
            }
            return result;
        } catch (Exception e) {
            System.err.println("调用微信登录接口失败: " + e.getMessage());
            return null;
        }
    }

    /**
     * 解密微信手机号
     */
    private String decryptPhoneNumber(String encryptedData, String iv, String sessionKey) {
        try {
            // 使用 java.util.Base64 解码
            byte[] dataByte = java.util.Base64.getDecoder().decode(encryptedData);
            byte[] keyByte = java.util.Base64.getDecoder().decode(sessionKey);
            byte[] ivByte = java.util.Base64.getDecoder().decode(iv);

            // 设置解密模式为 AES-128-CBC
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            SecretKeySpec keySpec = new SecretKeySpec(keyByte, "AES");
            IvParameterSpec ivSpec = new IvParameterSpec(ivByte);
            cipher.init(Cipher.DECRYPT_MODE, keySpec, ivSpec);

            byte[] resultByte = cipher.doFinal(dataByte);
            String result = new String(resultByte, "UTF-8");
            
            // 解析 JSON 获取手机号
            JsonNode jsonNode = objectMapper.readTree(result);
            if (jsonNode.has("phoneNumber")) {
                return jsonNode.get("phoneNumber").asText();
            }
            return null;
        } catch (Exception e) {
            System.err.println("解密手机号失败: " + e.getMessage());
            return null;
        }
    }

    /**
     * 根据 token 获取用户信息
     */
    public WxUserDTO getUserInfoByToken(String token) {
        Long userId = getUserIdByToken(token);
        if (userId == null) return null;
        WxUser user = wxUserMapper.selectById(userId);
        return user == null ? null : toDTO(user);
    }

    /**
     * 根据 token 获取用户ID（供其他服务调用）
     */
    public Long getUserIdByToken(String token) {
        if (token == null || token.isEmpty()) return null;
        return TokenCache.get(token);
    }

    /**
     * 更新用户信息
     */
    public WxUserDTO updateUser(Long userId, String nickname, String avatarUrl) {
        WxUser user = wxUserMapper.selectById(userId);
        if (user == null) {
            return null;
        }
        if (nickname != null && !nickname.isEmpty()) {
            user.setNickname(nickname);
        }
        if (avatarUrl != null && !avatarUrl.isEmpty()) {
            user.setAvatarUrl(avatarUrl);
        }
        user.setUpdateTime(LocalDateTime.now());
        wxUserMapper.updateById(user);
        return toDTO(user);
    }

    /**
     * 调用微信 code2Session 接口获取 openid
     */
    private String getOpenidByCode(String code) {
        String url = String.format(
            "https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code",
            appId, appSecret, code
        );

        try {
            String response = restTemplate.getForObject(url, String.class);
            JsonNode jsonNode = objectMapper.readTree(response);
            if (jsonNode.has("openid")) {
                return jsonNode.get("openid").asText();
            } else {
                System.err.println("微信登录接口返回错误: " + response);
                return null;
            }
        } catch (Exception e) {
            System.err.println("调用微信登录接口失败: " + e.getMessage());
            return null;
        }
    }

    /**
     * 从昵称获取魔法值（取前3位，转大写+数字混合）
     * 确保只生成纯 ASCII 字符
     */
    private String getMagicValue(String nickname) {
        if (nickname == null || nickname.isEmpty()) {
            return "WXU";
        }
        // 取前3个字符
        String prefix = nickname.length() >= 3 ? nickname.substring(0, 3) : nickname;
        // 只提取英文和数字（严格 ASCII），确保生成的 token 在传输过程中不被破坏
        StringBuilder ascii = new StringBuilder();
        for (char c : prefix.toCharArray()) {
            if ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || (c >= '0' && c <= '9')) {
                ascii.append(Character.toUpperCase(c));
            }
        }
        // 如果全是特殊字符（如中文、符号等），生成随机字母
        if (ascii.length() == 0) {
            ascii.append("WXU");
        }
        // 不足3位补齐
        while (ascii.length() < 3) {
            ascii.append((char) ('A' + ascii.length()));
        }
        return ascii.substring(0, Math.min(3, ascii.length()));
    }

    /**
     * 生成指定长度的随机字符串（类似UUID格式：字母+数字）
     */
    private String generateRandomString(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            int index = (int) (Math.random() * chars.length());
            sb.append(chars.charAt(index));
        }
        return sb.toString();
    }

    /**
     * 生成8位UUID（用于昵称）
     */
    private String generateUuid8() {
        return java.util.UUID.randomUUID().toString().replace("-", "").substring(0, 8);
    }

    private WxUserDTO toDTO(WxUser user) {
        WxUserDTO dto = new WxUserDTO();
        dto.setId(user.getId());
        dto.setOpenid(user.getOpenid());
        dto.setNickname(user.getNickname());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setPhone(user.getPhone());
        return dto;
    }

    /**
     * 简易 Token 缓存（生产环境请替换为 Redis）
     */
    private static class TokenCache {
        private static final java.util.concurrent.ConcurrentHashMap<String, Long> CACHE =
            new java.util.concurrent.ConcurrentHashMap<>();

        static void put(String token, Long userId) {
            CACHE.put(token, userId);
        }

        static Long get(String token) {
            return CACHE.get(token);
        }

        static void remove(String token) {
            CACHE.remove(token);
        }
    }
}
