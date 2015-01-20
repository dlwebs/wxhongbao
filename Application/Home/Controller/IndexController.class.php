<?php
namespace Home\Controller;

class IndexController extends BaseController {

    private $app_id = 'wxc43356a7940e32d4';

    private $app_secret = 'ec234926610a429dfaca36328af9b014';

    public function sendAction() {
        $userID = I('get.uid');
        $actionto = I('get.ac');
        $userobj = M('user');
        $userinfo = $userobj->field('user_id, user_name, user_regdate, user_image')->where('user_id = "'.$userID.'"')->find();
        if ($userinfo) {
            session('userinfo', $userinfo);
        } else {
            session('userinfo', array('user_id' => $userID, 'user_name'=>'访客'));
        }
        $this->redirect('index/'.$actionto);
    }
    
    public function gotoOauthAction() {
        $parent = I('get.parentid');
        $redirect_url = urlencode('http://'.$_SERVER['SERVER_NAME'].'/index.php/index/index?parentid='.$parent.'&from=singlemessage&isappinstalled=0');
        $gotourl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='.$this->app_id.'&redirect_uri='.$redirect_url.'&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
        redirect($gotourl);
    }

    public function indexAction() {
        $refresh_token = session('refresh_token');
        $parent = I('get.parentid');
        $code = I('get.code');
        if (!$refresh_token) {
            if (!$code) {
                $this->redirect('gotoOauth', array('parentid' => $parent));
            }
            $url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=".$this->app_id."&secret=".$this->app_secret."&code=".$code."&grant_type=authorization_code";
            $json_content = file_get_contents($url);
            $json_obj = json_decode($json_content, true);
            $access_token = $json_obj['access_token'];
            $openid = $json_obj['openid'];
            session(array('name'=>'access_token_id', 'expire'=>$json_obj['expires_in']));
            session('refresh_token', $json_obj['refresh_token']);
        }
        else {
            $url ="https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=".$this->app_id."&grant_type=refresh_token&refresh_token=".$refresh_token;
            $json_content = file_get_contents($url);
            $json_obj = json_decode($json_content, true);
            $access_token = $json_obj['access_token'];
            $openid = $json_obj['openid'];
        }

        $userinfostr = file_get_contents("https://api.weixin.qq.com/sns/userinfo?access_token=".$access_token."&openid=".$openid."&lang=zh_CN");
        $userinfo = json_decode($userinfostr, true);
        if (!$userinfo['openid']) {
            session('refresh_token', null);
            $this->redirect('gotoOauth', array('parentid' => $parent));
        }

        $money = M('money');
        $setting = M("setting");
        $user = M('user');
        $setinfo = $setting->where('set_id = 1')->find();
        $my_money_list = array();
        $totel_money = 0;
        if ($userinfo) {
            $wxuser = $user->where('user_id = "'.$userinfo['openid'].'"')->find();
            if (!$wxuser) {
                $data = array('user_id'=>$userinfo['openid'], 'user_name'=>$userinfo['nickname'], 'user_regdate'=>date('Y-m-d H:i:s'), 'user_image'=>$userinfo['headimgurl'], 'user_status'=>'1', 'user_money'=>0);
                $user_result = $user->add($data);
            }
            //设置自己的初始资金
            $own_money = $money->where('money_owner = "'.$userinfo['openid'].'" and money_from = "0"')->find();
            if ($own_money) {
                $this->assign('is_get_money', 1);
            } else {
                $data = array('money_owner'=>$userinfo['openid'], 'money_number'=>$setinfo['set_beginmoney'], 'money_from'=>'0', 'money_time'=>date('Y-m-d H:i:s'));
                $own_money_result = $money->add($data);
                if ($own_money_result) {
                    $user->where('user_id = "'.$userinfo['openid'].'"')->setInc('user_money', $setinfo['set_beginmoney']);
                }
                $this->assign('is_get_money', 0);
            }
            //得到我从别人那里分享来的资金
            $my_get_money = $money->where('money_owner = "'.$userinfo['openid'].'" and money_from != "0"')->select();
            foreach ($my_get_money as $my_money) {
                $usermoneyinfo = $user->where('user_id = "'.$my_money['money_from'].'"')->find();
                $my_money = array_merge($my_money, $usermoneyinfo);
                $my_money_list[] = $my_money;
            }
            //得到我的总金额
            $wxuser = $user->where('user_id = "'.$userinfo['openid'].'"')->find();
            $totel_money = $wxuser['user_money'];
        }
        //给分享给我的人加钱
        if ($parent && $parent != $userinfo['openid']) {
            $wxmoney = $money->where('money_owner = "'.$parent.'" and money_from = "'.$userinfo['openid'].'"')->find();
            if (!$wxmoney) {
//                $share_money = rand(1, $setinfo['set_sharemoney']);
                $share_money = 0.1;
                $data = array('money_owner'=>$parent, 'money_number'=>$share_money, 'money_from'=>$userinfo['openid'], 'money_time'=>date('Y-m-d H:i:s'));
                $money_result = $money->add($data);
                if ($money_result) {
                    $user->where('user_id = "'.$parent.'"')->setInc('user_money', $share_money);
                }
            }
        }
        $this->assign('my_money_list', $my_money_list);
        $this->assign('userinfo', $userinfo);
        $this->assign('setinfo', $setinfo);
        $this->assign('totel_money', $totel_money);
        
        $this->assign('parentid', $parent);
        $this->assign('code', $code);
        $this->display();
    }

    public function eventAction() {
        $fromUserName = I('post.fromUserName');
        $nickname = I('post.nickname');
        $headimgurl = I('post.headimgurl');
        $eventType = I('post.eventType');
        $user = M('user');
        if ($eventType == 'subscribe') {
            $status = '1';
        } else {
            $status = '0';
        }
        $userinfo = $user->where('user_id = "'.$fromUserName.'"')->find();
        if ($userinfo) {
            $result = $user->where('user_id = "'.$fromUserName.'"')->setField('user_status', $status);
        } else {
            $data = array('user_id'=>$fromUserName, 'user_name'=>$nickname, 'user_regdate'=>date('Y-m-d H:i:s'), 'user_image'=>$headimgurl, 'user_status'=>$status);
            $result = $user->add($data);
        }
        return '关注成功';
    }
    
    public function tixianAction() {
        $openid = I('get.openid');
        $setting = M("setting");
        $setinfo = $setting->where('set_id = 1')->find();
        $untildate = strtotime($setinfo['set_untildate']);
        $now = time();
        if ($now > $untildate) {
            $this->error('啊呀，你来迟了，哈蓝女神被人捋走了，一个不剩（不气馁，下期可累积继续）');
        }
        $user = M('user');
        $wxuser = $user->where('user_id = "'.$openid.'"')->find();
        if ($wxuser['user_money'] < $setinfo['set_getmoney']) {
            $this->error($setinfo['set_getmoney']."都没有，还想泡哈蓝女神？快去赚吧！（第一波2015.1.12~1.19）");
        }
        $this->assign('totel_money', $wxuser['user_money']);
        $this->assign('setinfo', $setinfo);
        $this->assign('openid', $openid);
        $this->display();
    }

    public function savetxAction() {
        $post = filterAllParam('post');

        $setting = M("setting");
        $setinfo = $setting->where('set_id = 1')->find();
        $user = M('user');
        $wxuser = $user->where('user_id = "'.$post['tx_userid'].'"')->find();
        if (!$wxuser) {
            $this->error('未知用户');
        }
        if ($wxuser['user_money'] < $setinfo['set_getmoney']) {
            $this->error("您账户金额小于可提现金额，账户金额大于".$setinfo['set_getmoney'].'时可提现');
        }
        if ($post['tx_number'] > $wxuser['user_money']) {
            $this->error('您输入的金额大于你账户拥有的资金');
        }

        $tixian = M("tixian");
        unset($post['tx_card2']);
        unset($post['totel_money']);
        $post['tx_date'] = date('Y-m-d H:i:s');
        $isok = $tixian->add($post);
        if ($isok) {
            $user->where('user_id = "'.$post['tx_userid'].'"')->setDec('user_money', $post['tx_number']);
            $this->success('提现成功', U('index/index'));
        } else {
            $this->error("提现失败");
        }
    }
}
