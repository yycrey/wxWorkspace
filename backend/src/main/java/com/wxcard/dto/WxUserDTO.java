package com.wxcard.dto;

import lombok.Data;

@Data
public class WxUserDTO {
    private Long id;
    private String openid;
    private String nickname;
    private String avatarUrl;
    private String phone;
}
