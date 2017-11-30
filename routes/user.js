const express = require('express');
const router = express.Router();

// 导入数据模块和验证是否登录模块，目的同index.js中的导入一样。
const data = require('../modules/data.js');
const check = require('../modules/check.js')

// 登录接口，使用的是post请求
router.post('/login', function (req, res) {
    // 获取客户端发起post请求传递过来的数据loginname,password,remember
    var loginname = req.body.loginname;
    var password = req.body.password;
    var remember = req.body.remember;

    // 分别验证loginname，password是否为空，当为空时返回错误信息
    if (!loginname) {
        res.json({ code: 201, message: '账号不能为空！' });
        return;
    }

    if (!password) {
        res.json({ code: 201, message: '密码不能为空！' });
        return;
    }

    // 验证账号是否存在，密码是否正确，不正确时，返回错误信息
    var index = data.users.findIndex(function (user) {
        return user.loginname == loginname;
    })

    if (index == -1) {
        res.json({ code: 201, message: '账号不存在！' });
        return;
    }

    index = data.users.findIndex(function (user) {
        return user.loginname == loginname && user.password == password;
    })

    if (index == -1) {
        res.json({ code: 201, message: '密码输入错误!' });
        return;
    }

    // 如果选中“记住我”则设置过期时间为1天，不选中时，不设置过期时间
    var options = remember
        ? { expires: new Date(Date.now() + (1000 * 60 * 60 * 24)) }
        : {};

    // 当以上验证都通过时，设置cookie并响应成功，注意此处的cookie名称loginname
    // 访问的时候要使用如下代码：req.cookies.loginname; 可参看modules/check.js中的相关代码，要对应好。
    res.cookie('loginname', loginname, options);
    res.json({ code: 200, message: '登录成功！' });
})

// 退出接口
router.get('/logout', function (req, res) {
    // 清空cookie
    res.clearCookie('loginname');
    // 跳转到登录页面
    res.render('login.html', { title: '登录' });
})

// 用户添加页面接口
router.get('/', check.checkLogin, function (req, res) {
    res.render('users/index.html', { title: '添加用户' })
})

// 保存用户数据接口
router.post('/post', check.checkLogin, function (req, res) {
    // 验证客户端发送的数据是否合法，不合法，则返回相应的错误信息
    var message = checkData(req, res);
    if (message != '') {
        res.json({ code: 201, message });
        return;
    }

    // 验证合法时，创建一个对象，并添加到数组data.users中。
    var user = {
        id: data.users.length + 1,
        loginname: req.body.loginname,
        password: req.body.password,
        name: req.body.name,
        sex: req.body.sex,
        age: parseInt(req.body.age),
        birthday: new Date(req.body.birthday)
    }
    data.users.push(user); 
    // 响应成功信息
    res.json({ code: 200, message: '保存成功！' });
})

// 删除接口
router.delete('/delete', check.checkLogin, function (req, res) {
    // 获取删除的数据所对应的主键id
    var id = req.body.id;
    if (!id) {
        res.json({ code: 201, message: 'id参数错误!' });
        return;
    }

    // 通过参数id查找数组中匹配此id的对象在数组中的索引位置
    var start = data.users.findIndex(function (user) {
        return user.id == parseInt(req.body.id);
    })

    // 如果索引没找到，则返回错误信息
    if (start == -1) {
        res.json({ code: 201, message: '删除的数据不存在!' });
        return;
    }
    // 查找到索引后，则从当前的索引处，删除一个数据
    data.users.splice(start, 1);
    // 响应成功
    res.json({ code: 200, message: '删除数据成功！' });
})

// 删除多条数据接口
router.delete('/deleteMore', check.checkLogin, function (req, res) {
    // 获取客户端传递过来的id列表，用逗号分割，格式：1,2,3,4
    // 如果数据不存在，则返回相应的错误信息
    var ids = req.body.ids;
    if (!ids) {
        res.json({ code: 201, message: '请选择要删除的数据!' });
        return;
    }
    // 把客户端传递过来的ids分割成数组，目的是循环每一个元素进行删除操作
    var idArr = ids.split(',');

    // 循环分割后的数组，进行逐个删除
    idArr.forEach(function (v, i) {
        var start = data.users.findIndex(function (user) {
            return user.id == parseInt(v);
        })
        data.users.splice(start, 1);
    })
    // 响应成功
    res.json({ code: 200, message: '删除数据成功！' });
})

// 编辑接口
// :id是一个URL参数，是一种“占位符”，客户端传递过来的数据会替换掉此位置
router.get('/edit/:id', function (req, res) {
    // 根据客户端传递的id参数，筛选出满足条件的数组，注意filter返回是数组，虽然此处返回的数组只有一个元素
    var users = data.users.filter(function (user) {
        return user.id == parseInt(req.params.id);
    })
    // 获取筛选过后数组中的唯一的一个对象
    var user = users[0];
    // 处理对象中的日期属性，显示合适的格式 “2017-01-01”
    var birthday = new Date(user.birthday);
    var year = birthday.getFullYear();
    var month = birthday.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    var day = birthday.getDate();
    day = day < 10 ? '0' + day : day;
    user.birthday = `${year}-${month}-${day}`;

    // 响应成功
    res.render('users/edit.html', { title: '编辑用户', user });
})

// 保存修改后的数据接口
router.put('/put', check.checkLogin, function (req, res) {
    // 验证客户端传递过来的数据是否合法，不合法，则返回错误信息
    var message = checkData(req, res);
    if (message != '') {
        res.json({ code: 201, message });
        return;
    }
    // 合法时，根据id属性查找修改的数据在data.users数组中的索引位置
    var start = data.users.findIndex(function (user) {
        return user.id == parseInt(req.body.id);
    })

    // 如果索引找不到，则返回错误信息
    if (start == -1) {
        res.json({ code: 201, message: '修改的数据不存在!' });
        return;
    }

    // 把索引位置的对象覆盖掉
    data.users[start] = {
        id: parseInt(req.body.id), 
        loginname: req.body.loginname,
        name: req.body.name,
        password: req.body.password,
        sex: req.body.sex == 'true' ? true : false,
        age: parseInt(req.body.age),
        birthday: new Date(req.body.birthday)
    }
    // 响应成功
    res.json({ code: 200, message: '修改数据成功！', users: data.users })
})

// 验证数据
function checkData(req, res) {
    var message = '';
    if (!req.body.loginname) {
        message = '帐号不能为空！';
        return message;
    }

    if (!req.body.password) {
        message = '密码不能为空！';
        return message;
    }

    if (!req.body.name) {
        message = '名称不能为空！';
        return message;
    }

    if (!req.body.sex) {
        message = '性别不能为空！';
        return message;
    }

    if (!req.body.age) {
        message = '年龄不能为空！';
        return message;
    }

    if (!req.body.birthday) {
        message = '出生日期不能为空！';
        return message;
    }

    if (isNaN(parseInt(req.body.age, 10))) {
        message = '年龄格式不正确！';
        return message;
    }

    if (isNaN(Date.parse(req.body.birthday))) {
        message = '出生日期格式不正确！';
        return message;
    }

    return message;
}

module.exports = router;