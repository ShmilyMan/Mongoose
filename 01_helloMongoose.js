// 导入
var mongoose = require('mongoose');
// 连接MongoDB
mongoose.connect('mongodb://localhost/mongoosetest',{useMongoClient:true});

// 判断连接是否成功
mongoose.connection.once('open',function () {
    console.log('数据库连接成功');
});

// 判断数据库连接是否断开
mongoose.connection.once('close',function () {
    console.log('数据库已经断开');
});

// 断开数据库连接：一般不用，MongoDB是非事务型的数据库，连接了以后一般不用断开
mongoose.disconnect()