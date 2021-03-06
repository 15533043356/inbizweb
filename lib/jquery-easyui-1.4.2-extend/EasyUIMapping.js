/*
 * easyui与knockout的映射绑定
 * author:whimco
 */
define(['knockout', "jquery", "easyui", "komapping"], function (ko, $, easyui, komapping) {

    var easyuiMapping = {
        _uniqueName: 0,       //起始值
        caching: {},          //缓存对象	
        plugins: {},          //插件
        //获取缓存的控件的唯一标识	
        getUniqueName: function () {
            this._uniqueName++;
            return '' + this._uniqueName;
        },
        //缓存组件	
        cacheComponent: function (element, control) {
            var cacheKey = 'cmp-' + this.getUniqueName();
            if (element) {
                element.setAttribute('data-unique-name', cacheKey);
                this.caching[cacheKey] = control;
            }
        },
        //获取缓存的组件  
        getCachedComponent: function (element) {
            return this.caching[element.attributes['data-unique-name'].value];
        },
        //实例化组件
        createComponent: function (element, valueAccessor, allBindings, viewModel, bindingContext, controlType) {
            var component = new ControlBase(element, valueAccessor, allBindings, viewModel, bindingContext, controlType);

            this.cacheComponent(element, component);
            return component;
        }
    };

    var ControlBase = function (element, valueAccessor, allBindings, viewModel, bindingContext, controlType) {
        this.element = element;
        this.valueAccessor = valueAccessor();
        this.allBindings = allBindings;
        this.viewModel = viewModel;
        this.bindingContext = bindingContext;
        this.controlType = controlType;

        this.options = {};

        this.getOptions = function () {
            this.options = $(this.element).attr("data-options");
            if (this.options == undefined) {
                this.options = {};
                return;
            }

            this.options = eval("[{" + this.options + "}]")[0];
        };

        //扩展options和allBindings
        this.extendOptions = function () {
            var self = this;
            var allBindings = this.allBindings();
            this.options["novalidate"] = true;
            for (property in allBindings) {
                //如果data-bind中的属性在$.fn.xxx.defaults中存在，则视为有效的属性。
                if ($.fn[this.controlType].defaults.hasOwnProperty(property)) {
                  
                    //如果属性是ko的可观察对象，则取出其值，赋给options
                    if (ko.isObservable(allBindings[property])) {
                        this.options[property] = allBindings[property]();

                        //如果是基本类型，则直接赋值
                    } else if (typeof (allBindings[property]) == "string"
                           || typeof (allBindings[property]) == "boolean"
                           || typeof (allBindings[property]) == "number"
                           || typeof (allBindings[property]) == "object"
                           || typeof (allBindings[property]) == "array") {
                        this.options[property] = allBindings[property];

                        //如果是方法，则使用闭包切换this对象，并赋值
                    } else if (typeof (allBindings[property]) == "function") {
                        var fun = (function (property) {
                            
                            //return function (arguments) {
                            return function () {
                                //allBindings[property].call(self.viewModel, arguments);
                                return allBindings[property].apply(self.viewModel, arguments);
                            };
                        })(property);

                        this.options[property] = fun;
                    }
                }
            }

            if (this.controlType !=="linkbutton") {
                if (!this.options["width"]) this.options["width"] = "100%";
            }
            if (/datetimebox|datebox/.test(this.controlType)) {
                this.options["panelWidth"] = "188";
                this.options["panelHeight"] = "238";
            }

            if (/^combo|box$|spinner$/.test(this.controlType)) {
                if (this.options["multiline"] != true) {
                    this.options["height"] = "30px";
                }
            }
            if (this.controlType == "dialog" && window.location.pathname.match(/component.html/)) {
                this.options["noheader"] = true;
                this.options["modal"] = false;
                
                if ($(this.element).hasClass("vdrivenoclose")) {
                    this.options["noheader"] = false;
                    this.options["modal"] = true;
                } 
                //this.onOldClose = this.onClose;
                //this.onClose = function () {
                //    this.onOldClose && this.onOldClose();
                //    window.parent.onComponentWindowClose && window.parent.onComponentWindowClose();
                //};
                //this.onOldOpen = this.onOpen;
                //this.onOpen = function () {
                //    this.onOldOpen && this.onOldOpen();
                //    window.parent.onComponentWindowOpen && window.parent.onComponentWindowOpen();
                //};
            }
        };

        this.activeObservable = function () {
            var self = this;
            var allBindings = this.allBindings();
            for (property in allBindings) {
                //如果data-bind中的属性在$.fn.xxx.defaults中存在，则视为有效的属性。
                if ($.fn[this.controlType].defaults.hasOwnProperty(property)) {
                    //如果属性是ko的可观察对象，则取出其值，赋给options
                    if (ko.isObservable(allBindings[property])) {
                        this.options[property] = allBindings[property]();
                    }
                }

                //如果是事件，则触发一下ko的通知。
                if (this.checkInMethods(this.controlType, property)) {
                    if (ko.isObservable(allBindings[property])) {
                        allBindings[property]();
                    }
                }
            }
        };

        //绑定通用默认事件
        this.bindDefaultEvents = function () {
            var self = this;
            var fun = null;

            //保存外部设置的事件回调
            if (this.options["onChange"]) {
                fun = this.options["onChange"];
            }

            if (self.valueAccessor && fun) {
                this.options["onChange"] = function (newValue) {
                    self.valueAccessor(newValue);
                    fun(newValue);
                };
            } else if (self.valueAccessor) {
                this.options["onChange"] = function (newValue) {
                    self.valueAccessor(newValue);
                    var tempValue = self.valueAccessor();
                };
            } else if (fun) {
                this.options["onChange"] = function (newValue) {
                    fun(newValue);
                };
            }

            if (this.controlType == "dialog" || this.controlType == "window") {
                !this.options["onClose"] && (this.options["onClose"] = function () {
                    
                    if (window.location.pathname.match(/component.html/)) {
                        if ($(this).hasClass("vdrivenoclose")) {

                            if (self.controlType == "dialog") {
                                $(this).dialog("destroy", true);
                            }
                            else if (self.controlType == "window") {
                                //$(this).window("destroy", true);
                            }

                            //TODO: 
                        } else {
                            window.parent.onComponentWindowClose && window.parent.onComponentWindowClose();
                        }
                    }
                    else {
                        $(self.element)[self.controlType]("destroy");
                        var closed = self.allBindings()["closed"];
                        if (typeof (closed) == "function") {
                            closed(null);
                        }
                    }
                });
            }
        };

        //绑定用户扩展的事件
        this.bindPluginInit = function () {
            if (easyuiMapping.plugins[this.controlType] != undefined) {
                easyuiMapping.plugins[this.controlType].init.call(this);
            }
        };

        //绑定用户更新的事件
        this.bindPluginUpdate = function () {
            if (easyuiMapping.plugins[this.controlType] != undefined) {
                easyuiMapping.plugins[this.controlType].update.call(this);
            }
        };
        this.depends = {
            pagination: { dependencies: ['linkbutton'] },
            datagrid: { dependencies: ['panel', 'resizable', 'linkbutton', 'pagination'] },
            treegrid: { dependencies: ['datagrid'] },
            propertygrid: { dependencies: ['datagrid'] },
            datalist: { dependencies: ['datagrid'] },
            window: { dependencies: ['resizable', 'draggable', 'panel'] },
            dialog: { dependencies: ['linkbutton', 'window'] },
            messager: { dependencies: ['linkbutton', 'window', 'progressbar'] },
            layout: { dependencies: ['resizable', 'panel'] },
            tabs: { dependencies: ['panel', 'linkbutton'] },
            menubutton: { dependencies: ['linkbutton', 'menu'] },
            splitbutton: { dependencies: ['menubutton'] },
            accordion: { dependencies: ['panel'] },
            textbox: { dependencies: ['validatebox', 'linkbutton'] },
            filebox: { dependencies: ['textbox'] },
            combo: { dependencies: ['panel', 'textbox'] },
            combobox: { dependencies: ['combo'] },
            combotree: { dependencies: ['combo', 'tree'] },
            combogrid: { dependencies: ['combo', 'datagrid'] },
            validatebox: { dependencies: ['tooltip'] },
            numberbox: { dependencies: ['textbox'] },
            searchbox: { dependencies: ['menubutton', 'textbox'] },
            spinner: { dependencies: ['textbox'] },
            numberspinner: { dependencies: ['spinner', 'numberbox'] },
            timespinner: { dependencies: ['spinner'] },
            tree: { dependencies: ['draggable', 'droppable'] },
            datebox: { dependencies: ['calendar', 'combo'] },
            datetimebox: { dependencies: ['datebox', 'timespinner'] },
            slider: { dependencies: ['draggable'] }
        };

        //检查是否依赖项中存在该方法
        this.checkInMethods = function (controlType, methodName) {

            if (controlType == methodName) return false;

            if ($.fn[controlType].methods.hasOwnProperty(property)) {
                return true;
            }

            if (this.depends.hasOwnProperty(controlType)) {
                var methods = this.depends[controlType].dependencies;
                for (var i = 0; i < methods.length; i++) {
                    if (this.checkInMethods(methods[i], methodName)) {
                        return true;
                    }
                }
            }

            return false;
        };
        //如果是方法则返回
        this.getMethods = function () {
            var methods = [];
            var self = this;
            var allBindings = this.allBindings();
            for (property in allBindings) {
                //如果data-bind中的属性在$.fn.xxx.defaults中存在，则视为有效的属性。
                if (this.checkInMethods(this.controlType, property)) {
                    //如果属性是ko的可观察对象，则取出其值，赋给options
                    if (ko.isObservable(allBindings[property])) {
                        methods.push({ method: property, param: allBindings[property]() });
                    } else {
                        methods.push({ method: property, param: allBindings[property] });
                    }
                }
            }

            return methods;
        };
        //执行方法
        this.execMethods = function () {
            var methods = this.getMethods();
            for (var i = 0; i < methods.length; i++) {
                if (methods[i].param) {
                    $(this.element)[this.controlType](methods[i].method, methods[i].param);
                }
            }
        };

        this.init = function () {
            this.getOptions();
            this.extendOptions();
            this.bindDefaultEvents();
            this.bindPluginInit();

            $(this.element)[this.controlType](this.options);
        };

        this.update = function () {
            //更新可观察对象的值
            this.activeObservable();

            //刷新控件
            this.getOptions();
            this.extendOptions();
            this.bindDefaultEvents();
            //处理绑定的扩展操作
            this.bindPluginUpdate();
            $(this.element)[this.controlType](this.options);

            this.execMethods();
        };
    };

    window.easyuiMapping = window.easyuiMapping || easyuiMapping;
  
    //迭代生成绑定器
    for (control in $.fn) {
        //$.fn中带defauls属性的插件，即为easyui的插件
        if ($.fn[control].defaults == undefined) {
            continue;
        }

        //动态生成ko的插件名称与easyui的插件名称保持一致
        ko.bindingHandlers[control] = (function (controlType) {
            return {
                init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    easyuiMapping.createComponent(element, valueAccessor, allBindings, viewModel, bindingContext, controlType).init();
                }, update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    easyuiMapping.getCachedComponent(element).update();
                }
            };
        })(control);
    }

    ko.bindingHandlers.icheck = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
           var value= ko.unwrap(valueAccessor);
            var id = "a" + Math.random().toString().replace("0.", "");
            $(element).attr("id", id);
            $(element).css("display", "none");
            //添加radio功能 mikahuang 201610
            if ($(element).attr("type") == "radio") {
                element.valueAccessor = valueAccessor;
                $(element).addClass("regular-radio");
                if (typeof (viewModel.name) != "undefined") {
                    $(element).attr('name', ko.unwrap(viewModel.name));
                }
            }
            else {
                $(element).addClass("regular-checkbox");
                if (typeof (viewModel.isSelected) != "undefined") {
                    $(element).attr('checked', value);
                }
            }
            var label = $("<label for='" + id + "' />");
            $(element).after(label);
           
            $(label).click(function (event) {
                if ($(element).prop("readonly") || $(element).prop("disabled")) {
                    return false;
                }
                var checkedValue = $(element).prop("checked");
                if ($(element).attr("type") == "radio") {
                    //取消已选中radio mikahuang 201610
                    $("input:radio[name=" + $(element).attr("name") + "]:checked").each(function () {
                        $(this).attr('checked', false);
                        this.valueAccessor&& this.valueAccessor() && this.valueAccessor()(false);
                    });
                }
                $(element).prop("checked", !checkedValue);
                valueAccessor && valueAccessor() && valueAccessor()(element.checked);
               
                if (allBindings()["click"]) {
                    allBindings()["click"]($(element).prop("checked"), viewModel, event);
                }
                event.stopPropagation();
                return false;
            });

            $($(element).parent().find("span")).click(function (event) {
                if ($(element).prop("readonly") || $(element).prop("disabled")) {
                    return false;
                }
                var checkedValue = $(element).prop("checked");
                if ($(element).attr("type") == "radio") {
                    //取消已选中radio
                    $("input:radio[name=" + $(element).attr("name") + "]:checked").each(function () {
                        $(this).attr('checked', false);
                        this.valueAccessor && this.valueAccessor() && this.valueAccessor()(false);
                    });
                }
                $(element).prop("checked", !checkedValue);
                valueAccessor && valueAccessor() && valueAccessor()(element.checked);

                if (allBindings()["click"]) {
                    allBindings()["click"]($(element).prop("checked"), viewModel, event);
                }
                event.stopPropagation();
                return false;
            });

        },
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            if (valueAccessor && valueAccessor()) {
                element.checked = valueAccessor()();
            }
        }
    }

    ////checkbox扩展
    //ko.bindingHandlers.icheck = {
    //    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

    //        //$(element).hide();
    //        setTimeout(function () {
    //            $(element).show();
    //            $(element).iCheck({
    //                checkboxClass: 'icheckbox_flat-blue',
    //                radioClass: 'iradio_flat-blue'
    //            });

    //            //icheck事件增加click事件，该事件主要用于切断全选和表格中的选项直接的数据循环通知
    //            //主界面全选的触发通过click事件，值的变更通过computed方式计算数据的长度
    //            if (allBindings()["click"]) {
                   
    //                $(element).on('ifClicked', function (event) {
    //                    allBindings()["click"](!event.currentTarget.checked,viewModel);
    //                });
    //            }

    //            $(element).on('ifChecked', function (event) {
                   
    //                valueAccessor && valueAccessor() && valueAccessor()(true);
                   
    //            });

    //            $(element).on('ifUnchecked', function (event) {
    //                valueAccessor && valueAccessor() && valueAccessor()(false);
                  
    //            });

               
    //            //$(element).show();

    //        }, 50);
    //    },
    //    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
    //        if (valueAccessor && valueAccessor()) {
    //            if (valueAccessor()()) {
    //                $(element).iCheck('check');
    //            } else {
    //                $(element).iCheck('uncheck')
    //            }
    //        }
    //    }
    //}
    //ko可监控对象，从纯js对象赋值给可监控对象时的包装，
    //当可监控对象为空时，直接初始化结构，否则，合并属性值
    //注意 空可监控对象的写法是 ko.observable() 里面不能有任何内容
    ko.observable.fn.fromJS = function (data, matchValue) {
        if (!this()) {
            this(komapping.fromJS(data));
        } else {
            komapping.fromJS(data, this());
        }
    }
});
