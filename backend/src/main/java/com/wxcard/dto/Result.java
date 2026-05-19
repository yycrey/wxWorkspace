package com.wxcard.dto;

import lombok.Data;

@Data
public class Result<T> {
    private Integer code;
    private String message;
    private T data;

    // 成功状态码
    public static final int CODE_SUCCESS = 0;
    // 并发冲突状态码
    public static final int CODE_CONFLICT = 409;

    public static <T> Result<T> success(T data) {
        Result<T> result = new Result<>();
        result.setCode(CODE_SUCCESS);
        result.setMessage("success");
        result.setData(data);
        return result;
    }

    public static <T> Result<T> success(String message, T data) {
        Result<T> result = new Result<>();
        result.setCode(CODE_SUCCESS);
        result.setMessage(message);
        result.setData(data);
        return result;
    }

    public static <T> Result<T> success(String message) {
        Result<T> result = new Result<>();
        result.setCode(CODE_SUCCESS);
        result.setMessage(message);
        return result;
    }

    public static <T> Result<T> error(String message) {
        Result<T> result = new Result<>();
        result.setCode(-1);
        result.setMessage(message);
        return result;
    }

    public static <T> Result<T> error(Integer code, String message) {
        Result<T> result = new Result<>();
        result.setCode(code);
        result.setMessage(message);
        return result;
    }

    /**
     * 并发冲突专用方法
     */
    public static <T> Result<T> conflict(String message) {
        Result<T> result = new Result<>();
        result.setCode(CODE_CONFLICT);
        result.setMessage(message);
        return result;
    }
}
