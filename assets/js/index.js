// 入口函数
$(function(){
    // 获取用户信息
    getUserInfo();

    // 退出
    var layer = layui.layer
    $('#btnLogout').on('click',function(){
        // 框架提供的询问框
        layer.confirm('是否确认退出?',{icon:3,title:'提示'},function(index){
            // 清空本地token
            localStorage.removeItem('token');
            // 页面跳转
            location='/login.html';
            // 关闭询问框
            layer.close(index);
        })
    })
})
// 获取用户信息
function getUserInfo(){
    $.ajax({
        url:'/my/userinfo',
        // headers: {
        //     // 重新登陆 因为token过期事件12小时
        //     Authorization: localStorage.getItem('token') || ""
        // },
        success: function(res){
            // console.log(res);
            if(res.status !== 0){
                return layui.layer.msg(res.message);
            }
            renderAvatar(res.data);
        }
    })
}

function renderAvatar(user) {
    // 渲染名称(nickname优先 如果没有 就用username)
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 渲染头像
    if(user.user_pic !== null){
        // 有头像
        $('.layui-nav-img').attr('src',user.user_pic).show();
        $('.text-avatar').hide();
    }else{
        // 没有头像
        $('.layui-nav-img').hide();
        var text = name[0].toUpperCase();
        $('.text-avatar').show().html(text)
    }
}