<?php

define("TOKEN", "weishi");
define("APPID", "wx746191c3d2d0ebd7");
define("APPSECRET", "a4e835f6b20748fba46a827017cc835a");
$wxObj = new weixin();
$wxObj->responseMsg();

class weixin {

    public function valid() {
        $echoStr = $_GET["echostr"];
        if ($this->checkSignature()) {
            echo $echoStr;
            exit;
        }
    }

    public function responseMsg() {
        $postStr = $GLOBALS["HTTP_RAW_POST_DATA"];
        if (!empty($postStr)){
            $postObj = simplexml_load_string($postStr, 'SimpleXMLElement', LIBXML_NOCDATA);
            $RX_TYPE = trim($postObj->MsgType);
            //消息类型分离
            switch ($RX_TYPE)
            {
            case "event":
            $result = $this->receiveEvent($postObj);
            break;
            default:
            $result = "unknown msg type: ".$RX_TYPE;
            break;
            }
            echo $result;
        }else {
            echo "";
            exit;
        }
    }
    
    //接收事件消息
    private function receiveEvent($object)  {
       $result = $this->transmitNews($object);
        return $result;
    }
    
    //回复图文消息
    private function transmitNews($object) {
        $itemTpl = " <item>
        <Title><![CDATA[%s]]></Title>
        <Description><![CDATA[%s]]></Description>
        <PicUrl><![CDATA[%s]]></PicUrl>
        <Url><![CDATA[%s]]></Url>
        </item>
        ";
        if ($object->EventKey == 'ws_zjcs') {
            $item_str = sprintf($itemTpl, '最近吃啥', '最近吃啥', '', $_SERVER['SERVER_NAME'].'/index.php/weixin/'.$object->FromUserName.'/zjcs');
        } elseif ($object->EventKey == 'ws_jmhb') {
            $item_str = sprintf($itemTpl, '节目汇编', '节目汇编', '', $_SERVER['SERVER_NAME'].'/index.php/weixin/'.$object->FromUserName.'/index');
        } elseif ($object->EventKey == 'ws_jxsp') {
            $item_str = sprintf($itemTpl, '精选商品', '精选商品', '', $_SERVER['SERVER_NAME'].'/index.php/weixin/'.$object->FromUserName.'/jxsp');
        } elseif ($object->EventKey == 'ws_jxhd') {
            $jxhdresult = file_get_contents('http://'.$_SERVER['SERVER_NAME'].'/index.php/wx/getjxhd');
            $jxhdresult = json_decode($jxhdresult);
            $item_str = sprintf($itemTpl, $jxhdresult->jxhd_title, $jxhdresult->jxhd_desc, 'http://'.$_SERVER['SERVER_NAME'].'/upload/'.$jxhdresult->jxhd_image, $_SERVER['SERVER_NAME'].'/index.php/weixin/'.$object->FromUserName.'/jxhd');
        } elseif ($object->Event == 'subscribe' || $object->Event == 'unsubscribe') {
            if (!$_SESSION['access_token']) {
                $appid = APPID;
                $appsecret = APPSECRET;
                $access_token_url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='.$appid.'&secret='.$appsecret;
                $access_token_result = file_get_contents($access_token_url);
                $access_token_result = json_decode($access_token_result);
                $_SESSION['access_token'] = $access_token_result->access_token;
            }
            $fromUserName = (string)$object->FromUserName;
            $weixin_user_info_url = 'https://api.weixin.qq.com/cgi-bin/user/info?access_token='.$_SESSION['access_token'].'&openid='.$fromUserName.'&lang=zh_CN';
            $weixin_user_info_result = file_get_contents($weixin_user_info_url);
            $weixin_user_info_result = json_decode($weixin_user_info_result);

            $param = array('fromUserName'=>$fromUserName, 'nickname'=>(string)$weixin_user_info_result->nickname, 'headimgurl'=>(string)$weixin_user_info_result->headimgurl, 'eventType'=>(string)$object->Event);
            $url = $_SERVER['SERVER_NAME'].'/index.php/wx/event';

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($param));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_HEADER, 0);
            $item_str = curl_exec($ch);
            curl_close($ch);
            $item_str = sprintf($itemTpl, '欢迎关注伟诗味道', '欢迎大家来到伟诗的微信平台，我将在这里更好的和大家交流，为大家解决问题，希望我们成为好朋友，好哥们，伟诗和大家一起品味生活。', '', $_SERVER['SERVER_NAME'].'/index.php/weixin/'.$object->FromUserName.'/index');
        }
        
        $xmlTpl = "<xml>
        <ToUserName><![CDATA[%s]]></ToUserName>
        <FromUserName><![CDATA[%s]]></FromUserName>
        <CreateTime>%s</CreateTime>
        <MsgType><![CDATA[news]]></MsgType>
        <ArticleCount>%s</ArticleCount>
        <Articles>
        $item_str</Articles>
        </xml>";
        $result = sprintf($xmlTpl, $object->FromUserName, $object->ToUserName, time(), 1);
        return $result;
    }

    private function checkSignature() {
        $signature = $_GET["signature"];
        $timestamp = $_GET["timestamp"];
        $nonce = $_GET["nonce"];

        $token = TOKEN;
        $tmpArr = array($token, $timestamp, $nonce);
        sort($tmpArr, SORT_STRING);
        $tmpStr = implode( $tmpArr );
        $tmpStr = sha1( $tmpStr );

        if( $tmpStr == $signature ){
            return true;
        }else{
            return false;
        }
    }
}