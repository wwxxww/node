// 导入第三框架express，及一些常用模块，目的是使用框架或模块中提供的大量的api
const express = require('express');
const artTemplate = require('art-template');
const template = require('express-art-template');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const multer = require('multer');
// path模块是node.js自带的模块，不需要安装，主要用来控制项目目录，比如把两个目录路径合并，使用path.join(路径1，路径2)
const path = require('path');

// 给art-template视图模板（模板引擎）扩展格式化的方法（本质上是一种过滤器filter)
artTemplate.defaults.imports.dateFormat = function (date, format) {

    if (typeof date === "string") {
        var mts = date.match(/(\/Date\((\d+)\)\/)/);
        if (mts && mts.length >= 3) {
            date = parseInt(mts[2]);  
        }
    }
    date = new Date(date);
    if (!date || date.toUTCString() == "Invalid Date") {
        return "";
    }

    var map = {
        "M": date.getMonth() + 1, //月份
        "d": date.getDate(), //日
        "h": date.getHours(), //小时
        "m": date.getMinutes(), //分
        "s": date.getSeconds(), //秒
        "q": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };


    format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
        var v = map[t];
        if (v !== undefined) {
            if (all.length > 1) {
                v = '0' + v;
                v = v.substr(v.length - 2);
            }
            return v;
        }
        else if (t === 'y') {
            return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
    });
    return format;
};

// 通过调用express对象的构造函数，声明一个app实例，这样就可以访问express对象中的方法了。
const app = express();

// 设置解析.html文件的引擎为template，这样可以使用art-template模块提供的解析引擎，解析.html文档中的插值语法（即：{{变量}}）
app.engine('html', template);
// 设置视图文件所在目录，目的：客户端发起请求时，在匹配请求的接口中可以通过res.render()到设置的目录中去查找视图文件返回给客户端。
app.set('views', path.join(__dirname, 'views'));

// 设置cookieParser中间件，让每一个客户端发起的请求都经过此管线，当发现需要解析cookie时，会使用此管线中的解析器去处理。
app.use(cookieParser());
// 设置bodyParser中间件，让每一个客户端发起的请求都经过此管理，当发现需要解析body数据时，会使用此管线中的解析器去处理。
// 设置bodyParser解析器，可以解析json格式的数据
app.use(bodyParser.json());
// 设置bodyParser解析器，解析普通文本时使用url编码的方式，extended:false表示可解析少量特殊字符，extended:true表示可解析大量的特殊字符
// 一般设置成false就足够用了。
app.use(bodyParser.urlencoded({ extended: false }));

// 设置静态资源中间件。
// 使用express.static()方法设置当前项目的静态资源所在目录（一般会包括：样式，一些静态的html文档，脚本，音频，视频等）
// path.join()方法用来合并路径，__dirname常量指示当前项目所在的根目录，public自定义的目录
// 合并后最终会产生如下格式的路径：
// C:\Users\dong\Desktop\H5-31期\正课\第7周\第1天\上周作业\Node操作数组实现增删查改\node-arr\public
app.use(express.static(path.join(__dirname, 'public')));

// 导入路由模块（也是自定义的模块，要和modules文件中的自定义分开，routes文件中的路由模块和路由相关，modules文件夹的自定义模块是和路由不相关的其他模块，比如：验证用户是否登录模块check.js，数据模块data.js
// 不论导入的是node.js自带的模块（比如：path），还是自定义的模块，目的都是使用模块中封装的功能，即api
const indexRouter = require('./routes/index.js');
const userRouter = require('./routes/user.js');

// 使用路由中间件，当客户端发起请求时，会进行此管线，如果路由中有匹配到的接口路径，则返回，如果没有，则会继续向下一个路由中查找，直到找到返回
// 如果一直查找，最终也没有找到匹配的接口路径，则返回404。
// use()方法的第一个参数，可以给接口路径添加一个前缀，比如：/routes/user.js中有一个接口路径是/login，再加上前缀，最终会生成完整的路径/user/login
app.use('/', indexRouter);
app.use('/user', userRouter);

// 设置监听端口，启动服务
app.listen(5000, function () {
    console.log('服务器端启动，访问：http://localhost:5000');
})


