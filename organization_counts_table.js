/*
*   organization_counts
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

var countOrganization = new mongoose.Schema({
  publishingCountry:String,
  organizationCount:Number
});

// 5.将schema编译成Model
var datahModel = mongoose.model('datasets', dataSchema);
var countModel = mongoose.model('organization_counts', countOrganization);

const data = [];      //存放所有的数据
const noRepeatData = [];    // 存放没有重复的title

datahModel.find({},'publishingCountry -_id',function (err , docs) {
  if(!err){
    //1.循环遍历，将所有title数据加入到一个数组中(所有的数据，其中包括重复的数据)
    for (let i = 0; i < docs.length; i++) {
      data.push(docs[i].publishingCountry);
    }

    //2.将没有重复的数据插入到noRepeatData中
    for(let i = 0; i < data.length; i++) {
      if (i == 0) {   //如果第一次的时候，先向noRepeatData中插入数据，保证他有数据
        noRepeatData.push(data[i]);
      }
      let isRepeat = false; //标志是否有重复的数据
      for (let j = 0; j < noRepeatData.length; j++) {
        if (noRepeatData[j] == data[i]) { //含有重复的数据
          isRepeat = true;
        }
      }
      // 如果含有重复的数据，则不向noRepeatData中插入数据，否则则向noRepeatData中插入数据
      if (!isRepeat) {
        noRepeatData.push(data[i]);
      }
    }
    // console.log(noRepeatData);
    //3.查询各个title的个数（记录数）
    for (let i = 0; i < noRepeatData.length; i++) {
      datahModel.find({publishingCountry:noRepeatData[i]},'key -_id',function (err , docs) {
        if(!err) {
          // console.log(docs.length);
          let insertObj = {};
          if (docs == null || docs == undefined || docs.length <= 0) {
            insertObj = {
              publishingCountry:noRepeatData[i],
              organizationCount:0
            }
          } else {
            insertObj = {
              publishingCountry:noRepeatData[i],
              organizationCount:docs.length
            }
          }

          if ( i % 100 == 0) {
            console.log('--------'+i+'----------');
          }

          // 插入数据
          countModel.create(insertObj,function (err, doc) {
            if (!err) {
              console.log('插入成功');
            }
          });
        } else {
          console.log('查找个数时出错啦...');
        }
      });
    }
  } else {
    console.log('出错啦...');
  }
});


