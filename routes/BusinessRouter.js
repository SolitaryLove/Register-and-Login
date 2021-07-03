// 引入Router
const {Router}=require('express');
// 创建路由器
const router=new Router();
// 引入模型对象
const usersModel=require('../model/usersModel');
// 引入sha1加密模块
const sha1=require('sha1');

// 业务路由
router.post('/register',(req,res)=>{
    console.log(req.body);
    /* {
        email: 'haha@qq.com',
        nick_name: 'solitary',
        password: '123',
        re_password: '123'
    } */
    // 1.获取用户输入
    const {email,nick_name,password,re_password}=req.body;
    /* 2.校验数据的合法性
        2.1校验成功-去数据库中查询该邮箱是否注册过
            2.1.1已注册，提示用户邮箱已被占用
            2.1.2未注册，写入数据库
        2.2校验失败-提示用户具体错误信息 */
    // 收集错误对象
    const errMsg={};
    // 校验邮箱的正则
    const emailReg=/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    // 校验昵称的正则
    const nickNameReg=/[\u4e00-\u9fa5]/gm;;
    // 检验密码的正则
    const passwordReg=/^[a-zA-Z0-9_@#.+&]{6,16}/;
    // 正则判断
    if(!emailReg.test(email)){
        errMsg.emailErr='邮箱格式不合法';
    }
    if(!nickNameReg.test(nick_name)){
        errMsg.nickErr='昵称格式不合法';
    }
    if(!passwordReg.test(password)){
        errMsg.passwordErr='密码格式不合法';
    }
    if(password!=re_password){
        errMsg.rePasswordErr='输入密码不一致';
    }
    // 错误信息判断
    if(JSON.stringify(errMsg)!=='{}'){
        res.render('register',{errMsg});
        return;
    }
    // 查询邮箱是否已注册
    usersModel.findOne({email},(err,data)=>{
        if(data){
            console.log(`邮箱为&{email}的用户注册失败,该邮箱已被占用`)
            errMsg.emailErr='该邮箱已注册';
            res.render('register',{errMsg});
            return;
        }
    });
    // 邮箱未注册则使用sha1加密并写入数据库
    usersModel.create({email,nick_name,password:sha1(password)},(err,data)=>{
        if(!err){
            console.log(`邮箱为${email}的用户注册成功`);
            res.redirect(`/login?email=&{email}`);// 重定向到登陆页面
        }else{
            console.log(err);
            errMsg.networkErr='网络状态不稳定,稍后重试';
            res.render('register',{errMsg});
        }
    });
});
router.post('/login',(req,res)=>{
    // 1.获取用户输入
    const {email,password}=req.body;
    // 2.校验数据的合法性
    // 收集错误的对象
    const errMsg={};
    // 校验邮箱的正则
    const emailReg=/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    // 校验密码的正则
    const passwordReg=/^[a-zA-Z0-9_@#.+&]{6,16}/;
    // 正则判断
    if(!emailReg.test(email)){
        errMsg.emailErr='邮箱格式不合法';
    }
    if(!passwordReg.test(password)){
        errMsg.passwordErr='密码格式不合法';
    }
    if(JSON.stringify(errMsg)!=='{}'){
        res.render('login',{errMsg});
        return;
    }
    // 3.查询是否有匹配用户
    usersModel.findOne({email,password:sha1(password)},(err,data)=>{
        if(err){
            console.log(err);
            errMsg.networkErr='网络不稳定,稍后重试';
            res.render('login',{errMsg});
            return;
        }
        if(data){
            /* 
            1)为请求开辟一个session会话存储空间
            2)将客户端与服务器沟通产生的数据存入session中
            3)获取session会话存储空间的唯一标识
            4)返回给客户端一个cookie，包含session的唯一标识 */
            req.session._id=data._id;
            res.redirect('http://localhost:3000/userCenter');
        }else{
            errMsg.loginErr='用户名或密码错误';
            res.render('login',{errMsg});
        }
    });
});

module.exports=()=>{
    return router;
}