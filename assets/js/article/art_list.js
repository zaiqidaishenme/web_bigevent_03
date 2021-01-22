$(function(){
    // 为art-template 定义事件过滤器
    template.defaults.imports.dateFormat = function(dtStr){
        var dt = new Date(dtStr)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth()+1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y+'-'+m+'-'+d+' '+hh+':'+mm+':'+ss
    }
    // 在个位数的左侧填充
    function padZero(n){
        return n>9?n:'0'+n
    }
    
    // 定义查询参数对象 将来查询文章使用
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum  : 1,   //页码值
        pagesize : 2,   //每页显示多少条数据
        cate_id  : "",  //文章分类的 Id
        state    : ""   //文章的状态，可选值有：已发布、草稿
    };

    // 获取文章列表数据的方法
    var layer = layui.layer;
    initTable();
    // 封装渲染文章列表
    function initTable(){
        $.ajax({
            url:'/my/article/list',
            data:q,
            success:function(res){
                // console.log(res);
                if(res.status !== 0){
                    return layer.msg('获取文章列表失败！')
                }
                // 渲染
                var htmlStr = template('tpl-table',res);
                $('tbody').html(htmlStr)
                // 调用分页
                renderPage(res.total)
            }
        })
    }


    // 初始化分类
    var form = layui.form;
    initCate();
    function initCate(){
        $.ajax({
            url:'/my/article/cates',
            success:function(res){
                // 校验
                if(res.status !==0){
                    return layer.msg(res.message)
                }
                // 赋值  渲染form
                var htmlStr = template('tpl-cate',res);
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    // 筛选功能
    $('#form-search').on('submit',function(e){
        e.preventDefault()
        var state = $('[name=state]').val();
        var cate_id = $('[name=cate_id]').val()
        q.state = state;
        q.cate_id = cate_id;
        initTable()
    })


    // 分页
    var laypage = layui.laypage
    function renderPage(total){
        laypage.render({
            elem:'pageBox',  //分页容器的id
            count:total,     //总数据条数
            limit:q.pagesize,//每页显示几条数据
            curr:q.pagenum,  //设置默认被选中的分页

            // 分页模块设置 显示哪些子模块
            layout:['count','limit','prev','page','next','skip'],
            limits:[2,3,5,10], //每页吓死你多少条数据的选择器

            // 触发 jump 分页舒适化的时候 页码改变的时候
            jump:function(obj,first){
                // obj 所有参数所在的对象 first 是否是第一次初始化分页
                // 改变当前页
                q.pagenum = obj.curr;
                q.pagesize = obj.limit
                // 判断  不是第一次初始化分页  才能重新调用出书画文章列表
                if(!first){
                    // 初始化文章列表
                    initTable();
                }
            }
        })
    }

    // 删除
    var layer=layui.layer
    $('tbody').on('click',".btn-delete",function(){
        var Id = $(this).attr('data-id');
        layer.confirm('是否确认删除?', { icon:3,title:'提示'},function(index){
            $.ajax({
                method:'GET',
                url:'/my/article/delete/'+Id,
                success:function(res){
                    if(res.status !== 0){
                        return layer.msg(res.message)
                    }
                    layer.msg('恭喜您，文章删除成功！');
                    // 页面汇总删除按钮个数个数等于1 页码大于1
                    if($('.btn-delete').length ==1 && q.pagenum >1) q.pagenum--;
                    // 因为更新成功了 所以重新渲染页面的数据
                    initTable();
                }
            })
            layer.close(index)
        })
    })
})