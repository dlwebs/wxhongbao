<?php
namespace Home\Controller;

use Com\Wechat;

class WeixinController extends BaseController {

    private $_token;

    private $_wechat;

    public function indexAction() {
        $this->_token = I('get.token');

        $weixin = M('weixin');
        $wxinfo = $weixin->where('weixin_token = "'.$this->_token.'"')->find();
        if(!$wxinfo){
            exit('error token');
        }
        session('app_id', $wxinfo['weixin_appid']);
        session('app_secret', $wxinfo['weixin_appsecret']);

        $this->_wechat = new Wechat($this->_token);
        $data = $this->_wechat->request();
        $RX_TYPE = trim($data['MsgType']);

        $receiveEvent = array('subscribe', 'unsubscribe');
        $RX_EVENT = trim($data['Event']);
//        if (!in_array($RX_EVENT, $receiveEvent)) {
            $postStr = $GLOBALS["HTTP_RAW_POST_DATA"];
            $ch = curl_init($wxinfo['weixin_dispatchurl']);
            curl_setopt($ch, CURLOPT_MUTE, 1);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: text/xml'));
            curl_setopt($ch, CURLOPT_POSTFIELDS, $postStr);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            $output = curl_exec($ch);
            curl_close($ch);
            echo $output ;
            exit;
//        }
        
        switch($RX_TYPE){
            case Wechat::MSG_TYPE_TEXT:
                $result = $this->receiveText($data);
                break;
            case Wechat::MSG_TYPE_EVENT:
                $result = $this->receiveEvent($data);
                break;
            default:
                $this->valid();
                break;
        }
        $this->_wechat->response($result);
    }

    public function valid() {
        $echoStr = $_GET["echostr"];
        if($this->checkSignature()){
            echo $echoStr;
            exit;
        }
    }

    private function checkSignature() {
        $signature = $_GET["signature"];
        $timestamp = $_GET["timestamp"];
        $nonce = $_GET["nonce"];

        $token = $this->_token;
        $tmpArr = array($token, $timestamp, $nonce);
        // use SORT_STRING rule
        sort($tmpArr, SORT_STRING);
        $tmpStr = implode( $tmpArr );
        $tmpStr = sha1( $tmpStr );

        if( $tmpStr == $signature ){
            return true;
        }else{
            return false;
        }
    }

    public function receiveText($data){
        $post = array('fromUserName'=>(string)$data['FromUserName'], 'toUserName'=>$this->_token/*(string)$data['ToUserName']*/, 'content'=>(string)$data['Content']);
        if ($post['content'] == '红包') {
            $this->_wechat->replyNews(
                array("红包","红包","http://".$_SERVER['SERVER_NAME']."/index.php/index/index?parentid=".$post['fromUserName'], '')
            );
        } else {
            return '未知指令';
        }
    }

    public function receiveEvent($data) {
        $fromUserName = (string)$data['FromUserName'];//用户微信token
        $toUserName = $this->_token;//(string)$data[ToUserName]微信公众号
        $eventType = (string)$data['Event'];//subscribe(订阅)、unsubscribe(取消订阅)
        $userobj = M('user');
        
        $appid = session('app_id');
        $appsecret = session('app_secret');
        $access_token = $_SESSION['access_token'];
        if (!$access_token) {
            $token_url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='.$appid.'&secret='.$appsecret;
            $token_result = json_decode(file_get_contents($token_url), true);
            $access_token = $token_result['access_token'];
            $_SESSION['access_token'] = $access_token;
        }
        $userinfo_url = 'https://api.weixin.qq.com/cgi-bin/user/info?access_token='.$access_token.'&openid='.$fromUserName.'&lang=zh_CN';
        $json_content = file_get_contents($userinfo_url);
        $json_obj = json_decode($json_content, true);

        $insert['user_id'] = $fromUserName;
        if ($eventType == 'subscribe') {
            $insert['user_status'] = '1';
        } else {
            $insert['user_status'] = '0';
        }
        $userInfo = $userobj->getUserByIdWeixin($insert['user_id'], $toUserName);
        if ($userInfo) {
            $userobj->where('user_id = "'.$insert['user_id'].'" and user_weixin = "'.$toUserName.'"')->setField('user_status', $insert['user_status']);
        } else {
            $insert['user_name'] = $json_obj['nickname'];
            $insert['user_regdate'] = date('Y-m-d H:i:s');
            $insert['user_weixin'] = $toUserName;
            $insert['user_image'] = $json_obj['headimgurl'];
            $insert['user_money'] = 0;
            $insert['user_module'] = 'hongbao';
            $userobj->add($insert);
        }
        return '关注成功';
    }
}