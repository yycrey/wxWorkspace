package com.wxcard.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.wxcard.entity.Attachment;
import com.wxcard.mapper.AttachmentMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AttachmentService {

    @Autowired
    private AttachmentMapper attachmentMapper;

    /**
     * 保存附件记录
     */
    public Attachment saveAttachment(Attachment attachment) {
        attachment.setCreateTime(LocalDateTime.now());
        attachmentMapper.insert(attachment);
        return attachment;
    }

    /**
     * 根据名片ID获取附件列表
     */
    public List<Attachment> getAttachmentsByCardId(Long cardId) {
        LambdaQueryWrapper<Attachment> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Attachment::getCardId, cardId);
        wrapper.orderByDesc(Attachment::getCreateTime);
        return attachmentMapper.selectList(wrapper);
    }

    /**
     * 根据名片ID和文件类型获取附件列表
     */
    public List<Attachment> getAttachmentsByCardIdAndType(Long cardId, String fileType) {
        LambdaQueryWrapper<Attachment> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Attachment::getCardId, cardId);
        wrapper.eq(Attachment::getFileType, fileType);
        wrapper.orderByDesc(Attachment::getCreateTime);
        return attachmentMapper.selectList(wrapper);
    }

    /**
     * 根据ID获取附件
     */
    public Attachment getAttachmentById(Long id) {
        return attachmentMapper.selectById(id);
    }

    /**
     * 删除附件记录
     */
    public void deleteAttachment(Long id) {
        attachmentMapper.deleteById(id);
    }

    /**
     * 根据名片ID删除所有附件（含物理文件）
     */
    public void deleteByCardId(Long cardId) {
        List<Attachment> list = getAttachmentsByCardId(cardId);
        for (Attachment att : list) {
            deletePhysicalFile(att);
        }
        LambdaQueryWrapper<Attachment> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Attachment::getCardId, cardId);
        attachmentMapper.delete(wrapper);
    }

    /**
     * 根据名片ID和文件类型删除附件（含物理文件）
     */
    public void deleteByCardIdAndType(Long cardId, String fileType) {
        List<Attachment> list = getAttachmentsByCardIdAndType(cardId, fileType);
        for (Attachment att : list) {
            deletePhysicalFile(att);
        }
        LambdaQueryWrapper<Attachment> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Attachment::getCardId, cardId);
        wrapper.eq(Attachment::getFileType, fileType);
        attachmentMapper.delete(wrapper);
    }

    /**
     * 删除物理文件
     */
    public void deletePhysicalFile(Attachment attachment) {
        if (attachment == null || attachment.getFilePath() == null) return;
        try {
            File file = new File(attachment.getFilePath());
            if (file.exists()) {
                file.delete();
            }
        } catch (Exception e) {
            // 物理文件删除失败不影响业务流程
            e.printStackTrace();
        }
    }
}
