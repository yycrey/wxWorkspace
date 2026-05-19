package com.wxcard.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.wxcard.entity.Attachment;
import com.wxcard.entity.Card;
import com.wxcard.mapper.CardMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CardService {

    @Autowired
    private CardMapper cardMapper;

    @Autowired
    private AttachmentService attachmentService;

    /**
     * 获取指定用户的名片列表
     */
    public List<Card> getCardListByUserId(Long userId) {
        LambdaQueryWrapper<Card> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Card::getUserId, userId);
        wrapper.orderByDesc(Card::getCreateTime);
        return cardMapper.selectList(wrapper);
    }

    /**
     * 根据ID获取名片
     */
    public Card getCardById(Long id) {
        return cardMapper.selectById(id);
    }

    /**
     * 创建名片（关联当前用户）
     */
    public Card createCard(Card card, Long userId) {
        card.setUserId(userId);
        card.setCreateTime(LocalDateTime.now());
        card.setUpdateTime(LocalDateTime.now());
        cardMapper.insert(card);
        return card;
    }

    /**
     * 更新名片
     * 使用乐观锁机制防止并发更新导致的数据丢失
     * 更新前自动清理旧的附件物理文件
     */
    public Card updateCard(Long id, Card card) {
        Card existingCard = cardMapper.selectById(id);
        if (existingCard == null) {
            return null;
        }

        // 版本号校验：依赖 MyBatis-Plus @Version 插件在 updateById 时自动处理
        // 如果前端传入了版本号，手动设置为 existingCard 上，让插件生成 WHERE version = ?
        if (card.getVersion() != null) {
            existingCard.setVersion(card.getVersion());
        }

        // 如果 portrait 发生变化，清理旧的 portrait 附件
        if (card.getPortrait() != null && !card.getPortrait().equals(existingCard.getPortrait())) {
            attachmentService.deleteByCardIdAndType(id, "portrait");
        }

        // 如果 background 发生变化，清理旧的 background 附件
        if (card.getBackground() != null && !card.getBackground().equals(existingCard.getBackground())) {
            attachmentService.deleteByCardIdAndType(id, "background");
        }

        // 只更新非空字段
        if (card.getName() != null) existingCard.setName(card.getName());
        if (card.getPosition() != null) existingCard.setPosition(card.getPosition());
        if (card.getCompany() != null) existingCard.setCompany(card.getCompany());
        if (card.getPhone() != null) existingCard.setPhone(card.getPhone());
        if (card.getAddress() != null) existingCard.setAddress(card.getAddress());
        if (card.getAvatar() != null) existingCard.setAvatar(card.getAvatar());
        if (card.getPortrait() != null) existingCard.setPortrait(card.getPortrait());
        if (card.getIntroduction() != null) existingCard.setIntroduction(card.getIntroduction());
        if (card.getPersonalIntro() != null) existingCard.setPersonalIntro(card.getPersonalIntro());
        if (card.getBusinessIntro() != null) existingCard.setBusinessIntro(card.getBusinessIntro());
        if (card.getIndustry() != null) existingCard.setIndustry(card.getIndustry());
        if (card.getWechat() != null) existingCard.setWechat(card.getWechat());
        if (card.getEmail() != null) existingCard.setEmail(card.getEmail());
        if (card.getAttachments() != null) existingCard.setAttachments(card.getAttachments());
        if (card.getImages() != null) existingCard.setImages(card.getImages());
        if (card.getBackground() != null) existingCard.setBackground(card.getBackground());

        existingCard.setUpdateTime(LocalDateTime.now());
        // 版本号交由 MyBatis-Plus @Version 插件自动管理：
        // 生成 SQL: SET version = version + 1 WHERE id = ? AND version = ?
        int rows = cardMapper.updateById(existingCard);

        if (rows == 0) {
            Card latestCard = cardMapper.selectById(id);
            throw new ConcurrentModificationException(
                "数据已被其他用户修改，请刷新后重试",
                latestCard
            );
        }
        return existingCard;
    }

    /**
     * 增加名片查看次数（仅更新 view_count，不触发表 version 乐观锁字段）
     */
    public int incrementViewCount(Long id) {
        return cardMapper.incrementViewCountOnly(id);
    }

    /**
     * 获取名片查看次数
     */
    public int getViewCount(Long id) {
        Card card = cardMapper.selectById(id);
        return card != null && card.getViewCount() != null ? card.getViewCount() : 0;
    }

    /**
     * 删除名片（同时清理关联的附件 DB 记录和物理文件）
     */
    public void deleteCard(Long id) {
        // 先清理关联的附件（含物理文件）
        attachmentService.deleteByCardId(id);
        // 再删除名片记录
        cardMapper.deleteById(id);
    }
}
