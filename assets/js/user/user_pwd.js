// 入口函数
$(function () {
    // 1.定义密码规则
    var form = layui.form;
    form.verify({
        // 1.1所有密码
        pwd: [
            /^[\S]{6,12}$/,
            "密码必须6~12位，切不能出现空格"
        ],
        // 1.2新密码
        samePwd: function (value) {
            // value是新密码 旧密码需要获取
            if (value === $("[name=oldPwd]").val()) {
                return "新密码和旧密码不能相同"
            }
        },
        // 1.3两次密码必须相同
        rePwd:function(value){
            // value是再次输入的新密码 新密码需要重新获取
            if(value!==$("[name=newPwd]").val()){
                return "两次新密码输入不一致"
            }
        },
    })

    // 2.修改密码
    $(".layui-form").on('submit',function(e){
        e.preventDefault();
        $.ajax({
            method:"POST",
            url:"/my/updatepwd",
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg("修改密码成功！");
                $(".layui-form")[0].reset()
            }
        })
    })
})