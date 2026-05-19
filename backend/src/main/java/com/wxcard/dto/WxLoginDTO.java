package com.wxcard.dto;

import lombok.Data;

@Data
public class WxLoginDTO {
    private String code;       // wx.login 返回的 code
    private String nickname;   // 用户昵称
    private String avatarUrl;  // 用户头像URL（上传后的服务器地址）
}
