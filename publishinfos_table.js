/*
*   publishinfo
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

var publishSchema = new mongoose.Schema({
  key:String,
  title:String,
  doi:String,
  publishingCountry:String,
  publishingOrganizationKey:String,
  publishingOrganizationTitle:String,
});
// 5.将schema编译成Model
var datahModel = mongoose.model('datasets', dataSchema);
var publishModel = mongoose.model('publishinfos', publishSchema);
datahModel.find({},'key title doi publishingOrganizationKey publishingOrganizationTitle publishingCountry -_id',function (err,docs) {
    if (!err) {
      // console.log(docs);
      for (let i = 0; i < docs.length;i++){
        const key = docs[i].key;
        const title = docs[i].title;
        const doi = docs[i].doi;
        const publishingCountry = docs[i].publishingCountry;
        const publishingOrganizationKey = docs[i].publishingOrganizationKey;
        const publishingOrganizationTitle = docs[i].publishingOrganizationTitle;
        const doc = {
                      key:key,
                      title:title,
                      doi:doi,
                      publishingCountry:publishingCountry,
                      publishingOrganizationKey:publishingOrganizationKey,
                      publishingOrganizationTitle:publishingOrganizationTitle
                    }
        // console.log(doc);
        publishModel.create(doc,function (error, doc) {
            if (!error){
              console.log(doc);
              console.log('数据插入成功');
              console.log('------------');
            } else {
              console.log('出错了....');
          }

        });
      }
    }
});
