var groups_list = new Vue({
    el: '#groups_list',
    data: {
        groups: [],
        has_token: false
    }
});
function send_email() {
    var email_input = $('#input-email');
    var submit_btn = $('#submit-btn');
    submit_btn.html('等待<span class="icon-spinner icon-spin"></span>');
    if (!email_input.val()) {
        alert('邮箱不能为空！');
        submit_btn.html('发送');
        return 0;
    }

    $.ajax({
        url: url_send_email,
        xhrFields: {
            withCredentials: true
        },
        data: {
            'email': email_input.val()
        },
        type: 'POST',
        async: false,
        complete: function(xhr) {
            if (200 === xhr.status)
                alert('邮件已发送，请查收');
            else if (400 === xhr.status)
                alert('请填写邮箱');
            else if (404 === xhr.status)
                alert('邮件发送失败，请确认邮箱无误或稍后再试');
            else
                alert('未知错误，请稍后再试');
        }
    });
    email_input.val('');
    submit_btn.html('发送');
}
function vote(group_id) {
    if (!group_id) {
        alert('该队不存在');
        return 0;
    }
    if (!token) {
        alert('请使用投票链接投票');
        return 0;
    }
    $.ajax({
        url: url_vote,
        xhrFields: {
            withCredentials: true
        },
        data: {
            'token': token,
            'group_id': group_id
        },
        complete: function(xhr) {
            if (200 === xhr.status)
                location.reload();
            else if (404 === xhr.status)
                alert('该组不存在');
            else if (400 === xhr.status)
                alert('请求错误');
            else if (403 === xhr.status)
                alert('每个邮箱只能投3票，如有需要，您可以通过点击已投票的投票按钮取消先前的投票');
            else
                alert('未知错误，请稍后重试');
        }
    });
}
function get_url_param(key) {
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null)
        return unescape(r[2]);
    return null; //返回参数值
}


$.ajax({
    url: url_groups_list,
    xhrFields: {
        withCredentials: true
    },
    async: false,
    complete: function(xhr) {
        if (200 === xhr.status)
            groups_list.$data.groups = eval('(' + xhr.responseText + ')');
        else
            alert('加载参赛队伍信息错误，请稍后重试');
    }
});
var token = get_url_param('token');
var votes_list = [];
if (token) {
    groups_list.$data.has_token = true;
    $.ajax({
        url: url_get_votes,
        xhrFields: {
            withCredentials: true
        },
        data: {
            'token': token
        },
        complete: function(xhr) {
            if (200 === xhr.status) {
                votes_list = eval('(' + xhr.responseText + ')')[0];
                for (var vote in votes_list) {
                    $('#vote-btn-' + votes_list[vote])
                        .html('已投<i class="layui-icon">&#xe605;</i>')
                        .removeClass('layui-btn-normal');
                }

            }
            else if (404 === xhr.status)
                alert('投票链接非法！');
            else
                alert('未知错误，请稍后重试');
        }
    });
}
