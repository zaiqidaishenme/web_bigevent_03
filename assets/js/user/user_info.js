// 入口函数
$(function () {

    // 1.自定义验证规则
    var form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                console.log(1);
                return "昵称长度为1 ~ 6位之间!"
            }
        }
    })

    // 2.获取和渲染用户信息
    initUserInfo();
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                // console.log(res);
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
                // 成功后渲染
                form.val('formUserInfo',res.data)
            }
        })
    }

    // 重置表单数据  给form表单绑定reset事件 给重置按钮绑click事件
    // 注意 不要给 form绑click事件 不要给button绑reset事件
    $('#btnReset').on('click',function(e){
        e.preventDefault()
        initUserInfo()
    })

    // 监听表单的提交事件
    var layer = layui.layer
    $('.layui-form').on('submit',function(e){
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/userinfo',
            data:$(this).serialize(),
            success:function(res){
                // 判断
                if(res.status !== 0){
                    return layer.msg("用户信息修改失败！")
                }
                // 更新成功 渲染父页面信息
                layer.msg("恭喜您，用户信息修改成功")
                // window.parent获取的是iframe的父页面对应的window对象
                window.parent.getUserInfo();
            }
        })
    })
})