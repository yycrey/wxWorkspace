package com.wxcard.service;

import com.wxcard.entity.CompanyIntro;
import com.wxcard.mapper.CompanyIntroMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class CompanyIntroService {

    @Autowired
    private CompanyIntroMapper companyIntroMapper;

    /**
     * 获取公司简介（只返回第一条）
     */
    public CompanyIntro getCompanyIntro() {
        return companyIntroMapper.selectList(null).stream().findFirst().orElse(null);
    }

    /**
     * 保存公司简介（如果不存在则创建，存在则更新）
     */
    public CompanyIntro saveCompanyIntro(String content) {
        CompanyIntro intro = getCompanyIntro();
        
        if (intro == null) {
            // 创建新的
            intro = new CompanyIntro();
            intro.setContent(content);
            intro.setCreateTime(LocalDateTime.now());
            intro.setUpdateTime(LocalDateTime.now());
            companyIntroMapper.insert(intro);
        } else {
            // 更新现有的
            intro.setContent(content);
            intro.setUpdateTime(LocalDateTime.now());
            companyIntroMapper.updateById(intro);
        }
        
        return intro;
    }
}
