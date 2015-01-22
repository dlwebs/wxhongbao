<?php
namespace Admin\Controller;

class IndexController extends BaseController {

    public function picAction() {
        $userobj = M("user");
        $count = $userobj->where('user_image != ""')->count();
        $page = new \Think\Page($count, 1000);
        $userlist = $userobj->field('user_name, user_image')->where('user_image != ""')->order('user_regdate desc')->limit($page->firstRow.','.$page->listRows)->select();
        $show = $page->show();
        $this->assign('page',$show);
        $this->assign('userlist', $userlist);
        $this->display();
    }

    public function indexAction(){
        $this->display();
    }

    public function loginAction() {
        $this->display();
    }

    public function dologinAction(){
        $userobj = M("user");
        $user_pw = I('post.user_pw');
        $data['user_id'] = I('post.user_id');
        $data['user_pw'] = md5($user_pw);
        $data['user_status'] = 1;
        $userInfo = $userobj->field('user_pw', true)->where($data)->find();
        if(!empty($userInfo)){
            session('userinfo', $userInfo);
            $this->success('登录成功', 'index');
        } else {
            $this->error('登录失败', 'login');
        }
    }

    public function logoutAction() {
        $userInfo = session('userinfo');
        if(!empty($userInfo)){
            session('userinfo', null);
        }
        $this->redirect('Index/login');
    }

    public function weixinAction() {
        if (!$_SESSION['access_token']) {
                $appid = 'wx746191c3d2d0ebd7';
                $appsecret = 'a4e835f6b20748fba46a827017cc835a';
                $access_token_url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='.$appid.'&secret='.$appsecret;
                $access_token_result = file_get_contents($access_token_url);
                $access_token_result = json_decode($access_token_result);
                $_SESSION['access_token'] = $access_token_result->access_token;
            }
            
            $underbar_url = 'https://api.weixin.qq.com/cgi-bin/menu/create?access_token='.$_SESSION['access_token'];
//            $underbar_content = array('button' => array(array('type'=>'click', 'name'=>'最近吃啥', 'key'=>'ws_zjcs'), array('type'=>'click', 'name'=>'节目汇编', 'key'=>'ws_jmhb'), array('name'=>'精选', 'sub_button'=>array(array('type'=>'click', 'name'=>'精选商品', 'key'=>'ws_jxsp'), array('type'=>'click', 'name'=>'精选活动', 'key'=>'ws_jxhd')))));
            $underbar_content = '{
                                                            "button":[
                                                            {	
                                                                 "type":"click",
                                                                 "name":"最近吃啥",
                                                                 "key":"ws_zjcs"
                                                             },
                                                             {	
                                                                 "type":"click",
                                                                 "name":"节目汇编",
                                                                 "key":"ws_jmhb"
                                                             },
                                                             {
                                                                  "name":"精选",
                                                                  "sub_button":[
                                                                  {
                                                                      "type":"click",
                                                                      "name":"精选商品",
                                                                      "key":"ws_jxsp"
                                                                   },
                                                                   {
                                                                      "type":"click",
                                                                      "name":"精选活动",
                                                                      "key":"ws_jxhd"
                                                                   }]
                                                              }]
                                                        }
                                                       ';

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $underbar_url);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $underbar_content);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_HEADER, 0);
            $item_str = curl_exec($ch);
            curl_close($ch);
            echo $item_str;exit;
    }
}