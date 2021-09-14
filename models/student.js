var mongoose = require('mongoose');

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

module.exports = StudentModel;