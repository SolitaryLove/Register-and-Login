// 引入express框架
const express=require('express');
const app=express();
// 使用内置中间件暴露静态资源
app.use(express.static(__dirname+'/public'));
// 使用内置中间件解析post请求urlencoded参数
app.use(express.urlencoded({extended:true}));
// 引入UI路由
const UIRouter=require('./routes/UIRouter');
// 引入业务路由
const BusinessRouter=require('./routes/BusinessRouter');
// 配置模板引擎
app.set('view engine','ejs');
app.set('views','./views');
// 引入express-session模块，用于操作session
const session=require('express-session');
// 引入connect-mongo模块，用于实现session持久化
const mongoStore=require('connect-mongo');
// 配置session的中间件
app.use(session({
    name:'userID',// session会话存储空间的唯一标识,返回给客户端cookie的key
    secret:'atguigu',// 用于对sessionID的cookie进行签名
    saveUninitialized:false,// 是否在存储内容之前创建session会话
    resave:true,// 是否在每次请求时,强制重新保存session
    store:mongoStore.create({
        mongoUrl:'mongodb://localhost:27017/sessions_container',
        touchAfter:1*3600,// 修改频率
        dbName:'sessions_container'
    }),
    cookie:{
        httpOnly:true,// 前端是否可以通过JS操作cookie
        maxAge:1000*30// 设置cookie的过期时间
    }
}));

// 引入connectDB模块，用于连接数据库
const connectDB=require('./db/connectDB');

connectDB(()=>{
    // 使用UIRouter
    app.use(UIRouter());
    // 使用BusinessRouter
    app.use(BusinessRouter());
    // 端口监听
    app.listen(3000,(err)=>{
        if(!err) console.log('Server started successfully');
        else console.log('Server start failed');
    });
},(err)=>{
    console.log(err);
});