// 引入mongoDB ODM
const mongoose=require('mongoose');
// 引入模式对象
const Schema=mongoose.Schema;
// 创建约束对象
let usersRules=new Schema({
    email:{
        type:String,// 数据类型
        required:true,// 必填项
        unique:true// 唯一性
    },
    nick_name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now()// 默认项
    },
    enable_flag:{
        type:String,
        default:'Y'
    }
});

// 创建模型对象
module.exports=mongoose.model('users',usersRules);