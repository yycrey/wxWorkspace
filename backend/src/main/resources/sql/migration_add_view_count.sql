-- 添加查看次数字段
ALTER TABLE `card` ADD COLUMN `view_count` int NOT NULL DEFAULT 0 COMMENT '查看次数' AFTER `images`;
