// 1.导入
var mongoose = require('mongoose');
// 2.连接数据库
var connect = mongoose.connect('mongodb://localhost/stutest',{ useMongoClient: true });
// 3.判断连接是否成功
mongoose.connection.once('open',function () {
    console.log('数据库连接成功...');
});
// 4.创建约束模式
var stuSchema = new mongoose.Schema({
    name:String,
    age: Number,
    gender:{
        type:String,
        default:'female'
    },
    address:String
});
// 5.将schema编译成Model
var StudentModel = mongoose.model('students', stuSchema);
// 6.向数据库中插入数据
StudentModel.create({

    name:'孙悟空',
    age: 25,
    gender:'male',
    address:'花果山'

},function (err) {
    if (!err) {
        console.log('数据插入成功...');
    }
});
