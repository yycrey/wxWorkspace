package com.wxcard.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("wx_user")
public class WxUser {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String openid;         // 微信openid
    private String unionid;        // 微信unionid（可选）
    private String nickname;       // 昵称
    private String avatarUrl;      // 头像URL
    private String phone;          // 手机号
    private String sessionKey;     // 会话密钥

    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
