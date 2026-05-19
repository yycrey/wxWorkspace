-- ----------------------------
--  数据库创建脚本
-- ----------------------------
CREATE DATABASE IF NOT EXISTS wxcard DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE wxcard;

-- ----------------------------
--  名片表
-- ----------------------------
DROP TABLE IF EXISTS `card`;
CREATE TABLE `card` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(100) NOT NULL COMMENT '姓名',
  `position` varchar(100) DEFAULT '' COMMENT '职位',
  `company` varchar(200) DEFAULT '' COMMENT '公司',
  `phone` varchar(20) DEFAULT '' COMMENT '电话',
  `address` varchar(500) DEFAULT '' COMMENT '地址',
  `avatar` varchar(500) DEFAULT '' COMMENT '头像URL',
  `portrait` varchar(500) DEFAULT '' COMMENT '形象照URL',
  `introduction` text COMMENT '个人简介',
  `personal_intro` text COMMENT '个人介绍',
  `business_intro` text COMMENT '业务介绍',
  `industry` varchar(100) DEFAULT '机械设备' COMMENT '行业',
  `wechat` varchar(100) DEFAULT '' COMMENT '微信号',
  `email` varchar(200) DEFAULT '' COMMENT '邮箱',
  `attachments` text COMMENT '附件列表(JSON)',
  `user_id` bigint DEFAULT NULL COMMENT '所属用户ID',
  `images` text COMMENT '图片列表(JSON)',
  `background` varchar(500) DEFAULT '' COMMENT '名片背景图片URL',
  `view_count` int DEFAULT '0' COMMENT '查看次数',
  `version` int NOT NULL DEFAULT 0 COMMENT '版本号，用于乐观锁',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='名片表';

-- ----------------------------
--  公司简介表
-- ----------------------------
DROP TABLE IF EXISTS `company_intro`;
CREATE TABLE `company_intro` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `content` text COMMENT '公司简介内容',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='公司简介表';

-- ----------------------------
--  初始数据
-- ----------------------------
INSERT INTO `company_intro` (`content`) VALUES ('这是默认的公司简介内容');

-- ----------------------------
--  微信用户表
-- ----------------------------
DROP TABLE IF EXISTS `wx_user`;
CREATE TABLE `wx_user` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `openid` varchar(100) NOT NULL COMMENT '微信openid',
  `unionid` varchar(100) DEFAULT '' COMMENT '微信unionid',
  `nickname` varchar(100) DEFAULT '微信用户' COMMENT '昵称',
  `avatar_url` varchar(500) DEFAULT '' COMMENT '头像URL',
  `phone` varchar(20) DEFAULT '' COMMENT '手机号',
  `session_key` varchar(100) DEFAULT '' COMMENT '会话密钥',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_openid` (`openid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='微信用户表';

-- ----------------------------
--  附件表
-- ----------------------------
DROP TABLE IF EXISTS `attachment`;
CREATE TABLE `attachment` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `card_id` bigint DEFAULT NULL COMMENT '关联名片ID',
  `file_type` varchar(50) NOT NULL DEFAULT 'attachment' COMMENT '文件类型(portrait/background/avatar/attachment)',
  `original_name` varchar(255) DEFAULT '' COMMENT '原始文件名',
  `file_path` varchar(500) NOT NULL COMMENT '物理存储路径',
  `url` varchar(500) NOT NULL COMMENT '访问URL',
  `file_size` bigint DEFAULT 0 COMMENT '文件大小(字节)',
  `mime_type` varchar(100) DEFAULT '' COMMENT 'MIME类型',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_card_id` (`card_id`),
  KEY `idx_file_type` (`file_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='附件表';
