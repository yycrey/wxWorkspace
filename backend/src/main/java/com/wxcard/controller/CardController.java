package com.wxcard.controller;

import com.wxcard.dto.CardDTO;
import com.wxcard.dto.Result;
import com.wxcard.entity.Card;
import com.wxcard.service.AttachmentService;
import com.wxcard.service.CardService;
import com.wxcard.service.WxUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/cards")
@CrossOrigin(origins = "*")
public class CardController {

    @Autowired
    private CardService cardService;

    @Autowired
    private WxUserService wxUserService;

    @Autowired
    private AttachmentService attachmentService;

    /**
     * 从请求头中提取当前用户ID
     */
    private Long getCurrentUserId(String token) {
        return wxUserService.getUserIdByToken(token);
    }

    /**
     * GET /api/cards - 获取当前用户的名片列表
     */
    @GetMapping
    public Result<List<Card>> getCardList(
            @RequestHeader(value = "Authorization", required = false) String token) {
        if (token == null || token.isEmpty()) {
            return Result.error("未登录");
        }
        Long userId = getCurrentUserId(token);
        if (userId == null) {
            return Result.error("未登录");
        }
        List<Card> list = cardService.getCardListByUserId(userId);
        return Result.success(list);
    }

    /**
     * GET /api/cards/:id - 获取单个名片（同时增加查看次数）
     * 公开接口，无需登录即可查看（用于分享的名片详情页）
     */
    @GetMapping("/{id}")
    public Result<Card> getCardById(@PathVariable Long id) {
        Card card = cardService.getCardById(id);
        if (card == null) {
            return Result.error("名片不存在");
        }
        // 增加查看次数（仅更新 view_count，不影响 version 乐观锁）
        cardService.incrementViewCount(id);
        // 重新读取以获取最新的 viewCount 值
        card = cardService.getCardById(id);
        return Result.success(card);
    }

    /**
     * GET /api/cards/:id/views - 获取名片查看次数
     */
    @GetMapping("/{id}/views")
    public Result<Integer> getViewCount(@PathVariable Long id) {
        int count = cardService.getViewCount(id);
        return Result.success(count);
    }

    /**
     * POST /api/cards - 创建名片（关联当前用户）
     */
    @PostMapping
    public Result<Card> createCard(
            @Valid @RequestBody CardDTO cardDTO,
            @RequestHeader(value = "Authorization", required = false) String token) {
        Long userId = getCurrentUserId(token);
        if (userId == null) {
            return Result.error("未登录");
        }

        Card card = new Card();
        card.setName(cardDTO.getName());
        card.setPosition(cardDTO.getPosition());
        card.setCompany(cardDTO.getCompany());
        card.setPhone(cardDTO.getPhone());
        card.setAddress(cardDTO.getAddress());
        card.setAvatar(cardDTO.getAvatar());
        card.setPortrait(cardDTO.getPortrait());
        card.setIntroduction(cardDTO.getIntroduction());
        card.setPersonalIntro(cardDTO.getPersonalIntro());
        card.setBusinessIntro(cardDTO.getBusinessIntro());
        card.setIndustry(cardDTO.getIndustry());
        card.setWechat(cardDTO.getWechat());
        card.setEmail(cardDTO.getEmail());
        card.setAttachments(cardDTO.getAttachments());
        card.setImages(cardDTO.getImages());
        card.setBackground(cardDTO.getBackground());

        Card newCard = cardService.createCard(card, userId);
        return Result.success("创建成功", newCard);
    }

    /**
     * PUT /api/cards/:id - 更新名片（校验所有权）
     */
    @PutMapping("/{id}")
    public Result<Card> updateCard(
            @PathVariable Long id,
            @Valid @RequestBody CardDTO cardDTO,
            @RequestHeader(value = "Authorization", required = false) String token) {
        Long userId = getCurrentUserId(token);
        if (userId == null) {
            return Result.error("未登录");
        }

        Card existing = cardService.getCardById(id);
        if (existing == null) {
            return Result.error("名片不存在");
        }
        if (!userId.equals(existing.getUserId())) {
            return Result.error("无权修改此名片");
        }

        Card card = new Card();
        card.setName(cardDTO.getName());
        card.setPosition(cardDTO.getPosition());
        card.setCompany(cardDTO.getCompany());
        card.setPhone(cardDTO.getPhone());
        card.setAddress(cardDTO.getAddress());
        card.setAvatar(cardDTO.getAvatar());
        card.setIntroduction(cardDTO.getIntroduction());
        card.setAvatar(cardDTO.getAvatar());
        card.setPortrait(cardDTO.getPortrait());
        card.setIntroduction(cardDTO.getIntroduction());
        card.setPersonalIntro(cardDTO.getPersonalIntro());
        card.setBusinessIntro(cardDTO.getBusinessIntro());
        card.setIndustry(cardDTO.getIndustry());
        card.setWechat(cardDTO.getWechat());
        card.setEmail(cardDTO.getEmail());
        card.setAttachments(cardDTO.getAttachments());
        card.setImages(cardDTO.getImages());
        card.setBackground(cardDTO.getBackground());
        card.setVersion(cardDTO.getVersion());

        Card updatedCard = cardService.updateCard(id, card);
        if (updatedCard == null) {
            return Result.error("名片不存在");
        }
        return Result.success("更新成功", updatedCard);
    }

    /**
     * DELETE /api/cards/:id - 删除名片（校验所有权）
     */
    @DeleteMapping("/{id}")
    public Result<Void> deleteCard(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String token) {
        Long userId = getCurrentUserId(token);
        if (userId == null) {
            return Result.error("未登录");
        }

        Card existing = cardService.getCardById(id);
        if (existing == null) {
            return Result.error("名片不存在");
        }
        if (!userId.equals(existing.getUserId())) {
            return Result.error("无权删除此名片");
        }

        cardService.deleteCard(id);
        return Result.success("删除成功");
    }

    /**
     * GET /api/cards/:id/attachments - 获取名片附件列表
     */
    @GetMapping("/{id}/attachments")
    public Result<List<com.wxcard.entity.Attachment>> getAttachments(
            @PathVariable Long id) {
        Card existing = cardService.getCardById(id);
        if (existing == null) {
            return Result.error("名片不存在");
        }
        List<com.wxcard.entity.Attachment> list = attachmentService.getAttachmentsByCardId(id);
        return Result.success(list);
    }
}
