/*
*   keywordscounts
*/

// 1.导入
var mongoose = require('mongoose');
// 2.连接数据库
var connect = mongoose.connect('mongodb://localhost/data',{ useMongoClient: true });
// 3.判断连接是否成功
mongoose.connection.once('open',function () {
  console.log('数据库连接成功...');
});
// 4.创建约束模式
var dataSchema = new mongoose.Schema({
  key:String,
  title:String,
  doi:String,
  description:String,
  type:String,
  hostingOrganizationKey:String,
  hostingOrganizationTitle:String,
  publishingCountry:String,
  publishingOrganizationKey:String,
  publishingOrganizationTitle:String,
  license:String,
  decades:Array,
  keywords:Array,
  recordCount:Number
});

var countKeyWords = new mongoose.Schema({
  key:String,
  title:String,
  keywords_count:Number
});

// 5.将schema编译成Model
var datahModel = mongoose.model('datasets', dataSchema);
var countModel = mongoose.model('keywords_count', countKeyWords);

datahModel.find({},'key title keywords -_id',function (err , docs) {
  if (!err) {
    //分别遍历每一记录
    for (let i = 0; i < docs.length; i++) {
      const key = docs[i].key;
      const title = docs[i].title;
      const keywords_count = docs[i].keywords.length;

      // 向数据库中插入数据
      info = {
        key:key,
        title:title,
        keywords_count:keywords_count
      }
      countModel.create(info,function (err,obj) {
        if (!err) {
          console.log('插入成功');
        } else {
          console.log('插入数据出错啦...');
        }
      });
    }
  } else {
    console.log('查询datasets出错啦...');
  }
});


