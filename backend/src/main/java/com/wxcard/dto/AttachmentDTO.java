package com.wxcard.dto;

import lombok.Data;

@Data
public class AttachmentDTO {
    private Long id;
    private Long cardId;
    private String fileType;
    private String originalName;
    private String url;
    private Long fileSize;
    private String mimeType;
    private String createTime;
}
