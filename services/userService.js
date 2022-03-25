/**
 * 描述: 业务逻辑处理 - 用户相关接口
 * 作者: Jack Chen
 * 日期: 2020-06-20
 */

const { querySql, queryOne } = require("../utils/index");
const md5 = require("../utils/md5");
const jwt = require("jsonwebtoken");
const boom = require("boom");
const { body, validationResult } = require("express-validator");
const {
  CODE_ERROR,
  CODE_SUCCESS,
  PRIVATE_KEY,
  JWT_EXPIRED,
} = require("../utils/constant");
const { decode } = require("../utils/user-jwt");
const User = require("../models/user");

// 登录
async function login(req, res, next) {
  const err = validationResult(req);
  // 如果验证错误，empty不为空
  if (!err.isEmpty()) {
    // 获取错误信息
    const [{ msg }] = err.errors;
    // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回
    next(boom.badRequest(msg));
  } else {
    let { username, password } = req.body;
    // md5加密
    password = md5(password);
    User.findOne(
      {
        username: username,
        password: password,
      },
      async (err, instance) => {
        if (!instance) {
          res.json({
            code: CODE_ERROR,
            msg: "用户名或密码错误",
            data: null,
          });
        } else {
          //登录成功，签发一个token并且返回前端
          const token = jwt.sign({ username }, PRIVATE_KEY, {
            expiresIn: JWT_EXPIRED,
          });
          let userData = {
            id: instance.id,
            username: instance.username,
            nickname: instance.nickname,
            avator: instance.avator,
            sex: instance.sex,
            gmt_create: instance.gmt_create,
            gmt_modify: instance.gmt_modify,
          };

          res.json({
            code: CODE_SUCCESS,
            msg: "注册成功",
            data: {
              token,
              userData,
            },
          });
        }
      }
    );
  }
}

// 注册
async function register(req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    let { username, password } = req.body;
    findUser(username).then((data) => {
      console.log("用户注册===", data);
      if (data) {
        res.json({
          code: CODE_ERROR,
          msg: "用户已存在",
          data: null,
        });
      } else {
        password = md5(password);
        const awesome_instance = new User({
          username,
          password,
          gmt_create: new Date(),
          gmt_modify: new Date(),
        });
        awesome_instance.save(async function (err) {
          if (err) {
            return handleError(err);
          } // 已保存
          console.log("new user saved");

          const curUser = await findUser(username);
          if (!curUser) {
            res.json({
              code: CODE_ERROR,
              msg: "注册失败",
              data: null,
            });
          } else {
            User.findOne(
              {
                username: username,
                password: password,
              },
              (err, instance) => {
                console.log("instance", instance);
                const token = jwt.sign({ username }, PRIVATE_KEY, {
                  expiresIn: JWT_EXPIRED,
                });
                let userData = {
                  id: instance.id,
                  username: instance.username,
                  nickname: instance.nickname,
                  avator: instance.avator,
                  sex: instance.sex,
                  gmt_create: instance.gmt_create,
                  gmt_modify: instance.gmt_modify,
                };

                res.json({
                  code: CODE_SUCCESS,
                  msg: "注册成功",
                  data: {
                    token,
                    userData,
                  },
                });
              }
            );
          }
        });
      }
    });
  }
}

// 重置密码
function resetPwd(req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    let { username, oldPassword, newPassword } = req.body;
    oldPassword = md5(oldPassword);
    newPassword = md5(newPassword);
    validateUser(username, oldPassword).then((data) => {
      console.log("校验用户名和密码===", data);
      if (data) {
        if (oldPassword === newPassword) {
          res.json({
            code: CODE_ERROR,
            msg: "新密码与旧密码不能相同",
          });
        } else {
          User.findOne({ username }, (err, user) => {
            if (err) {
              console.log(err);
            }

            if (user) {
              user.password = newPassword;
              user.gmt_modify = new Date();
              user.save((e, u) => {
                if (e) {
                  console.log(e);
                }
                res.json({
                  code: CODE_SUCCESS,
                  msg: "重置密码成功",
                  data: null,
                });
              });
            } else {
              res.json({
                code: CODE_ERROR,
                msg: "重置密码失败",
                data: null,
              });
            }
          });
        }
      } else {
        res.json({
          code: CODE_ERROR,
          msg: "用户名或旧密码错误",
          data: null,
        });
      }
    });
  }
}

// 校验用户名和密码
async function validateUser(username, oldPassword) {
  // const query = `select id, username from sys_user where username='${username}' and password='${oldPassword}'`;
  // return queryOne(query);
  let curUser = User.findOne(
    { username: username, password: oldPassword },
    (err, user) => {
      if (err) {
        console.log(err);
      }
      curUser = user;
    }
  ).clone();
  return curUser;
}

// 通过用户名查询用户信息
function findUser(username) {
  const u = User.findOne(
    { username: username },
    "id, username",
    function (err, user) {
      if (err) {
        console.log("hit error", err);
      }
    }
  ).clone();

  return u;
}

module.exports = {
  login,
  register,
  resetPwd,
};
