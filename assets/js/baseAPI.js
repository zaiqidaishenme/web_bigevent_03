// 1.开发环境服务器地址
var baseURL = 'http://api-breakingnews-web.itheima.net'
// 2.测试环境。。。。。
// var baseURL = 'http://api-breakingnews-web.itheima.net'
// 3.生产环境。。。。。
// var baseURL = 'http://api-breakingnews-web.itheima.net'

// 拦截所有ajax请求 get/post/ajax;
// 处理参数
$.ajaxPrefilter(function(params){
    // 拼接对应环境的服务期地址
    params.url = baseURL + params.url;

    // 身份验证
    if(params.url.indexOf("/my/") !== -1){
        params.headers = {
            Authorization: localStorage.getItem('token') || ""
        }
    }

    // 拦截所有相应 判断身份认证信息
    params.complete = function(res){
        console.log(res.responseJSON);
        var obj = res.responseJSON;
        if(obj.status == 1 && obj.message == '身份认证失败！'){
             // 清空本地token
             localStorage.removeItem('token');
             // 页面跳转
             location='/login.html';
        }
    }
})