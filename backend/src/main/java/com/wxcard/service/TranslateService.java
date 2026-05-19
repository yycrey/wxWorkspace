package com.wxcard.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 名片内容翻译服务
 * 使用百度翻译开放API（免费版每月100万字符）
 * 用户需自行申请百度翻译API密钥: https://fanyi-api.baidu.com/
 */
@Service
public class TranslateService {

    @Value("${translate.baidu.appid:}")
    private String appId;

    @Value("${translate.baidu.secret:}")
    private String secret;

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * 百度翻译 API 地址
     */
    private static final String BAIDU_API_URL = "https://fanyi-api.baidu.com/api/trans/vip/translate";

    /**
     * 语言代码映射: 内部代码 -> 百度代码
     */
    private static final Map<String, String> LANG_MAP = new HashMap<>();
    static {
        LANG_MAP.put("zh", "zh");
        LANG_MAP.put("en", "en");
        LANG_MAP.put("ko", "kor");
        LANG_MAP.put("ru", "ru");
        LANG_MAP.put("es", "spa");
    }

    /**
     * 简单的内存缓存，避免重复翻译（key=lang:text, value=translated）
     */
    private final ConcurrentHashMap<String, String> translateCache = new ConcurrentHashMap<>();

    /**
     * 翻译单段文本
     * @param text 要翻译的文本
     * @param targetLang 目标语言代码 (zh/en/ko/ru/es)
     * @return 翻译后的文本
     */
    public String translateText(String text, String targetLang) {
        if (text == null || text.trim().isEmpty()) {
            return text;
        }
        if ("zh".equals(targetLang)) {
            return text;
        }

        String baiduLang = LANG_MAP.get(targetLang);
        if (baiduLang == null) {
            return text;
        }

        // 检查缓存
        String cacheKey = targetLang + ":" + text;
        String cached = translateCache.get(cacheKey);
        if (cached != null) {
            return cached;
        }

        String result;
        if (appId == null || appId.isEmpty() || secret == null || secret.isEmpty()) {
            result = mockTranslate(text, targetLang);
        } else {
            try {
                result = callBaiduApi(text, baiduLang);
            } catch (Exception e) {
                System.err.println("百度翻译API调用失败: " + e.getMessage());
                result = mockTranslate(text, targetLang);
            }
        }

        // 缓存结果
        translateCache.put(cacheKey, result);
        return result;
    }

    /**
     * 调用百度翻译 API
     */
    private String callBaiduApi(String text, String toLang) throws Exception {
        String fromLang = "zh";
        String salt = String.valueOf(System.currentTimeMillis());
        String sign = md5(appId + text + salt + secret);

        String urlStr = BAIDU_API_URL + "?q=" + URLEncoder.encode(text, StandardCharsets.UTF_8.name())
                + "&from=" + fromLang
                + "&to=" + toLang
                + "&appid=" + appId
                + "&salt=" + salt
                + "&sign=" + sign;

        URL url = new URL(urlStr);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setConnectTimeout(5000);
        conn.setReadTimeout(5000);

        BufferedReader reader = new BufferedReader(
                new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8));
        StringBuilder response = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            response.append(line);
        }
        reader.close();

        JsonNode json = objectMapper.readTree(response.toString());
        if (json.has("trans_result")) {
            JsonNode result = json.get("trans_result").get(0);
            return result.get("dst").asText();
        }
        if (json.has("error_code")) {
            System.err.println("百度翻译错误: " + json.get("error_code").asText() + " - " + json.get("error_msg").asText());
        }
        return text;
    }

    /**
     * 模拟翻译（未配置API密钥时的降级方案，添加语言标签以便识别）
     */
    private String mockTranslate(String text, String targetLang) {
        if (text == null || text.isEmpty()) return text;

        String prefix;
        switch (targetLang) {
            case "en": prefix = "[EN] "; break;
            case "ko": prefix = "[KO] "; break;
            case "ru": prefix = "[RU] "; break;
            case "es": prefix = "[ES] "; break;
            default: return text;
        }
        return prefix + text;
    }

    private String md5(String input) throws Exception {
        MessageDigest md = MessageDigest.getInstance("MD5");
        byte[] digest = md.digest(input.getBytes(StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder();
        for (byte b : digest) {
            sb.append(String.format("%02x", b & 0xff));
        }
        return sb.toString();
    }
}
