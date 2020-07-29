requirejs.config({
	paths: {
		'text': '../lib/require/text',
		'durandal': '../lib/durandal/js',
		'plugins': '../lib/durandal/js/plugins',
		'transitions': '../lib/durandal/js/transitions',
		'knockout': '../lib/knockout/knockout-3.4.0',
		'bootstrap': '../lib/bootstrap/js/bootstrap',
		'jquery': '../lib/jquery/jquery-1.9.1',
		"easyui": '../lib/jquery-easyui-1.4.2/jquery.easyui.min',
		"easyuimapping": '../lib/jquery-easyui-1.4.2-extend/EasyUIMapping',
		"easyuilang": "../lib/jquery-easyui-1.4.2/locale/easyui-lang-zh-cn",
		"easyuilang_zh-cn": "../lib/jquery-easyui-1.4.2/locale/easyui-lang-zh-cn",
		"easyuilang_en": "../lib/jquery-easyui-1.4.2/locale/easyui-lang-en",
		"easyuilang_ja": "../lib/jquery-easyui-1.4.2/locale/easyui-lang-ja",
		"easyuilang_zh-tw": "../lib/jquery-easyui-1.4.2/locale/easyui-lang-zh-tw",
		   //ko mapping js的库
        "komapping": "../lib/knockout/knockout.mapping-latest.debug"
	},
	shim: {
		'bootstrap': {
			deps: ['jquery'],
			exports: 'jQuery'
		},
		"easyui": {
			deps: ['jquery'],
			exports: 'jQuery'
		},
		"easyuimapping": {
			deps: ['easyui', "knockout"],
			exports: 'jQuery'
		}
	}
});

define(['durandal/system', 'durandal/app', 'durandal/viewLocator', 'bootstrap','easyuimapping'], function(system, app, viewLocator) {
	//>>excludeStart("build", true);
	system.debug(true);
	//>>excludeEnd("build");

	app.title = 'Durandal Samples';

	//specify which plugins to install and their configuration
	app.configurePlugins({
		router: true,
		dialog: true,
		widget: {
			kinds: ['expander']
		}
	});

	app.start().then(function() {
		viewLocator.useConvention();
		app.setRoot('shell');
	});
});