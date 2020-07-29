if ($.fn.pagination){
	$.fn.pagination.defaults.beforePageText = '';
	$.fn.pagination.defaults.afterPageText = ' /  &nbsp;{pages}';
	$.fn.pagination.defaults.displayMsg = '{from} - {to} / {total}';
}
if ($.fn.datagrid){
	$.fn.datagrid.defaults.loadMsg = '処理中です。少々お待ちください...';
	$.fn.datagrid.defaults.prevText="前のページ";
	$.fn.datagrid.defaults.nextText="下一ページ";
}
if ($.fn.treegrid && $.fn.datagrid){
	$.fn.treegrid.defaults.loadMsg = $.fn.datagrid.defaults.loadMsg;
}
if ($.messager){
	$.messager.defaults.ok = '決定する';
	$.messager.defaults.cancel = 'キャンセル';
}
$.map(['validatebox','textbox','filebox','searchbox',
		'combo','combobox','combogrid','combotree',
		'datebox','datetimebox','numberbox',
		'spinner','numberspinner','timespinner','datetimespinner'], function(plugin){
	if ($.fn[plugin]){
		$.fn[plugin].defaults.missingMessage = '入力は必須です。';
	}
});
if ($.fn.validatebox){
	$.fn.validatebox.defaults.rules.email.message = '正しいメールアドレスを入力してください。';
	$.fn.validatebox.defaults.rules.url.message = '正しいURLを入力してください。';
	$.fn.validatebox.defaults.rules.length.message = '{0} から {1} の範囲の正しい値を入力してください。';
	$.fn.validatebox.defaults.rules.remote.message = 'このフィールドを修正してください。';
}
if ($.fn.calendar){
	$.fn.calendar.defaults.weeks = ['日','月','火','水','木','金','土'];
	$.fn.calendar.defaults.months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
}
if ($.fn.datebox){
	$.fn.datebox.defaults.currentText = '今日';
	$.fn.datebox.defaults.closeText = '閉じる';
	$.fn.datebox.defaults.okText = '決定する';
}
if ($.fn.datetimebox && $.fn.datebox){
	$.extend($.fn.datetimebox.defaults,{
		currentText: $.fn.datebox.defaults.currentText,
		closeText: $.fn.datebox.defaults.closeText,
		okText: $.fn.datebox.defaults.okText
	});
}
