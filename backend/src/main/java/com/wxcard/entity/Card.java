package com.wxcard.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.Version;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("card")
public class Card {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String name;           // 姓名
    private String position;       // 职位
    private String company;        // 公司
    private String phone;          // 电话
    private String address;        // 地址
    private String avatar;         // 头像URL
    private String portrait;       // 形象照URL
    private String introduction;   // 个人简介（兼容旧数据）
    private String personalIntro;  // 个人介绍
    private String businessIntro;  // 业务介绍
    private String industry;       // 行业
    private String wechat;         // 微信
    private String email;          // 邮箱
    private String attachments;    // 附件列表（JSON字符串）
    private Long userId;           // 所属用户ID
    private String images;         // 图片列表（JSON字符串）
    private String background;     // 名片背景图片URL
    private Integer viewCount = 0; // 查看次数
    
    @Version
    private Integer version;       // 版本号，用于乐观锁
    
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
