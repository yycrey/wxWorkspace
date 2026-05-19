package com.wxcard.controller;

import com.wxcard.dto.Result;
import com.wxcard.entity.Card;
import com.wxcard.service.CardService;
import com.wxcard.service.TranslateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/cards")
@CrossOrigin(origins = "*")
public class TranslateController {

    @Autowired
    private CardService cardService;

    @Autowired
    private TranslateService translateService;

    /**
     * POST /api/cards/{id}/translate - 翻译名片内容
     * @param id 名片ID
     * @param body { "lang": "en" } 目标语言
     * @return 翻译后的名片字段
     */
    @PostMapping("/{id}/translate")
    public Result<Map<String, String>> translateCard(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        String targetLang = body.get("lang");
        if (targetLang == null || targetLang.isEmpty()) {
            return Result.error("目标语言不能为空");
        }

        // 只允许指定的语言
        if (!targetLang.matches("zh|en|ko|ru|es")) {
            return Result.error("不支持的语言: " + targetLang);
        }

        Card card = cardService.getCardById(id);
        if (card == null) {
            return Result.error("名片不存在");
        }

        // 中文直接返回原文
        if ("zh".equals(targetLang)) {
            Map<String, String> result = new HashMap<>();
            result.put("name", card.getName());
            result.put("position", card.getPosition());
            result.put("company", card.getCompany());
            result.put("address", card.getAddress());
            result.put("introduction", card.getIntroduction());
            return Result.success(result);
        }

        // 逐字段翻译
        Map<String, String> translations = new HashMap<>();
        translations.put("name", translateService.translateText(card.getName(), targetLang));
        translations.put("position", translateService.translateText(card.getPosition(), targetLang));
        translations.put("company", translateService.translateText(card.getCompany(), targetLang));
        translations.put("address", translateService.translateText(card.getAddress(), targetLang));
        translations.put("introduction", translateService.translateText(card.getIntroduction(), targetLang));

        return Result.success(translations);
    }
}
