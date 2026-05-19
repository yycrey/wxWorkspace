package com.wxcard.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("company_intro")
public class CompanyIntro {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String content;        // 公司简介内容
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
