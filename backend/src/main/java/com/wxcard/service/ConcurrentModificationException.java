package com.wxcard.service;

import com.wxcard.entity.Card;
import lombok.Getter;

/**
 * 并发修改异常
 * 当检测到数据已被其他用户修改时抛出
 */
@Getter
public class ConcurrentModificationException extends RuntimeException {
    
    private final Card latestCard;
    
    public ConcurrentModificationException(String message, Card latestCard) {
        super(message);
        this.latestCard = latestCard;
    }

}
