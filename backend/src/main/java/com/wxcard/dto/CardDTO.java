package com.wxcard.dto;

import lombok.Data;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
public class CardDTO {
    private Long id;

    /**
     * 版本号，用于乐观锁并发控制
     * 前端在编辑时需要将此值传给后端
     */
    private Integer version;

    @NotBlank(message = "姓名不能为空")
    @Size(max = 100, message = "姓名长度不能超过100个字符")
    private String name;

    @Size(max = 100, message = "职位长度不能超过100个字符")
    private String position;

    @Size(max = 200, message = "公司名称长度不能超过200个字符")
    private String company;

    @Size(max = 20, message = "电话号码长度不能超过20个字符")
    private String phone;

    @Size(max = 500, message = "地址长度不能超过500个字符")
    private String address;

    private String avatar;

    private String portrait;

    private String introduction;

    private String personalIntro;

    private String businessIntro;

    private String industry;

    private String wechat;

    private String email;

    private String attachments;

    private String images;

    private String background;
}
