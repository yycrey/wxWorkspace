-- ----------------------------
--  增量迁移脚本：为已存在的表添加 version 字段
--  执行时间：2026-04-27
-- ----------------------------

-- 为 card 表添加 version 字段（如果不存在）
ALTER TABLE `card` 
ADD COLUMN IF NOT EXISTS `version` int NOT NULL DEFAULT 0 COMMENT '版本号，用于乐观锁' AFTER `images`;

-- 如果 ADD COLUMN IF NOT EXISTS 语法不支持，使用以下方式：
-- 先检查字段是否存在，再添加
-- SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
--                WHERE TABLE_SCHEMA = 'wxcard' AND TABLE_NAME = 'card' AND COLUMN_NAME = 'version');
-- SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE `card` ADD COLUMN `version` int NOT NULL DEFAULT 0 COMMENT ''版本号，用于乐观锁''', 'SELECT 1');
-- PREPARE stmt FROM @sqlstmt;
-- EXECUTE stmt;
-- DEALLOCATE PREPARE stmt;
