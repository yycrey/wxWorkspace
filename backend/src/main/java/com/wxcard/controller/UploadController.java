package com.wxcard.controller;

import com.wxcard.dto.Result;
import com.wxcard.dto.UploadResultDTO;
import com.wxcard.entity.Attachment;
import com.wxcard.service.AttachmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class UploadController {

    @Value("${upload.path}")
    private String uploadPath;

    @Value("${upload.base-url}")
    private String baseUrl;

    @Autowired
    private AttachmentService attachmentService;

    /**
     * POST /api/upload - 上传文件
     * @param file 文件
     * @param fileType 文件类型(portrait/background/avatar/attachment)
     * @param cardId 关联名片ID(可选)
     */
    @PostMapping("/upload")
    public Result<UploadResultDTO> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "fileType", required = false, defaultValue = "attachment") String fileType,
            @RequestParam(value = "cardId", required = false) Long cardId) {
        if (file.isEmpty()) {
            return Result.error("请选择文件");
        }

        // 获取文件扩展名
        String originalFilename = file.getOriginalFilename();
        String suffix = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            suffix = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        // 生成新文件名
        String newFilename = UUID.randomUUID().toString().replace("-", "") + suffix;

        // 创建上传目录
        File uploadDir = new File(uploadPath);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        // 保存文件
        File destFile = new File(uploadPath + newFilename);
        try {
            file.transferTo(destFile);
        } catch (IOException e) {
            e.printStackTrace();
            return Result.error("上传失败");
        }
        
        String fileUrl = baseUrl + newFilename;

        // 保存附件记录到数据库
        try {
            // 如果上传时指定了名片ID，先清理该名片下同类型的旧附件（含物理文件）
            if (cardId != null) {
                attachmentService.deleteByCardIdAndType(cardId, fileType);
            }

            Attachment attachment = new Attachment();
            attachment.setCardId(cardId);
            attachment.setFileType(fileType);
            attachment.setOriginalName(originalFilename != null ? originalFilename : newFilename);
            attachment.setFilePath(destFile.getAbsolutePath());
            attachment.setUrl(fileUrl);
            attachment.setFileSize(file.getSize());
            String mimeType = file.getContentType();
            attachment.setMimeType(mimeType != null ? mimeType : "");
            attachmentService.saveAttachment(attachment);
        } catch (Exception e) {
            e.printStackTrace();
            // 附件记录保存失败不影响文件上传
        }

        // 返回访问URL
        UploadResultDTO result = new UploadResultDTO();
        result.setUrl(fileUrl);
        return Result.success("上传成功", result);
    }
}
