package com.wxcard.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("attachment")
public class Attachment {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long cardId;           // 关联名片ID
    private String fileType;       // 文件类型(portrait/background/avatar/attachment)
    private String originalName;   // 原始文件名
    private String filePath;       // 物理存储路径
    private String url;            // 访问URL
    private Long fileSize;         // 文件大小(字节)
    private String mimeType;       // MIME类型
    private LocalDateTime createTime;
}
