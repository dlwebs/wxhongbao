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

//        $receiveType = array('text', 'image');
//        $receiveEvent = array('subscribe', 'unsubscribe');
//        if (!in_array($RX_TYPE, $receiveType)) {
//            $RX_EVENT = trim($data['Event']);
//            if (!in_array($RX_EVENT, $receiveEvent)) {
//                $ch = curl_init($wxinfo['weixin_dispatchurl']);
//                curl_setopt($ch, CURLOPT_MUTE, 1);
//                curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
//                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
//                curl_setopt($ch, CURLOPT_POST, 1);
//                curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: text/xml'));
//                curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
//                curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
//                $output = curl_exec($ch);
//                curl_close($ch);
//                echo $output ;
//                exit;
//            }
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
        $userobj = new \Admin\Model\UserModel();
        $insert['user_id'] = $fromUserName;
        $insert['user_follow'] = $eventType;
        $userInfo = $userobj->getUserByIdWeixin($insert['user_id'], $toUserName);
        if ($userInfo) {
            $userobj->where('user_id = "'.$insert['user_id'].'" and user_weixin = "'.$toUserName.'"')->setField('user_follow', $insert['user_follow']);
        } else {
            $insert['user_regdate'] = date('Y-m-d H:i:s');
            $insert['user_weixin'] = $toUserName;
            $insert['user_name'] = '普通微信用户';
            $userobj->add($insert);
        }
        return '关注成功';
    }
}