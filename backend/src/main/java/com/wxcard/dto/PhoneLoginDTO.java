package com.wxcard.dto;

import lombok.Data;

@Data
public class PhoneLoginDTO {
    /**
     * 微信登录code
     */
    private String code;

    /**
     * 手机号加密数据
     */
    private String encryptedData;

    /**
     * 解密向量
     */
    private String iv;
}
