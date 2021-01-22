$(function () {
    var layer = layui.layer
    var indexAdd = null
    initArtCateList()

    function initArtCateList() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                var str = template("tpl-table", res);
                $("tbody").html(str)
            }
        })
    }

    // 2.显示添加区域

    $("#btnAddCate").on("click", function () {
        // 利用框架代码，显示提示添加文章类别区域
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类'
            , content: $("#dialog-add").html()
        })
    })

    // 3.通过代理的形式，为form-add表单 绑定 submit 事件

    $("body").on("submit", '#form-add', function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        // 发送ajax请求
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                // 判断状态码
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 弹出提示，刷新列表，关闭弹窗
                layer.msg("新增分类成功")
                initArtCateList()
                layer.close(indexAdd)
            }
        })
    })

    // 4.显示修改form表单
    var indexEdit = null;
    var form = layui.form;
    $("tbody").on('click', '.btn-edit', function () {
        // 4.1 利用框架代码，显示提示添加文章类别区域
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类'
            , content: $("#dialog-edit").html()
        })

        // 4.2 获取Id，发送ajax获取数据，渲染到页面
        var id = $(this).attr('data-id')
        $.ajax({
            method: "GET",
            url: '/my/article/cates/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 赋值
                form.val('form-edit', res.data)
            }
        })
    })

    // 修改 提交
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                initArtCateList()
                layer.msg('恭喜您，文章类别更新成功！')
                layer.close(indexEdit)
            }
        })
    })


    // 5.删除
    $('tbody').on('click', '.btn-delete', function () {
        var Id = $(this).attr('data-id')
        layer.confirm("是否确认删除？", { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                url: '/my/article/deletecate/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    initArtCateList()
                    layer.msg('恭喜您，文章类别删除成功！')
                    layer.close(index)
                }
            })
        })
    })
})