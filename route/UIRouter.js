// 引入Router模块
const {Router}=require('express');
// 创建路由器
const router=new Router();
// 引入path模块——Node中内置的一个专门用于解决路径问题的库
const path=require('path');
const usersModel = require('../model/usersModel');

// UI路由
router.get('/login',(req,res)=>{
    // let url=path.resolve(__dirname,'../public/login.html');
    // res.sendFile(url);
    const {email}=req.query;
    res.render('login',{errMsg:{email}});
});
router.get('/register',(req,res)=>{
    let url=path.resolve(__dirname,'../public/register.html');
    res.sendFile(url);
});
router.get('/userCenter',(req,res)=>{
    /* 
    1)获取客户端通过cookie携带过来的sessionID
    2)根据sessionID匹配session会话存储空间
    3)若匹配成功则拿到session会话存储空间里的数据
    4)若匹配失败则驳回,重定向到登录页面 */
    const {_id}=req.session;
    // 查询用户账户是否存在
    if(_id){
        usersModel.findOne({_id},(err,data)=>{
            if(!err&&data){
                // 个人中心
                res.render('userCenter',{nickName:data.nick_name});
            }else{
                // 重新登陆
                // 原因:(1)与数据库交互时产生了错误;(2)用户非法篡改了cookie
                res.redirect('http://localhost:3000/login');
            }
        });
    }else{
        // 原因:(1)用户cookie已过期;(2)用户清理了浏览器缓存;(3)用户没有登陆非法访问
        res.redirect('http://localhost:3000/login');
    }
});

module.exports=()=>{
    return router;
}