require('./tools/conn_mongodb')
var StudentModel = require('./models/student');

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