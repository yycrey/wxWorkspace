package com.wxcard.controller;

import com.wxcard.dto.PhoneLoginDTO;
import com.wxcard.dto.Result;
import com.wxcard.dto.WxLoginDTO;
import com.wxcard.dto.WxUserDTO;
import com.wxcard.service.WxUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private WxUserService wxUserService;

    /**
     * POST /api/auth/login - 微信登录
     * 前端传入 wx.login 的 code，后端换取 openid 并创建/更新用户
     */
    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody WxLoginDTO loginDTO) {
        if (loginDTO.getCode() == null || loginDTO.getCode().isEmpty()) {
            return Result.error("code不能为空");
        }
        try {
            Map<String, Object> result = wxUserService.login(loginDTO);
            return Result.success("登录成功", result);
        } catch (Exception e) {
            return Result.error("登录失败: " + e.getMessage());
        }
    }

    /**
     * POST /api/auth/simple-login - 简化登录（无需授权）
     * 前端只需调用 wx.login 获取 code，后端自动创建用户
     */
    @PostMapping("/simple-login")
    public Result<Map<String, Object>> simpleLogin(@RequestBody WxLoginDTO loginDTO) {
        if (loginDTO.getCode() == null || loginDTO.getCode().isEmpty()) {
            return Result.error("code不能为空");
        }
        try {
            Map<String, Object> result = wxUserService.simpleLogin(loginDTO.getCode());
            return Result.success("登录成功", result);
        } catch (Exception e) {
            return Result.error("登录失败: " + e.getMessage());
        }
    }

    /**
     * POST /api/auth/phone-login - 手机号一键登录
     * 前端传入 wx.login 的 code 和 getPhoneNumber 的加密数据
     */
    @PostMapping("/phone-login")
    public Result<Map<String, Object>> phoneLogin(@RequestBody PhoneLoginDTO loginDTO) {
        if (loginDTO.getCode() == null || loginDTO.getCode().isEmpty()) {
            return Result.error("code不能为空");
        }
        try {
            Map<String, Object> result = wxUserService.phoneLogin(loginDTO);
            return Result.success("登录成功", result);
        } catch (Exception e) {
            return Result.error("登录失败: " + e.getMessage());
        }
    }

    /**
     * GET /api/auth/userinfo - 获取当前用户信息
     * 通过 Authorization header 中的 token 获取
     */
    @GetMapping("/userinfo")
    public Result<WxUserDTO> getUserInfo(@RequestHeader(value = "Authorization", required = false) String token) {
        if (token == null || token.isEmpty()) {
            return Result.error("未登录");
        }
        WxUserDTO userInfo = wxUserService.getUserInfoByToken(token);
        if (userInfo == null) {
            return Result.error("用户不存在或token已过期");
        }
        return Result.success(userInfo);
    }

    /**
     * PUT /api/auth/userinfo - 更新用户信息（昵称、头像）
     */
    @PutMapping("/userinfo")
    public Result<WxUserDTO> updateUserInfo(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, String> body) {
        if (token == null || token.isEmpty()) {
            return Result.error("未登录");
        }
        WxUserDTO currentUser = wxUserService.getUserInfoByToken(token);
        if (currentUser == null) {
            return Result.error("用户不存在或token已过期");
        }
        WxUserDTO updated = wxUserService.updateUser(
            currentUser.getId(),
            body.get("nickname"),
            body.get("avatarUrl")
        );
        return Result.success("更新成功", updated);
    }
}
