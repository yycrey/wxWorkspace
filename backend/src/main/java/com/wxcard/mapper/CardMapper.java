package com.wxcard.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.wxcard.entity.Card;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface CardMapper extends BaseMapper<Card> {

    /**
     * 仅增加查看次数，不触发表 version 乐观锁字段
     * 避免 incrementViewCount 连带自增 version 导致前端乐观锁冲突
     */
    @Update("UPDATE card SET view_count = view_count + 1 WHERE id = #{id}")
    int incrementViewCountOnly(@Param("id") Long id);
}
