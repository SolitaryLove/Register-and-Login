// 引入mongoDB ODM
const mongoose=require('mongoose');
mongoose.set('useCreateIndex',true);// 使用一个新的索引创建器

const DB_NAME='atguigu';// 数据库名
const PORT=27017;// 端口号
const IP='localhost';// 主机名

// 用于连接数据库并监测连接状态的方法
function connectMongo(success,failed){
    // 连接数据库
    mongoose.connect(`mongodb://${IP}:${PORT}/${DB_NAME}`,{
        useNewUrlParser:true,// 使用
        useUnifiedTopology:true// 使用一个统一的新的拓扑结构
    });
    // 监听数据库连接状态
    mongoose.connection.on('open',(err)=>{
        if(!err){
            console.log('Database connection successful');
            success();
        }else{
            console.log('Database connection failed');
            failed('Database connection failed');
        }
    });
}

module.exports=connectMongo;