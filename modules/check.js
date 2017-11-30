// 自定义的模块，用来验证用户是否登录，当用户未登录时，不让访问主页，更不会让操作数据（比如：添加，删除，修改，查找）
// 另外一定注意在node.js中每一个js文件都拥有独立的作用域，所以两个js文件之间要使用，必须先导出，再在另一个js文件中导入去使用。
// 另外要注意就是因为每个js文件都拥有独立的作用域，所以此处的express,app对象和app.js中同名的对象不相干。
const express = require('express');
const app = express();

// 定义一个验证是否登录管线，
function checkLogin(req, res, next) {
    // 获取请求的cookies对象中loginname所对应的cookie值
    var loginname = req.cookies.loginname;
    // 如果loginname存在，则说明登录过，则直接调用next()交给下一管线去执行
    // 不存在，则去views文件夹查找login.html，如果找到则返回给客户端
    if (!loginname) {
        res.render('login.html', { title: '登录' });
    } else {
        next();
    }
} 

// 自定义模块中的方法，变量等必须导出，才可以在别的js文件中使用，不导出的方法，变量等都是此模块私有的，不能在外部使用。
module.exports = { checkLogin };

