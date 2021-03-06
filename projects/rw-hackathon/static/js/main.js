// Some useful URL
var url_host = '//39.108.75.56/rw_api';
var url_group_base_info = url_host + '/group_base_info';
var url_group_info = url_host + '/group_info';
var url_check_registered = url_host + '/check_registered';
var url_register = url_host + '/register';
var url_login = url_host + '/login';
var url_logout = url_host + '/logout';
var url_detail = url_host + '/detail';
var url_groups_list = url_host + '/groups_list';
var url_send_email = url_host + '/send_email';
var url_vote = url_host + '/vote';
var url_get_votes = url_host + '/get_votes';

try {
    //注意：导航 依赖 element 模块，否则无法进行功能性操作
    layui.use('element', function() {
      var element = layui.element;
    });
}
catch (err) {
    console.log('no layui');
}


var header = new Vue({
    el: '#header',
    data: {
        logged: false,
        group_name: 'Undefined',
        url_logout: url_logout
    }
});
function logout() {
    $.ajax({url: url_logout, async: false, xhrFields: {withCredentials: true}});
    window.location.href = './';
}

$.ajax({
    url: url_group_base_info,
    xhrFields: {
        withCredentials: true
    },
    complete: function(xhr) {
        if (200 === xhr.status) {
            header.$data.logged = true;
            header.$data.group_name = xhr.responseText;
        }
    }
});
