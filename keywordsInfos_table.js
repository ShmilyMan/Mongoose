/*
*   keywordsinfo
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

var keywordsSchema = new mongoose.Schema({
  keywords_id:Number,
  keywords:String,
  key_id:String,
  key:String,
  title:String,
});
// 5.将schema编译成Model
var datahModel = mongoose.model('datasets', dataSchema);
var keywordsModel = mongoose.model('keywordsinfos', keywordsSchema);

const keys = [];  //存放所有的keywords
const noRepKeys = []; //存放互不相同的keywords

datahModel.find({},'key title keywords -_id',function (err,docs) {
    if (!err) {
      // console.log(docs);
      // 1.读取查询出的所有数据
      for (let i = 0; i < docs.length;i++){
        const key = docs[i].key;
        const title = docs[i].title;
        const keywords = docs[i].keywords;
        // console.log(keywords);
        // 循环遍历取出所有的keywords
        for (let j = 0; j < keywords.length; j++) {
          keys.push(keywords[j]);
        }
      }
      // console.log(keys);
      //2.取出重复的keywords,并将它插入到另一个数组中
      for (let i = 0; i < keys.length; i++) {
        if (keys[i] != '' && keys[i] != null && keys[i] != undefined) { //空字符串不插入
          if (i == 0) {
            noRepKeys.push(keys[i]);
          }
          let isRep = false;  //判断该遍历的元素是否重复
          for (let j = 0; j < noRepKeys.length; j++) {
            if (noRepKeys[j] == keys[i]) {  //重复
              isRep = true;
            }
          }
          if (!isRep) { //不重复
            noRepKeys.push(keys[i]);
          }
        }
      }

      //3.循环遍历，分别对单条数据进行处理
      let key_id = 0;
      for (let i = 0; i < docs.length; i++) {
        //循环遍历每个数据中的keywords
        const keyWords = docs[i].keywords;
        for(let j = 0; j < keyWords.length; j++) {
          let keywords_id = 0;
          const key = docs[i].key;
          const title = docs[i].title;
          const keyWord = keyWords[j];
          //循环遍历没有重复的keywords的数组，数组下标号就是Keywords_id
          for (let k = 0; k < noRepKeys.length; k++)  {
            if (noRepKeys[k] == keyWords[j]) {  //找到了Keywords_id
              keywords_id = k;
              key_id++;
            }
          }
          //将数据插入到数据库
          keywordsObj = {
            key_id:key_id - 1,
            keywords_id:keywords_id,
            keywords:keyWord,
            key:key,
            title:title
          }
          keywordsModel.create(keywordsObj,function (err, doc) {
            if (!err) {
              console.log('数据保存成功');
            }
          });
        }
      }
    }
});
