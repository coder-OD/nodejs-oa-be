/**
 * 描述: 连接mysql模块
 * 作者: Jack Chen
 * 日期: 2020-06-20
 */

const mysql = require("mysql");
const config = require("../db/dbConfig"); // 导入 mongoose 模块
const mongoose = require("mongoose");

// 连接mongodb
function connectMongo() {
  // 设置默认 mongoose 连接
  const mongoDB = `mongodb://127.0.0.1/my_test`;
  mongoose.connect(mongoDB);
  // 让 mongoose 使用全局 Promise 库
  mongoose.Promise = global.Promise;
  // 取得默认连接
  const db = mongoose.connection;

  // 将连接与错误事件绑定（以获得连接错误的提示）
  db.on("error", console.error.bind(console, "MongoDB 连接错误："));
}

// 连接mysql
function connect() {
  const { host, user, password, database } = config;
  return mysql.createConnection({
    host,
    user,
    password,
    database,
  });
}

// 新建查询连接
function querySql(sql) {
  const conn = connect();
  return new Promise((resolve, reject) => {
    try {
      conn.query(sql, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    } catch (e) {
      reject(e);
    } finally {
      // 释放连接
      conn.end();
    }
  });
}

// 查询一条语句
function queryOne(sql) {
  return new Promise((resolve, reject) => {
    querySql(sql)
      .then((res) => {
        console.log("res===", res);
        if (res && res.length > 0) {
          resolve(res[0]);
        } else {
          resolve(null);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = {
  querySql,
  queryOne,
  connectMongo,
};
