(function ($, lng,undefined) {
    $.extend($.fn.textbox.methods, {
        focused: function (jq, args) {
            if (args) {
                jq.textbox('textbox').focus();
            } else {
                jq.textbox('textbox').blur();
            }
            return jq;
        }
    });

    $.extend($.fn.window.methods, {
        closed: function (jq, args) {
            if (args == undefined || args == null)
                return jq;
            if (args === true) {
                jq.window('close');
            } else if (args === false) {
                jq.window('open');
            } else {
                jq.window('options', { closed: true });
            }
            return jq;
        }
    });
    //时间控件格式处理
    $.fn.datebox.defaults.formatter = function (date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
    };
    //时间控件格式处理
    $.fn.datebox.defaults.parser = function (s) {
        if (!s) return new Date();
        var ss = (s.split('-'));
        var y = parseInt(ss[0], 10);
        var m = parseInt(ss[1], 10);
        var d = parseInt(ss[2], 10);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
            return new Date(y, m - 1, d);
        } else {
            return new Date();
        }
    };

    $.fn.datagrid.defaults.columns = [[]];
    $.fn.window.methods.timeout = 0;
    $.fn.window.methods.message = function (jq, message) {
        if (!$.data(jq[0], 'window')) return;
        var windowPanel = $.data(jq[0], 'window').window;
        //message = { type: 'error',messsage:'要显示的内容',delay:1000}
        //type : error|success|warn
        //usage: app.trigger("message:show", {type:'error',message:folderInfo.name});
        if (!message || !message.message) return;
        var messageBox;
        var iconSpan;
        var messageContent;
        if ($(windowPanel).find(".messageBox").length == 0) {
            messageBox = $("<div class='messageBox' style='top:42px;  position:absolute;right:0px; left:0px;' />");
            iconSpan = $("<span />");
            messageContent = $("<span class='message-content'/>");
            messageBox.append(iconSpan);
            messageBox.append(messageContent);
            messageBox.insertBefore($($(windowPanel).children()[0]));
        } else {
            messageBox = $(windowPanel).find(".messageBox");
            messageBox.css({ top: "42px;" });
            iconSpan = $(messageBox.children()[0]);
            messageContent = $(messageBox.children()[1]);
        }
        //无header的情况
        if ($(windowPanel).find(".panel-header").length == 0) {
            $(windowPanel).find(".messageBox").css({"top":"52px"});
        }

        if (!message) {
            messageBox.hide();
        }

        if (typeof message == "string") {
            message = {
                message: message
            }
        }

        if (!message.type) {
            message.type = "success";
        }

        if (!message.delay) {
            message.delay = 3000;
        }

        messageContent.html(message.message);

        iconSpan.removeClass("error").removeClass("success");
        messageBox.removeClass("error").removeClass("success");
        iconSpan.addClass(message.type);
        messageBox.addClass(message.type);
        messageBox.show();
        //201610mikahuang,清除message.message,否则下次弹出window还会出现上一次的信息
        message.message = "";
        if (message.type == "loading") return;
        if (message.type == "loaded") {
            messageBox.hide();
            return;
        }

        clearTimeout($.fn.window.methods.timeout);
        $.fn.window.methods.timeout = setTimeout(function () {
           messageBox.hide();
           
        }, message.delay);
    }


    //#region linkbutton

    //扩展linkbutton添加hide、show方法
    $.extend($.fn.linkbutton.methods, {
        hide: function (jq) {
            return jq.each(function () {
                if ($(this).is(":visible")) {
                    $(this).linkbutton("disable");
                    $(this).hide();
                }
            });
        },
        show: function (jq) {
            return jq.each(function () {
                if ($(this).is(":hidden")) {
                    $(this).linkbutton("enable");
                    $(this).show();
                }
            });
        }
    });
    //#endregion

    //#region layout
    //在layout的panle全局配置中,增加一个onCollapse处理title
    $.extend($.fn.layout.paneldefaults, {
        onCollapse: function () {
            //获取layout容器
            var layout = $(this).parents(".layout").first();
            //获取当前region的配置属性
            var opts = $(this).panel("options");
            //获取key
            var expandKey = "expand" + opts.region.substring(0, 1).toUpperCase() + opts.region.substring(1);
            //从layout的缓存对象中取得对应的收缩对象
            var expandPanel = layout.data("layout").panels[expandKey];
            opts.title = opts.title || "";
            //针对横向和竖向的不同处理方式
            //修复opts.title为undefined的无法substring的问题
            opts.title = opts.title || "";
            if (opts.region == "west" || opts.region == "east") {
                //竖向的文字打竖,其实就是切割文字加br
                var split = [];
                for (var i = 0; i < opts.title.length; i++) {
                    split.push(opts.title.substring(i, i + 1));
                }
                expandPanel.panel("body").addClass("panel-title").css("text-align", "center").html(split.join("<br>"));
            }
            else {
                expandPanel.panel("setTitle", opts.title);
            }
        }
    });
    //#endregion

    //#region datagrid
    /*
    * easyui datagrid方法扩展
    * @ getToolbar : 获取datagrid的toolbar(jquery 对象)
    * @ getToolbarAllBtn: 获取datagrid的toolbar的所有按钮(jquery 对象)
    * @ disabledToolbarBtn : 禁用toolbar的按钮
    * @ enableToolbarBtn : 启用toolbar的按钮
    * @ enableCellEditing :启用列编辑
    * @ editCell: 点击编辑事件
    */
    $.extend($.fn.datagrid.methods, {
        getToolbar: function (jq) {
            var panel = jq.datagrid('getPanel');
            var toolbar = panel.find('div.datagrid-toolbar');
            return toolbar;
        },
        getToolbarAllBtn: function (jq) {
            var toolbar = jq.datagrid('getToolbar');
            return toolbar.find('a');
        },
        /*
        * @ param: toolbar属性中的按钮配置
        * { buttons: [btn1,btn2] }
        */
        disabledToolbarBtn: function (jq, param) {

            var buttons = param && param.buttons;
            if (!buttons || buttons instanceof Array == false) { return jq; }

            $.each(buttons, function (i, btn) {

                if (!btn) return true;

                var id = btn.id, text = btn.text;

                if (id) {
                    var toolbar = jq.datagrid('getToolbar');
                    var obj = toolbar.find('a[id="' + id + '"]')
                    obj.linkbutton('disable');

                } else {
                    var allBtns = jq.datagrid('getToolbarAllBtn');
                    allBtns.each(function () {
                        var obj = $(this);
                        obj.text() === text && obj.linkbutton('disable');
                    });
                }
            });

            return jq;
        },
        /*
        * @ param: toolbar属性中的按钮配置
        * { buttons: [btn1,btn2] }
        */
        enableToolbarBtn: function (jq, param) {

            var buttons = param && param.buttons;
            if (!buttons || buttons instanceof Array == false) { return jq; }

            $.each(buttons, function (i, btn) {

                if (!btn) return true;
                var id = btn.id;
                var text = btn.text;

                if (id) {
                    var toolbar = jq.datagrid('getToolbar');
                    var obj = toolbar.find('a[id="' + id + '"]')
                    obj.linkbutton('enable');
                } else {
                    var allBtns = jq.datagrid('getToolbarAllBtn');
                    allBtns.each(function () {
                        var obj = $(this);
                        obj.text() === text && obj.linkbutton('enable');
                    });
                }

            });
            return jq;
        },
        /*
       * @ param: 列名 field
       */
        editCell: function (jq, param) {
            return jq.each(function () {
                var opts = $(this).datagrid('options');
                var fields = $(this).datagrid('getColumnFields', true).concat($(this).datagrid('getColumnFields'));
                for (var i = 0; i < fields.length; i++) {
                    var col = $(this).datagrid('getColumnOption', fields[i]);
                    col.editor1 = col.editor;
                    if (fields[i] != param.field) {
                        col.editor = null;
                    }
                }
                $(this).datagrid('beginEdit', param.index);
                var ed = $(this).datagrid('getEditor', param);
                if (ed) {
                    if ($(ed.target).hasClass('textbox-f')) {
                        $(ed.target).textbox('textbox').focus();
                    } else {
                        $(ed.target).focus();
                    }
                }
                for (var i = 0; i < fields.length; i++) {
                    var col = $(this).datagrid('getColumnOption', fields[i]);
                    col.editor = col.editor1;
                }
            });
        },
        /*
        * @ 启用列编辑
        */
        enableCellEditing: function (jq) {
            return jq.each(function () {
                var dg = $(this);
                var opts = dg.datagrid('options');
                opts.oldOnClickCell = opts.onClickCell;
                opts.onClickCell = function(index, field) {
                    if (opts.editIndex != undefined) {
                        if (dg.datagrid('validateRow', opts.editIndex)) {
                            dg.datagrid('endEdit', opts.editIndex);
                            opts.editIndex = undefined;
                        } else {
                            return;
                        }
                    }
                    dg.datagrid('selectRow', index).datagrid('editCell', {
                        index: index,
                        field: field
                    });
                    opts.editIndex = index;
                    opts.oldOnClickCell.call(this, index, field);
                };
            });
        },
        /*
        * @ 获取团队成员列表编辑列序号
        */
        getEditingRowIndexs: function (jq) {
            var rows = $.data(jq[0], "datagrid").panel.find('.datagrid-row-editing');
            var indexs = [];
            rows.each(function (i, row) {
                var index = row.sectionRowIndex;
                if (indexs.indexOf(index) == -1) {
                    indexs.push(index);
                }
            });
            return indexs;
        }


    });
    //#endregion

    //#region tabs
    $.extend($.fn.tabs.methods, {
        //显示遮罩
        loading: function (jq, msg) {
            return jq.each(function () {
                var panel = $(this).tabs("getSelected");
                if (msg == undefined) {
                    msg = "loading，please wait...";
                }
                $("<div class=\"datagrid-mask\"></div>").css({ display: "block", width: panel.width(), height: panel.height() }).appendTo(panel);
                $("<div class=\"datagrid-mask-msg\"></div>").html(msg).appendTo(panel).css({ display: "block", left: (panel.width() - $("div.datagrid-mask-msg", panel).outerWidth()) / 2, top: (panel.height() - $("div.datagrid-mask-msg", panel).outerHeight()) / 2 });
            });
        }
,
        //隐藏遮罩
        loaded: function (jq) {
            return jq.each(function () {
                var panel = $(this).tabs("getSelected");
                panel.find("div.datagrid-mask-msg").remove();
                panel.find("div.datagrid-mask").remove();
            });
        }
    });
    //#endregion

    //#region combobox combotree combogird
    $.extend($.fn.combo.methods, {
        combo: function (jq) {
            return $.data(jq[0], 'combo').combo;
        }
    });


    $.extend($.fn.combobox.methods, {
        combo: function (jq) {
            return $(jq[0]).combo('combo');
        }
    });

    $.extend($.fn.combotree.methods, {
        combo: function (jq) {
            return $(jq[0]).combo('combo');
        }
    });

    //扩展combobox的getText方法，如果从继承的textbox方法中获取不到则调用combobox("combo").find('input.textbox-text').val()
    $.extend($.fn.combobox.methods, {
        getText: function (jq) {
            var text = $(jq[0]).combo('getText');
            if (!text) {
                text = $(jq[0]).combo("combo").find('input.textbox-text').val();
            }
            return text;
        }
    });

    $.extend($.fn.combogrid.methods, {
        getText: function (jq) {
            var text = $(jq[0]).combo('getText');
            if (!text) {
                text = $(jq[0]).combo("combo").find('input.textbox-text').val();
            }
            return text;
        }
    });

    $.extend($.fn.combotree.methods, {
        getText: function (jq) {
            var text = $(jq[0]).combo('getText');
            if (!text) {
                text = $(jq[0]).combo("combo").find('input.textbox-text').val();
            }
            return text;
        }
    });
    //#endregion


    $.extend($.fn.tree.methods, {
        unSelect: function (jq, target) {
            return jq.each(function () {
                $(target).removeClass("tree-node-selected");
            });
        }
    });


    var lnStr = $.cookie("lang") ? $.cookie("lang") : "zh-cn";
    var lang = lng.lang[lnStr];
    /** 
    * 扩展easyui的validator插件rules，支持更多类型验证 
    */
    $.extend($.fn.validatebox.defaults.rules, {
        minLength: {
            validator: function (value, param) {
                return value.length >= param[0];
            },
            message: lang.atLeastEnter
        },
        length: {
            validator: function (value, param) {
                var len = $.trim(value).length;
                return len >= param[0] && len <= param[1];
            },
            message: lang.inputContentLength
        },
        telephone: {
            validator: function (value) {
                return /^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/i.test(value);
            },
            message: lang.phoneVerfication
        },
        mobile: {
            validator: function (value) {
                return /^(13|14|15|16|18|17|19)\d{9}$/i.test(value);
            },
            message: lang.phoneIncorrect
        },
        phoneAndMobile: {
            validator: function (value) {
                return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value) || /^(13|15|18)\d{9}$/i.test(value);
            },
            message: lang.phoneOrMobileIncorrect
        },
        idcard: {
            validator: function (value) {
                return /^\d{15}(\d{2}[A-Za-z0-9])?$/i.test(value) || /^\d{18}(\d{2}[A-Za-z0-9])?$/i.test(value);
            },
            message: lang.IDNumberIncorred
        },
        intOrFloat: {
            validator: function (value) {
                return /^\d+(\.\d+)?$/i.test(value);
            },
            message: lang.InputNumberA
        },
        currency: {
            validator: function (value) {
                return /^\d+(\.\d+)?$/i.test(value);
            },
            message: lang.IncorrectCurrency
        },
        qq: { 
            validator: function (value) {
                return /^[1-9]\d{4,9}$/i.test(value);
            },
            message: lang.QQIncorrect
        },
        integer: { 
            validator: function (value) {
                return /^[+]?[1-9]+\d*$/i.test(value);
            },
            message: lang.enterInteger
        },
        chinese: {
            validator: function (value) {
                return /^[\u0391-\uFFE5]+$/i.test(value);
            },
            message:lang.enterChinese
        },
        chineseAndLength: {
            validator: function (value) {
                var len = $.trim(value).length;
                if (len >= param[0] && len <= param[1]) {
                    return /^[\u0391-\uFFE5]+$/i.test(value);
                }
            },
            message: lang.enterChinese
        },
        english: {
            validator: function (value) {
                return /^[A-Za-z]+$/i.test(value);
            },
            message: lang.enterEnglish
        },
        englishAndLength: {
            validator: function (value, param) {
                var len = $.trim(value).length;
                if (len >= param[0] && len <= param[1]) {
                    return /^[A-Za-z]+$/i.test(value);
                }
            },
            message: lang.enterEnglish
        },
        englishUpperCase: { 
            validator: function (value) {
                return /^[A-Z]+$/.test(value);
            },
            message: lang.pleaseEnterCapitalized
        },
        unnormal: {
            validator: function (value) {
                return /.+/i.test(value);
            },
            message: lang.cannotBeNull
        },
        username: {
            validator: function (value) {
                return /^[a-zA-Z][a-zA-Z0-9_]{5,15}$/i.test(value);
            },
            message: lang.userNamesIllegal
        },
        faxno: {  
            validator: function (value) {
                return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);
            },
            message: lang.faxNumberIncorrect
        },
        zip: {
            validator: function (value) {
                return /^[1-9]\d{5}$/i.test(value);
            },
            message: lang.postalCodeInCorrect
        },
        ip: {
            validator: function (value) {
                return /d+.d+.d+.d+/i.test(value);
            },
            message: lang.IPIncorrect
        },
        name: {
            validator: function (value) {
                return /^[\u0391-\uFFE5]+$/i.test(value) | /^\w+[\w\s]+\w+$/i.test(value);
            },
            message: lang.pleaseEnterYourName
        },
        engOrChinese: {
            validator: function (value) {
                return /^[\u0391-\uFFE5]+$/i.test(value) | /^\w+[\w\s]+\w+$/i.test(value);
            },
            message: lang.enterChinese
        },
        engOrChineseAndLength: {
            validator: function (value) {
                var len = $.trim(value).length;
                if (len >= param[0] && len <= param[1]) {
                    return /^[\u0391-\uFFE5]+$/i.test(value) | /^\w+[\w\s]+\w+$/i.test(value);
                }
            },
            message: lang.pleaseEnterChindesOrEnglish
        },
        carNo: {
            validator: function (value) {
                return /^[\u4E00-\u9FA5][\da-zA-Z]{6}$/.test(value);
            },
            message: lang.licensePlateNumberIsInvalid
        },
        carenergin: {
            validator: function (value) {
                return /^[a-zA-Z0-9]{16}$/.test(value);
            },
            message: lang.invalidEngineModel
        },
        same: {
            validator: function (value, param) {
                if ($("#" + param[0]).val() != "" && value != "") {
                    return $("#" + param[0]).val() == value;
                } else {
                    return true;
                }
            },
            message: lang.twoInconsistentPaswords
        }
    },lang);

})(jQuery,{
    lang:{
        en: {
            "atLeastEnter":"Enter at least {0} characters",
            "inputContentLength":"The length of input content must be between {0} and {1}",
            "phoneVerfication":"Phone number verification failed (e.g. 021-888888)",
            "phoneIncorrect":'Incorrect format of mobile phone number',
            "phoneOrMobileIncorrect":"Incorrect format of phone number or mobile phone number",
            "IDNumberIncorred":"The ID number format is incorrect",
            "InputNumberA":"Please enter the numbers and make sure they are in the correct format.",
            "IncorrectCurrency":"Incorrect currency format",
            "QQIncorrect":"QQ number format is incorrect",
            "enterInteger":"please enter an integer",
            "enterChinese":"Please enter Chinese",
            "enterEnglish":"Please enter English",
            "pleaseEnterCapitalized":"Please enter capitalized English",
            "cannotBeNull":"Input values cannot be null and contain other illegal characters",
            "userNamesIllegal":"User names are illegal (letters start, 6-16 bytes allowed, letters and numbers underscored)",
            "faxNumberIncorrect":"Fax number incorrect",
            "postalCodeInCorrect":"Postal code format incorrect",
            "IPIncorrect":"IP address format incorrect",
            "pleaseEnterYourName":"Please enter your name.",
            "pleaseEnterChindesOrEnglish":"Please enter Chinese or English",
            "licensePlateNumberIsInvalid":"The license plate number is invalid (example: Guangdong B12350)",
            "invalidEngineModel":"Invalid engine model (example: FG6H012345654584)",
            "twoInconsistentPaswords":"Two inconsistent passwords!",
        },
        ja: {
            "atLeastEnter":"最低は{ 0 }の文字を入力します",
            "inputContentLength":"入力した内容の長さは{0}から{1}までの間にしてください",
            "phoneVerfication":"電話番号認証失敗、（例：021-88888888）",
            "phoneIncorrect":'携帯番号のフォーマットが間違った',
            "phoneOrMobileIncorrect":"電話番号や携帯番号のフォーマットが間違った",
            "IDNumberIncorred":"身分証明番号のフォーマットが間違った",
            "InputNumberA":"数字を入力し、フォーマットの正確性を確保してください",
            "IncorrectCurrency":"貨幣のフォーマットが間違った",
            "QQIncorrect":"QQ番号のフォーマットが間違った",
            "enterInteger":"整数を入力してください",
            "enterChinese":"中国語を入力してください",
            "enterEnglish":"英語を入力してください",
            "pleaseEnterCapitalized":"大文字を入力してください",
            "cannotBeNull":"入力値は空き、或は不正文字を含めてはいけない",
            "userNamesIllegal":"ユーザー名は不正だ（字母で始まる，6から16までのバイト，字母?数字?下線を許す）",
            "faxNumberIncorrect":"ファクス番号のフォーマットが間違った",
            "postalCodeInCorrect":"郵便番号のフォーマットが間違った",
            "IPIncorrect":"IPアドレスのフォーマットが間違った",
            "pleaseEnterYourName":"名前を入力してください",
            "pleaseEnterChindesOrEnglish":"中国語や英語を入力してください",
            "licensePlateNumberIsInvalid":"ナンバープレートは無効だ（例：粤B12350）",
            "invalidEngineModel":"エンジンの型番は無効だ(例：FG6H012345654584)",
            "twoInconsistentPaswords":"2回入力されたパスワードが一致しない!",
        },
        "zh-cn": {
            "atLeastEnter":"最少输入{0}个字符",
            "inputContentLength":"输入内容长度必须介于{0}和{1}之间",
            "phoneVerfication":"电话号码验证失败,（例：021-88888888）",
            "phoneIncorrect":'手机号码格式不正确',
            "phoneOrMobileIncorrect":"电话号码或手机号码格式不正确",
            "IDNumberIncorred":"身份证号码格式不正确",
            "InputNumberA":"请输入数字，并确保格式正确",
            "IncorrectCurrency":"货币格式不正确",
            "QQIncorrect":"QQ号码格式不正确",
            "enterInteger":"请输入整数",
            "enterChinese":"请输入中文",
            "enterEnglish":"请输入英文",
            "pleaseEnterCapitalized":"请输入大写英文",
            "cannotBeNull":"输入值不能为空和包含其他非法字符",
            "userNamesIllegal":"用户名不合法（字母开头，允许6-16字节，允许字母数字下划线）",
            "faxNumberIncorrect":"传真号码不正确",
            "postalCodeInCorrect":"邮政编码格式不正确",
            "IPIncorrect":"IP地址格式不正确",
            "pleaseEnterYourName":"请输入姓名",
            "pleaseEnterChindesOrEnglish":"请输入中文或英文",
            "licensePlateNumberIsInvalid":"车牌号码无效（例：粤B12350）",
            "invalidEngineModel":"发动机型号无效(例：FG6H012345654584)",
            "twoInconsistentPaswords":"两次输入的密码不一致!",
        },
        "zh-tw":{
            "atLeastEnter":"最少輸入{0}個字元",
            "inputContentLength":"輸入內容長度必須介於{0}和{1}之間",
            "phoneVerfication":"電話號碼驗證失敗，（例：021-88888888）",
            "phoneOrMobileIncorrect":"電話號碼或手機號碼格式不正確",
            "IDNumberIncorred":"身份證號碼格式不正確",
            "InputNumberA":"請輸入數位，並確保格式正確",
            "IncorrectCurrency":"貨幣格式不正確",
            "QQIncorrect":"QQ號碼格式不正確",
            "enterInteger":"請輸入整數",
            "enterChinese":"請輸入中文",
            "enterEnglish":"請輸入英文",
            "pleaseEnterCapitalized":"請輸入大寫英文",
            "cannotBeNull":"輸入值不能為空和包含其他非法字元",
            "userNamesIllegal":"用戶名不合法（字母開頭，允許6-16位元組，允許字母數位底線）",
            "faxNumberIncorrect":"傳真號碼不正確",
            "postalCodeInCorrect":"郵遞區號格式不正確",
            "IPIncorrect":"IP地址格式不正確",
            "pleaseEnterYourName":"請輸入姓名",
            "pleaseEnterChindesOrEnglish":"請輸入中文或英文",
            "licensePlateNumberIsInvalid":"車牌號碼無效（例：粵B12350）",
            "invalidEngineModel":"發動機型號無效（例：FG6H012345654584）",
            "twoInconsistentPaswords":"兩次輸入的密碼不一致!",
        }
    }
})