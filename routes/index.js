// 定义和主页相关的路由接口
const express = require('express');
const router = express.Router();
// 导入数据模块和验证是否登录模块，目的是使用各个模块中api（比如：data.users, check.checkLogin）
const data = require('../modules/data.js');
const check = require('../modules/check.js')


// 定义一个匹配主页请求的接口
// 第二个参数是管线函数，当满足登录判断条件，则说明登录过，则继续执行下一管线，即第三个参数对应的回调函数
// 如果不能满足登录判断条件，则说明未登录，则直接跳转到login.html让用户登录
router.get('/', check.checkLogin, function (req, res) {
    // 获取查找的参数loginname
    var loginname = req.query.loginname;
    // 获取用户数据 
    var users = data.users;
    // 当查找的参数loginname存在时，会在users数组中筛选满足条件的数据，返回一个新数组，重新赋值给users
    if (loginname) {
        users = users.filter(function (user, index) {
            return user.loginname.indexOf(loginname) > -1;
        })
    }

    res.render('index.html', {
        title: 'node端操作数组实现增删查改',
        users
    });
})

module.exports = router;