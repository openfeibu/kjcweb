
//计算rem  100px = 1rem
;(function (doc, win,fs) {
  var docEl = doc.documentElement,
  resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
  function recalc() {
    var clientWidth = docEl.clientWidth;
    !clientWidth ? '' :  clientWidth>750 ? docEl.style.fontSize = 100 + 'px' : clientWidth<=750 ? docEl.style.fontSize = (clientWidth / 7.5) + 'px' : '';
  };
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

$(function(){
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if(isAndroid){
        $(".mine_header,.shopList .weui-navbar").css("background","#393a3f");
    }
})


var config = {
   apiUrl : "http://txhapi.feibu.info/"
}

// window.addEventListener('pageshow', function(e) {
//     // 通过persisted属性判断是否存在 BF Cache
//     if (e.persisted) {
//         location.reload();
//     }
// });


//微信注入
function fb_config(func){
   $.getJSON(locahost +'wechat/getConfig',{"url":location.href},function(data) {
        if(data.code == 200){
          wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: data.data.appId, // 必填，公众号的唯一标识
          timestamp:data.data.timestamp , // 必填，生成签名的时间戳
          nonceStr:data.data.nonceStr, // 必填，生成签名的随机串
          signature: data.data.signature,// 必填，签名，见附录1
          jsApiList: ["onMenuShareAppMessage","onMenuShareTimeline","openAddress","scanQRCode"],// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          // url:decodeURIComponent(data.data.url)
          if(func){
              func();
          }
        });
      }
    })
}

$(function(){
  try {
    if (wx && is_weixn()) {
       fb_config();
      }
    } catch (e) {
       
    }
})
//微信注入