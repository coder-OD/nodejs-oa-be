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

//  Date: 02/07/2020 23:17:22
// */

// SET NAMES utf8mb4;
// SET FOREIGN_KEY_CHECKS = 0;

// -- ----------------------------
// -- Table structure for sys_user
// -- ----------------------------
// DROP TABLE IF EXISTS `sys_user`;
// CREATE TABLE `sys_user`  (
//   `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '唯一标识',
//   `username` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '登录帐号，邮箱或手机号',
//   `password` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '登录密码',
//   `nickname` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '昵称',
//   `avator` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '用户头像',
//   `sex` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '性别：u:未知,  m:男,  w:女',
//   `gmt_create` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   `gmt_modify` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0),
//   PRIMARY KEY (`id`) USING BTREE,
//   UNIQUE INDEX `username_UNIQUE`(`username`) USING BTREE
// ) ENGINE = InnoDB AUTO_INCREMENT = 120 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '用户表' ROW_FORMAT = Dynamic;

// SET FOREIGN_KEY_CHECKS = 1;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, max: 50 },
  password: { type: String, required: true, max: 64 },
  nickname: { type: String, max: 64 },
  avator: { type: String, max: 64 },
  gmt_create: { type: Date },
  gmt_modify: { type: Date },
});

module.exports = mongoose.model("User", UserSchema);
