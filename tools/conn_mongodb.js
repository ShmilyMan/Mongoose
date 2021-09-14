// 1.导入
var mongoose = require('mongoose');
// 2.连接数据库
var connect = mongoose.connect('mongodb://localhost/stutest',{ useMongoClient: true });
// 3.判断连接是否成功
mongoose.connection.once('open',function () {
    console.log('数据库连接成功...');
});