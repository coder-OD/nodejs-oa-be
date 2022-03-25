// /*
//  Navicat Premium Data Transfer

//  Source Server         : 生产环境数据库
//  Source Server Type    : MySQL
//  Source Server Version : 50730
//  Source Host           : 106.55.168.13:3306
//  Source Schema         : todo_admin

//  Target Server Type    : MySQL
//  Target Server Version : 50730
//  File Encoding         : 65001

//  Date: 02/07/2020 23:17:39
// */

// SET NAMES utf8mb4;
// SET FOREIGN_KEY_CHECKS = 0;

// -- ----------------------------
// -- Table structure for sys_task
// -- ----------------------------
// DROP TABLE IF EXISTS `sys_task`;
// CREATE TABLE `sys_task`  (
//   `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '唯一标识',
//   `title` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '任务名称 - 标题',
//   `content` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '任务内容',
//   `status` int(3) NULL DEFAULT 0 COMMENT '任务状态：0:待办 1:完成 2:删除',
//   `is_major` int(3) NULL DEFAULT 0 COMMENT '标识：0:不重要 1:重要',
//   `gmt_create` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
//   `gmt_expire` bigint(20) NULL DEFAULT NULL COMMENT '截止日期',
//   PRIMARY KEY (`id`) USING BTREE,
//   UNIQUE INDEX `title_UNIQUE`(`title`) USING BTREE
// ) ENGINE = InnoDB AUTO_INCREMENT = 48 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '任务清单表' ROW_FORMAT = Dynamic;

// SET FOREIGN_KEY_CHECKS = 1;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  title: { type: String, max: 100 },
  content: { type: String, max: 255 },
  status: { type: Number, enum: [0, 1, 2], default: 0 },
  is_major: { type: Number, enum: [0, 1], default: 0 },
  gmt_create: { type: Number,  default: Date.now},
  gmt_expire: { type: Number, },
});

module.exports = mongoose.model("Task", TaskSchema);