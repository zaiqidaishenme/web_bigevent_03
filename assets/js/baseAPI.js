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
    params.url = baseURL + params.url
})