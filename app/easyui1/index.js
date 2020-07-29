define(['durandal/app', 'durandal/system', 'knockout'], function (app, system, ko) {
    var name = ko.observable();
    var canSayHello = ko.computed(function () {
        return name() ? true : false;
    });

    return {
        displayName: 'What is your name?',
        name: name,
        canDeactivate:function(){
        	console.log("canDeactivate")
        	//能不能切换走，如果返回false,没法切换路由
        	return true;
        },
        canActivate:function(){
			console.log("canActivate")
			//能不能激活，如果返回false,当前生命周期不会往下走
        	return true;
        },
        deactivate:function(){
        	//切换前的逻辑控制，可以做些页面对象释放。
        	console.log("deactivate")
        },
        sayHello: function() {
            app.showMessage('Hello ' + name() + '!', 'Greetings');
        },
        canSayHello: canSayHello,
        activate: function() {
            system.log('Lifecycle : activate : hello');
        },
        binding: function () {
            system.log('Lifecycle : binding : hello');
            return { cacheViews:false }; //cancels view caching for this module, allowing the triggering of the detached callback
        },
        bindingComplete: function () {
            system.log('Lifecycle : bindingComplete : hello');
        },
        attached: function (view, parent) {
            system.log('Lifecycle : attached : hello');
        },
        compositionComplete: function (view) {
        	debugger;
            system.log('Lifecycle : compositionComplete : hello');
        },
        detached: function (view) {
            system.log('Lifecycle : detached : hello');
            	//切换后的逻辑控制
        }
    };
});