;(function(window, $) {
    var regexs = {
        // 匹配 max_length(12) => ["max_length",12]
        rule: /^(.+?)\((.+)\)$/,
        // 数字
        numericRegex: /^[0-9]+$/,
        /**
         * @descrition:邮箱规则
         * 1.邮箱以a-z、A-Z、0-9开头，最小长度为1.
         * 2.如果左侧部分包含-、_、.则这些特殊符号的前面必须包一位数字或字母。
         * 3.@符号是必填项
         * 4.右则部分可分为两部分，第一部分为邮件提供商域名地址，第二部分为域名后缀，现已知的最短为2位。最长的为6为。
         * 5.邮件提供商域可以包含特殊字符-、_、.
         */
        email: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
        /**
         * [ip ipv4、ipv6]
         * "192.168.0.0"
         * "192.168.2.3.1.1"
         * "235.168.2.1"
         * "192.168.254.10"
         * "192.168.254.10.1.1"
         */
        ip: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])((\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}|(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){5})$/,
        /**
         * @descrition:判断输入的参数是否是个合格的固定电话号码。
         * 待验证的固定电话号码。
         * 国家代码(2到3位)-区号(2到3位)-电话号码(7到8位)-分机号(3位)
         **/
        fax: /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/,
        /**
         *@descrition:手机号码段规则
         * 13段：130、131、132、133、134、135、136、137、138、139
         * 14段：145、147
         * 15段：150、151、152、153、155、156、157、158、159
         * 17段：170、176、177、178
         * 18段：180、181、182、183、184、185、186、187、188、189
         * 国际码 如：中国(+86)
         */
        phone: /^((\+?[0-9]{1,4})|(\(\+86\)))?(13[0-9]|14[57]|15[012356789]|17[03678]|18[0-9])\d{8}$/,
        /**
         * @descrition 匹配 URL
         */
        url: /[a-zA-z]+:\/\/[^\s]/
    };
    var element = [];
    var fbOptions = [];
    var fbFun = function(args) {
        if (typeof(args) == 'string') {
            element = [];
            element.push($(args)); //储存节点
            return new fbFun();
        }
    };
    //获取参数
    fbFun.GetString = function(options){
        var defaults = {
            name: ''
        };
        var param = $.extend(defaults, options || {});
        var reg = new RegExp("(^|&)" + param.name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    };
    //全屏加载动画
    fbFun.loading = function(options) {
        var defaults = {
            flag: true,
        };
        var param = $.extend(defaults, options || {});
        if (param.flag) {
            //增加动画
            $(".bigloading").remove();
            $("body").append('<div class="bigloading"></div>');
        } else {
            //删除动画
            $(".bigloading").remove();
        }
    };
    //获取字符串长度（汉字算1个字符，字母数字算半个）
    fbFun.getByteLen = function(options) {
        var defaults = {
            value: ''
        };
        var param = $.extend(defaults, options || {});

        var len = 0;
        for (var i = 0; i < param.value.length; i++) {
            var a = val.charAt(i);
            if (a.match(/[^\x00-\xff]/ig) != null) {
                len += 1;
            } else {
                len += 0.5;
            }
        }
        return Math.round(len);
    }
    //判断是否在微信浏览器、
    fbFun.is_weixn = function() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    }
    //打开遮罩
    fbFun.fbMask = function(flag){
        if(flag){
            $(".fb-mask").remove();
            $("body").append("<div class='fb-mask'></div>");
        }else{
            $(".fb-mask").remove();
        }
    }

        window.$F = window.fbFun = fbFun;
})(window, $);
//返回上一页
function returnUp() {
    window.history.go(-1);
    // window.history.back(-1);
}

function replaceLocation(URL) {
    window.location.replace(URL);
}


//去除换行
function removeBr(obj) {
    return obj.replace(/(\n)+|(\r\n)+/g, "");
}
//微信注入
function fb_config() {
    $.getJSON(locahost + 'wechat/getConfig', {
        "url": location.href
    }, function(data) {
        if (data.code == 200) {
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: data.data.appId, // 必填，公众号的唯一标识
                timestamp: data.data.timestamp, // 必填，生成签名的时间戳
                nonceStr: data.data.nonceStr, // 必填，生成签名的随机串
                signature: data.data.signature, // 必填，签名，见附录1
                jsApiList: ["onMenuShareAppMessage", "onMenuShareTimeline", "openAddress", "scanQRCode"], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                // url:decodeURIComponent(data.data.url)
            });
        }
    })
}
$(function() {
    try {
        if (wx && is_weixn()) {
            fb_config();
        }
    } catch (e) {}
})
//微信注入