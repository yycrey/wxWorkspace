package com.wxcard.controller;

import com.wxcard.dto.CompanyIntroDTO;
import com.wxcard.dto.Result;
import com.wxcard.entity.CompanyIntro;
import com.wxcard.service.CompanyIntroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/company")
@CrossOrigin(origins = "*")
public class CompanyIntroController {

    @Autowired
    private CompanyIntroService companyIntroService;

    /**
     * GET /api/company/intro - 获取公司简介
     */
    @GetMapping("/intro")
    public Result<Map<String, String>> getCompanyIntro() {
        CompanyIntro intro = companyIntroService.getCompanyIntro();
        Map<String, String> result = new HashMap<>();
        result.put("content", intro != null ? intro.getContent() : "");
        return Result.success(result);
    }

    /**
     * POST /api/company/intro - 保存公司简介
     */
    @PostMapping("/intro")
    public Result<Void> saveCompanyIntro(@RequestBody CompanyIntroDTO dto) {
        companyIntroService.saveCompanyIntro(dto.getContent());
        return Result.success("保存成功");
    }
}
