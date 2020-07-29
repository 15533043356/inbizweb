(function(){
    if ($.fn.pagination) {
        //$.fn.pagination.defaults.beforePageText = '第';
        //$.fn.pagination.defaults.afterPageText = '共{pages}页';
        //$.fn.pagination.defaults.displayMsg = '显示{from}到{to},共{total}记录';
        //V5的设计图分页样式
        $.fn.pagination.defaults.beforePageText = '到第';
        //$.fn.pagination.defaults.afterPageText = ' /  &nbsp;{pages}';
        $.fn.pagination.defaults.afterPageText = '页';
        //$.fn.pagination.defaults.displayMsg = '{from} - {to} / {total}';
        $.fn.datagrid.defaults.listText = " /页 ";
        $.fn.pagination.defaults.displayMsg = '共 {total} 条';
        $.fn.datagrid.defaults.prevText = "上一页";
        $.fn.datagrid.defaults.nextText = "下一页";
        $.fn.datagrid.defaults.firstText = "首页";
        $.fn.datagrid.defaults.lastText = "尾页";
    }
    if ($.fn.datagrid) {
        $.fn.datagrid.defaults.loadMsg = '正在处理，请稍待。。。';
        $.fn.datagrid.defaults.prevText = "上一页";
        $.fn.datagrid.defaults.nextText = "下一页";
        $.fn.datagrid.defaults.firstText = "首页";
        $.fn.datagrid.defaults.lastText = "尾页";
		$.fn.datagrid.defaults.noData="暂无数据";
    }
    if ($.fn.treegrid && $.fn.datagrid) {
        $.fn.treegrid.defaults.loadMsg = $.fn.datagrid.defaults.loadMsg;
    }
    if ($.messager) {
        $.messager.defaults.ok = '确定';
        $.messager.defaults.cancel = '取消';
    }
    $.map(['validatebox', 'textbox', 'filebox', 'searchbox',
        'combo', 'combobox', 'combogrid', 'combotree',
        'datebox', 'datetimebox', 'numberbox',
        'spinner', 'numberspinner', 'timespinner', 'datetimespinner'], function (plugin) {
            if ($.fn[plugin]) {
                $.fn[plugin].defaults.missingMessage = '该输入项为必输项';
            }
        });
    if ($.fn.validatebox) {
        $.fn.validatebox.defaults.rules.email.message = '请输入有效的电子邮件地址';
        $.fn.validatebox.defaults.rules.url.message = '请输入有效的URL地址';
        $.fn.validatebox.defaults.rules.length.message = '输入内容长度必须介于{0}和{1}之间';
        $.fn.validatebox.defaults.rules.remote.message = '请修正该字段';
    }
    if ($.fn.calendar) {
        $.fn.calendar.defaults.weeks = ['日', '一', '二', '三', '四', '五', '六'];
        $.fn.calendar.defaults.months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    }
    if ($.fn.datebox) {
        $.fn.datebox.defaults.currentText = '今天';
        $.fn.datebox.defaults.closeText = '关闭';
        $.fn.datebox.defaults.okText = '确定';
        $.fn.datebox.defaults.formatter = function (date) {
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            var d = date.getDate();
            return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
        };
        $.fn.datebox.defaults.parser = function (s) {
            if (!s) return new Date();
            var ss = s.split('-');
            var y = parseInt(ss[0], 10);
            var m = parseInt(ss[1], 10);
            var d = parseInt(ss[2], 10);
            if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
                return new Date(y, m - 1, d);
            } else {
                return new Date();
            }
        };
    }
    if ($.fn.datetimebox && $.fn.datebox) {
        $.extend($.fn.datetimebox.defaults, {
            currentText: $.fn.datebox.defaults.currentText,
            closeText: $.fn.datebox.defaults.closeText,
            okText: $.fn.datebox.defaults.okText
        });
    }
    if ($.fn.datetimespinner) {
        $.fn.datetimespinner.defaults.selections = [[0, 4], [5, 7], [8, 10], [11, 13], [14, 16], [17, 19]]
    }

prevPage = '上一页';
nextPage = '下一页';
if(window.document.cookie.indexOf("lang=en")>-1){
    if ($.fn.pagination) {
        //V5的设计图分页样式
        $.fn.pagination.defaults.beforePageText = 'go to';
        $.fn.pagination.defaults.afterPageText = 'page';
        $.fn.datagrid.defaults.listText = " /page ";
        $.fn.pagination.defaults.displayMsg = 'total {total} limits';
        $.fn.datagrid.defaults.prevText = "prev";
        $.fn.datagrid.defaults.nextText = "next";
        $.fn.datagrid.defaults.firstText = "start";
        $.fn.datagrid.defaults.lastText = "end";
    }
    if ($.fn.datagrid) {
        $.fn.datagrid.defaults.loadMsg = 'Processing, please wait ...';
        $.fn.datagrid.defaults.prevText = "prev";
        $.fn.datagrid.defaults.nextText = "next";
        $.fn.datagrid.defaults.firstText = "first";
        $.fn.datagrid.defaults.lastText = "last";
        $.fn.datagrid.defaults.noData = "No data";
    }
    if ($.fn.treegrid && $.fn.datagrid) {
        $.fn.treegrid.defaults.loadMsg = $.fn.datagrid.defaults.loadMsg;
    }
    if ($.messager) {
        $.messager.defaults.ok = 'Ok';
        $.messager.defaults.cancel = 'Cancel';
    }
    $.map(['validatebox', 'textbox', 'filebox', 'searchbox',
        'combo', 'combobox', 'combogrid', 'combotree',
        'datebox', 'datetimebox', 'numberbox',
        'spinner', 'numberspinner', 'timespinner', 'datetimespinner'], function (plugin) {
            if ($.fn[plugin]) {
                $.fn[plugin].defaults.missingMessage = 'This field is required.';
            }
        });
    if ($.fn.validatebox) {
        $.fn.validatebox.defaults.rules.email.message = 'Please enter a valid email address.';
        $.fn.validatebox.defaults.rules.url.message = 'Please enter a valid URL.';
        $.fn.validatebox.defaults.rules.length.message = 'Please enter a value between {0} and {1}.';
        $.fn.validatebox.defaults.rules.remote.message = 'Please fix this field.';
    }
    if ($.fn.calendar) {
        $.fn.calendar.defaults.weeks = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        $.fn.calendar.defaults.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }
    if ($.fn.datebox) {
        $.fn.datebox.defaults.currentText = 'Today';
        $.fn.datebox.defaults.closeText = 'Close';
        $.fn.datebox.defaults.okText = 'Ok';
        $.fn.datebox.defaults.formatter = function (date) {
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            var d = date.getDate();
            return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
        };
        $.fn.datebox.defaults.parser = function (s) {
            if (!s) return new Date();
            var ss = s.split('-');
            var y = parseInt(ss[0], 10);
            var m = parseInt(ss[1], 10);
            var d = parseInt(ss[2], 10);
            if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
                return new Date(y, m - 1, d);
            } else {
                return new Date();
            }
        };
    }
    if ($.fn.datetimebox && $.fn.datebox) {
        $.extend($.fn.datetimebox.defaults, {
            currentText: $.fn.datebox.defaults.currentText,
            closeText: $.fn.datebox.defaults.closeText,
            okText: $.fn.datebox.defaults.okText
        });
    }
    if ($.fn.datetimespinner) {
        $.fn.datetimespinner.defaults.selections = [[0, 4], [5, 7], [8, 10], [11, 13], [14, 16], [17, 19]]
    }
}
else if(window.document.cookie.indexOf("lang=ja")>-1){
    if ($.fn.pagination) {
        //V5的设计图分页样式
        $.fn.pagination.defaults.beforePageText = '第まで';
        $.fn.pagination.defaults.afterPageText = 'ページ';
        $.fn.datagrid.defaults.listText = " /ページ ";
        $.fn.pagination.defaults.displayMsg = '共に {total} 本である';
        $.fn.datagrid.defaults.prevText = "前のページ";
        $.fn.datagrid.defaults.nextText = "下一ページ";
        $.fn.datagrid.defaults.firstText = "トップページ";
        $.fn.datagrid.defaults.lastText = "尾页";
    }
    if ($.fn.datagrid) {
        $.fn.datagrid.defaults.loadMsg = '処理中です。少々お待ちください...';
        $.fn.datagrid.defaults.prevText = "前のページ";
        $.fn.datagrid.defaults.nextText = "下一ページ";
        $.fn.datagrid.defaults.firstText = "トップページ";
        $.fn.datagrid.defaults.lastText = "尾页";
        $.fn.datagrid.defaults.noData = "一時データ";
    }
    if ($.fn.treegrid && $.fn.datagrid) {
        $.fn.treegrid.defaults.loadMsg = $.fn.datagrid.defaults.loadMsg;
    }
    if ($.messager) {
        $.messager.defaults.ok = 'OK';
        $.messager.defaults.cancel = 'キャンセル';
    }
    $.map(['validatebox', 'textbox', 'filebox', 'searchbox',
        'combo', 'combobox', 'combogrid', 'combotree',
        'datebox', 'datetimebox', 'numberbox',
        'spinner', 'numberspinner', 'timespinner', 'datetimespinner'], function (plugin) {
            if ($.fn[plugin]) {
                $.fn[plugin].defaults.missingMessage = '入力は必須です。';
            }
        });
    if ($.fn.validatebox) {
        $.fn.validatebox.defaults.rules.email.message = '正しいメールアドレスを入力してください。';
        $.fn.validatebox.defaults.rules.url.message = '正しいURLを入力してください。';
        $.fn.validatebox.defaults.rules.length.message = '{0} から {1} の範囲の正しい値を入力してください。';
        $.fn.validatebox.defaults.rules.remote.message = 'このフィールドを修正してください。';
    }
    if ($.fn.calendar) {
        $.fn.calendar.defaults.weeks = ['日', '月', '火', '水', '木', '金', '土'];
        $.fn.calendar.defaults.months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    }
    if ($.fn.datebox) {
        $.fn.datebox.defaults.currentText = '今日';
        $.fn.datebox.defaults.closeText = '閉じる';
        $.fn.datebox.defaults.okText = 'OK';
        $.fn.datebox.defaults.formatter = function (date) {
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            var d = date.getDate();
            return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
        };
        $.fn.datebox.defaults.parser = function (s) {
            if (!s) return new Date();
            var ss = s.split('-');
            var y = parseInt(ss[0], 10);
            var m = parseInt(ss[1], 10);
            var d = parseInt(ss[2], 10);
            if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
                return new Date(y, m - 1, d);
            } else {
                return new Date();
            }
        };
    }
    if ($.fn.datetimebox && $.fn.datebox) {
        $.extend($.fn.datetimebox.defaults, {
            currentText: $.fn.datebox.defaults.currentText,
            closeText: $.fn.datebox.defaults.closeText,
            okText: $.fn.datebox.defaults.okText
        });
    }
    if ($.fn.datetimespinner) {
        $.fn.datetimespinner.defaults.selections = [[0, 4], [5, 7], [8, 10], [11, 13], [14, 16], [17, 19]]
    }
    
}
else if(window.document.cookie.indexOf("lang=zh-tw")>-1){
    if ($.fn.pagination) {
        //V5的设计图分页样式
        $.fn.pagination.defaults.beforePageText = '到第';
        $.fn.pagination.defaults.afterPageText = '頁';
        $.fn.datagrid.defaults.listText = " /頁 ";
        $.fn.pagination.defaults.displayMsg = '共 {total} 條';
        $.fn.datagrid.defaults.prevText = "上一頁";
        $.fn.datagrid.defaults.nextText = "下一頁";
        $.fn.datagrid.defaults.firstText = "首頁";
        $.fn.datagrid.defaults.lastText = "尾頁";
    }
    if ($.fn.datagrid) {
        $.fn.datagrid.defaults.loadMsg = '正在處理，請稍待。。。';
        $.fn.datagrid.defaults.prevText = "上一頁";
        $.fn.datagrid.defaults.nextText = "下一頁";
        $.fn.datagrid.defaults.firstText = "首頁";
        $.fn.datagrid.defaults.lastText = "尾頁";
        $.fn.datagrid.defaults.noData = "暫無數據";
    }
    if ($.fn.treegrid && $.fn.datagrid) {
        $.fn.treegrid.defaults.loadMsg = $.fn.datagrid.defaults.loadMsg;
    }
    if ($.messager) {
        $.messager.defaults.ok = '確定';
        $.messager.defaults.cancel = '取消';
    }
    $.map(['validatebox', 'textbox', 'filebox', 'searchbox',
        'combo', 'combobox', 'combogrid', 'combotree',
        'datebox', 'datetimebox', 'numberbox',
        'spinner', 'numberspinner', 'timespinner', 'datetimespinner'], function (plugin) {
            if ($.fn[plugin]) {
                $.fn[plugin].defaults.missingMessage = '該輸入項爲必輸項';
            }
        });
    if ($.fn.validatebox) {
        $.fn.validatebox.defaults.rules.email.message = '請輸入有效的電子郵件地址';
        $.fn.validatebox.defaults.rules.url.message = '請輸入有效的URL地址';
        $.fn.validatebox.defaults.rules.length.message = '輸入內容長度必須介於{0}和{1}之間';
        $.fn.validatebox.defaults.rules.remote.message = '請修正該字段';
    }
    if ($.fn.calendar) {
        $.fn.calendar.defaults.weeks = ['日', '一', '二', '三', '四', '五', '六'];
        $.fn.calendar.defaults.months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    }
    if ($.fn.datebox) {
        $.fn.datebox.defaults.currentText = '今天';
        $.fn.datebox.defaults.closeText = '關閉';
        $.fn.datebox.defaults.okText = '確定';
        $.fn.datebox.defaults.formatter = function (date) {
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            var d = date.getDate();
            return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
        };
        $.fn.datebox.defaults.parser = function (s) {
            if (!s) return new Date();
            var ss = s.split('-');
            var y = parseInt(ss[0], 10);
            var m = parseInt(ss[1], 10);
            var d = parseInt(ss[2], 10);
            if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
                return new Date(y, m - 1, d);
            } else {
                return new Date();
            }
        };
    }
    if ($.fn.datetimebox && $.fn.datebox) {
        $.extend($.fn.datetimebox.defaults, {
            currentText: $.fn.datebox.defaults.currentText,
            closeText: $.fn.datebox.defaults.closeText,
            okText: $.fn.datebox.defaults.okText
        });
    }
    if ($.fn.datetimespinner) {
        $.fn.datetimespinner.defaults.selections = [[0, 4], [5, 7], [8, 10], [11, 13], [14, 16], [17, 19]]
    }


}	
})();
