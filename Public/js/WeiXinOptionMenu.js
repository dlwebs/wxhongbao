function WxShowOptionMenu(){
    WeixinJSBridge.call('showOptionMenu');
}

if (typeof WeixinJSBridge == "undefined"){
    if( document.addEventListener ){
        document.addEventListener('WeixinJSBridgeReady', WxShowOptionMenu, false);
    }else if (document.attachEvent){
        document.attachEvent('WeixinJSBridgeReady', WxShowOptionMenu); 
        document.attachEvent('onWeixinJSBridgeReady', WxShowOptionMenu);
    }
}else{
    WxShowOptionMenu();
}