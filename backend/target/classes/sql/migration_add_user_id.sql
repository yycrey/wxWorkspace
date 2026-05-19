-- 添加用户ID字段，关联名片与微信用户
ALTER TABLE `card` ADD COLUMN `user_id` bigint NOT NULL DEFAULT 0 COMMENT '所属用户ID' AFTER `id`;

-- 为已有名片设置默认用户关联（如果需要，请根据实际用户ID更新）
-- 示例：UPDATE `card` SET `user_id` = 1 WHERE `user_id` = 0;

-- 添加索引以加速按用户查询
ALTER TABLE `card` ADD INDEX `idx_user_id` (`user_id`);
