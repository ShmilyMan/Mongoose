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
  key_word:String,
  title_count:Number
});
// 5.将schema编译成Model
var datahModel = mongoose.model('datasets', dataSchema);
var keyModel = mongoose.model('keywords', keywordsSchema);

const keys = [];  //存放所有的keywords
const noRepKeys = []; //存放互不相同的keywords
const infoData = [];

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

      //3.循环遍历找出每个keywords对应的记录数
      for (let i = 0; i < noRepKeys.length; i++) {  //keywords     --noRepeat
        let count = 0;
        for (let j = 0; j < docs.length; j++) { // document
          const keyWords = docs[j].keywords;
          for (let k = 0; k < keyWords.length; k++) { //document  -->    keywords
            if (noRepKeys[i] == keyWords[k]) {
              count++;
            }
          }
        }
        const key_word = noRepKeys[i];
        info = {
          key_word:key_word,
          title_count:count
        }
        // console.log(info);


        keyModel.create(info,function (err,doc) {
          if (!err) {
            console.log('插入成功');
          }
        });



      }
    }
});


