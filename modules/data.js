// 定义公共的数据，封装成模块的目的：此数据会在多个模块中使用（比如：routes/index.js,routes/user.js）
var users = [
    { id: 1, loginname: 'zs', password: '123456', name: '张三', sex: true, age: 18, birthday: new Date() },
    { id: 2, loginname: 'ls', password: '123456', name: '李四', sex: false, age: 18, birthday: new Date() },
    { id: 3, loginname: 'ww', password: '123456', name: '王五', sex: true, age: 18, birthday: new Date() },
    { id: 4, loginname: 'zl', password: '123456', name: '赵六', sex: false, age: 18, birthday: new Date() },
    { id: 5, loginname: 'sq', password: '123456', name: '孙七', sex: true, age: 18, birthday: new Date() },
    { id: 6, loginname: 'zb', password: '123456', name: '朱八', sex: false, age: 18, birthday: new Date() },
    { id: 7, loginname: 'wj', password: '123456', name: '吴九', sex: true, age: 18, birthday: new Date() }
]

// 把数据导出，目的是在外部使用。
module.exports = { users };