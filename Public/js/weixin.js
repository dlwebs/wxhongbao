/**!
 * 微信内置浏览器的Javascript API，功能包括：
 *
 * 1、分享到微信朋友圈
 * 2、分享给微信好友
 * 3、分享到腾讯微博
 * 4、新的分享接口，包含朋友圈、好友、微博的分享（for iOS）
 * 5、隐藏/显示右上角的菜单入口
 * 6、隐藏/显示底部浏览器工具栏
 * 7、获取当前的网络状态
 * 8、调起微信客户端的图片播放组件
 * 9、关闭公众平台Web页面
 * 10、判断当前网页是否在微信内置浏览器中打开
 * 11、增加打开扫描二维码
 * 12、支持WeixinApi的错误监控
 * 13、检测应用程序是否已经安装（需要官方开通权限）
 * 14、发送电子邮件
 *
 * @author zhaoxianlie(http://www.baidufe.com)
 */
(function (window) {

    "use strict";

    /**
     * 定义WeixinApi
     */
    var WeixinApi = {
        version: 3.91
    };

    // 将WeixinApi暴露到window下：全局可使用，对旧版本向下兼容
    window.WeixinApi = WeixinApi;

    /////////////////////////// CommonJS /////////////////////////////////
    if (typeof define === 'function' && (define.amd || define.cmd)) {
        if (define.amd) {
            // AMD 规范，for：requirejs
            define(function () {
                return WeixinApi;
            });
        } else if (define.cmd) {
            // CMD 规范，for：seajs
            define(function (require, exports, module) {
                module.exports = WeixinApi;
            });
        }
    }

    /**
     * 对象简单继承，后面的覆盖前面的，继承深度：deep=1
     * @private
     */
    var _extend = function () {
        var result = {}, obj, k;
        for (var i = 0, len = arguments.length; i < len; i++) {
            obj = arguments[i];
            if (typeof obj === 'object') {
                for (k in obj) {
                    obj[k] && (result[k] = obj[k]);
                }
            }
        }
        return result;
    };

    /**
     * 内部私有方法，分享用
     * @private
     */
    var _share = function (cmd, data, callbacks) {
        callbacks = callbacks || {};

        // 分享过程中的一些回调
        var progress = function (resp) {
            switch (true) {
                // 用户取消
                case /\:cancel$/i.test(resp.err_msg) :
                    callbacks.cancel && callbacks.cancel(resp);
                    break;
                // 发送成功
                case /\:(confirm|ok)$/i.test(resp.err_msg):
                    callbacks.confirm && callbacks.confirm(resp);
                    break;
                // fail　发送失败
                case /\:fail$/i.test(resp.err_msg) :
                default:
                    callbacks.fail && callbacks.fail(resp);
                    break;
            }
            // 无论成功失败都会执行的回调
            callbacks.all && callbacks.all(resp);
        };

        // 执行分享，并处理结果
        var handler = function (theData, argv) {

            // 加工一下数据
            if (cmd.menu == 'menu:share:timeline' ||
                (cmd.menu == 'menu:general:share' && argv.shareTo == 'timeline')) {

                var title = theData.title;
                theData.title = theData.desc || title;
                theData.desc = title || theData.desc;
            }

            // 新的分享接口，单独处理
            if (cmd.menu === 'menu:general:share') {
                // 如果是收藏操作，并且在wxCallbacks中配置了favorite为false，则不执行回调
                if (argv.shareTo == 'favorite' || argv.scene == 'favorite') {
                    if (callbacks.favorite === false) {
                        return argv.generalShare(theData, function () {
                        });
                    }
                }

                argv.generalShare(theData, progress);
            } else {
                WeixinJSBridge.invoke(cmd.action, theData, progress);
            }
        };

        // 监听分享操作
        WeixinJSBridge.on(cmd.menu, function (argv) {
            callbacks.dataLoaded = callbacks.dataLoaded || new Function();
            if (callbacks.async && callbacks.ready) {
                WeixinApi["_wx_loadedCb_"] = callbacks.dataLoaded;
                if (WeixinApi["_wx_loadedCb_"].toString().indexOf("_wx_loadedCb_") > 0) {
                    WeixinApi["_wx_loadedCb_"] = new Function();
                }
                callbacks.dataLoaded = function (newData) {
                    callbacks.__cbkCalled = true;
                    var theData = _extend(data, newData);
                    theData.img_url = theData.imgUrl || theData.img_url;
                    delete theData.imgUrl;
                    WeixinApi["_wx_loadedCb_"](theData);
                    handler(theData, argv);
                };
                // 然后就绪
                if (!(argv && (argv.shareTo == 'favorite' || argv.scene == 'favorite') && callbacks.favorite === false)) {
                    callbacks.ready && callbacks.ready(argv, data);
                    // 如果设置了async为true，但是在ready方法中并没有手动调用dataLoaded方法，则自动触发一次
                    if (!callbacks.__cbkCalled) {
                        callbacks.dataLoaded({});
                        callbacks.__cbkCalled = false;
                    }
                }
            } else {
                // 就绪状态
                var theData = _extend(data);
                if (!(argv && (argv.shareTo == 'favorite' || argv.scene == 'favorite') && callbacks.favorite === false)) {
                    callbacks.ready && callbacks.ready(argv, theData);
                }
                handler(theData, argv);
            }
        });
    };

    /**
     * 分享到微信朋友圈
     * @param       {Object}    data       待分享的信息
     * @p-config    {String}    appId      公众平台的appId（服务号可用）
     * @p-config    {String}    imgUrl     图片地址
     * @p-config    {String}    link       链接地址
     * @p-config    {String}    desc       描述
     * @p-config    {String}    title      分享的标题
     *
     * @param       {Object}    callbacks  相关回调方法
     * @p-config    {Boolean}   async                   ready方法是否需要异步执行，默认false
     * @p-config    {Function}  ready(argv, data)       就绪状态
     * @p-config    {Function}  dataLoaded(data)        数据加载完成后调用，async为true时有用，也可以为空
     * @p-config    {Function}  cancel(resp)    取消
     * @p-config    {Function}  fail(resp)      失败
     * @p-config    {Function}  confirm(resp)   成功
     * @p-config    {Function}  all(resp)       无论成功失败都会执行的回调
     */
    WeixinApi.shareToTimeline = function (data, callbacks) {
        _share({
            menu: 'menu:share:timeline',
            action: 'shareTimeline'
        }, {
            "appid": data.appId ? data.appId : '',
            "img_url": data.imgUrl,
            "link": data.link,
            "desc": data.desc,
            "title": data.title,
            "img_width": "640",
            "img_height": "640"
        }, callbacks);
    };

    /**
     * 发送给微信上的好友
     * @param       {Object}    data       待分享的信息
     * @p-config    {String}    appId      公众平台的appId（服务号可用）
     * @p-config    {String}    imgUrl     图片地址
     * @p-config    {String}    link       链接地址
     * @p-config    {String}    desc       描述
     * @p-config    {String}    title      分享的标题
     *
     * @param       {Object}    callbacks  相关回调方法
     * @p-config    {Boolean}   async                   ready方法是否需要异步执行，默认false
     * @p-config    {Function}  ready(argv, data)       就绪状态
     * @p-config    {Function}  dataLoaded(data)        数据加载完成后调用，async为true时有用，也可以为空
     * @p-config    {Function}  cancel(resp)    取消
     * @p-config    {Function}  fail(resp)      失败
     * @p-config    {Function}  confirm(resp)   成功
     * @p-config    {Function}  all(resp)       无论成功失败都会执行的回调
     */
    WeixinApi.shareToFriend = function (data, callbacks) {
        _share({
            menu: 'menu:share:appmessage',
            action: 'sendAppMessage'
        }, {
            "appid": data.appId ? data.appId : '',
            "img_url": data.imgUrl,
            "link": data.link,
            "desc": data.desc,
            "title": data.title,
            "img_width": "640",
            "img_height": "640"
        }, callbacks);
    };


    /**
     * 分享到腾讯微博
     * @param       {Object}    data       待分享的信息
     * @p-config    {String}    link       链接地址
     * @p-config    {String}    desc       描述
     *
     * @param       {Object}    callbacks  相关回调方法
     * @p-config    {Boolean}   async                   ready方法是否需要异步执行，默认false
     * @p-config    {Function}  ready(argv, data)       就绪状态
     * @p-config    {Function}  dataLoaded(data)        数据加载完成后调用，async为true时有用，也可以为空
     * @p-config    {Function}  cancel(resp)    取消
     * @p-config    {Function}  fail(resp)      失败
     * @p-config    {Function}  confirm(resp)   成功
     * @p-config    {Function}  all(resp)       无论成功失败都会执行的回调
     */
    WeixinApi.shareToWeibo = function (data, callbacks) {
        _share({
            menu: 'menu:share:weibo',
            action: 'shareWeibo'
        }, {
            "content": data.desc,
            "url": data.link
        }, callbacks);
    };

    /**
     * 新的分享接口
     * @param       {Object}    data       待分享的信息
     * @p-config    {String}    appId      公众平台的appId（服务号可用）
     * @p-config    {String}    imgUrl     图片地址
     * @p-config    {String}    link       链接地址
     * @p-config    {String}    desc       描述
     * @p-config    {String}    title      分享的标题
     *
     * @param       {Object}    callbacks  相关回调方法
     * @p-config    {Boolean}   async                   ready方法是否需要异步执行，默认false
     * @p-config    {Function}  ready(argv, data)       就绪状态
     * @p-config    {Function}  dataLoaded(data)        数据加载完成后调用，async为true时有用，也可以为空
     * @p-config    {Function}  cancel(resp)    取消
     * @p-config    {Function}  fail(resp)      失败
     * @p-config    {Function}  confirm(resp)   成功
     * @p-config    {Function}  all(resp)       无论成功失败都会执行的回调
     */
    WeixinApi.generalShare = function (data, callbacks) {
        _share({
            menu: 'menu:general:share'
        }, {
            "appid": data.appId ? data.appId : '',
            "img_url": data.imgUrl,
            "link": data.link,
            "desc": data.desc,
            "title": data.title,
            "img_width": "640",
            "img_height": "640"
        }, callbacks);
    };

    /**
     * 加关注（此功能只是暂时先加上，不过因为权限限制问题，不能用，如果你的站点是部署在*.qq.com下，也许可行）
     * @param       {String}    appWeixinId     微信公众号ID
     * @param       {Object}    callbacks       回调方法
     * @p-config    {Function}  fail(resp)      失败
     * @p-config    {Function}  confirm(resp)   成功
     */
    WeixinApi.addContact = function (appWeixinId, callbacks) {
        callbacks = callbacks || {};
        WeixinJSBridge.invoke("addContact", {
            webtype: "1",
            username: appWeixinId
        }, function (resp) {
            var success = !resp.err_msg || "add_contact:ok" == resp.err_msg
                || "add_contact:added" == resp.err_msg;
            if (success) {
                callbacks.success && callbacks.success(resp);
            } else {
                callbacks.fail && callbacks.fail(resp);
            }
        })
    };

    /**
     * 调起微信Native的图片播放组件。
     * 这里必须对参数进行强检测，如果参数不合法，直接会导致微信客户端crash
     *
     * @param {String} curSrc 当前播放的图片地址
     * @param {Array} srcList 图片地址列表
     */
    WeixinApi.imagePreview = function (curSrc, srcList) {
        if (!curSrc || !srcList || srcList.length == 0) {
            return;
        }
        WeixinJSBridge.invoke('imagePreview', {
            'current': curSrc,
            'urls': srcList
        });
    };

    /**
     * 显示网页右上角的按钮
     */
    WeixinApi.showOptionMenu = function () {
        WeixinJSBridge.call('showOptionMenu');
    };


    /**
     * 隐藏网页右上角的按钮
     */
    WeixinApi.hideOptionMenu = function () {
        WeixinJSBridge.call('hideOptionMenu');
    };

    /**
     * 显示底部工具栏
     */
    WeixinApi.showToolbar = function () {
        WeixinJSBridge.call('showToolbar');
    };

    /**
     * 隐藏底部工具栏
     */
    WeixinApi.hideToolbar = function () {
        WeixinJSBridge.call('hideToolbar');
    };

    /**
     * 返回如下几种类型：
     *
     * network_type:wifi     wifi网络
     * network_type:edge     非wifi,包含3G/2G
     * network_type:fail     网络断开连接
     * network_type:wwan     2g或者3g
     *
     * 使用方法：
     * WeixinApi.getNetworkType(function(networkType){
     *
     * });
     *
     * @param callback
     */
    WeixinApi.getNetworkType = function (callback) {
        if (callback && typeof callback == 'function') {
            WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
                // 在这里拿到e.err_msg，这里面就包含了所有的网络类型
                callback(e.err_msg);
            });
        }
    };

    /**
     * 关闭当前微信公众平台页面
     * @param       {Object}    callbacks       回调方法
     * @p-config    {Function}  fail(resp)      失败
     * @p-config    {Function}  success(resp)   成功
     */
    WeixinApi.closeWindow = function (callbacks) {
        callbacks = callbacks || {};
        WeixinJSBridge.invoke("closeWindow", {}, function (resp) {
            switch (resp.err_msg) {
                // 关闭成功
                case 'close_window:ok':
                    callbacks.success && callbacks.success(resp);
                    break;

                // 关闭失败
                default :
                    callbacks.fail && callbacks.fail(resp);
                    break;
            }
        });
    };

    /**
     * 当页面加载完毕后执行，使用方法：
     * WeixinApi.ready(function(Api){
     *     // 从这里只用Api即是WeixinApi
     * });
     * @param readyCallback
     */
    WeixinApi.ready = function (readyCallback) {
        if (readyCallback && typeof readyCallback == 'function') {
            var Api = this;
            var wxReadyFunc = function () {
                readyCallback(Api);
            };
            if (typeof window.WeixinJSBridge == "undefined") {
                if (document.addEventListener) {
                    document.addEventListener('WeixinJSBridgeReady', wxReadyFunc, false);
                } else if (document.attachEvent) {
                    document.attachEvent('WeixinJSBridgeReady', wxReadyFunc);
                    document.attachEvent('onWeixinJSBridgeReady', wxReadyFunc);
                }
            } else {
                wxReadyFunc();
            }
        }
    };

    /**
     * 判断当前网页是否在微信内置浏览器中打开
     */
    WeixinApi.openInWeixin = function () {
        return /MicroMessenger/i.test(navigator.userAgent);
    };

    /*
     * 打开扫描二维码
     * @param       {Object}    callbacks       回调方法
     * @p-config    {Boolean}   needResult      是否直接获取分享后的内容
     * @p-config    {String}    desc            扫描二维码时的描述
     * @p-config    {Function}  fail(resp)      失败
     * @p-config    {Function}  success(resp)   成功
     */
    WeixinApi.scanQRCode = function (callbacks) {
        callbacks = callbacks || {};
        WeixinJSBridge.invoke("scanQRCode", {
            needResult: callbacks.needResult ? 1 : 0,
            desc: callbacks.desc || 'WeixinApi Desc'
        }, function (resp) {
            switch (resp.err_msg) {
                // 打开扫描器成功
                case 'scanQRCode:ok':
                case 'scan_qrcode:ok':
                    callbacks.success && callbacks.success(resp);
                    break;

                // 打开扫描器失败
                default :
                    callbacks.fail && callbacks.fail(resp);
                    break;
            }
        });
    };

    /**
     * 检测应用程序是否已安装
     *         by mingcheng 2014-10-17
     *
     * @param       {Object}    data               应用程序的信息
     * @p-config    {String}    packageUrl      应用注册的自定义前缀，如 xxx:// 就取 xxx
     * @p-config    {String}    packageName        应用的包名
     *
     * @param       {Object}    callbacks       相关回调方法
     * @p-config    {Function}  fail(resp)      失败
     * @p-config    {Function}  success(resp)   成功，如果有对应的版本信息，则写入到 resp.version 中
     * @p-config    {Function}  all(resp)       无论成功失败都会执行的回调
     */
    WeixinApi.getInstallState = function (data, callbacks) {
        callbacks = callbacks || {};

        WeixinJSBridge.invoke("getInstallState", {
            "packageUrl": data.packageUrl || "",
            "packageName": data.packageName || ""
        }, function (resp) {
            var msg = resp.err_msg, match = msg.match(/state:yes_?(.*)$/);
            if (match) {
                resp.version = match[1] || "";
                callbacks.success && callbacks.success(resp);
            } else {
                callbacks.fail && callbacks.fail(resp);
            }

            callbacks.all && callbacks.all(resp);
        });
    };

    /**
     * 发送邮件
     * @param       {Object}  data      邮件初始内容
     * @p-config    {String}  subject   邮件标题
     * @p-config    {String}  body      邮件正文
     *
     * @param       {Object}    callbacks       相关回调方法
     * @p-config    {Function}  fail(resp)      失败
     * @p-config    {Function}  success(resp)   成功
     * @p-config    {Function}  all(resp)       无论成功失败都会执行的回调
     */
    WeixinApi.sendEmail = function (data, callbacks) {
        callbacks = callbacks || {};
        WeixinJSBridge.invoke("sendEmail", {
            "title": data.subject,
            "content": data.body
        }, function (resp) {
            if (resp.err_msg === 'send_email:sent') {
                callbacks.success && callbacks.success(resp);
            } else {
                callbacks.fail && callbacks.fail(resp);
            }
            callbacks.all && callbacks.all(resp);
        })
    };

    /**
     * 开启Api的debug模式，比如出了个什么错误，能alert告诉你，而不是一直很苦逼的在想哪儿出问题了
     * @param    {Function}  callback(error) 出错后的回调，默认是alert
     */
    WeixinApi.enableDebugMode = function (callback) {
        /**
         * @param {String}  errorMessage   错误信息
         * @param {String}  scriptURI      出错的文件
         * @param {Long}    lineNumber     出错代码的行号
         * @param {Long}    columnNumber   出错代码的列号
         */
        window.onerror = function (errorMessage, scriptURI, lineNumber, columnNumber) {

            // 有callback的情况下，将错误信息传递到options.callback中
            if (typeof callback === 'function') {
                callback({
                    message: errorMessage,
                    script: scriptURI,
                    line: lineNumber,
                    column: columnNumber
                });
            } else {
                // 其他情况，都以alert方式直接提示错误信息
                var msgs = [];
                msgs.push("额，代码有错。。。");
                msgs.push("\n错误信息：", errorMessage);
                msgs.push("\n出错文件：", scriptURI);
                msgs.push("\n出错位置：", lineNumber + '行，' + columnNumber + '列');
                alert(msgs.join(''));
            }
        }
    };


    /**
     * 实在是没办法了，只能在微信内置的分享功能中加一个钩子，强行注入，并修改需要分享的内容
     * 注意，仅Android可用，并且也不支持async模式了，暂时先这么用着吧，各位亲，总比不能用要好
     */
    WeixinApi.hook = (function () {
        var _wxData;
        var _callbacks;

        /**
         * 开启WeixinApi的hook功能
         */
        var _enable = function (wxData, wxCallbacks) {
            _wxData = wxData;

            // 分享过程中的一些回调
            _callbacks = function (resp) {
                var callbacks = wxCallbacks || {};
                switch (true) {
                    // 用户取消
                    case /\:cancel$/i.test(resp.err_msg) :
                        callbacks.cancel && callbacks.cancel(resp);
                        break;
                    // 发送成功
                    case /\:(confirm|ok)$/i.test(resp.err_msg):
                        callbacks.confirm && callbacks.confirm(resp);
                        break;
                    // fail　发送失败
                    case /\:fail$/i.test(resp.err_msg) :
                    default:
                        callbacks.fail && callbacks.fail(resp);
                        break;
                }
                // 无论成功失败都会执行的回调
                callbacks.all && callbacks.all(resp);
            };
        };

        /**
         * 对内置的sendMessage加钩子
         * @param message
         */
        var _message = function (message) {
            var theData = _extend(message['__params'], _wxData);
            theData.img_url = theData.imgUrl || theData.img_url;
            delete theData.imgUrl;

            switch (message['__event_id']) {
                case 'menu:share:timeline':
                    var t = theData.title;
                    theData.title = theData.desc || t;
                    theData.desc = t || theData.desc;
                    message['__params'] = theData;
                    break;
                case 'menu:share:appmessage':
                case 'menu:share:qq':
                case 'menu:share:weiboApp':
                    message['__params'] = theData;
                    break;
            }
        };

        /**
         * 给各分享的回调方法加钩子
         * @param shareType
         * @param callback
         */
        var _callback = function (shareType, callback) {
            switch (shareType) {
                case 'sendAppMessage':
                case 'shareTimeline':
                case 'shareWeibo':
                    callback = !callback ? _callbacks : function (resp) {
                        callback(resp) && _callbacks(resp);
                    };
                    break;
            }
            return callback;
        };

        /**
         * iOS简单处理，直接修改页面title
         * @param wxData
         * @private
         */
        var _forIOS = function (wxData) {
            if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
                document.title = wxData.desc;
                var img = document.createElement('img');
                img.style.position = 'absolute';
                img.style.top = '-10000px';
                img.style.left = '-10000px';
                img.src = wxData.imgUrl;
                document.body.insertBefore(img, document.body.childNodes[0]);

                var params = {};
                location.search.substr(1).split('&').forEach(function (arg) {
                    var arr = arg.split('=');
                    params[arr[0]] = arr[1];
                });

                if (params.hasOwnProperty('from') && params.hasOwnProperty('isappinstalled')) {
                    window.location.href = wxData.link;
                }
            }
        };

        return {
            enable: _enable,
            message: _message,
            callbacks: _callback,
            forIOS: _forIOS
        };
    })();

})(window);


//     _WXJS.js
//     (c) 2010-2012 Thomas Fuchs
//     _WXJS.js may be freely distributed under the MIT license.

//     特别声明：by zxlie@github
//      这个js是官方提供，从Android apk中反编译得到，这里主要是在sendMessage方法中增加一个hook，
//      用以修改需要分享的内容；另外，此脚本仅提供Android使用。
//      脚本最终解释权归腾讯微信官方所有，有被禁用的风险，使用请谨慎！


var _wxjs602 = function () {
    // 内置浏览器中已经有了这个对象，直接使用，所以删除掉了一堆调用
    var _WXJS = window._WXJS;

    // UTF8
    var UTF8 = {

        // public method for url encoding
        encode: function (string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        },

        // public method for url decoding
        decode: function (utftext) {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;

            while (i < utftext.length) {

                c = utftext.charCodeAt(i);

                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                } else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }

            }

            return string;
        }

    };

    var HEX = {
        encode: function (str) {
            var r = "";
            var e = str.length;
            var c = 0;
            var h;
            while (c < e) {
                h = str.charCodeAt(c++).toString(16);
                while (h.length < 2) h = "0" + h;
                r += h;
            }
            return r.toUpperCase();
        },

        decode: function (str) {
            var r = "";
            var e = str.length;
            var s;
            while (e >= 0) {
                s = e - 2;
                r = String.fromCharCode("0x" + str.substring(s, e)) + r;
                e = s;
            }
            return r;
        }
    };

    var JSON;
    if (!JSON) {
        JSON = {};
    }

    (function () {
        'use strict';

        function f(n) {
            // Format integers to have at least two digits.
            return n < 10 ? '0' + n : n;
        }

        if (typeof Date.prototype.toJSON !== 'function') {

            Date.prototype.toJSON = function (key) {

                return isFinite(this.valueOf()) ? this.getUTCFullYear() + '-' + f(this.getUTCMonth() + 1) + '-' + f(this.getUTCDate()) + 'T' + f(this.getUTCHours()) + ':' + f(this.getUTCMinutes()) + ':' + f(this.getUTCSeconds()) + 'Z' : null;
            };

            String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
        }

        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            gap, indent, meta = { // table of character substitutions
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"': '\\"',
                '\\': '\\\\'
            },
            rep;


        function quote(string) {

            // If the string contains no control characters, no quote characters, and no
            // backslash characters, then we can safely slap some quotes around it.
            // Otherwise we must also replace the offending characters with safe escape
            // sequences.
            escapable.lastIndex = 0;
            return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + string + '"';
        }


        function str(key, holder) {

            // Produce a string from holder[key].
            var i, // The loop counter.
                k, // The member key.
                v, // The member value.
                length, mind = gap,
                partial, value = holder[key];

            // 有些网站如youku.com会重载了toJSON这个函数，然后返回了json转义的串，然后我们再转一次的时候就悲剧了。所以需要注掉下面这个逻辑。
            // Douglas Crockford一开始为什么要加这么个sb逻辑呢。 既然加了，那用了别人的方法应该直接return啊。又转一次那不是sb了吗？？？坑啊。

            // If the value has a toJSON method, call it to obtain a replacement value.           
            // if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
            //     value = value.toJSON(key);
            // }

            // If we were called with a replacer function, then call the replacer to
            // obtain a replacement value.
            if (typeof rep === 'function') {
                value = rep.call(holder, key, value);
            }

            // What happens next depends on the value's type.
            switch (typeof value) {
                case 'string':
                    return quote(value);

                case 'number':

                    // JSON numbers must be finite. Encode non-finite numbers as null.
                    return isFinite(value) ? String(value) : 'null';

                case 'boolean':
                case 'null':

                    // If the value is a boolean or null, convert it to a string. Note:
                    // typeof null does not produce 'null'. The case is included here in
                    // the remote chance that this gets fixed someday.
                    return String(value);

                // If the type is 'object', we might be dealing with an object or an array or
                // null.
                case 'object':

                    // Due to a specification blunder in ECMAScript, typeof null is 'object',
                    // so watch out for that case.
                    if (!value) {
                        return 'null';
                    }

                    // Make an array to hold the partial results of stringifying this object value.
                    gap += indent;
                    partial = [];

                    // Is the value an array?
                    if (Object.prototype.toString.apply(value) === '[object Array]') {

                        // The value is an array. Stringify every element. Use null as a placeholder
                        // for non-JSON values.
                        length = value.length;
                        for (i = 0; i < length; i += 1) {
                            partial[i] = str(i, value) || 'null';
                        }

                        // Join all of the elements together, separated with commas, and wrap them in
                        // brackets.
                        v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                        gap = mind;
                        return v;
                    }

                    // If the replacer is an array, use it to select the members to be stringified.
                    if (rep && typeof rep === 'object') {
                        length = rep.length;
                        for (i = 0; i < length; i += 1) {
                            if (typeof rep[i] === 'string') {
                                k = rep[i];
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                }
                            }
                        }
                    } else {

                        // Otherwise, iterate through all of the keys in the object.
                        for (k in value) {
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                }
                            }
                        }
                    }

                    // Join all of the member texts together, separated with commas,
                    // and wrap them in braces.
                    v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
                    gap = mind;
                    return v;
            }
        }

        // If the JSON object does not yet have a stringify method, give it one.
        if (typeof JSON.stringify !== 'function') {
            JSON.stringify = function (value, replacer, space) {

                // The stringify method takes a value and an optional replacer, and an optional
                // space parameter, and returns a JSON text. The replacer can be a function
                // that can replace values, or an array of strings that will select the keys.
                // A default replacer method can be provided. Use of the space parameter can
                // produce text that is more easily readable.
                var i;
                gap = '';
                indent = '';

                // If the space parameter is a number, make an indent string containing that
                // many spaces.
                if (typeof space === 'number') {
                    for (i = 0; i < space; i += 1) {
                        indent += ' ';
                    }

                    // If the space parameter is a string, it will be used as the indent string.
                } else if (typeof space === 'string') {
                    indent = space;
                }

                // If there is a replacer, it must be a function or an array.
                // Otherwise, throw an error.
                rep = replacer;
                if (replacer && typeof replacer !== 'function' && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
                    throw new Error('JSON.stringify');
                }

                // Make a fake root object containing our value under the key of ''.
                // Return the result of stringifying the value.
                return str('', {
                    '': value
                });
            };
        }


        // If the JSON object does not yet have a parse method, give it one.
        if (typeof JSON.parse !== 'function') {
            JSON.parse = function (text, reviver) {

                // The parse method takes a text and an optional reviver function, and returns
                // a JavaScript value if the text is a valid JSON text.
                var j;

                function walk(holder, key) {

                    // The walk method is used to recursively walk the resulting structure so
                    // that modifications can be made.
                    var k, v, value = holder[key];
                    if (value && typeof value === 'object') {
                        for (k in value) {
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
                                v = walk(value, k);
                                if (v !== undefined) {
                                    value[k] = v;
                                } else {
                                    delete value[k];
                                }
                            }
                        }
                    }
                    return reviver.call(holder, key, value);
                }


                // Parsing happens in four stages. In the first stage, we replace certain
                // Unicode characters with escape sequences. JavaScript handles many characters
                // incorrectly, either silently deleting them, or treating them as line endings.
                text = String(text);
                cx.lastIndex = 0;
                if (cx.test(text)) {
                    text = text.replace(cx, function (a) {
                        return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                    });
                }

                // In the second stage, we run the text against regular expressions that look
                // for non-JSON patterns. We are especially concerned with '()' and 'new'
                // because they can cause invocation, and '=' because it can cause mutation.
                // But just to be safe, we want to reject all unexpected forms.
                // We split the second stage into 4 regexp operations in order to work around
                // crippling inefficiencies in IE's and Safari's regexp engines. First we
                // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
                // replace all simple value tokens with ']' characters. Third, we delete all
                // open brackets that follow a colon or comma or that begin the text. Finally,
                // we look to see that the remaining characters are only whitespace or ']' or
                // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.
                if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                    // In the third stage we use the eval function to compile the text into a
                    // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
                    // in JavaScript: it can begin a block or an object literal. We wrap the text
                    // in parens to eliminate the ambiguity.
                    j = eval('(' + text + ')');

                    // In the optional fourth stage, we recursively walk the new structure, passing
                    // each name/value pair to a reviver function for possible transformation.
                    return typeof reviver === 'function' ? walk({
                        '': j
                    }, '') : j;
                }

                // If the text is not JSON parseable, then a SyntaxError is thrown.
                throw new SyntaxError('JSON.parse');
            };
        }
    }());

    var base64encodechars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    function base64encode(str) {
        if (str === undefined) {
            return str;
        }

        var out, i, len;
        var c1, c2, c3;
        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                out += base64encodechars.charAt(c1 >> 2);
                out += base64encodechars.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
                out += base64encodechars.charAt(c1 >> 2);
                out += base64encodechars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
                out += base64encodechars.charAt((c2 & 0xf) << 2);
                out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += base64encodechars.charAt(c1 >> 2);
            out += base64encodechars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
            out += base64encodechars.charAt(((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6));
            out += base64encodechars.charAt(c3 & 0x3f);
        }
        return out;
    }

    var _readyMessageIframe, _sendMessageQueue = [],
        _receiveMessageQueue = [],
        _callback_count = 1000,
        _callback_map = {},
        _event_hook_map = {},
        _session_data = {},
        _MESSAGE_SEPERATOR = '__wxmsg_sep__',
        _CUSTOM_PROTOCOL_SCHEME = 'weixin',
        _MESSAGE_TYPE = '__msg_type',
        _CALLBACK_ID = '__callback_id',
        _EVENT_ID = '__event_id',
        _QUEUE_HAS_MESSAGE = 'dispatch_message/',
        _setResultIframe; // 用于替代addJavascriptInterface的替代方案，返回值通过修改该iframe src实现
    //创建ifram的准备队列

    var _runOn3rdApiList = [],     //可以在第三方网页上运行的api列表
        _event_hook_map_for3rd = {},  //第三方网页hook的事件表 'event' => callback
        _RUN_ON_3RD_APIS = '__runOn3rd_apis';

    function _createQueueReadyIframe(doc) {
        // _setResultIframe 的初始化
        _setResultIframe = doc.createElement('iframe');
        _setResultIframe.id = '__WeixinJSBridgeIframe_SetResult';
        _setResultIframe.style.display = 'none';
        doc.documentElement.appendChild(_setResultIframe);

        _readyMessageIframe = doc.createElement('iframe');
        _readyMessageIframe.id = '__WeixinJSBridgeIframe';
        _readyMessageIframe.style.display = 'none';
        doc.documentElement.appendChild(_readyMessageIframe);
        return _readyMessageIframe;
    }

    //将消息添加到发送队列，iframe的准备队列为weixin://dispatch_message/
    function _sendMessage(message) {
        _sendMessageQueue.push(message);
        _readyMessageIframe.src = _CUSTOM_PROTOCOL_SCHEME + '://' + _QUEUE_HAS_MESSAGE;

        // var ifm = _WXJS('iframe#__WeixinJSBridgeIframe')[0];
        // if (!ifm) {
        //   ifm = _createQueueReadyIframe(document);
        // }
        // ifm.src = _CUSTOM_PROTOCOL_SCHEME + '://' + _QUEUE_HAS_MESSAGE;
    };
    //取出队列中的消息，并清空接收队列
    function _fetchQueue() {
        var messageQueueString = JSON.stringify(_sendMessageQueue);
        _sendMessageQueue = [];
        //window.JsApi && JsApi.keep_setReturnValue && window.JsApi.keep_setReturnValue('SCENE_FETCHQUEUE', messageQueueString);
        _setResultValue('SCENE_FETCHQUEUE', messageQueueString);
        return messageQueueString;
    };

    function _handleMessageFromWeixin(message) {
        var msgWrap = message;

        switch (msgWrap[_MESSAGE_TYPE]) {
            case 'callback':
            {
                if (typeof msgWrap[_CALLBACK_ID] === 'string' && typeof _callback_map[msgWrap[_CALLBACK_ID]] === 'function') {
                    var ret = _callback_map[msgWrap[_CALLBACK_ID]](msgWrap['__params']);
                    delete _callback_map[msgWrap[_CALLBACK_ID]]; // can only call once
                    //window.JsApi && JsApi.keep_setReturnValue && window.JsApi.keep_setReturnValue('SCENE_HANDLEMSGFROMWX', JSON.stringify(ret));
                    _setResultValue('SCENE_HANDLEMSGFROMWX', JSON.stringify(ret));
                    return JSON.stringify(ret);
                }
                //window.JsApi && JsApi.keep_setReturnValue && window.JsApi.keep_setReturnValue('SCENE_HANDLEMSGFROMWX', JSON.stringify({'__err_code':'cb404'}));
                _setResultValue('SCENE_HANDLEMSGFROMWX', JSON.stringify({'__err_code': 'cb404'}));
                return JSON.stringify({'__err_code': 'cb404'});
            }
                break;
            case 'event':
            {
                if (typeof message[_EVENT_ID] === 'string') {
                    if (typeof _event_hook_map_for3rd[message[_EVENT_ID]] === 'function' && _isIn3rdApiList(message[_EVENT_ID])) {
                        var ret = _event_hook_map_for3rd[message[_EVENT_ID]](message['__params']);
                        _setResultValue('SCENE_HANDLEMSGFROMWX', JSON.stringify(ret));
                        return JSON.stringify(ret);
                    } else if (typeof _event_hook_map[message[_EVENT_ID]] === 'function') {

                        // 用WeixinApi加一个钩子
                        window.WeixinApi && WeixinApi.hook.message(message);

                        //window.JsApi && JsApi.keep_setReturnValue && window.JsApi.keep_setReturnValue('SCENE_HANDLEMSGFROMWX', JSON.stringify(ret));
                        var ret = _event_hook_map[message[_EVENT_ID]](message['__params']);
                        _setResultValue('SCENE_HANDLEMSGFROMWX', JSON.stringify(ret));

                        return JSON.stringify(ret);
                    }

                }
                //window.JsApi && JsApi.keep_setReturnValue && window.JsApi.keep_setReturnValue('SCENE_HANDLEMSGFROMWX', JSON.stringify({'__err_code':'ev404'}));
                _setResultValue('SCENE_HANDLEMSGFROMWX', JSON.stringify({'__err_code': 'ev404'}));
                return JSON.stringify({'__err_code': 'ev404'});
            }
                break;
        }
    };

    function _setResultValue(scene, result) {
        if (result === undefined) {
            result = 'dummy';
        }
        _setResultIframe.src = 'weixin://private/setresult/' + scene + '&' + base64encode(UTF8.encode(result));
        //_setResultIframe.src = 'weixin://private/setresult/' + scene + '&' + window.btoa(result);
    }

    function _isIn3rdApiList(event) {
        var r = _runOn3rdApiList.some(function (x) {
            return x === event;
        });
        _log('_isIn3rdApiList , event : ' + event + " , result : " + r);
        return r;
    }

    function _env(key) {
        return _session_data[key];
    }

    function _log(fmt) {
        var argv = [];
        for (var i = 0; i < arguments.length; i++) {
            argv.push(arguments[i]);
        }
        var fm = argv.shift();
        var msg;
        msg = fmt;
        _call('log', {'msg': msg});
    }

    function _call(func, params, callback) {
        if (!func || typeof func !== 'string') {
            return;
        }
        if (typeof params !== 'object') {
            params = {};
        }

        var callbackID = (_callback_count++).toString();

        // 给callback也加一个hook，方便处理回调
        callback = window.WeixinApi && WeixinApi.hook.callbacks(func, callback);

        if (typeof callback === 'function') {
            _callback_map[callbackID] = callback;
        }

        var msgObj = {'func': func, 'params': params};
        msgObj[_MESSAGE_TYPE] = 'call';
        msgObj[_CALLBACK_ID] = callbackID;

        _sendMessage(JSON.stringify(msgObj));
    }

    function _on(event, callback) {
        if (!event || typeof event !== 'string') {
            return;
        }
        ;

        if (typeof callback !== 'function') {
            return;
        }

        _event_hook_map[event] = callback;
    }

    function _onfor3rd(event, callback) {
        if (!event || typeof event !== 'string') {
            return;
        }
        if (typeof callback !== 'function') {
            return;
        }
        _event_hook_map_for3rd[event] = callback;
    }

    function _emit(event, argv) {
        if (typeof _event_hook_map[event] !== 'function') {
            return;
        }

        if (_isIn3rdApiList(event)) {
            _event_hook_map_for3rd[event](argv);
        } else {
            _event_hook_map[event](argv);
        }
    }

    function _enable_old_UrlStyleImagePreviews() {
        var old_prefix = "weixin://viewimage/";
        _WXJS('a[href^="weixin://viewimage/"]').on('click', function (e) {
            var cur = '';
            var link;
            if (typeof e.target.href === 'string' && e.target.href.search(old_prefix) === 0) {
                link = e.target;
            } else {
                link = _WXJS(e.target).parents('a[href^="weixin://viewimage/"]')[0];
            }
            cur = link.href.substr(old_prefix.length);
            var allLinks = _WXJS('a[href^="weixin://viewimage/"]');
            var allUrls = [];
            for (var i = 0; i < allLinks.length; i++) {
                allUrls.push(allLinks[i].href.substr(old_prefix.length));
            }
            _call('imagePreview', {'urls': allUrls, 'current': cur});

            e.preventDefault();
        });
    }

    function _enable_old_ReaderShareUrls() {
        var old_prefix = "weixin://readershare/";
        _WXJS('a[href^="weixin://readershare/"]').on('click', function (e) {
            e.preventDefault();

            _emit('menu:share:weibo', _session_data.shareWeiboData || {});
        });
        _WXJS('a[href^="weixin://readertimeline/"]').on('click', function (e) {
            e.preventDefault();

            _emit('menu:share:timeline', _session_data.shareTimelineData || {});
        });
    }

    function _enable_hashChangeNotify() {
        _WXJS(window).bind('hashchange', function () {
            _call('hashChange', {'hash': window.location.hash});
        });
    }

    function _setDefaultEventHandlers() {
        // set font
        _on('menu:setfont', function (argv) {
            if (typeof changefont === 'function') {
                var num = parseInt(argv.fontSize);
                _log('set font size with changefont: %s', argv.fontSize);
                changefont(num);
                return;
            }

            // fallback
            var s;
            switch (argv.fontSize) {
                case '1':
                    s = '80%';
                    break;
                case '2':
                    s = '100%';
                    break;
                case '3':
                    s = '120%';
                    break;
                case '4':
                    s = '140%';
                    break;
                default :
                    return;
            }
            _log('set font size with webkitTextSizeAdjust: %s', argv.fontSize);

            // document.getElementsByTagName('body')[0].style.webkitTextSizeAdjust = s;
            // android机器上调用该方法不生效，改为回调到java层，用webview的api实现setFontSize
            _call('setFontSizeCallback', {"fontSize": argv.fontSize});
        });

        // 获取页面图片算法：
        // 在页面中找到第一个最小边大于290的图片，如果1秒内找不到，则返回空（不带图分享）。
        var getSharePreviewImage = function (cb) {

            var isCalled = false;

            var callCB = function (_img) {
                if (isCalled) {
                    return;
                }
                ;
                isCalled = true;

                cb(_img);
            }

            var _allImgs = _WXJS('img');
            if (_allImgs.length == 0) {
                return callCB();
            }

            // 过滤掉重复的图片
            var _srcs = {};
            var allImgs = [];
            for (var i = 0; i < _allImgs.length; i++) {
                var _img = _allImgs[i];

                // 过滤掉不可以见的图片
                if (_WXJS(_img).css('display') == 'none' || _WXJS(_img).css('visibility') == 'hidden') {
                    // _log('ivisable image !! ' + _img.src);
                    continue;
                }

                if (_srcs[_img.src]) {
                    // added
                } else {
                    _srcs[_img.src] = 1; // mark added
                    allImgs.push(_img);
                }
            }
            ;

            var results = [];

            var img;
            for (var i = 0; i < allImgs.length && i < 100; i++) {
                img = allImgs[i];

                var newImg = new Image();
                newImg.onload = function () {
                    this.isLoaded = true;
                    var loadedCount = 0;
                    for (var j = 0; j < results.length; j++) {
                        var res = results[j];
                        if (!res.isLoaded) {
                            break;
                        }
                        loadedCount++;
                        if (res.width > 290 && res.height > 290) {
                            callCB(res);
                            break;
                        }
                    }
                    if (loadedCount == results.length) {
                        // 全部都已经加载完了，但还是没有找到。
                        callCB();
                    }
                    ;
                }
                newImg.src = img.src;
                results.push(newImg);
            }

            setTimeout(function () {
                for (var j = 0; j < results.length; j++) {
                    var res = results[j];
                    if (!res.isLoaded) {
                        continue;
                    }
                    if (res.width > 290 && res.height > 290) {
                        callCB(res);
                        return;
                    }
                }
                callCB();
            }, 1000);
        }

        // share timeline
        _on('menu:share:timeline', function (argv) {
            _log('share timeline');

            var data;
            if (typeof argv.title === 'string') {
                data = argv;
                _call('shareTimeline', data);
            } else {
                data = {
                    // "img_url": "",
                    // "img_width": "",
                    // "img_height": "",
                    "link": document.documentURI || _session_data.init_url,
                    "desc": document.documentURI || _session_data.init_url,
                    "title": document.title
                };

                var shareFunc = function (_img) {
                    if (_img) {
                        data['img_url'] = _img.src;
                        data['img_width'] = _img.width;
                        data['img_height'] = _img.height;
                    }

                    _call('shareTimeline', data);
                };

                getSharePreviewImage(shareFunc);
            }
        });

        // share qq
        _on('menu:share:qq', function (argv) {
            _log('share QQ');

            var data;
            if (typeof argv.title === 'string') {
                data = argv;
                _call('shareQQ', data);
            } else {
                data = {
                    "link": document.documentURI || _session_data.init_url,
                    "desc": document.documentURI || _session_data.init_url,
                    "title": document.title
                };

                var shareFunc = function (_img) {
                    if (_img) {
                        data['img_url'] = _img.src;
                        data['img_width'] = _img.width;
                        data['img_height'] = _img.height;
                    }

                    _call('shareQQ', data);
                };

                getSharePreviewImage(shareFunc);
            }
        });

        // share weiboApp
        _on('menu:share:weiboApp', function (argv) {
            _log('share weibo');

            var data;
            if (typeof argv.content === 'string') {
                data = argv;
            } else {
                data = {
                    "link": document.documentURI || _session_data.short_url || _session_data.init_url,
                    "title": document.title,
                    "desc": document.title + ' ' + (document.documentURI || _session_data.short_url || _session_data.init_url)
                };

                var shareFunc = function (_img) {
                    if (_img) {
                        data['img_url'] = _img.src;
                        data['img_width'] = _img.width;
                        data['img_height'] = _img.height;
                    }

                    _call('shareWeiboApp', data);
                };

                getSharePreviewImage(shareFunc);
            }
        });

        // share with app message
        _on('menu:share:appmessage', function (argv) {
            _log('share appmessage');

            var data;
            if (typeof argv.title === 'string') {
                data = argv;
                _call('sendAppMessage', data);
            } else {
                data = {
                    // "appid" : ""
                    // "img_url": "",
                    // "img_width": "",
                    // "img_height": "",
                    "link": document.documentURI || _session_data.init_url,
                    "desc": document.documentURI || _session_data.init_url,
                    "title": document.title
                };

                var shareFunc = function (_img) {
                    if (_img) {
                        data['img_url'] = _img.src;
                        data['img_width'] = _img.width;
                        data['img_height'] = _img.height;
                    }

                    _call('sendAppMessage', data);
                };

                getSharePreviewImage(shareFunc);
            }
        });

        // send mail
        _on('menu:share:email', function (argv) {
            _log('send email');

            var data;
            if (typeof argv.title === 'string') {
                data = argv;
                _call('sendEmail', data);
            } else {
                data = {
                    "content": document.documentURI || _session_data.init_url,
                    "title": document.title
                };
                _call('sendEmail', data);
            }
        });

        // the first event
        _on('sys:init', function (ses) {
            // 避免由于Java层多次发起init请求，造成网页端多次收到WeixinJSBridgeReady事件
            if (window.WeixinJSBridge._hasInit) {
                _log('hasInit, no need to init again');
                return;
            }

            window.WeixinJSBridge._hasInit = true;

            _session_data = ses;

            // bridge ready
            var readyEvent = doc.createEvent('Events');
            readyEvent.initEvent('WeixinJSBridgeReady');
            doc.dispatchEvent(readyEvent);
        });

        _on('sys:bridged', function (ses) {
            // 避免由于Java层多次发起init请求，造成网页端多次收到WeixinJSBridgeReady事件
            if (window.WeixinJSBridge._hasInit) {
                return;
            }

            // _log(_env('version'));
            // _log(_env('language'));
            // _log(_env('timezone'));
            // _log(_env('cpu'));
            // _log(_env('model'));
            if (_env('webview_type') === '1') {
                _emit('menu:setfont', {'fontSize': _env('init_font_size')});
            }

            try {
                _enable_old_UrlStyleImagePreviews();
                _enable_old_ReaderShareUrls();
                _enable_hashChangeNotify();
            } catch (e) {
                _log('error %s', e);
            }

        });

        _on('sys:attach_runOn3rd_apis', function (ses) {
            if (typeof ses[_RUN_ON_3RD_APIS] === 'object') {
                _runOn3rdApiList = ses[_RUN_ON_3RD_APIS];
                _log('_runOn3rdApiList : ' + _runOn3rdApiList);
            }
        });
    }

    function _test_start() {
        _emit('sys:init', {});
        _emit('sys:bridged', {});
    }

    var __WeixinJSBridge = {
        // public
        invoke: _call,
        call: _call,
        on: _onfor3rd,
        env: _env,
        log: _log,
        // private
        // _test_start:_test_start,
        _fetchQueue: _fetchQueue,
        _handleMessageFromWeixin: _handleMessageFromWeixin,
        _hasInit: false
    };

    if (window.WeixinJSBridge) {
        _WXJS.extend(window.WeixinJSBridge, __WeixinJSBridge);
    } else {
        window.WeixinJSBridge = __WeixinJSBridge;
    }

    var doc = document;
    _createQueueReadyIframe(doc);
    _setDefaultEventHandlers();

};

// 防止这个脚本执行出错，影响到页面正常功能，所以try-catch一下
(function () {
    try {
        // 仅android中生效，防止官方开放以后，对ios造成误伤
        if (/android/i.test(navigator.userAgent)) {
            _wxjs602();
        }
    } catch (e) {
    }
})();